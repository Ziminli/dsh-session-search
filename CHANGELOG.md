# Changelog / 更新日志

Each historical version is published with its own recovered source snapshot, annotated tag, package asset and release notes. Existing v1.2.3 history is preserved; v1.2.0–v1.2.2 are backfilled on a separate history branch. / 各历史版本独立恢复源码快照、标签、安装包与发布说明；保留既有 v1.2.3 历史，v1.2.0–v1.2.2 在独立历史分支补发。

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

[1.2.2]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.2.2
[1.2.1]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.2.1
[1.2.0]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.2.0
[1.1.0]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.1.0
[1.0.0]: https://github.com/Ziminli/dsh-session-search/releases/tag/v1.0.0
