---
version: alpha
name: lime-bento-ops-workbench
description: 适用于运营工作台、状态概览和管理后台首页的内容中立页面风格规范，强调浅灰画布、白色 bento 面板、荧光绿重点操作、黑绿对比图表和高密度明细表。
design_id: lime-bento-ops-workbench
design_status: draft
scenes: [工作台, 仪表盘, 管理后台, 运营首页, 状态概览]
density: high
layout: D 三栏协同
tone: 明亮、圆润、操作导向、清爽、轻量科技
tags: [bento 工作台, 荧光绿, 状态概览, 对比图表, 明细表, 快捷操作]
avoid: [品牌落地页, 内容文章页, 全暗大屏, 严肃审计台, 重表单录入页]
visual_dna:
  - name: 浅灰画布上的白色 bento 面板
    confidence: observed
    evidence: 截图使用浅灰页面背景，所有信息区都以白色大圆角面板分组，形成多列 bento 网格。
    rule: 新页面必须以浅灰画布承载 2-3 列白色大圆角面板，面板之间保持稳定间距，首屏形成可扫读的模块化工作台。
    implementation_hooks: [page_shell, bento_grid, white_panel, soft_shadow, rounded_panel]
    failure_mode: 如果改成全白背景或普通直角卡片，页面会失去轻量 bento 工作台的层次。
  - name: 荧光绿主操作与重点指标
    confidence: observed
    evidence: 主要操作按钮和重点指标卡使用高亮黄绿色，局部搭配深绿渐变。
    rule: 只在 `primary_action`、`highlight_metric`、进度完成段和关键成功状态使用荧光绿；其他区域保持黑白灰克制。
    implementation_hooks: [primary_action, highlight_metric, lime_gradient, progress_bar, success_badge]
    failure_mode: 如果荧光绿到处泛滥或被普通蓝色替代，页面会丢失鲜明操作导向。
  - name: 软圆角数据卡矩阵
    confidence: observed
    evidence: 中部指标卡以 2x2 矩阵排列，每张卡大圆角、浅灰底、右上角图标圆片、左下角趋势胶囊。
    rule: `metric_grid` 必须使用 2-4 张软圆角数据卡，每卡包含标题、主值、趋势胶囊和右上图标圆片；重点卡允许使用绿到深绿渐变。
    implementation_hooks: [metric_grid, metric_tile, icon_badge, trend_pill, rounded_card]
    failure_mode: 如果指标卡缺少趋势胶囊和图标圆片，会变成普通 KPI 列表。
  - name: 黑绿成组对比图表
    confidence: observed
    evidence: 右侧图表使用荧光绿斜纹柱与近黑色柱成组对比，背景有浅灰图表容器和虚线网格。
    rule: 对比类图表使用黑绿双序列，绿系列可加斜纹纹理，柱体必须大圆角；网格线保持浅灰虚线。
    implementation_hooks: [comparison_chart, paired_bars, lime_pattern, black_series, dashed_grid]
    failure_mode: 如果图表使用默认多色柱或尖角柱，视觉会偏离该风格的黑绿数据语言。
  - name: 工具化明细表与柔和控件
    confidence: observed
    evidence: 底部大表格位于白色面板中，右上有搜索和筛选控件，行内有复选框、状态点和更多操作。
    rule: `detail_table` 必须配备 `detail_tools`，搜索、筛选、复选框、状态点和更多操作都使用圆角轻控件，表格行高舒展但信息密度高。
    implementation_hooks: [detail_table, detail_tools, search_input, filter_button, checkbox, status_dot, row_actions]
    failure_mode: 如果明细区只是裸表格或缺少工具栏，页面会失去工作台的可操作性。
