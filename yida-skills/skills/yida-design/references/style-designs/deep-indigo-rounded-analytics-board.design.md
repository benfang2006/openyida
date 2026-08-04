---
version: alpha
name: deep-indigo-rounded-analytics-board
description: 适用于分析工作台、运营仪表盘和管理后台首页的内容中立页面风格规范，强调深色摘要舞台、柔白圆角面板、紫蓝数据纹理和高可扫读明细区。
design_id: deep-indigo-rounded-analytics-board
design_status: draft
scenes: [工作台, 仪表盘, 管理后台, 运营首页, 分析概览]
density: high
layout: A 指标优先
tone: 克制、专业、柔和、数据感、轻科技
tags: [分析工作台, 指标概览, 热力网格, 对比图表, 明细表, 玻璃卡片]
avoid: [品牌落地页, 内容文章页, 重表单录入页, 全暗大屏, 强营销页面]
visual_dna:
  - name: 深色顶部摘要舞台
    confidence: observed
    evidence: 截图首屏在浅色画布下方放置一条横向深色大圆角摘要区域，内部承载多张指标卡，底部有紫蓝渐变光带。
    rule: 新页面必须用深靛近黑色横向摘要区作为首屏视觉锚点，内部放置 3-6 个 `metric_card`，形成从页面标题到核心数据的强层级过渡。
    implementation_hooks: [summary_stage, primary_metrics, dark_surface, indigo_gradient, rounded-xl, glass_metric_card]
    failure_mode: 如果取消深色摘要舞台，页面会变成普通白底卡片仪表盘，丢失首屏记忆点和数据中心感。
  - name: 玻璃质感指标卡
    confidence: observed
    evidence: 摘要区内指标卡为半透明深色块，带细亮边框、柔和高光、图标小盒和大号数字。
    rule: `metric_card` 必须使用半透明暗面、1px 冷色边框、内层高光和紧凑图标盒；数值使用大字号，标签与图标同排。
    implementation_hooks: [metric_card, icon_tile, backdrop_filter, border-highlight, tabular_numbers]
    failure_mode: 如果指标卡改成实心白卡或默认统计卡，会削弱玻璃层次和深色舞台的一体感。
  - name: 柔白大圆角分析面板
    confidence: observed
    evidence: 中部图表与底部明细都使用白色或近白面板，面板圆角很大，阴影轻，边界柔和。
    rule: `trend_panel`、`comparison_panel`、`detail_table` 等主要内容区必须使用柔白表面、24-32px 大圆角、极淡阴影和充分内边距。
    implementation_hooks: [panel, card_radius, soft_shadow, off_white_surface, content_grid]
    failure_mode: 如果使用尖角、强描边或重阴影，页面会从柔和分析风格漂移为传统后台表格页。
  - name: 紫蓝数据纹理
    confidence: observed
    evidence: 热力格、色阶图例、条形图和高亮块都使用紫蓝色阶，深色高亮与浅色低值形成统一数据纹理。
    rule: 图表必须使用紫蓝色阶承载强弱关系，低值区域保持浅灰紫，高值使用饱和蓝紫；图表块本身保持圆角和规律间距。
    implementation_hooks: [heatmap_grid, chart_palette, legend_scale, comparison_bars, data_texture]
    failure_mode: 如果图表改成多彩随机配色或默认品牌蓝，页面会失去精致、克制的数据纹理。
  - name: 顶部工具胶囊与圆角体系
    confidence: observed
    evidence: 顶部操作区包含白色图标按钮和深色胶囊主按钮，所有按钮、标签、图表块和面板都沿用圆角语言。
    rule: `global_actions`、筛选器、分段控件、搜索按钮和标签必须使用一致的圆角胶囊或圆角方形，不引入尖角按钮和大面积彩色操作墙。
    implementation_hooks: [global_actions, pill_button, icon_button, segmented_control, search_button]
    failure_mode: 如果控件圆角不统一或主操作过于营销化，会破坏页面的高级感和可扫读性。
