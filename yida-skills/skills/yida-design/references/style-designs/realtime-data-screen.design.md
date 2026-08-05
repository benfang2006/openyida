---
version: alpha
name: 实时数据大屏
description: 面向投屏监控、态势感知、告警处置和实时运营的全屏数据大屏视觉规则。
design_id: realtime-data-screen
design_status: ready
scenes: [数据大屏, 监控屏, 指挥屏]
density: ultra
layout: 中心态势 + 左右信息塔
tone: 实时、清晰、科技、告警优先
tags: [全屏, 态势图, 告警, 排行, 小趋势]
avoid: [普通工作台, 品牌官网, 长表单]
visual_dna:
  - name: 中心态势 + 信息塔
    confidence: observed
    evidence: 数据大屏远距离阅读需要中心态势和两侧信息塔。
    rule: 中央最大区域展示态势，左右固定指标、告警、排行和趋势。
    implementation_hooks: [fullscreen_shell, map_stage, side_towers, alert_feed]
    failure_mode: 普通网页看板放大版。
colors:
  bg-outer: "#071426"
  surface: "rgba(17,43,75,.72)"
  surface-muted: "rgba(10,31,57,.62)"
  text-primary: "#EAF6FF"
  text-secondary: "#8FB3C8"
  border-subtle: "rgba(80,180,255,.22)"
  brand: "#31D7FF"
---

# 实时数据大屏 DESIGN.md

## 1. 总览

这套风格用于投屏和实时监控。页面以远距离可读、状态突出、告警优先为目标，不能只是普通看板改成深色。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 中心态势 | 中央地图、拓扑、流程或主趋势最大 | 多个等大面板 |
| 左右信息塔 | 左右固定 KPI、排行、告警、趋势 | 信息散落无节奏 |
| 告警优先 | 告警有等级、时间和处置入口 | 红色泛滥 |
| 远距可读 | 字号、间距、对比度面向投屏 | 细小表格密密麻麻 |

## 3. 布局配方

- `rootShell`：全屏无框，通常 `isRenderNav=false`。
- `prioritySurface`：中心态势图或实时主趋势。
- `statusPrimitive`：顶部在线状态、更新时间和核心 KPI。
- `actionPrimitive`：刷新、全屏、查看告警、进入处置。
- `contentPrimitive`：态势图、排行、告警流、小趋势。
- `contextPrimitive`：处置建议、区域说明、告警等级。
- `statePrimitive`：数据中断、暂无告警、接口错误和重试。

## 4. 禁止项

- 不把普通 dashboard 套深色背景后交付为大屏。
- 不使用过细表格和过小字号。
- 不让告警红成为页面主色。
