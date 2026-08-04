---
name: yida-app
description: 宜搭完整应用开发编排技能。对普通 OpenYida 应用做完整搭建或补齐时使用；先解析资源上下文并消费 yida-design PRD，再按 PRD 创建或复用应用、表单、流程和页面；最终只输出改动的描述和一个主访问链接。
---

# yida-app — 完整应用编排契约

本技能只做完整应用流程编排，不承担全局单点任务路由。进入每个阶段前，按根入口的“不同工具的技能加载方式”只加载当前阶段唯一需要的子技能；不要预读未来阶段，不要批量加载技能。

## 触发条件

用户要求从零创建、搭建、生成一个完整宜搭应用/系统/平台/管理工具，或已有 app/page 需要补齐成完整业务系统时使用本技能。

进入本技能后，读取或生成 `prd/<项目名>.md`，并按 PRD 创建或复用资源、实现页面、发布应用主入口，最后返回一个主访问链接和资源摘要。

> 资源边界：本技能是默认完整应用编排。目标不明时先只读确认或询问用户。

## 阶段 0：resolve_resource_context

进入完整应用编排前，先按根技能的 Resource-First 规则解析本次目标 app/page/form/process：

- 来源优先级：本轮显式 `appType` / `formUuid` / URL → 已绑定资源上下文 → workspace 配置/缓存 → 会话历史 → 明确从零创建。
- 已绑定资源上下文只是默认候选，不是锁定目标；如果用户本轮明确提到另一个 app/page/form/process，必须重新解析本轮目标，能唯一解析则切换，不能唯一解析才问用户。
- 已有 app 时在该 app 内补齐资源，不加载 `yida-create-app`；无 app 且用户意图允许创建时记录 `allowCreate=true`，PRD 完成后再创建应用。
- 若已有 app 来自外部工具预创建资源，OpenYida 技能侧只复用该 `appType`，不自动修改应用名称；应用名修正由外部工具侧负责。
- 已有主页面 URL / `formUuid` / 已绑定页面时，直接写源码并发布到该页面，不加载 `yida-create-page`；已有页面 update path 也必须在本轮源码 Write/Edit 后执行真实 `openyida publish <source> <appType> <displayPageFormUuid>`，只有缺少 display page 且本次意图允许新增页面时才创建。
- 已有表单 context 时，字段诉求走 `yida-create-form-page` 的 update/patch/rule/bind-datasource；只有已有 app 但缺少业务数据表时才 create form。
- 已有流程表单或 `processCode` 时，流程诉求走 `yida-process-rule`；只有没有表单/流程且用户要新建审批表单时才进入 `yida-create-process`。
- 多个同优先级候选、当前轮显式资源冲突或目标不明时才问用户；不要因为 cache 和历史里同时存在资源就默认打断。

### 阶段 0 命令选择（不要猜命令）

- 已有显式 `appType`、应用 URL 或已绑定资源上下文中的 `appType` 且能唯一解析时，直接复用该 app；不要调用 `app-list` 做存在性确认。
- 只有用户只给应用名称、存在多个候选、resource context 冲突，或需要诊断目标 app 访问失败时，才运行 `openyida app-list [--size N]`。
- 已知 `appType` 后，查询该应用下表单/页面用 `openyida list-forms <appType> [--keyword <text>]`；选择页面发布目标时只用 `formType=display`。
- 查询表单/页面 Schema、字段 ID 或批量字段摘要用 `openyida get-schema <appType> <formUuid|--all> ...`；简单字段属性更新不要先拉大 schema，直接交给 `create-form update` 的 label-based schema-aware 解析。
- 完整应用页面阶段只有在页面代码、数据查询、流程/公式或多表 dataBinding 确实需要多个 `fieldId` 时，才对每个目标业务表单执行一次 `openyida get-schema <appType> <formUuid> --field-map-json`，读取完整 JSON 并合并到 `.cache/<项目名>-schema.json`；不要对同一表单用 `tail/head/grep` 截断 stdout 后再重复拉取。
- 阶段 0 禁止编造 `list-apps` / `get-app`；也不要把 `--app-type` / `--form-uuid` 当成 `list-forms` 或 `get-schema` 的参数。按目的在 `app-list`、`list-forms`、`get-schema` 三者中选择。

