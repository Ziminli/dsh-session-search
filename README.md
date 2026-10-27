# DSH Session Search

English | [简体中文](<README.zh-CN.md>)

Find text across your DeepSeek Harness (DSH) conversation history—across all sessions or within one conversation. Open the search panel from the sidebar or with **Ctrl+F / ⌘F**.

An independent community plugin, not an official DSH package. **Package version: 1.1.0.**

## Features

- **All workspaces or one workspace**, with a dependent session picker and workspace labels in all-workspace results (Timeline and By session).
- **All sessions or one session**, with a title/ID filter and a latest-user-activity-first conversation picker.
- VS Code-style **Aa (Match Case)**, **ab (Whole Word)** and **.* (Regular Expression)** toggles, combinable with one another.
- **Timeline** results or collapsible **By session** groups with complete matching-message counts.
- **Newest first / Oldest first**, ordered by matching-message time rather than unrelated session activity.
- Optional **subagent conversations** and **archived sessions**, clearly labeled.
- **Final model replies only** by default; optionally search stored inputs, intermediate replies, tool calls/results and reasoning too.
- Highlighted snippets, pagination, conversation-opening buttons, English/Chinese UI and DSH theme support.
- A read-only **`search_session_text`** agent tool backed by the same engine as the UI.
- Local operation without a separate search service, FTS index, third-party dependencies or build step.

## Requirements and compatibility

Development reference: **DSH Desktop runtime 0.2.1-rc.3**. This is not a guaranteed minimum version or a promise of compatibility with every DSH release. The bundle requires DSH's session-query/controller services, plugin management and Web UI plugin APIs; these may change between releases.

**Node.js 22+** is required for development checks and tests. DSH Desktop uses its bundled runtime; installing a separate Node version does not change that runtime.

## Installation

### DSH Desktop

1. Open **Plugins → Add plugin** (or **Install a third-party plugin**).
2. Enter the repository URL:
   ```text
   https://github.com/Ziminli/dsh-session-search
   ```
3. Review the source/trust prompt, install, and enable the bundle if needed. Follow any restart/reload instructions returned by Plugin Manager.

### Local checkout / agent tool

Clone or download this repository, then install its **absolute package directory** through DSH's Plugin Manager. An agent with the required permission can call the `plugin_manager` tool with:

```json
{
  "action": "install_bundle",
  "target": "/absolute/path/to/dsh-session-search"
}
```

This is tool input, not a shell command. Replace the target with the actual absolute directory, including the Windows drive when applicable. Use Plugin Manager instead of editing profile manifests or composition files by hand. Installation affects the current DSH profile, not only the current conversation.

**Do not enable multiple Session Search copies at the same time.** Disable an existing local `@local/dsh-session-search` bundle first. The public package does not automatically migrate/remove it; overlapping shortcuts, UI registrations, routes, services and tool names can conflict. The repository name is not a claim of npm availability.

## Usage

1. Click the sidebar magnifying glass or press **Ctrl+F / ⌘F**. Type to search after a short debounce, or press Enter.
2. **All workspaces** is the default. Select a workspace to restrict both the session dropdown and search; changing workspace clears the selected session and the title/ID filter. **Ungrouped / no workspace** keeps conversations outside registered workspaces searchable. In all-workspace scope, results and session choices show workspace names; hover a workspace label to see its path.
3. Keep **All sessions**, select a conversation, or click **Search this session** on a result. Filter the picker by title or ID. It shows whole conversations, latest user activity first; forks and Ungrouped conversations remain valid choices, and unnamed conversations use a readable fallback title.
4. Adjust matching and scope options. **Final model replies only** starts on; **Include subagent conversations** and **Include archived sessions** start off.
5. Choose result order and, for all-session scope, **Timeline / By session**. Groups are ordered by their newest matching message, or oldest matching message when reversed. A message counts once even when the query occurs repeatedly in it.
6. Expand groups and use **Load more results / Load more sessions** (40 entries per page). Group counts include all matching events, not just loaded pages.
7. Click **Refresh sessions** after activity, rename, deletion or archival elsewhere. **Open conversation** navigates to an unarchived conversation, but cannot scroll to the exact matching event. Restore archived sessions in DSH's sidebar/archive manager before opening; search never restores them.

Escape or the close button returns to the conversation. Query/options survive while the client module stays loaded; loaded pages and expansion state survive view switches while the panel stays mounted. These are not permanent settings across application restarts. For native browser page-find while the plugin owns Ctrl+F/⌘F, use the browser menu.

