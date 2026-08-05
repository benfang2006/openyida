# Code Canvas 页面实现入口

Code Canvas 消费 `yida-design` 输出的 `prd.md` 与 `design.md`，或单页 PRD 章节 + design spec，把页面场景、区块、主题、交互、数据绑定和素材清单实现成 `.canvas.jsx` / `.canvas.tsx`。

## 页面场景到实现入口

用户描述页面目标后，先读取 `yida-design` 的 `prd/<项目名>/prd.md` 和 `prd/<项目名>/design.md`，或单页 PRD 章节和对应 design spec。PRD 用来确认页面场景、区块、数据来源、主操作和移动端要求；design.md 用来确认主题色、页面风格、视觉 DNA、布局配方、材质、组件和状态规则。实现时按下表选择页面结构；页面结构、数据桥和样式细节已经明确时，直接手写 `.canvas.jsx`。

结构化实现工具提供可编译运行时结构、数据桥、主题变量和基础 primitives。真实业务页结合 `prd.md` 落地业务化区块顺序、数据和文案，结合 `design.md` 落地信息层级、局部构图和样式节奏。

PRD 写有 `pageSpecHandoff` 时，可以把 `pageSpecHandoff` 转成 `page-spec.json`；其中 `pageStructure`、`scene`、`contentBlocks`、`themeSummary`、`designFile`、`designRefs`、`dataBinding` 和 `primaryAction` 是页面实现的业务输入。随后必须读取 `designFile` 指向的 `design.md`，用 `designRefs` 找到 `visualScaffold`、`backgroundLayer`、`surfaceMaterial`、`colorRoles`、`depthRule`、组件和状态规则。

## Source Of Truth

`prd.md` 和 `design.md` 是唯一设计事实源。`page-spec.json` 只是页面实现阶段的派生文件，用于喂给生成器或保存一次稳定交接，不是第三份设计文件。

- `page-spec.json` 必须由当前 `prd.md + design.md` 派生，不允许凭空新增视觉规则、页面结构或业务功能。
- `page-spec.json` 不复制 `visualScaffold`、`surfaceMap`、`componentRecipe`、tokens、完整色盘或组件规则；只保存 `designFile/designRefs` 和与 design.md 一致的 `themeSummary`。
- spec 必须包含 `sourceOfTruth.prdFile`、`sourceOfTruth.designFile`、`sourceOfTruth.designRefs` 和 `sourceOfTruth.conflictPolicy = "prd-design-win"`。
- spec 与 PRD/design.md 冲突时，以 PRD/design.md 为准，重新生成 spec；不要修改 PRD/design.md 来迎合旧 spec。
- 手写页面且结构清楚时可以跳过 `page-spec.json`，但源码实现备注必须能说明已读取 `prd.md` 和 `design.md`。

实现阶段不再从 PRD 里反推视觉，也不直接把参考 `references/style-designs/*.design.md` 当当前应用设计稿。参考风格只在 yida-design 阶段用于生成应用级 `design.md`；Code Canvas 只遵守当前项目的 `design.md`。工作台/业务首页通常需要紧凑状态摘要、高频动作、待办/动态/最近记录和右侧上下文；实现阶段用这些结构替代“4 个等宽大 KPI 白卡 + 图标快捷卡 + 大空态白卡”。列表/管理页通常需要顶部视觉区、搜索筛选区、左侧列表或表格、右侧详情预览、错误/空态下一步动作；实现阶段用这些结构替代单个渐变标题、单个指标卡和大块空白提示。工作台、首页、门户、看板、展示页和业务入口页至少落地 10 个有业务目的的区块以上，区块可以紧凑组合，不能用重复 KPI 卡、重复快捷入口或大空白卡凑数；KPI 子项、快捷入口子项和列表行不计入区块数量。

页面实现路径二选一：结构化实现路径先从 `prd.md + design.md` 派生业务化 `page-spec.json` 并生成可编译骨架，之后读取 CLI 摘要或 `.openyida-page.json`。若发现业务或视觉事实源缺失，先回写 `prd.md` / `design.md` 并重生成 spec；只有实现偏差才对生成源码做小范围 Edit/patch。手写路径直接 Write 最终 `.canvas.jsx`。

实现工具会在 `.openyida-page.json` 中写入 `domainFidelity`，并在 CLI 输出中提示当前页面的业务化程度：

