'use strict';

const querystring = require('querystring');

jest.mock('../lib/core/utils', () => ({
  httpGet: jest.fn(),
  httpPost: jest.fn(),
  requestWithAutoLogin: jest.fn(),
}));

jest.mock('../lib/core/yida-client', () => ({
  createAuthRef: jest.fn(),
}));

const utils = require('../lib/core/utils');
const yidaClient = require('../lib/core/yida-client');
const formDetailStyle = require('../lib/app/form-detail-style');

function createSchema() {
  return {
    pages: [
      {
        componentsMap: [
          { componentName: 'RootContent' },
          { componentName: 'FormContainer' },
          { componentName: 'TextField' },
        ],
        componentsTree: [
          {
            componentName: 'RootContent',
            id: 'root',
            css: 'body { color: #111; }',
            children: [
              {
                componentName: 'FormContainer',
                id: 'form',
                children: [
                  { componentName: 'TextField', id: 'text1', props: { fieldId: 'text1' } },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
}

const authRef = {
  baseUrl: 'https://www.aliwork.com',
  authData: { auth_mode: 'token' },
  authMode: 'token',
};

let logSpy;

beforeEach(() => {
  jest.clearAllMocks();
  utils.requestWithAutoLogin.mockImplementation((requestFn, ref) => requestFn(ref));
  yidaClient.createAuthRef.mockReturnValue(authRef);
  logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  logSpy.mockRestore();
  jest.restoreAllMocks();
});

describe('form-detail-style parseArgs', () => {
  test('parses apply arguments with defaults', () => {
    expect(formDetailStyle.parseArgs(['apply', 'APP_X', 'FORM_Y'])).toEqual({
      action: 'apply',
      appType: 'APP_X',
      formUuid: 'FORM_Y',
      cssFile: '',
      preset: 'clean-card',
      json: false,
    });
  });

  test('parses css file and json flag', () => {
    expect(formDetailStyle.parseArgs(['apply', 'APP_X', 'FORM_Y', '--css', 'detail.css', '--json'])).toMatchObject({
      cssFile: 'detail.css',
      json: true,
    });
  });
});

describe('form-detail-style schema helpers', () => {
  test('upsertFormDetailCss inserts a visible Html component and root css marker', () => {
    const schema = createSchema();
    const action = formDetailStyle.upsertFormDetailCss(schema, '/* yida-form-detail */ body { background: red; }');
    const status = formDetailStyle.inspectFormDetailCss(schema);

    expect(action).toBe('inserted');
    expect(status.installed).toBe(true);
    expect(status.rootCssHasMarker).toBe(true);
    expect(status.globalThemeFound).toBe(true);
    expect(status.rootCssHasGlobalTheme).toBe(true);
    const formContainer = schema.pages[0].componentsTree[0].children[0];
    expect(formContainer.children[0].id).toBe('yida-form-detail-css-html');
    expect(formContainer.children[0].hidden).toBe(false);
    expect(formContainer.children[0].props.content).toContain('<style id="yida-global-theme">');
    expect(formContainer.children[0].props.content).toContain('<style id="yida-form-detail-style">');
    expect(formContainer.children[0].props.content).toContain('--color-brand1-6');
    expect(schema.pages[0].componentsMap.map((item) => item.componentName)).not.toContain('Html');
  });

  test('upsertFormDetailCss updates the existing component instead of duplicating it', () => {
    const schema = createSchema();
    formDetailStyle.upsertFormDetailCss(schema, '/* yida-form-detail */ .a { color: red; }');
    const action = formDetailStyle.upsertFormDetailCss(schema, '/* yida-form-detail */ .a { color: blue; }');
    const formContainer = schema.pages[0].componentsTree[0].children[0];

    expect(action).toBe('updated');
    expect(formContainer.children.filter(item => item.id === 'yida-form-detail-css-html')).toHaveLength(1);
    expect(formContainer.children[0].props.content).toContain('blue');
  });

  test('removeFormDetailCss removes the Html component and marker block', () => {
    const schema = createSchema();
    formDetailStyle.upsertFormDetailCss(schema, '/* yida-form-detail */ .a { color: red; }');
    const action = formDetailStyle.removeFormDetailCss(schema);
    const status = formDetailStyle.inspectFormDetailCss(schema);

    expect(action).toBe('removed');
    expect(status.installed).toBe(false);
    expect(schema.pages[0].componentsTree[0].css).not.toContain('openyida:yida-form-detail');
    expect(schema.pages[0].componentsTree[0].css).not.toContain('openyida:yida-global-theme');
  });
});

describe('form-detail-style api calls', () => {
  test('check fetches schema without saving', async () => {
    utils.httpGet.mockResolvedValue({ success: true, content: createSchema(), gmtModified: 7 });

    const output = await formDetailStyle.run(['check', 'APP_X', 'FORM_Y', '--json']);

    expect(output.success).toBe(true);
    expect(output.installed).toBe(false);
    expect(utils.httpGet).toHaveBeenCalledWith(
      'https://www.aliwork.com',
      '/alibaba/web/APP_X/_view/query/formdesign/getFormSchema.json',
      { formUuid: 'FORM_Y', schemaVersion: 'V5' },
      expect.any(Object)
    );
    expect(utils.httpPost).not.toHaveBeenCalled();
  });

  test('apply saves schema and refreshes MINI_RESOURCE', async () => {
    utils.httpGet.mockResolvedValue({ success: true, content: createSchema(), gmtModified: 8 });
    utils.httpPost.mockResolvedValue({ success: true });

    const output = await formDetailStyle.run(['apply', 'APP_X', 'FORM_Y', '--json']);

    expect(output.success).toBe(true);
    expect(output.action).toBe('inserted');
    expect(utils.httpPost).toHaveBeenCalledTimes(2);
    expect(utils.httpPost.mock.calls[0][1]).toBe('/dingtalk/web/APP_X/_view/query/formdesign/saveFormSchema.json');
    const saveBody = querystring.parse(utils.httpPost.mock.calls[0][2]);
    expect(saveBody.formUuid).toBe('FORM_Y');
    expect(saveBody.schemaVersion).toBe('V5');
    expect(saveBody.importSchema).toBe('true');
    expect(saveBody.gmtModified).toBe('8');
    expect(saveBody.content).toContain('yida-form-detail-css-html');

    expect(utils.httpPost.mock.calls[1][1]).toBe('/dingtalk/web/APP_X/query/formdesign/updateFormConfig.json');
    const configBody = querystring.parse(utils.httpPost.mock.calls[1][2]);
    expect(configBody.configType).toBe('MINI_RESOURCE');
    expect(configBody.value).toBe('0');
  });
});