colors:
  bg-outer: "#F4F1EE"
  bg-subtle: "#F8F6F3"
  surface: "#FFFFFF"
  surface-muted: "#F3F1F7"
  surface-raised: "#FBFAF8"
  surface-dark: "#070C16"
  surface-dark-muted: "#141A2B"
  text-primary: "#111318"
  text-secondary: "#6F6D78"
  text-tertiary: "#9A98A4"
  text-inverse: "#F8F7FF"
  border-subtle: "#E8E4EC"
  border-strong: "#D8D2E3"
  border-on-dark: "rgba(255,255,255,0.22)"
  brand: "#4B45E8"
  brand-strong: "#312BD7"
  brand-soft: "#E7E5FF"
  accent-indigo: "#111844"
  accent-violet: "#8E86F7"
  success: "#20A06B"
  warning: "#C9861D"
  danger: "#D94D4D"
  chart-1: "#4B45E8"
  chart-2: "#6E66EC"
  chart-3: "#9E97F2"
  chart-4: "#C8C4F6"
  chart-5: "#E7E5F6"
typography:
  fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  page-title:
    fontSize: 48
    fontWeight: 650
    lineHeight: 1.08
    letterSpacing: 0
  section-title:
    fontSize: 28
    fontWeight: 620
    lineHeight: 1.2
    letterSpacing: 0
  card-title:
    fontSize: 18
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: 0
  body:
    fontSize: 15
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontSize: 13
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  metric-number:
    fontSize: 36
    fontWeight: 520
    lineHeight: 1.1
    letterSpacing: 0
    fontVariantNumeric: tabular-nums
spacing:
  page-x: 32
  page-y: 28
  section-gap: 28
  grid-gap: 24
  panel-x: 32
  panel-y: 28
  card-x: 20
  card-y: 18
  control-gap: 12
rounded:
  sm: 10
  md: 14
  lg: 20
  card: 24
  panel: 32
  stage: 28
  pill: 999
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    border: "1px solid rgba(17,19,24,0.04)"
    shadow: "0 18px 48px rgba(24,18,42,0.08)"
  dark_stage:
    backgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.stage}"
    gradient: "linear-gradient(180deg,#070C16 0%,#090E1C 70%,#2221A6 120%)"
  metric_card:
    backgroundColor: "rgba(255,255,255,0.10)"
    border: "1px solid rgba(255,255,255,0.20)"
    rounded: "{rounded.lg}"
  primary_button:
    backgroundColor: "{colors.accent-indigo}"
    color: "{colors.text-inverse}"
    rounded: "{rounded.md}"
  icon_button:
    backgroundColor: "{colors.surface}"
    color: "{colors.text-primary}"
    rounded: "{rounded.md}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: 截图未出现快捷入口；在同类页面中应放置于深色摘要舞台之后、主要图表之前或作为明细表上方工具带，使用柔白圆角面板、紫蓝轻量图标盒和短标签，继承圆角与数据纹理，不生成具体业务入口名。
---

# Deep Indigo Rounded Analytics Board DESIGN.md

## 1. 总览

这是一套面向分析工作台和运营仪表盘的通用视觉规范。它使用浅暖灰页面画布承载多个柔白圆角面板，并在首屏放置深靛近黑色摘要舞台，让核心指标先被看到，再向图表、对比和明细数据展开。

设计重点不是复制源页面的业务内容，而是复用它的视觉机制：深色摘要区建立强层级，玻璃指标卡承载核心数字，紫蓝色阶形成数据纹理，底部明细区保持高可扫读和轻分割。

适合在一个页面内同时呈现 `page_title`、`global_actions`、`primary_metrics`、`trend_panel`、`comparison_panel`、`quick_actions` 和 `detail_table`。具体业务名、指标名、表格行、人名、机构名和示例数据都必须替换为当前应用自己的内容或中性槽位。

## 2. 适用场景

适合：

- 分析工作台、运营仪表盘、管理后台首页、团队概览、数据概览页。
- 首屏需要突出 3-6 个关键指标，并在下方展示趋势、分布、对比和明细表。
- 需要专业、克制、轻科技感，但不希望做成全暗大屏的业务页面。
- 需要同时容纳图表和表格，并保持较高信息密度的应用。

不适合：

- 品牌落地页、内容文章页、作品集首页、强营销活动页。
- 以长表单录入为主的流程页面。
- 需要全屏沉浸式监控大屏、强霓虹或赛博视觉的页面。
- 极简低密度展示页，或需要大量插画表达的页面。

## 3. 视觉氛围

