#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..', '..');
const BIN = path.join(ROOT, 'bin', 'yida.js');
const TERMINAL_BUILD_STATES = new Set(['SUCCESS', 'FAIL']);

function resolveConfig(env = process.env) {
  const config = {
    enabled: env.OPENYIDA_E2E === '1' && env.OPENYIDA_AGGREGATE_E2E === '1',
    owned: env.OPENYIDA_AGGREGATE_E2E_OWNED === '1',
    corpId: env.OPENYIDA_AGGREGATE_E2E_CORP_ID || '',
    appType: env.OPENYIDA_AGGREGATE_E2E_APP_TYPE || '',
    formUuid: env.OPENYIDA_AGGREGATE_E2E_FORM_UUID || '',
    designFixture: env.OPENYIDA_AGGREGATE_E2E_DESIGN_FIXTURE || '',
    runtimeQueryConfirmed: env.OPENYIDA_AGGREGATE_RUNTIME_QUERY_CONFIRMED === '1',
    maxStatusPolls: Number(env.OPENYIDA_AGGREGATE_STATUS_POLLS || 12),
    statusPollMs: Number(env.OPENYIDA_AGGREGATE_STATUS_POLL_MS || 5000),
  };
  const missing = [];
  if (!config.owned) { missing.push('OPENYIDA_AGGREGATE_E2E_OWNED=1'); }
  if (!config.corpId) { missing.push('OPENYIDA_AGGREGATE_E2E_CORP_ID'); }
  if (!config.appType) { missing.push('OPENYIDA_AGGREGATE_E2E_APP_TYPE'); }
  if (!config.formUuid) { missing.push('OPENYIDA_AGGREGATE_E2E_FORM_UUID'); }
  if (!config.designFixture) { missing.push('OPENYIDA_AGGREGATE_E2E_DESIGN_FIXTURE'); }
  return { config, missing };
}

function buildCommandPlan(config) {
  return [
    { stage: 'auth', args: ['login', '--check-only', '--json', '--corp-id', config.corpId], mutates: false },
    { stage: 'inspect', args: ['aggregate-table', 'inspect', config.appType, config.formUuid, '--json'], mutates: false },
    { stage: 'preview', args: ['aggregate-table', 'preview', config.appType, config.formUuid, config.designFixture, '--json'], mutates: false },
    { stage: 'save', args: ['aggregate-table', 'save', config.appType, config.formUuid, config.designFixture, '--json', '--no-open'], mutates: true },
    { stage: 'publish', args: ['aggregate-table', 'publish', config.appType, config.formUuid, config.designFixture, '--json', '--no-open'], mutates: true },
    { stage: 'build', args: ['aggregate-table', 'status', config.appType, config.formUuid, '--json'], mutates: false },
  ];
}

function runCli(args, timeoutMs = 30000) {
  const result = spawnSync(process.execPath, [BIN, ...args, '--quiet'], {
    cwd: ROOT,
    encoding: 'utf8',
    env: {
      ...process.env,
      CI: '1',
      OPENYIDA_SKIP_UPDATE_CHECK: '1',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: timeoutMs,
  });
  return {
    status: result.status,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function parseCliJson(result, stage) {
  if (!result || result.status !== 0) {
    throw new Error(`${stage} failed: exit=${result && result.status}; ${result && result.stderr}`);
  }
  if (result.json !== undefined) { return result.json; }
  try {
    return JSON.parse(result.stdout);
  } catch (error) {
    throw new Error(`${stage} returned invalid JSON: ${error.message}`);
  }
}

function assertRevisionStage(stage, payload, expectedAxis) {
  if (!payload || payload.readbackVerified !== true || payload.revisionAxis !== expectedAxis ||
      payload.revision === undefined || payload.revision === null ||
      !['response', 'readback'].includes(payload.revisionSource)) {
    throw new Error(`${stage} did not prove ${expectedAxis} advancement`);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run(options = {}) {
  const env = options.env || process.env;
  const resolved = resolveConfig(env);
  if (!resolved.config.enabled) {
    return {
      skipped: true,
      reason: 'Set OPENYIDA_E2E=1 and OPENYIDA_AGGREGATE_E2E=1 to run.',
      remoteWrites: 0,
    };
  }
  if (resolved.missing.length > 0) {
    return {
      skipped: false,
      status: 'PLATFORM_PROBE_REQUIRED',
      missing: resolved.missing,
      remoteWrites: 0,
    };
  }

  const config = resolved.config;
  const readDesignFixture = options.readDesignFixture || function(file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  };
  readDesignFixture(config.designFixture);

  const execute = options.runCli || runCli;
  const wait = options.delay || delay;
  const plan = buildCommandPlan(config);
  const evidence = [];

  for (const step of plan.slice(0, 5)) {
    const payload = parseCliJson(execute(step.args), step.stage);
    evidence.push({ stage: step.stage, payload });
    if (step.stage === 'save') {
      assertRevisionStage(step.stage, payload, 'stashGmtModified');
    }
    if (step.stage === 'publish') {
      assertRevisionStage(step.stage, payload, 'gmtModified');
    }
  }

  let buildPayload = null;
  for (let attempt = 0; attempt < config.maxStatusPolls; attempt++) {
    buildPayload = parseCliJson(execute(plan[5].args), 'build');
    evidence.push({ stage: 'build', attempt: attempt + 1, payload: buildPayload });
    if (TERMINAL_BUILD_STATES.has(buildPayload.status)) { break; }
    await wait(config.statusPollMs);
  }
  if (!buildPayload || !TERMINAL_BUILD_STATES.has(buildPayload.status)) {
    throw new Error('aggregate build did not reach a terminal state within the bounded poll window');
  }
  if (buildPayload.status !== 'SUCCESS') {
    throw new Error(`aggregate build failed: ${JSON.stringify(buildPayload.result || buildPayload)}`);
  }

  let runtime;
  if (config.runtimeQueryConfirmed) {
    const args = ['data', 'query', 'form', config.appType, config.formUuid, '--size', '1', '--json'];
    runtime = { status: 'verified', payload: parseCliJson(execute(args), 'runtime') };
  } else {
    runtime = {
      status: 'PLATFORM_PROBE_REQUIRED',
      reason: 'Published virtualView runtime query contract is not fixed-front-end proven.',
    };
  }

  const cleanup = {
    status: 'cleanup_blocked',
    reason: 'remote_cleanup_unsupported',
    resource: {
      owned: true,
      corpId: config.corpId,
      appType: config.appType,
      formUuid: config.formUuid,
    },
  };

  return {
    skipped: false,
    status: runtime.status === 'verified' ? 'cleanup_blocked' : 'PLATFORM_PROBE_REQUIRED',
    remoteWrites: 2,
    evidence,
    runtime,
    cleanup,
  };
}

if (require.main === module) {
  run().then((result) => {
    console.log(JSON.stringify(result, null, 2));
    if (!result.skipped && result.status !== 'verified') {
      process.exitCode = 2;
    }
  }).catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  TERMINAL_BUILD_STATES,
  assertRevisionStage,
  buildCommandPlan,
  parseCliJson,
  resolveConfig,
  run,
};
