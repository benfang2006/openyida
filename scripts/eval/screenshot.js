#!/usr/bin/env node

'use strict';

/**
 * 截取已发布宜搭页面的截图，供"应用效果"打分（自动或人工）。
 *
 * - Playwright 为软依赖：按 lib/auth/login.js 的多策略解析；缺失则优雅跳过，
 *   不让整个 E2E 失败。
 * - 注入与 E2E 同一份 .cache/cookies*.json，以渲染需登录的页面。
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

/**
 * 解析 playwright 模块路径（复刻 lib/auth/login.js getPlaywrightPath 策略）。
 * @returns {string|null}
 */
function getPlaywrightPath() {
  try {
    return require.resolve('playwright');
  } catch {
    // ignore
  }
  const candidates = [
    path.join(ROOT, 'node_modules', 'playwright', 'index.js'),
    path.join(__dirname, '..', '..', 'node_modules', 'playwright', 'index.js'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {return candidate;}
  }
  try {
    const globalRoot = execSync('npm root -g', { encoding: 'utf-8' }).trim();
    const globalPlaywright = path.join(globalRoot, 'playwright', 'index.js');
    if (fs.existsSync(globalPlaywright)) {return globalPlaywright;}
  } catch {
    // ignore
  }
  return null;
}

/**
 * 在 .cache 目录里找一份可用的 cookie 缓存文件。
 * @param {string} cacheDir
 * @returns {string|null}
 */
function findCookieFile(cacheDir = path.join(ROOT, 'project', '.cache')) {
  const preferred = ['cookies-public.json', 'cookies.json'];
  for (const name of preferred) {
    const p = path.join(cacheDir, name);
    if (fs.existsSync(p)) {return p;}
  }
  try {
    const match = fs.readdirSync(cacheDir).find((n) => /^cookies.*\.json$/.test(n));
    return match ? path.join(cacheDir, match) : null;
  } catch {
    return null;
  }
}

/**
 * 读取 cookie 缓存，返回 { cookies, baseUrl }。
 */
function loadCookies(cookieFile) {
  if (!cookieFile || !fs.existsSync(cookieFile)) {return { cookies: [], baseUrl: null };}
  try {
    const parsed = JSON.parse(fs.readFileSync(cookieFile, 'utf8'));
    const cookies = Array.isArray(parsed) ? parsed : (parsed.cookies || []);
    const baseUrl = (parsed && parsed.base_url) || null;
    return { cookies, baseUrl };
  } catch {
    return { cookies: [], baseUrl: null };
  }
}

/**
 * 把缓存的 cookie 规整为 Playwright addCookies 可接受的形态。
 */
function normalizeCookies(cookies, fallbackUrl) {
  return (cookies || [])
    .filter((c) => c && c.name && c.value !== undefined)
    .map((c) => {
      const out = { name: c.name, value: String(c.value) };
      if (c.domain) {
        out.domain = c.domain;
        out.path = c.path || '/';
      } else if (fallbackUrl) {
        out.url = fallbackUrl;
      }
      if (c.expires !== undefined) {out.expires = c.expires;}
      if (c.httpOnly !== undefined) {out.httpOnly = c.httpOnly;}
      if (c.secure !== undefined) {out.secure = c.secure;}
      if (c.sameSite && ['Strict', 'Lax', 'None'].includes(c.sameSite)) {out.sameSite = c.sameSite;}
      return out;
    });
}

function slugify(value, fallback) {
  const s = String(value || fallback || 'shot').replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return s || fallback || 'shot';
}

/**
 * 对一组目标 URL 截图。
 * @param {object} options
 * @param {Array<{stage:string,type:string,url:string}>} options.targets
 * @param {string} options.outputDir 截图输出目录
 * @param {string} [options.cookieFile]
 * @param {number} [options.timeoutMs]
 * @returns {Promise<{available:boolean, reason?:string, screenshots:Array}>}
 */
async function captureScreenshots(options = {}) {
  const targets = Array.isArray(options.targets) ? options.targets : [];
  const outputDir = options.outputDir || path.join(ROOT, 'project', '.cache', 'eval-screenshots');
  const timeoutMs = options.timeoutMs || 30000;

  if (targets.length === 0) {
    return { available: true, screenshots: [] };
  }

  const playwrightPath = getPlaywrightPath();
  if (!playwrightPath) {
    return {
      available: false,
      reason: 'playwright-missing',
      screenshots: targets.map((t) => ({ ...t, ok: false, skipped: 'playwright-missing', path: null })),
    };
  }

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const { chromium } = require(playwrightPath);
  fs.mkdirSync(outputDir, { recursive: true });

  const cookieFile = options.cookieFile || findCookieFile();
  const { cookies, baseUrl } = loadCookies(cookieFile);
  const fallbackUrl = baseUrl || (targets[0] && targets[0].url) || undefined;

  const screenshots = [];
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const normalized = normalizeCookies(cookies, fallbackUrl);
    if (normalized.length) {
      try {
        await context.addCookies(normalized);
      } catch (cookieError) {
        // cookie 注入失败不致命，截图可能落到登录页，由打分环节判定
        screenshots.cookieWarning = cookieError.message;
      }
    }

    for (let i = 0; i < targets.length; i += 1) {
      const target = targets[i];
      const fileName = `${String(i + 1).padStart(2, '0')}-${slugify(target.stage, target.type)}.png`;
      const filePath = path.join(outputDir, fileName);
      const page = await context.newPage();
      try {
        await page.goto(target.url, { waitUntil: 'networkidle', timeout: timeoutMs });
        await page.waitForTimeout(1500);
        await page.screenshot({ path: filePath, fullPage: true });
        screenshots.push({ ...target, ok: true, path: filePath });
      } catch (error) {
        screenshots.push({ ...target, ok: false, path: null, error: error.message });
      } finally {
        await page.close().catch(() => {});
      }
    }
  } catch (error) {
    return {
      available: false,
      reason: error.message,
      screenshots: targets.map((t) => ({ ...t, ok: false, error: error.message, path: null })),
    };
  } finally {
    if (browser) {await browser.close().catch(() => {});}
  }

  return { available: true, cookieFile, screenshots };
}

module.exports = {
  getPlaywrightPath,
  findCookieFile,
  loadCookies,
  normalizeCookies,
  slugify,
  captureScreenshots,
};
