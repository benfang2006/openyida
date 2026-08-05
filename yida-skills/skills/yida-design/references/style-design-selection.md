# 生成 design.md 规则

本文件用于在 Step 5 为完整应用生成一份应用级 `prd/<项目名>/design.md`。`style-designs/_design-md-template.md` 是结构模板，`style-designs/generated-business-design.example.md` 是唯一示例；它们只约束字段完整度和描述粒度，不提供可套用的页面样式。业务对象、字段、表单、流程、导航、权限和页面结构都从当前 PRD 读取。

## 何时使用

| 页面类型 | 动作 |
| --- | --- |
| 工作台 / 门户首页 / 首页 | 在应用级 `design.md` 中生成 workbench 场景配方，把当前业务的视觉 DNA 落到首屏、指标、入口和侧栏 |
| 列表 / 管理页 / 处理台 | 在应用级 `design.md` 中生成 list 场景配方，把当前业务的视觉 DNA 落到筛选、列表、详情抽屉和状态标签 |
| 看板 / 驾驶舱 / 经营分析 | 在应用级 `design.md` 中生成 dashboard 场景配方，把当前业务的视觉 DNA 落到指标、图表、排行和异常状态 |
| 官网 / 品牌页 / 落地页 | 从当前业务价值路径、素材清单、CTA 和 `design.md.assetStrategy` 生成 landing 场景配方 |
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
| 主题证据 | 当前应用主题、用户指定品牌、行业气质、是否隐藏平台导航 |

## 生成步骤

1. 读取 [style-designs/registry.md](style-designs/registry.md)。
2. 读取 [style-designs/_design-md-template.md](style-designs/_design-md-template.md)，用它作为最终 `design.md` 的结构基准。
3. 只在不确定详略时读取 [style-designs/generated-business-design.example.md](style-designs/generated-business-design.example.md)，只学习“写到多细”，不学习示例业务、色盘、字段、页面顺序或组件组合。
4. 根据当前业务生成 2-5 个 `visual_dna`。每个 DNA 必须有名称、证据、规则、实现钩子、失败表现和置信度。
5. 根据行业、品牌、业务情绪、应用主题和用户偏好生成配色。不要复制示例颜色，不要固定使用蓝色、绿色、紫色或任何预置色。
6. 读取 [visual-scaffold-recipes.md](visual-scaffold-recipes.md)，选择适合当前页面组合的中性槽位，写入当前项目的 `prd/<项目名>/design.md`。
7. 如果平台导航可见，页面主按钮、链接、选中态、重点标签和图表主序列默认跟随应用主题；自定义色盘只能作为辅助色、浅背景、图表第二序列或页面级独立主题。

## 主题关系判定

| 场景 | 主题关系写法 | 落地规则 |
| --- | --- | --- |
| 平台导航 / 应用菜单可见 | `跟随应用主题` | 主按钮、链接、选中态、重点标签、图表主序列使用应用主题；模型生成的业务色彩作为辅助色和浅背景 |
| 生成色盘与应用主题不同 | `应用主题主导，生成色彩作为辅助色` | 保留布局、密度、组件语言和视觉 DNA，不把页面主色改成与应用主题冲突的色相 |
| 用户要求全局换肤 / 导航也一起变色 | `应用级换肤` | 输出 `themeScope=app`，实现阶段更新应用主题或壳层主题 |
| 隐藏平台导航、独立品牌页、活动页、公开落地页 | `页面级独立色盘` | 输出 `themeScope=page` 和独立色盘原因，页面内注入 scoped CSS vars |

## 输出字段

Step 5 生成 `design.md`，并让 PRD 的每个自定义展示页只引用它：

| 字段 | 写入位置 | 写法 |
| --- | --- | --- |
| baseDesignSource | design.md | `generated-from-business-context` |
| designFile | PRD pageSpecHandoff | `prd/<项目名>/design.md` |
| designRefs | PRD pageSpecHandoff | 当前页面引用 design.md 的章节 ID |
| 风格理由 | PRD 页面章节 | 一句话说明为什么适合当前页面任务 |
| 视觉 DNA | design.md | 所有页面都必须保留的 2-5 个视觉 DNA |
| 页面区块 | PRD 页面章节 | 当前业务页面实际需要的区块 |
| 主题关系 | design.md + PRD 摘要 | 默认写“跟随应用主题”；若生成色相不同，写“应用主题主导，生成色彩作为辅助色”；只有独立页面才说明页面级独立色盘原因 |
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
