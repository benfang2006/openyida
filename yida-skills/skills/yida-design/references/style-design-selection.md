# 生成 design.md 规则

本文件用于在 Step 5 为完整应用生成一份应用级 `prd/<项目名>/design.md`。生成流程必须先从业务上下文推演用户任务、信息拓扑和必需视觉 DNA，再选择唯一一个内置 `style-designs/*.md` 作为基础视觉母体，最后按主题色适配模板并输出自包含的 `design.md`。

业务对象、字段、表单、流程、导航、权限和页面结构都从当前 PRD 读取；模板只提供视觉 DNA、布局机制、组件机制、质量锚点和主题换肤规则，不提供业务内容。
`style-designs/_design-md-template.md` 是最终结构模板，只约束章节结构、字段完整度和描述粒度；内置 style-design 模板只提供可复用视觉母体。真实项目的配色、业务内容、资源关系、页面结构和实现交接必须从当前 PRD、应用主题和用户要求生成。

## 何时使用

| 页面类型 | 动作 |
| --- | --- |
| 工作台 / 门户首页 / 首页 | 选择一个工作台类 style-design 模板，生成 workbench 场景配方，把当前业务的视觉 DNA 落到首屏、指标、入口和侧栏 |
| 列表 / 管理页 / 处理台 | 选择能承载筛选、列表、详情抽屉和状态标签的模板，生成 list 场景配方 |
| 看板 / 驾驶舱 / 经营分析 | 选择能承载指标、图表、排行、异常和管理层摘要的模板，生成 dashboard 场景配方 |
| 官网 / 品牌页 / 落地页 | 当前 analytic workbench 模板通常不适合；按当前业务价值路径、素材清单、CTA 和 `assetStrategy` 生成 landing 场景配方 |
| 普通表单 / 流程表单 | 沿用应用级 `design.md` 的主题和平台原生表单，不单独选择设计文件 |

## 输入

从 Step 1-4 产物中提取：

| 信号 | 示例 |
| --- | --- |
| 用户任务 | 判断状态、处理待办、追踪阶段、分析趋势、管理明细、展示成果、汇报经营 |
| 业务对象 | 订单、客户、库存、项目、任务、审批、线索、合同、员工、门店 |
| 信息拓扑 | 摘要优先、图表优先、表格优先、时间轴优先、右侧上下文优先、深色焦点区优先 |
| 交互重心 | 搜索筛选、待办处理、下钻详情、多入口跳转、趋势比较、异常处置 |
| 数据形态 | KPI、队列、趋势、排行、明细表、日程、快捷入口、预警、阶段节点 |
| 页面区块 | 顶部概览、搜索筛选、表格、图表、右侧详情、表单入口、空态 |
| 主题证据 | 用户指定品牌、当前应用主题、工作区主题、业务气质、是否隐藏平台导航 |
| 圆角、密度与呼吸感 | 默认圆润高密且有呼吸感；卡片 padding >20px，卡片间 gap <20px，卡片圆角 0-32px，控件 10-14px，状态摘要 64-88px，列表行 44-56px；区块间距用于分组和扫读，不用于撑空白 |

## 选择流程

