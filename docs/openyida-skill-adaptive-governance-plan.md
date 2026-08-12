# OpenYida Skill 自适应治理与 Code Canvas 统一运行时完整方案

> 文档状态：治理方案，不代表代码已经实现。
>
> 编写日期：2026-08-07
>
> 适用范围：`yida-skills/`、`lib/app/`、`lib/core/`、`scripts/eval/`、`scripts/validate-skills.js`、npm 发布包和悟空 Skill 发布包。
>
> 本文保留具体实现建议、目录、字段、错误码、伪代码、测试矩阵和迁移批次，不是精简摘要。

## 1. 要解决的问题

OpenYida Skill 为兼容弱模型，逐步积累了大量防御性规则：

- 在执行前一次性注入大量禁止项、FATAL 规则和 Checklist。
- 同一条规则在根 Skill、`yida-app`、页面 Skill、reference 和示例中重复描述。
- 把原本可以由 CLI、编译器、Schema Builder 或 linter 确定性完成的工作交给模型生成。
- 为历史事故持续追加 prompt 补丁，但补丁没有版本、命中统计、过期时间和退出机制。
- 为兼容普通 JSX 与 Code Canvas，保留两条自定义页面判断链路，导致模型需要反复判断页面技术路线。
- `yida-app` 同时承担路由、PRD、资源创建、数据初始化、页面生成、发布、验收和最终输出，正文已经达到 329 行。
- 主题注入、Yida API 数据桥、表单抽屉 iframe 主题同步等代码出现在多个文档中，模型需要复制代码，容易漏方法、漏清理或改坏语法。
- 强模型也必须阅读弱模型时代的全部补丁，增加 token、推理分支和错误引导。

治理目标不是删掉所有约束，也不是假设强模型永远正确，而是把规则放回正确的执行层：

1. 不可逆、安全和资源归属检查始终前置。
2. 程序可以保证的事情由代码、Schema Builder、编译器和校验器保证。
3. Skill 只保留意图、输入、输出、阶段、完成条件和少量关键边界。
4. 默认先让模型按极简 Skill 执行。
5. 外部确定性校验器产出错误码、证据和修复范围。
6. 能由程序修复的错误不再调用模型。
7. 只有语义问题才按错误码注入最小补丁，并且只重跑失败阶段一次。
8. 每个补丁都必须可评测、可统计、可退役，不能永久进入基础 prompt。
9. 完整应用和新自定义页面默认只走 Code Canvas；普通 JSX Skill 保留给明确要求 JSX 或历史普通页面维护。

## 2. 当前项目审计事实

### 2.1 Skill 规模与结构

当前仓库可见事实：

- `yida-skills/` 下共有 155 个 Markdown 文件。
- `yida-skills/skills/` 下共有 51 个子 Skill 入口，加上根 `yida-skills/SKILL.md`，共 52 个入口层文档。
- `yida-skills/skills/yida-app/SKILL.md` 当前为 329 行。
- `yida-app` 目录目前只有 `SKILL.md` 和 `references/app-build-contract.md`，还没有真正拆成 workflow 文件。
- `scripts/validate-skills.js` 当前主要检查 frontmatter、索引、路径、描述长度和 500 行建议阈值。
- 500 行阈值只能拦截非常长的 Skill，不能发现 200 到 400 行 Skill 内部的职责混杂。
- 当前校验没有完整覆盖跨 Skill 重复段落、同义规则漂移、规则归属冲突、代码片段重复和失效补丁。

### 2.2 重复内容的主要类型

目前重复不是简单的文字相同问题，而是至少包含以下几类：

| 重复类型 | 当前表现 | 风险 |
| --- | --- | --- |
| 路由重复 | 根 Skill、`yida-app`、`yida-create-page`、`yida-canvas-custom-page` 都描述 Canvas 与普通 JSX 的选择 | 修改一处后其他位置继续给出旧判断 |
| 发布闭环重复 | 多个页面 Skill 都重复说明 compile、publish、readback 和“源码已修改不等于已发布” | 文档膨胀，细节容易不一致 |
| 主题代码重复 | `theme-runtime-helpers.md`、`data-bridge-guide.md`、页面指南和 `lib/app/form-theme-action.js` 都包含或描述注入逻辑 | 模型复制代码时容易漏 iframe、父窗口和 token 校验 |
| 数据桥重复 | Canvas Skill、数据桥 reference、页面生成指南和 linter 都描述 `window.__OPENYIDA_YIDA_API__` | 方法集合与调用方式容易漂移 |
| JSX 编码规则重复 | 中文 JSX 文案、emoji、图标、依赖全局、hooks cleanup 等规则在多个 Skill 重复 | 强模型被大量低层语法提醒干扰 |
| 完成条件重复 | 登录、创建、写数据、发布、导航、最终 URL 等流程同时存在于根 Skill 与 `yida-app` | 编排入口不再单一 |
| 历史事故补丁 | 某次模型出错后直接追加 MUST/NEVER/FATAL | 没有命中率和过期机制，只增不减 |

后续重复治理不能只做文本去重。每条规则要先确定唯一所有者，再由其他 Skill 使用链接、错误码或 workflow 引用该规则。

### 2.3 Code Canvas 当前 WIP

当前未提交 WIP 位于：

- `lib/app/services/canvas-page-schema-builder.js`
- `lib/app/page-linter.js`
- `tests/canvas-compile.test.js`

当前 WIP 已经完成的部分：

- 外层页面 `didMount` 从 `this.utils.yida` 获取 Yida API 对象。
- 创建桥对象后写入当前窗口、父窗口和顶层窗口。
- 兼容三个全局名称：
  - `window.OPENYIDA_YIDA_API`
  - `window.__OPENYIDA_YIDA_API__`
  - `window.openyidaYidaApi`
- 增加 `baseUrl` 和 `getLoginState()`，用于读取当前应用、组织和用户上下文。
- linter 已允许识别三个兼容全局名称。

当前 WIP 尚未完成的部分：

- 只代理了 7 个表单方法。
- 缺少官方文档中的 6 个流程方法。
- 主题运行时没有与 Yida API 桥形成一个统一的 Canvas 基础运行时。
- 没有一个只包含运行时接入的最小 `.canvas.jsx` 预置。
- Skill 路由仍把 `this.utils.yida.*` 当作切换普通 JSX 的理由，和当前 WIP 的方向冲突。
- 当前 `openyidaNormalizeYidaApiParams()` 对所有 API 都补 `searchFieldJson`，后续补流程方法时不能继续无差别归一化。

### 2.4 官方 Yida API 能力范围

官方跨应用 JS API 调用方式为：

```javascript
this.utils.yida.<methodName>(params)
```

OpenYida Canvas 发布层应代理以下 13 个方法。

表单方法，共 7 个：

1. `saveFormData`
2. `updateFormData`
3. `searchFormDataIds`
4. `getFormComponentDefinationList`
5. `deleteFormData`
6. `getFormDataById`
7. `searchFormDatas`

流程方法，共 6 个：

1. `startProcessInstance`
2. `updateProcessInstance`
3. `deleteProcessInstance`
4. `getProcessInstances`
5. `getProcessInstanceIds`
6. `getProcessInstanceById`

官方资料：

