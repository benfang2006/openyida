---
name: yida-design
description: >
  宜搭应用设计统一技能。用于完整应用需求分析、产品定位、信息架构、页面结构、主题风格、视觉系统、交互状态、素材图标策略和去 AI 味检查。
  当用户要求应用设计、产品设计、需求分析、页面结构、页面美化、高级感、品牌化、视觉规范、主题色、全局颜色策略或主页面 UI 设计时触发。
  完成范围：结合宜搭应用形态完成需求定位、产品蓝图、主题系统、信息架构、页面原型、高保真视觉与状态规范，并产出 prd/<项目名>.md。
---

# yida-design

宜搭应用/页面设计工作流，用于完整的应用/页面设计。

---

## 入口快速路由（必读，先做设计对象判断）

进入本技能后，先判断设计对象，并按表中唯一动作执行。

| 用户诉求 | 判定为 | 唯一动作 |
| --- | --- | --- |
| 完整应用、多个角色、多页面、导航分组、首页/入口页、官网 + 看板 + 后台 | 完整应用设计 | 读 Step 1-6，输出 `prd/<项目名>.md` |
| 单个自定义页要求好看、高级、品牌化、去 AI 味、页面太丑、不够惊艳 | 单页设计 | 读 [page-design](sub_skill/page-design/SKILL.md)，先确认当前应用主题，再复用 Step 1-6 |
| 应用主题色、品牌色、全局换肤、`--color-brand1-*`、`style#yida-global-theme`、`customThemeStyle.tokens` | 主题系统 | 读 Step 2、6，输出主题 PRD 章节 |
| 页面 / 主页面 / 首页 / 工作台 UI 设计 | 完整主页面设计 | 读 Step 1-6，输出 `prd/<项目名>.md` |

---

## 标准流程

按以下 6 步完成宜搭产品设计，最终产出 `prd/<项目名>.md`。页面实现阶段再从 PRD 提炼 `page-spec.json`。

| 步骤 | 名称 | 功能描述 | 产出物 |
| --- | --- | --- | --- |
| 1 | [需求定位](workflow/step-1-positioning.md) | 明确应用类型、用户角色、核心任务、业务对象、页面/表单/流程资源和设计范围 | 设计目标 + 角色任务 + 资源蓝图 |
| 2 | [主题系统](workflow/step-2-theme-system.md) | 确定主色、辅助色、中性色、字体层级、组件基调和宜搭 token 作用域 | `themeProfile` |
| 3 | [信息架构](workflow/step-3-information-architecture.md) | 规划首页/入口页、平台导航、页面清单、页面场景和表单/流程关系 | `appBlueprint` / 页面结构 |
| 4 | [页面原型与交互](workflow/step-4-wireframe-interaction.md) | 确定布局骨架、内容区块、主操作、联动、交互、PC/移动端差异 | 低保真结构 + 交互路径 |
| 5 | [页面风格、视觉与状态](workflow/step-5-visual-states.md) | 为自定义展示页选择 `design.md`，细化视觉 DNA、素材、图标、空/载/错态、数据状态和去 AI 味自检 | `pageVisualDesign` + `visualProfile` + 状态规范 |
| 6 | [交付 PRD](workflow/step-6-handoff.md) | 汇总应用基本信息、页面与功能、视觉规范、资源创建顺序、页面实现交付顺序、导航顺序和验收标准 | `prd/<项目名>.md` |

> 进入标准流程后，从 Step 1 开始按顺序执行；每步开始前先读取对应步骤文件，每步形成产物后再进入下一步。Step 6 输出前核对 Step 1-5 的产物齐全，确保不跳步、不停在中间步骤。

> 本技能输出 PRD，不写 JSX/TSX。实现阶段默认交给 Code Canvas；普通 JSX/Jsx 用于用户明确指定普通页或页面深度依赖普通页实例桥的场景。

---

## 核心规则

