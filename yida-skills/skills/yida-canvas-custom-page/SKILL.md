---
name: yida-canvas-custom-page
description: 宜搭 Code Canvas / 代码画布自定义页面开发规范，是现代 React18 自定义页面的默认链路。用于官网、看板、工作台、列表、详情、门户壳、可视化、hooks 交互，以及用户明确提到 code canvas、代码画布、YidaCodeCanvas、runtimeCode、importedModules、门户组件、数据管理视图、成员、部门或上传组件的场景。
---

# 宜搭 Code Canvas 自定义页面开发

## 核心定位

Code Canvas 是宜搭的代码画布自定义页面链路：以 `YidaCodeCanvas` 物料为承载，用户写标准 React18 函数组件源码，OpenYida 本地编译为 `runtimeCode` + `importedModules`，运行时按依赖白名单加载资源并执行 `YidaComp`。

相较普通 `.oyd.jsx` 自定义页，Code Canvas 更适合：

- 现代 React hooks 交互、图表、动效、复杂状态。
- 首版页面生成：官网、看板、工作台、列表、详情、门户壳。
- 需要 React18 函数组件、状态隔离和现代前端体验的页面。
- 只需要通过 HTTP / 连接器读写数据的页面。
- 需要在 Canvas 内受控接入门户、成员、部门、上传等宜搭运行态组件的页面。

普通自定义页面使用 `yida-custom-page`：适用于用户明确要求 JSX/Jsx 普通页面，或页面需要 `this.$(fieldId)` 双向绑定、`this.utils.yida.*`、`this.dataSourceMap`、提交流程深度耦合等普通页面实例桥能力。

## 运行时事实

- Canvas 源码写成 `.canvas.jsx` / `.canvas.tsx`，`openyida publish` 会自动走 Canvas 链路。
- 页面源码路径按 Bash cwd 选择：从仓库根执行命令时用 `project/pages/src/...`；cwd 已是 `<workspace>/project` 时用 `pages/src/...`。
- `runtimeCode` 在宿主页真实 `window` 中执行，入口必须返回 `YidaComp` / `YidaComp.default` / 组件函数。
- 推荐入口写法是 `function YidaComp(props) { ... }`，或 `const App = ...; export default App;`。CLI 已兼容 `const/let/class YidaComp; export default YidaComp`，但生成新代码时优先避开同名默认导出，减少不同 Canvas 运行态装配器下的重复声明风险。
- Canvas 组件没有普通页面实例上下文；数据读写通过 fetch、开放 API、连接器代理或显式 props 数据桥完成。
- 第三方依赖走白名单；React、antd、ahooks、d3、recharts、Radix、framer-motion 等可按规则 import。
- 宜搭运行态组件通过“先探测、可用再增强、不可用就 fallback、值统一归一化”接入；以 `window.Deep` / `window.DeepYida` 探测为主，`window.YidaNativeComponents` 作为兼容入口。嵌入门户数据管理视图时使用 `DataManageViews`，并显式传入目标表单 `form.value/formUuid`。

> 依赖白名单和运行时细节见 [dependencies-and-cdn.md](references/dependencies-and-cdn.md) 与 [employeefield-verification.md](references/employeefield-verification.md)。

## 使用决策

| 需求 | 推荐做法 |
| --- | --- |
| 官网、看板、工作台、列表、详情、门户壳 | 使用本技能，按页面类型生成 `.canvas.jsx` |
| 需要开放 API / 连接器读写数据 | 使用本技能，在 `YidaComp` 内自建 HTTP 数据桥 |
| 需要门户 topBanner / quickEntry / 数据卡片 | 使用本技能，按“门户组件桥”接入，必要时 fallback 自绘 |
| 需要成员、部门、附件上传、图片上传 | 使用本技能，按“宜搭组件桥”接入并归一化值 |
| 需要字段结构、公式、联动、权限、报表、流程 | 使用对应配置型技能承载，Canvas 只做展示和事件分发 |
| 深度依赖普通页 `this` 实例桥 | 使用 `yida-custom-page` |
| 表单内字段双向绑定 `this.$(fieldId)`、`this.utils.yida.*`、`dataSourceMap`、提交流程深度耦合 | 使用 `yida-custom-page`（该实例桥由普通自定义页面提供） |

