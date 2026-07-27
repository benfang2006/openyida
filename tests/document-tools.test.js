'use strict';

const markdown = require('../lib/document/document-markdown');
const tingji = require('../lib/document/tingji');

describe('read-dingtalk-doc command', () => {
  test('uses the tianshu endpoint and docUrl parameter', async () => {
    const client = { get: jest.fn().mockResolvedValue('# Document') };
    const result = await markdown.fetchDocumentMarkdown(
      'https://alidocs.dingtalk.com/i/nodes/example',
      { client, authRef: {} }
    );

    expect(result).toBe('# Document');
    expect(client.get).toHaveBeenCalledWith(
      '/query/document/markdown.json',
      { docUrl: 'https://alidocs.dingtalk.com/i/nodes/example' },
      { responseType: 'text', timeout: 300000 }
    );
  });

  test('rejects non-http document URLs', () => {
    expect(() => markdown.validateDocUrl('file:///tmp/a.md')).toThrow('HTTP(S)');
  });

  test('unwraps the JSON text envelope returned by tianshu', () => {
    const response = JSON.stringify({
      success: true,
      content: '# Document\n\nBody',
      errorCode: '',
      errorMsg: '',
    });
    expect(markdown.unwrapMarkdownResponse(response)).toBe('# Document\n\nBody');
  });

  test('keeps direct Markdown and JSON-shaped document content unchanged', () => {
    expect(markdown.unwrapMarkdownResponse('# Direct Markdown')).toBe('# Direct Markdown');
    expect(markdown.unwrapMarkdownResponse('{"title":"JSON document"}'))
      .toBe('{"title":"JSON document"}');
  });

  test('turns a failed tianshu envelope into an error', () => {
    expect(() => markdown.unwrapMarkdownResponse(JSON.stringify({
      success: false,
      errorMsg: 'No permission',
    }))).toThrow('No permission');
  });

  test('parses output and json options', () => {
    expect(markdown.parseArgs(['https://example.com/doc', '--output', 'doc.md', '--json']))
      .toEqual({ docUrl: 'https://example.com/doc', output: 'doc.md', json: true, help: false });
  });
});

describe('read-dingtalk-tingji command', () => {
  test('uses the tianshu endpoint and taskUuid parameter', async () => {
    const detail = { title: 'Weekly meeting', paragraphs: [] };
    const client = { get: jest.fn().mockResolvedValue(detail) };
    const result = await tingji.fetchTingjiDetail('task-uuid-1', { client, authRef: {} });

    expect(result).toEqual(detail);
    expect(client.get).toHaveBeenCalledWith(
      '/query/document/tingji.json',
      { taskUuid: 'task-uuid-1' },
      { timeout: 300000 }
    );
  });

  test('unwraps a content envelope when present', async () => {
    const client = { get: jest.fn().mockResolvedValue({ success: true, content: { id: 1 } }) };
    await expect(tingji.fetchTingjiDetail('task-uuid-2', { client, authRef: {} }))
      .resolves.toEqual({ id: 1 });
  });

  test('rejects invalid task ID values', () => {
    expect(() => tingji.validateTaskUuid('bad\nvalue')).toThrow('invalid');
  });
});