该阶段只决定常规 resource context；不要在本技能里绕过资源前置解析或自动新建同类资源。

## 阶段 1：设计前上下文

完成资源上下文解析后，只确认本轮是复用已有 `appType`，还是允许在 PRD 完成后创建新应用。若目标 app 来自外部工具预创建资源，也只复用当前 `appType`；不得因为占位名称、页面标题或业务语义推导触发应用名修改。应用名修正如有需要由外部工具侧负责。

## 设计职责边界

完整应用只走统一编排。需求分析、产品定位、页面/表单/流程蓝图、主题色、各页面布局、交互状态和验收标准统一交给 `yida-design` 完成。

`yida-app` 只负责执行编排：

- 解析并复用已有 app/page/form/process；
- 把 `yida-design` 输出的 PRD 写入 `prd/<项目名>.md`；
- 按 PRD 的资源创建顺序创建缺失且允许创建的应用、表单、流程和主页面；其中表单/流程先于自定义页面；
- 从 PRD 的页面与功能设计、视觉规范和页面实现交付顺序提炼业务化 `page-spec.json`；
- 调用页面技能实现并发布；
- 发布后按 PRD 的导航顺序执行轻量导航排序；
- 只输出一个主访问链接和资源摘要。

## 预检

遵循根入口的只读预检结果。若当前会话还没做预检，先按根入口执行一次只读校验；只有登录态可用后，才执行会创建、修改或发布宜搭资源的命令。不要在每个阶段重复跑 env/help/login 探测。

## 路径与文件读取口径

- 页面源码路径按当前 Bash cwd 选择：从仓库根执行时用 `project/pages/src/...`；如果 cwd 已是 `<workspace>/project`，用 `pages/src/...`，不要传 `project/pages/src/...` 导致 `project/project`。
- 读取 PRD、字段 JSON、页面源码或 schema 文件时优先用当前工具的 Read / Glob / Grep；OpenYida CLI 成功输出已经是操作证据，不要再 Bash `cat`/`ls` 复核。

## 标准执行流

