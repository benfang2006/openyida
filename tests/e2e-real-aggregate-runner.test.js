'use strict';

const {
  assertRevisionStage,
  buildCommandPlan,
  resolveConfig,
  run,
} = require('../scripts/e2e-real/aggregate/runner');

function buildEnv(overrides = {}) {
  return {
    OPENYIDA_E2E: '1',
    OPENYIDA_AGGREGATE_E2E: '1',
    OPENYIDA_AGGREGATE_E2E_OWNED: '1',
    OPENYIDA_AGGREGATE_E2E_CORP_ID: 'corp-1',
    OPENYIDA_AGGREGATE_E2E_APP_TYPE: 'APP-1',
    OPENYIDA_AGGREGATE_E2E_FORM_UUID: 'FORM-VIEW',
    OPENYIDA_AGGREGATE_E2E_DESIGN_FIXTURE: '/external/aggregate-design.json',
    OPENYIDA_AGGREGATE_STATUS_POLL_MS: '0',
    ...overrides,
  };
}

describe('aggregate domain real E2E runner', () => {
  test('fails closed with zero writes until ownership and exact platform context are explicit', () => {
    const resolved = resolveConfig({
      OPENYIDA_E2E: '1',
      OPENYIDA_AGGREGATE_E2E: '1',
    });

    expect(resolved.missing).toEqual(expect.arrayContaining([
      'OPENYIDA_AGGREGATE_E2E_OWNED=1',
      'OPENYIDA_AGGREGATE_E2E_CORP_ID',
      'OPENYIDA_AGGREGATE_E2E_APP_TYPE',
      'OPENYIDA_AGGREGATE_E2E_FORM_UUID',
      'OPENYIDA_AGGREGATE_E2E_DESIGN_FIXTURE',
    ]));
  });

  test('plans inspect, preview, save, publish, and build without shared full-runner wiring', () => {
    const { config } = resolveConfig(buildEnv());
    const plan = buildCommandPlan(config);

    expect(plan.map((step) => step.stage)).toEqual([
      'auth', 'inspect', 'preview', 'save', 'publish', 'build',
    ]);
    expect(plan.find((step) => step.stage === 'inspect').args).toContain('APP-1');
    expect(plan.filter((step) => step.mutates).map((step) => step.stage)).toEqual(['save', 'publish']);
  });

  test('requires action-specific revision proof from write output', () => {
    expect(() => assertRevisionStage('save', {
      readbackVerified: true,
      revisionAxis: 'stashGmtModified',
      revisionSource: 'readback',
      revision: 12,
      readbackRevision: 12,
    }, 'stashGmtModified')).not.toThrow();

    expect(() => assertRevisionStage('save', {
      readbackVerified: true,
      revisionAxis: 'gmtModified',
      revisionSource: 'readback',
      revision: 12,
      readbackRevision: 12,
    }, 'stashGmtModified')).toThrow(/stashGmtModified/);
  });

  test('returns explicit runtime and cleanup probe gaps after the deterministic platform stages', async () => {
    let statusCalls = 0;
    const result = await run({
      env: buildEnv(),
      readDesignFixture: () => ({}),
      delay: async () => {},
      runCli: (args) => {
        if (args[0] === 'aggregate-table' && args[1] === 'save') {
          return { status: 0, json: {
            readbackVerified: true,
            revisionAxis: 'stashGmtModified',
            revisionSource: 'readback',
            revision: 12,
            readbackRevision: 12,
          } };
        }
        if (args[0] === 'aggregate-table' && args[1] === 'publish') {
          return { status: 0, json: {
            readbackVerified: true,
            revisionAxis: 'gmtModified',
            revisionSource: 'readback',
            revision: 13,
            readbackRevision: 13,
          } };
        }
        if (args[0] === 'aggregate-table' && args[1] === 'status') {
          statusCalls += 1;
          return { status: 0, json: { status: statusCalls === 1 ? 'RUNNING' : 'SUCCESS' } };
        }
        return { status: 0, json: { success: true } };
      },
    });

    expect(result).toMatchObject({
      status: 'PLATFORM_PROBE_REQUIRED',
      remoteWrites: 2,
      runtime: { status: 'PLATFORM_PROBE_REQUIRED' },
      cleanup: { status: 'cleanup_blocked', reason: 'remote_cleanup_unsupported' },
    });
    expect(statusCalls).toBe(2);
  });
});
