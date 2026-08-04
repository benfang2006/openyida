# Step 2：主题系统

> 主题系统决定应用气质，也决定页面是否能和宜搭平台壳层融合。

视觉方向要从“高级 / 简洁 / 商务”继续落细。PRD 必须写明 `themeProfile.name`、`themeScope`、`navTheme=light`、`themeColorSource`，并把主色、辅助色、中性色、字体层级和组件基调落到可执行字段。

已有应用里的单页重构/美化优先读取并沿用当前应用主题；只有用户明确要求完全不同视觉、独立品牌/活动页、隐藏导航沉浸页或指定新品牌色时，才做页面级独立主色。

## 色彩系统

- 主色：默认从 `podBlue`、`podGreen`、`podOrange` 等应用主题中选择。
- 辅助色：用于按钮强调、状态提示、图表分组和重点指标。
- 中性色：背景、文字、边框、分割线，默认保持浅底业务风。
- 语义色：成功、警告、错误、信息保持稳定，不随意改成品牌色。
- 明暗模式：默认 `light`，并保持 `themeProfile.navTheme=light`。
- `themeProfile.colorMode` 是宜搭配色模式，例如 `gradient`，不表示暗黑模式。

`openyida create-app --theme <key>` / `openyida update-app --theme <key>` 只填写平台预置主题 key。完整 key 与 token 见 [应用主题与 token 参考](../references/theme/theme-token-presets.md)。

## 字体与层级

- 标题、正文、说明文字、数字指标分别建立层级。
- 管理页和列表页保持扫描效率；官网/落地页可以用更强的标题层级。
- 数字指标使用稳定对齐方式，单位、量级和口径一起出现。

## 视觉风格

按业务选择，而不是只写“高级/简洁”：

- 企业管理：克制、清晰、可扫描。
- 经营看板：指标优先、图表成组、洞察明确。
- 监控大屏：态势清楚、风险突出、远距离可读。
- 品牌官网：真实素材、首屏主张、信任背书。
- 工具协作：高频动作突出、状态和反馈及时。

## 组件规范

统一按钮、卡片、表格、标签、抽屉、弹窗、图标、空态、加载态和错误态。页面级自定义主题写入 `style#yida-global-theme` 或 scoped token；应用级换肤写 `customThemeStyle.tokens`。

## 产出

```markdown
- themeProfile.name：<podBlue/podGreen/podOrange/...>
- themeScope：<page/app>
- themeColorSource：<应用主题/品牌素材/用户指定>
- navTheme：light
- colorMode：<宜搭配色模式，如 gradient；不表示暗黑>
- typography：<标题/正文/数字层级>
- componentTone：<按钮/卡片/表格/标签/抽屉风格>
```

## 下一步

→ [Step 3：信息架构](step-3-information-architecture.md)