```text
[Step 1] 解析资源上下文 → 合并本轮显式资源、workspace 配置、缓存和会话历史
              ↓
[Step 2] 产品设计 → use_skill("yida-design", "完整应用产品设计")
              ↓      yida-design 输出 prd/<项目名>.md，覆盖应用基本信息、应用配置、数据结构、页面与功能、视觉规范、业务逻辑、交互状态、资源蓝图、资源创建顺序、页面实现交付顺序、导航顺序和验收标准
              ↓
[Step 3] 创建/复用应用 → use_skill("yida-create-app", "按 PRD 创建应用并获取 appType") → openyida create-app
              ↓      已有 appType 时直接复用；缺少 app 且 allowCreate=true 时按 PRD 创建应用
              ↓
[Step 4] 创建必要表单/流程 → use_skill("yida-form-detail", "表单视觉引导") → use_skill("yida-create-form-page", "创建核心表单字段结构")
              ↓      生成表单 schema 前先用 yida-form-detail 合并 Divider 分割线语义分组，再加载 yida-create-form-page 落地字段 JSON；字段配置文件写入 .cache/openyida/<项目名>/
              ↓      PRD 含审批 / 流程 / 申请 / 审核 / 工单等流程对象时，use_skill("yida-create-process", "创建带审批流程表单")，流程表单也在自定义页面之前创建
              ↓
[Step 5] 创建自定义页面 → use_skill("yida-create-page", "创建主入口自定义页面") → openyida create-page
              ↓      创建页面前必须做 corpId 一致性检查
              ↓
[Step 6] 编写自定义页面代码 → use_skill("yida-canvas-custom-page", "生成 Code Canvas 主页面")
              ↓      按 PRD 的页面实现交付顺序逐页实现；从 PRD 提炼页面场景、visualProfile、themeProfile、各页面布局、素材策略、原生表单入口和业务化自检
              ↓      先把 PRD 中的页面设计、业务对象、页面区块和应用主题写入 page-spec.json；可用生成器入口生成可编译骨架，也可在结构清楚时直接手写最终 .canvas.jsx
              ↓      字段映射优先来自 create/update 命令输出和 `.cache/<项目名>-schema.json`；同一表单不要重复 get-schema，除非页面/数据链路确实需要 fieldId 且缓存不完整
              ↓      本轮已创建/解析业务表单且页面需要列表/看板/详情数据时，必须在 spec.dataBinding 写 mode=form + 真实 appType/formUuid/fieldId；深度接入再加载 yida-canvas-data-binding
              ↓      明确要求普通自定义页面 JSX/Jsx 组件链路，或强依赖 this.$ / this.utils.yida.* / this.dataSourceMap 等实例桥时选择 yida-custom-page
              ↓
[Step 7] 发布页面 → use_skill("yida-publish-page", "发布主页面") → openyida publish <源文件路径> <appType> <formUuid> --auto-nav-order [--health-check]
              ↓      发布成功后按 PRD 导航顺序执行 openyida nav-group order；PRD 缺少明确页面清单时用 --auto-nav-order / nav-group auto-order 兜底
              ↓
[Step 8] 输出一个主访问链接和资源摘要 → 完成
```

用户明确要求示例数据、公开访问、截图验收、报表/大屏、数据桥深度接入或精细导航分组时，在 Step 8 后追加对应技能；没有明确要求时，发布和轻量导航排序后完成。

## UI/体验集成点

UI/体验不是 `yida-app` 内部模式，而是由 `yida-design` 在 Step 2 一次性完成：

| 设计产物 | `yida-app` 如何消费 |
|------|----------------|
| PRD | 写入 `prd/<项目名>.md`，作为表单、流程、页面、验收的业务依据 |
| 资源蓝图 + 资源创建顺序 | 决定 app、普通表单、流程表单、自定义页面和报表的创建/复用/更新顺序；表单/流程先于自定义页面 |
| 主题色配置 | 传给 `create-app/update-app --theme`、页面 spec 和实现层 token |
| 页面与功能设计 + 页面实现交付顺序 | 提炼 `page-spec.json`，再交给页面生成器或手写 Code Canvas 页面 |
| 业务逻辑与交互状态 | 决定原生表单入口、抽屉、详情下钻、空/载/错态 |
| 导航顺序 | 发布后执行轻量导航排序；导航顺序是用户看到的顺序，不等同于页面实现交付顺序 |

主题补充：应用默认主题先从 `podBlue`、`podGreen`、`podOrange` 等应用主题中选择。它们既是平台 `create-app/update-app --theme` 可用 key，也可作为页面级 token profile 写入 `style#yida-global-theme` / `customThemeStyle.tokens`；`blue`、`green`、`orange` 作为应用主题 token profile 保留原名；新默认优先推荐 `podBlue`、`podGreen`、`podOrange`。

首次生成面向用户的主页面时，先执行 `use_skill("yida-design", "完整应用产品设计")` 产出 `prd/<项目名>.md`，再由 `yida-app` 从 PRD 提炼页面 spec，并交给 `yida-canvas-custom-page` 或 `yida-custom-page` 落地。用户明确要求“好看 / 去 AI 味 / 高级视觉 / 品牌化 / 多页面体验”时，仍然在 `yida-design` 内补足 PRD 设计细节，不在 `yida-app` 内另分模式。

## 页面链路原则

完整应用里的自定义页面默认使用 `yida-canvas-custom-page`：