整体氛围是克制、专业、柔和的数据工具感。页面不是传统灰白后台，也不是强装饰型大屏；它用深色首屏摘要和紫蓝图表色阶提供识别度，用白色圆角面板保证长时间阅读不疲劳。

信息密度偏高，但区块之间有清晰留白。顶部标题大而直接，操作按钮紧凑靠右；主要区域采用大面板和规则网格，让用户能从核心指标扫到分析图，再继续处理明细数据。

视觉表达需要保持轻科技感：深色舞台、玻璃卡片、柔和高光、紫蓝数据色阶可以出现；夸张渐变背景、大面积插画、随机彩色图标和重投影不属于这套风格。

## 4. 视觉 DNA / 设计母体

| DNA | 置信度 | 可见证据 | 复用规则 | 实现钩子 | 失败表现 |
| --- | --- | --- | --- | --- | --- |
| 深色顶部摘要舞台 | observed | 首屏有一条横向深色大圆角区域，内部排列多张指标卡，底部出现紫蓝光带。 | 使用 `summary_stage` 承载 `primary_metrics`，深色区域宽度接近页面内容宽度，高度明显大于普通卡片。 | `summary_stage`、`dark_surface`、`indigo_gradient`、`primary_metrics` | 页面退化成普通白卡堆叠，首屏没有记忆点。 |
| 玻璃质感指标卡 | observed | 指标卡有半透明暗色背景、细亮边框、图标盒和大号数字。 | 每张 `metric_card` 包含 `metric_icon`、`metric_label`、`metric_value`，使用半透明面、细边框和内层高光。 | `metric_card`、`icon_tile`、`backdrop-filter`、`tabular-nums` | 指标卡像默认统计组件，和深色舞台割裂。 |
| 柔白大圆角分析面板 | observed | 图表区和表格区使用白色大圆角容器，阴影轻，内边距充足。 | 所有主分析区使用 24-32px 圆角、柔白表面和轻阴影；面板内部再用细分割或轻底色组织内容。 | `panel`、`trend_panel`、`comparison_panel`、`detail_table` | 页面变成硬边框后台，失去柔和高级感。 |
| 紫蓝数据纹理 | observed | 热力格、图例和对比条都使用紫蓝色阶，低值浅、高值深。 | 图表序列统一使用紫蓝色阶；热力格、柱状块、图例和高亮状态要共享同一组颜色 token。 | `heatmap_grid`、`legend_scale`、`chart_palette`、`comparison_bars` | 图表变成随机多彩或默认蓝绿，风格不再统一。 |
| 顶部工具胶囊与圆角体系 | observed | 顶部操作按钮、分段控件、搜索按钮和面板都采用明显圆角或胶囊。 | 操作控件用圆角方形、胶囊按钮和轻底色分段控件；按钮高度固定，文字不挤压。 | `global_actions`、`pill_button`、`icon_button`、`segmented_control` | 控件像普通后台按钮，和页面圆角系统不一致。 |

## 5. 色彩角色

| Token | 值 | 用途 |
| --- | --- | --- |
| `bg-outer` | `#F4F1EE` | 页面最外层浅暖灰画布，降低纯白刺眼感。 |
| `bg-subtle` | `#F8F6F3` | 面板之间的轻背景和页面局部底色。 |
| `surface` | `#FFFFFF` | 主面板、表格容器、弹窗表面。 |
| `surface-muted` | `#F3F1F7` | 分段控件、标签、浅色图表底块。 |
| `surface-dark` | `#070C16` | 顶部摘要舞台底色。 |
| `surface-dark-muted` | `#141A2B` | 深色舞台内的二级表面。 |
| `text-primary` | `#111318` | 页面标题、区块标题、表格主文本。 |
| `text-secondary` | `#6F6D78` | 说明、表头、辅助数值。 |
| `text-tertiary` | `#9A98A4` | 弱提示、图例辅助文字。 |
| `text-inverse` | `#F8F7FF` | 深色舞台上的标题、指标和按钮文字。 |
| `border-subtle` | `#E8E4EC` | 白色面板内部细分割线。 |
| `border-on-dark` | `rgba(255,255,255,0.22)` | 深色卡片边框和图标盒边框。 |
| `brand` | `#4B45E8` | 主强调、图表高值、选中状态。 |
| `brand-strong` | `#312BD7` | 深色按钮、强高亮块。 |
| `brand-soft` | `#E7E5FF` | 浅色选中底、低强度高亮。 |
| `chart-1` | `#4B45E8` | 图表主序列、高值热力格。 |
| `chart-2` | `#6E66EC` | 图表第二序列。 |
| `chart-3` | `#9E97F2` | 中值热力格和辅助柱。 |
| `chart-4` | `#C8C4F6` | 低值热力格。 |
| `chart-5` | `#E7E5F6` | 极低值底格和图例起点。 |

