---
version: alpha
name: deep-indigo-glass-analytics-workbench
description: 适用于分析型工作台、运营概览页和管理后台首页的内容中立视觉规范。以浅色柔和画布承载深靛色摘要舞台、玻璃质感指标卡、紫蓝数据纹理和圆角白色分析面板，适合需要同时展示核心指标、热力数据、对比分析和明细表的页面。
design_id: deep-indigo-glass-analytics-workbench
design_status: ready
status: ready
scenes: [工作台, 仪表盘, 管理后台, 运营首页, 分析概览]
density: high
layout: A 指标优先
tone: 克制, 科技, 柔和, 数据感, 专业
tags: [分析工作台, 指标概览, 热力图, 对比分析, 明细表, 数据运营, 管理后台]
avoid: [品牌落地页, 内容文章页, 重表单录入页, 强营销页面, 低密度宣传页]
visual_dna:
  - name: 深靛色首屏摘要舞台
    confidence: observed
    evidence: 截图首屏核心摘要区使用接近黑蓝的整宽大圆角容器，底部叠加紫蓝光感。
    rule: 新页面必须在首屏保留一个深色摘要舞台，承载页面关键说明和一组核心指标卡。
    implementation_hooks: [hero_summary, primary_metrics, CSS background, radial-gradient, large-radius-container]
    failure_mode: 如果去掉深色舞台，页面会退化成普通白底卡片后台，失去第一屏识别度。
  - name: 玻璃质感指标卡
    confidence: observed
    evidence: 指标卡位于深色舞台内部，使用半透明深色表面、浅色描边、柔和高光和大数字。
    rule: KPI 卡必须使用半透明深色面板、细描边、轻微内高光和大号数字，不能改成纯白普通卡。
    implementation_hooks: [metric_card, translucent-surface, border-highlight, numeric-type]
    failure_mode: 如果指标卡变成默认白卡或硬边框卡，摘要区的深度和科技感会明显丢失。
  - name: 紫蓝热力数据纹理
    confidence: observed
    evidence: 主分析卡中出现由浅灰到紫蓝的圆角热力格，并配有 Less/More 强度图例。
    rule: 数据密集区优先使用紫蓝色阶、圆角小格、弱网格和图例表达强弱变化。
    implementation_hooks: [heatmap_panel, chart_legend, color-scale, data-cell-radius]
    failure_mode: 如果改成普通折线图或随机彩色图表，页面会失去细腻的数据纹理。
  - name: 柔白圆角分析面板
    confidence: observed
    evidence: 中下部分析区和明细区使用白色大圆角面板，边缘有非常轻的阴影和低对比分割。
    rule: 详情、图表和表格必须放在柔白大圆角面板中，用低对比边界维持干净层级。
    implementation_hooks: [analysis_panel, detail_table, soft-shadow, subtle-border]
    failure_mode: 如果面板使用强阴影、硬边框或灰色重底，页面会变得笨重且廉价。
colors:
  bg-outer: "#F6F3F1"
  surface: "#FFFFFF"
  surface-muted: "#F3F1F7"
  surface-soft: "#FAF9FB"
  text-primary: "#090A12"
  text-secondary: "#6F6D78"
  text-tertiary: "#9A96A5"
  border-subtle: "#E9E6EF"
  border-strong: "#C8C3DD"
  brand: "#4C45E8"
  brand-soft: "#E9E7FF"
  brand-muted: "#A9A2EE"
  ink-stage: "#070B16"
  ink-stage-2: "#10143A"
  chart-1: "#4B43E8"
  chart-2: "#6A62EA"
  chart-3: "#9F98EC"
  chart-4: "#DCD9F6"
  success: "#20966D"
  warning: "#B7791F"
  danger: "#D94343"
typography:
  page-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"
    fontSize: 40
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: 0
  section-title:
    fontSize: 26
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0
  metric-number:
    fontSize: 38
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: 0
  body:
    fontSize: 15
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
spacing:
  page-x: 24
  page-y: 24
  grid-gap: 24
  panel-x: 32
  panel-y: 28
  card-x: 22
  card-y: 20
