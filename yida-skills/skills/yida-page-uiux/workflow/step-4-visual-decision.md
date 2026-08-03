# Step 4：视觉方向决策（差异化规则）

> 读 [references/visual-decision-engine.md](../references/visual-decision-engine.md)，在场景可行域内选择视觉方向，并完成反默认自检。

## 宜搭的关键主色约束

- **导航可见时，主色由平台品牌变量 `var(--color-brand1-*)` 控制，不能自由换主色相**（要跟应用框架融合），所以差异化落到下面 5 个维度。
- **显式隐藏导航时（Step 0 判定为 `isRenderNav=false`）主色相可自立**，但语义色仍固定、去 AI 味红线仍生效，差异化 5 维照样要做（至少 3 个维度偏离「默认泛滥组合」）。

## 明暗模式与主题色必填

视觉方向不能只写“高级 / 简洁 / 商务”。每次必须明确下面 5 项：

- `themeProfile.name`：默认从 `podBlue`、`podGreen`、`podOrange` 等应用主题中选择；用户明确要求应用主题色时才写 `yida-app-theme`；用户指定其他平台预置 key 时才记录对应 `appThemeKey`。
- `themeScope`：默认 `page`，只有用户明确要求影响应用壳层 / 全局换肤时才用 `app`。
- 明暗模式：默认 `light`，并保持 `themeProfile.navTheme=light`。工作台、门户、列表、详情、普通看板和数据大屏默认不要采用暗黑、深色、黑金、夜间、高对比、`black` 或近黑背景。注意 `themeProfile.colorMode` 是宜搭配色模式（如 `gradient`），不是 light/dark。
- `themeColorSource`：应用主题 / 运行态应用主题 / 用户指定品牌色 / sample 独立色盘。`blue`、`green`、`orange` 作为应用主题 token profile 保留原名；新默认优先推荐 `podBlue`、`podGreen`、`podOrange`。
- `themeColor`：写主色的来源或色值；真实业务页不要凭空硬编码主色，sample 或用户指定品牌色除外。

只有用户明确说暗色、深色、暗黑、夜间、高对比、黑金、暗色科技风，才允许 `colorMode=dark` 或深色沉浸方案；“好看 / 高级 / 大屏 / 看板 / 驾驶舱”不等于暗黑。

## 差异化 5 维

1. **辅助/强调色**（点缀色、图表色板、状态色的取法）
2. **中性色冷暖偏色**（冷灰 / 中性 / 暖灰基底——最容易区分气质又最常被忽略）
3. **圆角性格**（直角工程感 / 微圆克制 / 大圆亲和，全页统一一种性格）
4. **排版性格**（字重对比、字号跨度、字间距、`tabular-nums`——字体不能换 Google Fonts，用这些造性格）
5. **装饰母题 / 视觉 DNA**（2-3 个贯穿全页的视觉基因，遮住标题也能认出是同一套设计）

执行要求：**强制第二选择**（跳过第一直觉）+ **反默认自检**（不像 90% 同类页）。

## 场景专项决策（按页面类型追加）

- **landing/官网类**：每个 section 必须选择不同构图手法，并声明视觉锚点（真实图片/产品图/数据图示/信息图/大字排版）。不要连续两个 section 都是左文右图/卡片三列。Hero 构图按品牌调性选择，不默认左文右图，也不默认满屏背景。
- **dashboard/看板类**：先选 Shell，再选 Archetype。Shell 解决导航骨架（single_page/top_nav/side_nav/l_shaped/无壳），Archetype 解决内容叙事（总览/分析/监控/报告/对比/运营）。每个图表/KPI 必须能回答一个业务问题，并给可读洞察。
- **workbench/list/detail**：沿用 scene 文件的焦点和组件套餐；如有多视图或隐藏导航，叠加 `yida-nav-shell` 的壳型决策。

## Dribbble / 优秀案例转译

用户明确要求参考 Dribbble、Dribble、优秀案例或高级设计时，本步骤不能只写“参考某某风格”。必须先把 2-3 个同类案例抽象成可落地变量，再进入差异化 5 维：

- `layoutPattern`：案例采用的是单屏工作台、非对称双栏、对象 hero、全高侧栏、中心地图、密集表格还是沉浸式 landing。
- `visualAnchor`：首屏靠真实图片、产品截图、超大数字、中心图形、地图底图、人物/品牌图还是信息图建立记忆点。
- `densityModel`：信息密度是运营后台密集型、SaaS 中密型、官网留白型还是大屏监控型。
- `colorMood`：主色、辅助色、中性色冷暖和背景素材如何配合；sample 可以自带主题色，真实业务页则必须尊重应用主题。
- `componentDetail`：按钮、标签、表格、卡片、tooltip、导航覆盖、时间线、图表图例等细节如何更像真实产品。

决策块中写一句“参考转译”：说明从优秀案例里吸收了什么设计变量，以及落到本页面的哪个区域。禁止照搬单个 Dribbble 作品的完整构图、图片或文案。

## 产出

在决策块「差异化 5 维」区块逐条记录，并写一句「反默认说明」：本方案与「统一灰白底 + 8px 圆角卡片 + 系统字体 + 蓝色强调」的默认脸在哪 ≥3 个维度不同。landing/dashboard 还要补「场景专项策略」。

## 下一步

→ [Step 5：图标与素材策略](step-5-icon-and-assets.md)
