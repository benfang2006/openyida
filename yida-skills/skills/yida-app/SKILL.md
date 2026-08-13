---
name: yida-app
description: 宜搭完整应用开发编排技能。对普通 OpenYida 应用做完整搭建或补齐时使用；先解析资源上下文并消费 yida-design 的 prd.md 与 design.md，再按 PRD 创建或复用应用、表单、流程和页面；最终先输出 2-3 句业务交付总结，再给一个主入口链接。
---

# yida-app

完整应用编排技能。它负责把一次“创建/搭建/补齐应用”的需求拆成资源解析、产品设计、资源落地、页面发布和结果输出。按步骤执行该步骤所需 `use_skill(...)`。

## 触发条件

用户要求创建、搭建、生成一个完整宜搭应用/系统/平台/管理工具，或已有 app/page 需要补齐成完整业务系统时使用本技能。

## 工作流

按以下 9 个执行步骤顺序推进。每一步开始前先读取对应 workflow 文件；当前步骤达到 doneWhen 后再进入下一步。

| 步骤 | 名称 | 目标 | 产出 |
| --- | --- | --- | --- |
| 1 | [解析资源上下文](workflow/step-1-resource-context.md) | 合并本轮显式资源、绑定上下文、workspace 配置/缓存和会话历史，确认复用还是允许创建 | 目标 app/page/form/process 上下文 |
| 2 | [产品设计](workflow/step-2-design.md) | 执行 `use_skill("yida-design")`，产出完整 PRD 和视觉契约 | `prd/<项目名>/prd.md` + `prd/<项目名>/design.md` |
| 3 | [创建或复用应用](workflow/step-3-create-or-reuse-app.md) | 已有 `appType` 直接复用；缺少 app 且允许创建时执行 `use_skill("yida-create-app")` | 真实目标 `appType` |
| 4 | [创建或更新表单/流程](workflow/step-4-forms-processes.md) | 执行 `use_skill("yida-form-detail")`、`use_skill("yida-create-form-page")`，需要流程时执行 `use_skill("yida-create-process")` | 真实 `formUuid`、`processCode`、必要 `fieldId` |
| 5 | [写入初始表单数据](workflow/step-5-seed-records.md) | 执行 `use_skill("yida-data-management")`，为核心普通表单写入 1-3 条业务化 seed records 并 query 抽查 | 真实表单记录或明确跳过原因 |
| 6 | [创建或复用主页面](workflow/step-6-main-page.md) | 已有 display 页面直接复用；缺少主页面且允许创建时执行 `use_skill("yida-create-page")` | 真实主页面 `formUuid` |
| 7 | [编写或更新页面](workflow/step-7-page-code.md) | 默认执行 `use_skill("yida-canvas-custom-page")`，按 PRD + design.md 实现页面和真实 dataBinding | 本地页面源码通过基础校验 |
| 8 | [发布页面并排序导航](workflow/step-8-publish-navigation.md) | 执行 `use_skill("yida-publish-page")`，发布本轮源码到主页面并执行轻量导航排序 | 已发布主页面 URL |
| 9 | [输出与收尾](workflow/step-9-output-finish.md) | 核对完成条件，按业务语言输出结果 | 2-3 句业务总结 + 一个主入口链接 |

## 核心规则

1. **Resource-First**：任何创建前先解析目标资源。已有 app/page/form/process 默认复用；只有用户明确从零创建或目标缺失且本轮允许创建时，才创建缺失资源。
2. **显式目标优先**：本轮用户给出的 `appType`、`formUuid`、URL、页面名或流程标识，优先级高于绑定上下文和历史缓存；同级冲突或无法唯一识别时才问用户。
3. **设计事实源唯一**：需求分析、资源蓝图、页面结构、导航顺序和验收标准由 `yida-design` 写入 `prd.md`；主题 token、布局、材质、圆角、密度、组件和状态规则由 `design.md` 承担。
4. **按阶段执行子技能**：进入应用壳、表单、流程、页面、发布、数据写入等阶段时，才执行对应 `use_skill(...)`；不要提前把所有子技能读进来。
5. **真实 ID 和真实数据**：不编造 `appType`、`formUuid`、`fieldId`、`processCode`、`reportId`。完整应用默认给核心普通表单写入 1-3 条业务化 seed records 并 query 抽查；不适合造数时说明原因和空态方案。
6. **页面默认 Code Canvas**：完整应用自定义页面默认走 `yida-canvas-custom-page`。只有用户明确要求普通 JSX/Jsx 链路，或页面强依赖 `this.$`、`this.utils.yida.*`、`this.dataSourceMap` 等普通页实例桥时，才走 `yida-custom-page`。
7. **发布闭环才算完成**：只要本轮写过页面源码，final 前必须看到成功的 `openyida publish <source> <appType> <displayPageFormUuid>`。没有发布证据只能说“源码已修改，尚未发布”。
8. **输出保持业务化**：最终回复先写 2-3 句业务交付总结，再给一个主入口链接。不要默认输出资源 ID 表格、管理态链接、CDN 构建产物或长清单。
9. **删除必须确认**：用户要求删除应用时，先展示应用名称、应用 ID 和影响范围，等待明确“确认删除”后才能执行。

