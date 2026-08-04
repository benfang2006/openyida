---
version: alpha
name: blue-rounded-finance-analytics
description: 适用于财务分析、预约列表、客户交易和收入概览的蓝色圆角仪表盘规范。以亮蓝重点 KPI、深浅蓝柱图、双线面积图和右侧列表形成清晰、可信、SaaS 化的数据首页。
design_id: blue-rounded-finance-analytics
design_status: ready
status: ready
source_image: Image #9
scenes: [财务分析, 客户交易, 预约列表, 收入概览, SaaS Dashboard]
density: high
layout: A 指标优先
tone: 清晰, 蓝色, SaaS, 可信, 数据化
tags: [蓝色 KPI, 双线面积图, 圆角柱图, 右侧列表, 交易表]
avoid: [医疗安静页, 彩色拼图页, 单色高密度经营台, 品牌落地页]
visual_dna:
  - name: 亮蓝重点 KPI 卡
    confidence: observed
    evidence: 左上核心指标卡使用亮蓝实底，其他 KPI 使用浅灰白卡。
    rule: 最关键指标使用亮蓝满底卡，其余指标保持浅色卡。
    implementation_hooks: [featured_metric, blue_card]
    failure_mode: 页面缺少主次。
  - name: 深浅蓝圆角柱对比
    confidence: observed
    evidence: 利润损失图使用深蓝和亮蓝上下圆角柱，亮蓝带斜纹。
    rule: 对比柱图使用深浅蓝两组圆角柱，可带微纹理。
    implementation_hooks: [paired_bar_chart, hatch_fill]
    failure_mode: 图表普通化。
  - name: 双线柔和面积趋势
    confidence: observed
    evidence: 主趋势图是蓝色和青色两条平滑线，下面有淡色面积。
    rule: 趋势类图表使用平滑双线和淡色面积填充。
    implementation_hooks: [dual_area_chart, tooltip]
    failure_mode: 失去 SaaS 数据感。
  - name: 右侧头像列表操作
    confidence: observed
    evidence: 右侧列表每行头像、姓名、时间和描边按钮。
    rule: 侧栏列表使用头像、两级文本和描边操作按钮。
    implementation_hooks: [side_list, outline_button]
    failure_mode: 列表行动性不足。
colors:
  bg-outer: "#F2F3F5"
  surface: "#FFFFFF"
  surface-muted: "#F5F5F5"
  text-primary: "#1C2024"
  text-secondary: "#777D84"
  border-subtle: "#E6E8EB"
  brand: "#347DF1"
  brand-soft: "#E9F2FF"
  accent: "#38C7DE"
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
    rule: 快捷入口可放在 KPI 网格或表格头，亮蓝主入口加描边次入口，图标圆底。
---

# blue-rounded-finance-analytics DESIGN.md

## 1. 总览

本规范从 Image #9 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：清晰, 蓝色, SaaS, 可信, 数据化。信息密度为 `high`，布局倾向为 `A 指标优先`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[财务分析, 客户交易, 预约列表, 收入概览, SaaS Dashboard]。

不适用场景：[医疗安静页, 彩色拼图页, 单色高密度经营台, 品牌落地页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 清晰, 蓝色, SaaS, 可信, 数据化 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 亮蓝重点 KPI 卡

- Evidence: observed。左上核心指标卡使用亮蓝实底，其他 KPI 使用浅灰白卡。
- Rule: 最关键指标使用亮蓝满底卡，其余指标保持浅色卡。
- Implementation hooks: `featured_metric, blue_card`。
- Failure mode: 页面缺少主次。

### DNA 2: 深浅蓝圆角柱对比

- Evidence: observed。利润损失图使用深蓝和亮蓝上下圆角柱，亮蓝带斜纹。
- Rule: 对比柱图使用深浅蓝两组圆角柱，可带微纹理。
- Implementation hooks: `paired_bar_chart, hatch_fill`。
- Failure mode: 图表普通化。

### DNA 3: 双线柔和面积趋势

- Evidence: observed。主趋势图是蓝色和青色两条平滑线，下面有淡色面积。
- Rule: 趋势类图表使用平滑双线和淡色面积填充。
- Implementation hooks: `dual_area_chart, tooltip`。
- Failure mode: 失去 SaaS 数据感。

### DNA 4: 右侧头像列表操作

- Evidence: observed。右侧列表每行头像、姓名、时间和描边按钮。
- Rule: 侧栏列表使用头像、两级文本和描边操作按钮。
- Implementation hooks: `side_list, outline_button`。
- Failure mode: 列表行动性不足。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F2F3F5` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#F5F5F5` | 弱背景、表头、控件底 |
| `--text-primary` | `#1C2024` | 标题和关键数字 |
| `--text-secondary` | `#777D84` | 副标题、说明和表头 |
| `--border-subtle` | `#E6E8EB` | 分割线和弱边框 |
| `--brand` | `#347DF1` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#E9F2FF` | 弱选中背景和图标底 |
| `--accent` | `#38C7DE` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`featured_metric_grid + comparison_chart -> dual_area_chart + side_list -> detail_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

卡片圆角 24px；按钮蓝色描边；tooltip 可用蓝色实底；表格下方白卡和细分割线。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口可放在 KPI 网格或表格头，亮蓝主入口加描边次入口，图标圆底。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
featured_metric_grid + comparison_chart -> dual_area_chart + side_list -> detail_table
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
  --oy-page: #F2F3F5;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F5F5F5;
  --oy-ink: #1C2024;
  --oy-ink-muted: #777D84;
  --oy-line: #E6E8EB;
  --oy-primary: #347DF1;
  --oy-primary-soft: #E9F2FF;
  --oy-accent: #38C7DE;
  --oy-primary: #347DF1; --oy-cyan: #38C7DE;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留亮蓝重点 KPI、深浅蓝圆角柱、双线面积趋势、右侧头像列表。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 亮蓝重点 KPI 卡、深浅蓝圆角柱对比、双线柔和面积趋势、右侧头像列表操作，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：亮蓝重点 KPI 卡、深浅蓝圆角柱对比、双线柔和面积趋势、右侧头像列表操作。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：亮蓝重点 KPI 卡、深浅蓝圆角柱对比、双线柔和面积趋势、右侧头像列表操作。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
