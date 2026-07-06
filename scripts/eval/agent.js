#!/usr/bin/env node

'use strict';

/**
 * 唯一的 headless agent 封装。路由测评、真实生成与截图打分共用此模块，
 * 都通过本地 `claude -p` 运行时完成，无需独立 vision API key。
 *
 * claude CLI 缺失时返回 { available:false }，调用方据此优雅降级。
 */

const { spawnSync } = require('child_process');

/**
 * 检测本地是否可用 claude CLI。
 */
function isAgentAvailable(command = 'claude') {
  try {
    const probe = spawnSync(command, ['--version'], { encoding: 'utf8', timeout: 15000 });
    return probe.status === 0;
  } catch {
    return false;
  }
}

/**
 * 从一段文本里抽取第一个完整 JSON 对象（容忍前后的解释性文字 / ```json 围栏）。
 * @param {string} text
 * @returns {object|null}
 */
function extractJsonObject(text) {
  if (!text || typeof text !== 'string') {return null;}
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [];
  if (fenced) {candidates.push(fenced[1]);}
  candidates.push(text);

  for (const candidate of candidates) {
    const start = candidate.indexOf('{');
    if (start === -1) {continue;}
    // 从第一个 { 起做花括号配平扫描
    let depth = 0;
    for (let i = start; i < candidate.length; i += 1) {
      const ch = candidate[i];
      if (ch === '{') {depth += 1;}
      else if (ch === '}') {
        depth -= 1;
        if (depth === 0) {
          const slice = candidate.slice(start, i + 1);
          try {
            return JSON.parse(slice);
          } catch {
            break; // 该候选无效，换下一个
          }
        }
      }
    }
  }
  return null;
}

/**
 * 跑一次 headless agent。
 * @param {object} options
 * @param {string} options.prompt 完整 prompt（图片以"读取截图：<绝对路径>"形式内联，agent 自行 Read）
 * @param {string} [options.command='claude']
 * @param {string} [options.cwd]
 * @param {number} [options.timeoutMs=180000]
 * @param {string[]} [options.extraArgs] 追加到 `claude -p <prompt> --output-format json` 之后的额外 flag
 *   （如真实生成测评需要 `--permission-mode bypassPermissions --allowedTools Bash Read --add-dir <repo>`）
 * @param {function} [options.spawn] 注入用，便于测试
 * @returns {{available:boolean, ok:boolean, text:string|null, json:object|null, raw:string|null, error:string|null}}
 */
function runAgent(options = {}) {
  const command = options.command || 'claude';
  const timeout = options.timeoutMs || 180000;
  const spawn = options.spawn || spawnSync;

  if (!options.prompt) {
    return { available: true, ok: false, text: null, json: null, raw: null, error: 'empty prompt' };
  }

  if (options.spawn === undefined && !isAgentAvailable(command)) {
    return { available: false, ok: false, text: null, json: null, raw: null, error: 'claude CLI not found' };
  }

  const extraArgs = Array.isArray(options.extraArgs) ? options.extraArgs : [];
  let result;
  try {
    result = spawn(
      command,
      ['-p', options.prompt, '--output-format', 'json', ...extraArgs],
      { encoding: 'utf8', timeout, cwd: options.cwd, maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (error) {
    return { available: true, ok: false, text: null, json: null, raw: null, error: error.message };
  }

  if (result.error) {
    const missing = result.error.code === 'ENOENT';
    return {
      available: !missing,
      ok: false,
      text: null,
      json: null,
      raw: null,
      error: result.error.message,
    };
  }

  const stdout = result.stdout || '';
  // claude -p --output-format json 返回信封 { type:'result', result:'<assistant text>', is_error, ... }
  let text = stdout;
  const envelope = extractJsonObject(stdout);
  if (envelope && typeof envelope.result === 'string') {
    text = envelope.result;
  }

  // CLI 退出码可能为 0 但信封标记 is_error（最常见:未登录 / 配额 / API 错误）。
  // 这类情况下 result 是错误文案而非模型回答,必须当作 agent 调用失败,而不是“输出无法解析”。
  if (envelope && envelope.is_error) {
    return {
      available: true,
      ok: false,
      text,
      json: null,
      raw: stdout,
      error: `agent-error: ${text || 'unknown'}`,
    };
  }

  const json = extractJsonObject(text);

  return {
    available: true,
    ok: result.status === 0,
    text,
    json,
    raw: stdout,
    error: result.status === 0 ? null : (result.stderr || `exit ${result.status}`),
  };
}

module.exports = {
  isAgentAvailable,
  extractJsonObject,
  runAgent,
};