## 存储约定

- 业务语义：`prd/<项目名>/prd.md`
- 视觉契约：`prd/<项目名>/design.md`
- 真实 ID：`.cache/<项目名>-schema.json`
- 临时配置/导入数据/脚本：`.cache/openyida/<项目名或任务名>/`
- 从 workspace 根执行命令时路径加 `project/` 前缀；在 OpenYida project 工作目录内执行时使用 `.cache/...`

## 关键决策树

- 需要收集或存储数据：先创建或复用核心普通表单，再生成页面；纯展示或静态内容可跳过表单创建。
- 需要审批、申请、审核、工单流转：先创建或复用流程表单，再生成页面。
- 需要标准统计：优先创建原生报表；明确高级图表或大屏时，再选择 `yida-rechart` / `yida-chart`。
- 创建或发布页面前，必须核对 PRD/resource context 与 auth snapshot 的 `corpId`；不一致时先确认重新登录或在当前组织继续。

## 页面数据契约

- 默认页面源码不使用 `this.dataSourceMap.*`，除非本轮已经创建并绑定对应设计器数据源。
- 完整应用的列表、看板、详情页优先读取真实表单数据，`page-spec.json` 写 `dataBinding.mode=form`、真实 `appType/formUuid/fieldId` 和字段映射。
- 完整应用默认先写入 1-3 条业务化 seed records 并 query 抽查；没写入成功时，页面展示空态、表单入口、刷新或登记按钮，并在 final 说明原因。
- 若页面确实依赖 `this.dataSourceMap.*`，必须执行 `use_skill("yida-data-source-connectors")` 创建/绑定数据源，并在发布后确认页面 Schema 中存在对应数据源。

## 完成条件

默认完整应用完成需要同时满足：

1. 主页面已发布成功，并拿到可访问 URL；
2. 轻量导航排序已执行，或给出明确 warning；
3. 新建或作为页面数据源的核心普通表单已有 1-3 条真实示例记录并 query 抽查，或已说明跳过原因；
4. final 先给业务总结，再给唯一主入口链接；
5. 未继续执行用户未要求的公开访问、截图验收、报表、大屏、数据源深接或精细导航分组。

## 参考文件

| 文档 | 覆盖范围 | 何时阅读 |
| --- | --- | --- |
| [Step 1：解析资源上下文](workflow/step-1-resource-context.md) | 只读预检、资源优先级、命令选择、路径口径 | 必读 |
| [Step 2：产品设计](workflow/step-2-design.md) | `yida-design` 产物边界、主题 key、PRD/design.md 消费 | 必读 |
| [Step 3：创建或复用应用](workflow/step-3-create-or-reuse-app.md) | app 复用、app 创建、主题 key | 必读 |
| [Step 4：创建或更新表单/流程](workflow/step-4-forms-processes.md) | 表单、流程、字段 ID、formDetail CSS | 必读 |
| [Step 5：写入初始表单数据](workflow/step-5-seed-records.md) | seed records、字段类型、query 抽查、跳过条件 | 必读 |
| [Step 6：创建或复用主页面](workflow/step-6-main-page.md) | display 页面复用、页面创建、corpId 一致性检查 | 必读 |
| [Step 7：编写或更新页面](workflow/step-7-page-code.md) | Code Canvas / JSX 选择、page-spec、dataBinding、本地校验 | 必读 |
| [Step 8：发布页面并排序导航](workflow/step-8-publish-navigation.md) | publish、导航排序、发布完成证据 | 必读 |
| [Step 9：输出与收尾](workflow/step-9-output-finish.md) | final 口径、URL 规则、可选后置、错误处理 | 必读 |
| [执行编排参考](references/app-build-contract.md) | 字段文件示例、典型场景、URL、故障处理 | 排障或需要示例时 |
| [常见问题解决思路](references/common-issues.md) | 资源冲突、字段 ID、seed records、页面数据、发布失败、输出口径等高频问题 | 遇到异常或执行结果不符合预期时 |
