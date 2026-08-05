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

  test('style registry covers the required neutral design directions', () => {
    const registry = read('yida-skills/skills/yida-design/references/style-designs/registry.md');

    expect(registry).toContain('ops-command-three-column');
    expect(registry).toContain('dark-task-workbench');
    expect(registry).toContain('light-task-workbench');
    expect(registry).toContain('master-detail-management-console');
    expect(registry).toContain('profile-detail-record');
    expect(registry).toContain('brand-homepage-editorial');
    expect(registry).toContain('realtime-data-screen');
  });

  test('list and detail scene docs are aligned with visualScaffold primitives', () => {
    const list = read('yida-skills/skills/yida-design/references/scenes/list.md');
    const detail = read('yida-skills/skills/yida-design/references/scenes/detail.md');

    for (const content of [list, detail]) {
      expect(content).toContain('## contentBlocks 槽位');
      expect(content).toContain('## 源码 primitive');
      expect(content).toContain('`prioritySurface`');
      expect(content).toContain('`contentPrimitive`');
      expect(content).toContain('`statePrimitive`');
      expect(content).toContain('`responsiveRule`');
    }
  });
});
