# 场景参考速查

> 这个文件是 Step 3「规划页面和导航」的辅助材料，不是独立流程步骤。先判断页面场景，再按命中结果读取对应 `references/scenes/*.md`。

从命中的 scene 文件拿到：

- 场景定位
- 页面布局和入口关系
- 信息密度
- 焦点（hero）元素
- 组件组合
- 该场景专属业务化要点
- PRD 场景片段示例

| 页面类型 | scene 文件 |
|---|---|
| workbench | [references/scenes/workbench.md](../references/scenes/workbench.md) |
| dashboard | [references/scenes/dashboard.md](../references/scenes/dashboard.md) |
| screen | [references/scenes/screen.md](../references/scenes/screen.md) |
| list | [references/scenes/list.md](../references/scenes/list.md) |
| detail | [references/scenes/detail.md](../references/scenes/detail.md) |
| landing | [references/scenes/landing.md](../references/scenes/landing.md) |

## 专项变体速查

| 用户说法 | 先读 scene | 设计重点 |
|---|---|---|
| 经营看板 / 数据看板 / 管理驾驶舱 | dashboard | 经营指标、图表、排行明细和结论提示 |
| 数据大屏 / 实时监控 / 指挥舱 / 态势屏 | screen | full-bleed 大屏、中心态势、左右信息塔；默认浅底业务屏，明确暗色/夜间/高对比时才用深色沉浸 |
| 工作台 / 运营台 / 任务中心 / 系统首页 | workbench | 入口、待办、状态和最近记录 |
| 订单管理 / 客户列表 / 工单池 / 数据管理 | list | 筛选、表格/卡片、批量动作和详情抽屉 |
| 客户档案 / 订单详情 / 商品详情 / 项目详情 | detail | 单对象摘要、关键信息、章节和时间线 |
| 主从分栏 / 左列表右详情 / 处理台 | list | 保留列表上下文，右侧做对象详情和处理动作 |
| 页面内门户壳 / 多入口门户 / 隐藏导航门户 | workbench | 仅显式要求页面内导航、独立门户壳或隐藏平台导航时使用；写清角色入口和动态摘要 |
| Kanban / 阶段看板 / 商机阶段 | list | 阶段列、卡片状态、拖拽或状态变更入口 |
| 日历 / 排班 / 预约 / 排期 | list | 日历视图、时间筛选、预约状态和冲突提示 |
| 门店地图 / 区域运营 / 物流分布 | dashboard | 地图区域、指标浮层、区域排行和异常点 |
| 设置 / 规则配置 / 参数中心 | workbench | 配置分组、保存反馈、权限说明和低频入口 |
| 知识库 / 帮助中心 / 制度库 | landing 或 list | 对外展示偏 landing，内部检索偏 list |

## 产出

在 PRD 记录「布局骨架」「信息密度」「视觉焦点」三行（来自 scene 文件，按本页信息调整）。如果 scene 给出 Shell/Archetype、Section 构图或素材锚点，也写入「场景专项策略」。

需要更细的质量契约时，继续在当前 scene 文件内读取对应章节，保持参考范围聚焦在当前页面。

## 下一步

→ [Step 4：页面结构和交互设计](step-4-wireframe-interaction.md)