rounded:
  sm: 10
  md: 16
  card: 18
  panel: 24
  stage: 26
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    border: "1px solid rgba(233,230,239,.72)"
    shadow: "0 18px 44px rgba(42,34,68,.07)"
  metric_card:
    backgroundColor: "rgba(255,255,255,.09)"
    rounded: "{rounded.card}"
    border: "1px solid rgba(255,255,255,.24)"
    shadow: "inset 0 1px 0 rgba(255,255,255,.12)"
  primary_button:
    backgroundColor: "{colors.ink-stage-2}"
    textColor: "#FFFFFF"
    rounded: 14
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: 快捷入口应作为深色摘要舞台之后的轻量白色入口组，使用柔白面板、淡紫图标容器、短标签和弱说明；不能做成高饱和宫格或营销卡片墙。
---

# Deep Indigo Glass Analytics Workbench DESIGN.md

## 1. 总览

这是一套面向分析型工作台和管理后台首页的视觉系统。它用浅暖灰画布降低页面压迫感，用深靛色首屏摘要舞台建立识别度，再通过半透明指标卡和紫蓝数据纹理表达专业、克制、精密的分析气质。

页面适合承载多层级数据：顶部是 `page_title` 和 `global_actions`，首屏摘要区放 `primary_metrics`，中部用 `trend_panel`、`heatmap_panel`、`comparison_panel` 做判断，下部用 `detail_table` 承接可扫读明细。内容必须中立复用，不保留源截图里的具体实体、角色、机构、人名、邮箱或指标名称。

整体信息密度偏高，但视觉不应拥挤。大面板使用充足内边距和柔和圆角，数据图形使用紫蓝低饱和色阶，操作按钮保持少量、明确、稳重。

## 2. 适用场景

适合：

- 分析型工作台首页，需要同时展示指标、趋势、热力分布、对比和明细。
- 管理后台首页，需要首屏摘要和下钻列表。
- 运营概览页，需要在单页内承载概览、分析和表格。
- 数据驱动的门户首页，需要少量操作入口和大量状态读取。

不适合：

- 品牌落地页、营销活动页、内容文章页。
- 重表单录入页面或字段密集的审批详情页。
- 游戏、强插画、强消费娱乐风页面。
- 需要极暗全屏大屏风格的实时监控页；该设计文档是浅画布加深色摘要舞台，不是全暗屏。

## 3. 视觉氛围

氛围关键词是克制、科技、柔和、数据感、专业。页面不追求炫技动效，而是通过深浅对比、半透明层、圆角面板和细腻数据纹理形成高级感。

信息密度为 high。首屏允许展示多张 KPI 卡和两个分析面板，但每个区块边界要清晰，面板之间用 20-28px 的稳定间距隔开。页面应像成熟数据产品，而不是默认后台脚手架。

色彩应以暖灰白、深靛黑、紫蓝强调色为主。不要扩展成彩虹色图表，也不要把背景做成纯蓝或纯紫的一色系页面。

## 4. 视觉 DNA / 设计母体

### DNA 1: 深靛色首屏摘要舞台

- Evidence: observed。截图首屏核心摘要区是整宽深靛黑大圆角容器，底部叠加紫蓝光感。
- Rule: 新 UI 必须保留一个横向深色摘要舞台，放在页面标题下方，承载摘要说明和 `primary_metrics`。
- Implementation hooks: `hero_summary`、`primary_metrics`、`radial-gradient`、`linear-gradient`、`border-radius: 24-28px`、深色容器内浅色文字。
- Failure mode: 若去掉该舞台，页面会变成普通浅色后台首页，失去可识别的第一屏记忆点。

### DNA 2: 玻璃质感指标卡

- Evidence: observed。深色舞台内的指标卡有半透明深色表面、浅描边、内部高光和大数字。
- Rule: KPI 卡必须使用半透明深色面板，配合细描边、柔和高光和大号数字；图标放在小型玻璃图标盒中。
- Implementation hooks: `metric_card`、`icon_box`、`rgba(255,255,255,.08-.14)`、`border: 1px solid rgba(255,255,255,.20-.28)`、`backdrop-filter` 可选。
- Failure mode: 若指标卡改为纯白卡、纯灰卡或普通边框卡，深色摘要区会失去玻璃层次。

### DNA 3: 紫蓝热力数据纹理

- Evidence: observed。主分析面板由浅灰到紫蓝的圆角热力小格组成，并有 Less/More 图例。
- Rule: 数据密集区应优先使用紫蓝色阶的小图形纹理，例如热力格、微型图例、分段色块或低对比矩阵。
- Implementation hooks: `heatmap_panel`、`chart_legend`、`colorScale`、`grid-design-columns`、`border-radius: 7-9px`。
- Failure mode: 若替换成默认柱线图或高饱和彩色图，页面会丢失精致分析感。