- Code Canvas 承载现代 React、hooks、图表、工作台、看板、列表、详情、官网、门户壳等面向用户页面。
- 需要真实数据时，先在页面 spec 中显式写入 `dataBinding` / 字段映射；需要系统化数据桥时加载 `yida-canvas-data-binding`。
- 用户明确要求普通自定义页面 JSX/Jsx 组件链路，或页面强依赖普通自定义页实例桥时，选择 `yida-custom-page`：`this.$(fieldId)` 双向绑定、`this.utils.yida.*`、`this.dataSourceMap`、表单提交或流程发起与页面实例深度耦合。
- 普通自定义页面使用 `.oyd.jsx`、`renderJsx()`、`check-page` / `compile`，发布为平台 `Jsx` 组件；Code Canvas 使用 `.canvas.jsx`、`YidaComp`、页面生成器或 Canvas 本地快检，发布为 `YidaCodeCanvas` 组件。

## 页面源码修改发布闭环

完整应用、补齐应用和已有主页面 update path 都按同一个 doneWhen 判断：

- 只要本轮 Write/Edit/Create 了 `project/pages/src/*.{canvas.jsx,canvas.tsx,oyd.jsx,jsx,tsx}`，阶段 5 的本地源码校验只算“可发布”，不算远端页面完成。
- final 前必须经过 `yida-publish-page`，并看到成功的 `openyida publish <source> <appType> <displayPageFormUuid>` 命令结果；发布的 `<source>` 必须是本轮修改过的页面源码，`<displayPageFormUuid>` 必须是已解析的 display 自定义页面。
- 如果没有 publish 成功证据，只能对用户说明“源码已修改，尚未发布”，不得声称“页面已更新 / 已重新发布 / 已上线”。规则归页面技能，完成证据归 publish guard，不能靠 final 口头补齐。

## 页面规格优先

完整应用页面先消费 `yida-design` 的 PRD，再决定用生成器入口还是直接手写页面。PRD 和 `page-spec.json` 是页面设计依据；实现阶段不读取内置页面源码来决定页面内容、布局或视觉风格。

生成应用时必须把用户需求转成业务化 `page-spec.json`，至少覆盖：

- `brandName` / `tagline` / `heroText`：使用当前应用的业务名称、角色和问题域，不沿用模板默认标题。
- `features`：写真实业务对象、模块入口或处理事项，不写“统一入口 / 状态跟进 / 流程闭环”这类通用模板卖点。
- `metrics` / 列表 / 看板 / 详情数据：写贴合场景的指标口径；完整应用或真实交付页不得用前端 seedRows 冒充真实业务记录。本轮已有业务表单时必须写 `dataBinding.mode=form`、真实 `appType/formUuid` 和字段映射；若需要演示数据，先通过表单数据写入链路创建 demo/mock records，再让 Canvas 页面读取这些真实表单记录。没有写入 demo records 且没有真实数据时，页面展示空态、表单入口、刷新/登记按钮，并在 final 明确“未接真实表单数据”。
- `roadmap` 或 `interactionProfile`：写用户动作、筛选、下钻、批量处理、空/载/错状态。
- `resourceBlueprint`：写主页面/工作台/看板/列表/详情等 display 自定义页面，以及普通表单、流程表单和报表；表单只写业务字段语义，真实 ID 写入 `.cache/<项目名>-schema.json`。
- `visualProfile`：写一个区别于通用默认页的视觉方向，例如信息密度、构图节奏、强调色来源、图表/列表/队列母题。
- 官网/品牌页还必须写 `assets` 或明确素材缺口；看板/列表/详情页优先写 `dataBinding`、字段映射或表单链接。

`visualProfile` 应来自 `yida-design` 的 PRD 或本轮业务语义推导。页面区块、文案、指标、图片、表单入口和状态说明都来自当前业务。

生成后检查命令输出和 `.openyida-page.json` 里的 `domainFidelity.status`：只有 `domain-ready` 才能作为真实业务页面交付。业务规格不足时，继续补 page spec 或改源码。

