# Changelog / 更新日志

All package version changes must have an entry here before release. Entries are newest first and describe user-visible changes; GitHub releases link back to this file. / 每次插件包版本变更都必须先在此添加条目，按新到旧排列，记录面向用户的变化；GitHub Release 链接回此文件。

Versions 1.2.0–1.2.2 were initially installed only locally and their changes first reached GitHub in **1.2.3**. They are now backfilled as separate historical tags/releases from recovered development snapshots; the existing 1.2.3 tag is unchanged. Each 1.3.x version also has its own tag and release. Earlier private-bundle version numbers are not public-package releases. / 1.2.0–1.2.2 最初仅在本地安装，其改动首次随 **1.2.3** 上传 GitHub；现已从开发快照恢复并补发独立历史标签与 Release，原 1.2.3 标签保持不变。1.3.x 各版本也分别发布，不合并成单一版本。更早的私有包版本号不属于本公开包的发布历史。

## [1.3.6] - 2026-10-28

### Added / 新增
- Add a localized **Settings** shortcut to the search panel’s top-right corner. It opens the existing Session Search bundle settings through Plugin Manager’s supported navigation API without changing the selected conversation; unavailable navigation displays a fallback instruction instead of failing silently. / 搜索面板右上角新增中英文**设置**快捷入口，通过插件管理器公开导航 API 打开现有会话搜索设置页，不改变当前选中的对话；无法导航时显示备用进入方式，不再静默失败。

## [1.3.5] - 2026-10-28

### Fixed / 修复
- Keep workspace/session multiselects open when clicking nonfocusable row text or padding, allowing native label activation to toggle the checkbox exactly once. Previously, blur from the filter could dismiss the list before selection. Direct checkbox clicks and keyboard Space retain their native behavior; outside clicks, outside focus and Escape still dismiss the picker. / 点击工作区或会话多选列表的文字、行内留白时不再因筛选框失焦提前关闭，原生 label 激活可正常且仅切换一次复选框；直接点击复选框及键盘空格操作保持不变，外部点击、明确移出焦点和 Esc 仍可关闭列表。

## [1.3.4] - 2026-10-28

### Fixed / 修复
- Keep search-opened highlighted conversations in native Conversation mode instead of a custom main panel. This preserves the selected-session surface used by DSH’s file and link viewers. / 从搜索结果打开高亮对话时保持原生 Conversation 模式，不再切换到自定义主面板，保留 DSH 文件与链接查看器依赖的已选会话界面。
- Clear highlights and return with `selectPanel(null)`, not the visually equivalent but non-native `"conversation"` panel value. Esc and the clear/back buttons restore normal session-bound actions without reselecting the session in the sidebar. / 清除高亮时使用 `selectPanel(null)`，而非外观相同但非原生模式的 `"conversation"` 值；Esc 及清除/返回按钮恢复正常会话操作，无需重新点击侧边栏会话。
- Temporarily replace only the Conversation shell while highlighting, with a uniquely owned session child; clearing or navigating to another session disposes the replacement and restores the resident shell without redeclaring its slots. / 仅在高亮期间临时替换对话外壳，并拥有独立的会话子插槽；清除或切换会话时释放替换项、恢复原有外壳，不重复声明原有插槽。

## [1.3.3] - 2026-10-28

### Fixed / 修复
- Preserve the selected search event sequence and load history through that event before opening the highlighted conversation; stale navigation and load failures no longer silently open the latest page. / 保留选中搜索结果的事件序号，打开高亮对话前加载至该事件；过期导航或加载失败不会静默打开最新一页。
- Prioritize the selected Chat message within the bounded highlight scan and scroll its matching rendered text into view. An exact-row compatibility adapter never guesses at nearby messages; collapsed/unavailable content is explicitly reported, and user interaction stops automatic scrolling. / 在有限高亮扫描中优先处理选定 Chat 消息，并滚动至其中已渲染的匹配；精确行兼容适配器不会猜测附近消息，折叠/不可显示内容会明确提示，用户操作后停止自动滚动。
- Explain that highlight limits (200,000 UTF-16 units / 500 blocks / 2,048 marks) constrain display painting only, not search outcomes; make status text wrap instead of hiding the explanation behind an ellipsis. / 明确高亮上限（20 万 UTF-16 单元 / 500 文本块 / 2,048 区域）仅限制显示标黄，不减少搜索结果；状态文字换行显示，不再省略说明。

## [1.3.2] - 2026-10-28