### DNA 4: 柔白圆角分析面板

- Evidence: observed。分析图和明细表都位于白色大圆角面板内，阴影轻，边界低对比。
- Rule: 图表、表格、入口和辅助信息必须使用柔白面板承载，边框和阴影都要低对比。
- Implementation hooks: `analysis_panel`、`detail_table`、`quick_actions`、`box-shadow: 0 18px 44px rgba(42,34,68,.06-.08)`、`border: 1px solid rgba(233,230,239,.65)`。
- Failure mode: 若使用强阴影、硬边框或普通灰底卡，页面会变得粗糙且失去柔和质感。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F6F3F1` | 页面外层暖灰画布 |
| `--surface` | `#FFFFFF` | 主要白色面板 |
| `--surface-muted` | `#F3F1F7` | 分段控件、搜索按钮、弱背景 |
| `--surface-soft` | `#FAF9FB` | 表格浅底、面板内部浅层 |
| `--text-primary` | `#090A12` | 页面标题、主要文本 |
| `--text-secondary` | `#6F6D78` | 次级说明、表头、图例文字 |
| `--text-tertiary` | `#9A96A5` | 辅助说明、空态弱文本 |
| `--border-subtle` | `#E9E6EF` | 白色面板边框和表格分割线 |
| `--brand` | `#4C45E8` | 主强调色、热力最强值、选中态 |
| `--brand-soft` | `#E9E7FF` | 选中背景、淡紫图标底 |
| `--brand-muted` | `#A9A2EE` | 热力中间值、辅助强调 |
| `--ink-stage` | `#070B16` | 深色摘要舞台主底 |
| `--ink-stage-2` | `#10143A` | 深色按钮、深色图形块 |
| `--success` | `#20966D` | 正向状态 |
| `--warning` | `#B7791F` | 预警状态 |
| `--danger` | `#D94343` | 错误或危险状态 |

图表色阶建议：

```css
--chart-scale-0: #F2F1F6;
--chart-scale-1: #E2DFF7;
--chart-scale-2: #C4BEF1;
--chart-scale-3: #9F98EC;
--chart-scale-4: #6A62EA;
--chart-scale-5: #4B43E8;
```

## 6. 字体规则

字体栈：

```css
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "PingFang SC", "Helvetica Neue", Arial, sans-serif;
```

| Role | Size | Weight | Line height | 规则 |
| --- | --- | --- | --- | --- |
| `page_title` | 40px | 700 | 1.12 | 仅用于页面主标题，移动端降到 30-32px |
| `section_title` | 24-26px | 700 | 1.2 | 面板标题 |
| `metric_number` | 34-40px | 500 | 1.05 | KPI 数字，使用 tabular-nums |
| `metric_label` | 15-16px | 600 | 1.25 | KPI 标签 |
| `body` | 14-15px | 400 | 1.45 | 正文和说明 |
| `caption` | 12-13px | 500 | 1.35 | 图例、辅助标签、表格二级信息 |

`letter-spacing` 默认保持 `0`。不要用 `vw` 缩放字体。数字统一使用 `font-variant-numeric: tabular-nums`。

## 7. 布局原则

页面壳：

- 外层使用浅暖灰背景，`min-height: 100vh`。
- 桌面端页面左右边距 24px，顶部 24-32px。
- 内容最大宽度建议 1440-1560px，居中。
- 区块间距 24px，面板内边距 28-34px。

首屏结构：

```text
top_bar
  page_title
  global_actions
hero_summary
  summary_title
  summary_description
  primary_metrics
analysis_grid
  heatmap_panel
  comparison_panel
detail_section
  detail_header
  detail_tools
  detail_table
```

桌面主栅格：

- `analysis_grid`: `minmax(0, 1.55fr) minmax(360px, .9fr)`
- `primary_metrics`: 5 列优先，宽度不足时 3 列，再 2 列，再 1 列。
- `detail_table`: 固定表头或视觉上稳定的表头，行高 72-86px。

## 8. 层级与深度

深度来自三层：

1. 浅暖灰画布和白色大面板之间的低对比层级。
2. 深色摘要舞台和玻璃 KPI 卡之间的强深浅对比。
3. 紫蓝图形纹理和淡紫弱背景之间的局部强调。