## 两类特殊组件场景

### 1. 门户组件、topBanner 与数据卡片

需要门户展示能力时，优先用 `portal-shell-home` 或 `portal-native-components` 示例作为起点；需要确认运行态组件清单时先跑 `native-components-smoke`：

```bash
openyida generate-page portal-shell-home --theme-profile yida-app-theme --theme-scope page --output project/pages/src/portal-shell-home.canvas.jsx --compile
openyida sample yida-canvas-custom-page native-components-smoke --output project/pages/src/native-components-smoke.canvas.jsx
openyida sample yida-canvas-custom-page portal-native-components --output project/pages/src/portal-native-components.canvas.jsx
```

组件选择建议：

- `PortalTopBanner`、`PortalQuickEntry`：优先接入，适合门户首页的 Banner 和快捷入口。
- `QuickAccessCard`、`RecentlyUsedCard`：先做运行态验证，再用于动态门户卡片。
- `DataCard`、`PortalContainer`：仅在目标门户上下文、数据卡片配置和样式变量都验证通过后启用。

做法：从 `window.Deep`、`window.DeepYida` 探测组件；若环境已有 `window.YidaNativeComponents` 也可兼容读取。探测到组件时渲染原生组件；未探测到时渲染 Canvas 自绘卡片，页面保持可用。

### 2. 成员、部门、上传组件

需要数据管理视图、成员、部门、附件上传、图片上传时，使用原生组件桥从宿主运行态探测 `@ali/deep` / `vc-deep-yida` 已挂载组件：

```bash
openyida sample yida-canvas-custom-page native-components-smoke --output project/pages/src/native-components-smoke.canvas.jsx
openyida sample yida-canvas-custom-page portal-native-components --output project/pages/src/portal-native-components.canvas.jsx
```

组件选择建议：

- `EmployeeField`：优先验证和接入，记录真实 `onChange` 结构。
- `DepartmentSelectField`：验证部门搜索、弹层、权限提示、单选/多选后启用。
- `AttachmentField` / `ImageField`：验证 OSS 签名、上传权限、预览、删除、失败提示后启用。

做法：原生组件负责交互输入；页面业务状态保存归一化后的成员、部门、文件结构；提交通过 fetch / 连接器 / 开放 API 完成。组件验证通过时使用原生组件；验证未通过时使用 Canvas 自绘输入、搜索或链接录入。

> 详细桥接规则、值结构和验收清单见 [native-components-bridge.md](references/native-components-bridge.md)。

## 核心规则

### 致命规则（FATAL）

1. **Canvas 入口明确**：源码必须导出或返回 `YidaComp`，并把主组件作为默认导出或 `YidaComp` 暴露。
2. **发布链路正确**：Canvas 源码使用 `.canvas.jsx` / `.canvas.tsx`，或发布时显式加 `--canvas`。
3. **源码修改发布闭环**：本轮 Write/Edit/Create 了 `project/pages/src/*.canvas.jsx` 或 `project/pages/src/*.canvas.tsx` 后，final 前需要成功执行 `openyida publish <source> <appType> <displayPageFormUuid>`。有 publish 成功证据时表述为“页面已发布”；只有本地校验证据时表述为“Canvas 源码已修改，尚未发布”。
4. **依赖可加载**：普通 import 只使用 Code Canvas 白名单依赖；宜搭运行态组件走原生组件桥。
5. **使用 Canvas 函数组件契约**：Canvas 代码写 `YidaComp` React 函数组件；数据、生命周期和渲染都通过 hooks、props、fetch/连接器完成。需要 `renderJsx()`、`didMount()`、`this.forceUpdate()`、`this.utils.yida.*`、`this.dataSourceMap` 时切到 `yida-custom-page`。
6. **副作用清理**：`useEffect` 注册事件、定时器、图表实例时必须返回 cleanup。
7. **交互控件必须受控且真正驱动数据**：筛选 `Select`、搜索 `Input`/`Input.Search`、周期切换、`Tabs`/`Segmented`、批量/重置 `Button` 等控件都用 `useState` 建立受控状态，绑定 `onChange`/`onClick`，并让 `Table`/列表/卡片的数据源通过 `useMemo` 按状态派生后渲染。切换筛选后若当前选中项失效，回退选中态（如 `selected < filteredRows.length ? selected : 0`）。

