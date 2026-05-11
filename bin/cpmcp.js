#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function toBase64(value) {
  return Buffer.from(value).toString('base64');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function createEmbeddedImageDataUrl() {
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180" fill="none">',
    '<rect width="320" height="180" rx="24" fill="#0B0D12"/>',
    '<path d="M0 132C72 76 124 77 189 86C247 95 282 86 320 57V180H0V132Z" fill="#ED1C24" fill-opacity="0.92"/>',
    '<path d="M41 43H145" stroke="#ED1C24" stroke-width="12" stroke-linecap="round"/>',
    '<path d="M41 73H121" stroke="#ED1C24" stroke-width="12" stroke-linecap="round" opacity="0.82"/>',
    '<path d="M217 40L250 56V89C250 112 233 128 217 136C201 128 184 112 184 89V56L217 40Z" fill="#11151C" stroke="#F5F7FA" stroke-width="4"/>',
    '<path d="M217 62V111" stroke="#ED1C24" stroke-width="8" stroke-linecap="round"/>',
    '<path d="M193 88H241" stroke="#ED1C24" stroke-width="8" stroke-linecap="round"/>',
    '<circle cx="270" cy="48" r="10" fill="#F5F7FA" fill-opacity="0.14"/>',
    '<circle cx="292" cy="72" r="6" fill="#F5F7FA" fill-opacity="0.2"/>',
    '</svg>',
  ].join('');

  return `data:image/svg+xml;base64,${toBase64(svg)}`;
}