白色面板阴影保持柔和：

```css
box-shadow: 0 18px 44px rgba(42, 34, 68, .07);
border: 1px solid rgba(233, 230, 239, .72);
```

深色舞台不使用重投影，主要靠深色底、圆角和内部渐变形成层级。表格行只用细分割线，不给每行加卡片阴影。

## 9. 形状

| Token | Value | 用途 |
| --- | --- | --- |
| `--radius-sm` | `10px` | 图标盒、标签、热力格 |
| `--radius-md` | `16px` | 按钮、分段控件、小卡片 |
| `--radius-card` | `18px` | KPI 卡、快捷入口项 |
| `--radius-panel` | `24px` | 白色分析面板 |
| `--radius-stage` | `26px` | 深色摘要舞台 |

圆角系统要统一且偏大。禁止同一页面混用 2px 硬角、8px 默认后台角和 32px 胶囊卡片。胶囊形只用于小型分段控件或短标签。

## 10. 组件样式

### 顶部栏 / 导航

- `page_title` 左对齐，大号黑色标题。
- `global_actions` 右对齐，使用图标按钮和一个深色主按钮。
- 顶部栏不放厚重导航，不使用复杂菜单墙。

### 按钮

- 主按钮：深靛色背景 `#10143A`，白字，圆角 14-16px，高度 56-64px，左右内边距 24-28px。
- 次按钮/图标按钮：白底或淡灰紫底，黑色线性图标，圆角 14-16px。
- hover 时主按钮略提亮，次按钮背景加深到 `#ECEAF3`。
- disabled 时降低透明度到 45%，保留尺寸。

### 图标按钮

- 使用线性图标，描边 1.75-2px。
- 图标按钮尺寸 52-64px，触控目标不小于 44px。
- 深色舞台内图标盒使用半透明白描边；浅色面板内图标盒使用淡紫或白底。

### 卡片 / 面板

- 白色面板使用大圆角、低对比边框、柔和阴影。
- 深色舞台内 KPI 卡使用半透明玻璃质感。
- 不要把页面整体包进一个巨型白卡；页面背景必须露出。

### 输入框 / 选择器

- 搜索入口可做成圆形或紧凑图标按钮。
- 筛选选择器使用淡灰紫胶囊或小圆角控件。
- focus 使用 `0 0 0 3px rgba(76,69,232,.18)`。

### 表格 / 列表

- 表格放在白色大面板中。
- 表头浅灰文字，正文黑色或深灰。
- 行分割线使用 `#E9E6EF`，不要用重边框。
- 首列可用小型线性图标和两级文本，但文本必须是当前业务语义。

### 图表

- 热力图使用 6 级紫蓝色阶，小格圆角 7-9px。
- 对比柱或状态块可使用斜线纹理、深靛实色块和淡紫大块，形成三元对比。
- 图例小巧，文字灰色，不抢主标题。
- 不使用彩虹色图表，不使用高饱和红绿蓝混杂。

### 标签 / 徽标

- 标签背景使用 `#F3F1F7` 或 `#E9E7FF`。
- 字号 12-14px，字重 500-600。
- 标签可用于百分比、状态解释、目标值或筛选项。

### 快捷入口

- 快捷入口不在截图中直接出现，按工作台类型推断。
- 应放在摘要舞台之后或右侧辅助面板内。
- 条目使用淡紫图标盒、短标题、可选弱说明和徽标。
- 数量 4-8 个，桌面 4 列或 2 列紧凑排列。

### 空状态

- 空态放在白色面板内部，使用淡紫图标盒、短标题、短说明和一个主操作。
- 空态不要使用大插画或营销式文案。

### 弹窗 / 浮层

- 浮层沿用白色面板、大圆角、低对比边框和柔和阴影。
- 弹窗内按钮保持深靛主按钮和淡紫次按钮体系。

## 11. 快捷入口区域

快捷入口是 inferred 模块。虽然截图没有可见入口区，但分析型工作台和管理后台首页通常需要从概览跳转到创建、查看、导入、配置或下钻操作。

规则：

