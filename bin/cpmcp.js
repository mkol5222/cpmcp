#!/usr/bin/env node

const { randomInt } = require('node:crypto');
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
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

const MCP_SERVER_DATA_PATH = path.join(__dirname, '..', 'data', 'cpmcps.json');
const DEFAULT_SELECTED_MCP_PACKAGES = new Set([
  '@chkp/quantum-management-mcp',
  '@chkp/management-logs-mcp',
]);

function getMcpServers() {
  try {
    const fileContents = fs.readFileSync(MCP_SERVER_DATA_PATH, 'utf8');
    const parsedContents = JSON.parse(fileContents);
    return Array.isArray(parsedContents) ? parsedContents : [];
  } catch {
    return [];
  }
}

function normalizeSelectedMcpServers(value) {
  const availablePackages = new Set(getMcpServers().map((server) => server.npm_package));
  const selectedValues = Array.isArray(value)
    ? value
    : typeof value === 'string' && value
      ? [value]
      : [];

  return selectedValues.filter((packageName, index) => {
    return typeof packageName === 'string'
      && availablePackages.has(packageName)
      && selectedValues.indexOf(packageName) === index;
  });
}

function createDefaultFormValues() {
  return {
    managementServer: '',
    apiKey: '',
    username: 'admin',
    password: 'demo123',
    selectedMcpServers: Array.from(DEFAULT_SELECTED_MCP_PACKAGES),
  };
}

function isUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeWebApiUrl(value) {
  const parsedUrl = new URL(value);
  const webApiMatch = parsedUrl.pathname.match(/^(.*?\/web_api)(?:\/.*)?$/);

  if (webApiMatch) {
    parsedUrl.pathname = webApiMatch[1];
    parsedUrl.search = '';
    parsedUrl.hash = '';
  }

  return parsedUrl.toString();
}

