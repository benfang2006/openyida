'use strict';

const fs = require('fs');
const path = require('path');
const { createAuthRef, createYidaClient } = require('../core/yida-client');
const { throwUsage } = require('../core/command-errors');

const API_PATH = '/query/document/markdown.json';

function parseArgs(args) {
  const parsed = { docUrl: '', output: '', json: false, help: false };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
    } else if (arg === '--json') {
      parsed.json = true;
    } else if ((arg === '--output' || arg === '-o') && args[index + 1]) {
      parsed.output = args[++index];
    } else if (!arg.startsWith('--') && !parsed.docUrl) {
      parsed.docUrl = arg;
    } else {
      throwUsage('Usage: openyida read-dingtalk-doc <docUrl> [--output <file>] [--json]');
    }
  }
  return parsed;
}

function validateDocUrl(docUrl) {
  if (!docUrl) {
    throwUsage('Usage: openyida read-dingtalk-doc <docUrl> [--output <file>] [--json]');
  }
  let parsed;
  try {
    parsed = new URL(docUrl);
  } catch {
    throw new Error('docUrl must be a valid HTTP(S) URL');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('docUrl must be a valid HTTP(S) URL');
  }
  return parsed.toString();
}

function unwrapMarkdownResponse(response) {
  if (typeof response !== 'string') {
    const detail = response && (response.errorMsg || response.message);
    throw new Error(detail || 'Failed to fetch document Markdown');
  }

  const trimmed = response.trim();
  if (!trimmed.startsWith('{')) {
    return response;
  }

  let parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    return response;
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return response;
  }
  if (parsed.success === false) {
    throw new Error(parsed.errorMsg || parsed.message || 'Failed to fetch document Markdown');
  }
  if (typeof parsed.content === 'string') {
    return parsed.content;
  }
  return response;
}

async function fetchDocumentMarkdown(docUrl, options = {}) {
  const authRef = options.authRef || createAuthRef();
  const client = options.client || createYidaClient({ authRef });
  const response = await client.get(API_PATH, { docUrl: validateDocUrl(docUrl) }, {
    responseType: 'text',
    timeout: options.timeout || 300000,
  });
  return unwrapMarkdownResponse(response);
}

async function run(args) {
  const parsed = parseArgs(args);
  if (parsed.help) {
    console.log('Usage: openyida read-dingtalk-doc <docUrl> [--output <file>] [--json]');
    return { help: true };
  }
  const docUrl = validateDocUrl(parsed.docUrl);
  const content = await fetchDocumentMarkdown(docUrl);
  if (parsed.output) {
    const outputPath = path.resolve(parsed.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, content, 'utf8');
    const result = { success: true, docUrl, output: outputPath, length: content.length };
    console.log(JSON.stringify(result, null, 2));
    return result;
  }
  const result = { success: true, docUrl, content };
  console.log(parsed.json ? JSON.stringify(result, null, 2) : content);
  return result;
}

module.exports = {
  API_PATH,
  parseArgs,
  validateDocUrl,
  unwrapMarkdownResponse,
  fetchDocumentMarkdown,
  run,
};
