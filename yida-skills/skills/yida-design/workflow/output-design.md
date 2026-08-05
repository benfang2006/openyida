# 输出：design.md

> Step 6 自检通过后，写入 `prd/<项目名>/design.md`。`design.md` 是应用级 UI 视觉设计系统，结构参考 `references/style-designs/_design-md-template.md`：先写可复用视觉 DNA、token、布局、组件、状态和自检，再在“实现适配”里写清宜搭运行时主题契约。PRD 只写主题色和风格摘要，完整 UI 设计以本文件为准。

## design.md 输出格式

```markdown
---
version: 1.0
name: <应用或风格系统英文 slug>
description: <内容中立的中文用途说明>
design_id: <design-id>
design_status: ready
scenes: [工作台, 列表, 详情, 看板]
density: <compact / medium / comfortable>
layout: <preferred archetype or custom layout>
tone: <视觉气质关键词>
tags: [<业务领域>, <角色>, <数据形态>]
avoid: [<不适合场景>]
themeProfile:
  name: <平台预置 key 或自定义色盘名称>
  themeScope: <app / page>
  themeColorSource: <application-theme / custom-brand-tokens / user-specified>
  themePresetKey: <命中平台预置时填写；自定义色盘留空>
  shouldPassCreateAppTheme: <true 仅限平台预置；false 表示 create-app 不传 theme/colour>
  globalThemeInjection: <style#yida-global-theme / customThemeStyle.tokens / none>
  navTheme: light
  colorMode: <宜搭配色模式，如 gradient；不表示暗黑>
yidaThemeRuntime:
  globalThemeInjection: <style#yida-global-theme / customThemeStyle.tokens / none>
  styleElementId: yida-global-theme
  helperRef: yida-canvas-custom-page/references/theme-runtime-helpers.md
  injectTargets: [currentDocument, sameOriginParentDocuments]
  rootAttribute: data-yida-theme-root
tokens:
  --color-brand1-6: <主色>
  --color-brand1-9: <深主色>
  --color-brand1-2: <浅背景>
  --color-brand-1: <旧版/移动端桥接色 1>
  --color-brand-2: <旧版/移动端桥接色 2>
  --color-brand-3: <旧版/移动端桥接色 3>
  --color-brand-4: <旧版/移动端桥接色 4>
  --color-group: <图表和分组色板，逗号分隔>
visual_dna:
  - name: <可识别的设计记忆点名称>
    confidence: observed
    evidence: <参考或需求中可见的证据>
    rule: <生成新 UI 时必须如何保留它>
    implementation_hooks: [<布局/组件/token/CSS/图表钩子>]
    failure_mode: <缺失该 DNA 时会出现的风格漂移>
colors:
  bg-outer: "#..."
  surface: "#..."
  surface-muted: "#..."
  text-primary: "#..."
  text-secondary: "#..."
  border-subtle: "#..."
  brand: "#..."
backgroundLayer:
  baseCanvas: <低饱和浅底、带装饰的近白画布或深色舞台；推荐避免无层次的纯空白画布>
  primitives: [softTintCanvas, topIrregularWash, radialGlowWash, flowLight, organicNoise]
  topIrregularWash: <可选；不规则顶部色块、波浪或斜切背景，内容仍按规则栅格排布>
  motionLayer: <none / subtle-flow-light；必须有 prefers-reduced-motion 降级>
  contrastGuard: <前景文字和控件对比度要求>
typography:
  page-title:
    fontFamily: "<字体栈>"
    fontSize: <数字>
    fontWeight: <数字>
    lineHeight: <数字>
    letterSpacing: 0
spacing:
  page-x: <数字>
  grid-gap: <数字>
  card-x: <数字>
  card-y: <数字>
rounded:
  md: <数字>
  card: <数字>
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
inferred_modules:
  quick_actions:
    required_for: [工作台, 仪表盘, 管理后台, 运营首页]
    confidence: inferred
    rule: <基于整体视觉风格推断的快捷入口区域规则>
---

# <应用名> design.md

## 1. 总览

用 2-4 个短段落说明可复用设计意图。保持内容中立，只说明气质、信息密度、主要用途和页面组织方式。

## 2. 适用场景

列出适合和不适合使用该风格的场景。

## 3. 视觉氛围

说明运营工具感/表达型、克制/戏剧化、密度、留白、专业度等取向。

## 4. 视觉 DNA / 设计母体

提取 2-5 个内容替换后仍必须保留的设计记忆点。每个 DNA 必须包含名称、证据、规则、实现钩子、失败表现和置信度。

## 5. 色彩角色

用表格列出 token、取值和用途，覆盖背景、表面、文字、边框、品牌色、状态色和图表序列。必须包含 `themeProfile` 和 `yidaThemeRuntime` 中声明的主题 token。

| token | 取值 | 用途 |
| --- | --- | --- |
| `--color-brand1-6` | <主色> | 主按钮、链接、选中态、重点标签、图表主序列 |
| `--color-brand1-9` | <深主色> | hover、强调文字、深色强调块 |
| `--color-brand1-2` | <浅背景> | 弱强调背景、浅底提示、选中底色 |
| `--color-group` | <色组> | 图表、分类、状态序列 |

## 6. 字体规则

定义字体栈、字号体系、行高、字重和数字排版。不要使用 viewport width 缩放字体，默认 `letter-spacing: 0`。

## 7. 布局原则

说明页面壳、最大宽度、网格比例、间距、内容顺序和中性槽位关系。

## 8. 层级与深度

说明深度来自平面表面、边框、阴影、色调层、毛玻璃、覆盖层或空间效果，并说明哪些地方不该使用阴影。

### Background Layer Contract

展示型页面、工作台、看板、门户、官网、登录页和空状态页推荐使用有层次的页面画布，而不是无氛围的纯空白背景。画布可以接近白色，但应通过淡渐变、细线装饰、星芒、高光、插图、顶部不规则色块或内容密度形成背景感。背景层写成可实现字段 `backgroundLayer`，优先选择 1-2 个背景 primitive：

| primitive | 适用场景 | 实现要求 |
| --- | --- | --- |
| `softTintCanvas` | 工作台、列表、管理后台 | 使用低饱和高明度底色，例如暖灰、浅青、浅粉、浅蓝紫，也可以是带弱渐变的近白画布；前景内容保持规则栅格 |
| `topIrregularWash` | 官网、品牌页、主页面首屏、登录页、空状态页 | 顶部或首屏使用不规则色块、波浪、斜切、有机边界或轻装饰曲线；内容不跟随背景扭曲 |
| `radialGlowWash` | AI 产品、SaaS、驾驶舱、视觉化工作台 | 使用大面积柔和径向光或光洗，不使用离散装饰圆球、bokeh 或随机漂浮点 |
| `flowLight` | 科技感主视觉、数据看板、引导卡片 | 使用极慢速流光或光影位移动效；必须提供 `prefers-reduced-motion` 静态降级 |
| `organicNoise` | 温暖亲和、生活方式、轻品牌页 | 叠加 0.02-0.06 透明度微噪点或细纹理，减少机械感，不影响阅读 |

背景可以不规则，内容必须规则。所有主要内容仍使用明确网格、分栏、对齐和稳定间距，不能因为背景形状导致文字、按钮、图表或表格漂移。B 端页面的背景色保持低饱和、高明度；深色大屏可使用低亮度流动线条或光效纹理衬托数据，但正文对比度必须达标。若选择极简近白画布，必须用清晰内容结构、细线装饰、局部渐变或素材焦点证明页面不是未设计的空白底。

## 9. 形状

定义圆角尺度，以及每个尺度分别用于哪里。

## 10. 组件样式

覆盖顶部栏、按钮、图标按钮、卡片/面板、输入框/选择器、表格/列表、图表、标签/徽标、快捷入口、空状态、弹窗/浮层。相关组件要包含 default、hover、active、focus、disabled、loading、selected、error 等状态。

## 11. 快捷入口区域

工作台、仪表盘、管理后台或运营首页必须输出快捷入口区域规则。说明位置、容器、条目、数量、图标、文字、状态、响应式、与 DNA 的关系和禁止漂移。

## 12. 页面结构配方

提供 2-4 个使用中性槽位的布局配方，例如 `primary_metrics`、`quick_actions`、`trend_panel`、`detail_table`、`status_note`。每个使用到自定义页面的场景都必须写 `visualScaffold`：

- visualScaffold：<rootShell / prioritySurface / statusPrimitive / actionPrimitive / contentPrimitive / contextPrimitive / statePrimitive / responsiveRule>
- surfaceMap：<每个区块的容器形态、背景、边框、阴影、毛玻璃或平面规则>
- componentRecipe：<每个关键组件的结构、密度、状态和 token 使用>

## 13. 状态与交互

列出 hover、active、focus、loading、empty、error、disabled、selected、mobile 和 reduced motion 规则。

## 14. 响应式

定义断点和布局折叠方式。说明文字适配、工具栏换行、表格横向滚动和触控目标尺寸。

## 15. 可访问性

要求对比度、focus 状态、纯图标控件标签、非纯颜色状态表达、键盘可访问和 reduced motion。

## 16. 实现适配

只包含相关适配，例如 CSS 变量、Ant Design ConfigProvider、Tailwind class 映射、Yida / Code Canvas 容器重置或 React 组件建议。宜搭主题必须写成可执行契约：

### Yida Global Theme Runtime Contract

| 项目 | 规则 |
| --- | --- |
| 平台预置主题 | 只有 `themePresetKey` 命中平台预置 key 且 `shouldPassCreateAppTheme=true` 时，`create-app/update-app` 才传 `theme/colour` |
| 自定义色盘 | `shouldPassCreateAppTheme=false`，创建应用时不传 `theme/colour` |
| 页面注入 | 自定义色盘、隐藏导航沉浸页、页面级独立主题使用 `style#yida-global-theme` |
| 应用级换肤 | 需要全应用换肤时写 `customThemeStyle.tokens`，并保留 `style#yida-global-theme` 作为页面运行态兜底 |
| 注入目标 | 当前窗口 `document` 和所有同源可访问父级窗口 `document`；跨域父级静默降级 |
| Helper | Code Canvas 和普通 JSX 都复制 `yida-canvas-custom-page/references/theme-runtime-helpers.md`，使用其中的 `collectYidaThemeDocuments` 收集当前文档和同源父级文档，不要临场重写 |
| 样式 ID | 固定为 `yida-global-theme`，重复执行只更新同一个 style |
| 根节点 | 页面根节点加 `data-yida-theme-root="true"`，让 token 在当前页和父级 iframe 壳层都能命中 |

