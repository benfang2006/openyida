# Step 2：选择主题色和 token

> 这一步选择应用主色、辅助色、字体层级、组件基调和宜搭 token 作用域。

视觉方向要从“高级 / 简洁 / 商务”继续落细。PRD 只写应用主题色和风格摘要；`design.md` 写完整 `themeProfile`、主题 token、主色、辅助色、中性色、字体层级和组件基调。

已有应用里的单页重构/美化优先读取并沿用当前应用主题；只有用户明确要求完全不同视觉、独立品牌/活动页、隐藏导航沉浸页或指定新品牌色时，才做页面级独立主色。

## 选择主题色

1. 先判断业务气质：行业、目标用户、品牌关键词、业务情绪、视觉目标，以及是否需要亲和/专业/活力/稳重/科技/自然感。
2. 再判断是否命中平台预置主题 key：命中时写 `themePresetKey=<key>`，创建或更新应用时才允许传 `--theme <key>` / `colour=<key>`。
3. 若设计色不是平台预置主题 key，写 `themeColorSource=custom-brand-tokens`、`shouldPassCreateAppTheme=false`，创建应用时不要显式传 `theme/colour`。
4. 自定义色的 token 和注入方式写入 `design.md`，通过 `style#yida-global-theme` 或 `customThemeStyle.tokens` 注入，至少包含 `--color-brand1-6`、`--color-brand1-9`、`--color-brand1-2`、`--color-brand-1` ~ `--color-brand-4` 和 `--color-group`。
5. `podBlue`、`podGreen`、`podOrange` 只是常用浅底候选，不是固定默认。不要因为没有特别说明就自动回到 #1677ff，也不要套用“科技=蓝、宠物=橙、法律=蓝”这类行业刻板配色。

## 处理应用主题和页面风格

- 平台导航、顶部壳层或应用菜单可见时，应用主题色是页面主色来源；页面主按钮、链接、选中态、重点标签、图表主序列和表单入口都使用应用主题 `--color-brand1-*`。
- `design.md` 负责布局配方、信息密度、卡片形态、图表语言和视觉 DNA；当 `design.md` 色相与应用主题不同，把 `design.md` 色相降为辅助色、浅背景、分组色或装饰色。
- 需要页面主色明显不同于应用主题时，PRD 只写业务原因：隐藏平台导航、独立品牌/活动页、公开落地页，或用户明确要求全局换肤；`design.md` 写 `themeScope=app/page`、`themeRelation`、token 和注入方式。
- 若截图或预览中出现左侧导航选中态与页面主操作颜色不一致，优先把页面主操作和高频强调色改回应用主题；只有用户确认要改变整个应用主题时，再调用应用主题配置能力。

## 写颜色角色

- 主色：先按行业、品牌、业务情绪和视觉目标做创意判断，可选择平台预置主题，也可设计自定义品牌色盘；不得固定为 `podBlue` / #1677ff，不得套用行业刻板配色。
- 辅助色：用于按钮强调、状态提示、图表分组和重点指标。
- 中性色：背景、文字、边框、分割线，默认保持浅底业务风。
- 语义色：成功、警告、错误、信息保持稳定，不随意改成品牌色。
- 明暗模式：默认 `light`；`design.md` 的 `themeProfile.navTheme` 保持 `light`。
- `design.md` 的 `themeProfile.colorMode` 是宜搭配色模式，例如 `gradient`，不表示暗黑模式。

`openyida create-app --theme <key>` / `openyida update-app --theme <key>` 只填写平台预置主题 key。完整 key 与 token 见 [应用主题与 token 参考](../references/theme/theme-token-presets.md)。自定义色盘不传 `--theme`，token 和注入方案写入 `design.md`。

## 写字体层级

- 标题、正文、说明文字、数字指标分别建立层级。
- 管理页和列表页保持扫描效率；官网/落地页可以用更强的标题层级。
- 数字指标使用稳定对齐方式，单位、量级和口径一起出现。

## 写风格关键词

按业务选择，而不是只写“高级/简洁”：

- 企业管理：克制、清晰、可扫描。
- 经营看板：指标优先、图表成组、洞察明确。
- 监控大屏：态势清楚、风险突出、远距离可读。
- 品牌官网：真实素材、首屏主张、信任背书。
- 工具协作：高频动作突出、状态和反馈及时。

## 写组件基调

统一按钮、卡片、表格、标签、抽屉、弹窗、图标、空态、加载态和错误态。页面级自定义主题写入 `style#yida-global-theme` 或 scoped token；应用级换肤写 `customThemeStyle.tokens`。

## 产出

```markdown
PRD 主题摘要：
- 应用主题色：<平台预置 key 或自定义色盘名称>
- 风格摘要：<2-3 个业务风格关键词>
- 主题作用域摘要：<app / page；完整配置见 design.md>

design.md Theme Profile：
- themeProfile.name：<平台预置 key 或自定义色盘名称>
- themeScope：<page/app>
- themeColorSource：<应用主题/品牌素材/用户指定>
- themePresetKey：<命中平台预置时填写；自定义色盘留空>
- shouldPassCreateAppTheme：<true 仅限平台预置；false 表示 create-app 不传 theme/colour>
- globalThemeInjection：<style#yida-global-theme / customThemeStyle.tokens / none>
- navTheme：light
- colorMode：<宜搭配色模式，如 gradient；不表示暗黑>
- typography：<标题/正文/数字层级>
- componentTone：<按钮/卡片/表格/标签/抽屉风格>
```

## 下一步

→ [Step 3：规划页面和导航](step-3-information-architecture.md)
