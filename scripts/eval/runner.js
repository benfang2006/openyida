#!/usr/bin/env node

'use strict';

/**
 * OpenYida 测评 harness 入口与编排。
 *
 * 用法：
 *   node scripts/eval/runner.js --mode e2e   --skill yida-dashboard --screenshot [--auto-score]
 *   node scripts/eval/runner.js --mode routing --scenarios scripts/eval/scenarios
 *   node scripts/eval/runner.js --mode all   --skill yida-report --screenshot
 *
 * 设计原则：
 *   - 复用 scripts/e2e-real/full-runner.js 跑真实链路，结果增量回写其 acceptance-manifest。
 *   - 截图 / 自动打分 / claude CLI 均为软能力，缺失时优雅降级而非整体失败。
 *   - 护栏 fail 时以非零退出码作为 CI 红线。
 */

const fs = require('fs');
const path = require('path');

const { resolveConfig, buildE2eEnv } = require('./config');
const fullRunner = require('../e2e-real/full-runner');
const { runGuardrails, hasGuardrailFailure } = require('./guardrail');
const manifestUtil = require('./manifest');
const screenshotUtil = require('./screenshot');
const scoreUtil = require('./score');
const reportUtil = require('./report');
const routing = require('./routing');
const generate = require('./generate');

const ROOT = path.resolve(__dirname, '..', '..');
const EVAL_OUT_DIR = path.join(ROOT, 'project', '.cache', 'eval');

function log(...args) {
  // eslint-disable-next-line no-console
  console.log(...args);
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  return filePath;
}

/**
 * 路由测评：测 agent 能否从 ~50 个子技能里选对一个（无副作用、不建资源）。
 */
function runRouting(config) {
  let scenariosDir = config.scenariosDir;
  if (scenariosDir && !path.isAbsolute(scenariosDir)) {
    scenariosDir = path.join(ROOT, scenariosDir);
  }
  log(`\n[routing] 加载 scenarios：${scenariosDir}`);
  const outcome = routing.runRoutingEval({ scenariosDir });
  const { summary } = outcome;

  log(`[routing] 用例 ${summary.total}，已评 ${summary.evaluated}，命中 ${summary.hits}`);
  log(`[routing] 路由准确率：${summary.accuracy === null ? 'n/a' : `${(summary.accuracy * 100).toFixed(1)}%`}`);
  if (summary.agentUnavailable) {
    log(`[routing] ⚠ ${summary.agentUnavailable} 条因 claude CLI 不可用未评测`);
  }
  if (summary.agentError) {
    const sample = (outcome.results.find((r) => r.status === 'agent-error') || {}).raw;
    log(`[routing] ⚠ ${summary.agentError} 条 agent 调用失败（如未登录/配额/API 错误）`);
    if (sample) {log(`[routing]   示例：${sample.split('\n')[0]}`);}
    log('[routing]   提示：请先认证 headless agent —— 运行 `claude` 登录，或设置 ANTHROPIC_API_KEY。');
  }
  if (summary.unparsed) {
    log(`[routing] ⚠ ${summary.unparsed} 条 agent 输出无法解析`);
  }
  if (summary.confusion.length) {
    log('[routing] 混淆对（expected → actual）：');
    for (const c of summary.confusion) {log(`  - ${c.pair}  x${c.count}`);}
  }

  const reportPath = writeJson(path.join(EVAL_OUT_DIR, 'routing-report.json'), outcome);
  log(`[routing] 报告：${reportPath}`);
  return outcome;
}

/**
 * 真实生成测评：自然语言 → agent 真实生成应用 → 截图 + 打分 + HTML 报告。
 * 测「端到端：一句话能否真生成可用应用」。**会创建真实宜搭资源**，
 * 需 OPENYIDA_E2E=1 且 headless agent 已认证。
 */