## 6. 字体规则

使用现代无衬线字体栈：`Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`。中文环境可追加 `PingFang SC, Microsoft YaHei`。

| 层级 | 字号 | 字重 | 行高 | 用途 |
| --- | --- | --- | --- | --- |
| `page_title` | 44-52px | 620-680 | 1.08 | 页面主标题，只在首屏顶部使用。 |
| `section_title` | 26-30px | 600-650 | 1.2 | 面板标题、摘要舞台标题。 |
| `card_title` | 17-19px | 580-620 | 1.3 | 指标标签、图表标题。 |
| `metric_value` | 34-40px | 500-560 | 1.1 | 指标数字，启用 `tabular-nums`。 |
| `body` | 14-16px | 400-500 | 1.5 | 表格、说明、控件文字。 |
| `caption` | 12-13px | 450-550 | 1.35 | 图例、弱说明、元信息。 |

所有文本 `letter-spacing` 默认为 `0`。不要用 viewport width 缩放字体；小屏通过断点改字号和换行策略处理。

## 7. 布局原则

页面壳使用浅暖灰背景，内容区域最大宽度建议 `1440-1560px`，桌面端左右留白 `28-40px`。首屏顺序固定为 `page_header`、`summary_stage`、`analysis_grid`，下方再进入 `detail_section`。

推荐桌面结构：

```text
page_shell
  page_header
    page_title
    global_actions
  summary_stage
    summary_title
    summary_subtitle
    primary_metrics
  optional_quick_actions
  analysis_grid
    trend_panel
    comparison_panel
  detail_section
    detail_header
    detail_tools
    detail_table
```

`summary_stage` 独占整行；`analysis_grid` 在桌面端可用 2:1 或 3:2 比例，主图表面板宽于辅助分析面板。`detail_section` 独占整行，表格列较多时允许横向滚动。

## 8. 层级与深度

层级来自颜色反差、圆角尺度、细边框和轻阴影，而不是厚重投影。深色摘要舞台可以使用轻微内发光和底部紫蓝渐变；白色面板使用 `0 18px 48px rgba(24,18,42,0.08)` 一类的柔和阴影。

深色舞台内部卡片使用半透明叠层和 1px 亮边框，形成玻璃感。白色分析面板内部不使用大面积暗色背景，只通过浅紫灰底、图例、细线和图表色阶增加层次。

表格行和图表网格不使用重阴影；它们通过分割线、留白、淡底色和局部高亮表达关系。

## 9. 形状

| 圆角 | 建议值 | 用途 |
| --- | --- | --- |
| `sm` | 10px | 图表热力格、标签、小图标块。 |
| `md` | 14px | 图标按钮、输入框、选择器、搜索按钮。 |
| `lg` | 20px | 指标卡、对比柱块、快捷入口项。 |
| `card` | 24px | 普通内容卡片、轻量面板。 |
| `panel` | 32px | 大图表面板、明细表容器。 |
| `stage` | 28-34px | 顶部深色摘要舞台。 |
| `pill` | 999px | 分段控件、胶囊按钮、状态标签。 |

圆角需要贯穿页面，不要在同一页面混用尖角表格、直角按钮和超大圆角卡片。

## 10. 组件样式

顶部栏：

- `page_header` 高度由标题和操作区自然撑开，底部与摘要舞台保持 `24-32px` 间距。
- `global_actions` 靠右排列，包含图标按钮、主操作按钮或轻量筛选器。
- 主操作使用深靛背景和白字，图标放在右侧或左侧都可以，但尺寸需与文字垂直居中。

按钮：

- 主按钮高度 `54-64px`，圆角 `14-18px`，背景使用 `accent-indigo` 或 `surface-dark-muted`。
- 次按钮使用白色或浅紫灰底，边框极淡。
- hover 时亮度提升 4-6%，或增加轻微上移 `translateY(-1px)`；active 时回落。
- disabled 降低透明度到 45%，保留形状和布局尺寸。

