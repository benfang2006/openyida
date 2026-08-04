---
version: alpha
name: airy-blue-meeting-ops-workbench
description: 适用于任务、日程、会议、待办和轻量 AI 摘要类工作台的通用视觉规范。以大留白、细线白卡、蓝色主操作、右侧任务侧栏和清爽柱状图形成高效但不沉重的办公工具感。
design_id: airy-blue-meeting-ops-workbench
design_status: ready
status: ready
source_image: Image #1
scenes: [工作台, 任务中心, 日程首页, 会议运营, 待办概览]
density: high
layout: B 任务优先
tone: 清爽, 高效, 轻量, 办公, 可信
tags: [任务工作台, 日程队列, 待办, 柱状图, 右侧侧栏, 明细表]
avoid: [强品牌页, 全暗大屏, 游戏化页面, 重视觉营销页]
visual_dna:
  - name: 大留白细线白卡工作台
    confidence: observed
    evidence: 截图用浅灰画布和大量白色细线圆角卡片组织信息，边框存在但阴影很轻。
    rule: 所有区块使用白底、细边框、大间距和轻阴影，避免厚重后台感。
    implementation_hooks: [page_shell, metric_card, panel, table, border-subtle]
    failure_mode: 会退化成拥挤的传统后台。
  - name: 蓝色主操作与单色数据柱
    confidence: observed
    evidence: 顶部主按钮和主图表都使用同一蓝色，按钮明确但克制。
    rule: 主操作、关键柱状图和选中态使用统一蓝色，其他颜色只作状态辅助。
    implementation_hooks: [primary_button, bar_chart, selected_state]
    failure_mode: 会出现颜色分散、缺少主线。
  - name: 右侧任务摘要侧栏
    confidence: observed
    evidence: 右侧竖向放会议卡、下一步、摘要卡，形成主图表之外的执行区。
    rule: 桌面端保留右侧侧栏承载队列、提醒、摘要或待办。
    implementation_hooks: [side_panel, task_card, summary_card]
    failure_mode: 页面只剩指标和图表，缺少工作台行动感。
  - name: 淡青状态胶囊
    confidence: observed
    evidence: 状态、日期和标签使用浅青胶囊，增强轻量反馈。
    rule: 状态标签使用低饱和青蓝底和深色文字，不做高饱和徽章。
    implementation_hooks: [status_badge, date_chip]
    failure_mode: 状态会过硬或过吵。
colors:
  bg-outer: "#F8FAFC"
  surface: "#FFFFFF"
  surface-muted: "#F3F6FA"
  text-primary: "#0B1020"
  text-secondary: "#5D6675"
  border-subtle: "#DDE3EA"
  brand: "#2368C9"
  brand-soft: "#EAF2FF"
  accent: "#23B7C6"
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
    rule: 快捷入口放在 KPI 下或右侧侧栏顶部，白底细线卡，线性图标，蓝色 hover，数量 4-6 个。
---

# airy-blue-meeting-ops-workbench DESIGN.md

## 1. 总览

本规范从 Image #1 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：清爽, 高效, 轻量, 办公, 可信。信息密度为 `high`，布局倾向为 `B 任务优先`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[工作台, 任务中心, 日程首页, 会议运营, 待办概览]。

不适用场景：[强品牌页, 全暗大屏, 游戏化页面, 重视觉营销页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 清爽, 高效, 轻量, 办公, 可信 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 大留白细线白卡工作台

- Evidence: observed。截图用浅灰画布和大量白色细线圆角卡片组织信息，边框存在但阴影很轻。
- Rule: 所有区块使用白底、细边框、大间距和轻阴影，避免厚重后台感。
- Implementation hooks: `page_shell, metric_card, panel, table, border-subtle`。
- Failure mode: 会退化成拥挤的传统后台。

### DNA 2: 蓝色主操作与单色数据柱

- Evidence: observed。顶部主按钮和主图表都使用同一蓝色，按钮明确但克制。
- Rule: 主操作、关键柱状图和选中态使用统一蓝色，其他颜色只作状态辅助。
- Implementation hooks: `primary_button, bar_chart, selected_state`。
- Failure mode: 会出现颜色分散、缺少主线。

### DNA 3: 右侧任务摘要侧栏

- Evidence: observed。右侧竖向放会议卡、下一步、摘要卡，形成主图表之外的执行区。
- Rule: 桌面端保留右侧侧栏承载队列、提醒、摘要或待办。
- Implementation hooks: `side_panel, task_card, summary_card`。
- Failure mode: 页面只剩指标和图表，缺少工作台行动感。

### DNA 4: 淡青状态胶囊

- Evidence: observed。状态、日期和标签使用浅青胶囊，增强轻量反馈。
- Rule: 状态标签使用低饱和青蓝底和深色文字，不做高饱和徽章。
- Implementation hooks: `status_badge, date_chip`。
- Failure mode: 状态会过硬或过吵。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F8FAFC` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#F3F6FA` | 弱背景、表头、控件底 |
| `--text-primary` | `#0B1020` | 标题和关键数字 |
| `--text-secondary` | `#5D6675` | 副标题、说明和表头 |
| `--border-subtle` | `#DDE3EA` | 分割线和弱边框 |
| `--brand` | `#2368C9` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#EAF2FF` | 弱选中背景和图标底 |
| `--accent` | `#23B7C6` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`top_bar -> metric_strip -> main_chart + right_task_sidebar -> detail_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

指标卡用 1px 边框和 20px 圆角；主图表面板内可放顶部摘要条和受控图表；右侧任务卡用嵌套白卡但边框弱；表格行高 56-64px，工具栏使用图标按钮、搜索和过滤。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口放在 KPI 下或右侧侧栏顶部，白底细线卡，线性图标，蓝色 hover，数量 4-6 个。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
top_bar -> metric_strip -> main_chart + right_task_sidebar -> detail_table
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
  --oy-page: #F8FAFC;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F3F6FA;
  --oy-ink: #0B1020;
  --oy-ink-muted: #5D6675;
  --oy-line: #DDE3EA;
  --oy-primary: #2368C9;
  --oy-primary-soft: #EAF2FF;
  --oy-accent: #23B7C6;
  --oy-primary: #2368C9; --oy-accent: #23B7C6;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留大留白细线白卡、统一蓝色主线、右侧任务侧栏、淡青状态胶囊。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 大留白细线白卡工作台、蓝色主操作与单色数据柱、右侧任务摘要侧栏、淡青状态胶囊，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：大留白细线白卡工作台、蓝色主操作与单色数据柱、右侧任务摘要侧栏、淡青状态胶囊。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：大留白细线白卡工作台、蓝色主操作与单色数据柱、右侧任务摘要侧栏、淡青状态胶囊。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
