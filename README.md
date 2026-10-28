# DSH Session Search

English | [简体中文](<README.zh-CN.md>)

Search stored DeepSeek Harness (DSH) conversation text across all or selected workspaces and sessions, with exact, regular-expression, typo-tolerant or word-internal subsequence matching. Open the search panel from the sidebar or with **Ctrl+F / ⌘F**.

See the bilingual [Changelog](<CHANGELOG.md>) for changes in every package version.

An independent community plugin, not an official DSH package. **Package version: 1.3.0.**

## Features

- **All or multiple workspaces and sessions**, with searchable checkbox pickers and a latest-user-activity-first conversation list. Workspace and session scopes intersect; empty selection means all.
- **Message-time filters**: Today, Last 24 hours, Last 7 days, This month, or custom local calendar dates.
- Profile-persistent **Live / Enter or Search** search timing, configurable on the plugin's settings page.
- VS Code-style **Aa (Match Case)**, **ab (Whole Word)** and **.* (Regular Expression)** toggles, combinable with one another.
- Optional **Typo-tolerant** and **Subsequence** fuzzy modes alongside default **Exact** matching.
- **Timeline** results or collapsible **By session** groups with complete matching-message counts.
- **Newest first / Oldest first**, ordered by matching-message time rather than unrelated session activity.
- Optional **subagent conversations** and **archived sessions**, clearly labeled.
- **Final model replies only** by default; optionally search stored inputs, intermediate replies, tool calls/results and reasoning too.
- A compact, theme-aware search card, grouped workspace/session filters, collapsible search tips, and result-local view/order controls.
- Highlighted snippets, pagination, conversation-opening buttons, English/Chinese UI and DSH theme support. Narrow panels stack controls automatically; reduced-motion preferences are respected.
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

1. Click the sidebar magnifying glass or press **Ctrl+F / ⌘F**. By default, typing searches after a 300 ms debounce. Under **Plugins → Session Search**, set **When to search → Only on Enter / Search** and Save to require explicit submission. In that mode, text and filter changes wait together; stale outcomes are hidden until you submit.
2. **All workspaces** is the default. Open the workspace picker to select one or more workspaces; changing selection clears selected sessions. **Clear selection (all)** restores all-workspace scope. **Ungrouped / no workspace** includes conversations outside registered workspaces. Session choices and cross-workspace results show workspace names; hover a label to see its path.
3. Keep **All sessions**, select multiple conversations using checkboxes, or click **Search this session** on a result. Filter picker options by title or ID; **Select all listed** adds the currently filtered choices. Each choice is a whole conversation, latest user activity first. Forks and unnamed conversations remain available. Workspace and session selections intersect.
4. Adjust matching, scope and **Message time** options. Presets include Today, Last 24 hours, Last 7 days and This month. Custom start/end dates use your browser's local timezone; an end date includes that entire calendar day. Either bound may be omitted. Time uses individual message timestamps, not session activity, and relative windows stay fixed while loading more. **Final model replies only** starts on; subagents and archived sessions start off.
5. Choose result order and, for all-session scope, **Timeline / By session**. Groups are ordered by their newest matching message, or oldest matching message when reversed. A message counts once even when the query occurs repeatedly in it.
6. Expand groups and use **Load more results / Load more sessions** (40 entries per page). Group counts include all matching events, not just loaded pages.
7. Click **Refresh sessions** after activity, rename, deletion or archival elsewhere. **Open conversation** navigates to an unarchived conversation, but cannot scroll to the exact matching event. Restore archived sessions in DSH's sidebar/archive manager before opening; search never restores them.

Escape or the close button returns to the conversation. Query/options survive while the client module stays loaded; loaded pages and expansion state survive view switches while the panel stays mounted. These are not permanent settings across application restarts; the saved search-timing preference is profile-persistent. For native browser page-find while the plugin owns Ctrl+F/⌘F, use the browser menu.

## Matching rules and searchable content

| Toggle | Meaning |
| --- | --- |
| **Aa — Match Case** | Case-sensitive; otherwise Unicode case-insensitive. |
| **ab — Whole Word** | The complete match must not touch a Unicode letter, number or underscore. This is not language-aware word segmentation. |
| **.* — Regular Expression** | JavaScript Unicode pattern source, without `/` delimiters or trailing flags. Aa controls case sensitivity. |

All toggles start off: punctuation is literal, and whitespace between query terms is flexible. Query length is limited to 1,024 UTF-16 code units. Invalid patterns and matching that exceeds **100 ms per session** fail the whole search explicitly rather than silently omitting matches. Zero-width matches use a small vertical highlight. Matching runs on complete stored message text; snippets/highlights are bounded previews, not every occurrence in a long message.

### Fuzzy modes

Use **Text matching → Typo-tolerant / Subsequence**; **Exact** stays the default. Choosing a fuzzy mode turns Regex off; turning Regex on restores Exact. The HTTP/tool API rejects requests combining `useRegex: true` with a non-`off` `fuzzy` value.

When a fuzzy search has results but no exact matches anywhere in the selected scope, a notice above the outcomes says **“No exact matches found. Below are the fuzzy matches.”** Exact detection respects case, whole-word and scope/content settings and scans complete messages before pagination. The notice is suppressed while loading, on errors or incomplete reads, and when no fuzzy results exist. A horizontal divider separates settings/explanations from results in both views.