### Code Canvas 实现要求

- 复制 `theme-runtime-helpers.md` 的 Code Canvas Helper。
- 在根组件中调用 `useYidaGlobalTheme(CUSTOM_THEME_TOKENS)`。
- `CUSTOM_THEME_TOKENS` 必须来自本 design.md 的 `tokens`，不能临场另配。
- 根节点写 `<div data-yida-theme-root className="...">`。
- `backgroundLayer` 必须落到根节点背景、`::before` 顶部不规则色块或大面积光洗、`::after` 流光/纹理层；内容层使用相对定位和更高 `z-index`，保证背景不盖住操作区。
- `flowLight` 动效必须写 `@media (prefers-reduced-motion: reduce)` 停止动画。

### 普通 JSX 实现要求

- 复制 `theme-runtime-helpers.md` 的 Ordinary JSX Helper。
- 在 `didMount` 或等价初始化中调用 `installYidaGlobalTheme(CUSTOM_THEME_TOKENS, window)`。
- 使用 ES5 写法，避免普通 JSX 编译链不支持的语法。

## 17. 必须包含

列出硬性正向要求。每个视觉 DNA 都必须作为明确必选规则出现。若 `globalThemeInjection` 不是 `none`，必须包含 `style#yida-global-theme` / `customThemeStyle.tokens` 的落地规则。