1. **平台能力优先**：数据录入、提交、编辑、审批、权限、字段校验走宜搭表单/流程；自定义页负责展示数据、呈现分析结果、放置业务入口、打开详情页，并串联表单、流程、报表和导航入口。
2. **需求分析归本技能**：完整应用设计先写清应用基本信息、用户角色、核心任务、业务对象、数据结构、页面与表单/流程资源、业务逻辑、交互状态和验收标准。
3. **应用资源蓝图先行**：完整应用设计先列清资源蓝图，包括主页面/工作台/看板/列表/详情等 display 自定义页面，以及普通表单、流程表单和报表；表单字段写业务语义、字段类型、必填、默认值、关联关系和分组，运行后 ID 由实现阶段记录。
4. **顺序分开写清**：PRD 同时写资源创建顺序、页面实现交付顺序和导航顺序。资源创建顺序服务依赖关系，表单/流程在自定义页面之前；页面实现交付顺序服务开发验收；导航顺序服务用户入口展示。
5. **美感提升保持功能契约**：页面美化、视觉升级和页面重构默认只调整颜色、布局、密度、间距、视觉层级、素材和图标表达；现有数据源、字段映射、按钮动作、筛选逻辑、提交 URL、权限和业务状态保持原样。
6. **默认页面保留平台应用导航**：页面内 tab、自绘侧边栏或独立门户壳写 `appBlueprint.hasPageNavigation: true`，同时保持平台导航可见。
7. **同应用页面入口归导航**：同应用页面优先放入平台导航或导航分组；自定义页内容区放当前页动作、原生表单新建/查看、外部链接和跨应用资源。
8. **表单入口响应式**：新增/提交页 URL 仍使用原始 `submission/{formUuid}`；PC 端默认在侧边抽屉中用 iframe 承载宜搭原生表单，移动端整页或新页打开。
9. **主题作用域写清楚**：应用级换肤写 `themeScope=app`；单页美化写 `themeScope=page`；页面重构/单页美化默认以当前应用主题色为基准，用户明确要求很不一样的独立风格时再做页面级独立色盘；`--theme` / `colour` 只使用平台预置主题 key。
10. **默认主题优先业务浅底**：真实业务页默认先从 `podBlue`、`podGreen`、`podOrange` 等应用主题中选择；工作台、门户、列表、详情、普通看板和数据大屏默认都是浅底 / light 模式。默认浅底业务屏，只有用户明确说暗色/深色/夜间/高对比时才用深色沉浸。
11. **页面布局要到可实现粒度**：每个页面至少写清顶部/左侧/主体/右侧/底部区域、核心组件、信息密度、主操作位置、PC/移动端差异和空/载/错态。
12. **页面风格写到页面级**：自定义展示页、工作台、列表管理页、处理台、看板和首页门户在 PRD 中写清 `pageStyle`、`designMd`、视觉 DNA、页面区块和主题关系；实现阶段按该 `design.md` 落地页面观感。
13. **参考转成可执行选择**：参考 Dribbble / 优秀案例时，落到主色、背景素材、首屏构图、信息密度、动线、区块数量和反默认点。
14. **页面文案和图标使用专业表达**：渲染内容使用纯文本和功能性内联 SVG。
15. **实现链路明确交接**：默认页面实现链路是 Code Canvas；常规业务图表使用 `yida-rechart`；ECharts 例外只用于用户明确要求复杂 ECharts option 或维护旧图表。

---

## 参考文件

| 文档 | 覆盖范围 | 何时阅读 |
| --- | --- | --- |
| [Step 1：需求定位](workflow/step-1-positioning.md) | 应用类型、用户角色、核心任务、业务对象、资源蓝图 | 必读 |
| [Step 2：主题系统](workflow/step-2-theme-system.md) | 主题 token、色彩、字体、组件基调 | 涉及主题或视觉 |
| [Step 3：信息架构](workflow/step-3-information-architecture.md) | 首页/入口页、导航、页面清单、页面场景 | 应用级或单页设计 |
| [Step 4：页面原型与交互](workflow/step-4-wireframe-interaction.md) | 布局骨架、内容区块、主操作、抽屉、响应式 | 页面设计 |
| [Step 5：页面风格、视觉与状态](workflow/step-5-visual-states.md) | 页面 `design.md`、视觉 DNA、素材图标、空/载/错态、去 AI 味 | 输出前自检 |
| [Step 6：交付 PRD](workflow/step-6-handoff.md) | PRD 必填内容、三种顺序、实现交接 | 输出前 |
| [page-design 单页设计](sub_skill/page-design/SKILL.md) | 单页主题证据、页面级设计流程、输出补充字段 | 单个自定义页设计 |
| [场景参考速查](workflow/scene-reference-lookup.md) | scene 文件和专项变体速查 | 场景判定不确定时 |
| [PRD 输出格式](workflow/output-prd.md) | 完整 PRD 字段示例 | Step 6 输出前 |
| [页面风格选择](references/style-design-selection.md) | 选择页面级 `design.md` 的信号、步骤、打分和 PRD 输出字段 | Step 5 |
| [页面风格设计文档索引](references/style-designs/registry.md) | 可选页面风格、适用场景、信息密度、布局和视觉 DNA | Step 5 |
| [应用结构参考](references/app/blueprint.md) | 应用角色、导航、页面清单、页面/表单/流程资源蓝图 | 完整应用或主页面 |
| [应用主题与 token 参考](references/theme/theme-token-presets.md) | 平台主题 key、默认主题、token profile | 需要主题 key 或 token |
| [scene-workbench](references/scenes/workbench.md) | 工作台/门户首页 | 页面场景 = workbench |
| [scene-dashboard](references/scenes/dashboard.md) | 数据看板/驾驶舱 | 页面场景 = dashboard |
| [scene-screen](references/scenes/screen.md) | 数据大屏/监控屏 | 页面场景 = screen |
| [scene-list](references/scenes/list.md) | 列表/管理页 | 页面场景 = list |
| [scene-detail](references/scenes/detail.md) | 详情/展示页 | 页面场景 = detail |
| [scene-landing](references/scenes/landing.md) | 官网/落地页/品牌展示页 | 页面场景 = landing |
| [Canvas 设计系统](../yida-canvas-custom-page/references/canvas-design-system.md) | Code Canvas token、antd token、图表配色 | 实现阶段 |
| [字段与 URL 参考](../../references/field-and-url-reference.md) | `isRenderNav=false`、页面 URL、跨页跳转 | 拼接页面/表单 URL |
