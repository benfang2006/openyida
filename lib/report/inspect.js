'use strict';

const { CliError } = require('../core/cli-error');
const { createAuthRef, isAuthRefReady } = require('../core/yida-client');
const { getReportSchema } = require('./http');
const {
  REPORT_DOMAIN_CODE,
  normalizeReportConfig,
  normalizeReportSchemaContent,
} = require('./contract');
const { requireSchemaServerRevision } = require('../core/server-revision');

function firstValue(...values) {
  return values.find(value => value !== null && value !== undefined && value !== '') ?? null;
}

function collectValuesByKey(value, targetKey, values = new Set()) {
  if (!value || typeof value !== 'object') {return values;}
  if (Array.isArray(value)) {
    value.forEach(item => collectValuesByKey(item, targetKey, values));
    return values;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === targetKey && typeof child === 'string' && child) {values.add(child);}
    collectValuesByKey(child, targetKey, values);
  }
  return values;
}

function visitNodes(node, callback) {
  if (!node || typeof node !== 'object') {return;}
  callback(node);
  if (Array.isArray(node.children)) {node.children.forEach(child => visitNodes(child, callback));}
}

function summarizeComponent(node) {
  const props = node.props && typeof node.props === 'object' ? node.props : {};
  const dataSetModelMap = props.dataSetModelMap && typeof props.dataSetModelMap === 'object'
    ? props.dataSetModelMap
    : {};
  return {
    componentName: node.componentName,
    cid: firstValue(props.cid, node.cid, node.id),
    fieldId: firstValue(props.fieldId, node.fieldId),
    dataSetKeys: Object.keys(dataSetModelMap).sort(),
    filterKeys: [...collectValuesByKey(dataSetModelMap, 'filterKey')].sort(),
    cubeCodes: [...collectValuesByKey(dataSetModelMap, 'cubeCode')].sort(),
  };
}

function summarizeReportSchema(value, context = {}) {
  const schema = normalizeReportSchemaContent(value);
  const revision = requireSchemaServerRevision(schema);
  const config = normalizeReportConfig(schema.config);
  const pages = Array.isArray(schema.pages) ? schema.pages : [];
  const firstPage = pages[0] || {};
  const firstTree = Array.isArray(firstPage.componentsTree) ? firstPage.componentsTree[0] : null;
  const components = [];
  visitNodes(firstTree, (node) => {
    if (typeof node.componentName === 'string' && node.componentName.startsWith('Youshu')) {
      components.push(summarizeComponent(node));
    }
  });

  return {
    success: true,
    operation: 'report.inspect',
    appType: context.appType || null,
    reportId: context.reportId || schema.id || null,
    schemaVersion: 'V5',
    domainCode: REPORT_DOMAIN_CODE,
    revision,
    prdId: firstValue(schema.prdId, config.prdId, firstPage.prdId, firstPage.props && firstPage.props.prdId),
    pageId: firstValue(schema.pageId, config.pageId, firstPage.pageId, firstPage.id),
    componentCount: components.length,
    components,
  };
}

function ensureSession() {
  const authRef = createAuthRef();
  if (!isAuthRefReady(authRef)) {
    throw new CliError('未获取到有效宜搭登录态，请先执行 openyida login', { code: 'NEED_LOGIN' });
  }
  return authRef;
}

async function run(args = []) {
  const filteredArgs = args.filter(arg => arg !== '--json');
  if (filteredArgs.length < 2) {
    throw new CliError('用法: openyida report inspect <appType> <reportId> --json', {
      code: 'REPORT_INSPECT_INVALID_ARGUMENTS',
    });
  }
  const [appType, reportId] = filteredArgs;
  const result = await getReportSchema(ensureSession(), appType, reportId);
  if (!result || result.success === false) {
    throw new CliError(result && result.errorMsg ? result.errorMsg : '读取报表 Schema 失败', {
      code: 'REPORT_INSPECT_READ_FAILED',
      details: result || { success: false, reportId },
    });
  }
  const summary = summarizeReportSchema(result, { appType, reportId });
  console.log(JSON.stringify(summary));
  return summary;
}

module.exports = Object.freeze({
  run,
  summarizeReportSchema,
});