### 重要规则（IMPORTANT）

1. **数据桥显式化**：通过 fetch、连接器或开放 API 读写数据；Cookie、CSRF、密钥和签名留在平台、连接器或后端服务侧。
2. **组件增强可降级**：门户、成员、部门、上传组件都做 feature detect 和 fallback；组件缺失时页面仍展示 Canvas 自绘基线。
3. **值先归一化**：成员、部门、文件的原始返回值只作为 `raw` 检查信息，业务 payload 使用统一结构。
4. **业务页主色跟随应用主题，sample 例外**：真实业务页默认读取 `--color-brand1-*` 与 `--color-group`；`lib/samples/**` 和官方 sample 展示应用自带页面级固定主题（`followRuntimeTheme: false` 或等价 CSS 变量），每个 sample 使用不同色相。
5. **先验证再扩展业务**：原生组件、上传、组织搜索、弹层类能力先做 smoke 页面，确认 PC/移动端都可用后再承载复杂业务。
6. **模板占位符必须可直发**：Canvas sample / generate-page 模板同时支持“生成器替换变量”和“sample 原样发布”。JSON 占位符用 `parseTemplateJson(raw, fallback)`，展示文案占位符用 `withFallback` / `applyPageFallbacks` 兜底，未替换时页面继续可运行，并显示业务化 fallback 文案。
7. **light 页面使用清爽业务色**：业务列表、协同表、数据管理页、工作台和门户默认使用 light 模式；主操作、选中态、筛选焦点和批量操作使用品牌色或 sample 自带主题色，边框用浅色品牌混合。用户明确要求暗色大屏/夜间模式/高对比风格时使用深色主视觉。
8. **门户运行态组件要补必需 props 和局部降级**：`QuickAccessCard` / `RecentlyUsedCard` 传 `theme="row-white"` 等必需 props；所有门户/字段/上传增强组件外层加局部 ErrorBoundary，单个组件不兼容时只降级该块，整页保持可用。
9. **自定义主题必须页面内注入**：`--theme` 只接受平台预置 key；页面设计使用非预置主题（例如活力橙、深玫红、自定义暗黑金）时，在 Canvas 源码中注入 `style#yida-global-theme` 或等价 scoped CSS vars，并在根节点设置 `data-theme-scope="page"`。官方 sample 每个页面都做页面级主题注入。
10. **双层样式护栏**：`openyida publish` 写入的 Canvas Schema 会带 Page 级 host reset，兜住首屏/刷新恢复焦点阶段；源码仍必须保留根节点 `oy-*` class、`OPENYIDA_CANVAS_CONTROL_CSS` 和 `ConfigProvider.getPopupContainer`，不要在后续编辑中删掉。手写非模板根类时，要复制同等 scoped reset，避免刷新时出现黑色粗边、浏览器原生 outline 或脱离页面作用域的下拉浮层。
11. **真实交付使用真实数据源**：`openyida sample` 原样发布可以保留 sample/seed 数据，并在页面上标注为 sample/seed。完整应用或真实交付页只要需要列表、看板、详情记录，并且本轮已经创建/解析业务表单，就在 `page-spec.json` 写入 `dataBinding.mode=form`、真实 `appType/formUuid` 和字段映射，让页面从表单读取。需要演示数据时，先通过表单数据写入链路创建 demo/mock records，再由 Canvas 读取这些真实表单记录；没有真实数据时展示空态、表单入口、刷新/登记按钮。
12. **UI 决策块必须进入 page spec**：完整应用 `fast_build` 和真实交付页在生成页面前，先消费 `yida-page-uiux` 的视觉方向决策块，把页面类型、推荐模板、`visualProfile`、素材/图标策略、去 sample 化检查写进 `page-spec.json` 或手写实现备注。缺少决策块时，先用当前业务语义补一个紧凑决策；不要让模板默认 tone、section 顺序、sample 品牌名或 sample 指标直接成为最终业务页。
13. **页面生成二选一**：模板路径先写 `page-spec.json`，执行 `openyida generate-page ... --spec ... --compile`，之后读取 CLI 摘要或 `.openyida-page.json` 判断 `domainFidelity` / dataBinding，并对生成源码做小范围 Edit/patch。手写路径直接 Write 最终 `.canvas.jsx` 并快检/发布。
14. **Canvas 产物使用纯文本业务文案**：`.canvas.jsx` 源码、模板 spec 会渲染到页面的文案、JS 注释、数据常量和产物文件路径都使用无 emoji 文本。`generate-page --compile`、`compileCanvasLocal` 或 `publish` 报 emoji 错误时，先改 spec/源码/路径，再重新校验发布。