- `domain-ready`：主要业务语义已覆盖，可以作为真实业务页面继续校验和发布。
- `draft-needs-domain-spec`：用户已有业务要求，但 `page-spec.json` 仍缺业务对象、指标、交互或视觉方向；先按下方修复路径补 `prd.md` / `design.md`，再重新派生 spec，不能直接用源码 patch 代替事实源。

真实业务页的 `page-spec.json` 至少写清业务名称与定位、业务模块/对象、指标口径、用户动作或下钻方式、`sourceOfTruth`、`designFile`、`designRefs` 和 `themeSummary`；页面美感提升/页面重构写入 `functionContract`，保留现有数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限和业务状态；看板/列表/详情如果本轮已经创建或解析业务表单，写入 `dataBinding.mode=form`、真实 `appType/formUuid` 和字段映射；官网/品牌页写入 `assets` 或素材缺口。

## 修复路径

| 问题类型 | 必须修改哪里 | 不允许的做法 |
| --- | --- | --- |
| 页面目标、业务对象、指标口径、主操作、表单入口、数据来源、`contentBlocks`、空/载/错业务语义不足或错误 | 回写 `prd.md`，再重新派生 `page-spec.json` | 只在 `page-spec.json` 或源码里新增业务区块、指标和动作 |
| 主题关系、token、`visualScaffold`、`backgroundLayer`、`surfaceMaterial`、`colorRoles`、`depthRule`、组件规则、状态规则、响应式规则不足或错误 | 回写 `design.md`，再重新派生 `page-spec.json` 或重读 design.md 实现 | 只在源码里临时写 CSS、主色、玻璃感、卡片材质或状态样式 |
| `page-spec.json` 缺少 `sourceOfTruth`、`designFile/designRefs`、`dataBinding` 字段，或与 `prd.md/design.md` 不一致 | 丢弃并从最新 `prd.md + design.md` 重新生成 `page-spec.json` | 修改 PRD/design.md 来迎合旧 spec，或把 design.md 的完整视觉规则复制进 spec |
| PRD、design.md 和 spec 都完整，但生成源码存在 className、布局比例、字段映射、响应式、loading/empty/error 渲染、编译错误等实现偏差 | 小范围 Edit/patch 源码 | 借源码 patch 新增 PRD 未定义的页面区块、业务动作或 design.md 未定义的视觉风格 |

源码 patch 过程中一旦发现需要新增业务区块、改页面目标、改主题关系或补视觉规则，停止 patch，先回写 `prd.md` 或 `design.md`，再重新派生 spec 或重读两份事实源实现。

`visualScaffold` 必须来自 `design.md`，并映射到源码 primitive：`rootShell`、`prioritySurface`、`statusPrimitive`、`actionPrimitive`、`contentPrimitive`、`contextPrimitive`、`statePrimitive` 和 `responsiveRule`。如果只有区块名称，没有这些源码级槽位，先补 design.md，不要直接开始写 CSS。

页面要求玻璃感、质感或丰富色彩时，必须消费 `backgroundLayer`、`surfaceMaterial`、`colorRoles` 和 `depthRule`：页面根节点至少有基础底色 + 弱渐变/径向光/素材遮罩；玻璃面板使用半透明 `rgba` 表面、`backdrop-filter`、细边框和柔和阴影；色彩角色至少区分应用主色、辅助色、语义色和图表色。纯白背景 + 纯白不透明卡片不满足玻璃感页面。

数据真实性边界：

- 明确做离线预览时可以展示 seed 数据，但页面必须标注演示数据状态。
- 完整应用或真实交付页使用真实业务记录；需要演示数据时，先把 demo/mock records 写入真实宜搭表单，再由 Canvas 读取。
- 真实数据暂未接入时，页面应展示空态、表单入口、刷新/登记按钮和 dataBinding 接入提示。

