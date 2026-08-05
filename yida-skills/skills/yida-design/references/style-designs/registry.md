# style-design 内置模板注册表

本目录提供 `yida-design` Step 5 生成 `prd/<项目名>/design.md` 时可选择的内置视觉 DNA 模板。生成 `design.md` 时必须先基于业务任务、信息拓扑和视觉 DNA 选择唯一一个 `style-designs/*.md` 作为基础视觉母体，再结合主题色和当前 PRD 生成最终自包含的 `design.md`。

`_design-md-template.md` 仍是结构模板；它不参与视觉风格选择。实现阶段只读取当前项目的 `prd.md` 和 `design.md`，不回读本目录。

默认审美方向是“圆润、高密且有呼吸感”：卡片 padding 默认 22-28px 且必须大于 20px，卡片与卡片的 gap 默认 12-18px 且必须小于 20px，卡片圆角范围 0-32px，控件使用 10-14px 圆角，状态摘要、动作条、列表行和空态保持紧凑；页面主区、右栏、工具条和列表之间要有稳定分组节奏。呼吸感不是大留白；不得用额外 margin、超高空态或超宽空状态框撑出页面面积。

## 基础文件

| 文件 | 类型 | 用途 | 使用规则 |
| --- | --- | --- | --- |
| `_design-md-template.md` | structure-template | `design.md` 完整结构和字段完整度参考 | 必读；最终产物章节和字段完整度必须对齐它 |

## 可选 style-design 模板