## 18. 禁止项

列出硬性负向约束，覆盖会抹掉每个 DNA 的错误做法。必须包含：自定义主题名或任意色值不得传给 `create-app --theme`；不得只向当前页面 `document.head` 注入主题而漏掉同源父级 iframe。

## 19. 错误 vs 正确

用短对照保护视觉 DNA、快捷入口风格继承和主题运行时契约。

| 错误 | 正确 |
| --- | --- |
| 自定义色盘仍传 `--theme myBrand` | 不传应用 theme，在页面复制 helper 注入 `style#yida-global-theme` |
| 只在当前 iframe 写 style | 同步当前文档和同源父级窗口文档 |
| PRD 里复制完整视觉规则 | PRD 只写摘要，完整 UI 规则写 design.md |

## 20. Agent 使用提示

提供一段简洁提示词，明确告诉 AI 如何使用该 design.md。必须说明视觉 DNA 在内容替换后也要保留；实现自定义色盘时必须读取 `yida-canvas-custom-page/references/theme-runtime-helpers.md` 并复制对应 helper。

## 21. 交付自检清单

- [ ] 源图或参考业务内容已抽象为中性槽位。
- [ ] 文档识别了 2-5 个视觉 DNA / 设计母体。
- [ ] 每个 DNA 都包含证据、规则、实现钩子、失败表现和置信度。
- [ ] DNA 已同步进入必须包含、禁止项、错误 vs 正确、Agent 使用提示和最终自检。
- [ ] 若页面类型是工作台、仪表盘、管理后台或运营首页，文档已包含快捷入口区域。
- [ ] 可推断的 token 已给出具体值。
- [ ] 组件包含状态规则，而不只是静态外观。
- [ ] 响应式和可访问性规则完整。
- [ ] `themeProfile`、`yidaThemeRuntime` 和 `tokens` 一致。
- [ ] `backgroundLayer` 已说明基础画布、装饰方式和是否使用背景 primitive；若选择近白画布，已说明如何通过渐变、细线、素材或内容密度形成背景感。
- [ ] 若使用 `topIrregularWash`、`flowLight` 或 `organicNoise`，已写清对比度、内容栅格和 reduced motion 降级。
- [ ] 自定义色盘没有传给 `create-app/update-app --theme`。
- [ ] 需要运行时主题时，已声明复制 `theme-runtime-helpers.md`，并覆盖当前窗口与同源父级窗口。
- [ ] 不依赖原截图，也能指导生成一个新页面。
```

## 交给实现阶段

- `yida-app` 读取 `prd/<项目名>/prd.md` 和 `prd/<项目名>/design.md` 后创建或复用资源。
- 页面实现阶段读取 `prd.md` 的业务内容，并直接读取 `design.md` 的视觉 DNA、token、布局、组件、状态和 `Yida Global Theme Runtime Contract`。
- 只有走页面生成器或需要稳定交接时才派生 `page-spec.json`，并标记 `sourceOfTruth.prdFile/designFile`。`page-spec.json` 不复制完整 design.md，只保存与 design.md 一致的主题摘要和引用。