| 已确认的页面场景 | 页面结构 | scene | 实现重点 |
| --- | --- | --- | --- |
| 官网首页、品牌官网、律所官网、茶叶官网、落地页、门户官网 | `official-homepage` | `landing` | 首屏叙事、可信视觉面板、服务矩阵、信任背书 |
| 数据大屏、实时监控、预警系统、指挥舱、态势屏 | `data-screen` | `screen` | 中心态势图、左右信息塔、趋势、排行、预警 |
| 数据看板、经营看板、管理驾驶舱 | `dashboard-overview`，复杂经营大屏切 `data-screen` | `dashboard` | KPI、图表、明细、排行、洞察 |
| 工作台、运营台、任务中心、业务首页 | `workbench-home` | `workbench` | 入口、待办、状态、流程闭环 |
| 列表、管理页、订单管理、客户列表、工单池 | `business-list` | `list` | 搜索筛选、表格、状态标签、详情抽屉 |
| 详情页、客户档案、订单详情、项目详情 | `detail-profile` | `detail` | 单对象摘要、章节、侧栏元信息、时间线 |
| 主从分栏、工单处理台、左列表右详情 | `split-pane-detail` | `list` | 左侧队列、右侧详情、时间线、动作区 |
| 页面内门户壳、多入口门户、隐藏导航门户 | `portal-shell-home` | `workbench` | 仅显式要求页面内门户壳、自绘导航或隐藏平台导航时使用；默认门户/工作台不自建导航 |

如果用户要求“门户组件 / 成员 / 部门 / 上传组件”，继续使用 Code Canvas，并按 [native-components-bridge.md](native-components-bridge.md) 的桥接规则实现。

默认实现保留平台应用导航，同应用内页面入口写入 `appBlueprint.navigation` 或平台导航分组。页面内 tab、自绘侧边栏或独立门户壳最多写 `appBlueprint.hasPageNavigation: true`，并保持平台导航可见；PRD 明确隐藏平台导航、无导航全屏体验或 `isRenderNav=false` 时，在 spec 里写 `appBlueprint.renderNav: false`；发布后再用 `openyida update-form-config <appType> <formUuid> false "<页面标题>"` 隐藏平台导航，保持页面单导航。

快捷入口目标是同应用内页面时，先把目标放入 `appBlueprint.navigation` / 平台导航分组，由应用导航内切换；默认工作台或门户内容区聚焦当前页动作、表单新建/查看、外部链接、跨应用资源，或用户显式隐藏平台导航后的页面内导航壳。表单新建/提交入口必须写清 `targetType: "submission"` 与 `openMode: "responsive-drawer"`，并默认 `hideNav: true` / `isRenderNav=false`：PC 端生成右侧抽屉 iframe，移动端整页或新页打开隐藏导航原生提交页。

## 官网与品牌页素材流程

实现 `official-homepage` 时，先读取 PRD 中的素材清单；缺少素材时按下方补齐素材清单。

强视觉品牌先读 `yida-design/references/scenes/landing.md`。官网完成条件包括：场景 Hero、产品/服务、过程/空间三类素材，从真实材质推导的页面级品牌 token，不同 section 的构图节奏，以及一个明确 CTA。

素材清单至少包含：

```json
{
  "assets": {
    "heroImage": "https://...",
    "heroImageAlt": "品牌主视觉",
    "productImages": [
      { "url": "https://...", "alt": "明星产品" }
    ]
  }
}
```

素材来源优先级：

1. 用户提供或已有官网图片。若有防盗链，优先用 `openyida cdn-upload` 转存。
2. AI 生成图片。先生成本地图片，再确认 CDN 配置，之后上传并回填 URL。
3. 公开图库。只使用可公开访问且通过 HTTP 200 校验的图片 URL；生产交付优先转存到自有 CDN。

若 `openyida cdn-config --show` 显示缺少 `accessKeyId/accessKeySecret/cdnDomain/ossBucket`，交付状态标为“素材待上传”；可先用已验证公开 URL 测试，或提示用户补 CDN 配置。

离线展示在无 CDN 时允许内嵌经过压缩的 JPEG/WebP data URI，保证源码原样发布也有真实图片；建议 3-5 张、单张不超过 250 KB、总量不超过 800 KB。生产页面使用稳定 CDN 素材 URL。

## 主题实现

主题色决策来自 `yida-design` 的 `design.md`，业务场景和页面边界来自 `prd.md` 或派生的 `page-spec.json`。页面重构 / 局部美化先以当前应用主题为基准；缺少主题证据时，按业务气质选择平台预置主题或自定义 token，不固定回到 `podBlue` / #1677ff。`themeProfile: { "name": "yida-app-theme" }` 表示跟随宜搭运行态主题：线上由 `style#yida-global-theme` 的 `--color-brand1-*` 和 `--color-group` 决定页面主色、图表色组和局部强调色。

