---
version: alpha
name: inventory-ops-generated
description: 示例：根据仓储运营业务生成的一份应用级 design.md。只看结构和详略，不复制业务、颜色或组件组合。
design_id: generated-business-example
design_status: example
scenes: [工作台, 列表, 看板]
density: high
layout: 顶部状态条 + 左侧主任务 + 右侧风险上下文
tone: 清爽、可靠、操作导向、轻量数据感
tags: [仓储, 运营, 库存, 预警]
avoid: [品牌官网, 长文内容页, 独立营销页]
visual_dna:
  - name: 库存水位状态条
    confidence: inferred
    evidence: 仓储运营需要快速判断库存水位、低库存预警和待处理动作。
    rule: 首屏必须先给出紧凑状态条，再进入任务、列表和趋势，不用大面积空白 KPI 卡。
    implementation_hooks: [statusPrimitive, compact_metric_strip, warning_badge, trend_panel]
    failure_mode: 页面退化成四个等宽大卡和一块空态白板，无法表达库存运营节奏。
colors:
  bg-outer: "#F4F7F6"
  surface: "#FFFFFF"
  surface-muted: "#EAF3F1"
  text-primary: "#17211F"
  text-secondary: "#66736F"
  border-subtle: "#D8E3E0"
  brand: "#14806E"
typography:
  page-title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    fontSize: 28
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
spacing:
  page-x: 24
  grid-gap: 16
  card-x: 16
  card-y: 14
rounded:
  md: 8
  card: 8
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: 快捷入口放在状态条下方或主任务旁，使用图标 + 动词短语，数量 3-5 个，PC 端为紧凑按钮组，移动端折成两列。
---

# inventory-ops-generated DESIGN.md

## 1. 总览

这是一份结构示例，用来说明最终 `prd/<项目名>/design.md` 的详略。真实项目必须替换成当前业务的名称、角色、数据对象、主题色和页面结构。

该示例采用高密度运营工作台组织方式：先显示库存水位和待处理状态，再给出入库、出库、盘点和供应商入口，右侧保留风险、负责人和下一步动作。

## 2. 适用场景

适合仓储运营、库存管理、门店补货和轻量供应链工作台。不适合品牌官网、内容展示页和需要大幅情绪化视觉的营销页。

## 3. 视觉氛围

视觉气质清爽、可靠、操作导向。页面用低饱和浅底承载高频操作，用状态色表达库存风险，不依赖大面积渐变或装饰插画。

## 4. 视觉 DNA / 设计母体

| DNA | 证据 | 规则 | 实现钩子 | 失败表现 | 置信度 |
| --- | --- | --- | --- | --- | --- |
| 库存水位状态条 | 仓储场景需要先判断库存水位和低库存风险 | 首屏先出现 72-96px 紧凑状态条，含总量、低库存、待入库、待出库 | `statusPrimitive`、`warning_badge`、`compact_metric_strip` | 四张大 KPI 白卡撑满首屏 | inferred |
| 任务与风险并置 | 运营人员需要边处理任务边看风险 | 左侧主任务列表，右侧风险说明和下一步动作 | `contentPrimitive`、`contextPrimitive` | 风险散落在页面底部或只用颜色提示 | inferred |

## 5. 色彩角色

| token | 取值 | 用途 |
| --- | --- | --- |
| `bg-outer` | `#F4F7F6` | 页面根背景 |
| `surface` | `#FFFFFF` | 面板和表格背景 |
| `brand` | `#14806E` | 主按钮、选中态、主图表序列 |
| `warning` | `#B7791F` | 低库存和待处理提醒 |
| `danger` | `#C2413A` | 超期、异常和失败 |

## 6. 字体规则

标题 28px / 700，区块标题 16px / 700，正文 14px / 400，辅助说明 12px / 400。数字使用 tabular-nums，所有文字 `letter-spacing: 0`。

## 7. 布局原则

页面根容器使用浅底画布，内容最大宽度 1440px。PC 端采用 12 栅格：顶部状态条占满宽度，下方左侧 8 栅格为主任务和列表，右侧 4 栅格为风险上下文。

## 8. 层级与深度

深度主要来自浅底画布、白色表面、细边框和轻阴影。表格、任务列表和风险说明使用不同表面形态，不能全页都是同一种卡片。

## 9. 形状

普通控件圆角 6px，面板圆角 8px，状态标签圆角 999px。工作台内不使用超过 16px 的大圆角。

## 10. 组件样式

按钮使用品牌色填充，hover 加深 8%，focus 使用品牌色 20% 透明外环。图标默认来自 `lucide-react`，入库用 `Upload`，出库用 `Download`，查询用 `Search`，预警用 `AlertCircle`。

## 11. 快捷入口区域

快捷入口数量 3-5 个，使用图标 + 动词短语，例如入库登记、出库登记、库存盘点、查看供应商。PC 端在状态条下方形成紧凑按钮组，移动端折成两列。

## 12. 页面结构配方

- `primary_metrics`：库存总量、低库存、待入库、待出库。
- `quick_actions`：高频表单入口和查询入口。
- `detail_table`：库存明细或最近出入库记录。
- `status_note`：低库存原因、负责人、下一步动作。

## 13. 状态与交互

列表行 hover 使用浅品牌底色；选中行左侧出现 3px 品牌色竖线；loading 使用骨架屏；empty 必须提供登记或刷新动作；error 同时提供重试和查看配置。

## 14. 响应式

小于 768px 时，状态条横向滑动或两列折行，主任务、快捷入口、列表和风险上下文纵向排列。按钮触控目标不小于 40px。

## 15. 可访问性

状态不能只靠颜色表达，低库存同时显示图标和文字。纯图标按钮必须有 `aria-label`。所有 focus 状态可见，动效遵守 `prefers-reduced-motion`。

## 16. 实现适配

Code Canvas 根节点加 `data-yida-theme-root="true"`。Ant Design `ConfigProvider` 使用 `brand` 作为 `colorPrimary`。页面背景和控件主题通过 `style#yida-global-theme` 注入。

## 17. 必须包含

- 必须包含库存水位状态条。
- 必须包含快捷入口区域。
- 必须包含任务与风险并置关系。

## 18. 禁止项

- 禁止复制本示例的业务名、颜色和字段。
- 禁止使用四张大 KPI 卡加大空态白卡作为首屏。
- 禁止只用颜色表达库存风险。

## 19. 错误 vs 正确

| 错误 | 正确 |
| --- | --- |
| 直接复制示例的绿色和仓储字段 | 根据当前业务重新生成色彩和字段 |
| 快捷入口做成孤立图标大卡 | 快捷入口是紧凑按钮组或工具条 |

## 20. Agent 使用提示

只把本示例当作 `design.md` 的详略参考。生成真实项目时，根据当前 PRD 重新生成视觉 DNA、配色、组件规则、快捷入口和页面结构，内容替换后仍要保留每个 DNA 对应的规则。

## 21. 交付自检清单

- [ ] 业务内容已替换成当前项目。
- [ ] 识别了 2-5 个视觉 DNA。
- [ ] 每个 DNA 都有证据、规则、实现钩子、失败表现和置信度。
- [ ] 快捷入口区域已写清。
- [ ] 颜色由当前业务推导，没有复制示例色盘。
- [ ] 组件状态、响应式和可访问性完整。
