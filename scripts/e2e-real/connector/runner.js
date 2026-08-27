#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { isDeepStrictEqual } = require('util');
const { isPathInside, ownershipResult } = require('../cleanup');
const { redactString } = require('../../../lib/core/redact');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BIN = path.join(ROOT, 'bin', 'yida.js');
const DEFAULT_REGISTRY_DIR = path.join(ROOT, 'project', '.cache', 'e2e-real', 'connector');

function writeRegistry(registryPath, registry) {
  fs.mkdirSync(path.dirname(registryPath), { recursive: true });
  fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
}

function createRegistry(config) {
  const registry = {
    runId: config.prefix,
    startedAt: new Date().toISOString(),
    status: 'running',
    targetCorpId: config.corpId || null,
    resources: [],
    commands: [],
  };
  const registryPath = path.join(config.registryDir, `${config.prefix}.json`);
  writeRegistry(registryPath, registry);
  return { registry, registryPath };
}

function addResource(registry, registryPath, resource) {
  registry.resources.push({ createdAt: new Date().toISOString(), ...resource });
  writeRegistry(registryPath, registry);
}

function nowStamp(date = new Date()) {
  return date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
}

function getConfig(env = process.env, date = new Date()) {
  const prefix = env.OPENYIDA_E2E_CONNECTOR_PREFIX || `OY_E2E_CONNECTOR_${nowStamp(date)}`;
  const missing = [];
  if (env.OPENYIDA_E2E !== '1') {missing.push('OPENYIDA_E2E=1');}
  if (env.OPENYIDA_E2E_CONNECTOR !== '1') {missing.push('OPENYIDA_E2E_CONNECTOR=1');}
  return {
    enabled: missing.length === 0,
    missing,
    prefix,
    connectorName: `${prefix}__Connector`,
    connectionName: `${prefix}__Account`,
    echoBaseUrl: env.OPENYIDA_E2E_CONNECTOR_ECHO_URL || 'https://httpbin.org',
    registryDir: env.OPENYIDA_E2E_REGISTRY_DIR || DEFAULT_REGISTRY_DIR,
    corpId: env.OPENYIDA_E2E_CORP_ID || null,
  };
}

function buildEchoOperation() {
  return {
    id: 'operation-openyida_echo',
    operationId: 'openyida_echo',
    summary: 'OpenYida deterministic echo',
    description: 'Echoes a synthetic run marker and Basic auth header for connector runtime verification.',
    url: 'anything/openyida-echo',
    method: 'post',
    inputs: [
      {
        name: 'Query',
        paramType: 'Object',
        paramLocation: 'query',
        childList: [{ name: 'runId', paramType: 'String', paramLocation: 'query', childList: [], children: [] }],
      },
      {
        name: 'Body',
        paramType: 'Object',
        paramLocation: 'body',
        childList: [
          { name: 'runId', paramType: 'String', paramLocation: 'body', childList: [], children: [] },
          { name: 'owned', paramType: 'Boolean', paramLocation: 'body', childList: [], children: [] },
        ],
      },
    ],
    parameters: {
      header: [],
      query: [{ name: 'runId', value: '' }],
      body: { default: '{"runId":"","owned":true}' },
    },
    responses: { type: 'object', properties: {} },
    outputs: [{ defaultValue: '{}', desc: 'Response body', name: 'Response', paramType: 'Object', required: false, childList: [] }],
    origin: true,
  };
}

function runCli(args, env = process.env) {
  const result = spawnSync(process.execPath, [BIN, ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...env, OPENYIDA_LANG: 'zh', CI: '1' },
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 120000,
  });
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  if (result.status !== 0) {
    throw new Error(redactString((stderr.trim() || stdout.trim()).slice(0, 1600)));
  }
  const lines = stdout.split('\n').map(line => line.trim()).filter(Boolean);
  let json = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    try {json = JSON.parse(lines[i]); break;} catch { /* keep scanning */ }
  }
  return { stdout, stderr, json };
}

function writeOperations(config, operations) {
  const runDir = path.join(config.registryDir, config.prefix);
  fs.mkdirSync(runDir, { recursive: true });
  const filePath = path.join(runDir, 'operations.json');
  fs.writeFileSync(filePath, `${JSON.stringify(operations, null, 2)}\n`, 'utf8');
  return filePath;
}

function requireResult(step, result) {
  if (!result || !result.json || result.json.success === false || result.json.status === 'error') {
    throw new Error(`${step} did not return a successful JSON contract.`);
  }
  return result.json;
}

function redactRecordedArgs(args) {
  const redacted = args.slice();
  for (let i = 0; i < redacted.length; i++) {
    if (['--username', '--password', '--api-key', '--app-key', '--app-secret', '--app-code'].includes(redacted[i])) {
      if (i + 1 < redacted.length) {redacted[i + 1] = '<redacted>';}
    }
  }
  return redacted;
}

function cleanupOwnedConnectorResources(options) {
  const removed = [];
  const residual = [];
  const skipped = [];
  const removePath = options.removePath || (targetPath => fs.rmSync(targetPath, { recursive: true, force: true }));
  for (const resource of (options.resources || []).slice().reverse()) {
    const ownership = ownershipResult(resource, {
      runId: options.runId,
      namePrefix: options.namePrefix,
    });
    if (!ownership.owned) {
      skipped.push({ resource, reason: ownership.reason });
      continue;
    }
    if (resource.type === 'local-artifact') {
      const targetPath = resource.path || resource.exactId;
      if (!options.localRoot || !targetPath || !isPathInside(options.localRoot, targetPath)) {
        skipped.push({ resource, reason: 'local_path_outside_run_root' });
        continue;
      }
      removePath(targetPath);
      removed.push({ resource, path: targetPath });
      continue;
    }
    residual.push({ resource, reason: 'remote_cleanup_unsupported' });
  }
  return {
    status: residual.length || skipped.some(item => item.reason !== 'different_run')
      ? 'cleanup_blocked'
      : 'passed',
    removed,
    residual,
    skipped,
    deleteCommands: [],
  };
}

