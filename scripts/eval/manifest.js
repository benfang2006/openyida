#!/usr/bin/env node

'use strict';

/**
 * 把测评结果（护栏 / 截图 / 打分）增量回写进 full-runner 已产出的
 * acceptance-manifest.json，不改动 full-runner 自身逻辑。
 */

const fs = require('fs');
const path = require('path');

/**
 * 判断 URL 是否为可渲染的打分目标。
 * 排除宜搭 vanity 短链（形如 `/o/<slug>`）：这类分享短链在 headless
 * 截图场景常返回"请求地址不存在"，截出来是废图。真正能渲染的是
 * `/APP_.../custom/FORM-...` 这类自定义页面 URL。
 * @param {string} url
 * @returns {boolean}
 */
function isRenderableUrl(url) {
  if (!url) {return false;}
  // aliwork 分享短链：https://<host>/o/<slug>
  if (/aliwork\.com\/o\/[^/]+\/?$/i.test(url)) {return false;}
  return true;
}

/**
 * 从 registry 收集"可打分/可截图"的目标 URL。
 * 优先取已发布、能渲染的页面（page / dashboard），其次报表。
 * @param {object} registry
 * @returns {Array<{stage:string, type:string, url:string, pageId:string|null}>}
 */
function collectScoreTargets(registry = {}) {
  const targets = [];
  const seen = new Set();

  const push = (stage, type, url, pageId) => {
    if (!url || seen.has(url) || !isRenderableUrl(url)) {return;}
    seen.add(url);
    targets.push({ stage, type, url, pageId: pageId || null });
  };

  // 1) 显式资源（带 type 与 url）
  const resources = Array.isArray(registry.resources) ? registry.resources : [];
  for (const res of resources) {
    if (!res || !res.url) {continue;}
    if (['page', 'dashboard', 'report'].includes(res.type)) {
      push(res.type, res.type, res.url, res.pageId);
    }
  }

  // 2) resultApp 上的归纳 URL（兜底）
  const resultApp = registry.resultApp || {};
  push('page', 'page', resultApp.pageUrl, null);
  push('dashboard', 'dashboard', resultApp.businessDashboardUrl, null);
  push('dashboard', 'dashboard', resultApp.businessDashboardShareUrl, null);
  push('report', 'report', resultApp.reportUrl, null);

  return targets;
}

/**
 * 构造写入 manifest 的 eval 段。
 */
function buildEvalSection({ config, guardrails, screenshots, scores, scoringDoc, reportHtml } = {}) {
  return {
    generatedAt: new Date().toISOString(),
    mode: (config && config.mode) || 'e2e',
    skillFilter: (config && config.skill) || null,
    resolvedStages: (config && config.resolvedStages) || null,
    options: {
      screenshot: !!(config && config.screenshot),
      autoScore: !!(config && config.autoScore),
    },
    guardrails: guardrails || [],
    screenshots: screenshots || [],
    scores: scores || [],
    scoringDoc: scoringDoc || null,
    reportHtml: reportHtml || null,
  };
}

/**
 * 纯函数：把 eval 段合并进 manifest 对象。
 */
function mergeEval(manifest, evalSection) {
  return { ...(manifest || {}), eval: evalSection };
}

/**
 * 读取 manifest 文件（缺失返回 null）。
 */
function readManifest(manifestPath) {
  if (!manifestPath || !fs.existsSync(manifestPath)) {return null;}
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

/**
 * 把 eval 段增量回写进 manifest 文件，返回合并后的对象。
 */
function augmentManifestFile(manifestPath, evalSection) {
  const manifest = readManifest(manifestPath) || {};
  const merged = mergeEval(manifest, evalSection);
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(merged, null, 2)}\n`, 'utf8');
  return merged;
}

module.exports = {
  isRenderableUrl,
  collectScoreTargets,
  buildEvalSection,
  mergeEval,
  readManifest,
  augmentManifestFile,
};
