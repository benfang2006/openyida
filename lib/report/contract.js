'use strict';

const { isDeepStrictEqual } = require('util');

const REPORT_DOMAIN_CODE = 'tEXDRG';

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeReportConfig(config) {
  if (typeof config !== 'string') {
    return config && typeof config === 'object' && !Array.isArray(config) ? config : {};
  }
  try {
    const parsed = JSON.parse(config);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch (cause) {
    const error = new Error('REPORT_SCHEMA_CONFIG_INVALID');
    error.code = 'REPORT_SCHEMA_CONFIG_INVALID';
    error.cause = cause;
    throw error;
  }
}

function normalizeReportSchemaContent(value) {
  let schema = value && Object.prototype.hasOwnProperty.call(value, 'content')
    ? value.content
    : value;
  if (typeof schema === 'string') {
    try {
      schema = JSON.parse(schema);
    } catch (cause) {
      const error = new Error('REPORT_SCHEMA_CONTENT_INVALID');
      error.code = 'REPORT_SCHEMA_CONTENT_INVALID';
      error.cause = cause;
      throw error;
    }
  }
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    const error = new Error('REPORT_SCHEMA_CONTENT_INVALID');
    error.code = 'REPORT_SCHEMA_CONTENT_INVALID';
    throw error;
  }
  return schema;
}

function visitComponentNodes(node, callback) {
  if (!node || typeof node !== 'object') {
    return;
  }
  callback(node);
  if (Array.isArray(node.children)) {
    node.children.forEach((child) => visitComponentNodes(child, callback));
  }
}

function collectReportI18nKeys(schema) {
  const keys = [];
  const seen = new Set();
  const pages = schema && Array.isArray(schema.pages) ? schema.pages : [];

  pages.forEach((page) => {
    const trees = page && Array.isArray(page.componentsTree) ? page.componentsTree : [];
    trees.forEach((tree) => visitComponentNodes(tree, (node) => {
      const key = node && node.data && node.data.key;
      if (typeof key !== 'string' || key.length === 0 || key.startsWith('i18n') || seen.has(key)) {
        return;
      }
      seen.add(key);
      keys.push(key);
    }));
  });

  return keys;
}

function prepareReportSchemaForSave(schema, options = {}) {
  const prepared = cloneJson(normalizeReportSchemaContent(schema));
  delete prepared.i18nData;
  prepared.config = normalizeReportConfig(prepared.config);

  const i18nKeys = collectReportI18nKeys(prepared);
  if (i18nKeys.length > 0) {
    prepared.config.i18nKeyList = i18nKeys;
  } else {
    delete prepared.config.i18nKeyList;
  }

  if (options.serverRevision !== undefined) {
    prepared.gmtModified = options.serverRevision;
  }
  return prepared;
}

const REPORT_READBACK_OMITTED = Object.freeze([
  Object.freeze({ path: '$.gmtModified', reason: 'server-owned revision' }),
  Object.freeze({ path: '$.i18nData', reason: 'server-owned localization materialization' }),
  Object.freeze({ path: '$.status', reason: 'server-owned publication status' }),
]);

function canonicalizeReportValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => canonicalizeReportValue(item));
  }
  if (!value || typeof value !== 'object') {
    return value;
  }

  const result = {};
  Object.keys(value).sort().forEach((key) => {
    result[key] = canonicalizeReportValue(value[key]);
  });
  return result;
}

function projectReportSchema(schema) {
  const projected = cloneJson(normalizeReportSchemaContent(schema));
  projected.config = normalizeReportConfig(projected.config);
  delete projected.gmtModified;
  delete projected.i18nData;
  delete projected.status;
  return canonicalizeReportValue(projected);
}

function assertReportSchemaReadback(expected, actual) {
  const expectedProjection = projectReportSchema(expected);
  const actualProjection = projectReportSchema(actual);
  if (isDeepStrictEqual(expectedProjection, actualProjection)) {
    return {
      verificationLevel: 'strict-schema-content',
      omitted: REPORT_READBACK_OMITTED.map(entry => ({ ...entry })),
      projection: actualProjection,
    };
  }

  const error = new Error('REPORT_SCHEMA_READBACK_MISMATCH');
  error.name = 'ReportSchemaReadbackError';
  error.code = 'REPORT_SCHEMA_READBACK_MISMATCH';
  error.details = {
    verificationLevel: 'strict-schema-content',
    omitted: REPORT_READBACK_OMITTED.map(entry => ({ ...entry })),
  };
  throw error;
}

module.exports = {
  REPORT_DOMAIN_CODE,
  REPORT_READBACK_OMITTED,
  assertReportSchemaReadback,
  collectReportI18nKeys,
  normalizeReportSchemaContent,
  normalizeReportConfig,
  prepareReportSchemaForSave,
  projectReportSchema,
};
