---
version: alpha
name: editorial-purple-assistant-workbench
description: 适用于带智能助手、日程、资产清单和运营表格的现代工作台规范。以超大问候标题、紫色堆叠图形、黑色智能助手卡、柔白日程和宽表形成编辑感与工具感并存的高级首页。
design_id: editorial-purple-assistant-workbench
design_status: ready
status: ready
source_image: Image #5
scenes: [智能工作台, 日程运营, 资产管理, 业务助手首页, 运营门户]
density: high
layout: D 三栏协同
tone: 编辑感, 高级, 智能, 柔和, 专业
tags: [智能助手, 日程, 紫色图表, 黑色功能卡, 宽表]
avoid: [传统单色财务页, 极简低密度页, 彩色拼图看板]
visual_dna:
  - name: 超大编辑式问候标题
    confidence: observed
    evidence: 页面顶部标题非常大且留白充足，像编辑排版而非后台标题。
    rule: 首页标题使用超大字号和开放留白，建立高级编辑感。
    implementation_hooks: [page_title, header_space]
    failure_mode: 会变成普通后台。
  - name: 紫色堆叠阶梯图形
    confidence: observed
    evidence: 主性能卡使用紫色分层阶梯柱和淡紫连接面。
    rule: 关键绩效图形使用堆叠、阶梯或层叠形状，主色为紫。
    implementation_hooks: [stacked_chart, purple_shapes]
    failure_mode: 失去视觉记忆。
  - name: 黑色智能助手容器
    confidence: observed
    evidence: 左下智能助手区域是大黑色圆角容器，内部白色输入面板。
    rule: 智能/建议模块使用黑色外壳和白色内层，形成强对比。
    implementation_hooks: [assistant_panel, dark_shell]
    failure_mode: 智能模块不突出。
  - name: 柔白胶囊日程列表
    confidence: observed
    evidence: 日程条目是浅灰胶囊行，左侧圆形图标，右侧优先级和时间。
    rule: 队列列表使用胶囊行、圆形图标盒和低对比背景。
    implementation_hooks: [schedule_list, pill_row]
    failure_mode: 队列会变成普通列表。
colors:
  bg-outer: "#F4F4F3"
  surface: "#FFFFFF"
  surface-muted: "#F0F0EF"
  text-primary: "#151515"
  text-secondary: "#6B6B6B"
  border-subtle: "#E6E6E3"
  brand: "#A55BD7"
  brand-soft: "#EFE3F7"
  accent: "#1E1E1E"
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
    rule: 快捷入口优先嵌入黑色智能盒或作为白色图标胶囊列表，使用紫、橙、蓝圆形图标。
---

# editorial-purple-assistant-workbench DESIGN.md

## 1. 总览

本规范从 Image #5 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：编辑感, 高级, 智能, 柔和, 专业。信息密度为 `high`，布局倾向为 `D 三栏协同`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[智能工作台, 日程运营, 资产管理, 业务助手首页, 运营门户]。

不适用场景：[传统单色财务页, 极简低密度页, 彩色拼图看板]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 编辑感, 高级, 智能, 柔和, 专业 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 超大编辑式问候标题

- Evidence: observed。页面顶部标题非常大且留白充足，像编辑排版而非后台标题。
- Rule: 首页标题使用超大字号和开放留白，建立高级编辑感。
- Implementation hooks: `page_title, header_space`。
- Failure mode: 会变成普通后台。

### DNA 2: 紫色堆叠阶梯图形

- Evidence: observed。主性能卡使用紫色分层阶梯柱和淡紫连接面。
- Rule: 关键绩效图形使用堆叠、阶梯或层叠形状，主色为紫。
- Implementation hooks: `stacked_chart, purple_shapes`。
- Failure mode: 失去视觉记忆。

### DNA 3: 黑色智能助手容器

- Evidence: observed。左下智能助手区域是大黑色圆角容器，内部白色输入面板。
- Rule: 智能/建议模块使用黑色外壳和白色内层，形成强对比。
- Implementation hooks: `assistant_panel, dark_shell`。
- Failure mode: 智能模块不突出。

### DNA 4: 柔白胶囊日程列表

- Evidence: observed。日程条目是浅灰胶囊行，左侧圆形图标，右侧优先级和时间。
- Rule: 队列列表使用胶囊行、圆形图标盒和低对比背景。
- Implementation hooks: `schedule_list, pill_row`。
- Failure mode: 队列会变成普通列表。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F4F4F3` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#F0F0EF` | 弱背景、表头、控件底 |
| `--text-primary` | `#151515` | 标题和关键数字 |
| `--text-secondary` | `#6B6B6B` | 副标题、说明和表头 |
| `--border-subtle` | `#E6E6E3` | 分割线和弱边框 |
| `--brand` | `#A55BD7` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#EFE3F7` | 弱选中背景和图标底 |
| `--accent` | `#1E1E1E` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`large_header -> performance_panel + schedule_panel -> assistant_box + active_table`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

图表卡用白底大圆角；智能盒用黑色背景和大圆角；表格搜索是灰底长胶囊；状态点小面积使用绿/黄。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口优先嵌入黑色智能盒或作为白色图标胶囊列表，使用紫、橙、蓝圆形图标。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
large_header -> performance_panel + schedule_panel -> assistant_box + active_table
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
  --oy-page: #F4F4F3;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #F0F0EF;
  --oy-ink: #151515;
  --oy-ink-muted: #6B6B6B;
  --oy-line: #E6E6E3;
  --oy-primary: #A55BD7;
  --oy-primary-soft: #EFE3F7;
  --oy-accent: #1E1E1E;
  --oy-primary: #A55BD7; --oy-dark: #1D1D1B;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留超大标题、紫色堆叠图形、黑色智能助手容器、柔白胶囊日程列表。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 超大编辑式问候标题、紫色堆叠阶梯图形、黑色智能助手容器、柔白胶囊日程列表，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：超大编辑式问候标题、紫色堆叠阶梯图形、黑色智能助手容器、柔白胶囊日程列表。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：超大编辑式问候标题、紫色堆叠阶梯图形、黑色智能助手容器、柔白胶囊日程列表。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
