---
version: alpha
name: aqua-healthcare-calm-dashboard
description: 适用于医疗、健康、预约、康复进度和服务门户的安静青绿色工作台规范。以大号轻字重标题、青绿渐变治疗卡、柔白医疗面板、时间轴预约和淡色地图/报告形成温和可信的服务体验。
design_id: aqua-healthcare-calm-dashboard
design_status: ready
status: ready
source_image: Image #8
scenes: [医疗工作台, 健康门户, 预约中心, 康复管理, 服务概览]
density: medium
layout: D 三栏协同
tone: 温和, 医疗, 安静, 清透, 可信
tags: [青绿, 医疗, 预约时间轴, 进度条, 报告图, 地图卡]
avoid: [金融交易台, 彩色项目看板, 黑白高密度中台, 强营销页]
visual_dna:
  - name: 轻字重医疗问候标题
    confidence: observed
    evidence: 顶部标题很大但字重轻，副标题灰色，气质平静。
    rule: 页面标题使用大字号轻字重，营造医疗服务的安静感。
    implementation_hooks: [page_title, light_weight]
    failure_mode: 会显得商业后台化。
  - name: 青绿渐变治疗卡
    confidence: observed
    evidence: 右上治疗计划卡为青绿渐变，大圆角，内有浅色柱形图。
    rule: 重点计划/状态卡使用青绿渐变和白字。
    implementation_hooks: [treatment_card, teal_gradient]
    failure_mode: 缺少医疗识别度。
  - name: 时间轴预约列表
    confidence: observed
    evidence: 左侧预约区有竖向时间线、时间胶囊和浅青事件卡。
    rule: 日程/任务使用时间轴与浅青卡组合。
    implementation_hooks: [timeline, appointment_card]
    failure_mode: 队列会变普通。
  - name: 柔淡报告与地图面板
    confidence: observed
    evidence: 报告图和地图都使用低对比线条、淡青面积和透明标记。
    rule: 数据可视化使用淡青线面、低对比网格和柔和标注。
    implementation_hooks: [report_chart, map_panel]
    failure_mode: 会变得尖锐或科技过度。
colors:
  bg-outer: "#F6F8F8"
  surface: "#FFFFFF"
  surface-muted: "#EEF9FA"
  text-primary: "#3A3A3A"
  text-secondary: "#7D8182"
  border-subtle: "#E6F0F0"
  brand: "#4BBEC0"
  brand-soft: "#E9F8F9"
  accent: "#0A7F8A"
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
    rule: 快捷入口放在预约面板或顶部体征指标旁，使用圆形青绿图标盒和短标签，数量 3-6。
---

# aqua-healthcare-calm-dashboard DESIGN.md

## 1. 总览

本规范从 Image #8 提取可复用视觉系统，面向通用首页、工作台、仪表盘或处理台生成，不绑定截图中的具体业务、人物、品牌、金额、日期或表格记录。页面应以中性槽位表达：`page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table`、`status_note`。

核心气质：温和, 医疗, 安静, 清透, 可信。信息密度为 `medium`，布局倾向为 `D 三栏协同`。生成新页面时，业务内容可以替换，视觉 DNA 必须保留。

## 2. 适用场景

适用场景：[医疗工作台, 健康门户, 预约中心, 康复管理, 服务概览]。

不适用场景：[金融交易台, 彩色项目看板, 黑白高密度中台, 强营销页]。这些页面会削弱本设计文档的结构优势或视觉记忆点。

## 3. 视觉氛围

页面应呈现 温和, 医疗, 安静, 清透, 可信 的产品气质。避免为了“丰富”而加入随机插画、过量渐变、无关装饰或一页多套图表语言。视觉重点来自清晰布局、稳定圆角、成体系的强调色和可扫读数据层级。

## 4. 视觉 DNA / 设计母体

### DNA 1: 轻字重医疗问候标题

- Evidence: observed。顶部标题很大但字重轻，副标题灰色，气质平静。
- Rule: 页面标题使用大字号轻字重，营造医疗服务的安静感。
- Implementation hooks: `page_title, light_weight`。
- Failure mode: 会显得商业后台化。

### DNA 2: 青绿渐变治疗卡

- Evidence: observed。右上治疗计划卡为青绿渐变，大圆角，内有浅色柱形图。
- Rule: 重点计划/状态卡使用青绿渐变和白字。
- Implementation hooks: `treatment_card, teal_gradient`。
- Failure mode: 缺少医疗识别度。

### DNA 3: 时间轴预约列表

- Evidence: observed。左侧预约区有竖向时间线、时间胶囊和浅青事件卡。
- Rule: 日程/任务使用时间轴与浅青卡组合。
- Implementation hooks: `timeline, appointment_card`。
- Failure mode: 队列会变普通。

### DNA 4: 柔淡报告与地图面板

- Evidence: observed。报告图和地图都使用低对比线条、淡青面积和透明标记。
- Rule: 数据可视化使用淡青线面、低对比网格和柔和标注。
- Implementation hooks: `report_chart, map_panel`。
- Failure mode: 会变得尖锐或科技过度。

## 5. 色彩角色

| Token | Value | 用途 |
| --- | --- | --- |
| `--bg-outer` | `#F6F8F8` | 页面背景 |
| `--surface` | `#FFFFFF` | 主面板与卡片 |
| `--surface-muted` | `#EEF9FA` | 弱背景、表头、控件底 |
| `--text-primary` | `#3A3A3A` | 标题和关键数字 |
| `--text-secondary` | `#7D8182` | 副标题、说明和表头 |
| `--border-subtle` | `#E6F0F0` | 分割线和弱边框 |
| `--brand` | `#4BBEC0` | 主按钮、选中态、核心图表 |
| `--brand-soft` | `#E9F8F9` | 弱选中背景和图标底 |
| `--accent` | `#0A7F8A` | 辅助强调、状态或第二图表色 |