1. 读取 [style-designs/registry.md](style-designs/registry.md)，了解可选模板和选择规则。
2. 读取 [style-designs/_design-md-template.md](style-designs/_design-md-template.md)，用它作为最终 `design.md` 的结构基准。
3. 从业务上下文推演 `inferredUserTask`、`inferredInformationTopology` 和 `interactionFocus`。用户通常不会主动描述视觉结构，agent 必须自行推演。
4. 基于业务对象和信息拓扑推演 `requiredVisualDNA`，例如多指标摘要命中指标拼图、阶段节点命中时间轴、待办提醒命中右侧明细流、结构化记录命中圆角明细表。
5. 对 registry 中的模板做硬过滤：纯表单、长文、品牌营销、移动端单任务、未要求暗色时，不选择明显不合适的分析工作台模板或深色模板。
6. 按 `业务任务匹配 30% + 信息拓扑匹配 25% + 视觉 DNA 命中 30% + 实现稳定性 10% - 风险扣分 5%` 选择唯一模板。
7. 读取被选中的 `style-designs/*.md`，抽取 `visual_dna`、`theme_adaptation`、`layout_stability`、`quality_anchors`、`components` 和 `modules`。
8. 根据 Step 2 的主题色来源和主题色输入，按模板 `theme_adaptation` 执行换肤：替换 `replace_tokens`，派生 `derive_tokens`，保留 `preserve_tokens` 和 `visual_dna.invariant`。
9. 读取 [visual-scaffold-recipes.md](visual-scaffold-recipes.md)，把当前页面组合映射到统一 `visualScaffold` 规则。
10. 读取 [page-quality-gates.md](page-quality-gates.md)，把质量门禁补进 `acceptanceChecks`。
11. 需要判断详略时参考 `_design-md-template.md` 的字段粒度、registry 的输出记录和所选模板的质量锚点；只学习“写到多细”，不复制示例业务、色盘、字段、页面顺序或组件组合。
12. 根据行业、品牌、业务情绪、应用主题和用户偏好生成配色。不要固定使用蓝色、绿色、紫色或任何预置色，也不要复用历史样例色盘。
13. 写入 `densityRule`、`breathingRule`、`spacing` 和 `rounded` 的具体数值。默认业务工具页使用 high density + 圆润形状 + 有呼吸感的分组节奏：页面边距 20-28px，卡片与卡片 gap 12-18px 且必须小于 20px，卡片 padding 默认 22-28px 且必须大于 20px，卡片圆角范围 0-32px；只有品牌展示、官网或用户明确要求舒展时才降低密度。
14. 写入 `surfaceContrast`：页面背景与卡片背景必须形成明显层次对比，不可相近或相同；默认浅色背景保持清爽，但必须按“白色/浅色背景 + 有边框卡片、浅灰背景（如 `#F3F4F6`）+ 白色无边框卡片、浅彩色背景 + 白色无边框卡片、渐变背景 + 玻璃感卡片”四类方案选择。
15. 写入 `emptyStateRecipe` 和 `acceptanceChecks`：空态必须是薄行、面板内提示或右侧上下文，不使用 160px 以上大白卡；状态摘要不能是横跨整页且内容稀疏的空矩形。
16. 如果平台导航可见，页面主按钮、链接、选中态、重点标签和图表主序列默认跟随应用主题；自定义色盘只能作为辅助色、浅背景、图表第二序列或页面级独立主题。

## 视觉 DNA 推演规则

| 业务信号 | 推荐 DNA |
| --- | --- |
| 3 个以上核心指标、需要快速比较状态 | 指标拼图、等高指标卡、深色摘要舞台 |
| 趋势、周期、对比、分布或进度数据 | 轻网格图表、图表洞察面板、纹理化对比图 |
| 待办、提醒、异常、审批、消息或事件流 | 右侧明细流、右侧洞察栏、侧向洞察摘要栈 |
| 订单、客户、库存、任务、交易或结构化记录 | 圆角明细表、图标化行、工具化表格壳 |
| 阶段、里程碑、日程、流程节点或周期追踪 | 时间轴节点、左侧指标栈、趋势面板 |
| 管理层汇报、核心指标焦点、用户明确深色或高对比 | 深色指标舞台、玻璃态指标卡、数据纹理 |
| 搜索、筛选、导出、时间范围或全局命令频繁出现 | 顶部轻量命令栏、标签筛选、紧凑工具栏 |

## 主题色应用规则

主题色是 style-design 模板的换肤输入，不是重新选择视觉风格的理由。生成 `design.md` 时必须先读取所选模板的 `theme_adaptation`，将主题色应用到 `replace_tokens` 和 `derive_tokens`，保持 `preserve_tokens` 与 `visual_dna.invariant` 不变。

硬规则：

1. 换 hue，不换 DNA。
2. 换 token，不换结构。
3. 换强调色，不改画布、面板、中性色、布局机制。
4. 平台导航可见时，页面主按钮、链接、选中态、重点标签和图表主序列默认跟随应用主题 `--color-brand1-*`。
5. 模板默认色只在没有任何主题证据时作为 `template-default` 兜底，并必须写入 `themeProfile.themeColorSource`。

