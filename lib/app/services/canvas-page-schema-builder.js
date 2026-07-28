'use strict';

const {
  createNodeIdGenerator,
  generateSuffix,
  getGlobalDataSourceFitConfig,
} = require('./native-page-schema-builder');
const {
  buildEmojiErrorMessage,
  findEmojiInValue,
} = require('../../core/no-emoji-detector');

const CANVAS_ACTIONS_SOURCE = 'export function didMount() {}';
const CANVAS_ACTIONS_COMPILED = '"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.didMount=didMount;function didMount(){}';
const CANVAS_PAGE_BASE_CSS = [
  'body{background-color:#f2f3f5}',
  '.vc-page-yida-page{--yida-form-content-padding:0;--yida-form-content-margin:0;--yida-layout-padding:0}',
  '.vc-deep-container-entry.vc-rootcontent{padding:0!important;margin-top:0!important;margin-right:0!important;margin-bottom:0!important;margin-left:0!important}',
  '.vc-deep-container-entry.vc-rootcontent :where(input,textarea,select,button,[role="button"],[tabindex],.ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-picker,.ant-input-number,.ant-btn,.ant-segmented,.ant-segmented-item,.ant-tabs-tab){font-family:inherit;letter-spacing:0}',
  '.vc-deep-container-entry.vc-rootcontent :where(input,textarea,select,.ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-picker,.ant-input-number){appearance:none;-webkit-appearance:none;outline:none!important;box-shadow:none!important}',
  '.vc-deep-container-entry.vc-rootcontent :where(input,textarea,select,.ant-input,.ant-input-affix-wrapper,.ant-select-selector,.ant-picker,.ant-input-number):focus,.vc-deep-container-entry.vc-rootcontent :where(.ant-select-focused .ant-select-selector,.ant-picker-focused,.ant-input-number-focused){border-color:var(--color-brand1-6,#2f6fed)!important;box-shadow:0 0 0 3px rgba(47,111,237,.14)!important;outline:none!important}',
  '.vc-deep-container-entry.vc-rootcontent :where(button,[role="button"],[tabindex],.ant-btn,.ant-segmented,.ant-segmented-item,.ant-tabs-tab):focus{outline:none!important}',
  '.vc-deep-container-entry.vc-rootcontent :where(button,[role="button"],[tabindex],.ant-btn,.ant-segmented-item,.ant-tabs-tab):focus-visible{outline:2px solid rgba(47,111,237,.28)!important;outline-offset:2px}',
].join('');

function buildCanvasPageSchemaContent(sourceCode, runtimeCode, importedModules, formUuid, options = {}) {
  return JSON.stringify(buildCanvasPageSchemaObject(
    sourceCode,
    runtimeCode,
    importedModules,
    formUuid,
    options
  ));
}

