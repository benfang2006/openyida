---
version: alpha
name: soft-purple-finance-dashboard
description: 适用于金融、交易、账户、账单和业务流水类首页的柔和数据仪表盘规范。以浅灰分区 KPI、紫色折线、右侧摘要卡和高可读明细表形成冷静、可信、面向审阅的金融工具感。
design_id: soft-purple-finance-dashboard
design_status: ready
status: ready
source_image: Image #2
scenes: [金融工作台, 交易概览, 账户看板, 经营流水, 明细审阅]
density: high
layout: A 指标优先
tone: 柔和, 金融, 克制, 审阅, 清晰
tags: [金融, 交易表格, 紫色折线, 摘要侧栏, 分布条]
avoid: [儿童化页面, 强霓虹页面, 全暗屏, 低密度宣传页]
visual_dna:
  - name: 浅灰拼接 KPI 矩阵
    confidence: observed
    evidence: 首屏四个指标以浅灰大块拼接成 2x2 区域，边界弱。
    rule: KPI 区使用浅灰分区矩阵，数字大，趋势以小色块表达。
    implementation_hooks: [metric_grid, muted_surface]
    failure_mode: 会变成普通散卡，缺少整体分组。
  - name: 紫色主折线与浮层提示
    confidence: observed
    evidence: 主图表使用高识别紫色折线和白色 tooltip。
    rule: 趋势图使用单一紫色主线，tooltip 为白底圆角浮层。
    implementation_hooks: [line_chart, tooltip]
    failure_mode: 图表会显得零散。
  - name: 右侧摘要卡组合
    confidence: observed
    evidence: 右侧有评分条和渠道分布卡，形成辅助判断列。
    rule: 右侧列放小型摘要、分布条、分类明细或风险说明。
    implementation_hooks: [right_summary, distribution_bar]
    failure_mode: 主区缺少补充判断。
  - name: 表格前置工具栏
    confidence: observed
    evidence: 明细表上方有搜索、查看全部和排序表头。
    rule: 明细区必须有搜索/过滤/查看入口，表头可排序。
    implementation_hooks: [detail_tools, sortable_table]
    failure_mode: 审阅效率下降。
colors:
  bg-outer: "#FAFAFB"
  surface: "#FFFFFF"
  surface-muted: "#F4F4F5"
  text-primary: "#15171C"
  text-secondary: "#6B6F76"
  border-subtle: "#E7E7EA"
  brand: "#7651E6"
  brand-soft: "#EEE9FF"
  accent: "#22C981"
typography:
  page-title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', Arial, sans-serif"
    fontSize: 36
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: 0
spacing:
  page-x: 24
  grid-gap: 24
  card-x: 24
  card-y: 20
rounded:
  md: 14
  card: 18
  panel: 24
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    border: "1px solid {colors.border-subtle}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: 快捷入口应使用白底或浅灰底小卡，线性图标，适合放在表格工具栏上方或右侧摘要列。
---

# soft-purple-finance-dashboard DESIGN.md

## 1. 总览

本规范从 Image #2 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：柔和, 金融, 克制, 审阅, 清晰。信息密度为 `high`，布局倾向为 `A 指标优先`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[金融工作台, 交易概览, 账户看板, 经营流水, 明细审阅]。

不适用场景：[儿童化页面, 强霓虹页面, 全暗屏, 低密度宣传页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 柔和, 金融, 克制, 审阅, 清晰 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 浅灰拼接 KPI 矩阵

- Evidence: observed。首屏四个指标以浅灰大块拼接成 2x2 区域，边界弱。
- Rule: KPI 区使用浅灰分区矩阵，数字大，趋势以小色块表达。
- Implementation hooks: `metric_grid, muted_surface`。
- Failure mode: 会变成普通散卡，缺少整体分组。

### DNA 2: 紫色主折线与浮层提示

- Evidence: observed。主图表使用高识别紫色折线和白色 tooltip。
- Rule: 趋势图使用单一紫色主线，tooltip 为白底圆角浮层。
- Implementation hooks: `line_chart, tooltip`。
- Failure mode: 图表会显得零散。

### DNA 3: 右侧摘要卡组合

- Evidence: observed。右侧有评分条和渠道分布卡，形成辅助判断列。
- Rule: 右侧列放小型摘要、分布条、分类明细或风险说明。
- Implementation hooks: `right_summary, distribution_bar`。
- Failure mode: 主区缺少补充判断。

### DNA 4: 表格前置工具栏

- Evidence: observed。明细表上方有搜索、查看全部和排序表头。
- Rule: 明细区必须有搜索/过滤/查看入口，表头可排序。
- Implementation hooks: `detail_tools, sortable_table`。
- Failure mode: 审阅效率下降。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#FAFAFB` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#F4F4F5` | 弱背景、表头、控件底 |
| `--text-primary` | `#15171C` | 标题和关键数字 |
| `--text-secondary` | `#6B6F76` | 副标题、说明和表头 |
| `--border-subtle` | `#E7E7EA` | 分割线和弱边框 |
| `--brand` | `#7651E6` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#EEE9FF` | 弱选中背景和图标底 |
| `--accent` | `#22C981` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`header -> metric_grid + right_score -> trend_panel + side_distribution -> table_tools -> detail_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

KPI 矩阵可用浅灰块无重阴影；折线图用紫色线和弱网格；分布条用 3-4 个低饱和色块；表格表头浅灰底，行分割线极细。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口应使用白底或浅灰底小卡，线性图标，适合放在表格工具栏上方或右侧摘要列。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
header -> metric_grid + right_score -> trend_panel + side_distribution -> table_tools -> detail_table
```

可按业务替换槽位内容，但不要改变风格文档的主视觉层级和组件语言。

## 13. 状态与交互

筛选、搜索、周期切换、Tabs 和行选择必须使用受控状态。hover 用轻背景或描边变化，active 可轻微下压，focus 使用 3px 柔和 focus ring。loading 使用同形状 skeleton，empty 使用短说明和一个操作入口，error 使用小面积状态条或徽标。

## 14. 响应式

大屏保留原始主栅格；1200px 以下减少列数；900px 以下主区和侧栏上下堆叠；640px 以下页面边距 14-16px，标题缩小，表格横向滚动。文字不可溢出或遮挡，按钮文字过长时换行或缩短。

## 15. 可访问性

文字对比度满足 WCAG AA。纯图标按钮必须有 `aria-label`。状态不能只靠颜色表达，需要文字、图标或数值辅助。focus ring 不可移除。动态图表遵守 reduced motion。

## 16. 实现适配

```css
:root {
  --oy-page: #FAFAFB;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F4F4F5;
  --oy-ink: #15171C;
  --oy-ink-muted: #6B6F76;
  --oy-line: #E7E7EA;
  --oy-primary: #7651E6;
  --oy-primary-soft: #EEE9FF;
  --oy-accent: #22C981;
  --oy-primary: #7651E6; --oy-positive: #22C981;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留浅灰 KPI 矩阵、紫色主折线、右侧摘要卡、可审阅表格工具栏。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 浅灰拼接 KPI 矩阵、紫色主折线与浮层提示、右侧摘要卡组合、表格前置工具栏，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：浅灰拼接 KPI 矩阵、紫色主折线与浮层提示、右侧摘要卡组合、表格前置工具栏。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：浅灰拼接 KPI 矩阵、紫色主折线与浮层提示、右侧摘要卡组合、表格前置工具栏。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
