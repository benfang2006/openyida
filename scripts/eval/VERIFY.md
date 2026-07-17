# Skill 测评 Harness — 本地验证流程

> 用于验证 `scripts/eval/` 下的测评 harness 是否正常工作。
> 按「最便宜、零副作用」→「真实链路」的顺序执行。

## 前置:用对 Node 版本

默认 shell 可能是 Node v14,但项目要求 **≥18**。每次新开终端先切版本:

```bash
nvm use 20            # 或 nvm use 18
node --version        # 确认 v18/v20
npm install           # 如果 node_modules 缺失,先装依赖
```

---

## 第 0 步(可选):网页控制台,点按钮运行

不想敲命令的话,启动本地控制台,在网页上点按钮即可运行下面所有任务,输出实时流式显示:

```bash
nvm use 20
npm run eval:dashboard          # 默认 http://127.0.0.1:4500
# 自定义端口: EVAL_DASHBOARD_PORT=4567 npm run eval:dashboard
```

- 左侧「安全任务」(单测、路由测评)无副作用,直接点。
- 左侧「真实链路」(红色,端到端建资源)点击会弹确认框,需先 `openyida login`。
- 仅监听 `127.0.0.1`,任务是白名单固定命令,不接受任意命令输入。
- 注意:控制台用**启动它的那个 Node 版本**跑子进程,务必先 `nvm use 20`。

---

## 第 1 步:纯函数单测(最先跑,无副作用,进 CI)

验证 harness 逻辑正确性的核心:不调真实 agent、不建资源、不需要登录。

```bash
npx jest tests/eval-config.test.js tests/eval-guardrail.test.js tests/eval-manifest.test.js tests/eval-routing.test.js
```

- 预期:`35 passed`。

跑全量回归,确认未影响其他模块:

```bash
npm test
```

- 预期:`891 passed`(80 suites)。

---

## 第 2 步:路由测评(选对子技能吗,无真实资源,需要 `claude` CLI)

> 目的:测 agent 能否从 ~50 个子技能里**选对一个**——这是 SKILL.md 最核心的能力。

真实调用本地 `claude -p`,把 `scripts/eval/scenarios/` 里的自然语言 prompt 各跑一遍,比对选中的子技能。**不建宜搭应用、不需要登录**。

```bash
# 先确认 claude CLI 存在
claude --version

npm run eval:routing
```

- 预期:每条 scenario 输出 `expectedSkill vs actualSkill`、整体命中率与混淆对。
- 报告:`project/.cache/eval/routing-report.json`。
- 降级:没装 `claude` CLI 时会提示 agent 不可用,不会崩溃。

---

## 第 3 步:工具管道基线 + 截图 + 人工打分模板(真实链路,opt-in)

> 目的(对照基线):**不经过 agent**,用固定命令把「建应用→发布→截图→打分」整条管道跑通,
> 确认基础设施本身没坏。当第 5 步「真实生成」失败时,先看这条是否绿,就能区分是 agent 还是工具的问题。

**会在宜搭组织里真的创建一次性应用**,需 `OPENYIDA_E2E=1` + 有效 token session（先 `openyida login`，再用 `openyida login --check-only --json` 验证）。

```bash
OPENYIDA_E2E=1 npm run eval:e2e -- --skill yida-dashboard --screenshot
```

验证点:
- `acceptance-manifest.json` 出现 `eval` 段(`guardrails` / `screenshots[].path` / `scores[].human=null` / `reportHtml`)。
- 同目录生成 `scoring.md`(内嵌截图 + 页面 URL + 空白人工评分表)。
- 同目录生成 `eval-report.html`:**自包含 HTML 可视化报告**,截图以 base64 内联,单文件可直接双击打开;含元数据/护栏表/截图卡片/自动+人工打分。
  - 也可在控制台(第 0 步)点右上角「📊 查看最新报告」直接在浏览器打开最新一份。
- 护栏:若「登录校验前建资源」会红线 `fail`。
- 降级:Playwright 没装则自动跳过截图(`npm install --no-save playwright && npx playwright install chromium` 可启用),e2e 仍继续。
- 截图目标会自动过滤掉 `aliwork.com/o/<slug>` 这类 vanity 分享短链(headless 下常 404,截出来是废图)。