页面实现路径二选一：

- **生成器入口**：页面结构已在 PRD 写清后，用页面生成器读取 `<page-spec.json>` 生成可编译骨架。生成后只读取 `.openyida-page.json` / CLI 摘要判断 `domainFidelity` 和 dataBinding 状态；若需要补业务语义或样式，基于生成文件做小范围 Edit/patch。
- **手写实现**：如果 PRD 已经明确最终页面结构、数据桥和视觉细节，直接 Write 最终 `.canvas.jsx`，再做本地快检和 publish。
- **emoji 硬门禁**：表单字段 JSON、页面 spec、`.canvas.jsx` / `.oyd.jsx` 源码、发布 Schema 和产物文件路径都不能包含 emoji。OpenYida 报 emoji 错误时修改字段文案、spec、源码或路径；不要用 `--skip-lint`、重复 create/publish 或全量 rewrite 试图绕过。

选择生成器入口时必须：

1. 先从 PRD 提炼当前业务自己的 page spec；
2. 再执行页面生成器生成 Code Canvas 骨架；
3. 读取 manifest / CLI 摘要的 `domainFidelity`，若仍是草稿或业务化不足，则补 spec 或小范围改源码；
4. 按 PRD 扩展交互和真实数据；
5. 验证所有参数名称与 CLI 一致。

表单页开发默认加载 `use_skill("yida-form-detail", "表单视觉引导")`，将填写路径、字段密度和 Divider 分割线语义分组合并进 `yida-create-form-page` 的字段 JSON。表单详情页 CSS 优化不走 `openyida publish`；当用户要求“详情页美化 / formDetail 样式优化”或 PRD 要求统一详情页风格时，再由 `yida-form-detail` 通过表单 Schema 注入 Html 组件承载 CSS。

## 完整应用统一编排阶段

