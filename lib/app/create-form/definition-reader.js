'use strict';

function readJsonInput(value, options) {
  const { fs, path, error, missingMessage, inlineObject = false } = options;
  const text = String(value || '');
  const trimmed = text.trimStart();
  const isInline = trimmed.startsWith('[') || (inlineObject && trimmed.startsWith('{'));

  if (isInline) {
    return text;
  }

  const resolvedPath = path.resolve(text);
  if (!fs.existsSync(resolvedPath)) {
    error(missingMessage + resolvedPath);
  }
  return fs.readFileSync(resolvedPath, 'utf-8');
}

function createDefinitionReaders(dependencies) {
  const {
    fs,
    path,
    safeParseJson,
    error,
    t,
  } = dependencies;

  function readFieldsDefinition(fieldsJsonOrFile) {
    const rawContent = readJsonInput(fieldsJsonOrFile, {
      fs,
      path,
      error,
      inlineObject: true,
      missingMessage: t('create_form.fields_file_not_found'),
    });

    try {
      const parsed = safeParseJson(rawContent);

      let fields;
      let validations = [];
      let columns = 1;

      if (Array.isArray(parsed)) {
        fields = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        fields = parsed.fields || [];
        columns = parsed.columns !== undefined ? parsed.columns : 1;
        validations = Array.isArray(parsed.validations)
          ? parsed.validations
          : Array.isArray(parsed.rules)
            ? parsed.rules
            : [];
      } else {
        throw new Error(t('create_form.fields_format_invalid'));
      }

      if (!Array.isArray(fields) || fields.length === 0) {
        throw new Error(t('create_form.fields_must_be_array'));
      }

      return { fields, columns, validations };
    } catch (parseError) {
      error(t('create_form.fields_parse_failed') + parseError.message);
    }
  }

  function readChangesDefinition(changesJsonOrFile) {
    const rawContent = readJsonInput(changesJsonOrFile, {
      fs,
      path,
      error,
      missingMessage: t('create_form.changes_file_not_found'),
    });

    try {
      const changes = safeParseJson(rawContent);
      if (!Array.isArray(changes) || changes.length === 0) {
        throw new Error(t('create_form.changes_must_be_array'));
      }
      return changes;
    } catch (parseError) {
      error(t('create_form.changes_parse_failed') + parseError.message);
    }
  }

  function readPatchDefinition(patchJsonOrFile) {
    const rawContent = readJsonInput(patchJsonOrFile, {
      fs,
      path,
      error,
      inlineObject: true,
      missingMessage: '补丁文件不存在: ',
    });

    try {
      const patch = safeParseJson(rawContent);
      if (Array.isArray(patch)) {
        if (patch.length === 0) {
          throw new Error('补丁数组不能为空');
        }
        return patch;
      }
      if (patch && typeof patch === 'object') {
        if (Array.isArray(patch.operations)) {
          return patch.operations;
        }
        if (patch.action || patch.op) {
          return [patch];
        }
      }
      throw new Error('补丁必须是数组、{operations: []} 或单个操作对象');
    } catch (parseError) {
      error('补丁 JSON 解析失败: ' + parseError.message);
    }
  }

  function readRuleDefinition(rulesJsonOrFile) {
    const rawContent = readJsonInput(rulesJsonOrFile, {
      fs,
      path,
      error,
      inlineObject: true,
      missingMessage: '规则文件不存在: ',
    });

    try {
      const parsed = safeParseJson(rawContent);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          throw new Error('规则数组不能为空');
        }
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.rules)) {
          if (parsed.rules.length === 0) {
            throw new Error('rules 数组不能为空');
          }
          return parsed.rules;
        }
        if (parsed.type || parsed.action || parsed.when || parsed.target || parsed.targets) {
          return [parsed];
        }
      }
      throw new Error('规则必须是数组、{rules: []} 或单个规则对象');
    } catch (parseError) {
      error('规则 JSON 解析失败: ' + parseError.message);
    }
  }

  function readValidationDefinition(validationJsonOrFile, inlineRule) {
    if (inlineRule) {
      return [inlineRule];
    }

    const rawContent = readJsonInput(validationJsonOrFile, {
      fs,
      path,
      error,
      inlineObject: true,
      missingMessage: '校验规则文件不存在: ',
    });

    try {
      const parsed = safeParseJson(rawContent);
      if (Array.isArray(parsed)) {
        if (parsed.length === 0) {
          throw new Error('校验规则数组不能为空');
        }
        return parsed;
      }
      if (parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.validations)) {
          if (parsed.validations.length === 0) {
            throw new Error('validations 数组不能为空');
          }
          return parsed.validations;
        }
        if (Array.isArray(parsed.rules)) {
          if (parsed.rules.length === 0) {
            throw new Error('rules 数组不能为空');
          }
          return parsed.rules;
        }
        if (parsed.type || parsed.field || parsed.fieldId || parsed.target || parsed.when) {
          return [parsed];
        }
      }
      throw new Error('校验规则必须是数组、{validations: []}、{rules: []} 或单个规则对象');
    } catch (parseError) {
      error('校验规则 JSON 解析失败: ' + parseError.message);
    }
  }

  function readDataSourceDefinition(dataSourceJsonOrFile) {
    const rawContent = readJsonInput(dataSourceJsonOrFile, {
      fs,
      path,
      error,
      inlineObject: true,
      missingMessage: '数据源文件不存在: ',
    });

    try {
      const parsed = safeParseJson(rawContent);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('数据源配置必须是对象');
      }
      return parsed;
    } catch (parseError) {
      error('数据源 JSON 解析失败: ' + parseError.message);
    }
  }

  return {
    readFieldsDefinition,
    readChangesDefinition,
    readPatchDefinition,
    readRuleDefinition,
    readValidationDefinition,
    readDataSourceDefinition,
  };
}

module.exports = {
  createDefinitionReaders,
  readJsonInput,
};