## 主题关系判定

| 场景 | 主题关系写法 | 落地规则 |
| --- | --- | --- |
| 平台导航 / 应用菜单可见 | `跟随应用主题` | 主按钮、链接、选中态、重点标签、图表主序列使用应用主题；模板色相仅作为辅助色、浅背景、图表第二序列或装饰色 |
| 生成色盘与应用主题不同 | `应用主题主导，生成色彩作为辅助色` | 保留模板视觉 DNA、布局、密度和组件语言，不把页面主色改成与应用主题冲突的色相 |
| 用户要求全局换肤 / 导航也一起变色 | `应用级换肤` | 输出 `themeScope=app`，实现阶段更新应用主题或壳层主题；自定义色盘写 `customThemeStyle.tokens` |
| 隐藏平台导航、独立品牌页、活动页、公开落地页 | `页面级独立色盘` | 输出 `themeScope=page` 和独立色盘原因，页面内注入 `style#yida-global-theme` 或 scoped CSS vars |

## 输出字段

Step 5 生成 `design.md`，并让 PRD 的每个自定义展示页只引用它：

| 字段 | 写入位置 | 写法 |
| --- | --- | --- |
| baseDesignSource | design.md | `references/style-designs/<selected-template>.md`；所有模板不适用时才写 `generated-from-business-context` |
| styleDesignSelection | design.md | 记录用户任务、信息拓扑、必需 DNA、选中模板、拒绝模板和置信度 |
| themeAdaptationResult | design.md | 记录输入主题色、换肤策略、替换 token、保留 DNA 和保留机制 |
| designFile | PRD pageSpecHandoff | `prd/<项目名>/design.md` |
| designRefs | PRD pageSpecHandoff | 当前页面引用 design.md 的章节 ID |
| 风格理由 | PRD 页面章节 | 一句话说明为什么适合当前页面任务；不复制完整视觉规则 |
| 视觉 DNA | design.md | 所有页面都必须保留的 2-5 个视觉 DNA |
| 页面区块 | PRD 页面章节 | 当前业务页面实际需要的区块 |
| 主题关系 | design.md + PRD 摘要 | 默认写“跟随应用主题”；若生成色相不同，写“应用主题主导，生成色彩作为辅助色”；只有独立页面才说明页面级独立色盘原因 |
| visualScaffold | design.md | layoutRecipe、surfaceMap、sectionRhythm、densityRule、breathingRule、componentRecipe、emptyStateRecipe、acceptanceChecks |
| rounded / spacing / breathing | design.md | 大圆角、紧凑间距和呼吸节奏的具体数值，不能只写“圆润”“留白舒适”“有呼吸感” |

## 实现交接

实现阶段读取 PRD 中的 `designFile/designRefs`，再读取当前项目 `design.md`，并按以下方式落地：

| design.md 内容 | 实现落点 |
| --- | --- |
| styleDesignSelection | 理解视觉母体来源和禁止偏移点；实现阶段不再回读模板目录 |
| themeAdaptationResult | CSS token、按钮、链接、选中态、图表辅助色和运行时主题注入 |
| 视觉 DNA | 首屏、指标、列表、图表、侧栏、状态标签 |
| 布局配方 | 页面栅格、区域顺序、区块比例 |
| 组件规则 | 卡片、表格、按钮、筛选、抽屉、标签 |
| 状态规则 | 空态、加载、错误、无权限、禁用、选中 |
| visualScaffold | 实现阶段先按槽位填业务内容，再写样式；任何页面实现不得跳过 |
| rounded / spacing / densityRule / breathingRule | Code Canvas 的 CSS、antd token、列表行高、面板内距、卡片 gap、空态高度和首屏分组节奏；实现阶段必须保持卡片 padding >20px、卡片 gap <20px、卡片圆角 0-32px |

业务文案、字段、表单入口、流程处理、详情链接和导航顺序都从 PRD 读取；当前项目 `design.md` 提供所有页面必须遵守的视觉 DNA、布局、组件样式、主题 token 和状态规则。
