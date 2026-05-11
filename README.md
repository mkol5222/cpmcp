# cpmcp

Minimal CLI for locating the Claude Desktop config file and presenting the result in a local dialog.

## Usage

Run directly from GitHub:

```sh
npx -y github:mkol5222/cpmcp
```

## Current behavior

- On macOS, checks `~/Library/Application Support/Claude/claude_desktop_config.json`.
- On Windows, checks `%APPDATA%\Claude\claude_desktop_config.json`.
- Opens a minimal local `glimpseui` dialog with a simple Check Point styled header and an `OK` button.
- All page resources are embedded directly in the HTML. No external images, fonts, or network resources are loaded by the page.
- If the file exists, the dialog shows the full path and the CLI also prints it to stdout after the dialog closes.
- If the file does not exist, the dialog shows `no Claude Desktop installation detected` and the CLI prints the same text after the dialog closes.

## Development

Run locally:

```sh
node bin/cpmcp.js
```
*** End Patch