'use strict';

const {
  REPORT_E2E_CASES,
  probeReportE2EPackages,
  run,
} = require('../scripts/e2e-real/report/runner');

describe('report domain E2E runner', () => {
  test('declares deterministic platform, runtime, and UI packages without shared full-runner wiring', () => {
    expect(REPORT_E2E_CASES.map(testCase => testCase.id)).toEqual([
      'platform-create-append-inspect',
      'runtime-binding-query',
      'ui-report-render',
    ]);
    expect(REPORT_E2E_CASES.map(testCase => testCase.package)).toEqual([
      'platform',
      'runtime',
      'ui',
    ]);
  });

  test('probe reports exact missing gates per package', () => {
    expect(probeReportE2EPackages({ env: {}, hasPlaywright: false })).toEqual({
      enabled: false,
      packages: {
        platform: { ready: false, missing: ['OPENYIDA_E2E=1', 'OPENYIDA_E2E_REPORT=1'] },
        runtime: { ready: false, missing: ['OPENYIDA_E2E=1', 'OPENYIDA_E2E_REPORT=1', 'OPENYIDA_E2E_REPORT_RUNTIME=1'] },
        ui: { ready: false, missing: ['OPENYIDA_E2E=1', 'OPENYIDA_E2E_REPORT=1', 'OPENYIDA_E2E_REPORT_UI=1', 'playwright'] },
      },
    });
  });

  test('runs injected cases in dependency order and preserves inspect-derived bindings', async () => {
    const calls = [];
    const inspectBefore = {
      reportId: 'REPORT_1',
      revision: 10,
      components: [{ cid: 'cid_1', dataSetKeys: ['chartData'], filterKeys: ['filter_1'] }],
    };
    const inspectAfter = { ...inspectBefore, revision: 11 };
    let inspectCount = 0;
    const result = await run({
      config: {
        appType: 'APP_1',
        reportTitle: 'Report E2E',
        charts: [{ type: 'bar' }],
        appendCharts: [{ type: 'line' }],
        packages: ['platform', 'runtime', 'ui'],
      },
      createReport: async () => {
        calls.push('create');
        return { reportId: 'REPORT_1', url: 'https://example.test/report' };
      },
      inspectReport: async () => {
        calls.push('inspect');
        inspectCount += 1;
        return inspectCount === 1 ? inspectBefore : inspectAfter;
      },
      appendChart: async () => {
        calls.push('append');
        return { success: true };
      },
      queryRuntime: async ({ binding }) => {
        calls.push('runtime');
        expect(binding).toMatchObject({ cid: 'cid_1', dataSetKey: 'chartData', filterKey: 'filter_1' });
        return { rows: [{ value: 1 }] };
      },
      verifyUi: async ({ reportUrl }) => {
        calls.push('ui');
        expect(reportUrl).toBe('https://example.test/report');
        return { visible: true };
      },
    });

    expect(calls).toEqual(['create', 'inspect', 'append', 'inspect', 'runtime', 'ui']);
    expect(result).toMatchObject({
      status: 'passed',
      reportId: 'REPORT_1',
      cases: [
        { id: 'platform-create-append-inspect', status: 'passed' },
        { id: 'runtime-binding-query', status: 'passed' },
        { id: 'ui-report-render', status: 'passed' },
      ],
    });
  });
});