## 数据真实性边界

Canvas 模板有两种允许状态：

- **Sample / 离线预览**：`openyida sample` 或模板原样发布可以显示内置 seedRows，页面必须标注 `sample/seed`，final 也要说明“当前为演示数据/未接真实表单数据”。
- **完整应用 / 真实交付**：先解析真实 `appType/formUuid/fieldId`，写入 `page-spec.json` 的 `dataBinding.mode=form` 后再 `openyida generate-page ... --spec <page-spec.json>`。需要 demo/mock 记录时，先用数据写入链路把记录写入表单并抽查，再让页面读取；前端 seedRows、静态 DEFAULT_FEATURES 或固定指标只作为 sample 数据标注。

生成后如果 `.openyida-page.json` 的 `dataBinding.enabled !== true`，且页面仍展示列表/看板/详情业务记录，交付状态标为 sample/draft；完整应用 final 只有在真实数据绑定已启用并验证后表述为“已接真实数据”。未接数据的交付页保留真实空态、登记入口、刷新按钮和数据接入提示。

## 模板占位符防回归

Canvas 模板有两条真实使用链路：

- `openyida generate-page ...`：变量会被生成器替换。
- `openyida sample ...` 或官方 sample 展示应用：源码可能被原样发布。

因此模板源码必须满足：

- 原始 sample 经过 `compileCanvasLocal` 能通过。
- 原始 sample 执行 `YidaComp()` 能正常返回组件。
- 可见渲染内容显示业务化文案或 fallback 文案。
- JSON 占位符使用安全解析函数接默认数据。

改 Canvas sample 后运行：

```bash
npx jest tests/canvas-compile.test.js tests/generate-page.test.js --runInBand
```

## Sample 质量规则

批量优化 `lib/samples/**` 或官方 sample 展示应用时，按以下质量规则执行：