function buildDialogHtml(message, configPath) {
  const embeddedImage = createEmbeddedImageDataUrl();
  const statusLabel = configPath ? 'Configuration detected' : 'No installation detected';
  const description = configPath
    ? 'Claude Desktop configuration was found on this device.'
    : 'Claude Desktop configuration was not found on this device.';

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<title>cpmcp</title>',
    '<style>',
    ':root { color-scheme: light; }',
    '* { box-sizing: border-box; }',
    'body { margin: 0; min-height: 100vh; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; background: linear-gradient(180deg, #f4f6f8 0%, #e9edf2 100%); color: #101318; }',
    '.shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; }',
    '.dialog { width: min(100%, 560px); overflow: hidden; border-radius: 28px; background: #ffffff; border: 1px solid rgba(8, 10, 14, 0.08); box-shadow: 0 28px 90px rgba(9, 14, 24, 0.18); }',
    '.hero { position: relative; padding: 28px 28px 18px; background: linear-gradient(135deg, #ffffff 0%, #f7f9fb 48%, #eef2f6 100%); }',
    '.eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 999px; background: rgba(237, 28, 36, 0.08); color: #9f1218; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }',
    '.eyebrow::before { content: ""; width: 8px; height: 8px; border-radius: 999px; background: #ed1c24; box-shadow: 0 0 0 6px rgba(237, 28, 36, 0.12); }',
    '.hero-grid { margin-top: 18px; display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(220px, 0.85fr); gap: 20px; align-items: center; }',
    'h1 { margin: 0; font-size: 31px; line-height: 1.02; letter-spacing: -0.04em; font-weight: 800; }',
    '.summary { margin: 14px 0 0; color: #4e5661; font-size: 15px; line-height: 1.6; max-width: 30ch; }',
    '.visual { width: 100%; border-radius: 24px; display: block; border: 1px solid rgba(8, 10, 14, 0.06); }',
    '.content { padding: 0 28px 28px; }',
    '.panel { background: #0d1117; border-radius: 24px; padding: 20px; color: #f5f7fa; }',
    '.status { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 14px; }',
    '.status-label { font-size: 14px; font-weight: 700; letter-spacing: 0.01em; }',
    '.pill { flex: 0 0 auto; padding: 7px 12px; border-radius: 999px; background: rgba(237, 28, 36, 0.16); color: #ffd6d7; font-size: 12px; font-weight: 700; }',
    '.path { margin: 0; padding: 16px; min-height: 98px; border-radius: 18px; background: #161b22; border: 1px solid rgba(255, 255, 255, 0.08); color: #f5f7fa; font-size: 14px; line-height: 1.6; word-break: break-word; white-space: pre-wrap; }',
    '.meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }',
    '.meta-card { border-radius: 18px; background: #f7f9fb; border: 1px solid rgba(13, 17, 23, 0.08); padding: 14px; }',
    '.meta-title { margin: 0 0 4px; color: #707782; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }',
    '.meta-value { margin: 0; color: #101318; font-size: 15px; line-height: 1.5; font-weight: 600; }',
    '.actions { display: flex; justify-content: flex-end; margin-top: 24px; }',
    'button { appearance: none; border: 0; border-radius: 999px; padding: 14px 24px; min-width: 120px; background: linear-gradient(135deg, #ed1c24 0%, #b90f16 100%); color: #ffffff; font: inherit; font-weight: 800; letter-spacing: 0.01em; cursor: pointer; box-shadow: 0 16px 28px rgba(185, 15, 22, 0.28); }',
    'button:hover { filter: brightness(1.03); }',
    'button:focus-visible { outline: 3px solid rgba(237, 28, 36, 0.28); outline-offset: 3px; }',
    '@media (max-width: 640px) { .hero-grid { grid-template-columns: 1fr; } h1 { font-size: 28px; } .meta { grid-template-columns: 1fr; } .content, .hero { padding-left: 20px; padding-right: 20px; } }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="shell">',
    '<main class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">',
    '<section class="hero">',
    '<div class="eyebrow">Check Point inspired interface</div>',
    '<div class="hero-grid">',
    '<div>',
    '<h1 id="dialog-title">Claude Desktop scan result</h1>',
    `<p class="summary">${escapeHtml(description)} This local dialog keeps every visual asset embedded in the page.</p>`,
    '</div>',
    `<img class="visual" alt="Embedded security-themed illustration" src="${embeddedImage}">`,
    '</div>',
    '</section>',
    '<section class="content">',
    '<div class="panel">',
    '<div class="status">',
    `<div class="status-label">${escapeHtml(statusLabel)}</div>`,
    '<div class="pill">cpmcp</div>',
    '</div>',
    `<pre class="path">${escapeHtml(message)}</pre>`,
    '</div>',
    '<div class="meta">',
    '<section class="meta-card">',
    '<p class="meta-title">Platform</p>',
    `<p class="meta-value">${escapeHtml(process.platform === 'darwin' ? 'macOS' : process.platform === 'win32' ? 'Windows' : process.platform)}</p>`,
    '</section>',
    '<section class="meta-card">',
    '<p class="meta-title">Status</p>',
    `<p class="meta-value">${escapeHtml(configPath ? 'Secure path located' : 'No Claude Desktop installation detected')}</p>`,
    '</section>',
    '</div>',
    '<div class="actions">',
    '<button type="button" autofocus onclick="window.glimpse.send({ action: \"ok\" })">OK</button>',
    '</div>',
    '</section>',
    '</main>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
}

async function showDialog(message, configPath) {
  const { prompt } = await import('glimpseui');

  await prompt(buildDialogHtml(message, configPath), {
    width: 560,
    height: 470,
    title: 'cpmcp',
  });
}

function getClaudeDesktopConfigPath(platform = process.platform, env = process.env) {
  const homeDirectory = os.homedir();

  if (platform === 'darwin') {
    return path.posix.join(
      homeDirectory,
      'Library',
      'Application Support',
      'Claude',
      'claude_desktop_config.json'
    );
  }

  if (platform === 'win32') {
    const appDataDirectory = env.APPDATA || path.win32.join(homeDirectory, 'AppData', 'Roaming');

    return path.win32.join(appDataDirectory, 'Claude', 'claude_desktop_config.json');
  }

  return null;
}

async function main() {
  const configPath = getClaudeDesktopConfigPath();
  const message = !configPath || !fs.existsSync(configPath)
    ? 'no Claude Desktop installation detected'
    : configPath;

  try {
    await showDialog(message, configPath && fs.existsSync(configPath) ? configPath : null);
    process.stdout.write(`${message}\n`);
  } catch (error) {
    process.stderr.write(`Unable to open dialog: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  buildDialogHtml,
  getClaudeDesktopConfigPath,
  main,
};