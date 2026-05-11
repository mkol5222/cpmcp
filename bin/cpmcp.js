#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const CHECK_POINT_LOGO_DATA_URL = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaWQ9IkxheWVyXzEiCiAgIGRhdGEtbmFtZT0iTGF5ZXIgMSIKICAgdmVyc2lvbj0iMS4xIgogICB2aWV3Qm94PSIwIDAgMjM1Ljg5OTk5IDQ5LjU1ODMxMSIKICAgc29kaXBvZGk6ZG9jbmFtZT0iQ2hlY2stUG9pbnQtMjAyNC1sb2dvLWNvbG9yLnN2ZyIKICAgd2lkdGg9IjIzNS44OTk5OSIKICAgaGVpZ2h0PSI0OS41NTgzMTEiCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMi4yIChiMGE4NDg2NTQxLCAyMDIyLTEyLTAxKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzYwNyIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIyLjA5NDY3MDciCiAgICAgaW5rc2NhcGU6Y3g9IjEzNi4wNTk1NyIKICAgICBpbmtzY2FwZTpjeT0iMzYuNzU5OTU1IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTg2NiIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDExIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iTGF5ZXJfMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNTY2Ij4KICAgIDxzdHlsZQogICAgICAgaWQ9InN0eWxlNTY0Ij4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjMDAwOwogICAgICB9CgogICAgICAuY2xzLTEsIC5jbHMtMiwgLmNscy0zIHsKICAgICAgICBzdHJva2Utd2lkdGg6IDBweDsKICAgICAgfQoKICAgICAgLmNscy0yIHsKICAgICAgICBmaWxsOiAjZWUwYzVkOwogICAgICB9CgogICAgICAuY2xzLTMgewogICAgICAgIGZpbGw6ICMyMzFmMjA7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxnCiAgICAgaWQ9Imc1OTgiCiAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTQxLC0zMi40NDE2OSkiPgogICAgPGcKICAgICAgIGlkPSJnNTg4Ij4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDk0LjksNjYuMSB2IDAgYyAwLC00LjkgMy42LC04LjggOC44LC04LjggNS4yLDAgNS4xLDEuMSA2LjcsMi42IGwgLTIuNCwyLjcgYyAtMS4zLC0xLjIgLTIuNiwtMS45IC00LjMsLTEuOSAtMi45LDAgLTQuOSwyLjQgLTQuOSw1LjMgdiAwIGMgMCwyLjkgMiw1LjQgNC45LDUuNCAyLjksMCAzLjEsLTAuOCA0LjUsLTIgbCAyLjQsMi40IGMgLTEuNywxLjkgLTMuNywzIC02LjksMyAtNSwwIC04LjcsLTMuOSAtOC43LC04LjcgeiIKICAgICAgICAgaWQ9InBhdGg1NjgiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgZD0ibSAxMTMuNSw1Ny42IGggMy43IGMgMCwwIDAsNi43IDAsNi43IGggNi45IGMgMCwwIDAsLTYuNyAwLC02LjcgaCAzLjcgYyAwLDAgMCwxNi45IDAsMTYuOSBoIC0zLjcgYyAwLDAgMCwtNi44IDAsLTYuOCBoIC02LjkgYyAwLDAgMCw2LjggMCw2LjggaCAtMy43IGMgMCwwIDAsLTE2LjkgMCwtMTYuOSB6IgogICAgICAgICBpZD0icGF0aDU3MCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDEzMi4zLDU3LjcgaCAxMi44IGMgMCwwIDAsMy4zIDAsMy4zIEggMTM2IGMgMCwwIDAsMy40IDAsMy40IGggOCBjIDAsMCAwLDMuMyAwLDMuMyBoIC04IGMgMCwwIDAsMy41IDAsMy41IGggOS4yIGMgMCwwIDAsMy4zIDAsMy4zIGggLTEyLjkgYyAwLDAgMCwtMTcgMCwtMTcgeiIKICAgICAgICAgaWQ9InBhdGg1NzIiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgZD0ibSAxNDcuNyw2Ni4yIHYgMCBjIDAsLTQuOSAzLjcsLTguOCA4LjgsLTguOCA1LjEsMCA1LjEsMS4xIDYuNywyLjYgbCAtMi40LDIuNyBjIC0xLjMsLTEuMiAtMi42LC0xLjkgLTQuMywtMS45IC0yLjksMCAtNC45LDIuNCAtNC45LDUuMyB2IDAgYyAwLDIuOSAyLDUuNCA0LjksNS40IDEuOSwwIDMuMSwtMC44IDQuNSwtMiBsIDIuNCwyLjQgYyAtMS43LDEuOSAtMy43LDMgLTYuOSwzIC01LDAgLTguNywtMy45IC04LjcsLTguNyB6IgogICAgICAgICBpZD0icGF0aDU3NCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDE2Ni4xLDU3LjggaCAzLjcgYyAwLDAgMCw3LjQgMCw3LjQgbCA2LjksLTcuNCBoIDQuNSBjIDAsMCAtNi45LDcuMiAtNi45LDcuMiBsIDcuMiw5LjggSCAxNzcgYyAwLDAgLTUuMiwtNy4yIC01LjIsLTcuMiBsIC0yLDIgdiA1LjIgYyAwLDAgLTMuNywwIC0zLjcsMCBWIDU3LjkgWiIKICAgICAgICAgaWQ9InBhdGg1NzYiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgZD0ibSAxOTEuNiw1Ny44IGggNi45IGMgNCwwIDYuNSwyLjQgNi41LDUuOSB2IDAgYyAwLDQgLTMuMSw2IC02LjksNiBoIC0yLjggYyAwLDAgMCw1LjEgMCw1LjEgaCAtMy43IGMgMCwwIDAsLTE2LjkgMCwtMTYuOSB6IG0gNi42LDguNiBjIDEuOSwwIDIuOSwtMS4xIDMsLTIuNiB2IDAgYyAwLC0xLjcgLTEuMiwtMi42IC0zLC0yLjYgaCAtMi45IGMgMCwwIDAsNS4yIDAsNS4yIGggMyB6IgogICAgICAgICBpZD0icGF0aDU3OCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDIwNy40LDY2LjQgdiAwIGMgMCwtNC45IDMuOCwtOC44IDksLTguOCA1LjIsMCA5LDMuOSA4LjksOC43IHYgMCBjIDAsNC45IC0zLjgsOC44IC05LDguOCAtNS4yLDAgLTksLTMuOSAtOC45LC04LjcgeiBtIDE0LjEsMCB2IDAgYyAwLC0yLjkgLTIuMSwtNS40IC01LjEsLTUuNCAtMywwIC01LjEsMi40IC01LjEsNS4zIHYgMCBjIDAsMi45IDIuMSw1LjQgNS4xLDUuNCAzLDAgNS4xLC0yLjQgNS4xLC01LjMgeiIKICAgICAgICAgaWQ9InBhdGg1ODAiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgICAgZD0ibSAyMjksNTcuOSBoIDMuNyBjIDAsMCAwLDE2LjkgMCwxNi45IEggMjI5IGMgMCwwIDAsLTE2LjkgMCwtMTYuOSB6IgogICAgICAgICBpZD0icGF0aDU4MiIgLz4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDIzNy40LDU3LjkgbCAzLjQgMCA3LjksMTAuNCBWIDU3LjkgbCAzLjcgMCB2IDE2LjkgbCAtMy4yLDAgTCAyNDEsNjQgdiAxMC44IGwgLTMuNywwIFYgNTcuOSBaIgogICAgICAgICBpZD0icGF0aDU4NCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgY2xhc3M9ImNscy0zIgogICAgICAgICBkPSJtIDI2MC45LDYxLjQgaCAtNS4xIHYgLTMuNCBoIDE0IHYgMy41IGggLTUuMSB2IDEzLjUgaCAtMy44IHYgLTEzLjUgeiIKICAgICAgICAgaWQ9InBhdGg1ODYiIC8+CiAgICA8L2c+CiAgICA8cG9seWdvbgogICAgICAgY2xhc3M9ImNscy0xIgogICAgICAgcG9pbnRzPSIiCiAgICAgICBpZD0icG9seWdvbjU5MCIgLz4KICAgIDxwb2x5Z29uCiAgICAgICBjbGFzcz0iY2xzLTEiCiAgICAgICBwb2ludHM9IiIKICAgICAgIGlkPSJwb2x5Z29uNTkyIiAvPgogICAgPHBhdGgKICAgICAgIGNsYXNzPSJjbHMtMyIKICAgICAgIGQ9Im0gOTEuOSw0NC45IGMgLTIuNywzLjMgLTcuNSwzLjggLTEwLjgsMS4yIC0zLjMsLTIuNyAtMy44LC03LjUgLTEuMiwtMTAuOCAyLjcsLTMuMyA3LjUsLTMuOCAxMC44LC0xLjIgMy4zLDIuNyAzLjgsNy41IDEuMiwxMC44IHoiCiAgICAgICBpZD0icGF0aDU5NCIgLz4KICAgIDxwYXRoCiAgICAgICBjbGFzcz0iY2xzLTIiCiAgICAgICBkPSJtIDgxLjUsNTYuOSBjIC0yLjEsMSAtNC43LDEgLTYuOSwtMC4zIGwgLTYsOCBjIDAuOCwwLjkgMS4yLDIgMS4yLDMuMSAwLDEgLTAuMiwyIC0wLjgsMi45IC0xLjUsMi4zIC00LjcsMyAtNywxLjUgLTAuMiwtMC4yIC0wLjUsLTAuMyAtMC43LC0wLjUgMCwwIC0wLjEsLTAuMSAtMC4yLC0wLjIgLTAuMSwtMC4xIC0wLjMsLTAuMyAtMC40LC0wLjUgMCwwIC0wLjEsLTAuMSAtMC4yLC0wLjIgLTAuMSwtMC4yIC0wLjMsLTAuNCAtMC40LC0wLjcgMCwwIDAsLTAuMSAwLC0wLjIgMCwtMC4yIC0wLjIsLTAuNCAtMC4yLC0wLjYgMCwwIDAsLTAuMSAwLC0wLjIgMCwtMC4yIDAsLTAuNSAtMC4xLC0wLjcgMCwwIDAsLTAuMSAwLC0wLjIgMCwtMC4yIDAsLTAuNSAwLC0wLjcgMCwwIDAsMCAwLC0wLjEgMCwtMC4zIDAsLTAuNSAwLjIsLTAuOCAwLDAgMCwtMC4xIDAsLTAuMiAwLC0wLjMgMC4yLC0wLjUgMC4zLC0wLjggbCAtNC45LC0zLjcgLTEuNSwyIC01LjYsLTQuMiA0LjIsLTUuNiA1LjYsNC4yIC0xLjUsMiA0LjksMy43IGMgMS41LC0xLjMgMy43LC0xLjYgNS42LC0wLjYgbCA2LC04IGMgLTIuNCwtMi40IC0zLC02LjEgLTEuMiwtOS4yIDAuMywtMC42IDAuOCwtMS4xIDEuMiwtMS42IEMgNjkuOCw0Mi4zIDY1LjksNDEgNjEuNiw0MC45IDUwLjMsNDAuOSA0MS4xLDUwIDQxLDYxLjQgNDEsNzIuNyA1MC4xLDgxLjkgNjEuNSw4MiA3Mi44LDgyIDgyLDcyLjkgODIuMSw2MS41IGMgMCwtMS43IC0wLjIsLTMuMyAtMC42LC00LjggeiIKICAgICAgIGlkPSJwYXRoNTk2IiAvPgogIDwvZz4KICA8ZwogICAgIGlkPSJnNjA0IgogICAgIHRyYW5zZm9ybT0idHJhbnNsYXRlKC00MSwtMzIuNDQxNjkpIj4KICAgIDxwYXRoCiAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICBkPSJtIDI3My4zLDYwLjQgaCAtMC40IHYgLTIgaCAtMC43IHYgLTAuNCBoIDEuOSB2IDAuNCBoIC0wLjcgdiAyIHoiCiAgICAgICBpZD0icGF0aDYwMCIgLz4KICAgIDxwYXRoCiAgICAgICBjbGFzcz0iY2xzLTMiCiAgICAgICBkPSJtIDI3NS44LDU5LjggdiAwIGwgLTAuNywtMS4xIHYgMS43IGggLTAuNCB2IC0yLjMgaCAwLjQgbCAwLjcsMS4xIDAuNywtMS4xIGggMC40IHYgMi4zIGggLTAuNCB2IC0xLjcgeiIKICAgICAgIGlkPSJwYXRoNjAyIiAvPgogIDwvZz4KPC9zdmc+Cg==';

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
    '.logo { display: block; width: 178px; height: auto; margin-bottom: 18px; }',
    'h1 { margin: 0 0 10px; font-size: 26px; line-height: 1.15; font-weight: 700; letter-spacing: -0.03em; }',
    '.summary { margin: 0 0 14px; color: #576171; font-size: 14px; line-height: 1.5; }',
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
    `<img class="logo" src="${CHECK_POINT_LOGO_DATA_URL}" alt="Check Point logo">`,
    `<h1 id="dialog-title">${escapeHtml(title)}</h1>`,
    '<p class="summary">Review the detected Claude Desktop configuration location below.</p>',
    `<pre class="path">${escapeHtml(body)}</pre>`,
    '<div class="actions">',
    '<button id="ok-button" type="button" autofocus>OK</button>',
    '</div>',
    '<script>',
    'document.getElementById("ok-button").addEventListener("click", () => {',
    '  window.glimpse.send({ action: "ok" });',
    '});',
    '</script>',
    '</main>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
}

async function showDialog(message, configPath) {
  const { open } = await import('glimpseui');

  await new Promise((resolve, reject) => {
    const win = open(buildDialogHtml(message, configPath), {
      width: 560,
      height: 360,
      title: 'cpmcp',
    });

    win.once('message', (data) => {
      if (data && data.action === 'ok') {
        win.close();
      }
    });

    win.once('closed', resolve);
    win.once('error', reject);
  });
}

function getConsoleSummary(message, configPath) {
  if (configPath) {
    return `Claude Desktop config detected: ${configPath}`;
  }

  return message;
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
  const resolvedConfigPath = configPath && fs.existsSync(configPath) ? configPath : null;
  const message = resolvedConfigPath ? resolvedConfigPath : 'no Claude Desktop installation detected';

  try {
    await showDialog(message, resolvedConfigPath);
    process.stdout.write(`${getConsoleSummary(message, resolvedConfigPath)}\n`);
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
  getConsoleSummary,
  getClaudeDesktopConfigPath,
  main,
};