'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function readSkill(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8');
}

describe('OpenYida skill contracts', () => {
  test('agent-facing docs use token auth wording instead of legacy cookie login guidance', () => {
    const docs = [
      'AGENTS.md',
      'README.md',
      'README_zhCN.md',
      'scripts/eval/runner.js',
      'scripts/eval/VERIFY.md',
      'yida-skills/skills/yida-app/SKILL.md',
    ].map(readSkill).join('\n');

    expect(docs).toContain('token session');
    expect(docs).not.toContain('登录宜搭并缓存 Cookie');
    expect(docs).not.toContain('有效 cookie 缓存');
    expect(docs).not.toContain('读取 .cache/cookies.json 中的 corpId');
    expect(docs).not.toContain('lib/auth/login.js');
    expect(docs).not.toContain('lib/auth/qr-login.js');
    expect(docs).not.toContain('lib/auth/codex-login.js');
  });

  test('page command examples keep Code Canvas as the default chain', () => {
    const localeDirs = [
      path.join(ROOT, 'lib', 'core', 'locales'),
      path.join(ROOT, 'locales-extra', 'core'),
    ];
    const localeSource = localeDirs.flatMap((localeDir) => {
      if (!fs.existsSync(localeDir)) { return []; }
      return fs.readdirSync(localeDir)
        .filter((file) => file.endsWith('.js'))
        .map((file) => fs.readFileSync(path.join(localeDir, file), 'utf8'));
    })
      .join('\n');

    expect(localeSource).toContain('openyida compile pages/src/home.canvas.jsx');
    expect(localeSource).toContain('openyida check-page pages/src/home.canvas.jsx');
    expect(localeSource).toContain('openyida generate-page <template> --output pages/src/home.canvas.jsx');
  });

  test('root skill uses compact agent-capabilities for default preflight', () => {
    const skill = readSkill('yida-skills/SKILL.md');

    expect(skill).toContain('openyida agent-capabilities --summary-json');
    expect(skill).toContain('`openyida agent-capabilities --json` 是完整能力信息');
    expect(skill).toContain('不要把完整能力信息放进 `fast_build` 默认链路');
    expect(skill).toContain('`workdir` 对应完整能力信息里的 `active.projectRoot`');
    expect(skill).not.toContain('优先跑一次 `openyida agent-capabilities --json`');
  });

  test('QwenWork install guidance aligns with QoderWork user-level skills layout', () => {
    const docs = [
      'README.md',
      'README_zhCN.md',
      'yida-skills/SKILL.md',
      'scripts/postinstall.js',
    ].map(readSkill).join('\n');

    expect(docs).toContain('~/.qwenworkcn/skills/yida-skills/');
    expect(docs).toContain('~/.qoderwork/skills/yida-skills/');
    expect(docs).toContain('未检测到 `~/.qwenworkcn` 时');
    expect(docs).toContain('folderName');
    expect(docs).toContain('QwenWork（千问办公）');
    expect(docs).not.toContain('project/.qwenworkcn/skills/');
    expect(docs).not.toContain('不要把 OpenYida skill 放到项目根目录');
    expect(docs).not.toContain('不会自动加载');
    expect(docs).not.toContain('project-root `.qwenworkcn/skills/`');
    expect(docs).not.toContain('not auto-loaded');
    expect(docs).not.toContain('特定项目生效');
    expect(docs).not.toContain('trigger conditions');
  });

  test('skills index carries machine routing hints for high-confusion skills', () => {
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((skill) => [skill.name, skill]));

    const form = byName.get('yida-create-form-page');
    expect(form.positive_signals).toEqual(expect.arrayContaining(['新增字段']));
    expect(form.negative_signals).toEqual(expect.arrayContaining(['新增记录']));
    expect(form.command_ids).toEqual(expect.arrayContaining(['create-form.create']));

    const login = byName.get('yida-login');
    const logout = byName.get('yida-logout');
    expect(login.command_ids).toEqual(expect.arrayContaining(['agent-capabilities', 'login', 'auth']));
    expect(logout.command_ids).toEqual(expect.arrayContaining(['logout', 'auth']));

    const data = byName.get('yida-data-management');
    expect(data.positive_signals).toEqual(expect.arrayContaining(['新增记录']));
    expect(data.negative_signals).toEqual(expect.arrayContaining(['修改表单结构']));

    const canvas = byName.get('yida-canvas-custom-page');
    expect(canvas.negative_signals).toEqual(expect.arrayContaining(['强依赖 this.$']));

    const rechart = byName.get('yida-rechart');
    expect(rechart.positive_signals).toEqual(expect.arrayContaining(['高级图表', 'Recharts']));
    expect(rechart.negative_signals).toEqual(expect.arrayContaining(['明确指定 ECharts']));

    const canvasTable = byName.get('yida-canvas-table-form');
    expect(canvasTable.positive_signals).toEqual(expect.arrayContaining(['批量录入', 'antd Table']));
    expect(canvasTable.negative_signals).toEqual(expect.arrayContaining(['this.utils.yida.saveFormData']));

    const uiux = byName.get('yida-page-uiux');
    expect(uiux.done_when).toContain('视觉方向');
    expect(uiux.tags).toEqual(expect.arrayContaining(['fast_build', 'ui_skill']));
    expect(uiux.positive_signals).toEqual(expect.arrayContaining(['主页面 UI 引导', 'ui_skill']));

    const formDetail = byName.get('yida-form-detail');
    expect(formDetail.description).toContain('表单页视觉引导');
    expect(formDetail.description).toContain('Divider 分割线语义分组');
    expect(formDetail.tags).toEqual(expect.arrayContaining(['表单视觉引导', 'Divider']));
  });

  test('specialized Canvas-first skills keep native compatibility routes explicit', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const rechart = readSkill('yida-skills/skills/yida-rechart/SKILL.md');
    const canvasTable = readSkill('yida-skills/skills/yida-canvas-table-form/SKILL.md');
    const nativeChart = readSkill('yida-skills/skills/yida-chart/SKILL.md');
    const nativeTable = readSkill('yida-skills/skills/yida-table-form/SKILL.md');

    expect(root).toContain('默认 `yida-rechart`（Code Canvas + Recharts）');
    expect(root).toContain('默认 `yida-canvas-table-form`');
    expect(rechart).toContain('禁止前端全量聚合');
    expect(rechart).toContain('`yida-report`');
    expect(rechart).toContain('`yida-canvas-data-binding`');
    expect(canvasTable).toContain('Canvas 没有普通页面实例桥');
    expect(canvasTable).toContain('未验证不得伪装闭环');
    expect(canvasTable).toContain('Promise.all');
    expect(nativeChart).toContain('# 宜搭 ECharts 高级报表技能');
    expect(nativeTable).toContain('saveFormData');
  });

  test('deprecated yida-ppt routes through yida-ppt-slider only', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const slider = readSkill('yida-skills/skills/yida-ppt-slider/SKILL.md');
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((skill) => [skill.name, skill]));

    expect(byName.has('yida-ppt')).toBe(false);
    expect(fs.existsSync(path.join(ROOT, 'yida-skills', 'skills', 'yida-ppt', 'SKILL.md'))).toBe(false);
    expect(root).toContain('`yida-ppt-slider`');
    expect(root).not.toContain('`yida-ppt` |');
    expect(byName.get('yida-ppt-slider').aliases).toEqual(expect.arrayContaining(['yida-ppt']));
    expect(byName.get('yida-ppt-slider').positive_signals).toEqual(expect.arrayContaining(['yida-ppt', 'PPT']));
    expect(slider).toContain('"yida-ppt"');
  });

  test('tingji reads taskUuid before flash-note PRD generation', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const tingji = readSkill('yida-skills/skills/yida-tingji/SKILL.md');
    const flash = readSkill('yida-skills/skills/yida-flash-note-to-prd/SKILL.md');
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((skill) => [skill.name, skill]));

    expect(root).toContain('先用 `yida-tingji` 读取听记内容，再把已有内容交给 `yida-flash-note-to-prd`');
    expect(tingji).toContain('本技能不直接生成 PRD');
    expect(flash).toContain('先加载 `yida-tingji` 读取听记内容');
    expect(byName.get('yida-tingji').description).toContain('只负责读取内容');
    expect(byName.get('yida-flash-note-to-prd').description).toContain('若用户只给 taskUuid');
  });

  test('yida-app fast_build forbids unbound dataSourceMap by default', () => {
    const skill = readSkill('yida-skills/skills/yida-app/SKILL.md');

    expect(skill).toContain('use_skill("yida-page-uiux", "主页面 UI 引导")');
    expect(skill).toContain('主页面生成默认包含一次轻量 `yida-page-uiux` 页面引导');
    expect(skill).toContain('不默认执行：`yida-app-uiux`');
    expect(skill).toContain('默认页面源码不得使用 `this.dataSourceMap.*`');
    expect(skill).toContain('`this.utils.yida.searchFormDatas`');
    expect(skill).toContain('发布输出出现 `No custom page data sources to preserve`');
    expect(skill).toContain('`yida-data-source-connectors`');
    expect(skill).toContain('只返回一个主访问链接');
    expect(skill).toContain('新增/修改/发布单个页面时输出当前页面 URL');
    expect(skill).toContain('其他情况输出应用首页 `{base_url}/{appType}/workbench`');
    expect(skill).toContain('资源类型 | 名称/用途 | ID | 状态');
    expect(skill).toContain('不要把 `g.alicdn.com` 的 `index.css`、`index.js`、`index.html`、`locales/*.json`');
  });

  test('fast_build publishes with lightweight navigation auto order by default', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const app = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const publish = readSkill('yida-skills/skills/yida-publish-page/SKILL.md');
    const navGroup = readSkill('yida-skills/skills/yida-nav-group/SKILL.md');
    const manifest = readSkill('lib/core/command-manifest.js');
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((skill) => [skill.name, skill]));

    expect(root).toContain('发布 + 轻量导航排序');
    expect(root).toContain('fast_build 发布后的轻量导航自动排序是默认收尾');
    expect(app).toContain('openyida publish <源文件路径> <appType> <formUuid> --auto-nav-order');
    expect(app).toContain('门户/首页/工作台入口 > 自定义页面 > 流程表单 > 表单');
    expect(publish).toContain('`--auto-nav-order`');
    expect(publish).toContain('排序失败只警告，不回滚已发布页面');
    expect(navGroup).toContain('openyida nav-group auto-order <appType>');
    expect(manifest).toContain('default_nav_order_policy');
    expect(manifest).toContain('openyida publish ... --auto-nav-order');
    expect(manifest).toContain('prd_visual_policy');
    expect(manifest).toContain('Every PRD mode must include visual specifications');
    expect(manifest).toContain('final_link_policy');
    expect(manifest).toContain('Return exactly one primary user-facing link');
    expect(manifest).toContain('{base_url}/{appType}/workbench');
    expect(byName.get('yida-app').description).toContain('发布后立即做轻量导航自动排序');
    expect(byName.get('yida-nav-group').description).toContain('auto-order');
  });

  test('yida-app PRDs include visual specs and deep_design has a full low-code template', () => {
    const skill = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const contract = readSkill('yida-skills/skills/yida-app/references/app-build-contract.md');
    const guidance = readSkill('yida-skills/skills/yida-app/references/ui-guidance-by-mode.md');
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((item) => [item.name, item]));

    expect(skill).toContain('完整低代码 PRD（非最小 MVP）');
    expect(skill).toContain('所有模式的 PRD 都必须写入视觉规范');
    expect(skill).toContain('应用基本信息、整体结构、视觉规范、数据结构、页面与功能、业务逻辑、交互与状态、验收标准');
    expect(skill).toContain('PRD 仍只记录业务语义、视觉规范、页面/表单/流程设计和字段定义');
    expect(contract).toContain('## 完整低代码 PRD 模板（非最小 MVP）');
    expect(contract).toContain('## 视觉规范');
    expect(contract).toContain('## 1. 应用基本信息');
    expect(contract).toContain('## 2. 整体结构');
    expect(contract).toContain('## 3. 视觉规范');
    expect(contract).toContain('## 4. 数据结构（低代码核心）');
    expect(contract).toContain('## 5. 页面与功能');
    expect(contract).toContain('## 6. 业务逻辑（低代码动作）');
    expect(contract).toContain('## 7. 交互与状态');
    expect(contract).toContain('## 8. 验收标准');
    expect(contract).toContain('| 主题 profile | 默认 `podBlue` / `podGreen` / `podOrange`');
    expect(contract).toContain('| 明暗模式 | 默认 `light`');
    expect(contract).toContain('| 导航视觉 | 默认平台导航可见');
    expect(guidance).toContain('写回 PRD 的视觉规范');
    expect(byName.get('yida-app').description).toContain('所有模式 PRD 都写视觉规范');
    expect(byName.get('yida-app').done_when).toContain('PRD 已记录视觉规范');
  });

  test('form page development loads yida-form-detail visual guidance with Divider grouping', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const app = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const createForm = readSkill('yida-skills/skills/yida-create-form-page/SKILL.md');
    const formDetail = readSkill('yida-skills/skills/yida-form-detail/SKILL.md');
    const manifest = readSkill('lib/core/command-manifest.js');

    expect(root).toContain('先加载 `yida-form-detail` 做表单视觉引导并合并 Divider 分割线');
    expect(app).toContain('use_skill("yida-form-detail", "表单视觉引导")');
    expect(app).toContain('字段结构有 Divider 分组');
    expect(createForm).toContain('表单页开发默认先加载 `yida-form-detail` 作为视觉引导');
    expect(createForm).toContain('视觉引导必须和 `Divider` 分割线语义分组合并执行');
    expect(formDetail).toContain('### 【表单视觉引导】');
    expect(formDetail).toContain('Divider 策略');
    expect(formDetail).toContain('作为表单视觉引导加载时，不要直接注入 formDetail CSS');
    expect(manifest).toContain("default_form_visual_guidance_skill_id: 'yida-form-detail'");
    expect(manifest).toContain('merges Divider semantic grouping into field JSON');
  });

  test('yida-custom-page fast_build uses compact native defaults and reads references on demand', () => {
    const skill = readSkill('yida-skills/skills/yida-custom-page/SKILL.md');

    expect(skill).toContain('`fast_build` 默认不得生成依赖 dataSourceMap 的代码');
    expect(skill).toContain('不得在 fast_build 里写 `this.dataSourceMap.<name>.load()`');
    expect(skill).toContain('默认轻量 UI 引导只产出页面类型、模板路由、`visualProfile` 和去 sample 化检查');
    expect(skill).toContain('## Available Files');
    expect(skill).toContain('check-page 报错、复杂交互、状态管理问题、`deep_design`');
    expect(skill).not.toContain('编写页面代码前**必须完整阅读**');
    expect(skill).not.toContain('编写任何页面代码前必读');
  });

  test('yida-get-schema documents compact field-map first', () => {
    const skill = readSkill('yida-skills/skills/yida-get-schema/SKILL.md');

    expect(skill).toContain('openyida get-schema <appType> <formUuid> [--summary-json|--field-map-json]');
    expect(skill).toContain('页面开发默认使用 compact 输出');
    expect(skill).toContain('不内联完整 Schema');
  });

  test('builder stopgap docs codify yida-app resource resolution commands and cwd-sensitive paths', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const app = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const canvas = readSkill('yida-skills/skills/yida-canvas-custom-page/SKILL.md');
    const native = readSkill('yida-skills/skills/yida-custom-page/SKILL.md');
    const publish = readSkill('yida-skills/skills/yida-publish-page/SKILL.md');

    expect(root).toContain('不要再用 Bash `cat`/`ls` 做无意义复核');

    expect(app).toContain('已有显式 `appType`、应用 URL 或已绑定资源上下文中的 `appType` 且能唯一解析时，直接复用该 app');
    expect(app).toContain('不要调用 `app-list` 做存在性确认');
    expect(app).toContain('才运行 `openyida app-list [--size N]`');
    expect(app).toContain('openyida list-forms <appType> [--keyword <text>]');
    expect(app).toContain('openyida get-schema <appType> <formUuid|--all> ...');
    expect(app).toContain('禁止编造 `list-apps` / `get-app`');
    expect(app).toContain('按目的在 `app-list`、`list-forms`、`get-schema` 三者中选择');

    [app, canvas, native, publish].forEach((skill) => {
      expect(skill).toContain('从仓库根执行');
      expect(skill).toContain('<workspace>/project');
      expect(skill).toContain('`pages/src/...`');
    });
  });

  test('yida-publish-page treats missing preserved data sources as incomplete when code uses dataSourceMap', () => {
    const skill = readSkill('yida-skills/skills/yida-publish-page/SKILL.md');

    expect(skill).toContain('源码包含 `this.dataSourceMap.`');
    expect(skill).toContain('`No custom page data sources to preserve`');
    expect(skill).toContain('本次发布不能视为完成');
  });

  test('page source edits require successful publish evidence before claiming remote updates', () => {
    const root = readSkill('yida-skills/SKILL.md');
    const app = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const canvas = readSkill('yida-skills/skills/yida-canvas-custom-page/SKILL.md');
    const native = readSkill('yida-skills/skills/yida-custom-page/SKILL.md');
    const publish = readSkill('yida-skills/skills/yida-publish-page/SKILL.md');
    const index = JSON.parse(readSkill('yida-skills/skills-index.json'));
    const byName = new Map(index.skills.map((skill) => [skill.name, skill]));

    expect(root).toContain('页面源码修改必须发布闭环');
    expect(root).toContain('project/pages/src/*.{canvas.jsx,canvas.tsx,oyd.jsx,jsx,tsx}');
    expect(root).toContain('openyida publish <source> <appType> <displayPageFormUuid>');
    expect(root).toContain('源码已修改，尚未发布');
    expect(root).toContain('禁止说“页面已更新 / 已重新发布 / 已上线”');

    expect(app).toContain('已有页面 update path');
    expect(app).toContain('阶段 5 的本地源码校验只算“可发布”');
    expect(app).toContain('没有 publish 成功证据，只能对用户说明“源码已修改，尚未发布”');

    expect(canvas).toContain('final 前需要成功执行 `openyida publish <source> <appType> <displayPageFormUuid>`');
    expect(canvas).toContain('有 publish 成功证据时表述为“页面已发布”');
    expect(canvas).toContain('只有本地校验证据时表述为“Canvas 源码已修改，尚未发布”');

    expect(native).toContain('`check-page` / `compile` 只证明源码可发布，不等于远端页面已更新');
    expect(native).toContain('final 只能说明“源码已修改，尚未发布”');

    expect(publish).toContain('final 证据只认真实执行成功的 `openyida publish <source> <appType> <displayPageFormUuid>`');
    expect(publish).toContain('本地文件编辑、diff、`check-page`、`compile`、`compileCanvasLocal` 或口头声明都不能证明远端页面已更新');
    expect(publish).toContain('发布了其他文件或其他目标页面，不满足本轮源码修改的 doneWhen');

    expect(byName.get('yida-app').done_when).toContain('没有 publish 证据只能声明源码已修改，尚未发布');
    expect(byName.get('yida-app').done_when).toContain('返回当前页面 URL');
    expect(byName.get('yida-app').done_when).toContain('返回 {base_url}/{appType}/workbench');
    expect(byName.get('yida-canvas-custom-page').done_when).toContain('openyida publish <source> <appType> <displayPageFormUuid>');
    expect(byName.get('yida-custom-page').done_when).toContain('openyida publish <source> <appType> <displayPageFormUuid>');
    expect(byName.get('yida-publish-page').done_when).toContain('本地文件编辑、diff、check-page 或 compile 不能证明远端页面已更新');
  });

  test('sample visual lessons are codified in page uiux, theme, chart, and report skills', () => {
    const pageUiux = readSkill('yida-skills/skills/yida-page-uiux/SKILL.md');
    const theme = readSkill('yida-skills/skills/yida-theme/SKILL.md');
    const chart = readSkill('yida-skills/skills/yida-chart/SKILL.md');
    const report = readSkill('yida-skills/skills/yida-report/SKILL.md');
    const retrospective = readSkill('yida-skills/references/task-retrospective.md');

    expect(pageUiux).toContain('参考 Dribbble');
    expect(pageUiux).toContain('参考转成可执行选择');
    expect(theme).toContain('`--theme` 预置值与自定义主题边界');
    expect(theme).toContain('官方 sample 主题验收纪律');
    expect(theme).toContain('style#yida-global-theme');
    expect(chart).toContain('已有 chart sample / 跨应用迁移修复流程');
    expect(chart).toContain('getFormNavigationListByOrder');
    expect(chart).toContain('report-binding.json');
    expect(report).toContain('作为 chart sample 数据源的绑定纪律');
    expect(report).toContain('REPORT_xxx');
    expect(retrospective).toContain('Chart sample / 原生报表绑定经验');
    expect(retrospective).toContain('工作台是操作首页，不是 demo 页面');
  });

  test('yida-theme recommends pod theme token presets and keeps legacy aliases explicit', () => {
    const theme = readSkill('yida-skills/skills/yida-theme/SKILL.md');
    const app = readSkill('yida-skills/skills/yida-app/SKILL.md');
    const createApp = readSkill('yida-skills/skills/yida-create-app/SKILL.md');
    const pageUiux = readSkill('yida-skills/skills/yida-page-uiux/SKILL.md');
    const presets = readSkill('yida-skills/skills/yida-theme/references/theme-token-presets.md');
    const expectedPresets = {
      podBlue: {
        '--color-brand1-1': 'rgb(51, 160, 255)',
        '--color-brand1-2': 'rgb(242, 249, 255)',
        '--color-brand1-3': 'rgba(0, 137, 255, 0.2)',
        '--color-brand1-6': 'rgb(0, 137, 255)',
        '--color-brand1-9': 'rgb(0, 109, 204)',
        '--color-brand1-10': 'rgba(0, 137, 255, 0.3)',
        '--color-brand-1': 'rgb(178, 219, 255)',
        '--color-brand-2': 'rgb(51, 160, 255)',
        '--color-brand-3': 'rgb(0, 137, 255)',
        '--color-brand-4': 'rgb(0, 109, 204)',
      },
      podGreen: {
        '--color-brand1-1': 'rgb(60, 190, 113)',
        '--color-brand1-2': 'rgb(246, 252, 248)',
        '--color-brand1-3': 'rgba(64, 179, 112, 0.2)',
        '--color-brand1-6': 'rgb(64, 179, 112)',
        '--color-brand1-9': 'rgb(62, 170, 107)',
        '--color-brand1-10': 'rgba(64, 179, 112, 0.3)',
        '--color-brand-1': 'rgb(197, 232, 212)',
        '--color-brand-2': 'rgb(60, 190, 113)',
        '--color-brand-3': 'rgb(64, 179, 112)',
        '--color-brand-4': 'rgb(62, 170, 107)',
      },
      podOrange: {
        '--color-brand1-1': 'rgb(255, 125, 26)',
        '--color-brand1-2': 'rgb(255, 248, 242)',
        '--color-brand1-3': 'rgba(255, 111, 0, 0.2)',
        '--color-brand1-6': 'rgb(255, 111, 0)',
        '--color-brand1-9': 'rgb(242, 105, 0)',
        '--color-brand1-10': 'rgba(255, 111, 0, 0.3)',
        '--color-brand-1': 'rgb(255, 211, 178)',
        '--color-brand-2': 'rgb(255, 125, 26)',
        '--color-brand-3': 'rgb(255, 111, 0)',
        '--color-brand-4': 'rgb(242, 105, 0)',
      },
    };

    expect(presets).toContain('默认推荐使用平台 pod 主题 profile：`podBlue`、`podGreen`、`podOrange`');
    expect(presets).toContain('legacy `blue`、`green`、`orange` 只用于兼容旧 spec 和旧页面 token，不再作为新应用或 fast-build 的默认推荐');
    expect(theme).toContain('应用默认主题优先推荐平台 `pod` 系主题：`podBlue`、`podGreen`、`podOrange`');
    expect(app).toContain('应用默认主题先从平台 pod 主题 `podBlue`、`podGreen`、`podOrange` 三选一');
    expect(createApp).toContain('应用主题默认先从 `podBlue`、`podGreen`、`podOrange` 三选一');
    expect(pageUiux).toContain('真实业务页默认先从平台 pod 主题 `podBlue`、`podGreen`、`podOrange` 三选一');
    expect(presets).toContain('| `blue` | `podBlue` |');

    Object.entries(expectedPresets).forEach(([preset, tokens]) => {
      expect(presets).toContain(`## ${preset}`);
      Object.entries(tokens).forEach(([token, value]) => {
        expect(presets).toContain(`"${token}": "${value}"`);
      });
    });
  });

  test('data screens do not default to dark or black themes', () => {
    const pageUiux = readSkill('yida-skills/skills/yida-page-uiux/SKILL.md');
    const step4 = readSkill('yida-skills/skills/yida-page-uiux/workflow/step-4-visual-decision.md');
    const outputBlock = readSkill('yida-skills/skills/yida-page-uiux/workflow/output-decision-block.md');
    const visualEngine = readSkill('yida-skills/skills/yida-page-uiux/references/visual-decision-engine.md');
    const fastGuidance = readSkill('yida-skills/skills/yida-app/references/ui-guidance-by-mode.md');
    const screenScene = readSkill('yida-skills/skills/yida-page-uiux/references/scenes/screen.md');
    const dashboardTheme = readSkill('yida-skills/skills/yida-dashboard/references/theme-presets.md');
    const chartSpec = readSkill('yida-skills/skills/yida-chart/references/echarts-design-spec.md');

    expect(pageUiux).toContain('视觉方向决策块必须写明 `themeProfile.name`、`themeScope`、`navTheme=light`、`themeColorSource`');
    expect(pageUiux).toContain('工作台、门户、列表、详情、普通看板和数据大屏默认都是浅底 / light 模式');
    expect(step4).toContain('视觉方向不能只写“高级 / 简洁 / 商务”');
    expect(step4).toContain('`themeProfile.name`：默认从平台 pod 主题 `podBlue`、`podGreen`、`podOrange` 三选一');
    expect(step4).toContain('明暗模式：默认 `light`，并保持 `themeProfile.navTheme=light`');
    expect(step4).toContain('`themeProfile.colorMode` 是宜搭配色模式');
    expect(outputBlock).toContain('**明暗模式**：<light（默认');
    expect(outputBlock).toContain('**主题策略**：<themeProfile.name=podBlue/podGreen/podOrange');
    expect(outputBlock).toContain('themeProfile.colorMode 可为宜搭配色模式如 gradient，不表示暗黑');
    expect(outputBlock).toContain('**主题色说明**：<采用哪个主色或主题色来源');
    expect(visualEngine).toContain('默认 light，不默认暗黑');
    expect(fastGuidance).toContain('themeProfile: podBlue（平台 pod 主题，themeColorSource=platform-pod-theme，themeScope=page，navTheme=light）');
    expect(pageUiux).toContain('默认浅底业务屏，只有用户明确说暗色/深色/夜间/高对比时才用深色沉浸');
    expect(screenScene).toContain('默认使用浅底业务屏');
    expect(screenScene).toContain('不要默认深色或暗黑');
    expect(dashboardTheme).toContain('白底商务风（DEFAULT）');
    expect(dashboardTheme).toContain('用户只说“做个看板 / 驾驶舱 / 数据大屏”，不说暗色或夜间，默认用 **主题 3（白底商务）**');
    expect(dashboardTheme).not.toContain('深色紫蓝科技风（DEFAULT）');
    expect(chartSpec).toContain('大屏不等于暗色');
  });

  test('custom pages do not build page-level navigation by default', () => {
    const pageUiux = readSkill('yida-skills/skills/yida-page-uiux/SKILL.md');
    const navStep = readSkill('yida-skills/skills/yida-page-uiux/workflow/step-0-nav-shape.md');
    const pageGeneration = readSkill('yida-skills/skills/yida-canvas-custom-page/references/page-generation-guide.md');
    const screenScene = readSkill('yida-skills/skills/yida-page-uiux/references/scenes/screen.md');
    const navPatterns = readSkill('yida-skills/skills/yida-page-uiux/references/app/navigation-patterns.md');
    const workbenchScene = readSkill('yida-skills/skills/yida-page-uiux/references/scenes/workbench.md');
    const entryPatterns = readSkill('yida-skills/skills/yida-page-uiux/references/workbench/entry-patterns.md');
    const navGuide = readSkill('yida-skills/skills/yida-canvas-custom-page/references/navigation-and-entry-guide.md');
    const createPage = readSkill('yida-skills/skills/yida-create-page/SKILL.md');

    expect(pageUiux).toContain('默认页面不要在自定义页面里自建应用级导航');
    expect(pageUiux).toContain('页面内 tab / 自绘侧边栏 / 独立门户壳最多写 `appBlueprint.hasPageNavigation: true`，但仍保持平台导航可见');
    expect(navStep).toContain('默认自定义页**保留平台应用导航**');
    expect(navStep).toContain('页面内 tab / 分段导航 / 自绘导航不自动等于隐藏平台导航');
    expect(navStep).toContain('仅说「工作台 / 门户 / 看板 / 大屏 / 首页」不等于要自建页面内导航');
    expect(pageGeneration).toContain('默认生成页保留平台应用导航，不在自定义页面里自建同级导航');
    expect(pageGeneration).toContain('页面内 tab、自绘侧边栏或独立门户壳最多写 `appBlueprint.hasPageNavigation: true`，但仍保持平台导航可见');
    expect(screenScene).toContain('默认保留平台应用导航，不自建页面内导航');
    expect(navPatterns).toContain('默认不要在自定义页面里自建同级导航');
    expect(navPatterns).toContain('页面内导航不自动隐藏平台导航');
    expect(createPage).toContain('默认生成页面导航可见');
    expect(createPage).toContain('`--mode dashboard` | 否 | 看板/驾驶舱页面推荐使用；只表达页面模式，不会自动隐藏导航');
    expect(pageUiux).toContain('快捷入口目标如果是同应用内页面');
    expect(navStep).toContain('快捷入口目标是同应用内页面时');
    expect(pageGeneration).toContain('快捷入口目标是同应用内页面时');
    expect(workbenchScene).toContain('快捷入口目标如果是同应用内页面');
    expect(entryPatterns).toContain('同应用内页面优先在平台应用导航内切换');
    expect(navGuide).toContain('同应用内页面优先在平台应用导航内切换');
  });

  test('custom-page-dependent skills keep Canvas-first and native fallback boundaries explicit', () => {
    const dashboard = readSkill('yida-skills/skills/yida-dashboard/SKILL.md');
    const ppt = readSkill('yida-skills/skills/yida-ppt-slider/SKILL.md');
    const density = readSkill('yida-skills/skills/yida-density/SKILL.md');
    const navShell = readSkill('yida-skills/skills/yida-nav-shell/SKILL.md');
    const pageUiux = readSkill('yida-skills/skills/yida-page-uiux/SKILL.md');
    const dataSources = readSkill('yida-skills/skills/yida-data-source-connectors/SKILL.md');

    expect(dashboard).toContain('默认实现层是 **Code Canvas**');
    expect(dashboard).toContain('常规图表：`yida-rechart`');
    expect(dashboard).toContain('只有用户明确要求 ECharts');
    expect(dashboard).toContain('## Legacy/native fallback');

    expect(ppt).toContain('新建演示默认走 **Code Canvas**');
    expect(ppt).toContain('`useEffect` 管键盘、hash、触摸、定时器和 cleanup');
    expect(ppt).toContain('## Legacy/native fallback');

    expect(density).toContain('实现示例默认使用 **Code Canvas + React hooks**');
    expect(density).toContain('## Legacy/native fallback');

    expect(navShell).toContain('新建导航壳默认交 **Code Canvas**');
    expect(navShell).toContain('需要可分享、前进/后退');
    expect(navShell).toContain('## Legacy/native fallback');

    expect(pageUiux).toContain('默认交 Code Canvas');
    expect(pageUiux).toContain('常规业务图表交 `yida-rechart`');
    expect(pageUiux).toContain('ECharts 例外');

    expect(dataSources).toContain('本技能只服务 **普通自定义页面 native 链路**');
    expect(dataSources).toContain('Code Canvas 组件没有普通页面 `this` 实例，也没有 `dataSourceMap`');
    expect(dataSources).toContain('use_skill("yida-canvas-data-binding"');
  });
});