- **先看参考再动手**：用户要求“高级、Dribbble、好看、像产品/官网/详情页/数据表”时，先参考 Dribbble 的同类构图和免费可商用素材站的真实图片，再抽象成布局、层次、色彩和数据密度原则，并转译为当前业务页面。
- **说清参考转译**：交付 sample 改造时要用 1-2 句话说明参考被转译成了什么，例如“详情页采用对象 hero + sticky 元信息 + 时间线结构”、“数据管理页采用多维表工具栏 + 分组行 + 彩色标签密集表格”。
- **每页独立主题**：sample 页默认 `themeScope=page` 或等价固定 CSS 变量；业务列表、详情、门户、工作台、官网、数据管理、大屏要有不同色相和不同信息节奏，不被宿主应用主题统一染色。
- **非预置主题不走 `--theme`**：`deepBlue/podBlue/.../black` 这些平台 key 才能传给 `--theme`；自己设计的主题色要写到页面 `style#yida-global-theme` / scoped token 中，并确保每个 sample 页面都有这段注入。
- **Sample 数据要像真实业务，真实交付要接真实数据**：列表、详情、数据管理、工作台、大屏 sample 模拟足够丰富的数据、状态、筛选、趋势、分组、时间线或指标；完整应用/真实交付页优先接 `dataBinding.mode=form`，未接入时展示真实空态。
- **工作台使用真实产品首页结构**：工作台页面铺满应用内容区，侧栏/导航/主面板形成真实产品首页；设计过程词不出现在可见页面。
- **数据大屏地图要稳定**：大屏中心态势图如果是地图，优先探测宜搭宿主地图组件（如 `YoushuMap` / `ChinaMap` / `MapChart` 等），并提供内置区域地图组件兜底；正常展示态呈现地图、区域态势或业务空态。
- **截图验收要覆盖模板共性**：导航覆盖、地图表现、配色、内容丰富度、产品首页结构等属于模板共性时，同步补 sample 模板、测试或本技能规则。
- **官网实景化覆盖完整品牌旅程**：强视觉官网至少形成“场景 Hero + 产品/服务 + 过程/空间”的摄影故事，品牌色从真实材质提取，section 覆盖真实产品、制作/服务过程与到店/使用情境。具体按 `yida-page-uiux/references/landing/realistic-brand-homepage.md` 执行。
- **交互要真的联动数据**：改完带筛选/搜索/切换的 sample，实际验证“改筛选 → 下方列表/表格/卡片数据发生变化”。控件使用受控状态、`onChange`/`onClick` 和派生数据源。
- **线上发布后回读**：发布到官方 sample 应用后，用 `get-schema` 回读确认 `YidaCodeCanvas/runtimeCode` 已更新，必要时检查页面 class/关键文案/关键区块存在。
- **CLI 能力缺口要补齐**：sample 注册、模板类型、发布生效、测试覆盖等 CLI 共性缺口优先补 CLI/测试。

## 开发流程

下面命令以仓库根为视角；如果当前 cwd 已经是 `<workspace>/project`，把 `project/pages/src/...` 改成 `pages/src/...`。读取生成文件、Schema 或校验产物时优先用宿主 Read / Glob / Grep。

```bash
# 1. 只读检查环境和登录态；真实创建资源前必须通过
openyida env --json
openyida login --check-only --json

# 2. 如需新页面，先创建空白自定义页拿 formUuid
openyida create-page <appType> "<页面名>"

# 3. 生成或编写 Canvas 源码
# 模板路径：生成后基于 manifest/摘要和小范围 patch 演进，不全量覆盖生成文件。
openyida generate-page workbench-home --theme-profile yida-app-theme --theme-scope page --output project/pages/src/workbench-home.canvas.jsx --compile
openyida generate-page dashboard-overview --theme-profile yida-app-theme --theme-scope page --output project/pages/src/dashboard-overview.canvas.jsx --compile
openyida generate-page portal-shell-home --theme-profile yida-app-theme --theme-scope page --output project/pages/src/portal-shell-home.canvas.jsx --compile
openyida sample yida-canvas-custom-page native-components-smoke --output project/pages/src/native-components-smoke.canvas.jsx
openyida sample yida-canvas-custom-page portal-native-components --output project/pages/src/portal-native-components.canvas.jsx
# 手写路径：已明确最终页面结构时，跳过 generate-page，直接 Write 最终 .canvas.jsx。

# 4. 本地 Canvas 快检
node -e "const fs=require('fs'); const {compileCanvasLocal}=require('./lib/app/canvas-compile'); const src=fs.readFileSync('project/pages/src/<页面名>.canvas.jsx','utf8'); console.log(compileCanvasLocal(src).importedModules)"

# 5. 发布（本轮修改源码后的远端完成证据）
openyida publish project/pages/src/<页面名>.canvas.jsx <appType> <formUuid>

# 6. 发布后回读字段摘要验收；如需留证，用结构化文件写入工具保存 stdout，不用 shell 重定向
openyida get-schema <appType> <formUuid> --field-map-json
```