| 模板 | 适合任务 | 信息拓扑 | 关键视觉 DNA | 避免场景 |
| --- | --- | --- | --- | --- |
| `soft-analytic-workbench.md` | 通用数据工作台、运营首页、管理后台首页、分析列表页 | 摘要 + 图表 + 右侧列表 + 明细表均衡承载 | `metric_mosaic_header`、`light_analytic_charts`、`side_detail_stream`、`rounded_table_detail` | 品牌叙事页、沉浸大屏、低信息展示页 |
| `soft-bordered-analytic-workbench.md` | 运营控制台、需要搜索筛选和全局命令的工作台 | 顶部命令栏 + 深色摘要舞台 + 图表洞察 + 明细承载 | `command_toolbar`、`dark_summary_stage`、`chart_with_side_insights`、`split_detail_surface` | 营销落地页、长文页、强图片展示页 |
| `soft-modular-analytic-workbench.md` | 模块多、指标多、趋势和明细并重的复杂工作台 | 模块化网格 + 大摘要 + 指标拼图 + 内嵌洞察 + 明细表 | `airy_page_shell`、`mixed_scale_summary_grid`、`contained_insight_panel`、`refined_detail_table` | 单一步骤表单、内容阅读页、低密展示页 |
| `soft-progress-analytics-workbench.md` | 进度追踪、周期分析、任务概览、明细管理工作台 | 左侧优先级指标栈 + 右侧时序节点 + 趋势面板 + 明细表 | `left_priority_metric_stack`、`floating_milestone_timeline`、`crafted_trend_panel`、`rounded_utility_detail_table` | 无阶段/周期语义的普通后台、单一表单、图片优先页面 |
| `soft-timeline-analytics-workbench.md` | 进度追踪、阶段管理、周期分析、里程碑工作台 | 左侧指标栈 + 时间轴节点 + 趋势面板 + 明细表 | `left_metric_stack`、`floating_timeline_panel`、`refined_trend_panel`、`rounded_detail_table` | 没有时间/阶段语义的普通后台、图片优先页面 |
| `teal-rail-analytics-workbench.md` | 需要常驻右侧洞察栏的运营分析、排行提醒、状态追踪 | 左宽主工作区 + 右侧洞察栏 + 标签筛选 + 明细表 | `split_main_with_right_insight_rail`、`layered_chart_analytics_panel`、`tabbed_toolbar_detail_table` | 移动端单任务页、沉浸大屏、低信息展示页 |
| `dark-stage-analytic-dashboard.md` | 管理层看板、核心指标展示、明确要求深色焦点或高对比 | 深色指标舞台 + 白底分析面板 + 数据纹理 + 宽松明细表 | `dark_metric_stage`、`glass_metric_cards`、`micro_texture_visualization`、`rounded_detail_table` | 纯表单、长文阅读、普通移动流程、用户未要求的暗色沉浸 |
| `contrast-command-analytics-workbench.md` | 命令入口、日程协同、分析图表和明细记录并存的工作台 | 大标题 + 分段表现图 + 事件流 + 深色命令面板 + 媒体化明细表 | `oversized_identity_bar`、`segmented_performance_panel`、`dark_assistant_command_panel`、`refined_record_table` | 纯表单、单一表格、低信息展示页 |
| `blue-productivity-insight-workbench.md` | 任务中心、周期分析、行动跟进、记录管理工作台 | 指标横排 + 大幅柱状图 + 右侧行动栏 + 工具化记录表 | `command_filter_header`、`bordered_metric_row`、`large_bar_analytics_panel`、`stacked_action_rail` | 图片优先页面、单一长表单、无行动队列页面 |
| `aqua-service-progress-dashboard.md` | 服务门户、进度追踪、资源状态、媒体和上下文混合概览 | 宽松状态头 + 左侧时间轴 + 中心进度评分 + 渐变状态卡 + 媒体/上下文卡 | `airy_status_header`、`schedule_or_timeline_column`、`progress_score_panel`、`gradient_status_chart_card` | 密集表格后台、暗色大屏、高压交易页面 |
| `blue-insight-operations-dashboard.md` | 运营概览、管理看板、团队状态、活动追踪页 | 火花线指标卡 + 主面积趋势图 + 右侧洞察卡 + 活动表 + 进度列表 | `sparkline_metric_cards`、`primary_area_trend_panel`、`pastel_insight_stack`、`activity_table_panel` | 图片展示页、纯表单、低信息门户 |
| `green-timeline-progress-workbench.md` | 进度追踪、阶段管理、周期任务和明细记录工作台 | 左侧主摘要指标栈 + 右侧浮动时间轴 + 趋势图 + 全宽明细表 | `green_priority_summary_stack`、`floating_date_timeline`、`polished_line_trend_panel`、`full_width_detail_table` | 无时间/阶段语义页面、纯表单、图片优先页面 |
| `filterable-card-catalog.md` | 筛选目录页、搜索结果页、资源选择页、卡片列表页 | 左侧筛选栏 + 顶部结果工具条 + 条件胶囊 + 等高卡片矩阵 | `left_filter_rail`、`result_toolbar_with_chips`、`uniform_media_card_grid`、`compact_value_and_meta`、`small_area_accent_actions` | 纯表单、长文阅读、深色大屏、复杂图表分析工作台 |
| `soft-curated-filter-gallery.md` | 视觉型目录页、候选对象浏览页、分类筛选页、资源挑选页 | 大标题 + 胶囊分类切换 + 柔和筛选面板 + 大图卡片画廊 | `headline_tabs_toolbar`、`soft_filter_canvas`、`oversized_visual_cards`、`corner_badges_and_favorites`、`visual_range_histogram` | 高密表格后台、复杂图表看板、流程表单、长文阅读 |
| `command-filter-card-console.md` | 资源管理目录、对象管理控制台、可搜索卡片库、状态筛选列表 | 边框筛选面板 + 状态标签工具条 + 紧凑管理卡片 + 底部分页 | `bordered_filter_drawer_panel`、`command_toolbar_status_tabs`、`compact_admin_card_grid`、`bottom_pagination_bar`、`swatch_and_range_filters` | 强视觉陈列、品牌展示页、长流程表单、沉浸媒体页 |

## 消费硬规则