`page-spec.json` 只保存与 design.md 一致的主题摘要。只有平台预置 key 才能传给应用 `theme/colour`；自定义主题名必须在 design.md 中配套输出 tokens，并在 Canvas 源码中复制 `theme-runtime-helpers.md` 的 Code Canvas helper，注入 `style#yida-global-theme` 或 scoped CSS vars。

`themeScope` 决定主题影响范围：

| 作用域 | 行为 | 何时使用 |
| --- | --- | --- |
| `page` | 只在当前页面根节点注入主题变量，不影响导航和其他页面 | 默认安全选择 |
| `app` | 页面加载时调用 `window.__YIDA__.updateShellConfig({ themeConfig })`，请求壳层一起换肤 | 需要左侧导航、顶部壳层和内容区统一 |

从 PRD 或派生的 `page-spec.json` 读取业务边界，从 design.md 读取主题 token 与视觉执行规则：

| 设计输入 | 实现方式 |
| --- | --- |
| 整个应用统一、全局换肤、系统整体主题、应用主题也改 | `themeScope: app` |
| 左侧导航/菜单/顶部壳层也一起变色，导航和内容区同色 | `themeScope: app` |
| 某个页面、首页、看板、自定义页变好看、页面重构或局部美化 | `themeScope: page`，主题基准为当前应用主题 |
| 保持导航不变、其他页面不变、只改当前页 | `themeScope: page` |

PRD 给出品牌色、色值、独立品牌/活动页诉求，或明确要求做成和当前应用很不一样时，Canvas 在页面作用域写入覆盖色。

## Page Spec 结构化字段

页面实现会读取结构化字段并写入 `.openyida-page.json` manifest，后续 AI 修改可以基于 manifest 更稳定地更新。manifest 和 `page-spec.json` 都是实现记录；当它们和 `prd.md/design.md` 冲突时，以 `prd.md/design.md` 为准。

| 字段 | 说明 | 默认 |
| --- | --- | --- |
| `researchLevel` | 官网/落地页调研深度：`none/light/enhanced/deep` | landing 默认 `light` |
| `sourceOfTruth` | `prdFile`、`designFile`、`designRefs`、`conflictPolicy` | 必填，来自当前项目 PRD 与 design.md |
| `appBlueprint` | 应用名、角色、导航分组、页面组合、壳形态 | 单页自动生成当前页 entry |
| `resourceBlueprint` | 完整应用的主页面、业务页面、普通表单、流程表单和报表资源 | 来自 `yida-design` |
| `archetype` | 页面类型，如 `overview/analysis/monitor/profile` | 按 scene 推断 |
| `interactionProfile` | 主操作、详情方式、批量动作、空/载/错状态 | 按 scene 推断 |
| `functionContract` | 页面美感提升时保留的数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限、状态 | 现有页面契约 |
| `insights` | 看板/报告/工作台的数据洞察 | 无则空数组或场景默认洞察 |
| `designFile` | 当前项目设计契约路径 | 来自 `yida-design` Step 5 |
| `designRefs` | 当前页面引用的 design.md 章节 ID | 来自 PRD 的 pageSpecHandoff |
| `themeSummary` | 应用主题色、风格关键词、themeScope 摘要 | 来自 PRD 摘要，必须与 design.md 一致 |
| `contentBlocks` | 页面区块清单，工作台/首页/门户/看板/展示页/业务入口页不少于 10 个有业务目的的区块；KPI 组、快捷入口组、列表组各只算 1 个区块 | 来自 `yida-design` Step 4 |
| `domainFidelity` | 实现后由 CLI 回填，标记业务化程度 | 无需手写 |

示例：