| 阶段 | 子技能 | 必做动作 | doneWhen |
|------|--------|----------|----------|
| 0. 解析资源上下文 | 无 | 合并本轮显式资源、已绑定资源上下文、workspace 配置/缓存、会话历史；本轮显式目标覆盖已绑定上下文；判定 app/page/form/process 的 `source` 和 `allowCreate` | 明确复用、创建缺口或需要 ask_human |
| 1. 设计前上下文 | 无 | 合并本轮显式资源、workspace 配置/缓存、会话历史，确认已有 `appType` 或 `allowCreate=true`；不在本阶段创建资源 | PRD 所需的目标组织、应用名称候选、资源复用边界明确 |
| 2. 产品设计 | `yida-design` | 输出 `prd/<项目名>.md`；必须包含应用基本信息、应用配置、数据结构、页面与功能、视觉规范、主题色、各页面布局、业务逻辑、交互状态、资源蓝图、资源创建顺序、页面实现交付顺序、导航顺序和验收标准。写/更新 `.cache/<项目名>-schema.json` 本地 ID 映射位置 | 业务语义、视觉规范、页面布局、三种顺序、资源蓝图和 ID 存储位置明确 |
| 3. create/reuse app | `yida-create-app` 仅在 app 缺失且允许创建时加载；不自动修改应用名称 | 已有 `appType`/应用 URL/已绑定 app 时直接复用；否则按 PRD 创建应用并提取真实 `appType` | 拿到真实目标 `appType`，且不会重复创建同类 app |
| 4. resolve forms/processes | `yida-form-detail` 视觉引导，再 `yida-create-form-page`；PRD 命中审批/流程时加载 `yida-create-process` | 已有目标表单时 update/patch/rule/bind-datasource；创建或更新字段结构前先用 `yida-form-detail` 确定表单视觉引导、填写路径和 Divider 分割线语义分组，再由 `yida-create-form-page` 写字段 JSON；PRD 包含流程表单时在自定义页面之前创建流程表单；简单字段属性更新直接用 compact changes 让 CLI 内部按 label 读 schema/定位字段并输出 resolved evidence；缺少支撑 MVP 的核心表单且允许创建时才 create；字段配置文件写入 `.cache/openyida/<项目名>/`；页面/数据/流程/公式确需多字段映射时，对每个目标表单最多一次性获取完整 `--field-map-json` 并合并写回 `.cache/<项目名>-schema.json`；formDetail CSS 注入只在用户明确要求或 PRD 要求统一详情页风格时执行 | 拿到或确认表单/流程表单 `formUuid`，字段结构有 Divider 分组，必要时拿到真实 `fieldId` |
| 5. reserve main page | `yida-create-page` 仅在主页面缺失且允许创建时加载 | 已有页面 URL / `formUuid` / 已绑定页面时直接作为主页面；若需要首页/工作台/智能助手/门户门面且缺少主页面，在表单/流程创建完成后创建空 display page 占位，暂不写最终源码 | 拿到真实主页面 `formUuid`，且不会重复创建页面 |
| 6. 编写/更新页面 | 默认 `yida-canvas-custom-page`；明确要求 JSX/Jsx 组件链路或实例桥强依赖时选择 `yida-custom-page` | 按 PRD 的页面实现交付顺序消费页面场景、`visualProfile`、`themeProfile`、各页面布局、素材策略、原生表单入口和业务化自检，再生成或修改页面源码；实现 PRD 里的核心首屏和核心操作。可用已解析表单链接、真实空态、表单入口和轻量指标口径完成主页面；若展示业务列表/看板/详情记录，必须接本轮真实表单 `dataBinding.mode=form`，或用户要求示例数据时先写入 demo records 后再读取 | 本地源码通过对应页面技能的基础校验；未执行 publish 时仍是“源码已修改，尚未发布” |
| 7. 发布页面 | `yida-publish-page` | 按页面链路校验后发布到已解析主页面：Canvas `.canvas.jsx` 使用 `openyida publish` 的 Canvas 编译阶段或 `compileCanvasLocal` 快检；普通自定义页面 `.oyd.jsx` / `.jsx` 跑 `check-page` / `compile`；再执行 `openyida publish <source> <appType> <displayPageFormUuid> --auto-nav-order` 发布主页面。发布成功后，PRD 写明导航顺序时执行 `openyida nav-group order <appType> <页面/表单...>`；PRD 缺少明确页面清单时用 `--auto-nav-order` / `nav-group auto-order` 兜底 | 发布成功、获得可访问 URL，且 PRD 导航顺序已执行，或兜底自动排序已执行/给出明确 warning |
| 8. 输出结果 | 无 | 只返回一个主访问链接：若本轮意图是新增/修改/发布某个具体页面，输出当前页面 URL；其他完整应用、建表单、建流程、权限、主题、导航或批量资源场景，输出应用首页 `{base_url}/{appType}/workbench`。复用/创建/更新的资源只做 ID/状态摘要，不把每个资源 URL 都列出来 | 用户一眼看到下一步该打开哪里，不被静态资源或管理链接干扰 |

发布主页面成功后默认只做一次轻量导航排序：PRD 写明页面/表单清单顺序时用 `nav-group order`；PRD 只写宽泛分组或缺少导航顺序时用 `nav-group auto-order` / `--auto-nav-order` 兜底，兜底顺序采用门户/首页/工作台入口、业务办理、数据管理、经营分析、系统配置。数据桥深接、数据源连接器、数据管理、原生报表、精细导航分组、示例数据、截图验收、公开访问配置和 TaskCreate 只在用户明确要求或 PRD 验收标准命中时追加。

## 结果输出格式

