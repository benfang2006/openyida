'use strict';

const { CliError } = require('../core/cli-error');
const { t } = require('../core/i18n');
const { listAllLogicflows } = require('./integration-check');
const { getLogicflowDetail } = require('./integration-api');

function parseJsonObject(value) {
  if (typeof value === 'string') {
    if (!value.trim()) { return null; }
    try {
      return parseJsonObject(JSON.parse(value));
    } catch (_error) {
      return null;
    }
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value;
}

function extractNonEmptyDetail(response) {
  const wrapper = parseJsonObject(response);
  if (!wrapper) { return null; }
  const detail = Object.prototype.hasOwnProperty.call(wrapper, 'content')
    ? parseJsonObject(wrapper.content)
    : wrapper;
  if (!detail || Object.keys(detail).length === 0) {
    return null;
  }
  return detail;
}

function readbackError(code, message, details) {
  return new CliError(message, { code, details });
}

async function verifyLogicflowFinalState(authRef, input, dependencies = {}) {
  const listAll = dependencies.listAllLogicflows || listAllLogicflows;
  const getDetail = dependencies.getLogicflowDetail || getLogicflowDetail;
  const flows = await listAll(authRef, input.appType, {
    pageSize: 50,
    formUuid: input.formUuid,
  });
  const matches = flows.filter((flow) => (
    flow
      && flow.processCode === input.processCode
      && flow.formUuid === input.formUuid
  ));
  if (matches.length !== 1) {
    throw readbackError(
      'INTEGRATION_READBACK_EXACT_MATCH_FAILED',
      t('integration.readback_exact_match_failed', input.processCode),
      { processCode: input.processCode, formUuid: input.formUuid, exactMatchCount: matches.length }
    );
  }

  const flow = matches[0];
  if (input.expectedStatus && flow.status !== input.expectedStatus) {
    throw readbackError(
      'INTEGRATION_READBACK_STATUS_MISMATCH',
      t('integration.readback_status_mismatch', input.expectedStatus, flow.status || '<empty>'),
      {
        processCode: input.processCode,
        formUuid: input.formUuid,
        expectedStatus: input.expectedStatus,
        actualStatus: flow.status || '',
      }
    );
  }

  let response;
  try {
    response = await getDetail(authRef, {
      appType: input.appType,
      formUuid: input.formUuid,
      processCode: input.processCode,
    });
  } catch (error) {
    throw readbackError(
      'INTEGRATION_READBACK_DETAIL_UNVERIFIED',
      t('integration.readback_detail_failed', error.message),
      { processCode: input.processCode, formUuid: input.formUuid }
    );
  }
  const detail = extractNonEmptyDetail(response);
  if (!detail) {
    throw readbackError(
      'INTEGRATION_READBACK_DETAIL_UNVERIFIED',
      t('integration.readback_detail_empty', input.processCode),
      { processCode: input.processCode, formUuid: input.formUuid }
    );
  }

  return {
    verificationLevel: 'PLATFORM_LIST_DETAIL_EXACT',
    processCode: input.processCode,
    formUuid: input.formUuid,
    status: flow.status,
    exactMatchCount: 1,
    detailReadback: true,
    detailKeys: Object.keys(detail).sort(),
  };
}

module.exports = {
  extractNonEmptyDetail,
  verifyLogicflowFinalState,
};