图标按钮：

- 使用 44-56px 方形圆角按钮，图标为线性图标，线宽 `1.75-2px`。
- 深色区域内图标盒使用半透明底和亮边框；浅色区域内图标盒使用白底或浅紫灰底。
- 纯图标按钮必须有 `aria-label` 或 tooltip 文案。

卡片 / 面板：

- 大面板使用白底、大圆角、轻阴影和 `28-36px` 内边距。
- 深色指标卡使用半透明面、亮边框、轻内阴影，避免实心亮色。
- 卡片内部标题区和内容区间距清晰，标题不要用过大的 hero 字号。

输入框 / 选择器 / 分段控件：

- 输入和选择器使用浅紫灰底或白底，圆角 `14-999px`，边框默认不抢眼。
- 分段控件外层为浅紫灰胶囊，选中项为白底或更亮底，带轻阴影。
- 搜索按钮可独立成圆角图标按钮，放在明细区右上。

表格 / 列表：

- 表格放在大圆角白色面板内，表头弱化，正文保持高对比。
- 行高建议 `64-76px`；行分割线使用 `border-subtle`。
- 首列可带小图标或头像槽位，但不复制源页面业务图标含义。
- 数字列启用 `tabular-nums`，缺省值保持居中或右对齐。

图表：

- 热力图使用小圆角方块和 `chart-1` 至 `chart-5` 色阶，低值格可接近背景色。
- 对比图使用圆角柱、斜纹填充或深色重点块，但色彩仍限制在紫蓝与浅紫灰范围。
- 图例必须轻量，颜色块与文字水平对齐，说明强弱关系但不绑定具体指标。
- 图表区域避免默认网格线过重。

标签 / 徽标：

- 标签使用浅紫灰底、圆角胶囊、`caption` 字号。
- 高亮标签可使用 `brand-soft` 背景和 `brand-strong` 文字。
- 状态不能只依赖颜色，必要时加图标、文字或形状差异。

弹窗 / 浮层：

- 使用白色或近白表面，圆角 `24px`，阴影比普通面板略强。
- 浮层按钮沿用页面圆角和深靛主按钮，不引入默认蓝色按钮。

## 11. 快捷入口区域

截图没有可见快捷入口，但来源类型属于分析工作台 / 仪表盘，应补充 `quick_actions` 规则，置信度为 `inferred`。

位置：

- 首选放在 `summary_stage` 之后、`analysis_grid` 之前，作为一条轻量工具带。
- 如果页面已经很高密度，可放在 `detail_section` 的顶部工具区，保持不抢深色摘要舞台的视觉主次。

容器：

- 使用柔白大圆角容器，圆角 `24px`，内边距 `18-24px`，轻阴影。
- 可选使用浅紫灰背景分组，但不要使用彩色宫格。

条目：

- 每个 `quick_action_item` 包含 `action_icon`、`action_label`、可选 `action_meta` 和 `action_badge`。
- 桌面端 4-8 个条目，采用等宽网格或横向排列；超过 8 个时分组或横向滚动。
- `action_icon` 使用圆角方形图标盒，线性图标，颜色来自 `brand` 或 `text-primary`。
- `action_label` 使用短文本；`action_meta` 使用弱灰小字，不生成具体业务入口名。

状态：

- hover：条目背景变为 `surface-muted`，图标盒出现浅紫高亮。
- active：轻微压低，背景加深一级。
- focus：出现 2px 紫蓝外描边，满足键盘可见性。
- disabled：整体透明度降低，不改变尺寸。
- loading：保留图标盒和文本位置，用骨架或小旋转指示器替代图标。

响应式：

- 桌面端 4-8 列或横向工具带。
- 平板端 2-4 列。
- 移动端 2 列或横向滚动，触控目标不小于 44px。

与 DNA 的关系：

- 快捷入口继承柔白圆角分析面板和顶部工具胶囊体系。
- 图标盒可使用轻玻璃感或浅紫蓝底，但不能引入与紫蓝数据纹理无关的多彩图标墙。

## 12. 页面结构配方

指标优先型：