### Fixed / 修复
- Register the highlighted conversation as a separate plugin-owned panel with an explicitly retained Session reference, rather than replacing or redeclaring the resident Conversation shell. This avoids a duplicate-slot startup failure that could hide the search UI. / 将高亮对话注册为插件独立面板，并显式持有会话引用，不再替换或重复声明原有对话外壳，避免重复插槽导致搜索界面无法启动。
- Reuse the shared Conversation content factory for Chat rendering and input; Esc or Clear returns to the ordinary conversation and releases the highlight panel's reference. / 复用共享对话内容工厂渲染 Chat 与输入区域；Esc 或清除按钮返回普通对话，并释放高亮面板持有的引用。
- Throttle updates so streaming cannot indefinitely postpone highlights in settled text; exclude hidden/editor/control gaps, and report zero-width regex matches without counting them as painted text. / 节流刷新，避免流式输出持续推迟已稳定文本的高亮；排除隐藏、编辑器与控件间隔，零宽正则匹配不计作已标黄文本。

## [1.3.1] - 2026-10-28

### Known issue / 已知问题
- This historical version redeclares a resident Conversation slot and can prevent the search UI from starting. Fixed in **1.3.2**; **1.3.3** is recommended. / 此历史版本重复声明原有对话插槽，可能导致搜索界面无法启动；已在 **1.3.2** 修复，建议使用 **1.3.3**。

### Added / 新增
- Opening a search result carries its matching mode into the conversation and temporarily paints matching displayed text yellow. Press **Esc**, or use the header's clear button, to remove the highlights. Saved messages are unchanged. / 从搜索结果打开对话时，沿用匹配模式，将显示文本中的匹配临时标黄。按 **Esc** 或点击标题栏清除按钮即可移除，不修改已保存消息。
- Reapply highlights as older messages load or collapsed content is expanded; matching stays on the Host under the same hard deadline, including regex and fuzzy modes. / 加载更早消息或展开折叠内容时重新高亮；正则及模糊匹配均在 Host 中受硬超时约束执行。
- Preserve the original conversation shell, Chat renderers, composer and width controls through a slot-owned wrapper; use CSS Custom Highlights without rewriting message DOM. / 通过插槽拥有的外层保留原有对话布局、Chat 渲染器、输入框及宽度控制，使用 CSS Custom Highlights，不改写消息 DOM。

## [1.3.0] - 2026-10-28

### Added / 新增
- Select multiple workspaces and multiple sessions, with searchable checkbox lists and explicit All choices; workspace selection restricts eligible sessions. / 工作区和会话均支持多选，提供可筛选的复选列表和明确的“全部”选项；工作区选择会限定可选会话。
- Filter matching messages by time using Today, Last 24 hours, Last 7 days, This month or custom local calendar dates. The end date includes the whole selected day (an exclusive next-midnight API bound). Filtering precedes matching, counts and pagination. / 支持今天、最近 24 小时、最近 7 天、本月及自定义本地日期；结束日期包含所选整天（API 截止为次日零点且不包含），在匹配、计数和分页前过滤消息。
- Save a profile-wide **Live / Enter or Search** search timing preference in the plugin's settings page, exposed through the same Host operation as the `session_search_settings` agent tool. / 可在插件设置页保存配置档级的**实时搜索 / 按 Enter 或搜索**触发方式，与 `session_search_settings` 代理工具共享同一 Host 操作。
- Extend the search API/tool with `workspaceIds`, `sessionIds`, `after` and `before`, preserving legacy singular scope fields. / 搜索 API 和工具新增 `workspaceIds`、`sessionIds`、`after` 和 `before`，保留旧版单范围字段兼容。

### Changed / 调整
- Use theme-aware yellow match backgrounds in snippets rather than blue/brand-only highlighting. / 摘要中的匹配改用主题适配的黄色背景，而不是仅使用蓝色或品牌色。

## [1.2.3] - 2026-10-28

### Fixed / 修复
- Replace the native **Newest first / Oldest first** dropdown with theme-token segmented buttons, including an explicit selected state and keyboard focus styling. / 将**最新优先 / 最早优先**原生下拉框改为使用主题颜色的分段按钮，提供明确选中状态和键盘焦点样式。
- Give the remaining dropdown options explicit theme-aware foreground/background colors instead of relying on native white popup defaults. / 为其余下拉选项明确设置主题前景与背景颜色，避免依赖原生白色弹层默认值。

### Documentation & maintenance / 文档与维护
- Backfill per-version changelog entries and require a current-version entry in package checks. / 补齐各版本更新日志，并在包检查中强制要求当前版本条目。
- Update English/Chinese plugin descriptions and document a ready-to-copy community listing entry with an accurate functional description and `session` category. / 更新中英文插件描述，提供可直接复制的社区收录条目，使用属实的功能说明和 `session` 分类。

## 1.2.2 - 2026-10-28

### Changed / 调整
- Redesign the search panel with a compact search card, grouped workspace/session filters, collapsible matching tips, and result-local view/order controls. / 重整搜索面板，采用紧凑搜索卡片、分组的工作区/会话筛选、可折叠匹配提示，以及靠近结果的视图与排序控件。
- Refine result cards, metadata badges, empty states, spacing and responsive layouts using DSH theme tokens; respect reduced-motion preferences. / 使用 DSH 主题变量优化结果卡片、信息标签、空状态、间距及响应式布局，并尊重减少动画的系统设置。

