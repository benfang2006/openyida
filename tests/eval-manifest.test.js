'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const {
  isRenderableUrl,
  collectScoreTargets,
  buildEvalSection,
  mergeEval,
  augmentManifestFile,
  readManifest,
} = require('../scripts/eval/manifest');

describe('eval manifest', () => {
  test('collectScoreTargets 去重并优先页面/看板/报表', () => {
    const registry = {
      resources: [
        { type: 'app', url: 'https://x/app' },
        { type: 'page', url: 'https://x/page', pageId: 'P1' },
        { type: 'dashboard', url: 'https://x/dash' },
        { type: 'page', url: 'https://x/page' }, // 重复，应去重
      ],
      resultApp: { reportUrl: 'https://x/report', pageUrl: 'https://x/page' },
    };
    const targets = collectScoreTargets(registry);
    const urls = targets.map((t) => t.url);
    expect(urls).toContain('https://x/page');
    expect(urls).toContain('https://x/dash');
    expect(urls).toContain('https://x/report');
    expect(urls).not.toContain('https://x/app'); // app 不进打分目标
    // 去重：page 只出现一次
    expect(urls.filter((u) => u === 'https://x/page')).toHaveLength(1);
  });

  test('isRenderableUrl 排除 aliwork vanity 短链', () => {
    expect(isRenderableUrl('https://www.aliwork.com/o/oy_e2e_x-business-dashboard')).toBe(false);
    expect(isRenderableUrl('https://www.aliwork.com/o/some-slug/')).toBe(false);
    expect(isRenderableUrl('https://x.aliwork.com/APP_ABC/custom/FORM-123?isRenderNav=false')).toBe(true);
    expect(isRenderableUrl('https://x/page')).toBe(true);
    expect(isRenderableUrl('')).toBe(false);
  });

  test('collectScoreTargets 过滤掉 vanity 短链分享 URL', () => {
    const registry = {
      resources: [],
      resultApp: {
        businessDashboardUrl: 'https://x.aliwork.com/APP_A/custom/FORM-1?isRenderNav=false',
        businessDashboardShareUrl: 'https://www.aliwork.com/o/oy_e2e_x-business-dashboard',
      },
    };
    const urls = collectScoreTargets(registry).map((t) => t.url);
    expect(urls).toContain('https://x.aliwork.com/APP_A/custom/FORM-1?isRenderNav=false');
    expect(urls).not.toContain('https://www.aliwork.com/o/oy_e2e_x-business-dashboard');
  });

  test('buildEvalSection 结构完整', () => {
    const section = buildEvalSection({
      config: { mode: 'e2e', skill: 'yida-dashboard', resolvedStages: 'dashboard', screenshot: true, autoScore: false },
      guardrails: [{ name: 'g', status: 'pass' }],
      screenshots: [{ stage: 'dashboard', ok: true, path: '/tmp/a.png' }],
      scores: [{ stage: 'dashboard', auto: null, human: null }],
      scoringDoc: '/tmp/scoring.md',
    });
    expect(section.skillFilter).toBe('yida-dashboard');
    expect(section.options.screenshot).toBe(true);
    expect(section.guardrails).toHaveLength(1);
    expect(section.scoringDoc).toBe('/tmp/scoring.md');
    expect(typeof section.generatedAt).toBe('string');
  });

  test('mergeEval 把 eval 段挂到 manifest', () => {
    const merged = mergeEval({ runId: 'r1' }, { mode: 'e2e' });
    expect(merged.runId).toBe('r1');
    expect(merged.eval.mode).toBe('e2e');
  });

  test('augmentManifestFile 增量回写并保留原字段', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'eval-manifest-'));
    const manifestPath = path.join(dir, 'acceptance-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify({ runId: 'r1', urls: { pageUrl: 'u' } }), 'utf8');

    const merged = augmentManifestFile(manifestPath, { mode: 'e2e', guardrails: [] });
    expect(merged.runId).toBe('r1');
    expect(merged.urls.pageUrl).toBe('u');
    expect(merged.eval.mode).toBe('e2e');

    const reread = readManifest(manifestPath);
    expect(reread.eval.mode).toBe('e2e');

    fs.rmSync(dir, { recursive: true, force: true });
  });
});