colors:
  bg-outer: "#F4F4F3"
  bg-subtle: "#F8F8F6"
  surface: "#FFFFFF"
  surface-muted: "#F2F2F1"
  surface-soft: "#F7F7F5"
  surface-dark: "#171813"
  surface-green-dark: "#064E3B"
  text-primary: "#191A17"
  text-secondary: "#62645F"
  text-tertiary: "#8B8E88"
  text-inverse: "#FFFFFF"
  border-subtle: "#E7E7E3"
  border-strong: "#D8DAD3"
  brand: "#A8FF2A"
  brand-strong: "#7CE31E"
  brand-dark: "#0B6B43"
  brand-soft: "#ECFFD8"
  success: "#35B979"
  warning: "#F2C94C"
  danger: "#EE4B4B"
  chart-lime: "#A8FF2A"
  chart-lime-soft: "#D9FF8B"
  chart-green: "#147A45"
  chart-black: "#1E1D18"
  chart-muted: "#ECEDEA"
typography:
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  page-title:
    fontSize: 52
    fontWeight: 620
    lineHeight: 1.08
    letterSpacing: 0
  page-subtitle:
    fontSize: 20
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  section-title:
    fontSize: 28
    fontWeight: 620
    lineHeight: 1.2
    letterSpacing: 0
  card-title:
    fontSize: 18
    fontWeight: 560
    lineHeight: 1.35
    letterSpacing: 0
  metric-number:
    fontSize: 40
    fontWeight: 540
    lineHeight: 1.1
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
  body:
    fontSize: 15
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  caption:
    fontSize: 13
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: 0
spacing:
  page-x: 28
  page-y: 28
  section-gap: 24
  grid-gap: 22
  panel-x: 28
  panel-y: 24
  card-x: 20
  card-y: 18
  control-gap: 12
rounded:
  sm: 10
  md: 14
  lg: 20
  card: 24
  panel: 28
  pill: 999
components:
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    border: "1px solid rgba(25,26,23,0.04)"
    shadow: "0 14px 36px rgba(30,32,27,0.06)"
  metric_tile:
    backgroundColor: "{colors.surface-muted}"
    rounded: "{rounded.card}"
  highlight_metric:
    background: "linear-gradient(180deg,#92F82F 0%,#0A6547 100%)"
    color: "{colors.text-inverse}"
    rounded: "{rounded.card}"
  primary_action:
    backgroundColor: "{colors.brand}"
    color: "{colors.text-primary}"
    rounded: "{rounded.pill}"
  secondary_action:
    backgroundColor: "{colors.surface-muted}"
    color: "{colors.text-primary}"
    rounded: "{rounded.pill}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: 截图未出现独立快捷入口区；同类页面应在首屏 bento 面板之后或左侧辅助面板中加入 `quick_actions`，使用白色或浅灰圆角容器、荧光绿主入口、线性图标圆片和短标签，不生成具体业务入口名。
---

# Lime Bento Ops Workbench DESIGN.md

## 1. 总览

这是一套面向工作台、运营首页和状态概览页的通用视觉规范。页面以浅灰画布为底，使用白色大圆角面板组成 bento 网格，把概览、重点指标、图表、进度、快捷操作和明细表放在同一个首屏工作区。

这套风格的核心不是任何具体业务，而是可复用的界面机制：明亮画布、模块化大圆角面板、荧光绿重点操作、黑绿对比图表、带工具栏的高密度明细表。所有业务标签、数值、货币、记录编号、活动名称和示例数据都必须替换为当前页面自己的内容或中性槽位。

适合在一个页面内组织 `page_title`、`page_subtitle`、`primary_summary`、`primary_action_pair`、`metric_grid`、`comparison_chart`、`progress_panel`、`quick_actions` 和 `detail_table`。

## 2. 适用场景

适合：

- 运营工作台、管理后台首页、状态概览、任务处理台、数据概览页。
- 页面需要同时呈现主摘要、次级指标、进度、图表和明细记录。
- 需要一个明亮、圆润、操作导向的工具界面。
- 需要用少量高亮色指引主操作，其余信息保持克制的页面。

不适合：

- 品牌营销页、内容阅读页、图文故事页、作品集首页。
- 全暗色监控大屏或沉浸式展示屏。
- 严肃审计、法律合规、传统政务等需要极强克制感的页面。
- 超长表单录入页，或以流程说明为主的页面。

## 3. 视觉氛围

整体氛围是明亮、圆润、亲和但仍偏工具化。页面不依赖复杂装饰，而是用稳定的 bento 网格和柔和卡片层级组织信息。

