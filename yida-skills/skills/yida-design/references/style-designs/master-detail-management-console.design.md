---
version: alpha
name: 主从列表管理台
description: 面向客户、订单、库存、工单和学生等对象管理的主从分栏视觉规则。
design_id: master-detail-management-console
design_status: ready
scenes: [列表, 管理页, 处理台]
density: high
layout: 筛选工具栏 + 左列表 + 右详情
tone: 专业、密集、可操作、上下文稳定
tags: [主从分栏, 表格, 详情预览, 批量操作]
avoid: [品牌官网, 低信息展示页, 数据大屏]
visual_dna:
  - name: 列表不丢上下文
    confidence: observed
    evidence: 管理台的效率来自筛选、列表和详情同屏。
    rule: 点行后在右侧详情或抽屉查看，不跳走丢失筛选。
    implementation_hooks: [filter_bar, table, detail_pane, bulk_bar]
    failure_mode: 点击进入新页后用户需要反复返回筛选。
colors:
  bg-outer: "#F5F7FA"
  surface: "#FFFFFF"
  surface-muted: "#F3F6FB"
  text-primary: "#1F2937"
  text-secondary: "#6B7280"
  border-subtle: "#E2E8F0"
  brand: "#2563EB"
---

# 主从列表管理台 DESIGN.md

## 1. 总览

这套风格用于高频查询和处理同类对象的页面。视觉重点是列表可扫、筛选克制、详情不跳页、批量动作有反馈。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 表格主角 | `prioritySurface` 是表格/列表 | 顶部渐变标题抢焦点 |
| 筛选克制 | 常用筛选一行，高级筛选折叠 | 筛选占满首屏 |
| 右侧预览 | 详情在右侧栏或抽屉 | 点行整页跳转 |
| 批量反馈 | 选中后出现批量动作条 | 按钮永远堆在顶部 |

## 3. 布局配方

- `rootShell`：浅底管理页，最大宽度按表格列数决定。
- `statusPrimitive`：总数、选中数、刷新状态。
- `actionPrimitive`：新建、导出、批量处理、重置筛选。
- `contentPrimitive`：表格或卡片列表。
- `contextPrimitive`：右侧详情预览、字段说明、下一步动作。
- `statePrimitive`：空态、无匹配、加载、错误、无权限。

## 4. 组件规则

主键列加重；时间、状态、金额列固定宽；金额右对齐并使用 `tabular-nums`；状态色只给关键状态。

## 5. 禁止项

- 不用每列等宽。
- 不给每个字段都上彩色标签。
- PC 新建不直接打开新标签，默认抽屉承载隐藏导航提交页。
