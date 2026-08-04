---
version: alpha
name: <风格或系统名称，可用英文 slug>
description: <内容中立的中文用途说明>
design_id: <design-id>
design_status: draft
scenes: [工作台, 首页]
density: medium
layout: <preferred archetype or custom layout>
tone: <视觉气质关键词>
tags: [<业务领域>, <角色>, <数据形态>]
avoid: [<不适合场景>]
visual_dna:
  - name: <可识别的设计记忆点名称>
    confidence: observed
    evidence: <参考图中可见的中文证据>
    rule: <生成新 UI 时必须如何保留它>
    implementation_hooks: [<布局/组件/token/CSS/图表钩子>]
    failure_mode: <缺失该 DNA 时会出现的风格漂移>
colors:
  bg-outer: "#..."
  surface: "#..."
  surface-muted: "#..."
  text-primary: "#..."
  text-secondary: "#..."
  border-subtle: "#..."
  brand: "#..."
typography:
  page-title:
    fontFamily: "..."
    fontSize: ...
    fontWeight: ...
    lineHeight: ...
    letterSpacing: 0
spacing:
  page-x: ...
  grid-gap: ...
  card-x: ...
  card-y: ...
rounded:
  md: ...
  card: ...
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: <基于整体视觉风格推断的快捷入口区域规则>
---

# <风格名称> DESIGN.md

## 1. 总览

用 2-4 个短段落说明可复用设计意图。保持内容中立，只说明气质、信息密度、主要用途和页面组织方式。

## 2. 适用场景

列出适合和不适合使用该风格的场景。

## 3. 视觉氛围

说明运营工具感/表达型、克制/戏剧化、密度、留白、专业度等取向。

## 4. 视觉 DNA / 设计母体

提取 2-5 个内容替换后仍必须保留的设计记忆点。每个 DNA 必须包含名称、证据、规则、实现钩子、失败表现和置信度。

## 5. 色彩角色

用表格列出 token、取值和用途，覆盖背景、表面、文字、边框、品牌色、状态色和图表序列。

## 6. 字体规则

定义字体栈、字号体系、行高、字重和数字排版。不要使用 viewport width 缩放字体，默认 `letter-spacing: 0`。

## 7. 布局原则

说明页面壳、最大宽度、网格比例、间距、内容顺序和中性槽位关系。

## 8. 层级与深度

说明深度来自平面表面、边框、阴影、色调层、毛玻璃、覆盖层或空间效果，并说明哪些地方不该使用阴影。

## 9. 形状

定义圆角尺度，以及每个尺度分别用于哪里。

## 10. 组件样式

覆盖顶部栏、按钮、图标按钮、卡片/面板、输入框/选择器、表格/列表、图表、标签/徽标、快捷入口、空状态、弹窗/浮层。相关组件要包含 default、hover、active、focus、disabled、loading、selected、error 等状态。

## 11. 快捷入口区域

工作台、仪表盘、管理后台或运营首页必须输出快捷入口区域规则。说明位置、容器、条目、数量、图标、文字、状态、响应式、与 DNA 的关系和禁止漂移。

## 12. 页面结构配方

提供 2-4 个使用中性槽位的布局配方，例如 `primary_metrics`、`quick_actions`、`trend_panel`、`detail_table`、`status_note`。

## 13. 状态与交互

列出 hover、active、focus、loading、empty、error、disabled、selected、mobile 和 reduced motion 规则。

## 14. 响应式

定义断点和布局折叠方式。说明文字适配、工具栏换行、表格横向滚动和触控目标尺寸。

## 15. 可访问性

要求对比度、focus 状态、纯图标控件标签、非纯颜色状态表达、键盘可访问和 reduced motion。

## 16. 实现适配

只包含相关适配，例如 CSS 变量、Ant Design ConfigProvider、Tailwind class 映射、Yida / Code Canvas 容器重置或 React 组件建议。

## 17. 必须包含

列出硬性正向要求。每个视觉 DNA 都必须作为明确必选规则出现。

## 18. 禁止项

列出硬性负向约束，覆盖会抹掉每个 DNA 的错误做法。

## 19. 错误 vs 正确

用短对照保护视觉 DNA 和快捷入口风格继承。

## 20. Agent 使用提示

提供一段简洁提示词，明确告诉 AI 如何使用该 DESIGN.md。必须说明视觉 DNA 在内容替换后也要保留。

## 21. 交付自检清单

- [ ] 源图业务内容已抽象为中性槽位。
- [ ] 文档识别了 2-5 个视觉 DNA / 设计母体。
- [ ] 每个 DNA 都包含证据、规则、实现钩子、失败表现和置信度。
- [ ] DNA 已同步进入必须包含、禁止项、错误 vs 正确、Agent 使用提示和最终自检。
- [ ] 若页面类型是工作台、仪表盘、管理后台或运营首页，文档已包含快捷入口区域。
- [ ] 可推断的 token 已给出具体值。
- [ ] 组件包含状态规则，而不只是静态外观。
- [ ] 响应式和可访问性规则完整。
- [ ] 不依赖原截图，也能指导生成一个新页面。
