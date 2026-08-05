---
version: alpha
name: 深色任务工作台
description: 面向待办、调度、运营处理和高频动作的深色工作台视觉规则。
design_id: dark-task-workbench
design_status: ready
scenes: [工作台, 门户首页, 处理台]
density: high
layout: 左导航/主任务/右上下文
tone: 沉稳、专注、任务优先、操作感
tags: [任务队列, 高频动作, 深色工作台, 右侧上下文]
avoid: [普通表单, 浅色品牌官网, 长文阅读]
visual_dna:
  - name: 深色壳 + 任务优先区
    confidence: observed
    evidence: 深色工作台适合把用户注意力集中到任务和操作。
    rule: 首屏最大区域给主任务或待处理列表，欢迎语只做上下文。
    implementation_hooks: [dark_shell, task_panel, context_side]
    failure_mode: 变成深色营销 Hero 或装饰大图。
colors:
  bg-outer: "#1C1018"
  surface: "rgba(255,255,255,.08)"
  surface-muted: "rgba(255,255,255,.04)"
  text-primary: "#FFF7FB"
  text-secondary: "rgba(253,242,248,.68)"
  border-subtle: "rgba(255,255,255,.14)"
  brand: "#BE185D"
---

# 深色任务工作台 DESIGN.md

## 1. 总览

这套风格用于需要用户打开页面后立即处理任务的深色工作台。深色只承担聚焦和层级，不承担炫技；所有视觉重量服务任务、状态和动作。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 任务优先 | `prioritySurface` 是待办、主任务区或选中任务详情 | 首屏只有标题和大 KPI |
| 深色半透明面板 | 面板用细边、低透明白、浅层阴影 | 高饱和渐变卡片堆满 |
| 动作工具化 | 高频动作是工具条或紧凑入口 | 大图标入口卡阵列 |
| 右侧上下文 | 右侧保留提醒、负责人、下一步建议 | 右侧空白或装饰图 |

## 3. 布局配方

- `rootShell`：深色背景，可带侧栏；平台导航可见时内容区不再自建全局导航。
- `statusPrimitive`：紧凑状态摘要，高 72-96px。
- `actionPrimitive`：顶部或任务区内 44-64px 动作条。
- `contentPrimitive`：待办、任务流、最近记录。
- `contextPrimitive`：右侧提醒、选中任务详情、业务说明。
- `statePrimitive`：薄空态行 + 创建/刷新/补录动作。

## 4. 组件规则

文字对比度优先；主按钮跟随应用主题或确认的深色品牌色；语义色只用于状态。图标为细描边功能图标，不做装饰图标。

## 5. 禁止项

- 不把深色等同于大面积发光、彩色 blob 或渐变文字。
- 不用欢迎语和大图占主视觉。
- 不用等高大 KPI 卡替代任务列表。