- [宜搭跨应用 JS API 资料一](https://docs.aliwork.com/docs/yida_support/lbtl0t/aql605)
- [宜搭跨应用 JS API 资料二](https://docs.aliwork.com/docs/yida_support/lbtl0t/ocmxyv/fktkelqgtugmusls)
- 仓库内同步参考：`yida-skills/references/yida-api.md`

### 2.5 npm 语言包现状

当前 npm 包中的核心语言文件只有：

- `lib/core/locales/zh.js`
- `lib/core/locales/en.js`

`package.json` 发布 `lib/`，因此当前核心 npm 运行包实际只包含中文和英文。其他语言不在当前 `lib/core/locales/` 中，也不会作为核心运行时语言文件进入包。

治理结论：

- “npm 核心包只打中文和英文”当前已经成立。
- 运行时兜底链继续保持 `当前语言 -> en -> zh`。
- 其他语言如果后续恢复，应作为可选语言包或独立扩展包，不重新灌入核心包。
- `check:i18n` 仍应校验 zh/en 完整性；可选语言需要单独校验，不和核心包发布阻塞混在一起。

## 3. 总体治理模型

推荐正式名称：

> Verifier-guided Adaptive Execution，校验器驱动的自适应执行。

不要把它命名为单纯的 Self-adaptive Prompt，因为核心不是模型自己判断强弱，也不是模型自己反思，而是外部校验器根据实际失败证据决定是否增加约束。

完整在线流程：

```text
用户请求
  |
  v
不可逆操作前置护栏
  |  登录态、corpId、目标资源、权限、危险操作确认、幂等键
  v
加载极简 Skill 与当前 workflow 节点
  |
  v
模型首次原生执行
  |
  v
确定性校验器
  |------------------------ 通过 -----------------------> 保存 checkpoint / 进入下一节点
  |
  +-- 失败
       |
       v
  生成结构化 ValidationResult
       |
       +-- deterministic_fix ---------------------------> 程序修复 -> 重新校验
       |
       +-- patch_retry ---------------------------------> 选择最小补丁 -> 只重跑失败节点一次
       |
       +-- model_escalation ----------------------------> 可选升级更强模型 -> 只重跑失败节点
       |
       +-- fatal / user_action_required ----------------> 停止并输出证据
```

### 3.1 不是“执行后再跑一遍 Checklist”

错误做法：

```text
第一次失败
  -> 把完整弱模型 Checklist 重新塞给模型
  -> 让模型自行判断哪里错了
  -> 让模型重做整个应用
```

推荐做法：

```text
第一次失败
  -> 校验器给出 PAGE_STATES_INCOMPLETE
  -> 附带缺少 loading / empty / error 的具体证据
  -> 只注入 page-states 补丁
  -> 只重跑 build-canvas 节点
  -> 保留已经创建的应用、表单、数据和页面 ID
```

### 3.2 不按模型名字判断强弱

不要维护以下规则：

```javascript
if (modelName.includes('small')) {
  injectAllWeakModelRules();
}
```

原因：

- 同一模型在不同任务上的能力不同。
- 强模型也可能在特定 Schema、API 或页面环境中失败。
- 弱模型在结构明确的任务上可能首次直接通过。
- 模型名称、版本和供应商会持续变化。

应根据当前执行产生的错误码和证据动态选择补丁。模型能力画像只用于离线统计和可选的成本路由，不作为在线补丁的唯一触发条件。

## 4. 四类规则的归属

现有 Skill 内容先不直接删除，先逐条标记为以下四类。

### 4.1 `invariant`：始终前置

适合放入永久前置护栏：

- 登录态必须可用。
- 多组织账号必须明确 `corpId`。
- 创建前解析当前应用和已有同名资源。
- 修改前确认真实 `appType`、`formUuid`、`formInstId`。
- 删除、覆盖、发布到不同资源等不可逆操作必须确认。
- 发布前保存目标资源 revision 或等价并发控制信息。
- 外部资源创建必须使用幂等键或 checkpoint，不能在模型重试时重复创建。
- 密钥、Cookie、CSRF 和 token 不写进 Skill、页面源码和日志。
- “本地编译成功”不能表述为“线上已发布”。

这类规则不能因为模型很强就跳过，也不能采用“先操作，失败后再修”的策略。

### 4.2 `deterministic`：下沉到代码

适合从 Skill 移到 CLI、编译器、Schema Builder、linter 或 script：

- Canvas 13 个 Yida API 的 window 注册。
- 应用主题读取和 `style#yida-global-theme` 注入。
- 同源父窗口与 iframe 主题同步。
- Canvas 依赖 import 校验和 importedModules 生成。
- JSX 中文裸变量检查。
- emoji 检测。
- `formInstId` 必填校验。
- `pageSize <= 100`。
- Schema JSON 解析和必要节点检查。
- 页面扩展名与 Canvas/native 发布路由。
- zh/en 语言键完整性。
- npm 包内容只包含预期语言文件。
- `yida-app` workflow 节点输入输出 Schema 校验。

这些问题一旦能够被程序判断，就不再让模型阅读对应的长篇防御说明。

### 4.3 `adaptive-patch`：失败后最小注入

适合保留为动态补丁：

- PRD 缺少核心角色、业务对象或验收标准。
- 页面缺少 loading、empty、error、permission 等状态。
- 页面视觉层级不足，但语法和 Schema 都合法。
- 真实数据字段映射与业务文案语义不一致。
- 页面主操作没有覆盖 PRD 中的核心任务。
- 导航顺序与 PRD 的使用频率不一致。
- 复杂任务中模型漏掉某一个 workflow 输出文件。
- 第一次生成的页面过于模板化或业务内容不足。

补丁只描述当前错误、必须保持的已通过内容、允许修改的文件或节点，以及再次通过的判定条件。

### 4.4 `obsolete`：进入隔离区并准备退役

候选内容：

- 已被编译器稳定处理的语法提示。
- 已被 Schema Builder 自动注入的主题和数据桥代码。
- 已经不存在的旧 API、Cookie 登录、二维码 handoff 或旧发布链路。
- 因单次事故加入、长期没有再次命中的规则。
- 和当前 Code Canvas 默认链路相冲突的普通 JSX 自动切换提示。
- 同一规则在非所有者 Skill 中的重复全文。

`obsolete` 规则不能立即删除。先进入 `quarantine`，通过强弱模型评测和历史场景回放确认没有回归，再删除。

## 5. 推荐目录结构

```text
openyida/
├── lib/
│   ├── skill-runtime/
│   │   ├── executor.js
│   │   ├── workflow-runner.js
│   │   ├── validator-runner.js
│   │   ├── deterministic-repair.js
│   │   ├── patch-selector.js
│   │   ├── stage-retry.js
│   │   ├── model-router.js
│   │   ├── checkpoint-store.js
│   │   ├── telemetry.js
│   │   └── contracts/
│   │       ├── validation-result.schema.json
│   │       ├── patch.schema.json
│   │       ├── workflow-state.schema.json
│   │       └── telemetry-event.schema.json
│   └── app/
│       └── runtime/
│           ├── canvas-runtime-action.js
│           ├── canvas-yida-api-methods.js
│           └── canvas-theme-runtime.js
├── lib/samples/
│   └── yida-canvas-custom-page/
│       └── canvas-base.canvas.jsx
├── yida-skills/
│   ├── SKILL.md
│   ├── patches/
│   │   ├── registry.json
│   │   └── quarantine.json
│   └── skills/
│       └── yida-app/
│           ├── SKILL.md
│           ├── workflow/
│           │   ├── 00-resolve-context.md
│           │   ├── 10-design.md
│           │   ├── 20-provision.md
│           │   ├── 30-seed-data.md
│           │   ├── 40-build-canvas.md
│           │   ├── 50-publish.md
│           │   └── 60-deliver.md
│           ├── references/
│           │   ├── app-build-contract.md
│           │   ├── workflow-state-contract.md
│           │   └── validation-contract.md
│           ├── script/
│           │   ├── validate-context.js
│           │   ├── validate-design.js
│           │   ├── validate-resources.js
│           │   ├── validate-canvas.js
│           │   └── validate-delivery.js
│           └── assets/
│               └── patches/
│                   ├── design-incomplete.json
│                   ├── page-states-incomplete.json
│                   ├── data-binding-incomplete.json
│                   └── publish-evidence-missing.json
├── scripts/
│   ├── validate-skill-duplicates.js
│   ├── validate-skill-ownership.js
│   ├── validate-patch-registry.js
│   └── eval/
│       ├── scenarios/
│       │   ├── strong-model/
│       │   ├── weak-model/
│       │   ├── patch-activation/
│       │   └── patch-retirement/
│       └── reports/
└── docs/
    └── openyida-skill-adaptive-governance-plan.md
```

目录职责要求：

- `lib/skill-runtime/` 只放跨 Skill 共享的执行引擎。
- Skill 专属校验器放到对应 Skill 的 `script/`，不复制共享执行器。
- Prompt 补丁是数据，放 `assets/patches/` 或统一 registry，不写进 `SKILL.md` 正文。
- 可执行代码不放在 Markdown reference 中作为主要实现来源。
- 代码示例可以保留在 reference 作为阅读材料，但真实执行必须调用脚本或运行时模块。
- `SKILL.md` 只保留选择条件、输入、输出、workflow 索引、完成条件和高风险边界。

## 6. ValidationResult 契约

每个校验器必须返回统一结构，禁止只返回一段自然语言。

```json
{
  "ok": false,
  "stage": "40-build-canvas",
  "retryable": true,
  "repairType": "patch_retry",
  "issues": [
    {
      "code": "PAGE_STATES_INCOMPLETE",
      "severity": "error",
      "message": "页面缺少加载失败和空数据状态",
      "evidence": [
        "源码存在 loading state",
        "未找到 error state",
        "数据数组为空时仍渲染正常列表"
      ],
      "location": "project/pages/src/workbench.canvas.jsx",
      "expected": [
        "loading",
        "empty",
        "error"
      ],
      "actual": [
        "loading"
      ],
      "patchId": "page-states-incomplete",
      "retryScope": "40-build-canvas",
      "preserve": [
        "已验证的 dataBinding",
        "已验证的业务字段映射",
        "现有页面导航"
      ]
    }
  ]
}
```

字段要求：

| 字段 | 说明 |
| --- | --- |
| `ok` | 所有阻塞校验是否通过 |
| `stage` | 失败 workflow 节点，必须可定位 |
| `retryable` | 是否允许模型修复 |
| `repairType` | `deterministic_fix`、`patch_retry`、`model_escalation`、`fatal`、`user_action_required` |
| `code` | 稳定错误码，不能使用随文案变化的 message 作为匹配条件 |
| `evidence` | 校验器实际观察到的事实 |
| `location` | 文件、资源 ID 或 workflow state 路径 |
| `patchId` | 需要模型修复时使用的补丁 ID |
| `retryScope` | 只允许重跑的节点 |
| `preserve` | 已通过且禁止重写的内容 |

## 7. Patch 契约与示例

```json
{
  "id": "page-states-incomplete",
  "version": 1,
  "status": "active",
  "owner": "yida-canvas-custom-page",
  "triggerCodes": [
    "PAGE_STATES_INCOMPLETE"
  ],
  "appliesToStages": [
    "40-build-canvas"
  ],
  "retryScope": "failed_stage_only",
  "maxUsesPerRun": 1,
  "incompatibleWith": [],
  "prompt": "只修复校验报告列出的缺失页面状态。保留已通过的数据绑定、字段映射、页面结构和导航。补齐 loading、empty、error 状态，并确保状态由真实请求结果驱动。不要重新创建应用、表单或页面，不要改动其他 workflow 产物。",
  "introducedAt": "2026-08-07",
  "introducedFor": "弱模型生成列表页时经常只有 loading 状态",
  "metrics": {
    "activationCount": 0,
    "recoveryCount": 0,
    "falsePositiveCount": 0,
    "secondFailureCount": 0
  },
  "retireWhen": {
    "minimumObservedRuns": 500,
    "rollingActivationRateBelow": 0.005,
    "minimumWindowDays": 30
  }
}
```

补丁治理要求：

- 一个补丁只解决一个或一组强相关错误码。
- 补丁不能包含完整 Skill 内容。
- 补丁不能要求模型重做所有阶段。
- 补丁必须写明需要保留的已通过内容。
- 单次运行同一补丁最多使用一次。
- 默认全局模型重试预算为一次；确需多阶段分别重试时必须显式配置预算。
- 补丁命中但没有恢复成功，要增加 `secondFailureCount`。
- 校验器误报要增加 `falsePositiveCount`，不能把误报归因于模型。
- 补丁修复成功不代表立即并入基础 Skill。
- 只有跨模型、跨版本长期高频出现，并且属于通用业务规则时，才考虑提升为基础规则或确定性校验。

## 8. 执行器伪代码

```javascript
async function executeWorkflowStage(stage, state, options) {
  const firstCandidate = await runModel({
    skill: stage.baseSkill,
    workflow: stage.instructions,
    state,
    patches: [],
  });

  let report = await validateStage(stage, firstCandidate, state);
  if (report.ok) {
    return checkpoint(stage, firstCandidate, report);
  }

  const deterministicResult = await applyDeterministicRepairs({
    stage,
    candidate: firstCandidate,
    report,
  });

  if (deterministicResult.changed) {
    report = await validateStage(stage, deterministicResult.candidate, state);
    if (report.ok) {
      return checkpoint(stage, deterministicResult.candidate, report);
    }
  }

  if (!report.retryable || options.retryBudget <= 0) {
    throw createStageFailure(report);
  }

  const patches = selectMinimalCompatiblePatches(report.issues);
  const repairedCandidate = await runModel({
    skill: stage.baseSkill,
    workflow: stage.instructions,
    state,
    previousCandidate: deterministicResult.candidate,
    diagnostics: report,
    patches,
    scope: report.stage,
  });

  const secondReport = await validateStage(stage, repairedCandidate, state);
  recordPatchMetrics(patches, report, secondReport);

  if (!secondReport.ok) {
    throw createStageFailure(secondReport);
  }

  return checkpoint(stage, repairedCandidate, secondReport);
}
```

执行器不能做的事情：

- 失败后重新从 `create-app` 开始。
- 在没有幂等保护时重放创建命令。
- 把所有活跃补丁一起注入。
- 在第二次失败后无限循环。
- 让模型自行忽略校验错误。
- 因为模型被标记为“强模型”就跳过确定性校验。

## 9. `yida-app` workflow 拆分

### 9.1 `yida-app/SKILL.md` 保留内容

只保留：

- 触发条件：从零创建完整应用、系统、平台、多页面业务应用。
- 不触发条件：只改已有单页、只操作数据、只配置权限、只维护普通 JSX。
- 必需输入：业务目标、目标组织、是否已有 appType、是否允许创建真实资源。
- workflow 索引。
- 全局安全边界。
- 完成条件：线上资源、主 URL、业务表单/页面摘要和未完成项。
- 每个阶段需要加载的子 Skill 名称。

不再保留：

- 每个 CLI 命令的完整参数说明。
- Canvas 代码片段。
- 主题 helper。
- 普通 JSX 编码指南。
- 所有阶段的长篇失败处理。
- 同一规则的多次重复说明。

### 9.2 `00-resolve-context.md`

输入：

- 用户需求。
- 当前 cwd、workspace 和 branch。
- `agent-capabilities --summary-json`。
- 登录态、组织、已有 `project/config.json` 和 cache。

输出：

```json
{
  "corpId": "",
  "baseUrl": "",
  "existingAppType": "",
  "permissionToCreate": false,
  "targetResources": [],
  "workspace": ""
}
```

校验器：

- `AUTH_NOT_READY`
- `CORP_ID_AMBIGUOUS`
- `CREATE_PERMISSION_MISSING`
- `TARGET_RESOURCE_CONFLICT`

这些错误不允许模型补丁重试，需要用户操作或确定性上下文修复。

### 9.3 `10-design.md`

输入：

- 业务目标。
- 角色和任务。
- 已有资源上下文。
- `yida-design` 输出要求。

输出：

- `prd/<项目名>/prd.md`
- `prd/<项目名>/design.md`
- 页面、表单、流程和导航蓝图。
- 每个页面的 `designMd` 或 design section 引用。

校验器：

- `PRD_ROLE_MISSING`
- `PRD_BUSINESS_OBJECT_MISSING`
- `PRD_PAGE_BLUEPRINT_MISSING`
- `DESIGN_PAGE_SCOPE_MISSING`
- `DESIGN_STATES_MISSING`

这类错误允许使用设计补丁，但只重新生成缺失章节，不重做已确认业务事实。

### 9.4 `20-provision.md`

输入：

- PRD 资源蓝图。
- 是否已有 appType。
- 用户创建授权。

输出：

- appType。
- formUuid / processCode / page formUuid。
- 资源创建日志和幂等键。

校验器：

- `APP_TYPE_MISSING`
- `FORM_UUID_MISSING`
- `RESOURCE_DUPLICATE_TITLE`
- `RESOURCE_KIND_MISMATCH`
- `CREATE_RESULT_UNVERIFIED`

该阶段不能使用 prompt 让模型“猜一个 ID”。错误优先通过 API 回读、重查已有资源或停止处理。

### 9.5 `30-seed-data.md`

输入：

- 核心表单 Schema。
- PRD 示例数据约束。

输出：

- 1 到 3 条真实业务化 demo records，或明确空态原因。
- 每条记录真实 `formInstId`。

校验器：

- `SEED_FIELD_MAPPING_INVALID`
- `SEED_WRITE_FAILED`
- `FORM_INST_ID_MISSING`
- `SEED_CONTENT_LEAKED_FROM_SAMPLE`

写入失败不能用静态前端数组冒充真实数据。

### 9.6 `40-build-canvas.md`

输入：

- PRD 页面章节。
- design.md 页面视觉输入。
- 真实 appType、formUuid、fieldId。
- Canvas 基础预置。
- `window.__OPENYIDA_RUNTIME__` 运行时契约。

输出：

- 最终 `.canvas.jsx` / `.canvas.tsx`。
- importedModules。
- dataBinding。
- 本地编译结果。

校验器：

- `CANVAS_COMPILE_FAILED`
- `CANVAS_ENTRY_MISSING`
- `CANVAS_DEPENDENCY_UNAVAILABLE`
- `CANVAS_YIDA_RUNTIME_NOT_USED`
- `CANVAS_DATA_BINDING_INCOMPLETE`
- `PAGE_STATES_INCOMPLETE`
- `PAGE_BUSINESS_CONTENT_INSUFFICIENT`
- `PAGE_THEME_ROOT_MISSING`
- `FORM_DETAIL_ID_SOURCE_INVALID`

语法、依赖、emoji、路径和 Schema 问题走确定性修复或直接失败；业务内容和页面状态问题才使用补丁。

### 9.7 `50-publish.md`

输入：

- 已通过本地校验的 Canvas 源码。
- appType、display page formUuid。
- 目标页面 revision。

输出：

- 发布响应。
- 线上 Schema 回读。
- URL。
- 可选健康检查或截图证据。

校验器：

- `PUBLISH_TARGET_MISMATCH`
- `PUBLISH_CONFLICT`
- `PUBLISH_RESPONSE_FAILED`
- `PUBLISHED_SCHEMA_NOT_CANVAS`
- `PUBLISHED_RUNTIME_MISSING`
- `PUBLISHED_URL_UNVERIFIED`

发布失败不允许模型自动改用另一个页面 ID。

### 9.8 `60-deliver.md`

输入：

- 所有 checkpoint。
- 已发布 URL。
- 实际创建和验证的资源。

输出：

- 一个主 URL。
- 业务可读的表单、流程、页面和能力摘要。
- 未验证或失败项。
- 不默认输出大段资源 ID 清单。

校验器：

- `DELIVERY_MAIN_URL_MISSING`
- `DELIVERY_CLAIM_EXCEEDS_EVIDENCE`
- `DELIVERY_UNVERIFIED_ITEM_HIDDEN`
- `DELIVERY_RESOURCE_SUMMARY_MISSING`

## 10. Code Canvas 统一运行时方案

### 10.1 唯一推荐入口

推荐主入口：

```javascript
window.__OPENYIDA_RUNTIME__ = {
  version: 1,
  yida: {},
  theme: {},
  context: {}
};
```

兼容别名继续保留：

```javascript
window.__OPENYIDA_YIDA_API__ = window.__OPENYIDA_RUNTIME__.yida;
window.OPENYIDA_YIDA_API = window.__OPENYIDA_RUNTIME__.yida;
window.openyidaYidaApi = window.__OPENYIDA_RUNTIME__.yida;
```

不要把 13 个方法直接注册为 `window.startProcessInstance` 等顶层变量。它们仍然是 window 上的能力，但应放在命名空间中，避免和宿主页面、第三方库或未来宜搭全局变量冲突。

Code Canvas 新代码统一消费：

```javascript
window.__OPENYIDA_RUNTIME__.yida.searchFormDatas(params)
window.__OPENYIDA_RUNTIME__.yida.startProcessInstance(params)
window.__OPENYIDA_RUNTIME__.theme.install(tokens)
```

### 10.2 Yida API 方法单一清单

建议新增：

```javascript
const CANVAS_YIDA_API_METHODS = Object.freeze([
  'saveFormData',
  'updateFormData',
  'searchFormDataIds',
  'getFormComponentDefinationList',
  'deleteFormData',
  'getFormDataById',
  'searchFormDatas',
  'startProcessInstance',
  'updateProcessInstance',
  'deleteProcessInstance',
  'getProcessInstances',
  'getProcessInstanceIds',
  'getProcessInstanceById',
]);
```

要求：

- Schema Builder、测试、Skill API 表格和 capabilities 文档都从同一清单生成或校验。
- 不在对象字面量里手写 13 次代理代码。
- 通过循环生成 bridge 方法。
- 每个方法内部保持原始 `this.utils.yida` 绑定。
- 所有调用统一返回 Promise。
- 宿主不支持某个方法时返回带方法名的明确错误。

### 10.3 参数归一化不能一刀切

以下搜索接口可以处理 `query -> searchFieldJson`：

- `searchFormDatas`
- `searchFormDataIds`
- `getProcessInstances`
- `getProcessInstanceIds`

以下方法应原样透传，不默认增加空 `searchFieldJson`：

- `saveFormData`
- `updateFormData`
- `getFormComponentDefinationList`
- `deleteFormData`
- `getFormDataById`
- `startProcessInstance`
- `updateProcessInstance`
- `deleteProcessInstance`
- `getProcessInstanceById`

建议实现：

```javascript
function normalizeYidaApiParams(methodName, params) {
  const next = Object.assign({}, params || {});
  const searchMethods = [
    'searchFormDatas',
    'searchFormDataIds',
    'getProcessInstances',
    'getProcessInstanceIds',
  ];

  if (!searchMethods.includes(methodName)) {
    return next;
  }

  if (next.query && !next.searchFieldJson) {
    next.searchFieldJson = JSON.stringify(next.query);
    delete next.query;
  }

  if (next.searchFieldJson && typeof next.searchFieldJson !== 'string') {
    next.searchFieldJson = JSON.stringify(next.searchFieldJson);
  }

  if (!next.searchFieldJson) {
    next.searchFieldJson = '';
  }

  return next;
}
```

### 10.4 Theme 运行时能力

`window.__OPENYIDA_RUNTIME__.theme` 建议固定提供：

| 方法 | 作用 |
| --- | --- |
| `refresh()` | 重新读取当前应用运行时主题并更新 `style#yida-global-theme` |
| `install(tokens)` | 校验并安装 design.md 提供的自定义 CSS variables |
| `installIntoFrame(tokens, iframeElement)` | 把同一份主题安装到同源表单提交页或详情页 iframe |
| `getTokens()` | 返回当前运行时已安装的 token 副本 |

Token 校验规则：

- key 必须匹配 `^--[A-Za-z0-9-_]+$`。
- value 只允许 string 或 number。
- value 不能包含 `{}`、`;`、`<`、`>`。
- 重复安装更新同一个 `style#yida-global-theme`，不能插入多个 style。
- 目标包括当前文档、可访问的同源父窗口文档和显式传入的 iframe 文档。
- 跨域访问异常静默跳过，但 telemetry 要记录 bridge 目标数量和失败数量。

### 10.5 Canvas 外层生命周期顺序

建议固定为：

```text
外层 Page componentDidMount
  1. 获取 this.utils 与 this.utils.yida
  2. 创建完整 13 方法 yida bridge
  3. 创建 theme bridge
  4. 创建 context bridge
  5. 注册 window.__OPENYIDA_RUNTIME__
  6. 注册三个 Yida API 兼容别名
  7. refresh 默认应用主题
  8. YidaCodeCanvas 内部组件开始消费 runtime
```

如果宿主生命周期不能保证第 8 步晚于注册，Canvas 预置需要做有限次数的 runtime ready 探测，不能无限轮询。

### 10.6 最小 `canvas-base.canvas.jsx` 预置

预置不包含表格、表单、卡片、图表、业务文案和 mock 数据，只提供运行时接入点。

```jsx
import React from 'react';

function resolveOpenYidaRuntime() {
  const candidates = [];
  try { candidates.push(window.__OPENYIDA_RUNTIME__); } catch (error) {}
  try { candidates.push(window.parent && window.parent.__OPENYIDA_RUNTIME__); } catch (error) {}
  try { candidates.push(window.top && window.top.__OPENYIDA_RUNTIME__); } catch (error) {}

  return candidates.find((candidate) => {
    return candidate && candidate.yida && candidate.theme;
  }) || { yida: null, theme: null, context: null };
}

function YidaComp() {
  const runtime = React.useMemo(resolveOpenYidaRuntime, []);

  React.useEffect(() => {
    if (runtime.theme && typeof runtime.theme.refresh === 'function') {
      runtime.theme.refresh();
    }
  }, [runtime]);

  return (
    <main
      data-yida-theme-root="true"
      data-yida-api-ready={runtime.yida && runtime.yida.ready ? 'true' : 'false'}
      style={{ minHeight: '100%' }}
    />
  );
}

export default YidaComp;
```

使用方式：

```bash
openyida sample yida-canvas-custom-page canvas-base \
  --output project/pages/src/<page-name>.canvas.jsx
```

模型后续只在这个预置上添加：

- 页面组件。
- 业务状态。
- dataBinding。
- `runtime.yida` API 调用。
- design.md tokens 的 `runtime.theme.install(tokens)`。
- FormOpenContainer 的 `runtime.theme.installIntoFrame(tokens, iframe)`。

### 10.7 Canvas 验收条件

必须增加以下测试：

1. Schema action source 包含 13 个官方方法名。
2. `CANVAS_YIDA_API_METHODS` 数量固定为 13。
3. 三个兼容别名和 `window.__OPENYIDA_RUNTIME__.yida` 指向同一个 bridge。
4. 当前窗口、父窗口、顶层窗口都能读取 runtime。
5. 搜索方法执行 query 归一化。
6. 保存、删除、流程发起和详情方法不被注入 `searchFieldJson`。
7. 不支持的方法返回 `this.utils.yida.<method> is not available`。
8. 默认页面 Schema 包含主题 action。
9. theme `install()` 过滤非法 key/value。
10. theme 重复安装只保留一个 `style#yida-global-theme`。
11. iframe 安装在同源情况下成功，跨域情况下不抛出到业务代码。
12. `canvas-base.canvas.jsx` 能通过 `compileCanvasLocal`。
13. 预置 importedModules 只包含 `react`。
14. 预置不包含 Table、Form、Button、Card、mock data 等业务功能。

## 11. 自定义页面路由收敛

### 11.1 默认链路

以下场景默认使用 `yida-canvas-custom-page`：

- 新建自定义展示页。
- 官网、门户、工作台、列表、详情、看板、数据大屏。
- React hooks、图表、动效和现代交互。
- 调用 7 个表单 Yida API。
- 调用 6 个流程 Yida API。
- 使用主题注入。
- 打开原生表单提交页和详情页。

### 11.2 普通 JSX Skill 保留条件

`yida-custom-page` 继续保留，触发条件收敛为：

- 用户明确说“普通自定义页面”“JSX/Jsx 组件”“renderJsx”。
- 维护已经存在的普通 `Jsx` 页面。
- 必须使用 `this.$(fieldId)` 字段双向绑定。
- 必须使用 `this.dataSourceMap` 设计器数据源实例。
- 必须使用 `this.forceUpdate()` 或普通页面 `didMount` 等实例生命周期。
- 必须和旧页面中已经存在的普通实例状态深度耦合。

仅仅需要 `this.utils.yida.*` 不再触发普通 JSX，因为该能力已经通过 window bridge 提供给 Code Canvas。

### 11.3 需要同步修改的路由文档

实施时至少检查：

- `yida-skills/SKILL.md`
- `yida-skills/skills/yida-app/SKILL.md`
- `yida-skills/skills/yida-app/references/app-build-contract.md`
- `yida-skills/skills/yida-create-page/SKILL.md`
- `yida-skills/skills/yida-canvas-custom-page/SKILL.md`
- `yida-skills/skills/yida-canvas-custom-page/references/data-bridge-guide.md`
- `yida-skills/skills/yida-canvas-custom-page/references/employeefield-verification.md`
- `yida-skills/skills/yida-custom-page/SKILL.md`
- `yida-skills/skills/yida-custom-page/references/component-jsx-guide.md`
- 路由 eval golden scenarios。

## 12. 代码编写指南治理

### 12.1 `yida-design` 不负责代码

`yida-design` 只负责：

- 业务目标与用户角色。
- 页面蓝图。
- 页面场景和区块。
- 视觉 DNA。
- 主题 token。
- 布局、密度、圆角、材质、状态和组件选择结果。
- 每页 designMd / design section。

不应负责：

- React 代码。
- Canvas 编译规则。
- `this.utils.yida` 注入代码。
- `window` bridge 代码。
- iframe 主题同步代码。
- Babel 兼容写法。
- publish Schema 结构。

### 12.2 代码指南归属

| 内容 | 唯一所有者 |
| --- | --- |
| Canvas React18 代码规则 | `yida-canvas-custom-page` |
| 普通 JSX / renderJsx 代码规则 | `yida-custom-page` |
| 主题设计事实 | `yida-design` |
| 主题运行时代码 | `lib/app/runtime/canvas-theme-runtime.js` |
| Yida API 方法清单 | `lib/app/runtime/canvas-yida-api-methods.js` |
| Canvas 基础预置 | `lib/samples/yida-canvas-custom-page/canvas-base.canvas.jsx` |
| 表单数据字段解析 | `yida-get-schema` 与确定性脚本 |
| 发布目标和 Schema 装配 | `lib/app/publish.js`、Schema Builder |

### 12.3 Markdown 中的代码示例

Markdown 可以展示调用示例，但必须遵守：

- 真实执行入口是脚本或运行时模块。
- 文档代码不能成为唯一实现来源。
- 示例需要通过测试或从模块自动提取。
- 同一 helper 不在多个 reference 手工复制。
- 若必须展示完整代码，由脚本生成 reference 区块并在 CI 检查漂移。

## 13. Skill 描述直白化标准

每个 frontmatter description 必须回答四件事：

1. 它做什么。
2. 用户说什么时触发。
3. 输入是什么。
4. 明确不处理什么相邻意图。

推荐模板：

```yaml
description: >
  为已有或新建的宜搭 display 页面编写并发布 Code Canvas React18 页面。
  用户提到代码画布、工作台、列表、详情、看板、门户、YidaCodeCanvas、
  runtimeCode，或需要通过 window 运行时调用宜搭表单/流程 API 时使用。
  不用于用户明确要求 renderJsx、this.$ 字段双向绑定或 dataSourceMap 的普通 JSX 页面。
```

禁止描述：

- “智能处理各种宜搭页面需求”。
- “适用于复杂场景”。
- “根据情况选择相关能力”。
- 只写技术名，不写用户意图。
- 把执行步骤写进 description。
- 使用“给小模型的最短路线”等内部模型术语。

新增校验建议：

- description 必须包含至少一个触发词或业务意图。
- 相邻且容易混淆的 Skill 必须写不触发边界。
- description 不超过 280 字的现有约束继续保留。
- 新增 route overlap 报告，列出描述中触发词高度重合的 Skill。

## 14. 重复描述治理机制

### 14.1 唯一规则所有者

新增 `skill-rule-ownership.json`：

```json
{
  "CANVAS_DEFAULT_ROUTE": "yida-skills/SKILL.md",
  "CANVAS_RUNTIME_YIDA_API": "yida-canvas-custom-page/references/data-bridge-guide.md",
  "CANVAS_THEME_RUNTIME": "lib/app/runtime/canvas-theme-runtime.js",
  "PUBLISH_EVIDENCE": "yida-publish-page/SKILL.md",
  "FORM_INST_ID_REQUIRED": "yida-form-detail/SKILL.md",
  "ORDINARY_JSX_CONTRACT": "yida-custom-page/SKILL.md"
}
```

非所有者位置只能：

- 写一句适用边界。
- 引用规则 ID。
- 链接到所有者文档。
- 不复制完整正文和完整代码。

### 14.2 重复校验器

`scripts/validate-skill-duplicates.js` 至少做：

- 忽略 frontmatter、标题、表格分隔线和命令示例中的必要重复。
- 对段落做空白、标点和路径归一化。
- 检测完全相同段落。
- 检测高相似段落。
- 输出两个文件位置、相似度和建议所有者。
- 支持 allowlist，记录允许重复的原因和过期日期。
- CI 初期只生成报告，不立即阻塞。
- 清理完成后，对新增重复阻塞，历史重复使用 baseline 棘轮。

### 14.3 代码片段漂移校验

对于 Yida API 方法清单、主题 helper 和 Canvas preset：

- 文档引用真实源文件或由脚本生成。
- CI 比较文档中的方法表和 `CANVAS_YIDA_API_METHODS`。
- 官方方法数量不是 13 时必须人工确认官方文档是否变化。
- 不允许只改 Skill API 表而不改 runtime 测试。

## 15. 评测方案

### 15.1 必须保留的指标

| 指标 | 含义 |
| --- | --- |
| `first_pass_success_rate` | 不加补丁首次通过率 |
| `patch_activation_rate` | 有多少运行触发补丁 |
| `patch_recovery_rate` | 触发补丁后成功恢复的比例 |
| `deterministic_repair_rate` | 无需模型重试即可修复的比例 |
| `second_failure_rate` | 补丁后仍失败的比例 |
| `false_positive_rate` | 校验器误报比例 |
| `stage_replay_count` | 单次任务重跑了多少节点 |
| `duplicate_resource_rate` | 重试导致重复资源的比例，目标必须为 0 |
| `latency_p50/p95` | 首次成功和补丁路径耗时 |
| `token_cost_p50/p95` | 每次完整应用的模型 token 成本 |
| `strong_model_regression` | 精简后强模型质量是否下降 |
| `weak_model_recovery` | 弱模型失败是否被补丁恢复 |

### 15.2 评测矩阵

每个核心场景至少运行：

| 模型组 | 无补丁首轮 | 自适应补丁 | 固定全量补丁基线 |
| --- | --- | --- | --- |
| 强模型 | 必测 | 必测 | 必测 |
| 中等模型 | 必测 | 必测 | 必测 |
| 弱模型 | 必测 | 必测 | 必测 |

对比维度：

- 路由正确率。
- PRD 完整度。
- 资源创建正确率。
- Canvas 编译率。
- 真实数据绑定率。
- 发布成功率。
- 页面截图质量。
- 总耗时。
- token 成本。
- 补丁命中是否准确。

### 15.3 场景集合

必须包含：

- 从零创建订单管理应用。
- 已有 appType，只新增一个工作台。
- Code Canvas 查询普通表单。
- Code Canvas 发起流程。
- Code Canvas 查询流程实例列表。
- Code Canvas 使用自定义主题。
- Code Canvas 打开详情 iframe 并同步主题。
- 用户明确要求普通 renderJsx 页面。
- 页面已有真实 `this.$` 字段绑定。
- 模型漏写 error state。
- 模型生成非法 imported module。
- 模型用错误 formInstId。
- 发布 revision 冲突。
- 多组织上下文不明确。
- 弱模型试图重复 create-app。

## 16. 补丁生命周期

### 16.1 新增补丁

新增补丁必须提交：

- 失败样本。
- 稳定错误码。
- 校验器证据。
- 最小 prompt。
- retryScope。
- preserve 列表。
- 强弱模型基线。
- 预计退役条件。

### 16.2 提升为基础规则

只有同时满足以下条件才提升：

- 多个模型版本都高频失败。
- 错误属于稳定业务不变量。
- 规则非常短，不会增加明显分支。
- 不能由程序确定性处理。
- 加入基础 Skill 后强模型无明显回归。

### 16.3 下沉为确定性代码

满足以下条件优先下沉：

- 错误可以通过 AST、Schema、文件、命令响应或 API 回读判断。
- 修复方式唯一或非常有限。
- 不需要业务语义推理。
- 重复出现且 prompt 修复不稳定。

主题注入、Yida API 注册、import、Schema 格式、emoji 和 formInstId 都属于这一类。

### 16.4 退役补丁

退役流程：

1. 标记 `candidate_for_retirement`。
2. 在 shadow 模式下不注入，但继续统计本来是否会命中。
3. 强弱模型回放历史场景。
4. 观察至少 30 天或 500 次运行。
5. 没有显著回归后移入 `quarantine.json`。
6. 再经过一个发布周期后删除 prompt 正文，保留变更记录。

## 17. 主流技术方案与采用边界

### 17.1 CRITIC：外部工具反馈后纠错

- 论文：[CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing](https://openreview.net/pdf?id=WSrRF5Wy6v)
- 和本方案最接近的部分：先生成，再用外部工具验证，正确则停止，错误则根据工具反馈修正。
- OpenYida 采用点：编译器、Schema 校验、API 回读、页面截图评分都作为外部反馈。
- 不直接照搬的部分：OpenYida 不允许无限多轮自我修正，只允许有限的局部重试。

### 17.2 Self-Refine：反馈与迭代改写

- 论文：[Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651)
- 可采用点：把首次产物、反馈和修复产物分离。
- 限制：仅靠同一个模型的自然语言自评不够可靠。
- OpenYida 用法：反馈必须来自确定性 validator，不使用“请重新检查所有内容”作为唯一反馈。

### 17.3 Reflexion：把失败经验作为记忆

- 论文：[Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)
- 可采用点：记录错误码、补丁结果和场景，用于后续离线优化。
- 限制：不能把某次失败反思直接永久写进基础 Skill。
- OpenYida 用法：经验进入 telemetry 和 patch registry，经过评测后再决定提升或退役。

### 17.4 LLM 自我纠错的限制

- 论文：[Large Language Models Cannot Self-Correct Reasoning Yet](https://openreview.net/forum?id=IkmD3fKBPQ)
- 关键提醒：缺少外部反馈时，内生自我纠错可能无效或降低结果质量。
- OpenYida 结论：校验器不能只是第二次模型调用；必须有编译、Schema、API、状态和证据层。

### 17.5 Guardrails AI：Validator 与错误修复动作

- 官方文档：[Guardrails Error Remediation](https://guardrailsai.com/guardrails/docs/concepts/error_remediation)
- 可采用点：校验失败后按类型选择 fix、reask 或 fail。
- OpenYida 对应关系：
  - `fix` -> deterministic repair
  - `reask` -> patch retry
  - `exception` -> fatal
  - `noop/filter` -> 非阻塞 warning 或输出过滤

### 17.6 Instructor：结构化输出校验与自动重试

- 官方文档：[Instructor Validation Basics](https://python.useinstructor.com/learning/validation/basics/)
- 可采用点：Schema 校验失败时把具体字段错误返回模型。
- OpenYida 用法：PRD manifest、workflow state、ValidationResult、patch manifest 使用 JSON Schema 或等价结构化校验。
- 限制：适合结构错误，不能替代业务语义和线上资源验证。

### 17.7 LangGraph：条件路由、节点重试和 checkpoint

- 官方文档：[LangGraph Graph API](https://docs.langchain.com/oss/python/langgraph/graph-api)
- 官方文档：[LangGraph Fault Tolerance](https://docs.langchain.com/oss/python/langgraph/fault-tolerance)
- 可采用点：条件边、节点级重试、状态持久化、失败后从节点恢复。
- OpenYida 用法：`yida-app` workflow 每个阶段成为节点，创建资源后立即 checkpoint。
- 不要求引入 LangGraph 依赖：可以先在现有 Node CLI 内实现同样的状态机契约。

### 17.8 DSPy：离线优化 Prompt 与程序

- 论文：[DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines](https://arxiv.org/abs/2310.03714)
- 官方优化器说明：[DSPy Optimizers](https://github.com/stanfordnlp/dspy/blob/main/docs/docs/learn/optimization/optimizers.md)
- 可采用点：用评测集和 metric 离线优化基础 prompt 和补丁。
- OpenYida 用法：优化 `yida-app` 基础说明、补丁 prompt 和模型路由阈值。
- 不采用点：不在每次线上用户请求中实时搜索 prompt。

### 17.9 ProTeGi：文本梯度 Prompt 优化

- 论文：[Automatic Prompt Optimization with Gradient Descent and Beam Search](https://aclanthology.org/2023.emnlp-main.494/)
- 可采用点：从失败样本生成 prompt 修改候选并通过评测集选择。
- OpenYida 用法：定期生成补丁候选，必须经过强弱模型矩阵后才能进入 registry。

### 17.10 RouteLLM 与 FrugalGPT：模型路由和级联

- 论文：[RouteLLM: Learning to Route LLMs with Preference Data](https://arxiv.org/abs/2406.18665)
- 论文：[FrugalGPT: How to Use Large Language Models While Reducing Cost and Improving Performance](https://arxiv.org/abs/2305.05176)
- 可采用点：简单任务先使用低成本模型，复杂或失败任务升级更强模型。
- OpenYida 用法：模型升级位于“确定性修复”和“最小补丁重试”之后，作为可选最后一级。
- 必须和补丁选择分离：补丁由错误码触发，模型路由由成本、风险和历史成功率决定。

## 18. 实施批次

### P0：建立事实源和边界

1. 冻结新增 Skill 防御性正文，新的事故规则先登记 issue 和错误样本。
2. 为现有规则建立 `invariant`、`deterministic`、`adaptive-patch`、`obsolete` 标签清单。
3. 确认 13 个官方 Yida API 方法清单。
4. 确认 npm 核心包只保留 zh/en，并增加包内容测试。
5. 为当前 3 个 Canvas WIP 文件补充明确验收范围，不在治理过程中覆盖现有 WIP。

### P1：完成 Canvas 运行时

1. 抽出 `canvas-yida-api-methods.js`。
2. 补齐 6 个流程方法。
3. 修正按方法归一化参数。
4. 引入 `window.__OPENYIDA_RUNTIME__`。
5. 复用或抽取 `form-theme-action.js` 的主题实现，不复制第三份。
6. 增加 theme runtime 四个方法。
7. 增加 `canvas-base.canvas.jsx`。
8. 增加 14 项 Canvas 定向测试。
9. 保留三个旧 Yida API 全局别名。

### P2：收敛自定义页面路由

1. 根 Skill 默认 Code Canvas。
2. `yida-app` 删除“仅因 this.utils.yida 就切普通 JSX”的判断。
3. `yida-create-page` 同步相同边界。
4. `yida-custom-page` 保留明确 JSX 和实例能力场景。
5. 更新 routing scenarios，覆盖表单和流程 Yida API 仍走 Canvas。
6. 执行 `npm run build:skills` 后检查悟空生成态。

### P3：拆分 `yida-app` workflow

1. 建立 7 个 workflow 文件。
2. 定义 workflow state JSON。
3. 每个节点增加输入、输出、完成条件和错误码。
4. 资源创建节点增加 checkpoint 和幂等保护。
5. `yida-app/SKILL.md` 收缩为入口和索引。
6. 原有详细内容迁移到唯一所有者，不直接删除。

### P4：上线自适应补丁 MVP

1. 只选 3 个高频语义错误：设计缺失、页面状态缺失、数据绑定缺失。
2. 实现 ValidationResult Schema。
3. 实现 patch registry。
4. 实现单次局部 retry。
5. 实现 telemetry。
6. 不引入自动模型升级，先验证补丁机制本身。

### P5：全项目 Skill 去重

1. 运行重复段落报告。
2. 建立规则所有者表。
3. 先清理路由、发布、主题、数据桥、JSX 编码五类高频重复。
4. 历史内容进入 baseline，不一次性大删。
5. CI 阻止新增重复。
6. 逐批降低 Skill 行数和首次加载 token。

### P6：模型路由与离线优化

1. 基于 first-pass、patch recovery 和成本数据建立模型画像。
2. 增加可选强模型升级。
3. 使用 DSPy/ProTeGi 思路离线优化基础 prompt 和补丁。
4. 任何优化都必须通过固定全量补丁基线、无补丁基线和自适应方案三方对比。

## 19. CI 与发布校验

实施后建议新增：

```json
{
  "scripts": {
    "check:skill-duplicates": "node scripts/validate-skill-duplicates.js",
    "check:skill-ownership": "node scripts/validate-skill-ownership.js",
    "check:patches": "node scripts/validate-patch-registry.js",
    "test:canvas-runtime": "jest tests/canvas-runtime.test.js tests/canvas-compile.test.js",
    "eval:adaptive-patches": "node scripts/eval/runner.js --mode adaptive-patches"
  }
}
```

提交前校验顺序：

```bash
node --check lib/app/runtime/canvas-runtime-action.js
node --check lib/app/runtime/canvas-yida-api-methods.js
node --check lib/app/runtime/canvas-theme-runtime.js
npm test -- --runInBand tests/canvas-runtime.test.js tests/canvas-compile.test.js tests/sample.test.js
npm run check:skills
npm run check:skill-duplicates
npm run check:skill-ownership
npm run check:patches
npm run build:skills
npm run check:package
npm run check:ci
```

`npm pack --dry-run` 必须确认：

- 包含 `lib/core/locales/zh.js`。
- 包含 `lib/core/locales/en.js`。
- 不包含未计划进入核心包的其他语言文件。
- 包含 `canvas-base.canvas.jsx`。
- 包含 Canvas runtime 模块。
- 不包含 eval 真实运行产物和缓存。

## 20. 风险与回滚

### 20.1 Canvas 宿主版本差异

风险：不同宜搭页面运行时的 `this.utils.yida` 方法集合可能不同。

处理：

- bridge 初始化时记录每个方法是否可用。
- `ready` 不能只表示 yida 对象存在，还要提供 `availableMethods`。
- 单个方法不可用时只让该方法失败，不让整个 runtime 初始化失败。
- 线上 readback 和 smoke 测试覆盖至少一个表单 API、一个流程 API。

### 20.2 window 污染

风险：过多顶层全局变量和宿主冲突。

处理：

- 主入口只使用 `window.__OPENYIDA_RUNTIME__`。
- 三个旧别名只做兼容，不继续新增更多顶层方法。
- runtime 带 `version`。
- 新版本升级保持向后兼容或显式迁移。

### 20.3 主题重复注入

风险：Canvas 源码复制 helper，外层又自动注入，形成多个 style。

处理：

- style ID 固定为 `yida-global-theme`。
- 新 Skill 默认调用 runtime，不再复制 helper。
- 旧 helper 保留一段迁移期。
- linter 检测 Canvas 源码中的重复主题 helper，给出迁移提示而不是立即阻塞。

### 20.4 自适应机制掩盖真实错误

风险：所有错误都被标记为 retryable，模型不断修补。

处理：

- 错误码必须声明 repairType。
- 资源、权限、登录、并发和目标不一致默认 fatal 或 user action required。
- 总模型重试预算默认一次。
- 第二次失败直接输出证据。

### 20.5 checkpoint 与外部资源重复

风险：局部重试仍然重复创建应用、表单或页面。

处理：

- 每个创建动作后立即写 checkpoint。
- stage retry 只获得只读的上游资源 ID。
- 创建命令增加幂等键或创建前精确同名查询。
- patch prompt 明确禁止重建上游资源。

### 20.6 强模型质量回归

风险：精简 Skill 时删掉强模型实际依赖的信息。

处理：

- 所有删除先进入 quarantine。
- 强模型无补丁基线必须持续运行。
- 页面截图和业务完成度不能只看编译率。
- 任何 token 下降都不能以业务质量下降为代价。

## 21. 全量 Skill 治理优先级表

### 21.1 优先级定义

| 优先级 | 判定标准 | 处理要求 |
| --- | --- | --- |
| P0 | 位于默认完整应用链路、决定技术路由、负责登录/资源定位/发布，或错误会写错真实资源 | 第一批处理；没有完成前不大规模删除其他 Skill 补丁 |
| P1 | 高频业务写操作、复杂领域配置、与多个 Skill 存在边界重叠，或文档体积已经影响加载速度 | P0 稳定后按依赖顺序处理 |
| P2 | 中低频专用能力、读取类能力、平台管理能力或独立场景，错误影响范围相对局部 | 主链路稳定后批量治理 |
| P3 | 低耦合辅助能力，当前描述较清楚且不参与默认应用链路 | 最后治理，主要做描述统一、重复清理和评测补齐 |

### 21.2 实施波次定义

| 波次 | 先后顺序 | 目标 |
| --- | --- | --- |
| W0 | 第 1 步 | 建立 Skill 评测、重复检测、规则所有者和 baseline，避免后续治理没有度量 |
| W1 | 第 2 步 | 完成 Canvas 运行时、页面发布和资源定位基础，先让默认链路具备真实能力 |
| W2 | 第 3 步 | 收敛 Canvas 与普通 JSX 双链路，迁移 legacy 页面能力，清理页面类重复规则 |
| W3 | 第 4 步 | 把 `yida-app` 拆成 workflow，并对齐设计、应用、表单、流程、数据和导航创建顺序 |
| W4 | 第 5 步 | 治理表单、公式、流程规则和权限等高风险业务写操作 |
| W5 | 第 6 步 | 收敛报表、Recharts、ECharts、Dashboard 和 PPT 的分析与可视化边界 |
| W6 | 第 7 步 | 治理连接器、集成、公开访问、平台权限和国际化能力 |
| W7 | 第 8 步 | 治理读取、运维、反馈和内容转换类专用 Skill |
| W8 | 第 9 步 | 全量回归、补丁 shadow、过期规则退役和发布包验证 |

### 21.3 W0：治理基础设施

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 完成标准 |
| --- | --- | --- | --- | --- |
| P0 | `yida-skill-evaluator` | 171 行；description 使用多行 YAML；当前能做静态、路由、安全和覆盖评测，但没有 patch activation、规则所有者和重复段落准出门槛 | 作为治理总入口；增加 `first_pass_success_rate`、补丁命中/恢复、route overlap、重复段落、规则所有者、Skill token 预算、强弱模型矩阵；输出稳定 JSON 报告 | 能对任意 Skill 输出静态问题、路由混淆、规则重复、补丁指标和准出结论；治理前后报告可比较 |
| P0 | `yida-login` | 98 行；登录规则与根 `setup-and-env.md` 有两组完全重复段落；登录是所有写操作前置 | 登录事实只保留一处；Skill 只说明 auth snapshot、OAuth token、env token 三种状态和下一步；环境判断下沉脚本；清理重复英文提示 | 根文档和 Skill 不再复制相同段落；所有 mutation workflow 只消费统一 auth result |

W0 同时处理非 Skill 文件：

- `scripts/validate-skill-duplicates.js`
- `scripts/validate-skill-ownership.js`
- `scripts/validate-patch-registry.js`
- `skill-rule-ownership.json`
- `patches/registry.json`
- 当前全量评测 baseline

### 21.4 W1：Canvas 运行时与发布基础

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P0 | `yida-canvas-custom-page` | 162 行入口，但有 10 个 reference、2117 行参考内容；主题 helper、数据桥、组件桥、代码规则混在一起；仍把 `this.utils.yida.*` 作为切普通 JSX 的理由 | 入口只保留 Canvas 契约、默认路由、输入输出、完成条件；13 个 Yida API 和主题注入下沉 runtime；reference 按运行时、数据、组件、页面实现分组；删除复制型基础设施代码要求 | Canvas runtime、主题 runtime | 新 Canvas 页面无需模型复制桥接代码；仅依赖 `this.utils.yida.*` 仍走 Canvas；入口控制在约 120 行以内 |
| P0 | `yida-canvas-data-binding` | 202 行、无 reference；DataBinding、返回体解析、轮询、totalCount 和桥接代码都在入口 | 将 DataBridge/useYidaData 实现抽成可测试 sample 或 script；入口只保留数据源选择、binding Schema、状态机和失败边界；使用 `window.__OPENYIDA_RUNTIME__.yida` | 完整 13 方法 runtime | 表单、流程、连接器三类 binding 都有结构化契约和测试；模型不再手写返回体兼容代码 |
| P0 | `yida-publish-page` | 194 行；description 只有“自定义页面 JSX 编译发布技能”，没有区分 Canvas/native；发布证据、编译和目标保护与多个 Skill 重复 | 重写直白 description；拆成 Canvas/native 两个确定性 workflow；统一发布目标、revision、readback 和 evidence；完成条件由脚本返回 | publish guard、Schema Builder | description 能正确区分两条发布链；线上 readback 是唯一发布成功证据；其他 Skill 不再复制发布流程 |
| P0 | `yida-openyida-publish-guard` | 89 行，英文 description；和 publish Skill 的目标校验存在职责交叉 | 改成中英文可检索的直白边界；作为 publish 的强制 preflight 节点，不要求模型单独决定是否加载；输出 revision、线上变更摘要和冲突错误码 | 发布 API readback | 旧页面发布都经过 guard；冲突时停止，不自动 force；Skill 本身不重复 publish 步骤 |
| P0 | `yida-create-page` | 83 行；创建后链路判断仍把 `this.utils.yida.*` 导向普通 JSX；只创建资源但完成条件容易被误解为页面已完成 | 创建动作保持薄；输出 page formUuid 和 URL；默认明确进入 Canvas；只有明确 JSX/实例能力才进入普通页；创建后不能宣称页面交付完成 | Canvas runtime 可用 | 路由测试中“Canvas 调表单/流程 API”不再误进普通 JSX；创建与实现/发布状态分离 |
| P0 | `yida-get-schema` | 181 行；fieldId 取证规则高频重复；部分字段级命令已有内置解析，Skill 仍可能引导重复拉完整 Schema | 拆成 compact field map 默认路径和 full Schema 排障路径；脚本返回字段候选、歧义和缓存 hash；其他 Skill 只引用字段解析契约 | 无 | 同一表单单阶段最多一次 Schema 拉取；字段歧义有结构化 candidates；不再用 grep/head 截断取证 |
| P0 | `yida-form-detail` | 113 行、2 个 reference；frontmatter 含非根发布兼容字段；视觉引导、Divider、主题注入和详情 CSS 混合 | 保留表单语义分组和 formDetail 视觉规则；主题基础设施改调用统一 theme runtime；CSS 生成进入 script；明确只作用于真实 formUuid | theme runtime | 表单视觉规则和主题运行时代码分离；重复注入只产生一个 style；入口 frontmatter 与发布规范兼容 |

### 21.5 W2：页面双链路收敛与 legacy 隔离

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P0 | `yida-custom-page` | 252 行、6 个 reference、2110 行参考；43 处“必须/禁止”；普通 JSX、组件、上传、设计、编码指南和 Canvas 边界负担过重 | 触发条件收敛到明确 JSX、历史 Jsx、`this.$`、dataSourceMap、renderJsx/实例生命周期；保留普通 JSX Skill 但标记 legacy/native；编码细节继续下沉 reference/script；不因 Yida API 单独触发 | W1 Canvas runtime | 默认新页面路由不进入本 Skill；历史 JSX 维护仍有完整指南；入口强约束数量显著下降 |
| P1 | `yida-canvas-upgrade` | 98 行、1 个 reference；职责较清楚，但迁移完成条件没有统一使用新的 runtime | 增加迁移检查器：实例能力扫描、API 替换、主题 helper 替换、编译、发布和 readback；产出不可迁移项 | Canvas/native 契约稳定 | 对 `.oyd.jsx` 输出可迁移/需保留 native 的确定性报告；迁移后不残留复制型桥代码 |
| P1 | `yida-data-source-connectors` | 176 行；明确 native dataSourceMap，但容易被完整应用流程误加载 | description 强化“仅普通 JSX 设计器数据源”；和 Canvas data binding 建立互斥 signals；把 Schema patch 放脚本 | 路由索引支持 negative signals | Canvas 场景路由命中率不受本 Skill 干扰；native dataSource 写入有 Schema 校验和 readback |
| P1 | `yida-canvas-table-form` | 151 行；仍消费旧 `window.__OPENYIDA_YIDA_API__`；与 `yida-rechart` 重复 cwd 段落；提交、并发、错误保留代码适合模板化 | 切统一 runtime；把批量提交器、并发限制、行错误合并做成 sample/script；入口只保留批量录入契约；删除重复 cwd 说明 | Canvas runtime、data binding | 默认批量录入只走 Canvas；失败行不会丢失；模板能编译；入口不复制通用 Canvas 说明 |
| P1 | `yida-table-form` | 156 行、1 个 reference；和 Canvas table form 功能重叠，容易形成双默认 | 明确 legacy/native，仅用于用户明确普通页面或现有 Jsx；共享业务契约但不复制实现；增加迁移提示 | Canvas table form 稳定 | 路由默认命中 Canvas 版本；普通版本保持可维护；两者完成条件一致但技术实现分离 |
| P1 | `yida-density` | 158 行；同时给 Canvas 和普通页示例，链路无关规则与技术代码混合 | 保留密度决策表；Canvas/legacy 实现分别链接对应 Skill；把切换组件做成 sample；避免在入口并列两套完整代码 | 页面链路收敛 | 同一密度语义只有一份；默认只展示 Canvas 实现；普通页只保留 legacy 链接 |
| P1 | `yida-nav-shell` | 161 行、1 个 reference；frontmatter 多行；仍强调“双链路都支持”，与单链路目标冲突 | 默认只描述 Canvas 隐藏导航壳；普通 `_customState/renderJsx` 移入 legacy reference；增加“没有隐藏平台导航就不触发”负向信号 | Canvas 路由完成 | 平台导航、页面内 tabs、隐藏导航壳三种意图区分稳定；新页面不出现双实现选择 |

### 21.6 W3：完整应用 workflow 与资源创建

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P0 | `yida-app` | 330 行、35 处强约束；只有一个 142 行 contract reference；路由、设计、创建、seed、页面、发布和 final 全部混在入口 | 按本文拆成 7 个 workflow；入口只保留触发、全局状态和索引；每步有输入/输出/校验器/checkpoint；补丁只重跑失败节点 | W1/W2 页面链路稳定 | 完整应用可从 checkpoint 恢复；入口显著变薄；强弱模型都按相同状态机执行 |
| P0 | `yida-design` | 99 行入口但下挂 workflow、模板和大量 style designs；description 多行；设计事实与页面实现边界总体正确，但模板选择、主题和输出校验需要更确定 | 保留设计唯一事实源；增加设计 manifest 和页面级 design 引用；style registry 做机器索引；代码编写内容全部移出；输出 validator 检查 PRD/design 完整性 | W0 validator | `prd.md` 与 `design.md` 职责明确；每页有 design 引用；样式模板不会把示例业务文案带入目标应用 |
| P0 | `yida-page-design` | 57 行嵌套子 Skill；路径和相对引用较深；和 `yida-design` 的单页分支存在选择重叠 | 改为 `yida-design` workflow 节点或明确注册的子流程；不作为和主 Skill 平级的模糊路由候选；保留主题证据和 functionContract | yida-design manifest | 单页美化只经过一个设计入口；已有功能契约不会因视觉改造被重写 |
| P0 | `yida-create-app` | 122 行；职责本应只创建壳，但仍承担后续设计交接说明；错误使用会重复建 app | 保持显式授权和精确同名查重；增加 idempotency/checkpoint；只返回 appType、URL、主题 key 和证据；不承担完整应用入口 | context workflow | 同标题重复创建率为 0；已有 appType 时不触发；输出可直接写 workflow state |
| P0 | `yida-create-form-page` | 273 行、6 个 reference、1412 行参考、35 处强约束；字段、布局、详情样式、联动和数据源职责过多 | 拆成 form schema、layout、validation、datasource 四个 workflow/reference；字段 JSON 使用 Schema 校验；默认视觉调用 form-detail；写入后 readback | get-schema、form-detail | 新建和更新路径分离；字段、布局和规则错误有稳定错误码；入口控制在编排层 |
| P0 | `yida-create-process` | 217 行；创建表单、转流程、配置规则一体化，重试容易重复资源 | 拆为 create/reuse form、convert process、configure minimal rule、publish/readback 四节点；每步 checkpoint；已有流程直接转 process-rule | workflow checkpoint | 任一步失败可恢复；不会重复创建表单；输出 processCode/formUuid 均有回读证据 |
| P0 | `yida-data-management` | 291 行、3 个 reference、34 处强约束；表单、子表、流程、任务中心混在一个入口 | 入口改为操作路由；四类数据操作分别 reference/script；统一分页、实例 ID、字段映射和错误结构；写操作幂等 | get-schema、auth | 表单/流程端点不会混用；写操作返回真实实例 ID；查询和 mutation 契约分离 |
| P1 | `yida-nav-group` | 114 行、10 个代码块；导航创建、移动、排序、显示隐藏都在一个入口，但职责尚清楚 | 保留操作矩阵，命令示例下沉 reference；自动排序算法由脚本实现；完整应用只消费 PRD 导航顺序 | yida-app blueprint | 导航排序结果可回读；自动排序有摘要和 warning；不由模型手拼顺序 |

### 21.7 W4：表单、公式、流程和权限

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P1 | `yida-formula` | 426 行、23 个代码块，接近 500 行阈值；60+ 函数速查占据入口 | 入口只保留语法、字段引用和场景路由；函数目录移 reference 并生成索引；公式示例进入可执行 evaluator fixtures | formula evaluator | 函数可按名检索；入口不加载完整速查；示例都能被 evaluator 解析 |
| P1 | `yida-formula-evaluate` | 68 行；职责清晰但只覆盖静态检查，和 formula 缺少自动反馈闭环 | 作为公式 validator；输出稳定错误码、字段候选和修复建议；由 formula Skill 失败后调用 | get-schema | 公式生成后自动校验；错误定位到 token/fieldId；不靠模型肉眼复核 |
| P1 | `yida-business-rule` | 127 行；与 integration 的跨表写入意图重叠 | description 增加“用户明确要求业务关联规则/高级函数”边界；操作类型和字段映射结构化；默认跨表自动化仍路由 integration | integration 路由 | 高频分歧评测稳定；INSERT/UPDATE/DELETE/UPSERT 写入后可回读 |
| P1 | `yida-process-rule` | 456 行、3 个 reference、14 个代码块；超过适合入口承载的复杂度；节点、分支、审批人、字段权限混合 | 拆成 node、branch、assignee、field permission、publish 五个 workflow；流程图/规则 JSON 用 Schema 校验；高风险修改先 diff | create-process checkpoint | 每类规则可独立修改和验证；入口低于约 150 行；发布前后有流程 revision/diff |
| P1 | `yida-form-permission` | 121 行；成员、数据、操作和字段权限均会影响真实访问 | 增加 read-before-write、权限 diff、最小权限和回滚摘要；成员解析下沉脚本 | get-schema、auth | 每次修改先展示 compact diff；字段权限使用真实 fieldId；写后回读一致 |
| P1 | `yida-app-permission` | 83 行；职责清楚，但管理员角色修改风险高 | description 保持直白；增加 read-before-write、角色枚举校验和不可移除最后管理员护栏 | auth/context | 角色修改有 before/after；最后主管理员不会被自动移除 |
| P2 | `yida-agent-center` | 123 行；代理范围和流程范围组合复杂，但不在默认应用链路 | 参数结构化；区分在职/离职代理；日期、人员和流程范围先校验；撤销操作 readback | process context | 不会把全部流程代理误配成部分范围；撤销结果可验证 |

### 21.8 W5：报表与可视化

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P1 | `yida-report` | 279 行、3 个 reference、658 行参考；description 只有“创建宜搭原生报表”，无法区分创建/追加/普通统计 | description 写清原生报表、数据集、图表追加和不处理 ECharts/Recharts；Schema builder 成为唯一实现；示例下沉 | 数据字段契约 | 普通统计稳定命中 report；创建/追加均有 readback；不误路由到 dashboard |
| P1 | `yida-rechart` | 132 行；默认高级图表定位较清楚，但和 Canvas table 重复 cwd 说明，数据聚合边界散落 | 删除通用重复段落；图表配置用 sample/validator；只保留 Recharts 适用边界和聚合数据契约 | Canvas runtime | 默认高级图表命中 Recharts；sample 可编译；不在前端拉全量明细聚合 |
| P1 | `yida-chart` | 167 行、4 个 reference、1055 行参考；ECharts、原生报表接口、旧页面示例混合 | 明确只用于 ECharts/复杂 option/legacy；新 Canvas ECharts 与旧 native 示例分开；公共自定义状态示例只保留一份 | report、Canvas 路由 | Recharts 能覆盖时不触发；ECharts 数据只读聚合接口；重复代码示例被抽取 |
| P1 | `yida-dashboard` | 192 行、4 个 reference、1684 行参考；把产品设计、报表、Recharts、真实数据、截图、分享和待办全部编排在一个 Skill | 拆成 dashboard workflow，复用 design/report/rechart/page-config；入口只保留产品化看板完成条件；可选待办不默认加载 | design、report、rechart | Dashboard 不复制下游技能规则；真实数据、筛选、发布和验收各有节点证据 |
| P2 | `yida-ppt-slider` | 218 行、3 个 reference、948 行参考；Canvas 与 legacy 示例并存；dark-tech 等固定风格容易泄漏 | 默认只保留 Canvas；legacy 移 reference；主题来自 design，不固定 dark-tech；键盘/全屏/cleanup 下沉 sample | Canvas runtime、design | 新 PPT 页面只有一条实现链；示例不带固定业务/主题泄漏；副作用测试通过 |

### 21.9 W6：连接器、集成、访问和国际化

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P1 | `yida-connector` | 159 行、1 个 reference；6 种鉴权、连接、动作和测试边界较多 | 入口只编排连接器生命周期；鉴权 Schema、secret redaction 和测试进入脚本；创建与 action 管理解耦 | auth、安全护栏 | 凭证不出现在日志/Skill；创建、连接、动作、测试各有结构化结果 |
| P1 | `yida-connector-safe-actions` | 286 行、13 个代码块；从代码解析 API、生成动作、测试后保留动作等实现细节过多 | 抽成 parser/generator 脚本；Skill 只说明输入文件、目标连接器、预览 diff、应用和验证；默认 dry-run | connector | 前后端代码解析有 fixtures；动作不会因测试消失；写入前有 diff |
| P1 | `yida-integration` | 382 行、2 个 reference、518 行参考；description 只有“创建/管理宜搭集成自动化”，路由信息严重不足；文件很长 | 重写 description，区分集成自动化与业务关联规则/连接器；拆 create、enable、disable、inspect、delete 和节点配置 workflow；写操作加 revision | connector、business-rule 边界 | 路由混淆率下降；入口低于约 150 行；每个动作有 readback 和可恢复错误 |
| P1 | `yida-page-config` | 116 行；description 只有“配置已有页面的公开访问和组织内分享”，缺少风险和前置边界 | 说明只处理已有页面；公开访问是高风险动作，默认 read current config、展示 diff、明确目标范围；短链验证脚本化 | publish/readback | 不会误创建页面；公开范围改变可回读；短链和组织内链接区分清楚 |
| P1 | `yida-i18n` | 153 行、14 个代码块；应用语言管理与 npm CLI 语言包容易混淆 | description 明确“宜搭应用多语言”，不等于 OpenYida npm locale；命令示例下沉；核心包 zh/en 和可选语言包策略写入独立 contract | package validator | 应用 i18n 路由不影响 CLI locale；npm dry-run 能证明只含 zh/en 核心语言 |
| P2 | `yida-corp-manager` | 78 行；平台管理员和通讯录权限属于高影响但低频操作 | 增加平台级风险提示、read-before-write、不能自动扩大通讯录可见范围；角色枚举脚本化 | auth/context | 修改前后有 diff；平台与应用管理员不混用；危险开关需要明确授权 |

### 21.10 W7：上下文、读取、运维和反馈

| 优先级 | Skill | 当前证据与问题 | 具体治理动作 | 前置依赖 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P2 | `yida-basic-info` | 138 行、9 个代码块；组织版本、容量、域名和额度都属于只读上下文 | 命令示例下沉；输出统一 context snapshot；标记只读，不与 corp-manager 混用 | auth | 一次调用返回 compact 组织事实；不产生 mutation；可供其他 workflow 复用 |
| P2 | `yida-corp-efficiency` | 100 行；description 多行；职责清楚但效能概览、明细和通知群混在入口 | 保留只读指标查询，通知群设置单列 mutation 并加授权；description 转单行可索引形式 | basic-info | 查询默认只读；通知配置不会被普通“查看效能”意图触发 |
| P2 | `yida-db-seq-fix` | 110 行；独立运维 Skill，触发边界清楚，但修复数据库属于高风险 | 默认 diagnose/dry-run；真实修复需明确授权；输出 SQL/sequence before-after 和回滚提示 | 数据库连接校验 | 未授权只诊断；修复后重新检测；不会扫描或修改无关 sequence |
| P2 | `yida-document-markdown` | 47 行；职责很薄且清楚，但和通用钉钉文档 connector 能力可能重复 | 保留为 OpenYida 内的文档读取入口；明确只读、完整 Markdown、分页/长度处理；不复制 MCP 说明 | 文档 connector | 给链接时稳定读取全文；不使用浏览器；内容完整性可校验 |
| P2 | `yida-flash-note-to-prd` | 312 行、4 个 reference、530 行参考；听记读取、内容识别、PRD 模板和质量规则混合 | 明确只消费已有文本；taskUuid 读取交给 tingji；PRD 结构复用 design/PRD contract；模板和评分下沉 | tingji、design contract | taskUuid 链路只读取一次；生成 PRD 有结构化完整度报告；入口显著变薄 |
| P2 | `yida-tingji` | 46 行；职责薄且边界清楚 | 保持只读；补充 taskUuid 格式错误和内容未就绪错误码；不加入 PRD 逻辑 | auth | 只返回完整听记内容和元信息；未就绪状态明确，不自动生成需求 |
| P2 | `yida-logout` | 69 行；简单但属于破坏本地登录态操作 | 明确只有切账号/组织/重置 token 才触发；执行前输出当前 session 摘要；完成后 check-only 验证 | login contract | 不会因普通登录故障自动 logout；清理后状态确认为 not_logged_in |
| P3 | `yida-export-conversation` | 125 行；低耦合，职责较清楚 | description 保持；把环境检测和输入解析交给脚本；补输出文件校验和 secret redaction | 无 | 导出 Markdown 可解析；凭证和隐私字段被过滤；不影响主应用路由 |
| P3 | `yida-voc` | 151 行；低耦合，偏内容整理；目前和故障修复意图可能混淆 | description 增加“不负责修复故障”；输出固定为现象、影响、复现、证据、期望、优先级；敏感信息过滤 | 无 | “修问题”不会命中 VOC；“整理反馈”输出可直接提交且不泄露凭证 |

### 21.11 全量覆盖核对

上述表格覆盖：

- 50 个 `yida-skills/skills/<name>/SKILL.md` 直接子 Skill。
- 1 个嵌套子 Skill：`yida-design/sub_skill/page-design/SKILL.md`。
- 合计 51 个子 Skill。
- 根 `yida-skills/SKILL.md` 不计入 51 个子 Skill，但在 W0、W1、W2、W3 中随路由和索引同步治理。

优先级数量：

| 优先级 | Skill 数量 | 主要范围 |
| --- | ---: | --- |
| P0 | 17 | 评测、登录、Canvas、发布、完整应用、设计、资源创建、Schema、数据 |
| P1 | 22 | 页面扩展、表单流程、权限、报表、连接器、集成、公开访问、国际化 |
| P2 | 10 | 代理、平台管理、PPT、组织上下文、运维和内容读取转换 |
| P3 | 2 | 对话导出、VOC 整理 |
| 合计 | 51 | 全部子 Skill |

## 22. 严格实施顺序

下面顺序不是建议并行的大列表，而是实际落地时的先后依赖。

### 第 1 步：冻结新增补丁并建立 baseline

先做：

1. 暂停向任意 `SKILL.md` 直接追加新的事故补丁。
2. 保存当前 51 个 Skill 的行数、description、reference 数、规则密度和路由评测结果。
3. 建立重复段落 baseline。当前按“80 字以上、跨文件完全相同、排除标题/表格/代码块”的扫描口径发现 7 组重复，其中包含登录环境提示、Canvas cwd 提示、设计模板声明和历史自定义状态示例。
4. 建立规则所有者表。
5. 升级 `yida-skill-evaluator`。

这一阶段不改变生产路由，不删除规则。

### 第 2 步：先完成 Canvas 基础设施

严格按以下顺序：

1. 完成 13 个 Yida API 方法清单。
2. 修正搜索类与非搜索类参数归一化。
3. 建立 `window.__OPENYIDA_RUNTIME__.yida`。
4. 建立 `window.__OPENYIDA_RUNTIME__.theme`。
5. 复用现有 `form-theme-action.js`，不能复制第三份主题实现。
6. 增加 `canvas-base.canvas.jsx`。
7. 完成 Canvas runtime 定向测试。
8. 完成 publish/readback 测试。

此阶段完成前，不修改根 Skill 把所有 `this.utils.yida.*` 请求导向 Canvas。

### 第 3 步：再切换页面路由

严格按以下顺序：

1. 更新 `yida-canvas-custom-page`。
2. 更新 `yida-canvas-data-binding`。
3. 更新 `yida-publish-page` 与 publish guard。
4. 更新 `yida-create-page`。
5. 收窄 `yida-custom-page` 触发条件。
6. 更新 `yida-canvas-upgrade`。
7. 更新 table form、density、nav shell 和 native datasource 边界。
8. 最后更新根 `yida-skills/SKILL.md` 和 `skills-index.json`。
9. 运行强弱模型路由回归。

### 第 4 步：拆 `yida-app` workflow

严格按以下顺序：

1. 固化 workflow state Schema。
2. 拆 `resolve-context`。
3. 对齐 `yida-design` 和 `yida-page-design`。
4. 接入 create/reuse app。
5. 接入 create/reuse form/process。
6. 接入 seed data 和真实实例 ID。
7. 接入 reserve/build Canvas page。
8. 接入 publish/nav/readback。
9. 接入 deliver summary。
10. 最后收缩 `yida-app/SKILL.md`。

不要先删 `yida-app` 正文再补 workflow，否则会产生能力空窗。

### 第 5 步：治理高风险业务写操作

顺序：

1. `yida-formula-evaluate`，先有校验器。
2. `yida-formula`，再缩入口。
3. `yida-business-rule` 与 `yida-integration` 的路由边界。
4. `yida-create-process` 与 `yida-process-rule`。
5. form/app permission。
6. agent center。

所有写操作先实现 read-before-write、diff 和 readback，再删 prompt 防御说明。

### 第 6 步：治理分析和可视化

顺序：

1. `yida-report` 作为普通统计事实源。
2. `yida-rechart` 作为默认高级图表。
3. `yida-chart` 只保留 ECharts/复杂 option/legacy。
4. `yida-dashboard` 改成组合 workflow。
5. `yida-ppt-slider` 跟随 Canvas 和 design contract。

### 第 7 步：治理集成、访问和国际化

顺序：

1. connector 基础生命周期。
2. connector safe actions parser/generator。
3. integration workflow。
4. business-rule 高频分歧回归。
5. page config 和 corp manager 风险护栏。
6. app/form permission 交叉回归。
7. 应用 i18n 与 npm locale 分离。

### 第 8 步：治理专用 Skill

顺序：

1. basic-info、corp-efficiency。
2. document-markdown、tingji。
3. flash-note-to-prd。
4. db-seq-fix、logout。
5. export-conversation、VOC。

这些 Skill 不阻塞默认完整应用链路，所以放在主链路之后。

### 第 9 步：补丁退役和正式准出

最后执行：

1. 全量 `check:skills`。
2. 重复段落 baseline 棘轮。
3. 51 个 Skill 路由场景回归。
4. 真实资源 mutation smoke。
5. 强模型无补丁基线。
6. 弱模型补丁恢复基线。
7. npm 包 zh/en 内容检查。
8. 悟空 `build:skills` 生成态检查。
9. patch shadow 观察。
10. 删除确认过期的规则和补丁。

## 23. 每个 Skill 的统一准出门槛

任何一个 Skill 完成治理，都必须同时满足以下条件，不能只看文档变短。

| 维度 | 准出要求 |
| --- | --- |
| Description | 直白回答“做什么、何时触发、输入、相邻不触发边界”；机器索引能读取完整值 |
| 路由 | 正向场景命中，至少两个相邻 Skill 负向场景不误命中 |
| 入口长度 | 入口只保留选择、输入、输出、流程、完成条件和高风险边界；详细知识进入 reference/script |
| 规则所有者 | 每条跨 Skill 规则只有一个所有者；其他位置只引用 |
| 可执行代码 | 平台注入、参数归一化、Schema patch、解析和校验进入 script/lib，不靠模型复制 |
| 错误结构 | mutation 和 validator 返回稳定错误码、证据、位置、retryable 和 repairType |
| 重试范围 | 只能重跑失败节点；已有资源 ID 和已通过产物必须保留 |
| 安全 | 登录、corpId、目标资源、权限、revision、危险操作和 secret 处理有确定性护栏 |
| Readback | 真实写操作必须回读；本地成功不能冒充线上成功 |
| 评测 | 强模型首轮、弱模型首轮、自适应补丁、固定全量补丁四组结果可比较 |
| 发布态 | 源码态 `check:skills`、悟空 `build:skills`、npm `check:package` 都通过 |
| 退役记录 | 删除的补丁有历史错误样本、shadow 结果和退役理由 |

## 24. 最终推荐

OpenYida 不应采用“所有模型永远加载同一套超长防御 Skill”，也不应采用“强模型不需要校验”。推荐的最终形态是：

1. `yida-app` 是唯一完整应用编排入口，并拆成 7 个 workflow 节点。
2. Code Canvas 是新自定义页面唯一默认链路。
3. 普通 JSX Skill 保留，但只服务明确 JSX、历史页面和真正的实例能力。
4. `this.utils.yida` 的 7 个表单方法和 6 个流程方法由外层发布 Schema 自动注册到 window runtime。
5. 主题注入也由同一 runtime 提供，不让模型复制 helper。
6. `canvas-base.canvas.jsx` 只提供 theme 和 yida runtime 接入，业务功能按需求追加。
7. 不可逆安全规则始终前置。
8. 语法、Schema、注入、打包和 API 方法清单由确定性代码保证。
9. 语义问题使用错误码驱动的最小补丁，并且只局部重试一次。
10. 补丁有版本、指标、负责人、退役条件和 quarantine。
11. 在线机制使用 validator + deterministic repair + targeted retry。
12. 离线机制使用固定评测集、DSPy/ProTeGi 类优化和 RouteLLM/FrugalGPT 类成本路由。

这套方案的判断标准不是 Skill 行数是否变少，而是同时满足：

- 强模型首次执行更快。
- 弱模型失败后可恢复。
- 模型不用手写平台基础设施代码。
- 同一规则只有一个事实源。
- 外部资源不会因重试重复创建。
- 每次失败都有稳定错误码和证据。
- 每个历史补丁都有退出路径。

## 25. CLI、Reference 与 Workflow 全量补充审计

### 25.1 对上一版覆盖范围的纠正

上一版已经逐项覆盖 51 个子 Skill，但“51 个子 Skill 已覆盖”不等于“OpenYida 的全部 Agent 能力面已经覆盖”。完整治理还必须把 CLI 能力清单、共享 reference、Skill 专属 reference、设计 workflow 和模板文件纳入同一张依赖图。

本轮按当前仓库重新盘点后的真实基线如下。

| 对象 | 当前数量 | 事实源 | 上一版状态 | 本轮结论 |
| --- | ---: | --- | --- | --- |
| 根 Skill 入口 | 1 | `yida-skills/SKILL.md` | 已讨论路由，但没有作为独立治理对象计数 | 纳入入口、reference 索引和 CLI discovery 治理 |
| 子 Skill 入口 | 51 | `yida-skills/skills/**/SKILL.md` | 已逐 Skill 建表 | 保留上一版 P0-P3 和 W0-W8 结论 |
| 共享 reference | 11 | `yida-skills/references/*.md` | 只零散提到，未逐文件治理 | 本轮逐文件补齐所有者、消费者、治理动作和优先级 |
| Skill 专属 reference | 83 | `yida-skills/skills/*/references/**/*.md` | 大 Skill 行中只统计了部分数量 | 本轮按所有者完整列出 83 个文件和治理方向 |
| workflow/template Markdown | 9 | `yida-design/workflow/*.md`、`yida-connector/templates/*.md` | 未单列 | 本轮纳入生成链路和一致性校验 |
| 全部 Markdown | 155 | `find yida-skills -name '*.md'` | `check:skills` 已扫描基础格式 | 需要新增链接、所有者、重复和消费关系校验 |
| CLI manifest 能力 | 99 | `lib/core/command-manifest.js` | 只按个别 Skill 使用场景提到 | 本轮按 10 个命令域全量列出，并补未被文档消费的 22 个能力 |

当前三个现有校验都通过：

```bash
npm run check:commands
npm run check:docs
npm run check:skills
```

通过结果分别证明：

- 99 个 manifest entry 与 `bin/yida.js` 路由、README 命令表对齐。
- README 和 README_zhCN 的生成命令表没有漂移。
- 155 个 Markdown 满足现有 Skill 基础结构要求。

它们目前不能证明：

- 每个 CLI 命令都有明确的 Skill/workflow 所有者。
- 每个远程写命令都有幂等、readback、局部重试和补丁策略。
- Skill 中写出的命令一定来自 manifest，而不是旧文档复制。
- 每个 reference 路径真实存在。
- 每个 reference 都有明确消费者，而不是只挂在根索引里等待模型自行发现。
- 同一事实没有同时出现在 manifest、根 Skill、子 Skill 和 reference 中。

### 25.2 本轮发现的确定性缺口

| 缺口 | 当前证据 | 风险 | 优先级 |
| --- | --- | --- | --- |
| CLI 与 Skill 没有机器可读所有权关系 | manifest 有 99 个 entry，但没有 `owner_skill_id`、`workflow_node_id`、`validator_id` | 模型看到命令却不知道应加载哪个领域契约；新增命令也可能没有 Skill 接管 | P0 |
| manifest 内嵌长篇 Skill policy | `core_workflows.full_app_build` 直接保存页面路由、设计、导航、最终链接等长字符串 | 同一规则在 CLI manifest 与 Skill 中形成双事实源 | P0 |
| manifest 页面路由与目标方案冲突 | `page_skill_policy` 仍把依赖 `this.utils.yida.*` 作为进入 `yida-custom-page` 的条件 | Code Canvas 默认单链路会被 CLI capability prompt 拉回普通 JSX | P0 |
| manifest 默认数据契约仍使用旧调用表达 | `default_data_contract` 仍要求默认页面使用 `this.utils.yida.*` | 没有指向统一 `window.__OPENYIDA_RUNTIME__.yida`，模型仍可能手写桥 | P0 |
| 22 个 CLI 能力在全部 155 个 Markdown 中没有出现 | 本文 26.2 列表 | 能力存在但 Agent 不知道何时用，或内部命令没有声明为 infrastructure-only | P1 |
| 3 条 reference 路径失效 | 本文 27.3 列表 | 模型按文档加载时读不到目标文件，强弱模型都会走猜测路径 | P0 |
| 共享 reference 多数只有根索引引用 | 11 个共享文件中多个没有子 Skill 直接消费者 | 子 Skill 被单独加载时无法确定需要补读哪些事实 | P1 |
| `check:skills` 未检查 reference 文件存在性 | 3 条失效路径仍然通过 155 文件校验 | 发布包可能带着不可达文档通过 CI | P0 |

## 26. CLI 能力全量治理表

### 26.1 99 个 CLI manifest entry 全量清单

所有命令仍以 `lib/core/command-manifest.js` 为命令名、参数、权限和副作用的唯一事实源。Skill 不再复制完整参数表，只引用命令 ID、输入产物、输出产物和业务完成条件。

| 命令域 | 数量 | 全部 command ID | 主要 Skill/workflow 所有者 | 当前缺口 | 优先级 |
| --- | ---: | --- | --- | --- | --- |
| auth | 5 | `login`、`logout`、`auth`、`org`、`env` | `yida-login`、`yida-logout`、`setup-and-env` | `org` 没有任何 Markdown 消费；登录/环境规则在根 Skill、login Skill、reference 和 manifest 重复 | P0 |
| app | 9 | `app-list`、`corp-efficiency`、`create-app`、`update-app`、`nav-group`、`app-permission`、`i18n`、`export`、`import` | `yida-app`、`yida-create-app`、`yida-corp-efficiency`、`yida-nav-group`、`yida-app-permission`、`yida-i18n` | `import` 完全未被消费；`update-app`、应用导入导出和主题更新没有稳定 Skill 所有者 | P1 |
| form | 23 | `create-form.create`、`create-form.validate-fields`、`create-form.update`、`create-form.patch`、`create-form.rule`、`create-form.validation`、`add-validation`、`create-form.bind-datasource`、`create-form.add-option`、`list-forms`、`aggregate-table`、`get-schema`、`er`、`create-page`、`build-page`、`check-page`、`compile`、`publish`、`update-form-config`、`get-form-config`、`form-detail-style.apply`、`form-detail-style.remove`、`form-detail-style.check` | `yida-create-form-page`、`yida-get-schema`、`yida-create-page`、`yida-canvas-custom-page`、`yida-custom-page`、`yida-publish-page`、`yida-form-detail` | 校验、ER、聚合表、构建和配置读取的所有权不完整；页面命令仍跨 Canvas/native 双链路重复说明 | P0 |
| data | 9 | `data`、`task-center`、`basic-info`、`read-dingtalk-doc`、`read-dingtalk-tingji`、`get-permission`、`save-permission`、`corp-manager`、`agent-center` | `yida-data-management`、`yida-basic-info`、`yida-document-markdown`、`yida-tingji`、`yida-form-permission`、`yida-corp-manager`、`yida-agent-center` | `task-center` 没有文档消费；`data` 顶层混合查询、创建、更新、删除，需要 action 级 retry/readback | P1 |
| process | 4 | `configure-process`、`create-process`、`ai-form-setting`、`process.preview` | `yida-process-rule`、`yida-create-process` | `process.preview` 完全未消费；`ai-form-setting` 只在根索引出现，没有领域 workflow | P1 |
| share | 4 | `verify-short-url`、`save-share-config`、`get-page-config`、`externalize-form` | `yida-page-config` | `externalize-form` 完全未消费；公开访问、组织内分享、外部提交三种风险没有统一矩阵 | P1 |
| report | 2 | `create-report`、`append-chart` | `yida-report` | 创建和追加需要同一 report revision/readback；参数说明不能继续分散在 Skill 和 reference | P1 |
| connector | 13 | `connector.list`、`connector.create`、`connector.detail`、`connector.delete`、`connector.add-action`、`connector.list-actions`、`connector.delete-action`、`connector.test`、`connector.list-connections`、`connector.create-connection`、`connector.smart-create`、`connector.parse-api`、`connector.gen-template` | `yida-connector`、`yida-connector-safe-actions` | 13 个能力已有领域入口，但 parser、生成、secret、删除和测试策略需要 machine contract | P1 |
| integration | 9 | `integration.create`、`integration.list`、`integration.enable`、`integration.disable`、`integration.check`、`integration.diagnose`、`dws`、`dws.contact-user-search`、`dingtalk-link` | `yida-integration`；DWS 和钉钉链接属于跨产品基础能力 | `integration.list`、`dws`、`dws.contact-user-search`、`dingtalk-link` 没有完整消费归属；不能把外部 DWS 使用说明塞进 integration Skill | P1 |
| utility | 21 | `commands`、`agent-capabilities`、`mcp`、`a2a`、`bridge`、`copy`、`sample`、`doctor`、`eval`、`db-seq-fix`、`formula.evaluate`、`update`、`export-conversation`、`feedback`、`batch`、`flash-to-prd`、`ai`、`asset`、`cdn-config`、`cdn-upload`、`cdn-refresh` | 根 Skill、`setup-and-env`、`yida-skill-evaluator`、`yida-db-seq-fix`、`yida-formula-evaluate`、`yida-export-conversation`、`yida-flash-note-to-prd`、设计素材 workflow | 既有 Agent discovery，也有本地服务、评测、素材、反馈和 CDN；必须标记 user-facing、workflow-internal 或 infrastructure-only | P0 |

当前 manifest 的副作用与权限基线：

| 维度 | 数量 | 治理含义 |
| --- | ---: | --- |
| `local_read` | 7 | 可直接执行，但输出仍需稳定 JSON |
| `local_write` | 13 | 需要工作目录、产物路径和覆盖策略 |
| `remote_read` | 17 | 需要 auth/corp/app 上下文，但不应触发 mutation 补丁 |
| `remote_write` | 35 | 必须具备目标确认、幂等、revision/readback 和局部重试 |
| `mixed` | 27 | 不能只看顶层命令；必须按 action 判断 read、write、destructive |
| permission `read` | 24 | 默认可执行，仍需敏感信息过滤 |
| permission `write` | 42 | 非删除写操作，不能因为 `mode=allow` 就省略业务 readback |
| permission `external` | 4 | 登录、更新或外部调用，需要环境和网络错误分类 |
| permission `unknown` | 27 | 必须消费 `read_actions`、`ask_actions`、`unknown_action_mode`，禁止模型自行猜测 |
| permission `destructive` | 2 | 始终前置确认，不进入自适应弱模型补丁 |

### 26.2 22 个在全部 Markdown 中没有出现的 CLI 能力

“没有出现”不代表全部都要新建 Skill。有些命令应作为 workflow 内部节点，有些应明确声明为 infrastructure-only。关键是不能继续保持无所有者状态。

| 优先级 | command ID | 建议所有者 | 当前能力定位 | 治理动作 | 完成标准 |
| --- | --- | --- | --- | --- | --- |
| P0 | `org` | `yida-login` / `setup-and-env` | 组织查询与切换 | 把 corp 选择变成 preflight context 节点；多组织时只输出候选，不替用户猜 | 所有 mutation checkpoint 都带已验证 corpId |
| P1 | `import` | 新增 `yida-app-migration` 或 `yida-app` 的 migration workflow | 从迁移包重建应用 | 与 `export` 成对管理；增加包校验、冲突预览、资源映射和 readback | 导入前有 dry-run，导入后有资源清单和失败节点 |
| P0 | `create-form.validate-fields` | `yida-create-form-page` | 本地字段 JSON 校验 | 设为创建/更新前的确定性 validator，弱模型失败先自动 repair JSON | 未通过 validator 不发远程创建请求 |
| P1 | `add-validation` | `yida-create-form-page` | 为字段增加校验规则 | 纳入 validation workflow，复用真实 fieldId 解析 | 写前解析唯一字段，写后回读规则 |
| P2 | `er` | `yida-get-schema` 或新 data-model workflow | 从应用 Schema 生成 ER | 标记只读/本地输出；输出 Mermaid/JSON 两种稳定结构 | 不创建资源，ER 与当前 Schema hash 对齐 |
| P1 | `build-page` | `yida-publish-page` | 页面源码构建 | 明确 Canvas 与 native 输入格式；构建只产本地 artifact，不冒充发布 | artifact、source hash、target mode 可回读 |
| P1 | `get-form-config` | `yida-create-form-page` / `yida-form-detail` | 读取表单配置 | 作为 update/style 前 read-before-write 节点 | 修改前后配置有 compact diff |
| P1 | `task-center` | `yida-data-management` | 待办、已办、抄送、代提交 | 增加 task type/action 矩阵，submit 与只读列表分离 | 只读意图不触发提交；提交后回读任务状态 |
| P1 | `process.preview` | `yida-process-rule` | 流程预览与当前节点高亮 | 作为规则修改后的只读验收节点 | 预览 revision 与发布 revision 一致 |
| P1 | `externalize-form` | `yida-page-config` | 表单外部提交/外链能力 | 与公开查看、组织分享分开；前置风险和范围确认 | 外部提交开关、链接、范围均可回读 |
| P1 | `integration.list` | `yida-integration` | 查询集成自动化列表 | 作为 create/enable/disable 的资源定位入口 | processCode 由列表精确解析，不靠猜测 |
| P2 | `dws` | infrastructure-only，引用独立钉钉 Skill | 钉钉通用 CLI 透传 | OpenYida 只保留边界和 capability pointer，不复制 DWS 全部用法 | OpenYida Skill 不膨胀，跨产品调用有独立所有者 |
| P2 | `dws.contact-user-search` | 人员解析基础节点 | 钉钉人员搜索 | 供 permission、process、agent-center 等复用统一人员解析结果 | 返回 unionId/userId/名称候选和歧义状态 |
| P2 | `dingtalk-link` | `yida-page-config` / link utility | 将 URL 转 AppLink | 下沉为确定性链接生成器；禁止模型手拼 scheme | 同一 URL 生成结果稳定且可验证 |
| P0 | `commands` | 根 Skill / discovery runtime | 输出机器可读命令清单 | Agent 启动时按需读取，不把 99 个参数表复制进 Skill | 新增命令后 Skill runtime 自动可发现 |
| P2 | `mcp` | infrastructure-only | MCP 服务入口 | 从用户业务 Skill 隔离，只在宿主配置和诊断触发 | 普通应用构建不会路由到 MCP 运维 |
| P2 | `a2a` | infrastructure-only | A2A 服务与 agent card | 拆分只读 agent-card 与本地 serve；记录端口/生命周期 | 业务 workflow 不自行启动长驻服务 |
| P1 | `bridge` | `setup-and-env` / transport runtime | 浏览器桥服务 | 明确只在真实桥接需求启动；加入 origin/token/port 校验 | 启动后有 health evidence，任务结束可清理 |
| P2 | `sample` | 各 Skill 的 sample registry | 输出示例文件 | 每个 sample 声明所属 Skill、适用链路和版本 | 不再把 legacy sample 当 Canvas 默认实现 |
| P0 | `eval` | `yida-skill-evaluator` | 路由、质量、安全和真实生成评测 | 直接作为治理 pipeline；区分无副作用模式和真实资源模式 | 51 Skill、99 command owner、94 references 均有报告 |
| P2 | `feedback` | `yida-voc` 或独立 feedback workflow | 体验反馈入口 | 区分“整理 VOC”与“配置/提交反馈入口” | 故障修复意图不会误触反馈提交 |
| P2 | `cdn-refresh` | `yida-design` asset workflow | CDN 缓存刷新 | 只在上传后且 URL/版本校验通过时触发 | 刷新目标精确，不刷新无关路径 |

### 26.3 CLI manifest 应新增的机器契约

不建议让 51 个 Skill 各自维护 CLI 参数。推荐在 manifest entry 或独立 capability registry 中补充以下字段：

```json
{
  "id": "publish",
  "owner_skill_id": "yida-publish-page",
  "workflow_node_id": "page.publish",
  "visibility": "workflow",
  "input_schema_id": "publish-input-v1",
  "output_schema_id": "publish-result-v1",
  "validator_id": "page-source-validator",
  "idempotency": "target-revision",
  "readback_id": "page-schema-readback",
  "retry_policy": "repair-once-current-node",
  "patch_ids": ["PATCH_PAGE_MODE_MISMATCH"],
  "completion_evidence": ["target_form_uuid", "published_revision", "schema_hash"]
}
```

字段要求：

| 字段 | 作用 | 强弱模型收益 |
| --- | --- | --- |
| `owner_skill_id` | 确定领域事实源 | 防止多个 Skill 同时解释同一命令 |
| `workflow_node_id` | 确定命令在 workflow 中的位置 | 失败时只重跑当前节点 |
| `visibility` | 区分 user-facing、workflow、infrastructure-only | 降低路由候选数量 |
| `input_schema_id` | 用 Schema 验证参数 | 弱模型错误可确定性修复 |
| `output_schema_id` | 统一 JSON 输出 | 强模型无需解析终端自然语言 |
| `validator_id` | 指向前置校验器 | 补丁不再写成长 prompt |
| `idempotency` | 声明重放策略 | 防止重试重复建资源 |
| `readback_id` | 声明完成证据 | CLI 成功不冒充业务完成 |
| `retry_policy` | 声明是否允许修复一次 | 自适应补丁只进入合法节点 |
| `patch_ids` | 列出允许激活的补丁 | 补丁可统计、版本化和退役 |
| `completion_evidence` | 声明 workflow checkpoint 内容 | 中断后可恢复 |

### 26.4 CLI 治理准出门槛

1. 99 个 command ID 必须全部具有 `owner_skill_id` 或明确的 `infrastructure-only` 标记。
2. 35 个 `remote_write` 和 27 个 `mixed` 命令必须具有 action 级副作用、幂等和 readback 描述。
3. 2 个 destructive command 及 mixed command 中的 delete/remove action 始终走前置确认，不能被 fallback prompt 绕过。
4. Skill 中的命令 ID 必须能在 manifest 中解析；参数帮助从 manifest 生成，不在 Markdown 手抄。
5. manifest 不再保存与 `yida-app`、`yida-design`、Canvas 路由重复的长篇 policy，只保存结构化 workflow pointer。
6. `agent-capabilities --summary-json` 只输出当前任务必要 capability；完整 99 项通过 `commands --json` 按需查询。
7. `check:commands` 增加 owner、workflow、validator、readback、reference link 检查。

## 27. `yida-skills/references` 共享文档全量治理表

### 27.1 共享 reference 基线

共享目录当前共有 11 个文件、3259 行。根 Skill 对 11 个文件都有索引，但只有少数子 Skill 直接引用。这种结构对强模型尚可，对弱模型不稳定：被直接路由到子 Skill 时，模型不一定回到根索引补读共享事实。

| 优先级 | 文件 | 行数 | 当前直接消费者 | 当前问题 | 治理动作 | 完成标准 |
| --- | --- | ---: | --- | --- | --- | --- |
| P0 | `development-rules.md` | 85 | 根 Skill | 全局开发规则与多个 Skill 的登录、工作目录、发布说明重复 | 只保留不可变全局契约；命令参数改引用 manifest；为每条规则增加 owner/ruleId | 全局规则只有一份，子 Skill 只引用 ruleId |
| P1 | `edition-features-guide.md` | 382 | 根 Skill | 大量版本能力适配知识只存在 prose，子 Skill 容易忘记版本检查 | 抽成 edition capability matrix 和查询脚本；prose 从 matrix 生成 | 创建能力前可返回 supported/unsupported/upgrade-required |
| P0 | `field-and-url-reference.md` | 57 | 根 Skill、`yida-design`、`yida-nav-shell` | fieldId、formUuid、URL 构造属于高频事实，但消费范围不完整 | 拆 field identity contract 与 link builder；数据、表单、页面、导航 Skill 统一消费 | 模型不手拼 URL，不混用 formUuid/formInstId |
| P1 | `formula-functions.md` | 319 | 根 Skill、`yida-formula` | 公式函数清单是静态 prose，和 evaluator 的真实支持范围可能漂移 | 变成函数 registry；文档和 evaluator 同源生成 | 函数名、参数、返回类型和 evaluator 支持状态一致 |
| P1 | `model-api.md` | 72 | 根 Skill、`yida-custom-page` | 普通 JSX 的模型 API 与 Canvas 组件桥边界不够显式 | 标记 native-only 能力和迁移替代项；Canvas 默认链路不加载 | Canvas 路由不会因 model API reference 进入 legacy |
| P1 | `official-example-schema-patterns.md` | 217 | 根 Skill | 156 个官方样本经验只作为 prose；容易把样例结构、文案和颜色复制到目标应用 | 样本转 fixtures/capability evidence；只保留 schema pattern，不保留可泄漏业务内容 | 示例用于校验，不直接成为页面业务模板 |
| P0 | `query-condition-guide.md` | 297 | 根 Skill | 查询条件类型、operator 和 JSON 字符串规则高风险，但 `yida-data-management` 没有直接引用 | 抽 query-condition Schema、builder 和 validator；data/report/chart 直接消费 | 查询前静态校验；错误返回字段和 operator 位置 |
| P1 | `report-field-config-guide.md` | 294 | 根 Skill、`yida-report` | `_value`、dataType、aggregateType 等规则仍靠模型复制 | 抽 report field normalizer/schema；文档只解释语义 | report builder 自动补后缀并拒绝非法组合 |
| P0 | `setup-and-env.md` | 93 | 根 Skill | 和 `yida-login`、manifest capability policy 重复；子 Skill 各自复制 preflight | 成为唯一环境 preflight contract；实际判断下沉 `agent-capabilities`；login Skill 只消费结构化结果 | 所有 workflow 共用一个 context snapshot |
| P2 | `task-retrospective.md` | 134 | 根 Skill | 维护者沉淀规范会进入普通执行上下文，增加每次任务 token | 移到 maintainer/post-run workflow；只有出现新错误模式时加载 | 普通业务任务不加载；治理任务可按错误码触发 |
| P0 | `yida-api.md` | 1309 | 根 Skill、`yida-custom-page` | 13 个跨应用数据 API、表单设计 API、工具 API 混在长文档；Canvas runtime 不能直接消费 prose | 抽 `yida-api.manifest`；为每个方法标记 category、params、return、risk、bridge_exposed；Canvas 自动注册 7 表单+6 流程方法 | runtime、文档、测试从同一 manifest 生成；13 方法缺一即 CI 失败 |

### 27.2 `yida-api.md` 与 Canvas runtime 的边界

必须避免把 1309 行文档中的所有 API 不加区分地挂到 window。治理后按 manifest 分类：

| 分类 | 当前内容 | 是否进入 Canvas 默认 runtime | 处理方式 |
| --- | --- | --- | --- |
| 跨应用表单数据 API | `saveFormData`、`updateFormData`、`searchFormDataIds`、`getFormComponentDefinationList`、`deleteFormData`、`getFormDataById`、`searchFormDatas` | 是 | 统一注册到 `window.__OPENYIDA_RUNTIME__.yida`，保留兼容 alias |
| 跨应用流程 API | `startProcessInstance`、`updateProcessInstance`、`deleteProcessInstance`、`getProcessInstances`、`getProcessInstanceIds`、`getProcessInstanceById` | 是 | 与表单 API 同一 runtime、同一 ready/error contract |
| 表单设计 API | `saveFormSchemaInfo`、`getFormSchema`、`saveFormSchema`、`updateFormConfig` | 默认否 | 由 CLI/Schema Builder 使用；只有明确安全场景才暴露 |
| 宜搭工具 API | `dialog`、`formatter`、`getLocale`、`openPage`、`router.push`、`toast` 等 | 不作为 `yida` 数据桥的一部分 | 通过受控 utility bridge 或组件桥按需暴露，不混入 13 方法验收 |

### 27.3 当前 3 条失效 reference 路径

| 来源 | 当前失效路径 | 实际事实源 | 治理方式 | 优先级 |
| --- | --- | --- | --- | --- |
| `yida-create-app/SKILL.md` | `references/theme/theme-token-presets.md` | `yida-design/references/theme/theme-token-presets.md` | 不复制文件；改为明确跨 Skill 所有者引用或 manifest resource ID | P0 |
| `yida-custom-page/SKILL.md` | `references/theme-runtime-helpers.md` | `yida-canvas-custom-page/references/theme-runtime-helpers.md` | native Skill 不应偷偷依赖 Canvas 私有路径；改引用统一 runtime contract | P0 |
| `yida-design/SKILL.md` | `references/canvas-style-implementation-guide.md` | `yida-canvas-custom-page/references/canvas-style-implementation-guide.md` | design 只输出设计契约，Canvas 实现指南由 Canvas Skill 持有 | P0 |

`check:skills` 必须新增 Markdown path resolver，至少校验：

1. Markdown link 目标存在。
2. 反引号中的 `references/*.md` 目标存在。
3. 跨 Skill 引用必须声明 owner，不允许依赖偶然的相对路径。
4. 打包后的 `dist/skills/openyida/references/subskills/` 仍能解析对应资源。
5. orphan reference 必须标记 maintainer-only、fixture-only 或补消费者。

## 28. Skill 专属 Reference 与 Workflow 全量治理表

### 28.1 83 个 Skill 专属 reference

下表把所有 83 个专属 reference 按所有者完整列出。治理不是简单删除长文档，而是区分四种去向：领域事实保留在 reference；确定性逻辑进入 script/lib；样例进入 fixtures/templates；重复全局规则改引用共享 contract。

| 优先级 | 所有者 | 文件数/行数 | 全部文件 | 主要治理动作 |
| --- | --- | ---: | --- | --- |
| P0 | `yida-app` | 1 / 142 | `app-build-contract.md` | 拆成 workflow state/schema/checkpoint contract；入口不再复制完整构建流程 |
| P0 | `yida-canvas-custom-page` | 10 / 2117 | `canvas-authoring-examples.md`、`canvas-style-implementation-guide.md`、`component-library-guide.md`、`data-bridge-guide.md`、`dependencies-and-cdn.md`、`employeefield-verification.md`、`native-components-bridge.md`、`navigation-and-entry-guide.md`、`page-generation-guide.md`、`theme-runtime-helpers.md` | runtime/data/component/theme 重新分层；桥、主题和 13 API 进入代码；示例进入可编译 fixtures |
| P1 | `yida-canvas-upgrade` | 1 / 70 | `migration-examples.md` | 示例变迁移 fixtures，输出可迁移和必须保留 native 的原因 |
| P1 | `yida-chart` | 4 / 1055 | `echarts-bindding-guide.md`、`echarts-code-template.md`、`echarts-design-spec.md`、`examples.md` | 修正命名；数据 binding、option validator 和模板下沉；legacy/Canvas 示例分开 |
| P1 | `yida-connector` | 1 / 179 | `connector-action-format.md` | 转 action JSON Schema，与 parser/generator 共用 |
| P0 | `yida-create-form-page` | 6 / 1412 | `advanced-form-modes.md`、`association-form-field.md`、`employee-field.md`、`field-definition-guide.md`、`form-field-properties.md`、`serial-number-field.md` | 字段定义、属性、关联、流水号转 schema/fixtures；入口按字段类型按需加载 |
| P0 | `yida-custom-page` | 6 / 2110 | `assets-guide.md`、`attachment-upload-guide.md`、`coding-guide.md`、`component-jsx-guide.md`、`design-system.md`、`runtime-guardrails.md` | 只保留 legacy/native 编码指南；设计规则引用 yida-design；运行时规则结构化；修复跨 Canvas 私有路径 |
| P1 | `yida-dashboard` | 4 / 1684 | `interaction-patterns.md`、`pitfalls.md`、`structure-and-layout.md`、`theme-presets.md` | 产品编排规则留 workflow；主题归 yida-design；图表规则引用 report/rechart；pitfall 变错误码补丁 |
| P0 | `yida-data-management` | 3 / 273 | `api-matrix.md`、`data-format-guide.md`、`verified-endpoints.md` | API matrix 与 CLI/data runtime 同源；查询格式引用 query builder；endpoint 进入测试证据 |
| P0 | `yida-design` | 27 / 6968 | `app/blueprint.md`、`app/navigation-patterns.md`、`app/role-journey.md`、`asset-workflow.md`、`page-quality-gates.md`、`style-design-selection.md`、`style-designs/_design-md-template.md`、`style-designs/aqua-service-progress-dashboard.md`、`style-designs/blue-insight-operations-dashboard.md`、`style-designs/blue-productivity-insight-workbench.md`、`style-designs/command-filter-card-console.md`、`style-designs/contrast-command-analytics-workbench.md`、`style-designs/dark-stage-analytic-dashboard.md`、`style-designs/filterable-card-catalog.md`、`style-designs/green-timeline-progress-workbench.md`、`style-designs/registry.md`、`style-designs/soft-analytic-workbench.md`、`style-designs/soft-blue-grid-analytic-dashboard.md`、`style-designs/soft-bordered-analytic-workbench.md`、`style-designs/soft-curated-filter-gallery.md`、`style-designs/soft-modular-analytic-workbench.md`、`style-designs/soft-progress-analytics-workbench.md`、`style-designs/soft-timeline-analytics-workbench.md`、`style-designs/teal-rail-analytics-workbench.md`、`theme/theme-token-presets.md`、`visual-decision-engine.md`、`visual-scaffold-recipes.md` | registry 机器化；设计样式按场景检索，不全量加载；去除业务文案泄漏；实现代码移交 Canvas Skill；修复失效跨路径 |
| P2 | `yida-flash-note-to-prd` | 4 / 530 | `examples.md`、`flash-note-prd-template.md`、`flash-note-prompt.md`、`yida-field-types.md` | template 与 yida-design PRD contract 对齐；prompt 只作 fallback；字段类型引用统一 registry |
| P0 | `yida-form-detail` | 2 / 312 | `form-detail-css.md`、`injection-guide.md` | CSS preset 可测试；注入改调用统一 theme runtime，不保留复制型 helper |
| P1 | `yida-formula` | 1 / 150 | `examples.md` | 示例变 evaluator fixtures，覆盖成功和错误修复案例 |
| P1 | `yida-integration` | 2 / 518 | `examples.md`、`integration-node-schemas.md` | node schema 成为真实 validator 输入；示例按 create/enable/disable/check 分类 |
| P1 | `yida-nav-shell` | 1 / 314 | `nav-shell-patterns.md` | 默认只保留 Canvas pattern；native `_customState/renderJsx` 放 legacy 章节 |
| P2 | `yida-ppt-slider` | 3 / 948 | `dark-tech-theme.md`、`echarts-race-example.md`、`examples.md` | 固定主题不默认加载；Canvas 示例可编译；legacy 示例隔离 |
| P1 | `yida-process-rule` | 3 / 610 | `examples.md`、`official-component-nodes.md`、`process-ai-rules.md` | 节点和 AI 规则转 Schema；示例按 node/branch/assignee/permission 拆 fixtures |
| P1 | `yida-report` | 3 / 658 | `examples.md`、`report-api-guide.md`、`schema-builder-details.md` | API 和 builder 同源；report field normalizer 替代手写配置 |
| P1 | `yida-table-form` | 1 / 114 | `examples.md` | 标记 legacy/native；默认批量录入示例迁往 Canvas table form |

### 28.2 9 个 references 目录之外的 workflow/template 文件

| 优先级 | 所有者 | 文件 | 治理动作 | 完成标准 |
| --- | --- | --- | --- | --- |
| P0 | `yida-design` | `workflow/step-1-positioning.md`、`step-2-theme-system.md`、`step-3-information-architecture.md`、`step-4-wireframe-interaction.md`、`step-5-visual-states.md`、`step-6-handoff.md`、`output-prd.md`、`output-design.md` | 保留为正式 design workflow；每步输入输出结构化；output 模板由 validator 校验；不包含 Canvas/JSX 实现代码 | workflow 可按 checkpoint 恢复，`prd.md`/`design.md` 可机器校验 |
| P1 | `yida-connector` | `templates/api-document-template.md` | 作为 parser fixture/template 管理，声明版本和 Schema | parser 生成结果可与模板做结构化 diff |

### 28.3 Reference 准出门槛

1. 94 个 reference 文件全部具有 owner、consumer、load condition、content type 和 version。
2. `content type` 只能是 `contract`、`guide`、`registry`、`template`、`fixture`、`maintainer` 之一。
3. `contract` 和 `registry` 可被脚本读取；不能只存在于自然语言表格。
4. `template` 和 `fixture` 必须有编译、解析或 Schema 测试。
5. `maintainer` 文档不进入普通用户任务上下文。
6. 任何 reference 的命令参数、API 清单、函数清单都从 manifest/registry 生成。
7. 所有相对路径在源码态和悟空打包态都能解析。
8. 大于 300 行的 reference 必须支持按 heading/registry key 精确加载，禁止默认整篇灌入。
9. examples 中的业务文案、品牌、色彩和 ID 不得泄漏到目标应用。
10. reference 内容重复检测以 ruleId/registry key 为准，不能仅依赖文本相似度。

## 29. 纳入 CLI 与 Reference 后的最终实施顺序

原 W0-W8 顺序保持，但每个波次增加 CLI 和 reference 交付物。严格执行顺序如下。

| 新顺序 | 原波次 | 必须先完成的内容 | CLI 交付物 | Reference 交付物 | 阻塞条件 |
| ---: | --- | --- | --- | --- | --- |
| 1 | W0 | 建立全量基线 | 冻结 99 command manifest；补 owner/visibility/workflow 字段；建立 22 个无消费能力清单 | 冻结 94 references 和 9 workflow/template；修复 3 条失效路径；新增 link/orphan 检查 | 未建立所有权和链接校验，不开始删补丁 |
| 2 | W1 | Canvas runtime 与发布基础 | 对齐 `create-page`、`build-page`、`check-page`、`compile`、`publish`、`get-schema` 的结构化契约 | `yida-api` 抽 manifest；Canvas 10 个 reference 分层 | 13 个跨应用 API、主题 runtime、publish readback 未完成，不切默认路由 |
| 3 | W2 | 页面单链路收敛 | Canvas/native mode 进入命令输入 Schema；legacy 命令明确 visibility | custom-page 6 个 reference 标记 legacy；迁移示例变 fixtures | `this.utils.yida.*` 仍会触发普通 JSX 时不得准出 |
| 4 | W3 | `yida-app` workflow | `commands`/`agent-capabilities` 只提供 pointer；manifest 删除重复长 policy | app contract、design 27 references、8 workflow 文件建立 manifest | CLI 与 Skill 仍有双事实源时不得进入业务写操作治理 |
| 5 | W4 | 表单、数据、流程和权限 | 对齐 create-form、data、task-center、process、permission 的 validator/readback | 字段、查询、公式、流程、权限 reference 结构化 | remote write 没有幂等/readback 时不允许 fallback retry |
| 6 | W5 | 报表与可视化 | `create-report`/`append-chart` 使用统一 report contract | report/chart/dashboard references 去重并转 fixtures | 报表字段仍靠模型手拼时不准出 |
| 7 | W6 | 连接器、集成、分享、国际化 | connector/integration/share/app commands 补 action ownership | connector/integration/i18n/edition references 机器化 | secret、delete、公开范围没有确定性护栏时不准出 |
| 8 | W7 | 专用和基础设施能力 | org、import、ER、DWS、MCP、A2A、bridge、feedback、CDN 明确 owner 或 infrastructure-only | maintainer/reference 延迟加载 | 任何 command 仍无 owner/visibility 时不进入最终回归 |
| 9 | W8 | 全量回归和补丁退役 | 99 command owner coverage、action safety、readback、idempotency 全通过 | 155 Markdown link、orphan、重复、打包态全通过 | 只有全量矩阵通过后才能删除历史补丁 |

最终验收数字必须固定为：

- 52 个 Skill 入口全部有清晰 description、触发条件、输入输出和相邻负向边界。
- 99 个 CLI command 全部有 owner 或 infrastructure-only 分类。
- 94 个 reference 全部有 owner、consumer、load condition 和内容类型。
- 9 个 workflow/template 文件全部纳入结构校验。
- 155 个 Markdown 文件全部通过路径、重复、所有权和发布态校验。
- 35 个 remote_write 与 27 个 mixed command 全部具有 action 级安全和 readback。
- 13 个 Canvas 跨应用数据 API 全部由统一 runtime 注册，不要求模型复制桥代码。
- 强模型默认走无补丁轻量链路；弱模型只在 validator 失败后激活对应 patchId 并局部重试一次。
