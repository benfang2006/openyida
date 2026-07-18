'use strict';

const {
  buildDingtalkOAuthUrl,
  resolveBrowserLauncher,
} = require('../lib/auth/oauth-loopback');

describe('resolveBrowserLauncher', () => {
  // A realistic OAuth URL: redirect_uri is the FIRST query param, so anything
  // that truncates at the first `&` loses client_id/scope/state.
  const oauthUrl = buildDingtalkOAuthUrl({
    clientId: 'suite9xvlxxerybljwheo',
    redirectUri: 'http://127.0.0.1:34882/oauth/callback',
    state: 'abc123',
    scope: 'openid corpid',
  });

  test('darwin passes the full URL as a single argument', () => {
    const { command, args } = resolveBrowserLauncher(oauthUrl, 'darwin');
    expect(command).toBe('open');
    expect(args).toEqual([oauthUrl]);
  });

  test('linux passes the full URL as a single argument', () => {
    const { command, args } = resolveBrowserLauncher(oauthUrl, 'linux');
    expect(command).toBe('xdg-open');
    expect(args).toEqual([oauthUrl]);
  });

  test('win32 uses rundll32 and never routes the URL through cmd', () => {
    const { command, args } = resolveBrowserLauncher(oauthUrl, 'win32');
    // The core of the fix: NOT cmd.exe, which would split the URL on `&`.
    expect(command).toBe('rundll32');
    expect(command).not.toBe('cmd');
    expect(args[0]).toBe('url.dll,FileProtocolHandler');
    // The URL must be a single, untouched argv element (not split on `&`).
    expect(args).toHaveLength(2);
    expect(args[1]).toBe(oauthUrl);
  });

  test('win32 preserves client_id and all params after the first &', () => {
    const { args } = resolveBrowserLauncher(oauthUrl, 'win32');
    const passedUrl = args[1];
    expect(passedUrl).toContain('&client_id=suite9xvlxxerybljwheo');
    expect(passedUrl).toContain('&response_type=code');
    expect(passedUrl).toContain('&scope=');
    expect(passedUrl).toContain('&state=abc123');
    // Simulate the old cmd truncation-at-first-& bug and prove we avoid it:
    const truncated = passedUrl.split('&')[0];
    expect(truncated).not.toContain('client_id');
    expect(passedUrl).not.toBe(truncated);
  });
});