荧光绿是唯一强记忆色，负责主操作、重点指标和正向进度。黑色用于对比图表、深色展示块和局部强调。大量白色、浅灰和细边框让页面保持轻盈，适合长时间浏览和重复操作。

信息密度偏高，尤其是下方明细表；但每个区块都通过大圆角面板、充足内边距和清晰工具栏分开，避免传统后台的拥挤感。

## 4. 视觉 DNA / 设计母体

| DNA | 置信度 | 可见证据 | 复用规则 | 实现钩子 | 失败表现 |
| --- | --- | --- | --- | --- | --- |
| 浅灰画布上的白色 bento 面板 | observed | 整个页面是浅灰背景，主要内容由白色大圆角面板拼成多列网格。 | 使用 `bento_grid` 组织首屏，面板之间保持 22-28px 间距，所有主区块使用白色大圆角容器。 | `page_shell`、`bento_grid`、`panel`、`soft_shadow` | 变成全白页面或直角卡片后，层级和模块感会消失。 |
| 荧光绿主操作与重点指标 | observed | 主按钮、重点指标卡和进度条使用高亮黄绿色，形成强视觉指引。 | 荧光绿只用于 `primary_action`、`highlight_metric`、进度完成段和正向状态。 | `primary_action`、`highlight_metric`、`lime_gradient`、`progress_bar` | 绿色泛滥或改成默认蓝色后，操作引导不清晰。 |
| 软圆角数据卡矩阵 | observed | 中部指标区是 2x2 数据卡矩阵，卡片圆角大，右上角有图标圆片。 | `metric_grid` 中每个 `metric_tile` 都要包含标题、主值、趋势胶囊和右上图标圆片。 | `metric_grid`、`metric_tile`、`icon_badge`、`trend_pill` | 缺少趋势胶囊或图标圆片时，会退化为普通统计卡。 |
| 黑绿成组对比图表 | observed | 图表使用荧光绿柱和近黑柱成组排列，绿柱有斜纹，柱体圆角明显。 | 对比图表必须使用黑绿双序列、圆角柱和浅灰虚线网格；绿序列可使用斜纹纹理。 | `comparison_chart`、`paired_bars`、`lime_pattern`、`dashed_grid` | 多彩默认图表或尖角柱会破坏黑绿数据语言。 |
| 工具化明细表与柔和控件 | observed | 明细表右上有搜索和筛选控件，行内有复选框、状态点和更多操作。 | `detail_table` 必须带 `detail_tools`；控件统一白底或浅灰底、大圆角、细边框。 | `detail_tools`、`search_input`、`filter_button`、`checkbox`、`status_dot` | 裸表格缺少操作入口，页面会失去工作台属性。 |

## 5. 色彩角色

| Token | 值 | 用途 |
| --- | --- | --- |
| `bg-outer` | `#F4F4F3` | 页面外层浅灰画布。 |
| `bg-subtle` | `#F8F8F6` | 大面板内部的浅底区域。 |
| `surface` | `#FFFFFF` | 主面板、表格、浮层表面。 |
| `surface-muted` | `#F2F2F1` | 次级卡片、按钮底、输入底。 |
| `surface-soft` | `#F7F7F5` | 图表容器、表格表头、分组背景。 |
| `surface-dark` | `#171813` | 深色展示块、图表黑色序列。 |
| `surface-green-dark` | `#064E3B` | 重点指标渐变末端。 |
| `text-primary` | `#191A17` | 页面标题、主值、表格主文本。 |
| `text-secondary` | `#62645F` | 副标题、说明、表头。 |
| `text-tertiary` | `#8B8E88` | 弱说明、辅助元信息。 |
| `text-inverse` | `#FFFFFF` | 深色或渐变块上的文字。 |
| `border-subtle` | `#E7E7E3` | 面板边框、表格行分割、输入描边。 |
| `brand` | `#A8FF2A` | 主操作、重点高亮、图表亮色序列。 |
| `brand-strong` | `#7CE31E` | hover、进度强调和更强高亮。 |
| `brand-dark` | `#0B6B43` | 渐变深绿、强调成功背景。 |
| `brand-soft` | `#ECFFD8` | 正向趋势胶囊和浅色选中态。 |
| `success` | `#35B979` | 成功状态点。 |
| `warning` | `#F2C94C` | 进行中或提醒状态点。 |
| `danger` | `#EE4B4B` | 错误或风险状态点。 |
| `chart-lime` | `#A8FF2A` | 图表主亮色序列。 |
| `chart-black` | `#1E1D18` | 图表深色对比序列。 |
| `chart-muted` | `#ECEDEA` | 图表网格和底轨。 |

