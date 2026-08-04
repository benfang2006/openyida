# 页面风格设计文档索引

本文件用于为 `yida-design` Step 5 选择页面级 `design.md`。每个 `*.design.md` 都是一份可复用的页面风格设计文档，包含视觉 DNA、适用场景、布局配方、组件规则、状态规则、Agent 使用提示和交付自检。

只选择 `status=ready` 的设计文档。`draft` 行用于占位、待补充或尚未完成质量检查的文档。

| design_id | file | status | scenes | density | layout | tone | tags | avoid | visual_dna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| deep-indigo-rounded-analytics-board | `deep-indigo-rounded-analytics-board.design.md` | ready | 工作台、仪表盘、管理后台、运营首页、分析概览 | high | A 指标优先 | 克制、专业、柔和、数据感、轻科技 | 分析工作台、指标概览、热力网格、对比图表、明细表、玻璃卡片 | 品牌落地页、内容文章页、重表单录入页、全暗大屏、强营销页面 | 深色顶部摘要舞台、玻璃质感指标卡、柔白大圆角分析面板、紫蓝数据纹理、顶部工具胶囊与圆角体系 |
| lime-bento-ops-workbench | `lime-bento-ops-workbench.design.md` | ready | 工作台、仪表盘、管理后台、运营首页、状态概览 | high | D 三栏协同 | 明亮、圆润、操作导向、清爽、轻量科技 | bento 工作台、荧光绿、状态概览、对比图表、明细表、快捷操作 | 品牌落地页、内容文章页、全暗大屏、严肃审计台、重表单录入页 | 浅灰画布上的白色 bento 面板、荧光绿主操作与重点指标、软圆角数据卡矩阵、黑绿成组对比图表、工具化明细表与柔和控件 |

## 新增设计文档

1. 使用 `_design-md-template.md` 或 `$image-to-design-md` 生成完整 DESIGN.md。
2. 保存为唯一文件名，格式为 `<design-id>.design.md`。
3. 在本索引中补充一行，写清场景、密度、布局、气质、标签和视觉 DNA。
4. 文档通过内容中立、视觉 DNA、快捷入口、组件状态、响应式和可访问性检查后，再把 `status` 标为 `ready`。

## 选择规则

- 优先从本索引的 `ready` 行选择。
- 按用户场景匹配 `scenes`，再按页面密度、布局和 `visual_dna` 选择最接近的风格。
- 未登记的 Markdown 文件通过质量检查后也可以选择，但应先补充到本索引。
- `_` 开头的文件是写作骨架，不作为页面风格使用。
- `registry.md` 只做索引，不作为页面风格使用。
