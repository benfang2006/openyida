'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('yida-design PRD quality fixtures', () => {
  test('fixture prompts assert pageSpecHandoff and visualScaffold primitives', () => {
    const fixturePath = 'scripts/eval/scenarios/yida-design-prd-quality.json';
    const scenarios = JSON.parse(read(fixturePath));

    expect(scenarios).toHaveLength(4);
    expect(scenarios.map((scenario) => scenario.id)).toEqual([
      'student-management-workbench',
      'pet-social-workbench',
      'coffee-inventory-dashboard',
      'ops-command-center',
    ]);

    for (const scenario of scenarios) {
      expect(scenario.expectedSkill).toBe('yida-design');
      expect(scenario.requiredPatterns).toEqual(expect.arrayContaining([
        'pageSpecHandoff',
        'prd.md',
        'design.md',
        'designFile',
        'designRefs',
        'contentBlocks',
        'prioritySurface',
        'contentPrimitive',
        'statePrimitive',
        'backgroundLayer',
        'surfaceMaterial',
        'colorRoles',
        'themePresetKey',
        'shouldPassCreateAppTheme',
        'globalThemeInjection',
      ]));
      expect(scenario.forbiddenPatterns.length).toBeGreaterThan(0);
    }
  });

  test('style registry keeps only the design template and one example', () => {
    const registry = read('yida-skills/skills/yida-design/references/style-designs/registry.md');
    const template = read('yida-skills/skills/yida-design/references/style-designs/_design-md-template.md');
    const example = read('yida-skills/skills/yida-design/references/style-designs/generated-business-design.example.md');

    expect(registry).toContain('_design-md-template.md');
    expect(registry).toContain('generated-business-design.example.md');
    expect(registry).toContain('配色由模型根据行业、品牌、应用主题、业务情绪和用户偏好生成');
    expect(template).toContain('## 21. 交付自检清单');
    expect(example).toContain('禁止复制本示例的业务名、颜色和字段');
    expect(example).toContain('颜色由当前业务推导，没有复制示例色盘');
  });

  test('design skill uses prd.md and design.md instead of scene docs', () => {
    const scenesDir = path.join(ROOT, 'yida-skills/skills/yida-design/references', 'scenes');
    const skill = read('yida-skills/skills/yida-design/SKILL.md');
    const step3 = read('yida-skills/skills/yida-design/workflow/step-3-information-architecture.md');
    const step5 = read('yida-skills/skills/yida-design/workflow/step-5-visual-states.md');
    const pageGeneration = read('yida-skills/skills/yida-canvas-custom-page/references/page-generation-guide.md');

    expect(fs.existsSync(scenesDir)).toBe(false);
    expect(skill).toContain('设计事实源唯一');
    expect(skill).toContain('页面 `scene` 只作为分类标签');
    expect(step3).toContain('页面 `scene` 只作为分类标签和实现提示，不作为页面模板');
    expect(step5).toContain('同一个 `prd/<项目名>/design.md`');
    expect(pageGeneration).toContain('强视觉品牌以 PRD 的素材清单和 `design.md.assetStrategy` 为准');
  });
});