- **主链接只保留一个**：新增/修改/发布单个页面时输出当前页面 URL；其他情况输出应用首页 `{base_url}/{appType}/workbench`。
- **不要输出静态资源清单**：不要把 `g.alicdn.com` 的 `index.css`、`index.js`、`index.html`、`locales/*.json`、构建产物 URL、CDN 资源 URL 或中间文件链接当成最终结果展示。
- **资源摘要不放链接**：资源较多时可用 Markdown 表格，但列为 `资源类型 | 名称/用途 | ID | 状态`；只放 appType、formUuid、pageId、reportId、流程名等 ID/状态。
- **管理态链接默认隐藏**：不要默认输出 `/admin`、配置页、Schema 页、分享配置页等管理链接；只有用户明确要管理后台、配置入口或排障证据时才提供。
- 未发布或仅本地修改的资源，在 `状态` 列标注“未发布 / 待验证 / 本地已修改”，不要附访问 URL。

## 关键决策树

### 决策 1：是否需要存储数据？

```text
用户需求
    │
    ├── 纯展示 / 静态内容 → 跳过表单创建，只创建自定义页面
    │
    └── 需要收集 / 存储数据 → 创建核心表单，再生成页面
```

### 决策 2：是否需要审批流程？

```text
表单创建后
    │
    ├── 无审批需求 → 直接进入页面代码生成
    │
    └── 有审批需求 → 加载 yida-create-process 配置流程后再生成页面
```

### 决策 3：是否需要数据可视化报表？

```text
应用功能需求
    │
    ├── 标准统计报表 → 加载 yida-report 创建原生报表
    │
    └── 高级 ECharts 大屏 → 先 yida-report 创建数据源，再 yida-chart 创建可视化页面
```

### 决策 4：corpId 一致性检查（创建页面前必须执行）

```text
读取 prd 文档中的 corpId vs 读取 token session / `openyida login --check-only --json` 中的 corpId
    │
    ├── 一致 → 继续创建页面
    │
    └── 不一致
        │
        ├── 用户选择“重新登录” → openyida logout → 重新登录到正确组织
        └── 用户选择“新建应用” → 回到 Step 1（会更新 prd 配置）
```

### 页面数据契约

- 默认页面源码不得使用 `this.dataSourceMap.*`，除非本轮已经明确创建并绑定对应设计器数据源。
- 默认页面只走两类可闭环方案：入口型页面（表单入口、资源链接、轻量统计占位）或内置数据 API 页面（`this.utils.yida.searchFormDatas` / `saveFormData` 等查询本轮已创建表单）。
- Canvas 列表/看板/详情页的业务记录使用真实表单数据。完整应用交付页必须优先在 `page-spec.json` 中写 `dataBinding.mode=form`，用本轮真实 `appType/formUuid/fieldId` 读取表单。若用户要求可演示数据，先加载数据写入链路把 demo/mock records 写入表单并抽查，再由 Canvas 读取；没写入记录时展示空态和登记入口。
- 如果页面源码确实需要 `this.dataSourceMap.*`，必须加载 `yida-data-source-connectors`，创建/绑定数据源，并在发布后确认页面 Schema 中存在对应数据源；否则完整应用未完成。
- 发布输出出现 `No custom page data sources to preserve` 时，只有源码不依赖 `this.dataSourceMap.*` 才能视为正常；若源码依赖 dataSourceMap，必须改源码或补数据源后重新发布。

## 可选后置

| 可选项 | 子技能 | doneWhen |
|--------|--------|----------|
| 精细导航整理 | `yida-nav-group` | 主页面/核心表单顺序符合业务入口 |
| 示例数据 | `yida-data-management` | 写入少量示例记录并 query 抽查成功 |
| 数据桥深度接入 | `yida-canvas-data-binding` 或 `yida-data-source-connectors` | 页面真实数据读写稳定，空态/错误态可恢复 |
| 报表/图表 | `yida-report` 或 `yida-chart` | 报表或图表页面已创建/发布 |
| 公开访问 | `yida-page-config` | 分享配置保存成功 |
| 截图/人工验收 | 按当前工具能力 | 截图或用户确认通过 |

可选后置只由用户明确要求或 PRD 的验收标准命中时执行；不要因为应用名包含“系统、管理、看板”就自动追加示例数据、公开访问、截图验收或数据源深接。

