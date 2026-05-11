# cpmcp

Minimal CLI for locating the Claude Desktop config file and opening a local browser dialog.

## Usage

Run directly from GitHub:

```sh
npx -y github:mkol5222/cpmcp
```

## Current behavior

- On macOS, checks `~/Library/Application Support/Claude/claude_desktop_config.json`.
- On Windows, checks `%APPDATA%\Claude\claude_desktop_config.json`.
- Starts a local HTTP server on a random high port between `11151` and `22259` and opens the default browser.
- The dialog includes `Management server`, `API key`, `Username`, and `Password` fields. `Username` defaults to `admin`, and `Password` defaults to `demo123`.
- All page resources are embedded directly in the HTML. No external images, fonts, or network resources are loaded by the page.
- If the file exists, the dialog shows the full path.
- If the file does not exist, the dialog shows `no Claude Desktop installation detected`.
- Pressing `OK` submits the values to the local API.
- After submission, the CLI prints `CLAUDE_DESKTOP_CONFIG`, `S1C_URL`, `MANAGEMENT_HOST`, `API_KEY`, `USERNAME`, and `PASSWORD` values.
- If `Management server` is a URL, it becomes `S1C_URL` and `MANAGEMENT_HOST` is empty.
- If `Management server` is a hostname or IP, it becomes `MANAGEMENT_HOST` and `S1C_URL` is empty.
- If `API key` is provided, `USERNAME` and `PASSWORD` are printed as empty values.

## Development

Run locally:

```sh
node bin/cpmcp.js
```
*** End Patch