## 6. 字体规则

使用现代无衬线字体栈：`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`。中文环境可追加 `PingFang SC, Microsoft YaHei`。

| 层级 | 字号 | 字重 | 行高 | 用途 |
| --- | --- | --- | --- | --- |
| `page_title` | 48-56px | 600-660 | 1.08 | 页面问候式或概览式标题。 |
| `page_subtitle` | 18-21px | 400 | 1.45 | 页面说明，位于标题下方。 |
| `section_title` | 25-30px | 600-650 | 1.2 | 面板标题。 |
| `card_title` | 17-20px | 520-600 | 1.35 | 卡片标题和二级模块名。 |
| `metric_value` | 38-46px | 520-580 | 1.1 | 核心数值，启用 `tabular-nums`。 |
| `body` | 14-16px | 400-500 | 1.5 | 表格、按钮、说明文字。 |
| `caption` | 12-13px | 450-550 | 1.35 | 趋势、状态、辅助文本。 |

所有文本默认 `letter-spacing: 0`。不要用视口宽度缩放字体；移动端通过断点降低标题字号。

## 7. 布局原则

页面使用宽画布 bento 布局，最大内容宽度建议 `1500-1640px`，桌面端左右留白 `24-32px`。首屏标题区独占整行，下面进入 3 列内容网格。

桌面端推荐结构：

```text
page_shell
  page_header
    page_title
    page_subtitle
  bento_grid
    primary_summary_panel
    metric_grid_panel
    comparison_chart_panel
    progress_panel
    secondary_showcase_panel
    detail_panel
```

`primary_summary_panel` 用于承载主摘要和主次操作；`metric_grid_panel` 承载 2x2 指标卡；`comparison_chart_panel` 展示黑绿对比图；`detail_panel` 占据较宽区域，用于工具栏和明细表。

如果页面需要快捷入口，可放在 `primary_summary_panel` 下半区、`detail_panel` 上方，或作为独立 `quick_actions_panel` 插入 bento 网格。

## 8. 层级与深度

层级来自浅灰背景、白色面板、轻阴影、内部分组浅底和高亮色，而不是重投影。主面板阴影建议 `0 14px 36px rgba(30,32,27,0.06)`，边框使用几乎不可见的 `rgba(25,26,23,0.04)`。

重点指标可使用绿到深绿的纵向渐变，形成深度和注意力；普通指标卡使用浅灰底，不额外加重阴影。深色展示块可以带轻微模糊光斑或渐变，但不做强烈霓虹。

表格层级通过表头浅底、行分割线、选中行浅灰底和状态点表达，不使用厚边框。

## 9. 形状

| 圆角 | 建议值 | 用途 |
| --- | --- | --- |
| `sm` | 10px | 小标签、状态点容器、小图标底。 |
| `md` | 14px | 输入框、筛选按钮、复选框外框。 |
| `lg` | 20px | 指标卡、快捷入口项、图表柱体。 |
| `card` | 24px | 普通卡片、浅灰内层区域。 |
| `panel` | 28-32px | 主 bento 面板。 |
| `pill` | 999px | 主操作、趋势胶囊、状态胶囊。 |

圆角系统必须统一。不要在同一页面混入直角表格、尖角按钮或随机圆角组件。

## 10. 组件样式

页面标题：

- 标题大而轻，位于左上，不放进卡片。
- 副标题使用中灰色，限制为 1-2 行。

主摘要面板：

- 白色大圆角面板，内部包含 `summary_title`、`summary_value`、`summary_delta` 和 `primary_action_pair`。
- 主操作使用荧光绿胶囊按钮，次操作使用浅灰胶囊按钮。
- 内部可有 `sub_item_strip`，用浅灰底承载 2-4 个小信息项。

