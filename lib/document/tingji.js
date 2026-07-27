'use strict';

const { createAuthRef, createYidaClient } = require('../core/yida-client');
const { throwUsage } = require('../core/command-errors');

const API_PATH = '/query/document/tingji.json';

function parseArgs(args) {
  const parsed = { taskUuid: '', help: false };
  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--json') {
      continue;
    } else if (!arg.startsWith('--') && !parsed.taskUuid) {
      parsed.taskUuid = arg;
    } else {
      throwUsage('Usage: openyida read-dingtalk-tingji <taskUuid> [--json]');
    }
  }
  return parsed;
}

function validateTaskUuid(taskUuid) {
  const normalized = String(taskUuid || '').trim();
  if (!normalized) {
    throwUsage('Usage: openyida read-dingtalk-tingji <taskUuid> [--json]');
  }
  if (normalized.length > 256 || /[\r\n]/.test(normalized)) {
    throw new Error('taskUuid is invalid');
  }
  return normalized;
}

async function fetchTingjiDetail(taskUuid, options = {}) {
  const authRef = options.authRef || createAuthRef();
  const client = options.client || createYidaClient({ authRef });
  const response = await client.get(API_PATH, { taskUuid: validateTaskUuid(taskUuid) }, {
    timeout: options.timeout || 300000,
  });
  if (!response || response.success === false || response.__needLogin || response.__csrfExpired) {
    const detail = response && (response.errorMsg || response.message);
    throw new Error(detail || 'Failed to fetch Tingji detail');
  }
  return response.content !== undefined ? response.content : response;
}

async function run(args) {
  const parsed = parseArgs(args);
  if (parsed.help) {
    console.log('Usage: openyida read-dingtalk-tingji <taskUuid> [--json]');
    return { help: true };
  }
  const taskUuid = validateTaskUuid(parsed.taskUuid);
  const detail = await fetchTingjiDetail(taskUuid);
  const result = { success: true, taskUuid, detail };
  console.log(JSON.stringify(result, null, 2));
  return result;
}

module.exports = { API_PATH, parseArgs, validateTaskUuid, fetchTingjiDetail, run };
