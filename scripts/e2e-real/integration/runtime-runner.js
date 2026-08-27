'use strict';

const { CliError } = require('../../../lib/core/cli-error');
const { RUNTIME_CASES, verifyRuntimeObservation } = require('./runtime-contracts');

function runtimeError(code, message, details = {}) {
  return new CliError(message, { code, details });
}

function assertAdapter(adapter) {
  const requiredMethods = ['prepare', 'trigger', 'readback', 'cleanup'];
  const missingMethods = requiredMethods.filter((method) => !adapter || typeof adapter[method] !== 'function');
  if (missingMethods.length > 0) {
    throw runtimeError('PLATFORM_PROBE_REQUIRED', 'Integration runtime adapter is not configured.', {
      remoteWrites: 0,
      requiredAdapterMethods: requiredMethods,
      missingAdapterMethods: missingMethods,
    });
  }
}

async function runRuntimeCases(options = {}) {
  const adapter = options.adapter;
  assertAdapter(adapter);
  const runtimeCases = options.cases || RUNTIME_CASES;
  const results = [];
  for (const runtimeCase of runtimeCases) {
    let context;
    let primaryError = null;
    try {
      context = await adapter.prepare(runtimeCase);
      if (!context || context.ownershipVerified !== true || !context.correlationMarker) {
        throw runtimeError(
          'INTEGRATION_RUNTIME_OWNERSHIP_UNVERIFIED',
          `Integration runtime ownership is unverified: ${runtimeCase.id}`,
          { caseId: runtimeCase.id, remoteWrites: 0 }
        );
      }
      const triggerResult = await adapter.trigger(runtimeCase, context);
      if (!triggerResult || triggerResult.accepted !== true) {
        throw runtimeError(
          'INTEGRATION_RUNTIME_TRIGGER_REJECTED',
          `Integration runtime trigger was not accepted: ${runtimeCase.id}`,
          { caseId: runtimeCase.id }
        );
      }
      const observation = await adapter.readback(runtimeCase, context, triggerResult);
      const verification = verifyRuntimeObservation(runtimeCase.id, observation);
      if (!verification.valid) {
        throw runtimeError('INTEGRATION_RUNTIME_CONTRACT_FAILED', `Integration runtime contract failed: ${runtimeCase.id}`, {
          caseId: runtimeCase.id,
          requiredReadbacks: runtimeCase.requiredReadbacks,
          errors: verification.errors,
        });
      }
      results.push({
        id: runtimeCase.id,
        nodeType: runtimeCase.nodeType,
        correlationMarker: context.correlationMarker,
        verificationLevel: verification.verificationLevel,
      });
    } catch (error) {
      primaryError = error;
      throw error;
    } finally {
      if (context) {
        try {
          await adapter.cleanup(runtimeCase, context);
        } catch (cleanupError) {
          if (!primaryError) {
            throw runtimeError(
              'INTEGRATION_RUNTIME_CLEANUP_FAILED',
              `Integration runtime cleanup failed: ${runtimeCase.id}`,
              { caseId: runtimeCase.id, cause: cleanupError.message }
            );
          }
        }
      }
    }
  }
  return {
    status: 'passed',
    verificationLevel: 'REAL_RUNTIME_OBSERVED',
    cases: results,
  };
}

if (require.main === module) {
  runRuntimeCases().catch((error) => {
    process.stderr.write(`${error.code || 'ERROR'}: ${error.message}\n`);
    process.exitCode = error.exitCode || 1;
  });
}

module.exports = { assertAdapter, runRuntimeCases };
