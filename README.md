# cpmcp

Minimal CLI for locating the Claude Desktop config file.

## Usage

Run directly from GitHub:

```sh
npx -y github:mkol5222/cpmcp
```

## Current behavior

- On macOS, checks `~/Library/Application Support/Claude/claude_desktop_config.json`.
- On Windows, checks `%APPDATA%\Claude\claude_desktop_config.json`.
- If the file exists, prints the full path.
- If the file does not exist, prints `no Claude Desktop installation detected`.

## Development

Run locally:

```sh
node bin/cpmcp.js
```
*** End Patch