---

## 第 4 步:端到端 + 本地 agent 自动打分

```bash
OPENYIDA_E2E=1 npm run eval:e2e -- --skill yida-dashboard --screenshot --auto-score
```

验证点:
- `eval.scores[].auto.overall` 有分值,`auto.model` 为 `claude -p`。
- 降级:没装 `claude` 则只留人工模板。

---

## 第 5 步:真实生成 —— 自然语言 → agent 真实生成应用(真实链路,opt-in)

> 目的:最接近真实用户的端到端测评——测「一句话能否真生成可用应用」(选对 + 真做对 + 做得好不好)。

把一句「帮我创建一个订单管理系统」喂给本地 `claude -p`,**让它自己读懂 openyida 技能、
自己决定并真的执行 CLI 命令**产出真实应用,再复用截图 + 打分 + HTML 报告链路。
与第 3 步「工具管道基线」的区别:基线是确定性 CLI(固定命名直接调命令、不经过 agent),
本步走自然语言、由 agent 自主编排。

```bash
# 需 OPENYIDA_E2E=1 + headless agent 已认证(claude 已登录或设 ANTHROPIC_API_KEY)
OPENYIDA_E2E=1 npm run eval:generate -- --screenshot
# 自定义 golden 集目录: --gen-scenarios <dir>(默认 scripts/eval/scenarios/generation)
# 加本地 agent 自动打分: --auto-score
```

验证点:
- golden 集 `scripts/eval/scenarios/generation/generation-core.json`(订单管理 / 请假审批 / 销售看板)逐条跑。
- 每条输出 `产出资源 / 通过` 计数与通过率;`expectedFeatures` 校验 appType / 目标数 / 类型 / 关键词。
- 产物落 `project/.cache/eval/generate/gen-<时间戳>/`:`generation-report.json` + `scoring.md` + `eval-report.html`。
- 控制台(第 0 步)「📊 查看最新报告」会自动包含「真实生成」的最新报告。
- 降级:`claude` 不可用 → 整批标 `agent-unavailable`;Playwright 缺失 → 跳过截图;均不崩。

## 第 6 步:三类测评一起跑

```bash
OPENYIDA_E2E=1 npm run eval:all -- --skill yida-dashboard --screenshot
# all = 路由测评 + 工具管道基线 + 真实生成
```

---

## 配置与常用 flag

优先级:`CLI flag > env(OPENYIDA_EVAL_*) > scripts/eval/eval.config.json > 默认`。

| Flag | 作用 |
|------|------|
| `--mode e2e\|routing\|generate\|all` | 跑哪几层(默认 `e2e`;`all` = 路由+端到端+生成) |
| `--skill <name>` | 限定 e2e 只跑某子技能;stages 经 `SKILL_COVERAGE` 矩阵反查 |
| `--stages a,b` | 显式指定 stage,覆盖 skill 反查 |
| `--screenshot` / `--no-screenshot` | 是否截发布页(默认开;Playwright 缺失则跳过) |
| `--auto-score` / `--no-auto-score` | 是否用本地 `claude -p` 给截图打分(默认关 → 仅人工模板) |
| `--scenarios <dir>` | 路由测评 golden 集目录(默认 `scripts/eval/scenarios`) |
| `--gen-scenarios <dir>` | 真实生成 golden 集目录(默认 `scripts/eval/scenarios/generation`) |

---

## 最小验证组合

只想快速确认 harness 没问题:跑 **第 1 步**(单测)+ **第 2 步**(路由测评)即可——
前者证明逻辑对,后者证明能真正驱动 agent 路由,都不动宜搭线上资源。

---

## 已知前置问题(与本 harness 无关)

当前 checkout 下 `npm run check:ci` 跑不全绿,原因在 HEAD 本身:
- 仓库缺 `.eslintrc.json` → `npm run lint` / `check:structure` 失败。
- `lib/samples/yida-chart/china-map.js` 是 ESM → `check:syntax` 报错。

这两项是仓库既有问题,不是测评 harness 引入的。