- 位置：放在 `hero_summary` 之后、`analysis_grid` 之前，或作为右侧辅助面板中的 `quick_actions`。
- 容器：白色大圆角面板，内边距 24-28px，边框 `#E9E6EF`，柔和阴影。
- 条目：使用 `quick_action_item`，每项包含 `action_icon`、`action_label`、可选 `action_meta` 和 `action_badge`。
- 图标：线性图标，放在淡紫或半透明图标盒中，不能引入插画风或彩色面性图标。
- 数量：桌面端 4-8 个；超过 8 个时分组或横向滚动。
- 状态：hover 时条目背景变为 `#F8F7FC`，图标盒加深到 `#E9E7FF`；active 时轻微下压；focus 有清晰 outline。
- 响应式：平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。
- 与 DNA 的关系：快捷入口必须继承柔白圆角分析面板和玻璃/淡紫图标语言，不抢深色摘要舞台。

禁止把快捷入口做成默认彩色宫格、营销卡片、大插画入口或密集文字链接区。

## 12. 页面结构配方

### 配方 A: 指标优先分析工作台

```text
top_bar
  page_title
  global_actions
hero_summary
  summary_title
  summary_description
  primary_metrics
analysis_grid
  heatmap_panel
  comparison_panel
detail_section
  detail_header
  detail_tools
  detail_table
```

### 配方 B: 门户型分析首页

```text
top_bar
  page_title
  global_actions
hero_summary
  primary_metrics
quick_actions
analysis_grid
  trend_panel
  judgment_panel
detail_list
  status_note
```

### 配方 C: 处理台概览页

```text
top_bar
hero_summary
  primary_metrics
work_queue_grid
  task_queue
  comparison_panel
detail_panel
  detail_tools
  detail_table
```

## 13. 状态与交互

- hover: 白色面板内的可点击项背景轻微变浅紫，深色舞台内卡片描边提亮。
- active: 按钮和入口项可使用 `transform: translateY(1px)`，不做夸张缩放。
- focus: 所有可操作元素必须有 3px 淡紫 focus ring。
- loading: 指标卡使用同形状 skeleton，热力图使用低对比闪烁格，表格使用行 skeleton。
- empty: 保持面板结构，用淡紫图标盒、短说明和一个操作入口。
- error: 使用淡红状态条或小徽标，不整页铺红。
- disabled: 降低透明度，保留布局尺寸。
- selected: 分段控件选中项用白底和轻阴影，或淡紫底和品牌色文字。
- mobile: 控件允许换行，表格可横向滚动，不能挤压文字到不可读。
- reduced motion: 用户偏好减少动态时禁用位移和渐变动画，只保留颜色反馈。

## 14. 响应式

断点建议：

- `>= 1200px`: 首屏 KPI 5 列，分析区双列。
- `900-1199px`: KPI 3 列，分析区仍可双列但右侧面板最小 320px。
- `640-899px`: KPI 2 列，分析区单列，表格横向滚动。
- `< 640px`: 页面边距 14-16px，标题 30-32px，KPI 1 列或 2 列按内容长度决定。

移动端深色摘要舞台内边距降到 18-20px。顶部操作区换行到标题下方。表格列不要硬挤，使用横向滚动并保留首列可读。

## 15. 可访问性

- 正文对比度至少满足 WCAG AA。
- 深色舞台内文字使用白色或高亮浅灰，说明文字不得低于 `rgba(255,255,255,.62)`。
- 仅靠颜色表达强弱的热力图必须配图例、数值或 aria-label。
- 纯图标按钮必须有 `aria-label`。
- focus ring 不可移除。
- 点击目标不小于 44px。
- 表格表头、图例和状态标签需要可被屏幕阅读器理解。

## 16. 实现适配

### CSS Variables

```css
:root {
  --oy-page: #F6F3F1;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F3F1F7;
  --oy-ink: #090A12;
  --oy-ink-muted: #6F6D78;
  --oy-line: #E9E6EF;
  --oy-primary: #4C45E8;
  --oy-primary-soft: #E9E7FF;
  --oy-stage: #070B16;
  --oy-stage-2: #10143A;
  --oy-radius-card: 18px;
  --oy-radius-panel: 24px;
  --oy-radius-stage: 26px;
  --oy-shadow-panel: 0 18px 44px rgba(42, 34, 68, .07);
}
```

### Yida / Code Canvas

- 页面根节点设置 `min-height: 100vh`、浅暖灰背景和统一字体栈。
- 不隐藏平台导航，除非上游明确进入导航壳场景。
- 组件类名可按 `oy-analytics-*` 前缀命名，避免污染其他页面。
- 图标优先使用线性图标或内联 SVG，不使用 emoji。