## Matching rules and searchable content

| Toggle | Meaning |
| --- | --- |
| **Aa — Match Case** | Case-sensitive; otherwise Unicode case-insensitive. |
| **ab — Whole Word** | The complete match must not touch a Unicode letter, number or underscore. This is not language-aware word segmentation. |
| **.* — Regular Expression** | JavaScript Unicode pattern source, without `/` delimiters or trailing flags. Aa controls case sensitivity. |

All toggles start off: punctuation is literal, and whitespace between query terms is flexible. Query length is limited to 1,024 UTF-16 code units. Invalid patterns and matching that exceeds **100 ms per session** fail the whole search explicitly rather than silently omitting matches. Zero-width matches use a small vertical highlight. Matching runs on complete stored message text; snippets/highlights are bounded previews, not every occurrence in a long message.

**Final replies** are text blocks from the last non-interrupted assistant message of a successfully completed turn, provided that message contains no tool call. Progress text, reasoning, tool calls/results, open/interrupted turns and tool-only endings are excluded. This is inferred from durable events, not a stored final/commentary channel label.

Turn **Final model replies only** off to include stored user/system/developer inputs, intermediate assistant text, reasoning, tool calls/results and recorded failed-attempt text. Search does not retrieve hidden provider data, OCR images or open attachment files. Raw provider envelopes and stream duplicates of committed messages are not separately indexed.

Every eligible session is scanned before pagination so chronological ordering and group counts are complete for readable sessions. Large histories may be slow; later pages read history again. Unreadable sessions are reported as partial results, while a failed single-session read is an error. Changes to matching results or relevant metadata invalidate continuation cursors: search again to refresh.

## Agent tool

`search_session_text` supports:

- `action: "search"` (default): matching reply/event snippets, event numbers and UTF-16 highlight ranges.
- `action: "groups"`: paged conversation groups; `total` counts groups and `totalMatches` counts matching events.
- `action: "sessions"`: eligible session catalog without text matching.

`workspaceId` restricts all three actions to one workspace; omit it for all workspaces. Discover IDs from the `sessions` response's `workspaces` catalog, including `__ungrouped__`. Responses include workspace scope metadata, and each session, hit and group carries `workspaceId`, `workspaceTitle` and `workspacePath`. An unknown workspace or a session outside the selected workspace is rejected instead of broadening the search. Registered sidebar membership takes priority; an exact, unambiguous cwd-root match is the fallback. Ambiguous or unmatched conversations remain Ungrouped; subagents inherit their parent's workspace. Continuation cursors bind the workspace scope.

Options: `query`, optional `workspaceId` and `sessionId`, `includeSubagents`, `includeArchived`, `content` (`final` or `all`), `order` (`newest` or `oldest`), `matchCase`, `wholeWord` and `useRegex`. Pass `nextCursor` back as `cursor` with unchanged action/query/options to continue. Defaults match the panel. Tool availability depends on the active agent and DSH policy.

## Privacy and safety

Search operates locally in the current DSH profile. It does not edit, resume, restore or delete conversations. The HTTP endpoint requires DSH owner authentication and disables response caching. Snippets render as text, not session-supplied HTML; regex matching is bounded on the Host rather than executed in the browser.

Results can contain sensitive titles, IDs, paths, prompts, tool output and stored reasoning. **Agent-tool results may enter model context and be sent to the configured provider.** Queries may appear in request logs. Review results before sharing; never put private histories or credentials in issue reports.

## Development

```sh
npm run check
npm test
npm pack --dry-run
```

No dependency installation or build step is needed. Syntax checks and synthetic tests do not establish visual correctness or compatibility with another DSH version. Verify installation, representative searches, keyboard behavior and light/dark rendering in the target application.

Runtime files: [index.js](<index.js>) (Host/HTTP/tool), [search.js](<search.js>) (matching/sorting/grouping/pagination), [session-catalog.js](<session-catalog.js>) (catalog/event extraction), [client.js](<client.js>) (UI/shortcut). Display resources include the bundle patch, localized metadata and an original SVG icon. Historical internal cursor/VM version markers are implementation identifiers, not the public package version.

[Report an issue](https://github.com/Ziminli/dsh-session-search/issues) with your DSH/runtime version and a minimal synthetic example, not a private conversation export.

## License

[MIT](<LICENSE>) © 2026 Zimin Li. The included original SVG icon is covered by the same license.
