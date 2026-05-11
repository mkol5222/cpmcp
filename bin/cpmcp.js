#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDialogHtml(message, configPath) {
  const title = configPath ? 'Claude Desktop config detected' : 'Claude Desktop config not detected';
  const body = configPath ? configPath : message;

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
    'body { margin: 0; min-height: 100vh; font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; background: #f5f7fa; color: #14181f; }',
    '.shell { min-height: 100vh; display: grid; place-items: center; padding: 24px; }',
    '.dialog { width: min(100%, 480px); border-radius: 20px; background: #ffffff; border: 1px solid #d8dde6; box-shadow: 0 18px 48px rgba(15, 22, 36, 0.14); padding: 24px; }',
    '.brand { display: inline-block; margin-bottom: 18px; color: #e31b23; font-size: 18px; font-weight: 800; letter-spacing: -0.02em; }',
    '.brand-rule { display: inline-block; width: 28px; height: 3px; margin-right: 10px; vertical-align: middle; background: #e31b23; border-radius: 999px; }',
    'h1 { margin: 0 0 10px; font-size: 26px; line-height: 1.15; font-weight: 700; letter-spacing: -0.03em; }',
    '.path { margin: 0; padding: 14px 16px; border-radius: 14px; background: #f7f9fc; border: 1px solid #e3e8ef; color: #222934; font-size: 14px; line-height: 1.55; word-break: break-word; white-space: pre-wrap; }',
    '.actions { display: flex; justify-content: flex-end; margin-top: 20px; }',
    'button { appearance: none; border: 0; border-radius: 999px; padding: 11px 20px; min-width: 92px; background: #e31b23; color: #ffffff; font: inherit; font-weight: 700; cursor: pointer; }',
    'button:focus-visible { outline: 3px solid rgba(237, 28, 36, 0.28); outline-offset: 3px; }',
    '@media (max-width: 520px) { .dialog { padding: 20px; } h1 { font-size: 23px; } }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="shell">',
    '<main class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">',
    '<div class="brand"><span class="brand-rule"></span>Check Point</div>',
    `<h1 id="dialog-title">${escapeHtml(title)}</h1>`,
    `<pre class="path">${escapeHtml(body)}</pre>`,
    '<div class="actions">',
    '<button type="button" autofocus onclick="window.glimpse.send({ action: \"ok\" })">OK</button>',
    '</div>',
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