'use strict';

const {
  RESULT_SENTINEL,
  buildGenerationPrompt,
  extractAllJsonObjects,
  looksLikeGenerationResult,
  normalizeTargets,
  parseGenerationResult,
  checkExpectedFeatures,
  evaluateGenerationScenario,
  summarizeGeneration,
  runGenerationEval,
} = require('../scripts/eval/generate');

describe('eval generate · prompt', () => {
  test('buildGenerationPrompt 含需求、技能上下文与结果哨兵', () => {
    const p = buildGenerationPrompt({ request: '帮我创建一个订单管理系统', skillContext: 'SKILL-DOC' });
    expect(p).toContain('帮我创建一个订单管理系统');
    expect(p).toContain('SKILL-DOC');
    expect(p).toContain(RESULT_SENTINEL);
    expect(p).toContain('openyida');
  });

  test('buildGenerationPrompt 无技能上下文也可用', () => {
    const p = buildGenerationPrompt({ request: 'x' });
    expect(p).toContain('x');
    expect(p).not.toContain('技能说明（节选）');
  });
});

describe('eval generate · parse', () => {
  test('extractAllJsonObjects 抽出多个顶层对象', () => {
    const objs = extractAllJsonObjects('噪声 {"a":1} 中间 {"b":{"c":2}} 末尾');
    expect(objs).toEqual([{ a: 1 }, { b: { c: 2 } }]);
  });

  test('looksLikeGenerationResult 识别生成相关键', () => {
    expect(looksLikeGenerationResult({ appType: '表单' })).toBe(true);
    expect(looksLikeGenerationResult({ targets: [] })).toBe(true);
    expect(looksLikeGenerationResult({ foo: 1 })).toBe(false);
    expect(looksLikeGenerationResult(null)).toBe(false);
  });

  test('normalizeTargets 归一 targets/pages 并去重', () => {
    const t = normalizeTargets({
      targets: [{ type: 'page', url: 'https://x/p' }, 'https://x/q'],
      pages: [{ type: 'dashboard', url: 'https://x/d' }, { type: 'page', url: 'https://x/p' }],
    });
    expect(t).toEqual([
      { stage: 'page', type: 'page', url: 'https://x/p' },
      { stage: 'page', type: 'page', url: 'https://x/q' },
      { stage: 'dashboard', type: 'dashboard', url: 'https://x/d' },
    ]);
  });

  test('parseGenerationResult 优先取哨兵后的围栏 JSON', () => {
    const text = [
      '过程里我打印了 {"appType":"草稿","targets":[]} 这种中间对象',
      RESULT_SENTINEL,
      '```json',
      '{"appType":"流程","appUrl":"https://x/app","targets":[{"type":"page","url":"https://x/p"}],"summary":"请假审批"}',
      '```',
    ].join('\n');
    const r = parseGenerationResult({ text });
    expect(r.ok).toBe(true);
    expect(r.appType).toBe('流程');
    expect(r.appUrl).toBe('https://x/app');
    expect(r.targets).toHaveLength(1);
    expect(r.summary).toBe('请假审批');
  });

  test('parseGenerationResult 无哨兵时回退取最后一个生成结果 JSON', () => {
    const text = '中间 {"foo":1} 又 {"appType":"表单","targets":[{"type":"page","url":"https://x/p"}]}';
    const r = parseGenerationResult(text);
    expect(r.appType).toBe('表单');
    expect(r.targets).toHaveLength(1);
  });

  test('parseGenerationResult 无产物时 ok=false', () => {
    const r = parseGenerationResult({ text: '我没有创建任何东西' });
    expect(r.ok).toBe(false);
    expect(r.targets).toEqual([]);
  });
});

describe('eval generate · feature check', () => {
  test('checkExpectedFeatures 全通过', () => {
    const result = {
      ok: true, appType: '流程申请', summary: '请假审批流程',
      targets: [{ stage: 'page', type: 'page', url: 'u' }],
      raw: '请假 审批',
    };
    const { pass, checks } = checkExpectedFeatures(result, {
      appType: '流程', minTargets: 1, targetTypes: ['page'], keywords: ['请假', '审批'],
    });
    expect(pass).toBe(true);
    expect(checks.every((c) => c.ok)).toBe(true);
  });

  test('checkExpectedFeatures 命中失败项', () => {
    const result = { ok: true, appType: '表单', targets: [], summary: '', raw: '' };
    const { pass, checks } = checkExpectedFeatures(result, {
      appType: '流程', minTargets: 2, targetTypes: ['dashboard'], keywords: ['销售'],
    });
    expect(pass).toBe(false);
    expect(checks.find((c) => c.name === 'appType').ok).toBe(false);
    expect(checks.find((c) => c.name === 'minTargets').ok).toBe(false);
  });

  test('checkExpectedFeatures 无期望时回落到 result.ok', () => {
    expect(checkExpectedFeatures({ ok: true }, {}).pass).toBe(true);
    expect(checkExpectedFeatures({ ok: false }, {}).pass).toBe(false);
  });
});

describe('eval generate · evaluate & summarize', () => {
  const okAgent = () => ({
    available: true, ok: true,
    text: `${RESULT_SENTINEL}\n\`\`\`json\n{"appType":"表单","targets":[{"type":"page","url":"https://x/p"}],"summary":"订单管理"}\n\`\`\``,
  });

  test('evaluateGenerationScenario 注入 agent，status=ok', () => {
    const r = evaluateGenerationScenario({
      scenario: { id: 'order', prompt: '订单系统', expectedFeatures: { minTargets: 1, keywords: ['订单'] } },
      skillContext: 'doc',
      runGenerationAgent: okAgent,
    });
    expect(r.status).toBe('ok');
    expect(r.targets).toHaveLength(1);
  });

  test('evaluateGenerationScenario 特征不满足 → feature-miss', () => {
    const r = evaluateGenerationScenario({
      scenario: { id: 'x', prompt: 'p', expectedFeatures: { targetTypes: ['dashboard'] } },
      skillContext: 'doc',
      runGenerationAgent: okAgent,
    });
    expect(r.status).toBe('feature-miss');
  });

  test('evaluateGenerationScenario agent 不可用', () => {
    const r = evaluateGenerationScenario({
      scenario: { id: 'x', prompt: 'p' },
      runGenerationAgent: () => ({ available: false }),
    });
    expect(r.status).toBe('agent-unavailable');
  });

  test('evaluateGenerationScenario 无产物 → no-output', () => {
    const r = evaluateGenerationScenario({
      scenario: { id: 'x', prompt: 'p' },
      runGenerationAgent: () => ({ available: true, ok: true, text: '啥也没建' }),
    });
    expect(r.status).toBe('no-output');
  });

  test('runGenerationEval 汇总（注入 agent，无真实调用）', () => {
    const scenarios = [
      { id: 'a', prompt: '订单', expectedFeatures: { minTargets: 1 } },
      { id: 'b', prompt: '看板', expectedFeatures: { targetTypes: ['dashboard'] } },
    ];
    const outcome = runGenerationEval({ scenarios, skillContext: 'doc', runGenerationAgent: okAgent });
    expect(outcome.summary.total).toBe(2);
    expect(outcome.summary.passed).toBe(1); // a 通过，b 因缺 dashboard 未过
    expect(outcome.summary.produced).toBe(2);
    expect(summarizeGeneration(outcome.results).featureMiss).toBe(1);
  });
});
