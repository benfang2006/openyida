# Step 3：规划页面和导航

> 先画功能结构，再定页面。宜搭里优先使用平台导航、原生表单和流程能力，自定义页面负责体验入口和信息展示。

## 确定应用入口

1. 首页/入口页：官网首页、工作台、经营驾驶舱或其他入口。
2. 页面清单：每个页面写清 scene、目标用户、主任务和需要设计的区块；工作台、首页、门户、看板、展示页和业务入口页必须显式列出 10 个以上 `contentBlocks`。
3. 导航分组：按角色路径和业务主次分组，门面页靠前，数据录入/配置类页面靠后。
4. 表单/流程关系：录入、审批、权限、校验交给原生表单和流程。

## 列资源清单

完整应用要输出页面与表单资源清单，便于 `yida-app` 后续创建或复用资源。

### 列页面资源

| 页面 | resourceType | scene | 用途 | 实现链路 |
| --- | --- | --- | --- | --- |
| 主页 / 首页 / 工作台 | `display-page` | `workbench/dashboard/landing` | 应用第一入口、指标概览、快捷入口 | 默认 Code Canvas |
| 管理列表页 | `display-page` | `list` | 查询、筛选、批量操作、详情入口 | 默认 Code Canvas |
| 详情页 | `display-page` | `detail` | 单对象信息总览、时间线、关联对象 | 默认 Code Canvas |
| 数据大屏 / 看板 | `display-page` 或报表 | `screen/dashboard` | 指标监控、经营分析、投屏展示 | Canvas / Recharts / 报表 |

### 列表单资源

| 表单 | formKind | 用途 | 字段口径 |
| --- | --- | --- | --- |
| 普通数据表单 | `normal-form` | 数据录入、编辑、查询、列表数据源 | 字段名、字段类型、必填、默认值、Divider 分组 |
| 流程表单 | `process-form` | 审批、流转、节点处理 | 表单字段 + 流程节点、审批人、流转条件 |

资源清单使用业务语义和资源类型；`appType/corpId/baseUrl` 写入 PRD 的应用配置，`formUuid`、`fieldId`、`processCode` 等细节 ID 由实现阶段写入 `.cache/<项目名>-schema.json`。

## 给页面标场景

| 页面场景 | 场景参考 | 典型结构 |
| --- | --- | --- |
| workbench | `references/scenes/workbench.md` | 标题上下文 + 状态摘要 + 高频动作 + 待办 + 最近记录 + 动态 + 提醒 + 右侧上下文 + 空态行动 |
| dashboard | `references/scenes/dashboard.md` | KPI 卡组 + 图表 + 排行/明细 |
| screen | `references/scenes/screen.md` | full-bleed 中心态势 + 左右信息塔 |
| list | `references/scenes/list.md` | 筛选栏 + 表格/卡片 + 分页 + 详情抽屉 |
| detail | `references/scenes/detail.md` | 单对象 Hero + 摘要指标 + 章节叙事 |
| landing | `references/scenes/landing.md` | Hero + 差异化 Sections + 素材锚点 + CTA |
| split-pane | `references/scenes/list.md` | 左列表 + 右详情/处理区 |

## 排导航顺序

- 默认保留平台应用导航。
- 默认自定义页**保留平台应用导航**。
- 页面内 tab / 分段导航 / 自绘导航记录为当前页内容结构，同时保持平台导航可见。
- 页面内 tab、自绘侧边栏或独立门户壳写 `appBlueprint.hasPageNavigation: true`，同时保持平台导航可见。
- 仅说「工作台 / 门户 / 看板 / 大屏 / 首页」时，优先解释为平台导航下的当前页面体验。
- 显式要求隐藏平台导航、无导航、全屏无框、独立分享页或 `isRenderNav=false` 时，设置隐藏导航分支。
- 快捷入口目标是同应用内页面时，优先进入平台导航或导航分组。

## 产出

```markdown
- appBlueprint：<应用目标、角色、页面清单、导航分组>
- resourceBlueprint：<pages: name/resourceType/scene/purpose；forms: name/formKind/fields/process>
- 页面场景：<scene + 判定依据>
- 页面区块 / contentBlocks：<工作台、首页、门户、看板、展示页和业务入口页逐条列出至少 10 个区块；KPI 组和快捷入口组各只算 1 个区块>
- 页面关系：<上一层入口、下钻目标、原生表单/流程关系>
```

## 下一步

→ [Step 4：页面结构和交互设计](step-4-wireframe-interaction.md)
