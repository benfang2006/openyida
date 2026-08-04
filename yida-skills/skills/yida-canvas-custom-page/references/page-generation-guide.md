# Code Canvas 页面实现入口

Code Canvas 消费 `yida-design` 输出的 PRD 或单页 page spec，把页面场景、区块、主题、交互、数据绑定和素材清单实现成 `.canvas.jsx` / `.canvas.tsx`。

## 页面场景到实现入口

用户描述页面目标后，先读取 `yida-design` 的 PRD 或单页 PRD 章节，确认页面场景、区块、数据来源、主操作、主题色、页面风格、`designMd` 和移动端要求。实现时按下表选择页面结构；页面结构、数据桥和样式细节已经明确时，直接手写 `.canvas.jsx`。

结构化实现工具提供可编译运行时结构、数据桥、主题变量和基础 primitives。真实业务页结合 `yida-design` 输出的 `prd/<项目名>.md`，落地业务化区块顺序、信息层级、局部构图、文案和样式节奏。

PRD 写有 `designMd` 时，先读取对应 `yida-design/references/style-designs/*.design.md`，再落实其中的视觉 DNA、布局配方、组件规则和状态规则。PRD 写有 `visualBaseline` 时，同步落实 `layoutRecipe`、`visualAnchor`、`sectionRhythm`、`densityRule`、`actionPlacement` 和 `responsiveRule`。列表/管理页通常需要顶部视觉区、搜索筛选区、左侧列表或表格、右侧详情预览、错误/空态下一步动作；实现阶段用这些结构替代单个渐变标题、单个指标卡和大块空白提示。

页面实现路径二选一：结构化实现路径先写业务化 `page-spec.json` 并生成可编译骨架，之后读取 CLI 摘要或 `.openyida-page.json`，再对生成源码做小范围 Edit/patch；手写路径直接 Write 最终 `.canvas.jsx`。

实现工具会在 `.openyida-page.json` 中写入 `domainFidelity`，并在 CLI 输出中提示当前页面的业务化程度：

- `domain-ready`：主要业务语义已覆盖，可以作为真实业务页面继续校验和发布。
- `draft-needs-domain-spec`：用户已有业务要求，但 page spec 仍缺业务对象、指标、交互或视觉方向；继续补 spec 或改源码。

真实业务页的 `page-spec.json` 至少写清业务名称与定位、业务模块/对象、指标口径、用户动作或下钻方式、页面风格、`designMd` 和视觉 DNA；页面美感提升/页面重构写入 `functionContract`，保留现有数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限和业务状态；看板/列表/详情如果本轮已经创建或解析业务表单，写入 `dataBinding.mode=form`、真实 `appType/formUuid` 和字段映射；官网/品牌页写入 `assets` 或素材缺口。业务区块、指标、行动文案或页面风格不足时，回到 `yida-design` 补齐 PRD / page spec。

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

主题色决策来自 `yida-design` PRD / page spec。页面重构 / 局部美化先以当前应用主题为基准；缺少主题证据时，再从 `podBlue`、`podGreen`、`podOrange` 等应用主题中选择。`themeProfile: { "name": "yida-app-theme" }` 表示跟随宜搭运行态主题：线上由 `style#yida-global-theme` 的 `--color-brand1-*` 和 `--color-group` 决定页面主色、图表色组和局部强调色。

page spec 使用 `themeProfile.name=podBlue|podGreen|podOrange|yida-app-theme` 形成页面级 token profile；其中 `podBlue|podGreen|podOrange` 也是平台主题 key。`blue|green|orange` 仅作为旧 spec 可用主题，新页面优先使用 `pod*` 主题。

`themeScope` 决定主题影响范围：

| 作用域 | 行为 | 何时使用 |
| --- | --- | --- |
| `page` | 只在当前页面根节点注入主题变量，不影响导航和其他页面 | 默认安全选择 |
| `app` | 页面加载时调用 `window.__YIDA__.updateShellConfig({ themeConfig })`，请求壳层一起换肤 | 需要左侧导航、顶部壳层和内容区统一 |

从 PRD / page spec 读取：

| 设计输入 | 实现方式 |
| --- | --- |
| 整个应用统一、全局换肤、系统整体主题、应用主题也改 | `themeScope: app` |
| 左侧导航/菜单/顶部壳层也一起变色，导航和内容区同色 | `themeScope: app` |
| 某个页面、首页、看板、自定义页变好看、页面重构或局部美化 | `themeScope: page`，主题基准为当前应用主题 |
| 保持导航不变、其他页面不变、只改当前页 | `themeScope: page` |

PRD 给出品牌色、色值、独立品牌/活动页诉求，或明确要求做成和当前应用很不一样时，Canvas 在页面作用域写入覆盖色。

## Page Spec 结构化字段

页面实现会读取结构化字段并写入 `.openyida-page.json` manifest，后续 AI 修改可以基于 manifest 更稳定地更新。

| 字段 | 说明 | 默认 |
| --- | --- | --- |
| `researchLevel` | 官网/落地页调研深度：`none/light/enhanced/deep` | landing 默认 `light` |
| `appBlueprint` | 应用名、角色、导航分组、页面组合、壳形态 | 单页自动生成当前页 entry |
| `resourceBlueprint` | 完整应用的主页面、业务页面、普通表单、流程表单和报表资源 | 来自 `yida-design` |
| `archetype` | 页面原型，如 `overview/analysis/monitor/profile` | 按 scene 推断 |
| `interactionProfile` | 主操作、详情方式、批量动作、空/载/错状态 | 按 scene 推断 |
| `functionContract` | 页面美感提升时保留的数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限、状态 | 现有页面契约 |
| `insights` | 看板/报告/工作台的数据洞察 | 无则空数组或场景默认洞察 |
| `pageStyle` | 页面风格 `design_id` | 来自 `yida-design` Step 5 |
| `designMd` | 页面风格设计文档路径 | 来自 `yida-design` Step 5 |
| `visualDna` | 必须保留的视觉 DNA | 来自选中的 `design.md` |
| `visualBaseline` | 视觉保底配方，包含版式、视觉锚点、区块节奏、密度、操作位置和响应式规则 | 来自 `yida-design` Step 5 |
| `domainFidelity` | 实现后由 CLI 回填，标记业务化程度 | 无需手写 |

示例：

```json
{
  "pageStructure": "dashboard-overview",
  "scene": "dashboard",
  "pageStyle": "deep-indigo-glass-analytics-workbench",
  "designMd": "references/style-designs/deep-indigo-glass-analytics-workbench.design.md",
  "visualDna": ["深靛色首屏摘要舞台", "玻璃质感指标卡", "紫蓝热力数据纹理", "柔白圆角分析面板"],
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

所有 Canvas 页面都带控件样式护栏：`ConfigProvider.getPopupContainer` 让 Select / DatePicker 弹层留在页面作用域，`OPENYIDA_CANVAS_CONTROL_CSS` 统一输入框、下拉、日期、运行态字段组件的 hover / focus / dropdown 样式。出现黑色粗边、浏览器原生 outline、下拉浮层脱离页面风格时，优先检查这两项是否保留。
