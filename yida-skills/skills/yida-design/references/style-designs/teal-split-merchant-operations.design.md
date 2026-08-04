---
version: alpha
name: teal-split-merchant-operations
description: 适用于商户、门店、审核、列表运营和侧栏榜单类工作台的青绿色分栏规范。以左侧主工作区、右侧固定洞察栏、青绿色强调、细线分割和大表格形成业务处理中台感。
design_id: teal-split-merchant-operations
design_status: ready
status: ready
source_image: Image #6
scenes: [商户运营, 门店管理, 审核处理台, 列表工作台, 业务中台]
density: ultra
layout: C 处理台
tone: 克制, 中台, 青绿, 高密度, 审核
tags: [右侧固定栏, 青绿, 审核状态, 榜单, 大表格, 处理台]
avoid: [营销页, 大屏监控, 插画门户, 低密度首页]
visual_dna:
  - name: 左右处理台分栏
    confidence: observed
    evidence: 页面左侧是主指标、图表和列表，右侧是固定商户/表现/榜单栏。
    rule: 桌面端必须保留主工作区加右侧洞察栏结构。
    implementation_hooks: [split_layout, sticky_side_panel]
    failure_mode: 会失去处理台效率。
  - name: 青绿少量高亮
    confidence: observed
    evidence: 青绿色用于关键状态、进度条、按钮和图表选中条。
    rule: 青绿只用于操作和关键数据，不铺满背景。
    implementation_hooks: [teal_accent, progress_bar]
    failure_mode: 视觉会发散。
  - name: 细线分割高密度列表
    confidence: observed
    evidence: 底部列表跨屏宽，表头浅灰，行用细线分隔。
    rule: 列表和表格优先使用细分割线，保持高密度。
    implementation_hooks: [dense_table, row_divider]
    failure_mode: 会变成松散卡片墙。
  - name: 右侧榜单身份卡
    confidence: observed
    evidence: 右栏有头像/徽章、进度条和榜单项，层级清楚。
    rule: 侧栏保留身份摘要、进度对比和榜单列表。
    implementation_hooks: [profile_summary, ranking_list]
    failure_mode: 右侧信息会缺少聚合。
colors:
  bg-outer: "#FFFFFF"
  surface: "#FFFFFF"
  surface-muted: "#F7F9F8"
  text-primary: "#092A3A"
  text-secondary: "#9B9B9B"
  border-subtle: "#E8ECEB"
  brand: "#0F9B9B"
  brand-soft: "#E9FAFA"
  accent: "#FFAF1A"
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
    rule: 快捷入口作为列表工具栏按钮或右侧栏快捷操作，白底描边，青绿色图标和文字。
---

# teal-split-merchant-operations DESIGN.md

## 1. 总览

本规范从 Image #6 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：克制, 中台, 青绿, 高密度, 审核。信息密度为 `ultra`，布局倾向为 `C 处理台`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[商户运营, 门店管理, 审核处理台, 列表工作台, 业务中台]。

不适用场景：[营销页, 大屏监控, 插画门户, 低密度首页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 克制, 中台, 青绿, 高密度, 审核 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 左右处理台分栏

- Evidence: observed。页面左侧是主指标、图表和列表，右侧是固定商户/表现/榜单栏。
- Rule: 桌面端必须保留主工作区加右侧洞察栏结构。
- Implementation hooks: `split_layout, sticky_side_panel`。
- Failure mode: 会失去处理台效率。

### DNA 2: 青绿少量高亮

- Evidence: observed。青绿色用于关键状态、进度条、按钮和图表选中条。
- Rule: 青绿只用于操作和关键数据，不铺满背景。
- Implementation hooks: `teal_accent, progress_bar`。
- Failure mode: 视觉会发散。

### DNA 3: 细线分割高密度列表

- Evidence: observed。底部列表跨屏宽，表头浅灰，行用细线分隔。
- Rule: 列表和表格优先使用细分割线，保持高密度。
- Implementation hooks: `dense_table, row_divider`。
- Failure mode: 会变成松散卡片墙。

### DNA 4: 右侧榜单身份卡

- Evidence: observed。右栏有头像/徽章、进度条和榜单项，层级清楚。
- Rule: 侧栏保留身份摘要、进度对比和榜单列表。
- Implementation hooks: `profile_summary, ranking_list`。
- Failure mode: 右侧信息会缺少聚合。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#FFFFFF` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#F7F9F8` | 弱背景、表头、控件底 |
| `--text-primary` | `#092A3A` | 标题和关键数字 |
| `--text-secondary` | `#9B9B9B` | 副标题、说明和表头 |
| `--border-subtle` | `#E8ECEB` | 分割线和弱边框 |
| `--brand` | `#0F9B9B` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#E9FAFA` | 弱选中背景和图标底 |
| `--accent` | `#FFAF1A` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`header -> kpi_strip -> main_chart + side_rankings -> tabs -> table_toolbar -> dense_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

顶部 KPI 用白卡细线；图表使用青绿和深墨色；标签页下划线选中；表格行高 64-72px；右侧栏以分割线组织。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口作为列表工具栏按钮或右侧栏快捷操作，白底描边，青绿色图标和文字。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
header -> kpi_strip -> main_chart + side_rankings -> tabs -> table_toolbar -> dense_table
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
  --oy-page: #FFFFFF;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F7F9F8;
  --oy-ink: #092A3A;
  --oy-ink-muted: #9B9B9B;
  --oy-line: #E8ECEB;
  --oy-primary: #0F9B9B;
  --oy-primary-soft: #E9FAFA;
  --oy-accent: #FFAF1A;
  --oy-primary: #0F9B9B; --oy-ink: #092A3A;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留左右分栏、青绿少量高亮、细线高密度表格、右侧榜单身份卡。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 左右处理台分栏、青绿少量高亮、细线分割高密度列表、右侧榜单身份卡，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：左右处理台分栏、青绿少量高亮、细线分割高密度列表、右侧榜单身份卡。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：左右处理台分栏、青绿少量高亮、细线分割高密度列表、右侧榜单身份卡。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
