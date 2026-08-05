# Step 5：UI 视觉和状态设计

> 这一步写 `design.md` 草稿。`design.md` 规定所有页面共同遵守的 UI 视觉、组件样式、状态样式和响应式规则。

## 1. 选择 design.md 基准风格

先为完整应用确定一套主设计契约，再为不同页面场景写局部变体。自定义展示页、工作台、列表管理页、处理台、看板和首页门户都遵守同一个 `prd/<项目名>/design.md`。

1. 读取 [页面风格设计文档选择](../references/style-design-selection.md)。
2. 读取 [页面风格设计文档索引](../references/style-designs/registry.md)。
3. 根据应用目标、业务领域、信息密度、数据形态和页面组合选择一个主风格作为 `design.md` 基准。
4. 完整读取选中的参考 `design.md`，提取视觉 DNA、布局配方、组件规则和状态规则。
5. 读取 [视觉脚手架配方库](../references/visual-scaffold-recipes.md)，把应用内各类页面映射到统一 `visualScaffold` 规则。
6. 读取 [页面质量门禁](../references/page-quality-gates.md)，把质量门禁补进 `acceptanceChecks`。
7. 完整应用内默认保持同一套主风格；页面场景差异很大时，在同一份 `design.md` 里写页面场景变体，不为每个页面另起独立设计文件。

输出字段：

```markdown
- designFile：prd/<项目名>/design.md
- baseDesignSource：<references/style-designs/<design-id>.design.md 或 自定义业务风格>
- styleReason：<为什么适合当前应用和页面组合>
- Visual DNA：<所有页面都必须保留的 2-5 个视觉 DNA>
- sceneRecipes：<workbench/list/detail/dashboard/landing/screen 各自如何遵守同一 design.md>
- themeRelation：<应用主题色 / 自定义 token / 页面级独立色盘边界>
```

## 2. 写 UI 视觉规则

在应用级 `design.md` 中写清：

- 2-3 个气质关键词：稳重可信、轻盈现代、克制高端、温暖亲和、前沿科技等。
- 3-5 条业务专属设计原则：结合业务对象和用户任务写具体规则。
- 差异化 5 维：色彩、构图、密度、组件语言、动线。
- 基础版式：全应用视觉锚点、区块节奏、密度、操作位置和响应式规则。
- `visualScaffold`：给所有页面实现使用的硬骨架，写清 `layoutRecipe`、`surfaceMap`、`sectionRhythm`、`densityRule`、`componentRecipe`、`emptyStateRecipe`、`responsiveSlots` 和 `acceptanceChecks`。这些字段属于 `design.md`，PRD 只引用。

`visualScaffold` 的最低要求：

- `layoutRecipe` 写成明确版式，例如「左 2/3 主工作区 + 右 1/3 上下文栏」「上方紧凑摘要条 + 中部双列表 + 右侧提醒」。
- `surfaceMap` 写清每个区块的容器形态：无框区、细线面板、浅底条、表格、列表行、右侧栏、抽屉；不要全写卡片。
- `sectionRhythm` 写清区块间距、首屏主次和阅读顺序。
- `componentRecipe` 写清按钮、入口、标签、列表、图表和空态的具体形态。
- 源码槽位写清 `rootShell`、`prioritySurface`、`statusPrimitive`、`actionPrimitive`、`contentPrimitive`、`contextPrimitive`、`statePrimitive` 和 `responsiveRule`。
- 视觉层次写清 `backgroundLayer`、`surfaceMaterial`、`colorRoles` 和 `depthRule`；需要玻璃感时，明确半透明表面、`backdrop-filter`、细边框、柔和阴影和背景层。
- 这些字段要能直接指导实现，而不是形容词；实现者应能按 `design.md` 写出根容器、分栏、背景层、表面材质、按钮状态和空态。
- `acceptanceChecks` 至少包含：10+ `contentBlocks`、KPI/快捷入口子项不计数、首屏至少两层信息、没有大空白卡、主色跟随应用主题。

## 3. 写组件和状态规则

- 按主题统一按钮、输入、卡片、表格、标签、弹窗、抽屉和图标样式。
- 页面美感提升、重构和改 UI 时保留当前功能契约：数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限和业务状态继续有效。
- 明确正常、hover/active、禁用、加载、空态、错误、无权限、无数据状态。
- 表单验证、成功/失败提示使用平台语义色和原生能力。
- 下拉刷新、上拉加载、轮询刷新等只在真实场景需要时设计。

## 4. 选择素材和图标

- 官网、产品首页、品牌页、视觉化工作台默认要有真实图片或生成图片。
- 强视觉官网至少形成“场景 Hero + 产品/服务 + 过程/空间”的素材故事。
- 素材暂缺时标注 draft，并写清缺口，例如 heroImage、productImages、brandLogo、caseImages。
- 图标使用功能性内联 SVG，同一页面保持一套图标风格。

## 5. 检查页面是否像真实产品

检查：

1. 页面是否有当前业务专属信息，而不是示例品牌名、默认指标和通用卖点。
2. 首屏是否只有一个明确主张或核心判断。
3. 每个区块是否有不同的信息目的和构图节奏。
4. 颜色是否服务业务语义，语义色是否稳定。
5. 图标是否功能化，页面渲染文案是否使用纯文本。
6. 空态、加载态、错误态是否符合当前业务。
7. 列表、看板、详情是否保留用户当前上下文。
8. 新增/提交/编辑是否使用原生表单入口。
9. 首屏是否有视觉锚点、主操作、关键状态和至少两个信息层。
10. 自定义展示页是否在 PRD 中引用 `designFile` 和 `designRefs`，且 `design.md` 已写清视觉 DNA 和页面场景规则。
11. 工作台 / 业务首页是否避开“4 个等宽大 KPI 卡 + 图标快捷卡 + 大空态白卡”的低密模板；空数据是否用薄空态行和主操作入口承接。
12. 工作台、首页、门户、看板、展示页和业务入口页是否至少有 10 个有业务目的的区块以上，并且不是靠重复卡片或空白容器凑数；KPI 子项、快捷入口子项和列表行不能分别计数。

## 产出

```markdown
- designFile：<prd/<项目名>/design.md>
- designSystem：<themeProfile / Visual DNA / 基础版式 / visualScaffold / sceneRecipes>
- componentSpec：<按钮/表格/卡片/标签/抽屉/图标>
- stateSpec：<正常/禁用/加载/空态/错误/无权限>
- assetStrategy：<图片/图标/素材缺口/materialStatus>
- pageDesignRefs：<每个 display 页面在 PRD 中引用 design.md 的章节 ID>
- deAiChecks：<通过项和需要修正项>
```

## 下一步

→ [Step 6：写入 prd.md 和 design.md](step-6-handoff.md)