## 1.2.1 - 2026-10-28

### Added / 新增
- Show **“No exact matches found. Below are the fuzzy matches.”** only when a fuzzy search has results and no exact match exists anywhere in the selected scope. / 仅在模糊搜索有结果且整个所选范围没有精确匹配时提示**“未找到精确匹配。以下为模糊匹配结果。”**
- Compute exact-match presence from full eligible messages before pagination, respecting case, whole-word, scope and content settings; suppress the notice during loading, errors or incomplete reads. / 分页前检查符合范围的完整消息，遵循大小写、全字、范围和内容设置；加载中、出错或读取不完整时不显示提示。
- Separate settings/explanations from outcomes with a horizontal divider in both result views. / 两种结果视图都以水平分隔线区分设置说明与结果。

## 1.2.0 - 2026-10-28

### Added / 新增
- Add **Typo-tolerant** and **Subsequence** fuzzy search modes alongside default **Exact** matching, with English/Chinese controls and explanations. / 在默认**精确**匹配之外新增**拼写容错**和**子序列**两种模糊模式，提供中英文控件和说明。
- Typo matching supports insertion, deletion, substitution and adjacent letter transposition, with per-word edit limits; subsequence matching highlights ordered characters within candidate words. / 拼写容错支持插入、删除、替换及相邻字母交换，并限制每词编辑次数；子序列模式高亮候选词内依序出现的字符。
- Share fuzzy options across the UI, read-only agent tool and HTTP endpoint, preserving workspace/session/archive/subagent/content filters, chronological ordering and grouped results. / 界面、只读代理工具和 HTTP 接口共享模糊选项，保留工作区、会话、归档、子代理及内容筛选、时间排序和分组结果。
- Validate fuzzy/regex conflicts and query limits before reading history; bound matching work with a hard per-session deadline and bind pagination cursors to the fuzzy mode. / 读取历史前验证模糊/正则冲突及查询限制，以每会话硬超时限制匹配工作，并将分页游标绑定模糊模式。

## [1.1.0]

### Added / 新增
- Add **All workspaces / specific workspace** filtering and a workspace-dependent session picker; changing workspace clears the selected session. / 新增**所有工作区 / 指定工作区**筛选和联动会话选择器；切换工作区清除已选会话。
- Show workspace labels in cross-workspace choices and results; keep ungrouped conversations searchable and inherit parent workspace membership for subagents where applicable. / 跨工作区选项及结果显示工作区标签；保留未分组会话，并在适用时让子代理继承父会话工作区。
- Add the optional `workspaceId` tool/API parameter, validate conflicting scopes and bind cursors to workspace membership. / 工具和 API 新增可选 `workspaceId` 参数，验证范围冲突并将游标绑定工作区归属。

## [1.0.0]

### Added / 新增
- Initial public release of **Session Search**, opened from the sidebar or **Ctrl+F / ⌘F**. / 首个公开版本，可通过侧边栏或 **Ctrl+F / ⌘F** 打开**会话搜索**。
- Search all eligible sessions or one conversation; filter the titled session picker; optionally include archived and subagent conversations. / 搜索所有符合范围的会话或指定对话；按标题筛选会话选择器，可选包含归档及子代理。
- Case-sensitive, Unicode whole-word and regular-expression options; final replies by default or stored process text when enabled. / 支持区分大小写、Unicode 全字和正则匹配；默认搜索最终回复，也可启用已存储的过程文本。
- Timeline and collapsible session-group views, chronological ordering, highlighted snippets, pagination and conversation navigation. / 提供时间线、可折叠会话分组、时间排序、高亮摘要、分页和对话跳转。
- English/Chinese UI, exported plugin metadata and icon, MIT license, and a shared read-only agent tool without third-party dependencies or a build step. / 提供中英文界面、导出的插件元信息和图标、MIT 许可证及共享只读代理工具，不依赖第三方包或构建步骤。

[1.3.4]: https://github.com/Ziminli/dsh-session-search/compare/v1.3.3...v1.3.4
[1.3.3]: https://github.com/Ziminli/dsh-session-search/compare/v1.3.2...v1.3.3
[1.3.2]: https://github.com/Ziminli/dsh-session-search/compare/v1.3.1...v1.3.2
[1.3.1]: https://github.com/Ziminli/dsh-session-search/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/Ziminli/dsh-session-search/compare/v1.2.3...v1.3.0
[1.2.2]: https://github.com/Ziminli/dsh-session-search/compare/v1.2.1...v1.2.2
[1.2.1]: https://github.com/Ziminli/dsh-session-search/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Ziminli/dsh-session-search/compare/v1.1.0...v1.2.0
[1.2.3]: https://github.com/Ziminli/dsh-session-search/compare/v1.1.0...v1.2.3
[1.1.0]: https://github.com/Ziminli/dsh-session-search/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.0.0
