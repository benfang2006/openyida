---
version: alpha
name: 品牌官网首页
description: 面向官网、品牌展示、活动落地页和线索转化页的编辑式视觉规则。
design_id: brand-homepage-editorial
design_status: ready
scenes: [官网, 落地页, 品牌页]
density: medium
layout: 实景 Hero + 交错章节 + CTA
tone: 可信、真实、精致、转化
tags: [真实素材, 品牌故事, 服务矩阵, 信任背书]
avoid: [后台工作台, 管理列表, 重表单]
visual_dna:
  - name: 真实素材首屏
    confidence: observed
    evidence: 品牌页需要真实场景、产品或空间，而不是抽象渐变。
    rule: Hero 使用真实或生成位图素材，文字叠加其上，首屏露出下一段内容。
    implementation_hooks: [hero_image, editorial_sections, proof_grid, cta_band]
    failure_mode: Split text/media 卡片或纯渐变首屏。
colors:
  bg-outer: "#FFFFFF"
  surface: "#F7F5F0"
  surface-muted: "#EFE8DE"
  text-primary: "#1F2933"
  text-secondary: "#667085"
  border-subtle: "#E5E0D8"
  brand: "#3B5B4A"
---

# 品牌官网首页 DESIGN.md

## 1. 总览

这套风格用于需要建立信任、展示产品/服务并引导咨询或提交线索的页面。核心是实景素材、章节节奏和明确 CTA。

## 2. 视觉 DNA

| DNA | 规则 | 失败表现 |
| --- | --- | --- |
| 实景 Hero | 首屏必须有真实产品、空间、人物或服务场景图 | 纯渐变、抽象 SVG |
| 文字不进卡片 | Hero 文案直接叠在画面上 | split 卡片式首屏 |
| 章节轮换 | 价值、产品、流程、信任、CTA 构图不同 | 连续三卡片网格 |
| 信任背书 | 案例、资质、流程、团队或数据支撑 | 只有口号 |

## 3. 布局配方

- `rootShell`：无平台导航或公开页时可全宽；应用内官网仍遵循主题关系。
- `prioritySurface`：实景 Hero + 品牌主张。
- `actionPrimitive`：咨询、报名、提交线索、查看产品。
- `contentPrimitive`：产品/服务、流程、案例、信任背书。
- `contextPrimitive`：品牌故事、适用人群、服务范围。
- `statePrimitive`：素材缺口、表单入口不可用和线索提交反馈。

## 4. 禁止项

- 不用 split text/media 卡片当 Hero。
- 不用纯渐变或 SVG 插画替代真实素材。
- 不复制通用卖点，文案必须贴合当前品牌。