```json
{
  "sourceOfTruth": {
    "prdFile": "prd/渠道增长应用/prd.md",
    "designFile": "prd/渠道增长应用/design.md",
    "designRefs": ["themeProfile", "sceneRecipes.dashboard", "components.charts", "states.empty"],
    "conflictPolicy": "prd-design-win"
  },
  "pageStructure": "dashboard-overview",
  "scene": "dashboard",
  "designFile": "prd/渠道增长应用/design.md",
  "designRefs": ["themeProfile", "sceneRecipes.dashboard", "components.charts", "states.empty"],
  "themeSummary": {
    "themeColor": "青绿色应用主题",
    "styleKeywords": ["运营洞察", "轻量玻璃感", "高密信息"],
    "themeScope": "page"
  },
  "researchLevel": "none",
  "archetype": "analysis",
  "appBlueprint": {
    "appName": "渠道增长应用",
    "shell": "side_nav",
    "renderNav": false,
    "roles": ["运营", "经销商"],
    "navigation": ["品牌展示", "经营看板"],
    "pages": [
      { "name": "品牌官网首页", "scene": "landing", "pageStructure": "official-homepage" },
      { "name": "经营看板", "scene": "dashboard", "pageStructure": "dashboard-overview" }
    ]
  },
  "interactionProfile": {
    "primaryAction": "查看本周经营",
    "detailMode": "drawer",
    "submitMode": "responsive-drawer",
    "bulkActions": ["导出巡店建议"],
    "states": ["empty", "loading", "error"]
  },
  "insights": [
    { "conclusion": "华东区贡献 43%", "evidence": "环比 +5.2pp", "suggestion": "优先补货高增长门店" }
  ]
}
```

## 页面 primitives 验收

实现后至少确认源码包含对应场景的 primitive class，并且本地编译通过。

| 页面结构 | 内置 UI primitives |
| --- | --- |
| `dashboard-overview` | KPI、Chart panel、Rank list、Insight callout、Freshness badge |
| `workbench-home` | Workbench metric、Quick entry、Task feed、Insight strip |
| `business-list` | Filter bar、Table state badge、Bulk action bar、Detail preview |
| `detail-profile` | Object hero、Meta stack、Timeline primitive、Insight callout |
| `split-pane-detail` | Split queue、Filter bar、Detail pane、Timeline card、Insight card |
| `portal-shell-home` | Portal nav、Hero panel、Entry card、Dynamic card、Update feed |
| `official-homepage` | Real-scene hero、Product/service visual、Process/space story、Visit/service section、CTA |
| `data-screen` | Command map、Metric grid、Rank panel、Screen insight header |

`workbench-home` 的 Workbench metric 必须是紧凑状态摘要，不是 180px 高的大白卡；Quick entry 必须有分组和主次，不能平铺成图标卡阵列；Task feed / Insight strip / 最近记录至少出现其一，空数据也用薄空态行 + 主操作入口，不渲染大块空白卡片。

展示型 Canvas 页面验收时检查 `contentBlocks` 或源码结构：工作台、首页、门户、看板、展示页和业务入口页至少有 10 个有业务目的的区块以上；每个区块承担不同任务，例如判断状态、发起动作、筛选、处理待办、查看动态、看洞察、看异常、进入详情、处理空态或补充上下文。若 PRD 只写“`KPI 卡片: 学生总数, 课程总数, 本月出勤率, 平均分`、`快捷入口: 录入学生/登记成绩/记录考勤/管理课程`、`最近成绩列表`、`最近考勤记录`”，实现前必须退回补齐 `contentBlocks`，因为这只构成 4 个聚合区块。

所有展示型页面都按当前项目 `design.md` 的 `visualScaffold` 实现。若 PRD 只有业务区块、design.md 只有视觉形容词，没有明确 `layoutRecipe` / `surfaceMap` / `componentRecipe`，先回到 `prd/<项目名>/design.md` 补齐：

1. 先把 `contentBlocks` 映射到 `layoutRecipe` 的槽位。
2. 按 `surfaceMap` 决定无框区、细线面板、浅底条、列表行、表格、右侧栏或抽屉，不能把所有区块都做成卡片。
3. 按 `sectionRhythm` 排序和控制间距，保证首屏有主次和至少两层信息。
4. 按 `componentRecipe` 统一按钮、入口、标签、图标、列表、图表和空态。
5. 按源码 primitive 写组件：外层壳、首屏最大视觉锚点、状态摘要、动作条、主要内容、右侧上下文、状态处理和响应式规则都要落成真实 JSX/CSS。
6. 写完源码后逐条核对 `acceptanceChecks`，不通过就继续 patch。

所有 Canvas 页面都带控件样式护栏：`ConfigProvider.getPopupContainer` 让 Select / DatePicker 弹层留在页面作用域，`OPENYIDA_CANVAS_CONTROL_CSS` 统一输入框、下拉、日期、运行态字段组件的 hover / focus / dropdown 样式。出现黑色粗边、浏览器原生 outline、下拉浮层脱离页面风格时，优先检查这两项是否保留。
