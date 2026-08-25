'use strict';

function normalizeSourceFormType(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (normalized === 'process' || normalized === 'process_form') {
    return 'process';
  }
  if (normalized === 'form' || normalized === 'receipt' || normalized === 'normal' || normalized === 'normal_form') {
    return 'receipt';
  }
  return '';
}

function resolveDataSourceFormType(node = {}, context = {}) {
  const explicitType = normalizeSourceFormType(
    node.formType || node.sourceFormType || node.originalType,
  );
  if (explicitType) {
    return explicitType;
  }

  const approvalEvent = Array.isArray(context.formEventTypes)
    && context.formEventTypes.some((eventType) => eventType === 'processFinish' || eventType === 'activityTask');
  if ((node.type === 'getSelf' || node.getSelf) && approvalEvent) {
    return 'process';
  }

  return normalizeSourceFormType(context.defaultFormType) || 'receipt';
}

function resolveDataOriginalType(sourceFormType) {
  return normalizeSourceFormType(sourceFormType) === 'process' ? 'process_form' : 'form';
}

function resolveDataFormItemType(sourceFormType) {
  return normalizeSourceFormType(sourceFormType) === 'process' ? 'process' : 'receipt';
}

function resolveDataQueryField(node = {}, sourceFormType) {
  if (node.queryField) {
    return node.queryField;
  }
  if (node.type === 'getSelf' || node.getSelf) {
    return normalizeSourceFormType(sourceFormType) === 'process' ? 'pid' : 'form_inst_id';
  }
  return '';
}

function resolveDesignerDataQueryField(node = {}, sourceFormType) {
  if (node.queryField) {
    return node.queryField;
  }
  if (node.type === 'getSelf' || node.getSelf) {
    return normalizeSourceFormType(sourceFormType) === 'process' ? 'proc_inst_id' : 'form_inst_id';
  }
  return '';
}

function resolveDataQueryFieldName(sourceFormType) {
  return normalizeSourceFormType(sourceFormType) === 'process' ? '流程实例ID' : '表单实例ID';
}

module.exports = {
  normalizeSourceFormType,
  resolveDataSourceFormType,
  resolveDataOriginalType,
  resolveDataFormItemType,
  resolveDataQueryField,
  resolveDesignerDataQueryField,
  resolveDataQueryFieldName,
};
