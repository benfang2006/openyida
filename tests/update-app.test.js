'use strict';

const {
  assertPresetThemeKey,
  BASIC_THEME_TOKEN_PRESETS,
  BASIC_THEME_TOKEN_PRESET_KEYS,
  POD_THEME_TOKEN_PRESETS,
  POD_THEME_TOKEN_PRESET_KEYS,
  getBasicThemeTokenPreset,
  getPodThemeTokenPreset,
  SUPPORTED_THEME_KEYS,
} = require('../lib/app/theme-presets');

const {
  parseArgs,
  hasShellUpdate,
  buildUpdateAppNamePostData,
  buildUpdateAppPostData,
} = require('../lib/app/update-app');

describe('update-app helpers', () => {
  test('parseArgs supports app shell theme flags', () => {
    expect(parseArgs([
      'APP_1',
      '--theme', 'podBlue',
      '--nav-theme', 'light',
      '--layout', 'ver',
      '--icon', 'xian-yingyong',
      '--icon-color', '#0089FF',
    ])).toMatchObject({
      appType: 'APP_1',
      colour: 'podBlue',
      navTheme: 'light',
      layoutDirection: 'ver',
      icon: 'xian-yingyong',
      iconColor: '#0089FF',
    });
  });

  test('theme presets list documents the only values accepted by --theme', () => {
    expect(SUPPORTED_THEME_KEYS).toContain('deepBlue');
    expect(SUPPORTED_THEME_KEYS).toContain('podBlue');
    expect(SUPPORTED_THEME_KEYS).toContain('black');
    expect(() => assertPresetThemeKey('customAmber')).toThrow('Unsupported theme: customAmber');
  });

  test('pod theme token presets are recommended and legacy basic token presets remain separate', () => {
    expect(POD_THEME_TOKEN_PRESET_KEYS).toEqual(['podBlue', 'podGreen', 'podOrange']);
    expect(POD_THEME_TOKEN_PRESET_KEYS.every((presetKey) => SUPPORTED_THEME_KEYS.includes(presetKey))).toBe(true);
    expect(getPodThemeTokenPreset('podBlue')).toMatchObject({
      '--color-brand1-1': 'rgb(51, 160, 255)',
      '--color-brand1-6': 'rgb(0, 137, 255)',
      '--color-brand-4': 'rgb(0, 109, 204)',
    });
    expect(POD_THEME_TOKEN_PRESETS).toHaveProperty('podOrange.--color-brand1-10', 'rgba(255, 111, 0, 0.3)');

    expect(BASIC_THEME_TOKEN_PRESET_KEYS).toEqual(['blue', 'green', 'orange']);
    BASIC_THEME_TOKEN_PRESET_KEYS.forEach((presetKey) => {
      expect(SUPPORTED_THEME_KEYS).not.toContain(presetKey);
    });
    expect(getBasicThemeTokenPreset('blue')).toMatchObject({
      '--color-brand1-1': 'rgb(51, 160, 255)',
      '--color-brand1-6': 'rgb(0, 137, 255)',
      '--color-brand-4': 'rgb(0, 109, 204)',
    });
    expect(getBasicThemeTokenPreset('green')).toMatchObject({
      '--color-brand1-1': 'rgb(60, 190, 113)',
      '--color-brand1-6': 'rgb(64, 179, 112)',
      '--color-brand-4': 'rgb(62, 170, 107)',
    });
    expect(getBasicThemeTokenPreset('orange')).toMatchObject({
      '--color-brand1-1': 'rgb(255, 125, 26)',
      '--color-brand1-6': 'rgb(255, 111, 0)',
      '--color-brand-4': 'rgb(242, 105, 0)',
    });
    expect(BASIC_THEME_TOKEN_PRESETS).toHaveProperty('blue.--color-brand1-10', 'rgba(0, 137, 255, 0.3)');
    expect(() => assertPresetThemeKey('blue')).toThrow('legacy basic token presets (blue, green, orange)');
  });

  test('detects shell updates that need updateApp instead of updateAppName', () => {
    expect(hasShellUpdate(parseArgs(['APP_1', '--name', '新名称']))).toBe(false);
    expect(hasShellUpdate(parseArgs(['APP_1', '--theme', 'podBlue']))).toBe(true);
    expect(hasShellUpdate(parseArgs(['APP_1', '--icon', 'xian-yingyong']))).toBe(true);
  });

  test('buildUpdateAppNamePostData keeps name-only updates on lightweight endpoint', () => {
    const payload = buildUpdateAppNamePostData(
      parseArgs(['APP_1', '--name', '业务门户']),
      { csrfToken: 'csrf' }
    );

    expect(payload).toMatchObject({
      _csrf_token: 'csrf',
      appType: 'APP_1',
    });
    expect(JSON.parse(payload.appName)).toMatchObject({
      zh_CN: '业务门户',
      pureEn_US: '业务门户',
    });
    expect(payload).not.toHaveProperty('colour');
  });

  test('buildUpdateAppPostData preserves app shell fields and writes accepted mode key', () => {
    const payload = buildUpdateAppPostData(
      parseArgs(['APP_1', '--theme', 'podBlue', '--icon', 'xian-yingyong', '--icon-color', '#0089FF']),
      {
        appName: { zh_CN: 'OpenYida官方Samples展示0716', en_US: 'Samples' },
        description: { zh_CN: '展示应用' },
        colour: 'black',
        icon: 'xian-yingyong%%#111827',
        mode: 'normal',
        type: 'single',
        navTheme: 'light',
        navType: 'top_side',
        navLayout: 'auto',
        layoutDirection: 'ver',
        showIcon: 'n',
        showNav: 'y',
        showCrumb: 'y',
        deviceType: 'web,mobile',
      },
      { csrfToken: 'csrf' }
    );

    expect(payload).toMatchObject({
      _csrf_token: 'csrf',
      appType: 'APP_1',
      appKey: 'APP_1',
      colour: 'podBlue',
      icon: 'xian-yingyong%%#0089FF',
      iconUrl: 'xian-yingyong%%#0089FF',
      mode: 'normal',
      type: 'single',
      navType: 'top_side',
      navLayout: 'auto',
      layoutDirection: 'ver',
    });
    expect(payload).not.toHaveProperty('appMode');
    expect(JSON.parse(payload.appName)).toMatchObject({
      zh_CN: 'OpenYida官方Samples展示0716',
    });
  });
});