```text
page_header
summary_stage
  summary_title
  summary_subtitle
  primary_metrics
quick_actions
analysis_grid
  trend_panel
  comparison_panel
detail_section
  detail_table
```

分析加处理型：

```text
page_header
summary_stage
  primary_metrics
analysis_grid
  trend_panel
  status_summary
quick_actions
detail_section
  detail_tools
  detail_table
  status_note
```

紧凑经营首页型：

```text
page_header
summary_stage
  primary_metrics
content_grid
  breakdown_panel
  comparison_panel
detail_list
```

## 13. 状态与交互

- hover：白色面板内的可点击项使用浅紫灰底或轻描边增强；不要使用高饱和大色块。
- active：按钮和快捷入口回落，阴影减弱，背景略加深。
- focus：所有按钮、筛选器、表格行操作和图表可交互点都要有 2px 紫蓝焦点环。
- loading：指标卡使用深色骨架，白色面板使用浅灰紫骨架；保留原布局尺寸，避免跳动。
- empty：使用中性空状态槽位 `empty_state`，可放线性图标和短说明，不放大型插画。
- error：用文字、图标和红色状态共同表达；错误块仍保持圆角体系。
- disabled：透明度降低到 40-50%，文字和图标仍可识别。
- selected：选中态使用 `brand`、`brand-soft` 和白底凸起，不使用随机颜色。
- reduced motion：关闭位移和渐变流动，仅保留颜色或边框变化。

## 14. 响应式

断点建议：

- `desktop >= 1200px`：摘要舞台整行；指标卡 3-6 列；分析区 2 列；明细表完整展示。
- `tablet 768-1199px`：指标卡 2-3 列；分析区改单列或 60/40；快捷入口 2-4 列。
- `mobile < 768px`：页面左右留白 `16px`；标题降到 `30-34px`；摘要舞台内指标卡纵向或横向滚动；分析区和表格区单列。

移动端表格使用横向滚动或卡片化列表。工具栏允许换行，按钮保持最小触控高度 `44px`。长标题允许两行，不能压缩到不可读字号。

## 15. 可访问性

- 正文与背景对比度至少达到 WCAG AA；深色舞台上的文字必须使用高亮白或浅灰。
- 纯图标按钮必须提供 `aria-label` 或 tooltip。
- 图表中的强弱关系不能只靠颜色，必要时加入图例、数值、纹理或标签。
- 所有可点击元素支持键盘 focus，并有可见焦点环。
- 表格表头和数据单元语义清晰，数字列使用一致对齐方式。
- 遵守用户的 reduced motion 设置，关闭非必要动画。

## 16. 实现适配

CSS 变量建议：

```css
:root {
  --oy-bg-outer: #f4f1ee;
  --oy-surface: #ffffff;
  --oy-surface-muted: #f3f1f7;
  --oy-surface-dark: #070c16;
  --oy-text-primary: #111318;
  --oy-text-secondary: #6f6d78;
  --oy-border-subtle: #e8e4ec;
  --oy-brand: #4b45e8;
  --oy-brand-strong: #312bd7;
  --oy-radius-panel: 32px;
  --oy-radius-card: 24px;
  --oy-shadow-panel: 0 18px 48px rgba(24, 18, 42, 0.08);
}
```

Ant Design：

- `borderRadius` 设置为 `14-16`，面板组件另行设置 `24-32px`。
- 主按钮 token 使用深靛色，不沿用默认亮蓝。
- `Table` 外层包裹大圆角白色容器，表头弱化，分页和搜索控件放在 `detail_tools`。
- `Segmented`、`Select`、`Input` 使用浅紫灰背景和胶囊形态。

Yida / Code Canvas：

- 页面根容器清除默认纯白背景，设置 `bg-outer`。
- 自定义页面首屏不要再包一层卡片；`summary_stage` 直接作为页面主区块出现。
- 图表库配色统一映射到 `chart-1` 到 `chart-5`。
- 表单入口、流程入口和报表入口若出现在页面中，放入 `quick_actions` 或 `global_actions`，不破坏主视觉顺序。

## 17. 必须包含