`openyida check-page` / `openyida compile` 当前面向普通自定义页面 `.oyd.jsx` / `.jsx`；Canvas 以 `compileCanvasLocal` 和 `openyida publish .canvas.jsx` 的 Canvas 编译阶段为准。`compileCanvasLocal` 是发布前快检，`openyida publish` 是远端写入证据。

如需保存完整 Schema，使用 create_file / Write / file edit tool 创建 `<projectRoot>/.cache/openyida/<页面名或任务名>/<页面名>-schema.json`；从 workspace 根执行后续命令时路径加 `project/` 前缀。

## 模板速查

| 场景 | 命令 |
| --- | --- |
| 工作台 | `openyida generate-page workbench-home --theme-profile yida-app-theme --output project/pages/src/workbench.canvas.jsx --compile` |
| 看板 | `openyida generate-page dashboard-overview --theme-profile yida-app-theme --output project/pages/src/dashboard.canvas.jsx --compile` |
| 列表 | `openyida generate-page business-list --theme-profile yida-app-theme --output project/pages/src/list.canvas.jsx --compile` |
| 详情 | `openyida generate-page detail-profile --theme-profile yida-app-theme --output project/pages/src/detail.canvas.jsx --compile` |
| 门户壳 | `openyida generate-page portal-shell-home --theme-profile yida-app-theme --output project/pages/src/portal.canvas.jsx --compile` |
| 原生组件 smoke | `openyida sample yida-canvas-custom-page native-components-smoke --output project/pages/src/native-components-smoke.canvas.jsx` |
| 门户 + 宜搭组件桥 | `openyida sample yida-canvas-custom-page portal-native-components --output project/pages/src/portal-native-components.canvas.jsx` |
| 官网 | `openyida generate-page official-homepage --theme-profile yida-app-theme --output project/pages/src/official-home.canvas.jsx --compile` |
| 数据大屏 | `openyida generate-page data-screen --theme-profile yida-app-theme --output project/pages/src/data-screen.canvas.jsx --compile` |

## 参考文档

| 文档 | 覆盖范围 | 何时阅读 |
| --- | --- | --- |
| [page-generation-guide.md](references/page-generation-guide.md) | 模板路由、官网素材、themeScope、Page Spec、primitives | 生成页面前必读 |
| [native-components-bridge.md](references/native-components-bridge.md) | 门户、成员、部门、上传组件桥接和值归一化 | 需要宜搭运行态组件时必读 |
| [dependencies-and-cdn.md](references/dependencies-and-cdn.md) | 依赖白名单、windowAlias、CDN 加载契约 | 新增依赖或验证依赖加载时必读 |
| [employeefield-verification.md](references/employeefield-verification.md) | 运行时事实、原生组件验证、EmployeeField 验收 | 验证成员/字段组件时阅读 |
| [data-bridge-guide.md](references/data-bridge-guide.md) | Canvas 内自建 HTTP 数据桥 | 接入真实数据时阅读 |
| [canvas-design-system.md](references/canvas-design-system.md) | App 主题色、antd token、控件焦点/下拉 reset、图表配色 | 写样式和主题时阅读 |
| [component-library-guide.md](references/component-library-guide.md) | 开源组件库推荐组合和禁用清单 | 选择 UI/图表依赖时阅读 |
| [canvas-authoring-examples.md](references/canvas-authoring-examples.md) | 最小组件、hooks、副作用、图表示例 | 手写 Canvas 代码时阅读 |
| [真实品牌官网 Playbook](../yida-page-uiux/references/landing/realistic-brand-homepage.md) | 实景素材组、材质配色、品牌旅程、Sample 无 CDN 兜底和视觉验收 | 生成或改造强视觉官网时必读 |
