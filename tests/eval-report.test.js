'use strict';

const { escapeHtml, renderEvalReportHtml } = require('../scripts/eval/report');

describe('eval report', () => {
  test('escapeHtml 转义危险字符', () => {
    expect(escapeHtml('<a href="x">&\'')).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;');
    expect(escapeHtml(null)).toBe('');
    expect(escapeHtml(8)).toBe('8');
  });

  test('renderEvalReportHtml 含元数据/护栏/截图占位/打分', () => {
    const html = renderEvalReportHtml({
      config: { mode: 'e2e', skill: 'yida-dashboard', resolvedStages: 'auth,app,dashboard' },
      registry: { runId: 'OY_E2E_TEST' },
      guardrails: [{ name: 'no-resource-before-login-check', status: 'pass', detail: 'ok' }],
      screenshots: [
        { stage: 'dashboard', type: 'dashboard', url: 'https://x/dash', ok: false, skipped: 'playwright-missing', path: null },
      ],
      scores: [
        { stage: 'dashboard', url: 'https://x/dash', auto: { overall: 8, dimensions: { layout: 8 }, comment: '不错', model: 'claude -p' }, human: null },
      ],
    });
    expect(html).toContain('OY_E2E_TEST');
    expect(html).toContain('yida-dashboard');
    expect(html).toContain('no-resource-before-login-check');
    expect(html).toContain('https://x/dash');
    expect(html).toContain('playwright-missing'); // 失败截图以占位展示
    expect(html).toContain('自动打分');
    expect(html).toContain('不错');
    expect(html).toMatch(/<!doctype html>/i);
  });

  test('renderEvalReportHtml 无截图目标时给出提示', () => {
    const html = renderEvalReportHtml({ config: {}, registry: {}, guardrails: [], screenshots: [], scores: [] });
    expect(html).toContain('没有可截图');
    expect(html).toContain('（无护栏记录）');
  });

  test('renderEvalReportHtml 转义 URL/评语，防止注入破坏结构', () => {
    const html = renderEvalReportHtml({
      screenshots: [{ stage: 's', url: 'https://x/<script>', ok: false, path: null }],
      scores: [{ stage: 's', url: 'https://x/<script>', auto: { error: 'boom <bad>' }, human: null }],
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('自动打分失败');
  });
});