async function runGenerate(config) {
  if (!['1', 'true', 'yes', 'on'].includes(String(process.env.OPENYIDA_E2E || '').toLowerCase())) {
    log('\n[generate] 已跳过：真实生成会创建真实宜搭资源，需设置 OPENYIDA_E2E=1 且 headless agent 已认证。');
    return { skipped: true };
  }

  let scenarioPath = config.generationScenarios;
  if (scenarioPath && !path.isAbsolute(scenarioPath)) {
    scenarioPath = path.join(ROOT, scenarioPath);
  }
  log(`\n[generate] 加载生成 scenarios：${scenarioPath}`);

  const outcome = generate.runGenerationEval({ scenarioPath });
  const { summary } = outcome;
  log(`[generate] 用例 ${summary.total}，产出资源 ${summary.produced}，通过 ${summary.passed}`);
  log(`[generate] 通过率：${summary.passRate === null ? 'n/a' : `${(summary.passRate * 100).toFixed(1)}%`}`);
  if (summary.agentUnavailable) {
    log(`[generate] ⚠ ${summary.agentUnavailable} 条因 claude CLI 不可用未评测`);
  }
  if (summary.agentError) {log(`[generate] ⚠ ${summary.agentError} 条 agent 调用失败`);}
  if (summary.noOutput) {log(`[generate] ⚠ ${summary.noOutput} 条未解析到产物 URL`);}
  if (summary.featureMiss) {log(`[generate] ⚠ ${summary.featureMiss} 条产物未满足期望特征`);}

  // 汇总所有 scenario 的产物 URL 为统一截图/打分目标（stage 用 scenario id 区分）。
  const targets = [];
  for (const r of outcome.results) {
    for (const t of (r.targets || [])) {
      targets.push({ stage: `${r.id}:${t.type}`, type: t.type, url: t.url });
    }
  }

  const workDir = path.join(EVAL_OUT_DIR, 'generate', `gen-${Date.now()}`);
  fs.mkdirSync(workDir, { recursive: true });

  // 截图（可选）
  let screenshots = targets.map((t) => ({ ...t, ok: false, path: null, skipped: 'screenshot-disabled' }));
  if (config.screenshot && targets.length) {
    const shotResult = await screenshotUtil.captureScreenshots({
      targets,
      outputDir: path.join(workDir, 'eval-screenshots'),
    });
    screenshots = shotResult.screenshots;
    if (!shotResult.available) {
      log(`[generate] ⚠ 截图不可用（${shotResult.reason}），已跳过。`);
    } else {
      log(`[generate] 截图完成：${screenshots.filter((s) => s.ok).length}/${screenshots.length} 张`);
    }
  } else if (!config.screenshot) {
    log('[generate] 截图未开启（--no-screenshot）。');
  }

  // 打分
  let scores;
  if (config.autoScore) {
    const auto = scoreUtil.autoScoreScreenshots({ screenshots });
    scores = auto.scores;
    log(auto.available
      ? `[generate] 自动打分完成：${scores.filter((s) => s.auto && !s.auto.error).length} 张`
      : '[generate] ⚠ 自动打分不可用（claude CLI 缺失），退化为人工占位。');
  } else {
    scores = scoreUtil.buildHumanScores(screenshots);
    log('[generate] 人工打分模式：生成 scoring.md 模板。');
  }

  const scoringMd = scoreUtil.renderScoringMarkdown({ config, scores, workDir });
  const scoringDocPath = scoreUtil.writeScoringDoc(workDir, scoringMd);
  const reportHtml = reportUtil.renderEvalReportHtml({
    config,
    registry: { runId: path.basename(workDir) },
    guardrails: [],
    screenshots,
    scores,
  });
  const reportPath = reportUtil.writeReport(workDir, reportHtml);
  const jsonPath = writeJson(path.join(workDir, 'generation-report.json'), {
    summary, results: outcome.results, scoringDoc: scoringDocPath, reportHtml: reportPath,
  });
  log(`[generate] 打分表：${scoringDocPath}`);
  log(`[generate] HTML 报告：${reportPath}`);
  log(`[generate] 生成报告：${jsonPath}`);

  return { skipped: false, summary, workDir, reportPath, scoringDocPath };
}

/**
 * 工具管道基线（端到端）：确定性 CLI 链路 + 护栏 + 截图 + 打分，回写 manifest。
 * 不经过 agent，作为对照基线验证「建应用→截图→打分」管道本身是否健康。
 */
