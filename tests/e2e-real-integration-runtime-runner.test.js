'use strict';

const {
  RUNTIME_CASES,
  verifyRuntimeObservation,
} = require('../scripts/e2e-real/integration/runtime-contracts');
const { runRuntimeCases } = require('../scripts/e2e-real/integration/runtime-runner');

function passingObservation(runtimeCase) {
  return JSON.parse(JSON.stringify(runtimeCase.expectedObservation));
}

function createAdapter(overrides = {}) {
  return {
    prepare: jest.fn(async (runtimeCase) => ({
      ownershipVerified: true,
      correlationMarker: `OY_INT_${runtimeCase.id}`,
    })),
    trigger: jest.fn(async () => ({ accepted: true })),
    readback: jest.fn(async (runtimeCase) => passingObservation(runtimeCase)),
    cleanup: jest.fn(async () => {}),
    ...overrides,
  };
}

describe('integration domain runtime contracts', () => {
  test('covers every currently declared business node with deterministic real-readback assertions', () => {
    expect(RUNTIME_CASES.map((item) => item.nodeType).sort()).toEqual([
      'connector',
      'dataCreate',
      'dataRetrieve',
      'dataUpdate',
      'initiateApproval',
      'route',
      'sendMessage',
    ]);
    for (const runtimeCase of RUNTIME_CASES) {
      expect(runtimeCase.mutation).toEqual(expect.any(String));
      expect(runtimeCase.requiredReadbacks.length).toBeGreaterThan(0);
      expect(verifyRuntimeObservation(runtimeCase.id, passingObservation(runtimeCase))).toEqual({
        valid: true,
        errors: [],
        verificationLevel: 'REAL_RUNTIME_OBSERVED',
      });
    }
  });

  test.each(RUNTIME_CASES.map((item) => [item.id, item]))(
    'mutation for %s is rejected by the runtime contract',
    (_id, runtimeCase) => {
      const observation = passingObservation(runtimeCase);
      const firstKey = Object.keys(observation)[0];
      observation[firstKey] = typeof observation[firstKey] === 'boolean'
        ? !observation[firstKey]
        : '__mutated__';
      const result = verifyRuntimeObservation(runtimeCase.id, observation);
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: runtimeCase.errorCode, path: `$.${firstKey}` }),
      ]));
    }
  );

  test('runner executes owned prepare/trigger/readback/cleanup in order and returns verification-grade results', async () => {
    const calls = [];
    const adapter = createAdapter({
      prepare: jest.fn(async (runtimeCase) => {
        calls.push(`${runtimeCase.id}:prepare`);
        return { ownershipVerified: true, correlationMarker: `OY_INT_${runtimeCase.id}` };
      }),
      trigger: jest.fn(async (runtimeCase) => {
        calls.push(`${runtimeCase.id}:trigger`);
        return { accepted: true };
      }),
      readback: jest.fn(async (runtimeCase) => {
        calls.push(`${runtimeCase.id}:readback`);
        return passingObservation(runtimeCase);
      }),
      cleanup: jest.fn(async (runtimeCase) => {
        calls.push(`${runtimeCase.id}:cleanup`);
      }),
    });
    const result = await runRuntimeCases({ adapter });
    expect(result.status).toBe('passed');
    expect(result.verificationLevel).toBe('REAL_RUNTIME_OBSERVED');
    expect(result.cases).toHaveLength(RUNTIME_CASES.length);
    expect(adapter.trigger).toHaveBeenCalledTimes(RUNTIME_CASES.length);
    expect(adapter.readback).toHaveBeenCalledTimes(RUNTIME_CASES.length);
    expect(adapter.cleanup).toHaveBeenCalledTimes(RUNTIME_CASES.length);
    expect(calls.slice(0, 4)).toEqual([
      'integration-data-create:prepare',
      'integration-data-create:trigger',
      'integration-data-create:readback',
      'integration-data-create:cleanup',
    ]);
  });

  test('runner fails closed on the first runtime semantic mismatch and still cleans the owned fixture', async () => {
    const adapter = createAdapter({
      readback: jest.fn(async (runtimeCase) => {
        const observation = passingObservation(runtimeCase);
        if (runtimeCase.id === 'integration-data-update') {
          observation.updatedCount = 2;
        }
        return observation;
      }),
    });
    await expect(runRuntimeCases({ adapter })).rejects.toMatchObject({
      code: 'INTEGRATION_RUNTIME_CONTRACT_FAILED',
      details: expect.objectContaining({ caseId: 'integration-data-update' }),
    });
    expect(adapter.cleanup).toHaveBeenCalledTimes(3);
  });

  test('runner refuses to trigger when owned-resource proof or correlation marker is absent', async () => {
    const adapter = createAdapter({
      prepare: jest.fn(async () => ({ ownershipVerified: false, correlationMarker: '' })),
    });
    await expect(runRuntimeCases({ adapter })).rejects.toMatchObject({
      code: 'INTEGRATION_RUNTIME_OWNERSHIP_UNVERIFIED',
      details: expect.objectContaining({ remoteWrites: 0 }),
    });
    expect(adapter.trigger).not.toHaveBeenCalled();
    expect(adapter.readback).not.toHaveBeenCalled();
    expect(adapter.cleanup).toHaveBeenCalledTimes(1);
  });

  test('runner without the four-method real adapter stays PLATFORM_PROBE_REQUIRED with zero writes', async () => {
    await expect(runRuntimeCases({ adapter: { readback: jest.fn() } })).rejects.toMatchObject({
      code: 'PLATFORM_PROBE_REQUIRED',
      details: expect.objectContaining({ remoteWrites: 0 }),
    });
  });
});
