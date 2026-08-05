---
version: alpha
name: 详情档案页
description: 面向客户档案、商品详情、订单详情、项目详情和资产详情的单对象展示视觉规则。
design_id: profile-detail-record
design_status: ready
scenes: [详情, 展示页]
density: medium
layout: 对象 Hero + 章节 + 侧栏
tone: 克制、质感、叙事、可信
tags: [对象详情, 档案, 时间线, 关联对象]
avoid: [批量管理列表, 实时监控, 入口门户]
visual_dna:
  - name: 单对象叙事
    confidence: observed
    evidence: 好的详情页先确认对象身份，再讲状态和关联记录。
    rule: 首屏展示对象身份和主数据，字段按业务章节组织。
    implementation_hooks: [object_hero, meta_aside, timeline, related_list]
    failure_mode: 一屏字段墙，像数据库导出。
colors:
  bg-outer: "#F7F5F1"
  surface: "#FFFFFF"
  surface-muted: "#F4EFE7"
  text-primary: "#2B241E"
  text-secondary: "#74695E"
  border-subtle: "#E6DDD0"
  brand: "#8B5E34"
---

# 详情档案页 DESIGN.md

## 1. 总览

这套风格用于单对象详情。页面要先让用户确认对象身份，再理解状态、章节、历史和关联对象。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 对象 Hero | 主图/主数据完整展示，不裁切不发光 | 标题 + 字段墙 |
| 章节叙事 | 章节标题带业务语境 | 基本信息/详细信息泛化标题 |
| 非对称侧栏 | 主要内容 65-75%，侧栏承载元信息和操作 | 全页均匀平铺 |
| 时间线沉淀 | 变更、审批、跟进用时间线 | 历史记录缺失 |

## 3. 布局配方

- `rootShell`：浅暖或中性背景，页面级独立色只用于品牌展示。
- `prioritySurface`：对象身份 + 主图/主数据。
- `statusPrimitive`：对象状态、阶段、风险或核心数值。
- `actionPrimitive`：编辑、审批、下载、返回、联系。
- `contentPrimitive`：章节信息、时间线、附件、关联列表。
- `contextPrimitive`：侧栏元信息、负责人、权限、下一步。
- `statePrimitive`：资料缺失、无附件、无时间线、无权限和重试。

## 4. 禁止项

- 不做字段墙。
- 不给每个章节标题配装饰图标。
- 不用彩色发光、半透明 blob 或渐变文字。