async function runE2e(config) {
  const env = buildE2eEnv(config, process.env);

  if (config.skill) {
    if (config.skillMapping && !config.skillMapping.ok) {
      log(`\n[e2e] ⚠ ${config.skillMapping.reason}`);
    } else {
      log(`\n[e2e] 子技能过滤：${config.skill} → stages=${config.resolvedStages}`);
    }
  }

  const result = fullRunner.run({ env });
  if (result.skipped) {
    log('[e2e] 已跳过真实链路（需 OPENYIDA_E2E=1 与有效 token session）。');
    return { skipped: true };
  }

  const registry = result.registry;
  const manifestPath = registry.acceptance && registry.acceptance.manifestPath
    ? registry.acceptance.manifestPath
    : null;
  const workDir = manifestPath ? path.dirname(manifestPath) : path.dirname(result.registryPath);

  // 1) 护栏
  const guardrails = runGuardrails(registry);
  for (const g of guardrails) {
    const icon = g.status === 'pass' ? '✔' : (g.status === 'fail' ? '✗' : '·');
    log(`[e2e] 护栏 ${g.name}: ${g.status} ${icon} — ${g.detail}`);
  }

  // 2) 收集可打分目标
  const targets = manifestUtil.collectScoreTargets(registry);
  log(`[e2e] 可打分页面目标：${targets.length}`);

  // 3) 截图（可选）
  let screenshots = targets.map((t) => ({ ...t, ok: false, path: null, skipped: 'screenshot-disabled' }));
  if (config.screenshot && targets.length) {
    const shotResult = await screenshotUtil.captureScreenshots({
      targets,
      outputDir: path.join(workDir, 'eval-screenshots'),
    });
    screenshots = shotResult.screenshots;
    if (!shotResult.available) {
      log(`[e2e] ⚠ 截图不可用（${shotResult.reason}），已跳过；e2e 结果不受影响。`);
    } else {
      const okCount = screenshots.filter((s) => s.ok).length;
      log(`[e2e] 截图完成：${okCount}/${screenshots.length} 张`);
    }
  } else if (!config.screenshot) {
    log('[e2e] 截图未开启（--no-screenshot）。');
  }

  // 4) 打分
  let scores;
  if (config.autoScore) {
    const auto = scoreUtil.autoScoreScreenshots({ screenshots });
    scores = auto.scores;
    if (!auto.available) {
      log('[e2e] ⚠ 自动打分不可用（claude CLI 缺失），已退化为人工打分占位。');
    } else {
      log(`[e2e] 自动打分完成：${scores.filter((s) => s.auto && !s.auto.error).length} 张`);
    }
  } else {
    scores = scoreUtil.buildHumanScores(screenshots);
    log('[e2e] 人工打分模式：生成 scoring.md 模板。');
  }

  // 5) 人工打分文档
  const scoringMd = scoreUtil.renderScoringMarkdown({ config, scores, workDir });
  const scoringDocPath = scoreUtil.writeScoringDoc(workDir, scoringMd);
  log(`[e2e] 打分表：${scoringDocPath}`);

  // 6) HTML 可视化报告（自包含，截图 base64 内联）
  const reportHtml = reportUtil.renderEvalReportHtml({
    config,
    registry,
    guardrails,
    screenshots,
    scores,
  });
  const reportPath = reportUtil.writeReport(workDir, reportHtml);
  log(`[e2e] HTML 报告：${reportPath}`);

  // 7) 回写 manifest 的 eval 段
  const evalSection = manifestUtil.buildEvalSection({
    config,
    guardrails,
    screenshots,
    scores,
    scoringDoc: scoringDocPath,
    reportHtml: reportPath,
  });
  if (manifestPath) {
    manifestUtil.augmentManifestFile(manifestPath, evalSection);
    log(`[e2e] 已回写 eval 段：${manifestPath}`);
  } else {
    log('[e2e] ⚠ 未找到 acceptance-manifest，eval 段未回写。');
  }

  return { skipped: false, guardrails, manifestPath, workDir, scoringDocPath, reportPath };
}

async function main(argv = process.argv.slice(2)) {
  const config = resolveConfig({ argv, env: process.env });
  log(`OpenYida 测评 harness · mode=${config.mode}`);

  let guardrailFailed = false;

  if (config.mode === 'routing' || config.mode === 'all') {
    runRouting(config);
  }

  if (config.mode === 'e2e' || config.mode === 'all') {
    const e2e = await runE2e(config);
    if (!e2e.skipped && hasGuardrailFailure(e2e.guardrails || [])) {
      guardrailFailed = true;
    }
  }

  if (config.mode === 'generate' || config.mode === 'all') {
    await runGenerate(config);
  }

  if (guardrailFailed) {
    log('\n护栏存在 fail，退出码 1（CI 红线）。');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = {
  runRouting,
  runE2e,
  runGenerate,
  main,
  EVAL_OUT_DIR,
};
