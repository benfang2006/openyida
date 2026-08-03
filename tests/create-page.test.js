'use strict';

const querystring = require('querystring');
const { buildPageInfoPostData, parseArgs } = require('../lib/app/create-page');

describe('create-page locale handling', () => {
  test('parseArgs accepts content locale flags', () => {
    expect(parseArgs(['APP_X', '経営ダッシュボード', '--mode', 'dashboard', '--locale', 'ja'])).toMatchObject({
      appType: 'APP_X',
      pageName: '経営ダッシュボード',
      mode: 'dashboard',
      locale: 'ja',
      hideNav: false,
    });
  });

  test('parseArgs keeps navigation visible unless hidden explicitly', () => {
    expect(parseArgs(['APP_X', '经营看板', '--mode', 'dashboard'])).toMatchObject({
      mode: 'dashboard',
      hideNav: false,
    });
    expect(parseArgs(['APP_X', '经营看板', '--mode', 'dashboard', '--hide-nav'])).toMatchObject({
      mode: 'dashboard',
      hideNav: true,
    });
    expect(parseArgs(['APP_X', '经营看板', '--render-nav', 'false'])).toMatchObject({
      hideNav: true,
    });
    expect(parseArgs(['APP_X', '经营看板', '--isRenderNav=true'])).toMatchObject({
      hideNav: false,
    });
  });

  test('buildPageInfoPostData fills Japanese title instead of null', () => {
    const parsed = querystring.parse(buildPageInfoPostData('FORM_X', '経営ダッシュボード', false));
    const title = JSON.parse(parsed.title);

    expect(title).toMatchObject({
      type: 'i18n',
      zh_CN: '経営ダッシュボード',
      en_US: '経営ダッシュボード',
      pureEn_US: '経営ダッシュボード',
      ja_JP: '経営ダッシュボード',
    });
  });
});
