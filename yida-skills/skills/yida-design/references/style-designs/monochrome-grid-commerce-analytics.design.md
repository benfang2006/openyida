---
version: alpha
name: monochrome-grid-commerce-analytics
description: 适用于电商、销售、订单、客户增长等高密度经营分析页的黑白网格风格规范。以单色 KPI、像素热力柱阵、浅灰面板头和强表格形成严谨、工具化、数据密集的经营台。
design_id: monochrome-grid-commerce-analytics
design_status: ready
status: ready
source_image: Image #3
scenes: [经营分析, 销售看板, 电商后台, 订单工作台, 高密度表格]
density: ultra
layout: A 指标优先
tone: 严谨, 单色, 高密度, 工具化, 精密
tags: [黑白, 热力网格, 高密度表格, 经营分析, 单色图表]
avoid: [多彩门户, 柔和医疗, 情绪化营销页, 低密度首页]
visual_dna:
  - name: 单色像素热力主图
    confidence: observed
    evidence: 主趋势区由大量浅灰到黑色的小方格组成，形成类似日历热力图的柱阵。
    rule: 主分析必须保留单色网格/像素化数据纹理，用黑灰强弱表达数值。
    implementation_hooks: [heatmap_grid, pixel_bars]
    failure_mode: 会失去高密度精密感。
  - name: 浅灰面板标题条
    confidence: observed
    evidence: 大面板顶部有浅灰标题栏、信息图标和操作菜单。
    rule: 复杂面板用浅灰 header 区分标题和内容，操作放右上角。
    implementation_hooks: [panel_header, action_menu]
    failure_mode: 页面层级会不清。
  - name: 等宽数字与紧凑大表
    confidence: observed
    evidence: KPI 和表格数字使用接近等宽风格，表格列多且清晰。
    rule: 数字使用 tabular-nums，表格行密度高但边界稳定。
    implementation_hooks: [numeric_type, dense_table]
    failure_mode: 会变成松散报表。
  - name: 克制绿色状态点
    confidence: observed
    evidence: 增长和成功状态只用少量绿色点或文本。
    rule: 状态色使用小面积，不破坏单色主视觉。
    implementation_hooks: [status_dot, badge]
    failure_mode: 状态会过度抢眼。
colors:
  bg-outer: "#F5F5F3"
  surface: "#FFFFFF"
  surface-muted: "#EFEEEB"
  text-primary: "#10131A"
  text-secondary: "#8B8B8B"
  border-subtle: "#D9D9D7"
  brand: "#111111"
  brand-soft: "#EFEFEF"
  accent: "#0AA67A"
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
    rule: 快捷入口用浅灰标题条下的紧凑文本按钮或小图标卡，数量 4-6，保持单色。
---

# monochrome-grid-commerce-analytics DESIGN.md

## 1. 总览

本规范从 Image #3 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：严谨, 单色, 高密度, 工具化, 精密。信息密度为 `ultra`，布局倾向为 `A 指标优先`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[经营分析, 销售看板, 电商后台, 订单工作台, 高密度表格]。

不适用场景：[多彩门户, 柔和医疗, 情绪化营销页, 低密度首页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 严谨, 单色, 高密度, 工具化, 精密 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 单色像素热力主图

- Evidence: observed。主趋势区由大量浅灰到黑色的小方格组成，形成类似日历热力图的柱阵。
- Rule: 主分析必须保留单色网格/像素化数据纹理，用黑灰强弱表达数值。
- Implementation hooks: `heatmap_grid, pixel_bars`。
- Failure mode: 会失去高密度精密感。

### DNA 2: 浅灰面板标题条

- Evidence: observed。大面板顶部有浅灰标题栏、信息图标和操作菜单。
- Rule: 复杂面板用浅灰 header 区分标题和内容，操作放右上角。
- Implementation hooks: `panel_header, action_menu`。
- Failure mode: 页面层级会不清。

### DNA 3: 等宽数字与紧凑大表

- Evidence: observed。KPI 和表格数字使用接近等宽风格，表格列多且清晰。
- Rule: 数字使用 tabular-nums，表格行密度高但边界稳定。
- Implementation hooks: `numeric_type, dense_table`。
- Failure mode: 会变成松散报表。

### DNA 4: 克制绿色状态点

- Evidence: observed。增长和成功状态只用少量绿色点或文本。
- Rule: 状态色使用小面积，不破坏单色主视觉。
- Implementation hooks: `status_dot, badge`。
- Failure mode: 状态会过度抢眼。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F5F5F3` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#EFEEEB` | 弱背景、表头、控件底 |
| `--text-primary` | `#10131A` | 标题和关键数字 |
| `--text-secondary` | `#8B8B8B` | 副标题、说明和表头 |
| `--border-subtle` | `#D9D9D7` | 分割线和弱边框 |
| `--brand` | `#111111` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#EFEFEF` | 弱选中背景和图标底 |
| `--accent` | `#0AA67A` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`top_controls -> kpi_strip -> heatmap_trend + breakdown_panel -> tab_bar -> dense_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

KPI 卡顶部白底、底部浅灰状态条；主图使用密集小格；右侧柱图用黑/灰对比；表格表头大写或字距正常但密度高。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口用浅灰标题条下的紧凑文本按钮或小图标卡，数量 4-6，保持单色。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
top_controls -> kpi_strip -> heatmap_trend + breakdown_panel -> tab_bar -> dense_table
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
  --oy-page: #F5F5F3;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #EFEEEB;
  --oy-ink: #10131A;
  --oy-ink-muted: #8B8B8B;
  --oy-line: #D9D9D7;
  --oy-primary: #111111;
  --oy-primary-soft: #EFEFEF;
  --oy-accent: #0AA67A;
  --oy-primary: #111111; --oy-success: #0AA67A;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留单色像素热力主图、浅灰面板标题条、等宽数字、紧凑大表。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 单色像素热力主图、浅灰面板标题条、等宽数字与紧凑大表、克制绿色状态点，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：单色像素热力主图、浅灰面板标题条、等宽数字与紧凑大表、克制绿色状态点。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：单色像素热力主图、浅灰面板标题条、等宽数字与紧凑大表、克制绿色状态点。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