1. 先读取 `_design-md-template.md`，按当前业务生成新的 `prd/<项目名>/design.md`。
2. 每次优先选择唯一一个 `style-designs/*.md` 作为 `baseDesignSource`；若所有模板都不适合，才写 `generated-from-business-context`，并记录拒绝原因。
3. 配色由模型根据行业、品牌、应用主题、业务情绪和用户偏好生成；主题色只换 token 和强调色，不改变模板 DNA、布局机制和组件机制。
4. 圆角、间距、密度和呼吸感必须由当前业务决定，但卡片数值要明确：卡片 padding >20px、卡片间 gap <20px、卡片圆角 0-32px、控件 10-14px、状态摘要 64-88px、列表行 44-56px、空态 88-120px 内。
5. `design_id` 使用当前项目生成的 slug，例如 `<业务域>-<体验关键词>-generated`。
6. 每个自定义页面最终只读取当前项目 `prd.md` 和 `design.md`；实现阶段不回读本目录。

## 选择原则

1. 先从业务需求推演用户任务、业务对象、信息拓扑和交互重心，再匹配模板视觉 DNA；不要按行业或主题色直接选模板。
2. 主题色只作为所选模板的 `theme_adaptation` 输入，用于替换强调色 token；主题色不是选择模板的主要依据。
3. 用户一般不会主动描述视觉结构，agent 必须从 PRD 和 Step 1-4 产物中推演 `requiredVisualDNA`。
4. 每次必须选择唯一一个 `style-designs/*.md` 作为 `baseDesignSource`。若所有模板都不适合，仍读取 `_design-md-template.md` 输出 `baseDesignSource=generated-from-business-context`，并在 `styleDesignSelection.rejectedStyleDesigns` 说明原因。
5. 不得为了套模板凭空创造 PRD 未要求的图表、右侧栏、时间轴、深色舞台或快捷入口；模板只能决定已有业务内容的视觉承载方式。
6. 最终 `design.md` 必须自包含：包含模板来源、选择依据、主题换肤结果、视觉 DNA、token、组件、状态、响应式、可访问性和实现契约。

## 选择评分建议

| 维度 | 权重 | 判断方法 |
| --- | --- | --- |
| 业务任务匹配 | 30% | 页面主要用于判断、处理、追踪、分析、展示还是汇报 |
| 信息拓扑匹配 | 25% | 摘要、图表、明细表、时间轴、右侧上下文、深色焦点区哪个最关键 |
| 视觉 DNA 命中 | 30% | 模板 `visual_dna` 是否能承载当前业务结构 |
| 实现稳定性 | 10% | 是否能在 PC/移动端、平台导航和 Code Canvas 中稳定落地 |
| 风险扣分 | -5% | 是否会强行制造不存在的模块、过度依赖图表、右侧栏、时间轴或深色舞台 |

## 输出记录

最终 `design.md` 必须记录：

```yaml
baseDesignSource: references/style-designs/<selected-template>.md
styleDesignSelection:
  inferredUserTask: <判断 / 处理 / 追踪 / 分析 / 展示 / 汇报>
  inferredInformationTopology: <摘要优先 + 趋势承接 + 明细落地>
  requiredVisualDNA:
    - <dna-id>
  selectedStyleDesign:
    name: <template-name>
    source: references/style-designs/<template>.md
    reason: <为什么该模板最适合当前业务>
  rejectedStyleDesigns:
    - <template-name>: <为什么不选>
  selectionConfidence: <high / medium / low>
```

## 新增模板规则

新增 `style-designs/*.md` 时，必须包含：

- front matter 中的 `template_type: visual_dna_preset`。
- `selection.best_for`、`selection.user_intent`、`selection.visual_tone`、`selection.avoid_for`。
- 2-5 个可稳定复用的 `visual_dna`，每个 DNA 要有 `id`、`hooks`、`invariant`、`variable`。
- `theme_adaptation`，明确 `replace_tokens`、`derive_tokens`、`preserve_tokens` 和换肤规则。
- `quality_anchors`、`layout_stability`、`components` 和 `modules`，让最终 `design.md` 能抽取为可实现规则。