## 6. 字体规则

使用系统无衬线字体栈。`page_title` 30-40px，`section_title` 22-28px，`metric_number` 32-44px，正文 14-16px，辅助文字 12-13px。数字使用 `font-variant-numeric: tabular-nums`。不要使用 viewport width 缩放字体，`letter-spacing` 保持 `0`。

## 7. 布局原则

外层 `min-height: 100vh`，背景使用 `--bg-outer`。桌面端内容区左右 24-32px，模块间距 20-28px。首屏优先放 `page_title`、`global_actions` 和 `primary_metrics`；主工作区根据风格文档使用 `main_chart`、`side_panel`、`detail_table` 或 `task_queue`。不要把整页包成一个大卡片。

推荐结构：`soft_header + vital_chips -> appointment_timeline + progress_panel + plan_card -> media_card + report_chart + map_panel`。

## 8. 层级与深度

层级通过背景差、低对比边框、轻阴影、强调色和图表纹理建立。主面板阴影建议 `0 16px 40px rgba(15, 23, 42, .06)`，边框使用 `--border-subtle`。不要使用厚重投影、硬黑边框或随机浮动卡。

## 9. 形状

基础控件圆角 12-14px，卡片 16-20px，大面板 22-28px。图表柱、进度条和胶囊状态沿用圆角端点。除非 DNA 明确需要拼接或特殊形状，不要混用多个无关圆角系统。

## 10. 组件样式

医疗图标用线性青绿；面板白底大圆角轻阴影；进度图用青绿渐变条和斜线剩余段；人物/地图媒体可作为辅助但不复制内容。

所有组件必须有 default、hover、active、focus、disabled、loading、selected 和 error 的必要状态。图标使用线性或同风格图标，不使用 emoji。表格和列表要保持行高稳定，避免 hover 或动态内容导致布局跳动。

## 11. 快捷入口区域

快捷入口放在预约面板或顶部体征指标旁，使用圆形青绿图标盒和短标签，数量 3-6。 快捷入口必须内容中立，使用 `quick_actions`、`quick_action_item`、`action_icon`、`action_label`、`action_meta`、`action_badge` 等槽位。桌面端 4-8 个，平板 2-4 列，移动端 2 列或横向滚动，触控目标不小于 44px。

## 12. 页面结构配方

```text
soft_header + vital_chips -> appointment_timeline + progress_panel + plan_card -> media_card + report_chart + map_panel
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
  --oy-page: #F6F8F8;
  --oy-surface: #FFFFFF;
  --oy-surface-muted: #EEF9FA;
  --oy-ink: #3A3A3A;
  --oy-ink-muted: #7D8182;
  --oy-line: #E6F0F0;
  --oy-primary: #4BBEC0;
  --oy-primary-soft: #E9F8F9;
  --oy-accent: #0A7F8A;
  --oy-primary: #4BBEC0; --oy-primary-dark: #0A7F8A;
}
```

Yida / Code Canvas 中使用页面级前缀类名，保留平台导航，不写 emoji。React 状态、筛选和图表数据用 `useState` 与 `useMemo` 派生。

## 17. 必须包含

保留轻字重标题、青绿渐变治疗卡、时间轴预约列表、柔淡报告与地图面板。 KPI 必须有对照维度；列表、图表和表格必须有 loading、empty、error 或 disabled 等必要状态。业务文案必须替换为当前场景语义。

## 18. 禁止项

禁止复制截图里的具体姓名、机构、金额、日期、业务名称或示例记录。禁止混入其他设计文档的颜色、圆角、阴影和图表语言。禁止使用 emoji。禁止把筛选、Tabs、搜索和按钮做成无状态静态装饰。禁止在移动端造成文字溢出或表格不可读。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 只保留业务字段，忽略视觉 DNA | 先落实 轻字重医疗问候标题、青绿渐变治疗卡、时间轴预约列表、柔淡报告与地图面板，再填业务内容 |
| 随机换成默认后台卡片 | 使用本设计文档的背景、圆角、边框和图表语言 |
| 复制截图中的具体内容 | 使用中性槽位并替换为当前业务语义 |
| 交互按钮只做静态样式 | 使用受控状态驱动筛选、搜索、Tabs 和选中态 |
| 移动端强挤所有列 | 合理堆叠或横向滚动，保持可读 |

## 20. Agent 使用提示

使用本 DESIGN.md 编码时，必须保护视觉 DNA：轻字重医疗问候标题、青绿渐变治疗卡、时间轴预约列表、柔淡报告与地图面板。先把需求映射到 `page_title`、`primary_metrics`、`main_chart`、`side_panel`、`quick_actions`、`detail_table` 等槽位，再替换成当前业务内容。不要混搭其他设计文档，不要复制参考图业务文本。

## 21. 交付自检清单

- [ ] 已抽象源图业务内容，没有保留具体姓名、机构、金额、日期或记录。
- [ ] 已保留视觉 DNA：轻字重医疗问候标题、青绿渐变治疗卡、时间轴预约列表、柔淡报告与地图面板。
- [ ] 色彩、圆角、阴影、字体和图表语言来自本设计文档。
- [ ] `quick_actions` 有符合风格文档的入口规则或一致空态。
- [ ] KPI 有对照维度，图表/列表/表格有必要状态。
- [ ] 筛选、搜索、Tabs 或周期切换有真实状态联动。
- [ ] 响应式无文字溢出、遮挡或不可读表格。
- [ ] 可访问性：图标按钮有标签，状态不只靠颜色表达。