按钮：

- 主按钮高度 `52-64px`，背景 `brand`，黑色文字，圆角胶囊。
- 次按钮使用 `surface-muted`，文字为 `text-primary`。
- hover：主按钮亮度提升或轻微阴影；次按钮背景加深一级。
- active：按钮轻微压低，阴影减少。
- disabled：透明度降到 45%，保留尺寸。

图标按钮：

- 使用线性图标，放入圆形或圆角方形浅灰底。
- 指标卡右上图标圆片尺寸 `40-48px`。
- 纯图标按钮必须有 `aria-label` 或 tooltip。

指标卡：

- 普通 `metric_tile` 使用浅灰底、大圆角、右上图标圆片、左下趋势胶囊。
- 重点 `highlight_metric` 使用绿到深绿渐变，文字反白，右上图标可使用半透明白底。
- 趋势胶囊使用浅绿或浅红底，包含方向符号和短文本。

进度条：

- 进度面板使用白底，进度轨道为浅灰斜纹，完成段为深绿或荧光绿。
- 进度条高度 `14-18px`，圆角胶囊。
- 左右两端可放数值或状态说明，但用中性槽位命名。

图表：

- 对比柱图使用黑绿双序列，柱体圆角 `10-14px`。
- 绿序列可使用斜纹纹理，黑色序列使用近黑纯色。
- 图表容器内背景为浅灰或白色，网格线使用浅灰虚线。
- 图例使用小圆点或圆角短条，文字用 `caption`。

表格：

- 表格放在白色大圆角面板内，顶部必须有 `detail_header` 和 `detail_tools`。
- 工具区包含搜索、筛选、可选分段控件或批量操作。
- 表头使用浅灰底，行高 `60-72px`，行分割线很轻。
- 选中行使用浅灰底，复选框选中态使用近黑底和白色勾。
- 状态用小圆点加文字，不能只靠颜色。

输入框 / 筛选器：

- 搜索框高度 `52-58px`，圆角 `14-18px`，白底，浅描边。
- 筛选按钮与搜索框等高，图标使用线性样式。
- focus 使用 2px 荧光绿或深绿外描边。

深色展示块：

- 可用于 `secondary_showcase` 或重点资产展示，但业务内容必须替换为中性槽位。
- 背景为近黑或深绿渐变，内部可用浅色胶囊标签和弱装饰光。
- 不要出现具体编号、敏感信息或品牌标识。

## 11. 快捷入口区域

截图没有独立快捷入口区，但该页面属于工作台 / 仪表盘 / 管理后台类型，应补充 `quick_actions`，置信度为 `inferred`。

位置：

- 优先放在 `primary_summary_panel` 的操作按钮下方，作为 3-5 个短入口。
- 或放在 `detail_panel` 上方，作为进入常用任务的轻量工具带。
- 不要把快捷入口放成首屏最大区块，避免抢走主摘要和指标矩阵。

容器：

- 使用白色大圆角面板或浅灰内层容器。
- 内边距 `16-22px`，条目间距 `10-14px`。
- 继承 bento 面板阴影和圆角，不新增强烈彩色背景。

条目：

- 每个 `quick_action_item` 包含 `action_icon`、`action_label`、可选 `action_meta`、`action_badge`。
- 桌面端 4-8 个，使用 2-4 列网格或横向排列。
- 图标放在浅灰圆片中；唯一主入口可以用荧光绿圆片。
- 文案必须短，不生成具体业务入口名。

状态：

- hover：背景变为 `brand-soft` 或 `surface-soft`，图标圆片轻微变亮。
- active：条目压低 1px，背景加深一级。
- focus：2px 深绿或荧光绿外描边。
- disabled：透明度降低，图标和文字仍保留。
- loading：图标位置替换为小 loading 或骨架，不改变条目尺寸。

响应式：

- 桌面端 4-8 个入口。
- 平板端 2-4 列。
- 移动端 2 列或横向滚动，触控目标不小于 44px。

禁止漂移：

- 不做默认彩色宫格。
- 不做营销卡片或大插画入口。
- 不引入蓝紫、粉橙等与黑绿体系无关的图标墙。

## 12. 页面结构配方

