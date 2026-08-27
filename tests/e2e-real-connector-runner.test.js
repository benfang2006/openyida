'use strict';

const {
  buildEchoOperation,
  cleanupOwnedConnectorResources,
  getConfig,
  run,
} = require('../scripts/e2e-real/connector/runner');

describe('real connector E2E runner', () => {
  test('is opt-in and builds a deterministic echo fixture', () => {
    expect(getConfig({}, new Date('2026-08-27T00:00:00Z'))).toMatchObject({
      enabled: false,
      missing: ['OPENYIDA_E2E=1', 'OPENYIDA_E2E_CONNECTOR=1'],
      prefix: 'OY_E2E_CONNECTOR_20260827000000',
    });
    expect(buildEchoOperation()).toMatchObject({
      id: 'operation-openyida_echo',
      operationId: 'openyida_echo',
      method: 'post',
      url: 'anything/openyida-echo',
    });
  });

  test('runs login, creates auth runtime, tests without mutating the action, and re-reads it', async () => {
    const calls = [];
    const registry = { resources: [], commands: [] };
    const operation = buildEchoOperation();
    const result = await run({
      env: { OPENYIDA_E2E: '1', OPENYIDA_E2E_CONNECTOR: '1' },
      config: {
        enabled: true,
        missing: [],
        prefix: 'OY_E2E_CONNECTOR_TEST',
        connectorName: 'OY_E2E_CONNECTOR_TEST__Connector',
        connectionName: 'OY_E2E_CONNECTOR_TEST__Account',
        echoBaseUrl: 'https://httpbin.org',
        registryDir: '/tmp/connector-e2e-test',
      },
      operation,
      createRegistry: () => ({ registry, registryPath: '/tmp/connector-e2e-test/run.json' }),
      writeRegistry: () => {},
      addResource: (current, _path, resource) => current.resources.push(resource),
      runCli: (args) => {
        calls.push(args);
        const command = args.slice(0, 2).join(' ');
        if (command === 'connector create') {
          return { json: { success: true, connectorId: '101', connectorName: 'Http_owned', readbackVerified: true } };
        }
        if (command === 'connector create-connection') {
          return { json: { success: true, connectionId: '7', readbackVerified: true } };
        }
        if (command === 'connector list-actions') {
          return { json: { success: true, operations: [operation] } };
        }
        if (command === 'connector test') {
          return {
            json: {
              success: true,
              statusLine: 'HTTP/1.1 200 OK',
              content: '{"runId":"OY_E2E_CONNECTOR_TEST","Authorization":"Basic ***"}',
            },
          };
        }
        return { json: { success: true, status: 'ok' } };
      },
      writeOperations: () => '/tmp/connector-e2e-test/operations.json',
    });

    expect(result.registry.status).toBe('cleanup_blocked');
    expect(calls.map((args) => args.slice(0, 2).join(' '))).toEqual([
      'login --check-only',
      'connector create',
      'connector create-connection',
      'connector list-actions',
      'connector test',
      'connector list-actions',
    ]);
    expect(calls.filter((args) => args[0] === 'connector' && args[1] === 'test')[0])
      .toEqual(expect.arrayContaining(['--path-json', '{}', '--query-json', '{"runId":"OY_E2E_CONNECTOR_TEST"}', '--body-json', '{"runId":"OY_E2E_CONNECTOR_TEST","owned":true}']));
    expect(registry.resources.every((resource) => resource.owned === true)).toBe(true);
    expect(JSON.stringify(registry.commands)).not.toContain('openyida-e2e');
    expect(JSON.stringify(registry.commands)).toContain('<redacted>');
  });

  test('cleanup is owned-only and never guesses unsupported remote deletion', () => {
    const removed = [];
    const result = cleanupOwnedConnectorResources({
      runId: 'RUN',
      namePrefix: 'RUN__',
      localRoot: '/tmp/connector-e2e/RUN',
      removePath: targetPath => removed.push(targetPath),
      resources: [
        { type: 'local-artifact', runId: 'RUN', owned: true, name: 'RUN__Operations', path: '/tmp/connector-e2e/RUN/operations.json' },
        { type: 'connector', runId: 'RUN', owned: true, name: 'RUN__Connector', exactId: '101' },
        { type: 'connection', runId: 'OTHER', owned: true, name: 'OTHER__Account', exactId: '7' },
        { type: 'connector', runId: 'RUN', owned: false, name: 'RUN__Unowned', exactId: '999' },
      ],
    });

    expect(result.status).toBe('cleanup_blocked');
    expect(result.residual).toHaveLength(1);
    expect(result.skipped.map((item) => item.reason)).toEqual(['owned_flag_missing', 'different_run']);
    expect(result.removed).toHaveLength(1);
    expect(removed).toEqual(['/tmp/connector-e2e/RUN/operations.json']);
    expect(result.deleteCommands).toEqual([]);
  });
});
