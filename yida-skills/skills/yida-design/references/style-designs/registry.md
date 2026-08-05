# 页面风格设计文档索引

本文件用于为 `yida-design` Step 5 选择应用级 `prd/<项目名>/design.md` 的参考风格来源。每个 `*.design.md` 都是一份可复用的风格参考文档，包含视觉 DNA、适用场景、布局配方、组件规则、状态规则、Agent 使用提示和交付自检；最终页面实现只遵守当前项目自己的 `design.md`。

只选择 `status=ready` 的设计文档。`draft` 行用于占位、待补充或尚未完成质量检查的文档。

| design_id | file | status | scenes | density | layout | tone | tags | avoid | visual_dna |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| deep-indigo-rounded-analytics-board | `deep-indigo-rounded-analytics-board.design.md` | ready | 工作台、仪表盘、管理后台、运营首页、分析概览 | high | A 指标优先 | 克制、专业、柔和、数据感、轻科技 | 分析工作台、指标概览、热力网格、对比图表、明细表、玻璃卡片 | 品牌落地页、内容文章页、重表单录入页、全暗大屏、强营销页面 | 深色顶部摘要舞台、玻璃质感指标卡、柔白大圆角分析面板、紫蓝数据纹理、顶部工具胶囊与圆角体系 |
| lime-bento-ops-workbench | `lime-bento-ops-workbench.design.md` | ready | 工作台、仪表盘、管理后台、运营首页、状态概览 | high | D 三栏协同 | 明亮、圆润、操作导向、清爽、轻量科技 | bento 工作台、荧光绿、状态概览、对比图表、明细表、快捷操作 | 品牌落地页、内容文章页、全暗大屏、严肃审计台、重表单录入页 | 浅灰画布上的白色 bento 面板、荧光绿主操作与重点指标、软圆角数据卡矩阵、黑绿成组对比图表、工具化明细表与柔和控件 |
| ops-command-three-column | `ops-command-three-column.design.md` | ready | 看板、驾驶舱、工作台、监控 | high | 三栏驾驶舱 | 克制、实时、经营感、行动导向 | 运营总控、风险雷达、事件流、主趋势、指标轨 | 品牌官网、重表单录入、纯详情页 | 左指标轨 + 中主趋势 + 右风险流、主图最大、风险窄条、事件流密集 |
| dark-task-workbench | `dark-task-workbench.design.md` | ready | 工作台、门户首页、处理台 | high | 左导航/主任务/右上下文 | 沉稳、专注、任务优先、操作感 | 任务队列、高频动作、深色工作台、右侧上下文 | 普通表单、浅色品牌官网、长文阅读 | 深色壳 + 任务优先区、深色半透明面板、动作工具化、右侧上下文 |
| light-task-workbench | `light-task-workbench.design.md` | ready | 工作台、门户首页、业务首页 | medium-high | 顶部摘要 + 双栏任务 | 清爽、克制、亲和、效率 | 待办列表、最近记录、高频动作、右侧提醒 | 暗色大屏、品牌官网、投屏监控 | 浅底任务流、克制标题、紧凑摘要、双栏承接、可执行空态 |
| master-detail-management-console | `master-detail-management-console.design.md` | ready | 列表、管理页、处理台 | high | 筛选工具栏 + 左列表 + 右详情 | 专业、密集、可操作、上下文稳定 | 主从分栏、表格、详情预览、批量操作 | 品牌官网、低信息展示页、数据大屏 | 列表不丢上下文、表格主角、筛选克制、右侧预览、批量反馈 |
| profile-detail-record | `profile-detail-record.design.md` | ready | 详情、展示页 | medium | 对象 Hero + 章节 + 侧栏 | 克制、质感、叙事、可信 | 对象详情、档案、时间线、关联对象 | 批量管理列表、实时监控、入口门户 | 单对象叙事、对象 Hero、章节叙事、非对称侧栏、时间线沉淀 |
| brand-homepage-editorial | `brand-homepage-editorial.design.md` | ready | 官网、落地页、品牌页 | medium | 实景 Hero + 交错章节 + CTA | 可信、真实、精致、转化 | 真实素材、品牌故事、服务矩阵、信任背书 | 后台工作台、管理列表、重表单 | 真实素材首屏、文字不进卡片、章节轮换、信任背书 |
| realtime-data-screen | `realtime-data-screen.design.md` | ready | 数据大屏、监控屏、指挥屏 | ultra | 中心态势 + 左右信息塔 | 实时、清晰、科技、告警优先 | 全屏、态势图、告警、排行、小趋势 | 普通工作台、品牌官网、长表单 | 中心态势 + 信息塔、左右信息塔、告警优先、远距可读 |

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