function buildCanvasPageSchemaObject(sourceCode, runtimeCode, importedModules, formUuid, options = {}) {
  const nextNodeId = resolveSchemaBuilderDependency(
    options.nextNodeId,
    createNodeIdGenerator,
    'nextNodeId'
  );
  const nextSuffix = resolveSchemaBuilderDependency(
    options.nextSuffix,
    () => generateSuffix,
    'nextSuffix'
  );
  const constructorCode = "function constructor() {\nvar module = { exports: {} };\nvar _this = this;\nthis.__initMethods__(module.exports, module);\nObject.keys(module.exports).forEach(function(item) {\n  if(typeof module.exports[item] === 'function'){\n    _this[item] = module.exports[item];\n  }\n});\n\n}";

  const schema = {
    schemaType: 'superform',
    schemaVersion: '5.0',
    pages: [
      {
        utils: [
          {
            name: 'legaoBuiltin',
            type: 'npm',
            content: { package: '@ali/vu-legao-builtin', version: '3.0.0', exportName: 'legaoBuiltin' },
          },
          {
            name: 'yidaPlugin',
            type: 'npm',
            content: { package: '@ali/vu-yida-plugin', version: '1.1.0', exportName: 'yidaPlugin' },
          },
        ],
        componentsMap: [
          { package: '@ali/vc-deep-yida', version: '1.5.169', componentName: 'YidaCodeCanvas' },
          { package: '@ali/vc-deep-yida', version: '1.5.169', componentName: 'RootHeader' },
          { package: '@ali/vc-deep-yida', version: '1.5.169', componentName: 'RootContent' },
          { package: '@ali/vc-deep-yida', version: '1.5.169', componentName: 'RootFooter' },
          { package: '@ali/vc-deep-yida', version: '1.5.169', componentName: 'Page' },
        ],
        componentsTree: [
          {
            componentName: 'Page',
            id: nextNodeId(),
            props: {
              contentBgColor: 'white',
              pageStyle: { backgroundColor: '#f2f3f5' },
              contentMargin: '0',
              contentPadding: '0',
              showTitle: false,
              contentPaddingMobile: '0',
              templateVersion: '1.0.0',
              contentMarginMobile: '0',
              className: 'page_' + nextSuffix(),
              contentBgColorMobile: 'white',
            },
            condition: true,
            css: CANVAS_PAGE_BASE_CSS,
            methods: {
              __initMethods__: {
                type: 'js',
                source: 'function (exports, module) { /*set actions code here*/ }',
                compiled: 'function (exports, module) { /*set actions code here*/ }',
              },
            },
            dataSource: {
              offline: [],
              globalConfig: getGlobalDataSourceFitConfig(),
              online: [],
              list: [],
              sync: true,
            },
            lifeCycles: {
              constructor: { type: 'js', compiled: constructorCode, source: constructorCode },
              componentWillUnmount: '',
              componentDidMount: { name: 'didMount', id: 'didMount', params: {}, type: 'actionRef' },
            },
            hidden: false,
            title: '',
            isLocked: false,
            conditionGroup: '',
            children: [
              {
                componentName: 'YidaCodeCanvas',
                id: nextNodeId(),
                props: {
                  code: sourceCode,
                  runtimeCode,
                  pageType: 'application',
                  isWebCCompiled: true,
                  componentProps: {},
                  importedModules: importedModules || '',
                },
                condition: true,
                hidden: false,
                title: '',
                isLocked: false,
                conditionGroup: '',
              },
            ],
          },
        ],
        id: formUuid,
        connectComponent: [],
      },
    ],
    actions: {
      module: { compiled: CANVAS_ACTIONS_COMPILED, source: CANVAS_ACTIONS_SOURCE },
      type: 'FUNCTION',
      list: [{ id: 'didMount', title: 'didMount' }],
    },
    config: { connectComponent: [] },
  };
  assertCanvasSchemaHasNoEmoji(schema, formUuid);
  return schema;
}

function assertCanvasSchemaHasNoEmoji(schema, formUuid) {
  const artifact = 'canvas page schema ' + formUuid;
  const issues = findEmojiInValue(schema, {
    artifact,
  });
  if (issues.length === 0) {
    return;
  }

  const error = new Error(buildEmojiErrorMessage(issues, { artifact }));
  error.code = 'OPENYIDA_PAGE_SCHEMA_EMOJI_FORBIDDEN';
  error.details = { artifact, issues };
  throw error;
}

function resolveSchemaBuilderDependency(value, createDefault, property) {
  if (value === undefined) {
    return createDefault();
  }
  if (typeof value !== 'function') {
    throw new TypeError(`buildCanvasPageSchemaContent ${property} must be a function`);
  }
  return value;
}

module.exports = Object.freeze({
  CANVAS_ACTIONS_COMPILED,
  CANVAS_ACTIONS_SOURCE,
  CANVAS_PAGE_BASE_CSS,
  buildCanvasPageSchemaContent,
  buildCanvasPageSchemaObject,
});
