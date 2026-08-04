# Step 5：页面风格、视觉与状态

> 本步骤把应用主题、页面区块和交互路径落到每个页面的具体风格、组件细节、素材图标和状态反馈。

## 1. 页面风格

先按页面逐个确定风格。自定义展示页、工作台、列表管理页、处理台、看板和首页门户需要输出页面级 `designMd`。

1. 读取 [页面风格设计文档选择](../references/style-design-selection.md)。
2. 读取 [页面风格设计文档索引](../references/style-designs/registry.md)。
3. 根据页面目标、业务领域、信息密度、数据形态和页面区块选择一个 `design.md`。
4. 完整读取选中的 `design.md`，提取视觉 DNA、布局配方、组件规则和状态规则。
5. 完整应用内默认保持同一套主风格；页面场景差异很大时，可以为不同页面选择不同 `design.md`，但主题色仍跟随应用主题。

输出字段：

```markdown
- pageStyle：<design_id>
- designMd：references/style-designs/<design-id>.design.md
- styleReason：<为什么适合当前页面>
- visualDna：<2-5 个必须保留的视觉 DNA>
- sectionStyle：<每个页面区块如何落到该风格>
- themeRelation：<跟随应用主题色 / 页面级独立色盘原因>
```

## 2. 视觉方向

在选定 `design.md` 后提炼：

- 2-3 个气质关键词：稳重可信、轻盈现代、克制高端、温暖亲和、前沿科技等。
- 3-5 条业务专属设计原则：结合业务对象和用户任务写具体规则。
- 差异化 5 维：色彩、构图、密度、组件语言、动线。
- `visualBaseline`：从 `design.md` 转成实现可消费字段，写清 `layoutRecipe`、`visualAnchor`、`sectionRhythm`、`densityRule`、`actionPlacement`、`responsiveRule` 和 `acceptanceChecks`。

## 3. 组件与状态

- 按主题统一按钮、输入、卡片、表格、标签、弹窗、抽屉和图标样式。
- 页面美感提升、重构和改 UI 时保留当前功能契约：数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限和业务状态继续有效。
- 明确正常、hover/active、禁用、加载、空态、错误、无权限、无数据状态。
- 表单验证、成功/失败提示使用平台语义色和原生能力。
- 下拉刷新、上拉加载、轮询刷新等只在真实场景需要时设计。

## 4. 素材与图标

- 官网、产品首页、品牌页、视觉化工作台默认要有真实图片或生成图片。
- 强视觉官网至少形成“场景 Hero + 产品/服务 + 过程/空间”的素材故事。
- 素材暂缺时标注 draft，并写清缺口，例如 heroImage、productImages、brandLogo、caseImages。
- 图标使用功能性内联 SVG，同一页面保持一套图标风格。

## 5. 去 AI 味自检

检查：

1. 页面是否有当前业务专属信息，而不是示例品牌名、默认指标和通用卖点。
2. 首屏是否只有一个明确主张或核心判断。
3. 每个区块是否有不同的信息目的和构图节奏。
4. 颜色是否服务业务语义，语义色是否稳定。
5. 图标是否功能化，页面渲染文案是否使用纯文本。
6. 空态、加载态、错误态是否符合当前业务。
7. 列表、看板、详情是否保留用户当前上下文。
8. 新增/提交/编辑是否使用原生表单入口。
9. 首屏是否有视觉锚点、主操作、关键状态和至少两个信息层。
10. 自定义展示页是否写清 `designMd`、视觉 DNA 和页面区块风格。

## 产出

```markdown
- pageVisualDesign：<pageStyle/designMd/styleReason/visualDna/sectionStyle/themeRelation>
- visualProfile：<mood/density/layoutRhythm/differentiation>
- visualBaseline：<layoutRecipe/visualAnchor/sectionRhythm/densityRule/actionPlacement/responsiveRule/acceptanceChecks>
- componentSpec：<按钮/表格/卡片/标签/抽屉/图标>
- stateSpec：<正常/禁用/加载/空态/错误/无权限>
- assetStrategy：<图片/图标/素材缺口/materialStatus>
- deAiChecks：<通过项和需要修正项>
```

## 下一步

→ [Step 6：交付开发](step-6-handoff.md)
