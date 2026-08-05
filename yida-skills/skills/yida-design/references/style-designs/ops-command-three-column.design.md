---
version: alpha
name: 运营驾驶舱三栏
description: 面向运营总控、进销存、履约、风险和客服调度的一屏式驾驶舱视觉规则。
design_id: ops-command-three-column
design_status: ready
scenes: [看板, 驾驶舱, 工作台, 监控]
density: high
layout: 三栏驾驶舱
tone: 克制、实时、经营感、行动导向
tags: [运营总控, 风险雷达, 事件流, 主趋势, 指标轨]
avoid: [品牌官网, 重表单录入, 纯详情页]
visual_dna:
  - name: 左指标轨 + 中主趋势 + 右风险流
    confidence: observed
    evidence: 高质量驾驶舱通常把状态、趋势和异常拆到不同扫描轨道。
    rule: 首屏必须形成左侧指标轨、中间主图表、右侧风险/事件流的非对称结构。
    implementation_hooks: [grid-template-columns, metric_rail, main_chart, risk_stream]
    failure_mode: 退化成四张等宽 KPI 卡和两个空白图表。
colors:
  bg-outer: "#F4FAF8"
  surface: "#FFFFFF"
  surface-muted: "#EAF7F4"
  text-primary: "#132722"
  text-secondary: "#6A7A75"
  border-subtle: "#D8E9E4"
  brand: "#0F9F8E"
---

# 运营驾驶舱三栏 DESIGN.md

## 1. 总览

这套风格用于需要持续判断状态、趋势、异常和下一步动作的运营页面。页面不是卡片陈列，而是把信息分到三条扫描轨道：左侧看健康度，中间看趋势，右侧看风险和事件。

## 2. 适用场景

适合订单履约、库存预警、客服 SLA、门店运营、采购入库、人效监控。  
不适合品牌官网、纯字段详情、重录入表单。

## 3. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 三栏扫描轨 | 左 260-320px 指标轨，中间 1fr 主图表，右 280-360px 风险流 | KPI 等大平铺 |
| 主图最大 | 主趋势图是首屏最大区域，高 360-520px | 图表和卡片等重 |
| 风险窄条 | 风险项用语义色竖条 + 等级 + 数字 | 整卡高饱和背景 |
| 事件流密集 | 事件用时间 + 标题 + 说明 + 分割线 | 大空白动态卡 |

## 4. 色彩角色

主色跟随应用主题；青绿仅作为默认基准。风险红、警告橙、成功绿保持语义色，不替换为品牌色。

## 5. 布局配方

- `rootShell`：浅底业务页，最大宽度 1440px，平台导航可见时不自建导航。
- `prioritySurface`：中间主趋势图或主经营结论。
- `statusPrimitive`：左侧主健康分 + 3-5 个小趋势。
- `actionPrimitive`：顶部刷新、时间范围、导出或登记入口。
- `contentPrimitive`：主趋势、结构分布、排行或明细。
- `contextPrimitive`：右侧风险雷达和事件流。
- `statePrimitive`：未接数据时保留三栏结构，用薄空态和刷新/登记入口承接。

## 6. 组件规则

指标数字使用 `tabular-nums`；图表最多 4 色；按钮、链接、选中态跟随应用主题；面板用细线和浅阴影，不做重卡片。

## 7. 禁止项

- 不用四张等宽大 KPI 卡撑首屏。
- 不用彩色图标方块表达指标。
- 不用 160px 以上空白卡片写“暂无数据”。

## 8. 交付自检

- [ ] 三栏比例存在。
- [ ] 主图是最大视觉锚点。
- [ ] 右侧有风险或事件流。
- [ ] 空态仍保留结构和动作。