function extractManagementServer(value) {
  const trimmedValue = (value || '').trim();

  if (!trimmedValue) {
    return '';
  }

  const urlMatch = trimmedValue.match(/https?:\/\/[^\s"'<>]+/i);

  if (urlMatch) {
    try {
      return normalizeWebApiUrl(urlMatch[0]);
    } catch {
      return urlMatch[0];
    }
  }

  const firstLine = trimmedValue.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  return firstLine || '';
}

function deriveEnvValues(formValues) {
  const values = formValues || createDefaultFormValues();
  const server = extractManagementServer(values.managementServer);
  const apiKey = (values.apiKey || '').trim();
  const username = apiKey ? '' : (values.username || '').trim();
  const password = apiKey ? '' : (values.password || '').trim();

  return {
    S1C_URL: isUrl(server) ? server : '',
    MANAGEMENT_HOST: server && !isUrl(server) ? server : '',
    API_KEY: apiKey,
    USERNAME: username,
    PASSWORD: password,
  };
}

function createSubmitResponse(configPath, formValues) {
  return {
    claudeDesktopConfig: configPath || 'no Claude Desktop installation detected',
    checkPointConfig: deriveEnvValues(formValues),
    selectedMcpServers: normalizeSelectedMcpServers(formValues && formValues.selectedMcpServers),
  };
}

function buildDialogHtml(message, configPath) {
  const title = configPath ? 'Claude Desktop config detected' : 'Claude Desktop config not detected';
  const body = configPath ? configPath : message;
  const defaults = createDefaultFormValues();
  const mcpServers = getMcpServers();
  const mcpOptionsMarkup = mcpServers.map((server) => {
    const isChecked = defaults.selectedMcpServers.includes(server.npm_package);

    return [
      `<label class="mcp-option" title="${escapeHtml(server.description)}">`,
      `<input class="mcp-option-checkbox" type="checkbox" name="mcp-server" value="${escapeHtml(server.npm_package)}"${isChecked ? ' checked' : ''}>`,
      '<span class="mcp-option-text">',
      `<span class="mcp-option-package">${escapeHtml(server.npm_package)}</span>`,
      `<span class="mcp-option-name">${escapeHtml(server.name)}</span>`,
      '</span>',
      '</label>',
    ].join('');
  }).join('');

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
    '.shell { min-height: 100vh; display: grid; place-items: center; padding: 32px; }',
    '.dialog { width: min(100%, 760px); border-radius: 20px; background: #ffffff; border: 1px solid #d8dde6; box-shadow: 0 18px 48px rgba(15, 22, 36, 0.14); padding: 28px; }',
    '.logo { display: block; width: 178px; height: auto; margin-bottom: 18px; }',
    'h1 { margin: 0 0 10px; font-size: 26px; line-height: 1.15; font-weight: 700; letter-spacing: -0.03em; }',
    '.summary { margin: 0 0 14px; color: #576171; font-size: 14px; line-height: 1.5; }',
    '.path { margin: 0; padding: 14px 16px; border-radius: 14px; background: #f7f9fc; border: 1px solid #e3e8ef; color: #222934; font-size: 14px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }',
    '.fields { display: grid; gap: 14px; margin-top: 18px; }',
    '.field { display: grid; gap: 6px; }',
    '.field label { color: #3b4452; font-size: 13px; font-weight: 700; }',
    '.field input { width: 100%; padding: 11px 12px; border: 1px solid #d2d9e4; border-radius: 12px; background: #ffffff; color: #14181f; font: inherit; }',
    '.field input::placeholder { color: #8a94a5; }',
    '.field-note { margin: 0; color: #707b8c; font-size: 12px; line-height: 1.4; }',
    '.mcp-section { display: grid; gap: 10px; padding: 16px; border-radius: 16px; background: #fbfcfe; border: 1px solid #e3e8ef; }',
    '.mcp-section-title { margin: 0; color: #222934; font-size: 14px; font-weight: 700; }',
    '.mcp-list { display: grid; gap: 10px; }',
    '.mcp-option { display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; padding: 12px 14px; border-radius: 14px; border: 1px solid #dce3ec; background: #ffffff; cursor: pointer; }',
    '.mcp-option:hover { border-color: #b9c5d6; background: #f9fbfd; }',
    '.mcp-option-checkbox { margin-top: 3px; width: 16px; height: 16px; accent-color: #e31b23; }',
    '.mcp-option-text { display: grid; gap: 3px; min-width: 0; }',
    '.mcp-option-package { color: #14181f; font-size: 14px; font-weight: 700; line-height: 1.45; overflow-wrap: anywhere; }',
    '.mcp-option-name { color: #6b7483; font-size: 13px; line-height: 1.45; }',
    '.status { margin-top: 14px; color: #576171; font-size: 13px; line-height: 1.5; }',
    '.result { display: none; margin-top: 18px; padding-top: 18px; border-top: 1px solid #e3e8ef; }',
    '.result.is-visible { display: block; }',
    '.result h2 { margin: 0 0 10px; font-size: 18px; line-height: 1.25; }',
    '.result-block { margin: 0 0 14px; padding: 14px 16px; border-radius: 14px; background: #f7f9fc; border: 1px solid #e3e8ef; color: #222934; font-size: 14px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; word-break: break-word; }',
    '.actions { display: flex; justify-content: flex-end; margin-top: 20px; }',
    'button { appearance: none; border: 0; border-radius: 999px; padding: 11px 20px; min-width: 92px; background: #e31b23; color: #ffffff; font: inherit; font-weight: 700; cursor: pointer; }',
    'button:disabled { opacity: 0.65; cursor: progress; }',
    'button:focus-visible { outline: 3px solid rgba(237, 28, 36, 0.28); outline-offset: 3px; }',
    '@media (max-width: 520px) { .shell { padding: 16px; } .dialog { padding: 20px; } h1 { font-size: 23px; } }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="shell">',
    '<main class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title">',
    `<img class="logo" src="${CHECK_POINT_LOGO_DATA_URL}" alt="Check Point logo">`,
    `<h1 id="dialog-title">${escapeHtml(title)}</h1>`,
    '<p class="summary">Review the detected Claude Desktop configuration location below.</p>',
    `<pre class="path">${escapeHtml(body)}</pre>`,
    '<div class="fields">',
    '<div class="field">',
    '<label for="management-server">Management server</label>',
    '<input id="management-server" type="text" placeholder="IP, hostname or URL">',
    '</div>',
    '<div class="field">',
    '<label for="api-key">API key</label>',
    '<input id="api-key" type="text" placeholder="overrides username and password">',
    '</div>',
    '<div class="field">',
    '<label for="username">Username</label>',
    `<input id="username" type="text" value="${escapeHtml(defaults.username)}">`,
    '</div>',
    '<div class="field">',
    '<label for="password">Password</label>',
    `<input id="password" type="password" value="${escapeHtml(defaults.password)}">`,
    '</div>',
    '<div class="mcp-section">',
    '<p class="mcp-section-title">MCP servers</p>',
    '<div class="mcp-list">',
    mcpOptionsMarkup,
    '</div>',
    '<p class="field-note">Hover over a server to see its full description.</p>',
    '</div>',
    '<p class="field-note">API key overrides username and password when provided.</p>',
    '</div>',
    '<p id="status" class="status"></p>',
    '<div class="actions">',
    '<button id="ok-button" type="button" autofocus>OK</button>',
    '</div>',
    '<section id="result" class="result" aria-live="polite">',
    '<h2>Configuration saved</h2>',
    '<div id="claude-result" class="result-block"></div>',
    '<div id="checkpoint-result" class="result-block"></div>',
    '<div id="selected-mcp-result" class="result-block"></div>',
    '<p class="summary">You can now close this page.</p>',
    '</section>',
    '<script>',
    'const okButton = document.getElementById("ok-button");',
    'const status = document.getElementById("status");',
    'const fields = document.querySelector(".fields");',
    'const actions = document.querySelector(".actions");',
    'const result = document.getElementById("result");',
    'const claudeResult = document.getElementById("claude-result");',
    'const checkpointResult = document.getElementById("checkpoint-result");',
    'const selectedMcpResult = document.getElementById("selected-mcp-result");',
    'const managementServerInput = document.getElementById("management-server");',
    'function normalizeManagementServerInput(value) {',
    '  const trimmedValue = value.trim();',
    '  if (!trimmedValue) {',
    '    return "";',
    '  }',
    '  const urlMatch = trimmedValue.match(/https?:\\/\\/[^\\s"\'<>]+/i);',
    '  if (urlMatch) {',
    '    try {',
    '      const parsedUrl = new URL(urlMatch[0]);',
    '      const webApiMatch = parsedUrl.pathname.match(/^(.*?\\/web_api)(?:\\/.*)?$/);',
    '      if (webApiMatch) {',
    '        parsedUrl.pathname = webApiMatch[1];',
    '        parsedUrl.search = "";',
    '        parsedUrl.hash = "";',
    '      }',
    '      return parsedUrl.toString();',
    '    } catch {',
    '      return urlMatch[0];',
    '    }',
    '  }',
    '  const firstLine = trimmedValue.split(/\\r?\\n/).map((line) => line.trim()).find(Boolean);',
    '  return firstLine || "";',
    '}',
    'managementServerInput.addEventListener("paste", () => {',
    '  requestAnimationFrame(() => {',
    '    managementServerInput.value = normalizeManagementServerInput(managementServerInput.value);',
    '  });',
    '});',
    'managementServerInput.addEventListener("blur", () => {',
    '  managementServerInput.value = normalizeManagementServerInput(managementServerInput.value);',
    '});',
    'okButton.addEventListener("click", async () => {',
    '  okButton.disabled = true;',
    '  status.textContent = "Submitting...";',
    '  const payload = {',
    '    managementServer: document.getElementById("management-server").value,',
    '    apiKey: document.getElementById("api-key").value,',
    '    username: document.getElementById("username").value,',
    '    password: document.getElementById("password").value,',
    "    selectedMcpServers: Array.from(document.querySelectorAll('input[name=\"mcp-server\"]:checked')).map((input) => input.value)",
    '  };',
    '  try {',
    '    const response = await fetch("/api/submit", {',
    '      method: "POST",',
    '      headers: { "Content-Type": "application/json" },',
    '      body: JSON.stringify(payload)',
    '    });',
    '    if (!response.ok) {',
    '      throw new Error(`Request failed: ${response.status}`);',
    '    }',
    '    const data = await response.json();',
    '    const checkPointConfig = data.checkPointConfig || {};',
    '    const selectedMcpServers = Array.isArray(data.selectedMcpServers) ? data.selectedMcpServers : [];',
    '    claudeResult.textContent = `Claude Desktop config is:\n${data.claudeDesktopConfig || "no Claude Desktop installation detected"}`;',
    '    checkpointResult.textContent = `Check Point config is:\nS1C_URL: ${checkPointConfig.S1C_URL || ""}\nMANAGEMENT_HOST: ${checkPointConfig.MANAGEMENT_HOST || ""}\nAPI_KEY: ${checkPointConfig.API_KEY || ""}\nUSERNAME: ${checkPointConfig.USERNAME || ""}\nPASSWORD: ${checkPointConfig.PASSWORD || ""}`;',
    '    selectedMcpResult.textContent = `Selected MCP servers:\n${selectedMcpServers.length ? selectedMcpServers.join("\\n") : ""}`;',
    '    fields.style.display = "none";',
    '    actions.style.display = "none";',
    '    status.textContent = "";',
    '    result.classList.add("is-visible");',
    '  } catch (error) {',
    '    okButton.disabled = false;',
    '    status.textContent = `Submission failed: ${error.message}`;',
    '  }',
    '});',
    '</script>',
    '</main>',
    '</div>',
    '</body>',
    '</html>',
  ].join('');
}

function getConsoleSummary(configPath, dialogResult) {
  const envValues = deriveEnvValues(dialogResult || createDefaultFormValues());
  const selectedMcpServers = normalizeSelectedMcpServers(dialogResult && dialogResult.selectedMcpServers);

  return [
    `CLAUDE_DESKTOP_CONFIG: ${configPath || 'no Claude Desktop installation detected'}`,
    `S1C_URL: ${envValues.S1C_URL}`,
    `MANAGEMENT_HOST: ${envValues.MANAGEMENT_HOST}`,
    `API_KEY: ${envValues.API_KEY}`,
    `USERNAME: ${envValues.USERNAME}`,
    `PASSWORD: ${envValues.PASSWORD}`,
    `MCP_SERVERS: ${selectedMcpServers.join(',')}`,
  ].join('\n');
}

function openBrowser(url) {
  if (process.platform === 'darwin') {
    spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    return;
  }

  if (process.platform === 'win32') {
    spawn('cmd', ['/c', 'start', '', url], {
      detached: true,
      stdio: 'ignore',
      windowsHide: true,
    }).unref();
    return;
  }

  spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
}

function startLocalServer(message, configPath, openHandler = openBrowser) {
  return new Promise((resolve, reject) => {
    let server;
    let submitResolved = false;
    let resolveSubmitted;
    const submitted = new Promise((submittedResolve) => {
      resolveSubmitted = submittedResolve;
    });

    const finishSubmission = (result) => {
      if (submitResolved) {
        return;
      }

      submitResolved = true;
      resolveSubmitted(result);
    };

    const tryListen = (remainingAttempts) => {
      const port = randomInt(11151, 22260);
      server = http.createServer((request, response) => {
        const requestUrl = new URL(request.url || '/', 'http://127.0.0.1');

        if (request.method === 'GET' && requestUrl.pathname === '/') {
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          response.end(buildDialogHtml(message, configPath));
          return;
        }

        if (request.method === 'POST' && requestUrl.pathname === '/api/submit') {
          let bodyBuffer = '';

          request.setEncoding('utf8');
          request.on('data', (chunk) => {
            bodyBuffer += chunk;

            if (bodyBuffer.length > 16 * 1024) {
              response.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
              response.end(JSON.stringify({ error: 'Payload too large' }));
              request.destroy();
            }
          });

          request.on('end', () => {
            try {
              const parsedBody = JSON.parse(bodyBuffer || '{}');
              const responsePayload = createSubmitResponse(configPath, parsedBody);
              response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
              response.end(JSON.stringify(responsePayload));
              server.close(() => finishSubmission(parsedBody));
            } catch {
              response.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
              response.end(JSON.stringify({ error: 'Invalid JSON payload' }));
            }
          });

          return;
        }

        response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('Not found');
      });

      server.once('error', (error) => {
        if (error && error.code === 'EADDRINUSE' && remainingAttempts > 0) {
          tryListen(remainingAttempts - 1);
          return;
        }

        reject(error);
      });

      server.listen(port, '127.0.0.1', () => {
        const url = `http://127.0.0.1:${port}/`;
        try {
          openHandler(url);
        } catch (error) {
          reject(error);
          return;
        }

        resolve({
          submitted,
          server,
          url,
        });
      });
    };

    tryListen(20);
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
  const resolvedConfigPath = configPath && fs.existsSync(configPath) ? configPath : null;
  const message = resolvedConfigPath ? resolvedConfigPath : 'no Claude Desktop installation detected';

  try {
    const { submitted, url } = await startLocalServer(message, resolvedConfigPath);
    process.stdout.write(`Open browser dialog at ${url}\n`);
    const dialogResult = await submitted;
    process.stdout.write(`${getConsoleSummary(resolvedConfigPath, dialogResult)}\n`);
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
  createSubmitResponse,
  createDefaultFormValues,
  deriveEnvValues,
  extractManagementServer,
  getMcpServers,
  getConsoleSummary,
  getClaudeDesktopConfigPath,
  isUrl,
  normalizeSelectedMcpServers,
  openBrowser,
  startLocalServer,
  main,
};