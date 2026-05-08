# 00 MCP Setup

Prepared: 2026-05-05
Workspace config: `.vscode/mcp.json`
Status: scaffolded, verification pending

## Reconnect Workflow

1. Run `node scripts/check-mcp-prereqs.mjs` from the workspace root.
2. If any prerequisite fails, fix that first before touching MCP trust or restart state.
3. In VS Code, run `MCP: List Servers`, select a failing server, then use `Show Output` to inspect its startup log.
4. If trust state might be stale, run `MCP: Reset Trust`, then start the server again from the MCP server list.
5. If the config changed, restart the target server from `MCP: List Servers` or rely on `chat.mcp.autoStart` if you have enabled it locally.

## Current Local Prerequisite Check

- `chunkhound` executable currently resolves from the configured path on this machine.
- Workspace ChunkHound DB already exists at `.chunkhound/chunks.duckdb`.
- Command-based servers should now use explicit `type: "stdio"` declarations in `.vscode/mcp.json` for clarity and easier troubleshooting.

## Rules

- No design-system or page-spec work is considered complete until required MCP servers are installed and verified.
- Each server needs one concrete verification task recorded here.
- Failures stay documented with blocker notes and fallback paths.

## Workspace MCP Config

- Primary shared config file: `.vscode/mcp.json`
- Config shape verified against current VS Code MCP workspace docs on 2026-05-05.
- Active workspace config now includes `chunkhound`, `shadcn-ui`, `aceternity-ui`, and `figma`.
- `magic-ui` is not installed for this workspace and is intentionally omitted from the active config.
- The currently published `@magicuidesign/cli` also exposes only `install <client>` in the checks run here, so there is no confirmed direct MCP runtime command to wire in today.
- `shadcn-studio` was removed from the active config because the current `shadcn` CLI no longer supports the `studio` subcommand.
- `ui9000` is not installed for this workspace and is intentionally omitted from the active config.
- The previously recorded hosted endpoint `mcp.ui9000.dev` also failed DNS resolution in local checks, so it is not being kept as an active server entry.

## Verification Log

### ChunkHound

- Intended task: search current auth, API, and layout flows before rebuild decisions.
- Status: local prerequisite verified.
- Verification result: `node scripts/check-mcp-prereqs.mjs` confirmed `D:\claw\.venv\Scripts\chunkhound.exe` exists and `.chunkhound/chunks.duckdb` is present.
- Fallback if blocked: use repo code search and document the missing MCP capability.

### shadcn/ui

- Intended task: list available registry tools and fetch one base component.
- Status: local prerequisite verified.
- Verification result: `node scripts/check-mcp-prereqs.mjs` confirmed the Windows launcher path works through `cmd.exe /d /s /c npx.cmd ...`.
- Fallback if blocked: use `components.json` and direct shadcn CLI commands later.

### Magic UI

- Intended task: retrieve at least one marquee, background, or motion candidate.
- Status: deferred, not installed in this workspace.
- Verification result: left out of `.vscode/mcp.json`; an exploratory CLI check also showed `@magicuidesign/cli` exposing only `install <client>` and no confirmed runtime server command.
- Fallback if blocked: use existing repo research notes and direct library docs.

### Aceternity UI

- Intended task: retrieve at least one hero, card, or background candidate.
- Status: local prerequisite verified.
- Verification result: `node scripts/check-mcp-prereqs.mjs` confirmed the Windows launcher path works through `cmd.exe /d /s /c npx.cmd ...`.
- Fallback if blocked: use current repo Aceternity-derived components as reference only.

### Figma

- Intended task: confirm connection and ability to read or write design context.
- Status: endpoint reachable, interactive authorization still pending in VS Code.
- Verification result: `node scripts/check-mcp-prereqs.mjs` reached `https://mcp.figma.com/mcp` and received `HTTP 405`, which confirms DNS and endpoint reachability but not trust/auth completion.
- Fallback if blocked: continue with markdown-only design briefs until authorization is completed.

### shadcn/studio

- Intended task: confirm block generation commands are available.
- Status: removed from active workspace config.
- Verification result: VS Code startup failed with `unknown command 'studio'`, and `shadcn mcp --help` shows only `init` as a supported subcommand group member.
- Fallback if blocked: use `shadcn/ui` plus manual page-block planning.

### UI9000

- Intended task: confirm hosted connection and one chart or resource example.
- Status: deferred, not installed in this workspace.
- Verification result: left out of `.vscode/mcp.json`; the previously noted hosted endpoint also failed DNS lookup during local checks, so it is not treated as an active server.
- Fallback if blocked: use static chart planning notes and defer interactive visualization sourcing.

## Immediate Next Actions

- Run `node scripts/check-mcp-prereqs.mjs` and fix any failing prerequisite before opening MCP logs.
- Start each configured server from VS Code and record trust prompts and connection state.
- Replace each pending verification result with the exact command or task used.
- Mark any bad command or endpoint in `.vscode/mcp.json` and correct it before design implementation begins.