- **Typo-tolerant**: `wrokspace` or `workspce` finds `workspace`. Compares complete Unicode letter/number/underscore words using insertion, deletion, substitution and adjacent transposition (optimal string alignment). Query words of 1–3 Unicode characters allow 0 edits, 4–7 allow 1, and 8+ allow 2. The matched word is highlighted.
- **Subsequence**: `wrkspc` finds `workspace`. Characters stay in order **inside a single word**, not across arbitrary message text; highlights mark the selected characters. Candidate words may have at most `4 × query-word length + 8` Unicode characters to limit noisy matches.
- Multiple query words form a **contiguous phrase**, in query order, with flexible whitespace. Punctuation stays literal. Words are maximal Unicode letter/number/underscore runs, not language-aware segmentation; fuzzy search is not semantic or synonym search.
- Match Case and Whole Word remain available. Fuzzy word tokens already compare full words; Whole Word additionally guards the complete phrase's outer edges, including punctuation-led/trailing phrases.
- Fuzzy queries are limited to **128 Unicode code points / 16 word terms**, within the general 1,024 UTF-16-unit limit. Both modes keep chronological ordering, complete group counts, scope filtering and the same hard per-session matching deadline. Fuzzy results are not relevance-ranked.

**Final replies** are text blocks from the last non-interrupted assistant message of a successfully completed turn, provided that message contains no tool call. Progress text, reasoning, tool calls/results, open/interrupted turns and tool-only endings are excluded. This is inferred from durable events, not a stored final/commentary channel label.

Turn **Final model replies only** off to include stored user/system/developer inputs, intermediate assistant text, reasoning, tool calls/results and recorded failed-attempt text. Search does not retrieve hidden provider data, OCR images or open attachment files. Raw provider envelopes and stream duplicates of committed messages are not separately indexed.

Every eligible session is scanned before pagination so chronological ordering and group counts are complete for readable sessions. Large histories may be slow; later pages read history again. Unreadable sessions are reported as partial results, while a failed single-session read is an error. Changes to matching results or relevant metadata invalidate continuation cursors: search again to refresh.

## Agent tool

`search_session_text` supports:

- `action: "search"` (default): matching reply/event snippets, event numbers and UTF-16 highlight ranges.
- `action: "groups"`: paged conversation groups; `total` counts groups and `totalMatches` counts matching events.
- `action: "sessions"`: eligible session catalog without text matching.

`workspaceId` restricts all three actions to one workspace; omit it for all workspaces. Discover IDs from the `sessions` response's `workspaces` catalog, including `__ungrouped__`. Responses include workspace scope metadata, and each session, hit and group carries `workspaceId`, `workspaceTitle` and `workspacePath`. An unknown workspace or a session outside the selected workspace is rejected instead of broadening the search. Registered sidebar membership takes priority; an exact, unambiguous cwd-root match is the fallback. Ambiguous or unmatched conversations remain Ungrouped; subagents inherit their parent's workspace. Continuation cursors bind the workspace scope.

Options: `query`, `workspaceIds` (up to 200 IDs), `sessionIds` (up to 1,000 IDs), `after` / `before` (inclusive/exclusive Unix epoch milliseconds), `includeSubagents`, `includeArchived`, `content` (`final` or `all`), `order` (`newest` or `oldest`), `matchCase`, `wholeWord`, `useRegex` and `fuzzy` (`off`, `typo` or `subsequence`). Empty/omitted arrays mean all; selections are OR within a list and AND between lists. Legacy `workspaceId` / `sessionId` remain supported, but cannot be combined with a nonempty corresponding plural field. Invalid/unavailable selections are errors, never silently broadened. Time bounds exclude messages with missing timestamps, apply before matching/group counts/pagination and do not filter the session catalog. Pass `nextCursor` back as `cursor` with unchanged action/query/options to continue. Defaults match the panel. Tool availability depends on the active agent and DSH policy.

`session_search_settings` reads the saved timing preference when called with `{}`; `{ "searchMode": "live" }` or `{ "searchMode": "submit" }` saves it through the same operation used by the plugin settings UI. This changes configuration, not conversations. The settings HTTP endpoint accepts owner-authenticated GET/POST; writes require JSON and failures are explicit.

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

Runtime files: [index.js](<index.js>) (Host/HTTP/tool), [settings.js](<settings.js>) (validated, persisted timing preference), [search.js](<search.js>) (matching/sorting/grouping/pagination), [session-catalog.js](<session-catalog.js>) (catalog/event extraction), [client.js](<client.js>) (UI/shortcut). Display resources include the bundle patch, localized metadata and an original SVG icon. Historical internal cursor/VM version markers are implementation identifiers, not the public package version.

[Report an issue](https://github.com/Ziminli/dsh-session-search/issues) with your DSH/runtime version and a minimal synthetic example, not a private conversation export.

## Releases and community listing

Every package-version change must add a user-visible entry to [CHANGELOG.md](<CHANGELOG.md>); `npm run check` verifies the current version has one. Publish the matching `vX.Y.Z` Git tag and GitHub Release with notes referring to that entry. Local-only development versions are identified explicitly in the history.

A ready-to-copy [community listing entry](<docs/community-listing.yml>) follows the [community contribution guide](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin/blob/main/contributing.md): accurate one-line English/Chinese descriptions ending in a period, canonical repository URL and the `session` category. To submit it, open a separate PR to that community repository adding only `data/plugins/Ziminli__dsh-session-search.yml` with this entry. Do not edit their generated READMEs. This file in our repository is a template, **not a submitted or accepted listing**. The community also checks repository age (at least one day), the `dsh-plugin` topic, the installable `dsh.bundle` manifest and working code. Our exported SVG is for the DSH UI; the optional community `icon` field is omitted because that field requires a GitHub-hosted raster image.

## License

[MIT](<LICENSE>) © 2026 Zimin Li. The included original SVG icon is covered by the same license.