三栏概览型：

```text
page_header
bento_grid
  primary_summary_panel
  metric_grid_panel
  comparison_chart_panel
  progress_panel
  secondary_showcase_panel
  detail_panel
```

操作优先型：

```text
page_header
primary_summary_panel
  summary_value
  primary_action_pair
  quick_actions
content_grid
  metric_grid
  comparison_chart
detail_panel
  detail_tools
  detail_table
```

明细处理型：

```text
page_header
status_summary
metric_grid
detail_panel
  detail_header
  search_input
  filter_button
  bulk_actions
  detail_table
```

## 13. 状态与交互

- hover：可点击卡片轻微上移 `translateY(-1px)`，阴影增加 8-12%，或浅灰底加深。
- active：按钮和条目回落，阴影减少。
- focus：输入、按钮、快捷入口、表格行操作必须有可见焦点环。
- loading：主值和表格行使用浅灰骨架；重点渐变卡保持背景不闪烁。
- empty：使用线性图标、短说明和一个中性主操作，不放大型插画。
- error：错误状态使用红色点、说明文字和重试按钮共同表达。
- disabled：降低透明度，禁止 hover 位移。
- selected：表格选中行使用浅灰底，复选框近黑底白勾。
- mobile：禁用 hover 位移，使用触控反馈。
- reduced motion：关闭位移和渐变动效，仅保留颜色或描边变化。

## 14. 响应式

断点建议：

- `desktop >= 1280px`：三列 bento 网格；主摘要、指标矩阵和图表同排；明细表可占 2 列宽。
- `tablet 768-1279px`：两列网格；图表和明细表改单列；快捷入口 2-4 列。
- `mobile < 768px`：单列堆叠；页面左右留白 `16px`；标题降到 `32-38px`；按钮可上下排列。

表格在小屏使用横向滚动或卡片列表。搜索与筛选控件允许换行，控件高度不小于 `44px`。长标题允许两行，不能压缩到不可读字号。

## 15. 可访问性

- 文本与背景对比度至少达到 WCAG AA，荧光绿按钮上的文字使用近黑色。
- 绿色、红色、黄色状态必须配合文字、图标或形状，不只靠颜色区分。
- 图表黑绿双序列需要图例；绿序列可用斜纹帮助区分。
- 纯图标按钮必须提供 `aria-label` 或 tooltip。
- 复选框、行操作、搜索和筛选都支持键盘访问。
- 遵守 reduced motion 设置。

## 16. 实现适配

CSS 变量建议：

```css
:root {
  --oy-bg-outer: #f4f4f3;
  --oy-surface: #ffffff;
  --oy-surface-muted: #f2f2f1;
  --oy-text-primary: #191a17;
  --oy-text-secondary: #62645f;
  --oy-border-subtle: #e7e7e3;
  --oy-brand: #a8ff2a;
  --oy-brand-strong: #7ce31e;
  --oy-brand-dark: #0b6b43;
  --oy-radius-panel: 28px;
  --oy-radius-card: 24px;
  --oy-shadow-panel: 0 14px 36px rgba(30, 32, 27, 0.06);
}
```

Ant Design：

- `borderRadius` 设置为 `14-16`，大面板单独使用 `28-32px`。
- 主按钮 token 使用荧光绿背景和近黑文字，避免默认蓝。
- `Table` 外层包裹白色大圆角面板，表头使用浅灰底。
- `Input`、`Select`、`Button` 高度统一在 `48-56px`，圆角 `14-18px`。

Yida / Code Canvas：

- 页面根容器设置浅灰背景，不再包一层全白根卡片。
- 首屏标题区直接暴露在画布上，不放入卡片。
- bento 面板使用 CSS grid 实现，移动端降为单列。
- 图表配色统一映射到 `chart-lime`、`chart-black` 和 `chart-muted`。
- 表单入口、流程入口、报表入口等常用动作放入 `quick_actions` 或 `primary_action_pair`，不得破坏 bento 网格。

## 17. 必须包含

