---
version: alpha
name: 浅色任务工作台
description: 面向企业日常待办、学生管理、门店运营和行政协作的浅色工作台视觉规则。
design_id: light-task-workbench
design_status: ready
scenes: [工作台, 门户首页, 业务首页]
density: medium-high
layout: 顶部摘要 + 双栏任务
tone: 清爽、克制、亲和、效率
tags: [待办列表, 最近记录, 高频动作, 右侧提醒]
avoid: [暗色大屏, 品牌官网, 投屏监控]
visual_dna:
  - name: 浅底任务流
    confidence: observed
    evidence: 日常办公首页需要可读、耐看和可重复操作。
    rule: 使用浅底、细线、紧凑摘要和真实列表承接，不用大白卡堆叠。
    implementation_hooks: [light_shell, compact_summary, task_feed]
    failure_mode: 退化成 4 个大 KPI + 图标快捷入口 + 空白卡。
colors:
  bg-outer: "#F6F8FB"
  surface: "#FFFFFF"
  surface-muted: "#F0F6FF"
  text-primary: "#172033"
  text-secondary: "#6B7280"
  border-subtle: "#DDE6F2"
  brand: "#2563EB"
---

# 浅色任务工作台 DESIGN.md

## 1. 总览

这套风格适合常规业务首页：学生管理、门店日常、行政、人事、项目协作。页面要让用户快速知道要处理什么、从哪里进入、最近发生了什么。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 克制标题 | 标题区短小，只承载上下文 | 大 Hero 或大欢迎插画 |
| 紧凑摘要 | 状态摘要 72-96px，有主次 | 四张等宽大白卡 |
| 双栏承接 | 左侧任务/记录，右侧提醒/上下文 | 下方大空白卡 |
| 可执行空态 | 空态有登记、刷新或补录动作 | 只写暂无数据 |

## 3. 布局配方

- `rootShell`：浅灰底，内容最大宽度 1280-1440px。
- `prioritySurface`：待处理列表、最近记录或主状态摘要。
- `actionPrimitive`：工具条、按钮组、原生表单入口。
- `contentPrimitive`：列表、表格、动态流、最近记录。
- `contextPrimitive`：右侧提醒、业务说明、负责人、进度。
- `responsiveRule`：移动端标题、摘要、动作、任务、记录、上下文纵向排列。

## 4. 组件规则

按钮和选中态跟随应用主题；入口用紧凑图标 + 文字或按钮组；列表行保持 52-72px，状态标签低饱和。

## 5. 禁止项

- 不使用孤立图标大卡片阵列。
- 不用空白大卡表示无记录。
- 不把 KPI 子项当成多个区块计数。
