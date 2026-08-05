# 页面质量门禁

本文件用于 Step 4、Step 5 和 Step 6 输出前自检。页面设计必须先通过这些门禁，再交给实现阶段。PRD 负责业务结构、应用主题色和风格摘要，`design.md` 负责完整 UI 设计规则；不要把 `design.md` 内容复制进 PRD。

## 1. 区块数量门禁

- 工作台、首页、门户、看板、展示页和业务入口页至少有 10 个有业务目的的 `contentBlocks`。
- 计数按区块组算：KPI 组、快捷入口组、列表组、图表组各只算 1 个区块。
- 每个区块必须写清目的、数据来源、主操作和状态。
- 重复指标、重复入口、列表行、图表点、装饰块、空白容器不计数。

## 2. 源码槽位门禁

每个 display 页面都要能落到下列源码槽位：

| 槽位 | 必须写清 |
| --- | --- |
| `rootShell` | 页面外层背景、内容宽度、是否显示平台导航、移动端退化 |
| `prioritySurface` | 首屏最大视觉锚点：主趋势、主任务、主对象摘要或主视觉区 |
| `statusPrimitive` | 紧凑状态摘要、数据在线、更新时间、主健康分或状态胶囊 |
| `actionPrimitive` | 主操作、次操作、高频动作条、批量动作条或原生表单入口 |
| `contentPrimitive` | 表格、列表、任务流、事件流、排行、时间线、图表或详情预览 |
| `contextPrimitive` | 右侧洞察、风险、负责人、下一步建议或关联对象 |
| `statePrimitive` | loading、empty、error、未接数据、无权限和刷新/登记/补录动作 |
| `responsiveRule` | PC 到移动端的分栏退化顺序和关键区块保留规则 |

缺少 `prioritySurface`、`contentPrimitive` 或 `statePrimitive` 任意一项，不能交付为可实现页面设计。

## 3. 低密大卡片门禁

以下形态不通过：

- 标题下面直接铺 4 个等宽大 KPI 白卡。
- 快捷入口平铺成孤立图标卡阵列。
- 空数据时放 160px 以上大空白卡片，只写“暂无数据”。
- 右侧或下方大面积留白，没有任务、记录、动态、洞察、提醒或下一步动作。
- 所有区块都使用同一种卡片容器，没有无框区、细线面板、浅底条、列表行、表格或侧栏变化。

修正方式：

- KPI 改成 72-96px 紧凑摘要条、分段摘要或侧栏小面板。
- 高频动作改成按钮组、工具条或紧凑入口，低频动作折叠。
- 空态放在列表、表格或上下文面板内，并提供登记、刷新、补录或查看配置动作。
- 右侧补充风险、提醒、负责人、最近动态、业务洞察或下一步建议。

## 4. 主题一致性门禁

- 平台导航可见时，页面主按钮、链接、选中态、重点标签和图表主序列跟随应用主题。
- 参考风格的色相只作为辅助色、浅背景、图表第二序列或装饰气质；最终以当前项目 `design.md` 为准。
- 页面级独立色盘只用于隐藏平台导航、独立品牌页、活动页、公开落地页或用户明确要求。
- 默认业务页使用 light 模式；暗色只用于用户明确说暗色、夜间、高对比、黑金或暗色科技风。
- 主色不能无思考地固定为 `podBlue` / #1677ff；缺少主题证据时先根据行业、品牌、业务情绪和视觉目标做创意色彩判断，再选择平台预置主题或自定义 token；不得套用“科技=蓝、宠物=橙、法律=蓝”这类行业刻板配色。
- `shouldPassCreateAppTheme=true` 仅限 `themePresetKey` 命中平台预置 key；自定义色盘必须 `shouldPassCreateAppTheme=false`，创建应用时不传 `theme/colour`，并写清 `style#yida-global-theme` / `customThemeStyle.tokens` 注入方案。

## 5. 视觉层次门禁

需要“玻璃感、质感、高级、丰富、惊艳、驾驶舱、工作台打磨、卡片太平、页面太空”时，`design.md` 必须写清视觉层次，不允许只输出白底白卡。PRD 只引用 `design.md` 中的相关章节。

| 字段 | 必须写清 |
| --- | --- |
| `backgroundLayer` | 页面底色、渐变、径向光、弱纹理或业务素材；默认不能是纯白空背景 |
| `surfaceMaterial` | 玻璃、实色、细线面板、浅底条或列表行；玻璃要写 `rgba`、`backdrop-filter`、边框和阴影角色 |
| `colorRoles` | 主色、辅助色、语义色、图表色、弱背景色分别服务什么业务含义 |
| `depthRule` | 哪些区块有阴影/模糊/边框，哪些区块保持平面，避免全页同一种卡片 |

玻璃感页面的最低要求：

- 页面有至少 2 层背景：基础底色 + 弱渐变/径向光/素材遮罩。
- 玻璃面板使用半透明表面、细边框、柔和阴影和 `backdrop-filter`；不能是纯白不透明卡片。
- 色彩至少包含应用主色、1-2 个辅助色和稳定语义色；辅助色用于图表、状态或分组，不随机涂满卡片。
- 卡片、列表、图表和右侧上下文的容器形态要有差异，不能全部是同一种白卡片。

## 6. 双文件输出门禁

每个完整应用设计必须输出两份文件：

- `prd/<项目名>/prd.md`：业务、资源、页面结构、数据来源、主操作、顺序和验收。
- `prd/<项目名>/design.md`：主题 token、视觉 DNA、布局密度、表面材质、场景配方、组件规则和状态规则。

每个 display 页面在 PRD 中必须输出薄 `pageSpecHandoff`，并至少包含：

```markdown
- pageSpecHandoff：
  - pageStructure：<workbench-home / dashboard-overview / business-list / detail-profile / split-pane-detail / portal-shell-home / official-homepage / data-screen>
  - scene：<workbench / dashboard / list / detail / landing / screen>
  - contentBlocks：<10+ 区块；KPI/快捷入口/列表/图表子项不分别计数>
  - themeSummary：<应用主题色 / 风格关键词 / themeScope 摘要；必须与 design.md 一致>
  - designFile：<prd/<项目名>/design.md>
  - designRefs：<themeProfile / sceneRecipes.<scene> / components.<name> / states.<name>>
  - dataBinding：<form / report / connector / static-empty>
  - primaryAction：<主操作和打开方式>
```

`design.md` 必须包含 `rootShell`、`prioritySurface`、`statusPrimitive`、`actionPrimitive`、`contentPrimitive`、`contextPrimitive`、`statePrimitive`、`responsiveRule`、`backgroundLayer`、`surfaceMaterial`、`colorRoles` 和 `depthRule`。

缺少 `pageSpecHandoff`、缺少 `design.md`、或 `pageSpecHandoff` 没有引用 `designFile/designRefs` 时，Step 6 不算完成。