- 必须包含深色顶部摘要舞台，并用它承载首屏核心指标。
- 必须包含玻璃质感指标卡，指标卡需有图标盒、标签和大号数字。
- 必须使用柔白大圆角分析面板承载图表和明细。
- 必须使用统一的紫蓝数据纹理，热力格、图例、对比图和高亮态共享色阶。
- 必须保持顶部工具胶囊与圆角体系，按钮、筛选器、搜索和分段控件形状一致。
- 工作台、仪表盘、管理后台或运营首页必须包含 `quick_actions` 规则；截图未出现时按本文件的 inferred 规则生成。
- 所有业务内容必须替换为中性槽位或当前项目真实字段，不复制源图文字、指标名、表格行或示例数据。

## 18. 禁止项

- 禁止复制源截图中的具体业务标题、指标名称、表格人名、机构名、邮箱、示例日期或导出文案。
- 禁止把深色摘要舞台替换成普通白色统计卡网格。
- 禁止把玻璃指标卡改成默认实心卡片、强投影卡片或随机彩色卡片。
- 禁止在柔白分析面板中使用尖角、厚重边框、重阴影或拥挤内边距。
- 禁止让图表使用互不相关的多彩配色；紫蓝色阶必须贯穿主要数据纹理。
- 禁止把快捷入口做成默认彩色宫格、营销卡片、超大插画入口或与页面风格无关的图标墙。
- 禁止使用 viewport width 缩放字体，禁止负字距。
- 禁止让按钮、标签、搜索和分段控件出现互相冲突的圆角尺度。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 首屏全是白底统计卡，没有深色横向摘要区。 | 使用深色 `summary_stage` 作为首屏锚点，内部放置玻璃 `metric_card`。 |
| 指标卡使用默认白卡、粗阴影和高饱和图标。 | 指标卡使用半透明暗面、细亮边框、线性图标盒和大号数字。 |
| 图表随机使用红黄绿蓝多种颜色。 | 图表统一使用紫蓝色阶，低值浅、高值深，图例清晰。 |
| 大面板圆角小、边框重，像传统后台表格。 | 主面板使用柔白表面、24-32px 圆角、轻阴影和舒展内边距。 |
| 快捷入口是一排彩色营销卡片。 | `quick_actions` 使用柔白容器、浅紫图标盒、短标签和统一 hover/focus 状态。 |
| 直接保留源页面文字和示例数据。 | 使用 `page_title`、`primary_metrics`、`trend_panel`、`detail_table` 等中性槽位。 |

## 20. Agent 使用提示

使用本 DESIGN.md 生成新 UI 时，先把业务内容抽象为 `page_title`、`global_actions`、`primary_metrics`、`trend_panel`、`comparison_panel`、`quick_actions`、`detail_table` 等槽位，再填入当前应用自己的字段和数据。视觉 DNA 必须在内容替换后保留：深色顶部摘要舞台、玻璃质感指标卡、柔白大圆角分析面板、紫蓝数据纹理、顶部工具胶囊与圆角体系。若页面是工作台、仪表盘、管理后台或运营首页，即使需求未显式提到快捷入口，也按 `quick_actions` 规则生成内容中立的入口区。

## 21. 交付自检清单

- [ ] 源截图中的具体业务标题、指标名、人员信息、机构名、邮箱、日期和示例数据没有被复制。
- [ ] 页面包含深色顶部摘要舞台，并且它是首屏核心视觉锚点。
- [ ] 指标卡具有玻璃质感：半透明暗面、细亮边框、图标盒和大号数字。
- [ ] 主分析区和明细区使用柔白大圆角面板，圆角、阴影和内边距统一。
- [ ] 热力格、图例、对比图和高亮状态使用统一紫蓝色阶。
- [ ] 顶部操作、筛选器、搜索和分段控件继承圆角胶囊体系。
- [ ] 若生成工作台、仪表盘、管理后台或运营首页，已包含 `quick_actions` 或已说明该页面不需要快捷入口的理由。
- [ ] `quick_actions` 没有变成默认彩色宫格、营销卡片或插画入口。
- [ ] 所有图标按钮都有可访问标签或 tooltip。
- [ ] 表格和图表在移动端有明确折叠、横向滚动或卡片化策略。
- [ ] loading、empty、error、disabled、selected 和 focus 状态已设计。
- [ ] 字体没有使用 viewport width 缩放，`letter-spacing` 保持 `0`。
- [ ] 不依赖原截图，也能根据本文件生成一个内容不同但风格一致的新页面。
