# 选择 design.md 参考风格

本文件用于在 Step 5 为完整应用生成一份应用级 `prd/<项目名>/design.md`。`references/style-designs/*.design.md` 只作为参考风格来源；当前项目最终交付的视觉契约必须沉淀到自己的 `design.md`。业务对象、字段、表单、流程、导航和权限都从当前 PRD 读取。

## 何时使用

| 页面类型 | 动作 |
| --- | --- |
| 工作台 / 门户首页 / 首页 | 在应用级 `design.md` 中写 workbench 场景配方，把视觉 DNA 落到首屏、指标、入口和侧栏 |
| 列表 / 管理页 / 处理台 | 在应用级 `design.md` 中写 list 场景配方，把视觉 DNA 落到筛选、列表、详情抽屉和状态标签 |
| 看板 / 驾驶舱 / 经营分析 | 在应用级 `design.md` 中写 dashboard 场景配方，把视觉 DNA 落到指标、图表、排行和异常状态 |
| 官网 / 品牌页 / 落地页 | 优先读 scene-landing 和素材策略，在应用级 `design.md` 中写 landing 场景配方 |
| 普通表单 / 流程表单 | 沿用应用级 `design.md` 的主题和平台原生表单，不单独选择设计文件 |

## 输入

从 Step 1-4 产物中提取：

| 信号 | 示例 |
| --- | --- |
| 页面目标 | 工作台、列表处理、经营看板、详情查看、入口门户 |
| 业务领域 | 项目、销售、财务、人事、客服、采购、生产、行政、门店 |
| 用户角色 | 一线执行、主管、运营、管理层、共享服务、外部访客 |
| 信息密度 | medium / high / ultra |
| 数据形态 | KPI、队列、趋势、排行、明细表、日程、快捷入口、预警 |
| 页面区块 | 顶部概览、搜索筛选、表格、图表、右侧详情、表单入口、空态 |

## 选择步骤

1. 读取 [style-designs/registry.md](style-designs/registry.md)。
2. 过滤 `status` 不是 `ready` 的设计文档。
3. 根据页面目标、业务领域、信息密度、数据形态和页面区块打分。
4. 最高分明显领先时，选择一个参考 `design.md` 作为应用级 `design.md` 的基准来源。
5. 多个风格都合适时，结合应用主题色和页面任务选择最贴近业务的一份；平台导航可见时优先选能适配当前应用主题的风格。
6. 完整读取最终选中的参考 `design.md`，提取视觉 DNA、布局配方、组件规则、状态规则和 Agent 使用提示。
7. 读取 [visual-scaffold-recipes.md](visual-scaffold-recipes.md)，选择视觉脚手架配方，写入当前项目的 `prd/<项目名>/design.md`。

## 主题关系判定

| 场景 | 主题关系写法 | 落地规则 |
| --- | --- | --- |
| 平台导航 / 应用菜单可见 | `跟随应用主题` | 主按钮、链接、选中态、重点标签、图表主序列使用应用主题；参考风格色彩作为辅助色和浅背景 |
| 参考风格的色相与应用主题不同 | `应用主题主导，参考色彩降级为辅助色` | 保留布局、密度、卡片、图表语言和视觉 DNA，不把页面主色改成参考风格色相 |
| 用户要求全局换肤 / 导航也一起变色 | `应用级换肤` | 输出 `themeScope=app`，实现阶段更新应用主题或壳层主题 |
| 隐藏平台导航、独立品牌页、活动页、公开落地页 | `页面级独立色盘` | 输出 `themeScope=page` 和独立色盘原因，页面内注入 scoped CSS vars |

## 打分参考

| 信号 | 分值 |
| --- | --- |
| 页面目标匹配 | +4 |
| 业务领域或角色匹配 | +3 |
| 信息密度匹配 | +2 |
| 数据形态或页面区块匹配 | +2 |
| 视觉气质匹配 | +1 |
| 命中 avoid | -4 |

最高分领先第二名 3 分以上，且总分不低于 8，可以直接选择。

## 输出字段

Step 5 生成 `design.md`，并让 PRD 的每个自定义展示页只引用它：

| 字段 | 写入位置 | 写法 |
| --- | --- |
| baseDesignSource | design.md | `references/style-designs/<design-id>.design.md` 或自定义业务风格 |
| designFile | PRD pageSpecHandoff | `prd/<项目名>/design.md` |
| designRefs | PRD pageSpecHandoff | 当前页面引用 design.md 的章节 ID |
| 风格理由 | PRD 页面章节 | 一句话说明为什么适合当前页面任务 |
| 视觉 DNA | design.md | 所有页面都必须保留的 2-5 个视觉 DNA |
| 页面区块 | PRD 页面章节 | 当前业务页面实际需要的区块 |
| 主题关系 | design.md + PRD 摘要 | 默认写“跟随应用主题”；若参考风格色相不同，写“应用主题主导，参考色彩降级为辅助色”；只有独立页面才说明页面级独立色盘原因 |
| visualScaffold | design.md | layoutRecipe、surfaceMap、sectionRhythm、densityRule、componentRecipe、emptyStateRecipe、acceptanceChecks |

## 实现交接

实现阶段读取 PRD 中的 `designFile/designRefs`，再读取当前项目 `design.md`，并按以下方式落地：

| design.md 内容 | 实现落点 |
| --- | --- |
| 视觉 DNA | 首屏、指标、列表、图表、侧栏、状态标签 |
| 色彩角色 | CSS token、按钮、链接、选中态、图表辅助色 |
| 布局配方 | 页面栅格、区域顺序、区块比例 |
| 组件规则 | 卡片、表格、按钮、筛选、抽屉、标签 |
| 状态规则 | 空态、加载、错误、无权限、禁用、选中 |
| visualScaffold | 实现阶段先按槽位填业务内容，再写样式；任何页面实现不得跳过 |

业务文案、字段、表单入口、流程处理、详情链接和导航顺序都从 PRD 读取；当前项目 `design.md` 提供所有页面必须遵守的视觉 DNA、布局、组件样式和状态规则。
