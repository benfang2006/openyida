'use strict';

const fs = require('fs');
const path = require('path');

const CREATE_FORM_PATH = path.join(__dirname, '..', 'lib', 'app', 'create-form.js');
const sourceCode = fs.readFileSync(CREATE_FORM_PATH, 'utf-8');
const createFormSplitSource = [
  'args.js',
  'commands.js',
  'definition-reader.js',
  'field-normalizers.js',
  'rule-builder.js',
  'schema-builder.js',
  'schema-patch.js',
  'validation-builder.js',
].map((file) => fs.readFileSync(path.join(__dirname, '..', 'lib', 'app', 'create-form', file), 'utf-8')).join('\n');
const combinedCreateFormSource = sourceCode + '\n' + createFormSplitSource;
const createForm = require('../lib/app/create-form');

// ── Bug #1: HTTP helpers must use master token auth / auto-login plumbing ──

describe('create-form.js imports', () => {
  test('uses token auth HTTP helpers while keeping auto-login wrapper', () => {
    expect(sourceCode).not.toContain("require('../core/yida-client')");
    const requireLine = sourceCode
      .split('\n')
      .find((line) => line.includes('require("../core/utils")') || line.includes("require('../core/utils')"));
    expect(requireLine).toBeDefined();
    expect(requireLine).toContain('loadAuthData');
    expect(requireLine).toContain('httpPost');
    expect(requireLine).toContain('httpGet');
    expect(requireLine).toContain('requestWithAutoLogin');
  });

  test('request wrappers delegate to token auth HTTP helpers', () => {
    const getBody = extractFunctionBody(sourceCode, 'sendGetRequest');
    const postBody = extractFunctionBody(sourceCode, 'sendPostRequest');
    const updateBody = extractFunctionBody(sourceCode, 'sendUpdateConfigRequest');
    expect(getBody).toContain('httpGet(baseUrl, requestPath, queryParams)');
    expect(postBody).toContain('httpPost(baseUrl, requestPath, postData');
    expect(updateBody).toMatch(/httpPost\(\s*baseUrl,/);
    expect(postBody).not.toContain('cookie');
    expect(updateBody).not.toContain('cookie');
  });
});

// ── Bug #2: generateFieldId 必须使用递增计数器确保唯一性 ──

describe('generateFieldId uniqueness', () => {
  test('generateFieldId uses an incrementing counter variable', () => {
    expect(sourceCode).toContain('_fieldIdCounter');
  });

  test('generateFieldId increments the counter on each call', () => {
    const functionBody = extractFunctionBody(sourceCode, 'generateFieldId');
    expect(functionBody).toBeDefined();
    expect(functionBody).toContain('_fieldIdCounter++');
  });

  test('counter value is included in the generated suffix', () => {
    const functionBody = extractFunctionBody(sourceCode, 'generateFieldId');
    expect(functionBody).toBeDefined();
    expect(functionBody).toContain('counterPart');
    expect(functionBody).toMatch(/suffix\s*=.*counterPart/);
  });
});

// ── Bug #3: buildFormSchema 必须包含 componentDidMount 生命周期 ──

describe('buildFormSchema lifeCycles', () => {
  test('lifeCycles includes componentDidMount with actionRef to didMount', () => {
    const formSchemaFunction = extractFunctionBody(sourceCode, 'buildFormSchema');
    expect(formSchemaFunction).toBeDefined();

    // 检查 lifeCycles 中包含 componentDidMount 配置
    expect(formSchemaFunction).toContain('componentDidMount');
    expect(formSchemaFunction).toContain("name: 'didMount'");
    expect(formSchemaFunction).toContain("type: 'actionRef'");
  });
});

// ── Bug #4: buildFormSchema 不能有重复嵌套的 FormContainer ──

describe('buildFormSchema FormContainer structure', () => {
  test('FormContainer does not nest another FormContainer as direct child', () => {
    const formSchemaFunction = extractFunctionBody(sourceCode, 'buildFormSchema');
    expect(formSchemaFunction).toBeDefined();

    const formContainerMatches = formSchemaFunction.match(/componentName:\s*['"]FormContainer['"]/g) || [];
    expect(formContainerMatches.length).toBe(1);
  });

  test('RootContent has exactly one FormContainer child', () => {
    const formSchemaFunction = extractFunctionBody(sourceCode, 'buildFormSchema');
    expect(formSchemaFunction).toBeDefined();

    const rootContentIndex = formSchemaFunction.search(/['"]RootContent['"]/);
    expect(rootContentIndex).toBeGreaterThan(-1);

    const afterRootContent = formSchemaFunction.slice(rootContentIndex);
    const formContainerCount = (afterRootContent.match(/componentName:\s*['"]FormContainer['"]/g) || []).length;
    expect(formContainerCount).toBe(1);
  });
});

describe('component alias schema support', () => {
  test('buildFormSchema writes component alias metadata at page level', () => {
    const formSchemaFunction = extractFunctionBody(sourceCode, 'buildFormSchema');
    expect(formSchemaFunction).toBeDefined();
    expect(sourceCode).toContain('function normalizeComponentAlias(');
    expect(sourceCode).toContain('function buildComponentAliasItems(');
    expect(formSchemaFunction).toContain('componentAliasItems');
    expect(formSchemaFunction).toContain('items: componentAliasItems');
  });

  test('field definitions accept alias and componentAlias without writing them into props', () => {
    expect(sourceCode).toContain('field.componentAlias');
    expect(sourceCode).toContain('field.component_alias');
    expect(sourceCode).toContain('field.alias');
    expect(sourceCode).toContain('component[COMPONENT_ALIAS_META]');
  });

  test('rules and validations can resolve component aliases as field refs', () => {
    expect(sourceCode).toContain('function buildComponentAliasMaps(');
    expect(sourceCode).toContain('aliasByFieldId');
    expect(sourceCode).toContain('fieldIdByAlias');
    expect(sourceCode).toContain('byRef[descriptor.alias]');
    expect(sourceCode).toContain('fieldMap[descriptor.alias]');
  });
});

describe('form presentation components', () => {
  test('buildFormSchema supports Divider, ColumnContainer and PageSection using vc-deep-yida component names', () => {
    const fields = [
      {
        type: 'PageSection',
        label: '基本信息',
        showHeadDivider: true,
        children: [
          {
            type: 'ColumnContainer',
            layout: '6:6',
            columnGap: '16px',
            rowGap: '16px',
            display: 'VERTICAL',
            children: [
              [{ type: 'TextField', label: '姓名' }],
              [{ type: 'NumberField', label: '年龄' }],
            ],
          },
          {
            type: 'Divider',
            title: '联系方式',
            dividerType: 'double-color-trapezoid',
            showTitle: true,
            colorType: 'custom',
            backgroundColor: '#0089ff',
            secondaryColor: '#cce5ff',
          },
        ],
      },
    ];

    const schema = createForm._private.buildFormSchema(
      '布局测试',
      fields,
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    const formContainer = findFormContainer(schema.pages[0].componentsTree[0]);

    expect(schema.pages[0].componentsMap.map((item) => item.componentName)).toEqual(expect.arrayContaining([
      'PageSection',
      'ColumnsLayout',
      'Column',
      'Divider',
      'TextField',
      'NumberField',
    ]));
    expect(formContainer.children[0]).toMatchObject({
      componentName: 'PageSection',
      props: {
        behavior: 'NORMAL',
        showHeader: true,
        showHeadDivider: true,
        sectionHeaderStyle: 'origin',
      },
    });
    expect(formContainer.children[0].props.label).toBeUndefined();
    expect(formContainer.children[0].props.title.zh_CN).toBe('基本信息');

    const columnsLayout = formContainer.children[0].children[0];
    expect(columnsLayout).toMatchObject({
      componentName: 'ColumnsLayout',
      props: {
        layout: '6:6',
        columnGap: '16px',
        rowGap: '16px',
        display: 'VERTICAL',
      },
    });
    expect(columnsLayout.children.map((child) => child.componentName)).toEqual(['Column', 'Column']);
    expect(columnsLayout.children[0].children[0].componentName).toBe('TextField');
    expect(columnsLayout.children[1].children[0].componentName).toBe('NumberField');

    const divider = formContainer.children[0].children[1];
    expect(divider).toMatchObject({
      componentName: 'Divider',
      props: {
        behavior: 'NORMAL',
        type: 'double-color-trapezoid',
        showTitle: true,
        colorType: 'custom',
        backgroundColor: '#0089ff',
        secondaryColor: '#cce5ff',
      },
    });
    expect(divider.props.label).toBeUndefined();
    expect(divider.props.title.zh_CN).toBe('联系方式');
  });

  test('counts only business fields inside presentation containers', () => {
    expect(createForm._private.countDataFieldDefinitions([
      { type: 'Divider', title: '分割线' },
      {
        type: 'GroupContainer',
        label: '分组',
        children: [
          {
            type: 'ColumnContainer',
            layout: '6:6',
            children: [
              [{ type: 'TextField', label: '姓名' }],
              [{ type: 'SelectField', label: '状态' }],
            ],
          },
        ],
      },
    ])).toBe(2);
  });

  test('Divider defaults to bold-with-thin so generated enterprise forms use the recommended section style', () => {
    const schema = createForm._private.buildFormSchema(
      '分割线测试',
      [{ type: 'Divider', title: '默认分割线' }],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    const formContainer = findFormContainer(schema.pages[0].componentsTree[0]);
    const divider = formContainer.children[0];

    expect(divider.componentName).toBe('Divider');
    expect(divider.props.type).toBe('bold-with-thin');
    expect(divider.props.title.zh_CN).toBe('默认分割线');
  });

  test('Divider only preserves supported type values and falls back to the priority default', () => {
    const schema = createForm._private.buildFormSchema(
      '分割线样式白名单测试',
      [
        { type: 'Divider', title: '品牌分组', dividerType: 'left-dot-title' },
        { type: 'Divider', title: '强分区', dividerType: 'multi-parallelograms-end' },
        { type: 'Divider', title: '旧样式', dividerType: 'solid-center' },
      ],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    const formContainer = findFormContainer(schema.pages[0].componentsTree[0]);

    expect(formContainer.children[0].props.type).toBe('left-dot-title');
    expect(formContainer.children[1].props.type).toBe('multi-parallelograms-end');
    expect(formContainer.children[2].props.type).toBe('bold-with-thin');
  });

  test('Divider forms inject yida global theme style on current and top documents', () => {
    const schema = createForm._private.buildFormSchema(
      '分割线主题测试',
      [{ type: 'Divider', title: '默认分割线' }],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    const root = schema.pages[0].componentsTree[0];

    expect(root.lifeCycles.componentDidMount).toMatchObject({
      name: 'openyidaDividerThemeDidMount',
      type: 'actionRef',
    });
    expect(schema.actions.list).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: 'openyidaDividerThemeDidMount',
        relatedEventId: 'lifecycle:didMount',
      }),
    ]));
    expect(schema.actions.module.source).toContain('openyida:divider-theme:start');
    expect(schema.actions.module.source).toContain('yida-global-theme');
    expect(schema.actions.module.source).toContain('window.top.document');
    expect(schema.actions.module.source).toContain('--color-brand1-9');
    expect(schema.actions.module.source).toContain("deepBlue: '#3954E4'");
    expect(schema.actions.module.compiled).toContain('openyidaDividerThemeDidMount');
  });

  test('forms without Divider do not inject divider theme action', () => {
    const schema = createForm._private.buildFormSchema(
      '普通字段测试',
      [{ type: 'TextField', label: '姓名' }],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );

    expect(schema.pages[0].componentsTree[0].lifeCycles.componentDidMount.name).toBe('didMount');
    expect(schema.actions.module.source).not.toContain('openyida:divider-theme:start');
    expect(schema.actions.module.source).not.toContain('yida-global-theme');
  });

  test('update add can insert presentation components inside nested containers', () => {
    const schema = createForm._private.buildFormSchema(
      '布局测试',
      [
        {
          type: 'ColumnContainer',
          layout: '6:6',
          children: [
            [{ type: 'TextField', label: '姓名' }],
            [{ type: 'TextField', label: '工号' }],
          ],
        },
      ],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    createForm._private.applyChangesToSchema(schema, [
      {
        action: 'add',
        after: '姓名',
        field: { type: 'Divider', title: '联系方式', dividerType: 'solid' },
      },
    ]);

    const formContainer = findFormContainer(schema.pages[0].componentsTree[0]);
    const firstColumnChildren = formContainer.children[0].children[0].children;
    expect(firstColumnChildren.map((child) => child.componentName)).toEqual(['TextField', 'Divider']);
    expect(firstColumnChildren[1].props.title.zh_CN).toBe('联系方式');
    expect(schema.pages[0].componentsMap.map((item) => item.componentName)).toContain('Divider');
  });

  test('update schemas get divider theme action after adding Divider', () => {
    const schema = createForm._private.buildFormSchema(
      '后续新增分割线',
      [{ type: 'TextField', label: '姓名' }],
      'FORM_TEST',
      'CORP_TEST',
      'APP_TEST',
      'single',
      'default',
      'top'
    );
    createForm._private.applyChangesToSchema(schema, [
      { action: 'add', field: { type: 'Divider', title: '联系方式' }, after: '姓名' },
    ]);

    const applied = createForm._private.ensureDividerThemeAction(schema);

    expect(applied).toBe(true);
    expect(schema.pages[0].componentsTree[0].lifeCycles.componentDidMount.name).toBe('openyidaDividerThemeDidMount');
    expect(schema.actions.module.source).toContain('openyida:divider-theme:start');
    expect(schema.actions.module.source).toContain('openyidaInjectDividerTheme');
  });
});

// ── JS 语法检查 ──

describe('create-form.js syntax', () => {
  test('passes Node.js syntax check', () => {
    const { execSync } = require('child_process');
    expect(() => {
      execSync('node --check ' + CREATE_FORM_PATH, { stdio: 'pipe' });
    }).not.toThrow();
  });
});

describe('create-form module API', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('exports run and parseArgs without executing the command on require', () => {
    expect(createForm).toEqual(expect.objectContaining({
      run: expect.any(Function),
      parseArgs: expect.any(Function),
    }));
  });

  test('parseArgs throws CliError for invalid usage instead of exiting', () => {
    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit should not be called');
    });
    jest.spyOn(process.stderr, 'write').mockImplementation(() => true);

    let thrown;
    try {
      createForm.parseArgs(['create', 'APP_XXX']);
    } catch (err) {
      thrown = err;
    }
    expect(thrown).toMatchObject({
      code: 'CREATE_FORM_INVALID_ARGUMENTS',
    });
    expect(exitSpy).not.toHaveBeenCalled();
  });

  test('parseArgs supports validation mode without process.argv mutation', () => {
    expect(createForm.parseArgs([
      'validation',
      'APP_XXX',
      'FORM_XXX',
      '.cache/openyida/forms/validations.json',
    ])).toMatchObject({
      mode: 'validation',
      appType: 'APP_XXX',
      formUuid: 'FORM_XXX',
      validationJsonOrFile: '.cache/openyida/forms/validations.json',
    });
  });
});

// ── 辅助函数：提取函数体 ──

function extractFunctionBody(source, functionName) {
  const pattern = new RegExp('function\\s+' + functionName + '\\s*\\(');
  const match = pattern.exec(source);
  if (!match) {return null;}

  let braceCount = 0;
  let started = false;
  const startIndex = match.index;

  for (let charIndex = match.index; charIndex < source.length; charIndex++) {
    if (source[charIndex] === '{') {
      braceCount++;
      started = true;
    } else if (source[charIndex] === '}') {
      braceCount--;
      if (started && braceCount === 0) {
        return source.slice(startIndex, charIndex + 1);
      }
    }
  }
  return null;
}

function findFormContainer(node) {
  if (node.componentName === 'FormContainer') {
    return node;
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      const found = findFormContainer(child);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

// ── add-option 模式 parseArgs 测试 ──────────────────

describe('add-option mode in source code', () => {
  test('parseArgs recognizes add-option mode', () => {
    expect(combinedCreateFormSource).toContain("mode === 'add-option'");
    expect(combinedCreateFormSource).toContain("if (mode === 'add-option')");
  });

  test('mainAddOption function is defined', () => {
    expect(sourceCode).toContain('async function mainAddOption(');
  });

  test('main routes to mainAddOption for add-option mode', () => {
    expect(combinedCreateFormSource).toContain("case 'add-option'");
    expect(sourceCode).toContain('addOption: mainAddOption');
  });

  test('add-option validates OPTION_FIELD_TYPES', () => {
    expect(sourceCode).toContain('OPTION_FIELD_TYPES.indexOf(targetComponent.componentName)');
  });

  test('add-option deduplicates options by value', () => {
    expect(sourceCode).toContain('existingValues.has(optionText)');
  });

  test('add-option appends to existing dataSource', () => {
    expect(sourceCode).toContain('existingDataSource.push(newItem)');
  });
});

describe('patch mode in source code', () => {
  test('parseArgs recognizes patch mode', () => {
    expect(combinedCreateFormSource).toContain("mode === 'patch'");
    expect(combinedCreateFormSource).toContain('patchJsonOrFile');
  });

  test('mainPatch function is defined and routed', () => {
    expect(sourceCode).toContain('async function mainPatch(');
    expect(combinedCreateFormSource).toContain("case 'patch'");
    expect(sourceCode).toContain('patch: mainPatch');
  });

  test('patch mode supports field props and JSON pointer operations', () => {
    expect(sourceCode).toContain("action === 'field-props'");
    expect(sourceCode).toContain('applyJsonPointerOperation(schema, operation)');
  });
});

describe('rule mode in source code', () => {
  test('parseArgs recognizes rule mode', () => {
    expect(combinedCreateFormSource).toContain("mode === 'rule'");
    expect(combinedCreateFormSource).toContain('rulesJsonOrFile');
  });

  test('mainRule function is defined and routed', () => {
    expect(sourceCode).toContain('async function mainRule(');
    expect(combinedCreateFormSource).toContain("case 'rule'");
    expect(sourceCode).toContain('rule: mainRule');
  });

  test('rule mode generates action source and binds field onChange', () => {
    expect(sourceCode).toContain('function applyFormRules(');
    expect(sourceCode).toContain('openyidaApplyRules');
    expect(sourceCode).toContain('openyidaRuleChange_');
    expect(sourceCode).toContain("const eventName = 'onChange'");
  });

  test('rule mode supports visibility and set value rules', () => {
    expect(sourceCode).toContain("type: 'visibility'");
    expect(sourceCode).toContain("type: 'setValue'");
    expect(sourceCode).toContain('openyidaRuleSetBehavior');
    expect(sourceCode).toContain('openyidaRuleSetValue');
    expect(sourceCode).toContain("operator: 'always'");
  });
});

describe('validation mode in source code', () => {
  test('parseArgs recognizes validation mode and add-validation inline options', () => {
    expect(combinedCreateFormSource).toContain("mode === 'validation'");
    expect(combinedCreateFormSource).toContain('inlineValidationRule');
    expect(combinedCreateFormSource).toContain('parseInlineValidationOptions');
  });

  test('validation mode uses native field validation first', () => {
    expect(sourceCode).toContain('function applySmartValidations(');
    expect(sourceCode).toContain('isNativeFieldValidationRule');
    expect(sourceCode).toContain('function resetGeneratedTextFieldValidationType');
    expect(sourceCode).toContain("field.props.validationType = 'text'");
    expect(sourceCode).not.toContain('field.props.validationType = rule.type');
    expect(sourceCode).toContain('found.field.props.validation = dedupeValidationRules');
    expect(sourceCode).toContain('customValidate');
    expect(sourceCode).toContain('cleanupLegacySmartValidationArtifacts');
  });

  test('smart validation emits native customValidate functions without submit hooks', () => {
    expect(sourceCode).toContain('function buildCustomValidateParam');
    expect(sourceCode).toContain("type: 'js'");
    expect(sourceCode).toContain('function validateRule(value, currentRule)');
    expect(sourceCode).toContain("=== 'idCard'");
    expect(sourceCode).toContain("=== 'bankCard'");
    expect(sourceCode).toContain("=== 'unifiedSocialCreditCode'");
    expect(sourceCode).toContain("=== 'compare'");
    expect(sourceCode).toContain("=== 'async'");
    expect(sourceCode).not.toContain('function buildSmartValidationActionSource');
  });

  test('create fields preserve validation definitions', () => {
    expect(sourceCode).toContain('normalizeFieldValidationRules(field)');
    expect(combinedCreateFormSource).toContain('normalizeDesignerValidationRule');
  });
});

describe('bind-datasource mode in source code', () => {
  test('parseArgs recognizes bind-datasource aliases', () => {
    expect(combinedCreateFormSource).toContain("mode === 'bind-datasource'");
    expect(combinedCreateFormSource).toContain("mode === 'datasource'");
    expect(combinedCreateFormSource).toContain('dataSourceJsonOrFile');
  });

  test('mainBindDataSource is defined and routed', () => {
    expect(sourceCode).toContain('async function mainBindDataSource(');
    expect(combinedCreateFormSource).toContain("case 'bind-datasource'");
    expect(sourceCode).toContain('bindDataSource: mainBindDataSource');
  });

  test('datasource binding updates searchConfig and defaultDataSource', () => {
    expect(combinedCreateFormSource).toContain('function applySelectDataSourceConfig(');
    expect(combinedCreateFormSource).toContain('props.searchConfig = {');
    expect(combinedCreateFormSource).toContain('props.defaultDataSource = Object.assign');
    expect(sourceCode).toContain("action: 'bind-datasource'");
  });
});