### React

- Tabs、筛选、搜索、周期切换使用受控状态。
- 图表数据经 `useMemo` 从状态派生。
- 热力图可用数组渲染格子，每个格子有 `aria-label` 或 title。
- 表格、指标和图表都要有 loading、empty、error 的视觉状态。

## 17. 必须包含

- 必须包含深靛色首屏摘要舞台，并承载 `primary_metrics`。
- 必须包含玻璃质感指标卡，使用半透明深色面板、浅描边和大号数字。
- 必须包含紫蓝数据纹理，优先在热力图、图例、状态块或小图形中体现。
- 必须包含柔白圆角分析面板，用于图表、表格和辅助区域。
- 工作台、仪表盘、管理后台或运营首页必须包含 `quick_actions` 规则，即使最终业务入口数量较少。
- 所有业务内容必须替换为当前页面语义，不复制参考图中的具体实体、角色、人名或机构。
- KPI 必须有对照维度，例如目标、环比、分解、阈值或说明。

## 18. 禁止项

- 禁止把深色摘要舞台改成普通白色 KPI 区。
- 禁止把玻璃 KPI 卡改成默认白卡、纯灰卡或强投影卡。
- 禁止使用彩虹色图表或高饱和多色图表替代紫蓝热力纹理。
- 禁止用硬边框、重阴影、密集灰底破坏柔白圆角面板。
- 禁止复制参考图中的具体业务名称、指标名称、人名、邮箱、机构名或示例数据。
- 禁止使用 emoji 作为页面图标或文案。
- 禁止只做静态筛选按钮，交互必须真实联动。
- 禁止让快捷入口变成默认彩色宫格、营销卡片或大插画入口。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 用一排白色 KPI 卡替代深色摘要舞台 | 保留整宽深靛色舞台，并在内部放玻璃 KPI 卡 |
| KPI 卡只有数字和纯灰标题 | KPI 卡有线性图标盒、大数字、弱说明和半透明描边 |
| 用红黄绿蓝多色图表表达数据 | 使用紫蓝 6 级色阶、弱灰底和小图例表达强弱 |
| 面板使用厚重阴影和硬边框 | 面板使用白底、大圆角、低对比边框和柔和阴影 |
| 快捷入口做成彩色按钮墙 | 快捷入口继承白色面板和淡紫图标盒语言 |
| 表格行被做成一张张浮动卡片 | 表格保留连续阅读结构，用细分割线和稳定行高 |
| 移动端压缩所有列到一屏 | 移动端允许表格横向滚动，保持文字可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 生成新页面时，必须在内容替换后保留四个视觉 DNA：深靛色首屏摘要舞台、玻璃质感指标卡、紫蓝热力数据纹理、柔白圆角分析面板。先把业务需求映射到 `page_title`、`global_actions`、`primary_metrics`、`quick_actions`、`heatmap_panel`、`comparison_panel`、`detail_table` 等中性槽位，再替换为当前业务语义。不要复制参考图中的具体业务内容；不要混入其他设计文档的颜色、圆角、阴影或图表语言。工作台和管理后台首页必须按 `quick_actions` 规则生成入口区，或在业务明确不需要时给出一致的空态/省略理由。

## 21. 交付自检清单

- [ ] 源图业务内容已抽象为中性槽位，没有保留具体实体、角色、人名、邮箱、机构名或指标名。
- [ ] 页面首屏包含深靛色摘要舞台，且不是普通白色 KPI 区。
- [ ] KPI 卡使用玻璃质感：半透明深色面板、浅描边、线性图标盒、大号数字。
- [ ] 至少一个数据密集区使用紫蓝热力纹理或同源色阶图形。
- [ ] 图表、表格、入口和辅助信息使用柔白大圆角面板。
- [ ] 快捷入口区域继承淡紫图标盒和柔白面板语言，没有变成彩色宫格。
- [ ] 色彩 token 以暖灰白、深靛黑、紫蓝为主，没有一页随机多色。
- [ ] 字号、圆角、间距和阴影符合本设计文档定义。
- [ ] Tabs、筛选、搜索或周期切换有受控状态和真实联动。
- [ ] KPI 有对照维度，列表/图表/表格有 loading、empty、error 或 disabled 等必要状态。
- [ ] 移动端没有文字溢出、遮挡或不可读表格。
- [ ] 纯图标按钮有可访问标签，热力图有图例或可读说明。