- 必须使用浅灰画布和白色 bento 面板组成页面主体。
- 必须用荧光绿表达主操作、重点指标、进度完成段或正向状态。
- 必须包含软圆角数据卡矩阵，卡片具备右上图标圆片和趋势胶囊。
- 对比图表必须使用黑绿双序列、圆角柱和浅灰虚线网格。
- 明细表必须带搜索、筛选或批量操作等 `detail_tools`。
- 工作台、仪表盘、管理后台或运营首页必须包含 `quick_actions` 规则。
- 业务内容必须替换为中性槽位或当前项目真实字段，不复制源图标签、数值、编号、日期和示例记录。

## 18. 禁止项

- 禁止复制源截图中的问候语、产品名、金额、货币、账户名、记录编号、活动名称、日期和示例状态。
- 禁止把页面做成全白无层级，或把 bento 面板改成尖角卡片。
- 禁止让荧光绿铺满所有组件；它只能用于主操作和重点状态。
- 禁止把主操作按钮改成默认蓝色、红色或渐变彩虹按钮。
- 禁止把指标矩阵做成无图标、无趋势、无状态的普通数字列表。
- 禁止图表使用随机多彩柱体或尖角柱体。
- 禁止快捷入口变成默认彩色宫格、营销卡片或插画入口。
- 禁止使用 viewport width 缩放字体，禁止负字距。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 全白背景上堆普通卡片。 | 浅灰画布上排列白色大圆角 bento 面板。 |
| 所有按钮和标签都使用荧光绿。 | 只把荧光绿用于主操作、重点指标和正向进度。 |
| 指标区是普通四宫格数字，没有图标和趋势。 | 使用软圆角 `metric_tile`，包含右上图标圆片和趋势胶囊。 |
| 对比图表使用默认多色、尖角柱和重网格线。 | 使用黑绿双序列、圆角柱、浅灰虚线网格，绿序列可加斜纹。 |
| 明细区只有裸表格。 | 明细表上方必须有搜索、筛选或批量操作等 `detail_tools`。 |
| 快捷入口做成彩色宫格。 | `quick_actions` 继承白色面板、浅灰图标圆片和荧光绿主入口。 |
| 保留源图里的具体业务文字和示例数据。 | 使用 `primary_summary`、`metric_grid`、`comparison_chart`、`detail_table` 等中性槽位。 |

## 20. Agent 使用提示

使用本 DESIGN.md 生成新 UI 时，先把具体业务替换为 `page_title`、`page_subtitle`、`primary_summary`、`primary_action_pair`、`metric_grid`、`comparison_chart`、`progress_panel`、`quick_actions`、`detail_table` 等中性槽位，再填入当前项目字段。视觉 DNA 必须在内容替换后保留：浅灰画布上的白色 bento 面板、荧光绿主操作与重点指标、软圆角数据卡矩阵、黑绿成组对比图表、工具化明细表与柔和控件。若页面是工作台、仪表盘、管理后台或运营首页，按 `quick_actions` 规则生成内容中立的快捷入口区域。

## 21. 交付自检清单

- [ ] 源截图中的具体问候语、产品名、金额、货币、账户名、编号、活动名、日期和状态文案没有被复制。
- [ ] 页面使用浅灰画布，主体由白色大圆角 bento 面板组成。
- [ ] 荧光绿只用于主操作、重点指标、进度完成段或正向状态。
- [ ] 指标卡矩阵包含图标圆片、趋势胶囊和清晰主值。
- [ ] 对比图表使用黑绿双序列、圆角柱和浅灰虚线网格。
- [ ] 明细表包含搜索、筛选或批量操作等工具控件。
- [ ] `quick_actions` 存在，或已说明当前页面类型不需要快捷入口。
- [ ] 快捷入口没有变成默认彩色宫格、营销卡片或插画入口。
- [ ] 所有图标按钮都有可访问标签或 tooltip。
- [ ] 状态不只依赖颜色，配有文字、图标或形状辅助。
- [ ] 表格和 bento 网格在移动端有明确折叠方案。
- [ ] loading、empty、error、disabled、selected 和 focus 状态已设计。
- [ ] 字体没有使用 viewport width 缩放，`letter-spacing` 保持 `0`。
- [ ] 不依赖原截图，也能根据本文件生成一个内容不同但风格一致的新页面。
