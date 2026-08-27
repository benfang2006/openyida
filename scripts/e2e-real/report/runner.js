#!/usr/bin/env node

'use strict';

const REPORT_E2E_CASES = Object.freeze([
  Object.freeze({ id: 'platform-create-append-inspect', package: 'platform', effects: 'remote_write_then_readback' }),
  Object.freeze({ id: 'runtime-binding-query', package: 'runtime', effects: 'remote_read' }),
  Object.freeze({ id: 'ui-report-render', package: 'ui', effects: 'browser_read' }),
]);

function missingFlags(env, flags) {
  return flags.filter(flag => {
    const [name, expected] = flag.split('=');
    return env[name] !== expected;
  });
}

function probeReportE2EPackages(options = {}) {
  const env = options.env || process.env;
  const hasPlaywright = options.hasPlaywright === true;
  const shared = ['OPENYIDA_E2E=1', 'OPENYIDA_E2E_REPORT=1'];
  const platformMissing = missingFlags(env, shared);
  const runtimeMissing = missingFlags(env, [...shared, 'OPENYIDA_E2E_REPORT_RUNTIME=1']);
  const uiMissing = missingFlags(env, [...shared, 'OPENYIDA_E2E_REPORT_UI=1']);
  if (!hasPlaywright) {uiMissing.push('playwright');}
  const packages = {
    platform: { ready: platformMissing.length === 0, missing: platformMissing },
    runtime: { ready: runtimeMissing.length === 0, missing: runtimeMissing },
    ui: { ready: uiMissing.length === 0, missing: uiMissing },
  };
  return {
    enabled: Object.values(packages).every(entry => entry.ready),
    packages,
  };
}

function requireAdapter(options, name) {
  if (typeof options[name] !== 'function') {
    const error = new Error(`report E2E adapter is required: ${name}`);
    error.code = 'REPORT_E2E_ADAPTER_REQUIRED';
    throw error;
  }
  return options[name];
}

function runtimeBinding(inspectResult) {
  const component = inspectResult && Array.isArray(inspectResult.components)
    ? inspectResult.components.find(entry => entry.cid && entry.dataSetKeys && entry.dataSetKeys.length > 0)
    : null;
  if (!component) {
    const error = new Error('report inspect returned no runtime-queryable component');
    error.code = 'REPORT_E2E_BINDING_MISSING';
    throw error;
  }
  return {
    reportId: inspectResult.reportId,
    cid: component.cid,
    componentName: component.componentName || null,
    dataSetKey: component.dataSetKeys[0],
    filterKey: Array.isArray(component.filterKeys) && component.filterKeys.length > 0
      ? component.filterKeys[0]
      : null,
  };
}

async function run(options = {}) {
  const config = options.config || {};
  const packages = Array.isArray(config.packages) ? config.packages : ['platform'];
  if (!config.appType || !config.reportTitle || !Array.isArray(config.charts) || !Array.isArray(config.appendCharts)) {
    const error = new Error('report E2E config requires appType, reportTitle, charts, and appendCharts');
    error.code = 'REPORT_E2E_CONFIG_INVALID';
    throw error;
  }

  const createReport = requireAdapter(options, 'createReport');
  const inspectReport = requireAdapter(options, 'inspectReport');
  const appendChart = requireAdapter(options, 'appendChart');
  const cases = [];

  const created = await createReport(config);
  if (!created || !created.reportId) {
    const error = new Error('create-report returned no reportId');
    error.code = 'REPORT_E2E_IDENTITY_MISSING';
    throw error;
  }
  const before = await inspectReport({ appType: config.appType, reportId: created.reportId });
  await appendChart({ ...config, reportId: created.reportId });
  const after = await inspectReport({ appType: config.appType, reportId: created.reportId });
  if (!Number.isFinite(before.revision) || !Number.isFinite(after.revision) || after.revision <= before.revision) {
    const error = new Error('report append did not produce a newer inspect revision');
    error.code = 'REPORT_E2E_REVISION_NOT_ADVANCED';
    throw error;
  }
  cases.push({ id: 'platform-create-append-inspect', package: 'platform', status: 'passed' });

  const binding = runtimeBinding(after);
  if (packages.includes('runtime')) {
    const queryRuntime = requireAdapter(options, 'queryRuntime');
    const runtime = await queryRuntime({
      appType: config.appType,
      reportId: created.reportId,
      binding,
    });
    if (!runtime || !Array.isArray(runtime.rows)) {
      const error = new Error('report runtime query returned no rows array');
      error.code = 'REPORT_E2E_RUNTIME_INVALID';
      throw error;
    }
    cases.push({ id: 'runtime-binding-query', package: 'runtime', status: 'passed' });
  }

  if (packages.includes('ui')) {
    const verifyUi = requireAdapter(options, 'verifyUi');
    const ui = await verifyUi({
      appType: config.appType,
      reportId: created.reportId,
      reportUrl: created.url,
      binding,
    });
    if (!ui || ui.visible !== true) {
      const error = new Error('report UI did not prove a visible runtime state');
      error.code = 'REPORT_E2E_UI_NOT_VISIBLE';
      throw error;
    }
    cases.push({ id: 'ui-report-render', package: 'ui', status: 'passed' });
  }

  return {
    status: 'passed',
    reportId: created.reportId,
    binding,
    cases,
  };
}

function detectPlaywright() {
  try {
    require.resolve('playwright');
    return true;
  } catch {
    return false;
  }
}

if (require.main === module) {
  const probe = probeReportE2EPackages({ env: process.env, hasPlaywright: detectPlaywright() });
  console.log(JSON.stringify({
    runner: 'report-domain-e2e',
    cases: REPORT_E2E_CASES,
    probe,
    sharedFullRunnerWired: false,
  }, null, 2));
}

module.exports = Object.freeze({
  REPORT_E2E_CASES,
  probeReportE2EPackages,
  run,
  runtimeBinding,
});