async function run(options = {}) {
  const env = options.env || process.env;
  const config = options.config || getConfig(env);
  if (!config.enabled) {
    console.log(`Skipping connector real E2E; missing: ${config.missing.join(', ')}`);
    return { skipped: true, missing: config.missing };
  }
  const executeCli = options.runCli || runCli;
  const registryFactory = options.createRegistry || createRegistry;
  const persistRegistry = options.writeRegistry || writeRegistry;
  const trackResource = options.addResource || addResource;
  const writeOperationsFile = options.writeOperations || writeOperations;
  const operation = options.operation || buildEchoOperation();
  const runtimeAuth = {
    username: 'openyida-e2e-user',
    password: `synthetic-${config.prefix}`,
  };
  const { registry, registryPath } = registryFactory(config);
  registry.targetCorpId = config.corpId;

  function step(name, args) {
    const result = executeCli(args, env);
    registry.commands.push({ name, args: redactRecordedArgs(args), completedAt: new Date().toISOString() });
    persistRegistry(registryPath, registry);
    return result;
  }

  try {
    requireResult('login check', step('login', ['login', '--check-only', '--json']));
    const operationsPath = writeOperationsFile(config, [operation]);
    trackResource(registry, registryPath, {
      type: 'local-artifact', runId: config.prefix, owned: true,
      name: `${config.prefix}__Operations`, exactId: operationsPath, path: operationsPath,
    });
    const created = requireResult('connector create', step('connector-create', [
      'connector', 'create', config.connectorName, config.echoBaseUrl,
      '--auth', '基本身份验证', '--username', runtimeAuth.username, '--password', runtimeAuth.password,
      '--operations', operationsPath, '--json',
    ]));
    if (!created.connectorId || !created.connectorName || created.readbackVerified !== true) {
      throw new Error('connector create did not return a verified owned identity.');
    }
    trackResource(registry, registryPath, {
      type: 'connector', runId: config.prefix, owned: true, name: config.connectorName,
      exactId: String(created.connectorId), connectorName: created.connectorName,
    });

    const connection = requireResult('connection create', step('connector-create-connection', [
      'connector', 'create-connection', String(created.connectorId), config.connectionName,
      '--username', runtimeAuth.username, '--password', runtimeAuth.password, '--json',
    ]));
    if (!connection.connectionId || connection.readbackVerified !== true) {
      throw new Error('connection create did not return a verified owned identity.');
    }
    trackResource(registry, registryPath, {
      type: 'connection', runId: config.prefix, owned: true, name: config.connectionName,
      exactId: String(connection.connectionId), connectorName: created.connectorName,
    });

    const before = requireResult('action readback before test', step('connector-list-actions-before', [
      'connector', 'list-actions', String(created.connectorId), '--json',
    ])).operations;
    if (!Array.isArray(before) || before.length !== 1 || !isDeepStrictEqual(before[0], operation)) {
      throw new Error('connector action readback did not match the deterministic fixture before test.');
    }
    const markerBody = JSON.stringify({ runId: config.prefix, owned: true });
    const tested = requireResult('connector test', step('connector-test', [
      'connector', 'test', '--connector-id', String(created.connectorId), '--action', operation.operationId,
      '--account-id', String(connection.connectionId), '--path-json', '{}',
      '--query-json', JSON.stringify({ runId: config.prefix }), '--header-json', '{}',
      '--body-json', markerBody, '--json',
    ]));
    const testedContent = tested.content && typeof tested.content === 'object'
      ? JSON.stringify(tested.content)
      : String(tested.content || '');
    if (!String(tested.statusLine || '').match(/^HTTP\/\d(?:\.\d)?\s+2\d\d\b/) ||
        !testedContent.includes(config.prefix) ||
        !/Basic\s+\*\*\*/i.test(testedContent)) {
      throw new Error('connector test did not prove the echo marker and auth runtime contract.');
    }
    const after = requireResult('action readback after test', step('connector-list-actions-after', [
      'connector', 'list-actions', String(created.connectorId), '--json',
    ])).operations;
    if (!isDeepStrictEqual(after, before)) {
      throw new Error('connector test mutated the persisted action definition.');
    }

    registry.cleanup = cleanupOwnedConnectorResources({
      runId: config.prefix,
      namePrefix: `${config.prefix}__`,
      resources: registry.resources,
      localRoot: path.join(config.registryDir, config.prefix),
      removePath: options.removePath,
    });
    registry.status = registry.cleanup.status;
    registry.finishedAt = new Date().toISOString();
    persistRegistry(registryPath, registry);
    return { skipped: false, registryPath, registry };
  } catch (error) {
    try {
      registry.cleanup = cleanupOwnedConnectorResources({
        runId: config.prefix,
        namePrefix: `${config.prefix}__`,
        resources: registry.resources,
        localRoot: path.join(config.registryDir, config.prefix),
        removePath: options.removePath,
      });
    } catch (cleanupError) {
      registry.cleanup = { status: 'cleanup_failed', error: redactString(cleanupError.message) };
    }
    registry.status = 'failed';
    registry.finishedAt = new Date().toISOString();
    registry.error = redactString(error.message);
    persistRegistry(registryPath, registry);
    throw error;
  }
}

if (require.main === module) {
  run().catch(error => {
    console.error(redactString(error.message));
    process.exit(1);
  });
}

module.exports = {
  buildEchoOperation,
  cleanupOwnedConnectorResources,
  getConfig,
  run,
  runCli,
  writeOperations,
};
