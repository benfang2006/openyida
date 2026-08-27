'use strict';

const {
  REPORT_DOMAIN_CODE,
  assertReportSchemaReadback,
  collectReportI18nKeys,
  normalizeReportSchemaContent,
  normalizeReportConfig,
  prepareReportSchemaForSave,
} = require('../lib/report/contract');

function buildSchema(overrides = {}) {
  return {
    id: 'REPORT_1',
    gmtModified: 100,
    i18nData: [{ key: 'legacy' }],
    config: { existing: true },
    pages: [{
      componentsTree: [{
        componentName: 'Page',
        data: { key: 'page-title' },
        children: [{
          componentName: 'Chart',
          data: { key: 'i18n-runtime-owned' },
          children: [{
            componentName: 'Filter',
            data: { key: 'filter-title' },
          }],
        }],
      }],
    }],
    ...overrides,
  };
}

describe('report frontend contract', () => {
  test('uses the report designer domain contract', () => {
    expect(REPORT_DOMAIN_CODE).toBe('tEXDRG');
  });

  test('collects unique non-runtime i18n keys from component data', () => {
    expect(collectReportI18nKeys(buildSchema())).toEqual([
      'page-title',
      'filter-title',
    ]);
  });

  test('prepares a cloned schema like the frontend save path', () => {
    const original = buildSchema();
    const prepared = prepareReportSchemaForSave(original);

    expect(prepared).not.toBe(original);
    expect(prepared).not.toHaveProperty('i18nData');
    expect(prepared.config).toEqual({
      existing: true,
      i18nKeyList: ['page-title', 'filter-title'],
    });
    expect(original).toHaveProperty('i18nData');
  });

  test('normalizes string and response-wrapped schema content', () => {
    const schema = buildSchema();
    expect(normalizeReportSchemaContent({ content: JSON.stringify(schema) })).toEqual(schema);
  });

  test('normalizes a JSON-string report config and rejects malformed config', () => {
    expect(normalizeReportConfig('{"existing":true}')).toEqual({ existing: true });
    expect(() => normalizeReportConfig('{')).toThrow(expect.objectContaining({
      code: 'REPORT_SCHEMA_CONFIG_INVALID',
    }));
  });

  test('readback ignores the server revision but requires exact saved content', () => {
    const expected = prepareReportSchemaForSave(buildSchema());
    const actual = { ...expected, gmtModified: 101 };

    expect(assertReportSchemaReadback(expected, actual)).toMatchObject({
      verificationLevel: 'strict-schema-content',
      omitted: [
        { path: '$.gmtModified', reason: 'server-owned revision' },
        { path: '$.i18nData', reason: 'server-owned localization materialization' },
        { path: '$.status', reason: 'server-owned publication status' },
      ],
      projection: { pages: expected.pages },
    });
  });

  test('readback accepts only explicit top-level platform normalization without weakening runtime fields', () => {
    const expected = prepareReportSchemaForSave(buildSchema({
      pages: [{
        css: 'body { color: red; }',
        utils: [{ name: 'runtimeUtil' }],
        componentsTree: [{
          componentName: 'Page',
          lifeCycles: { componentDidMount: 'mount-v1' },
          props: { height: null, visible: true },
          children: [{
            componentName: 'Chart',
            data: { cubeCode: 'FORM_1', fieldCode: 'numberField_1', aggregateType: 'SUM' },
          }],
        }],
      }],
    }));
    const actual = {
      ...expected,
      status: 'PUBLISHED',
      gmtModified: 101,
      i18nData: [{ key: 'server-owned' }],
      config: JSON.stringify(expected.config),
      pages: [{
        css: 'body { color: red; }',
        utils: [{ name: 'runtimeUtil' }],
        componentsTree: [{
          componentName: 'Page',
          lifeCycles: { componentDidMount: 'mount-v1' },
          props: { height: null, visible: true },
          children: [{
            componentName: 'Chart',
            data: { cubeCode: 'FORM_1', fieldCode: 'numberField_1', aggregateType: 'SUM' },
          }],
        }],
      }],
    };

    expect(() => assertReportSchemaReadback(expected, actual)).not.toThrow();
    actual.pages[0].css = 'body { color: blue; }';
    expect(() => assertReportSchemaReadback(expected, actual)).toThrow(expect.objectContaining({
      code: 'REPORT_SCHEMA_READBACK_MISMATCH',
    }));
    actual.pages[0].css = 'body { color: red; }';
    actual.pages[0].componentsTree[0].children[0].data.aggregateType = 'COUNT';
    expect(() => assertReportSchemaReadback(expected, actual)).toThrow(expect.objectContaining({
      code: 'REPORT_SCHEMA_READBACK_MISMATCH',
    }));
  });

  test('readback mismatch fails closed with a stable code', () => {
    const expected = prepareReportSchemaForSave(buildSchema());
    const actual = {
      ...expected,
      pages: [{ componentsTree: [] }],
      gmtModified: 101,
    };

    expect(() => assertReportSchemaReadback(expected, actual)).toThrow(expect.objectContaining({
      code: 'REPORT_SCHEMA_READBACK_MISMATCH',
    }));
  });
});
