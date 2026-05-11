#!/usr/bin/env node

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

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

function main() {
  const configPath = getClaudeDesktopConfigPath();

  if (!configPath || !fs.existsSync(configPath)) {
    process.stdout.write('no Claude Desktop installation detected\n');
    return;
  }

  process.stdout.write(`${configPath}\n`);
}

if (require.main === module) {
  main();
}

module.exports = {
  getClaudeDesktopConfigPath,
  main,
};