## 完成条件

完整应用的默认完成条件：

1. 主页面发布成功；
2. 输出可访问 URL；
3. 输出真实 `appType`、页面 `formUuid`、核心表单 `formUuid` 摘要，并标明关键资源是复用、创建还是更新；
4. 轻量导航自动排序已执行；若排序失败，必须给出明确 warning，不能静默跳过；
5. 未继续执行可选后置动作。

若本轮修改过页面源码但没有成功执行 `openyida publish <source> <appType> <displayPageFormUuid>`，完整应用仍未达到 doneWhen；只能交付本地源码修改说明和未发布原因，不能宣称远端主页面已更新。

发布成功、完成轻量导航自动排序（或给出明确 warning）并拿到访问 URL 后即完成，不要继续 TaskCreate、重复读技能、重复规划后续阶段。

## 错误处理

- 不编造 `appType`、`formUuid`、`fieldId`、`reportId`。
- OpenYida CLI 不要加 `2>/dev/null`；失败时保留 stdout/stderr 诊断。遇到 DENIED 或同一命令重复失败，先换策略、修改输入文件/参数/登录态/组织或重新只读取证，再重试。
- 同一命令失败后，必须改变登录态、组织、参数、输入文件或字段 ID 后才能重试；禁止无修改连续重试。
- corpId 与目标组织不一致时先停下，让用户选择重新登录或在当前组织继续。
- 已有目标 app/page/form/process 时默认复用；只有用户明确要求新建另一个同类资源，或目标缺失且本次意图允许创建时，才加载 create 类子技能。
- 当前轮用户明确指定的资源优先于已绑定资源上下文；例如会话绑定页面 A、用户要求修复页面 B 时，先解析 B，不能唯一解析才问用户，不要默认改 A。
- 外部工具预创建 app 只作为默认资源；OpenYida 技能侧只复用该 `appType`，不创建新 app，也不自动修改应用名称。
- 多个同优先级资源候选或当前轮显式资源冲突时，先问用户确认目标，不要通过重复创建规避冲突。
- 输入 JSON/YAML/CSV/JSX 等业务文件必须用结构化文件写入工具创建，不用 shell heredoc、`cat`、`echo`、`printf`、`tee` 或重定向。
- 用户要求删除应用时，必须展示应用名称、应用 ID、影响范围，并等待用户明确回复“确认删除”后才可执行。

## 存储约定

- 业务语义：`prd/<项目名>.md`
- 真实 ID：`.cache/<项目名>-schema.json`
- 临时配置/导入数据/脚本：`.cache/openyida/<项目名或任务名>/`
- 从 workspace 根执行命令时路径加 `project/` 前缀；在 OpenYida project 工作目录内执行时使用 `.cache/...`

## URL 规则

| 页面类型 | URL 格式 |
|---------|---------|
| 应用首页 | `{base_url}/{appType}/workbench` |
| 表单提交页 | `{base_url}/{appType}/submission/{formUuid}` |
| 自定义页面 | `{base_url}/{appType}/custom/{formUuid}` |
| 自定义页面（隐藏导航） | `{base_url}/{appType}/custom/{formUuid}?isRenderNav=false` |
| 表单详情页 | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}` |
| 表单详情页（编辑模式） | `{base_url}/{appType}/formDetail/{formUuid}?formInstId={formInstId}&mode=edit` |

## 参考

- [详细编排参考](references/app-build-contract.md)：排障或执行细节不确定时读取；包含字段文件示例、页面链路、URL 规则、典型场景、删除应用确认、故障处理。
- `use_skill("yida-canvas-custom-page", "实现默认 Code Canvas 页面")`：默认页面实现链路。
- `use_skill("yida-custom-page", "实现普通自定义页面 JSX/Jsx 组件链路")`：明确要求 JSX/Jsx 组件链路，或普通自定义页实例桥强依赖时使用。
