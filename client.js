window.__ModuleLoader__.load({
  id: 'dsh-session-search',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const PANEL = 'local-session-search';
    const NS = 'local-session-search';
    const en = {
      title: 'Session Search', intro: 'Find text in your conversation history.', all: 'All sessions', scope: 'Search scope',
      placeholder: 'Search conversation text…', search: 'Search', clear: 'Clear', close: 'Back to conversation',
      loading: 'Searching…', empty: 'No matches found. Try different text or broaden your scope.',
      start: 'Search all sessions, or choose one session to find individual messages.',
      grouped: 'Every matching reply/event across conversations.',
      events: 'Matching events in the selected session.', more: 'Load more results', open: 'Open conversation',
      pending: 'No matches in this batch. Load more to search the remaining sessions.', partial: 'Some sessions could not be read. Results may be incomplete.',
      within: 'Search this session', retry: 'Retry', catalogError: 'Could not load the session list.',
      results: 'Results', sessionFilter: 'Filter session names or IDs…', choose: 'Choose a session',
      shortcut: 'Ctrl+F / ⌘F', event: 'Event', stale: 'If history changed, search again to refresh the results.',
      sessions: 'sessions', loadingSessions: 'Loading sessions…', unavailable: 'Selected session',
      matching: 'Choose literal, case-sensitive, whole-word or regular-expression matching.',
      includeSubagents: 'Include subagent conversations', subagent: 'Subagent', conversations: 'Conversations', subagents: 'Subagent conversations',
      pickerHint: 'One entry per conversation, shown by its session title. Forked conversations stay separate.'
    };
    const zh = {
      title: '会话搜索', intro: '在历史对话中查找文本。', all: '所有会话', scope: '搜索范围',
      placeholder: '搜索对话文本…', search: '搜索', clear: '清空', close: '返回对话',
      loading: '正在搜索…', empty: '没有匹配结果。请尝试其他文本或扩大搜索范围。',
      start: '搜索所有会话，或选择指定会话来查找各条消息。',
      grouped: '显示所有对话中的全部匹配回复或事件。',
      events: '所选会话中的匹配事件。', more: '加载更多结果', open: '打开对话',
      pending: '本批会话中没有匹配。请加载更多以搜索其余会话。', partial: '部分会话无法读取，结果可能不完整。',
      within: '搜索此会话', retry: '重试', catalogError: '无法加载会话列表。',
      results: '结果', sessionFilter: '筛选会话名称或 ID…', choose: '选择会话',
      shortcut: 'Ctrl+F / ⌘F', event: '事件', stale: '如果历史记录已变化，请重新搜索以刷新结果。',
      sessions: '个会话', loadingSessions: '正在加载会话…', unavailable: '所选会话',
      matching: '支持字面文本、区分大小写、全字和正则表达式匹配。',
      includeSubagents: '包含子代理对话', subagent: '子代理', conversations: '对话', subagents: '子代理对话',
      pickerHint: '每个条目代表一个完整对话，以会话标题显示。分叉对话单独列出。'
    };
    Object.assign(en, {
      grouped: 'Every matching reply/event across eligible conversations, ordered by message date.',
      matching: 'One result per matching reply/event, not per text occurrence. Final replies exclude reasoning, tools and intermediate messages.',
      matchCase: 'Match Case', wholeWord: 'Match Whole Word', useRegex: 'Use Regular Expression', searchModes: 'Search modes',
      regexHint: 'Regular expressions use JavaScript Unicode syntax, without / delimiters. Complex patterns may time out.',
      fuzzy: 'Text matching', fuzzyOff: 'Exact', fuzzyTypo: 'Typo-tolerant', fuzzySubsequence: 'Subsequence',
      fuzzyOnly: 'No exact matches found. Below are the fuzzy matches.',
      fuzzyOffHint: 'Exact text by default. Select a fuzzy mode for spelling mistakes or abbreviations. Regex and fuzzy modes are mutually exclusive.',
      fuzzyTypoHint: 'Match complete words with small spelling mistakes, including swapped letters: wrokspace → workspace. Words of 1–3 characters require an exact match; 4–7 allow 1 edit; 8+ allow 2. Max 128 characters / 16 words.',
      fuzzySubsequenceHint: 'Match ordered letters inside each word: wrkspc → workspace. Words must stay together in query order; matches cannot span unrelated text. Candidate words are limited to 4× query-word length + 8. Max 128 characters / 16 words.',
      pickerHint: 'Whole conversations, latest user activity first. Empty/internal-only sessions are omitted; untitled conversations remain available.',
      includeArchived: 'Include archived sessions', archived: 'Archived', finalOnly: 'Final model replies only',
      finalHint: 'Turn this off to include user inputs, intermediate replies, tools and stored reasoning.',
      sort: 'Result order', newest: 'Newest first', oldest: 'Oldest first', untitled: 'Untitled conversation',
      refresh: 'Refresh sessions', archivedHint: 'Archived conversations must be restored from the sidebar/archive manager before opening.',
      workspace: 'Workspace', allWorkspaces: 'All workspaces', ungroupedWorkspace: 'Ungrouped / no workspace',
      workspaceHint: 'The session list and search are restricted to the selected workspace. Changing workspace clears the selected session.',
      view: 'Result view', timeline: 'Timeline', bySession: 'By session', matches: 'matching messages',
      treeHint: 'Conversations ordered by their newest matching message (oldest when reversed). Expand a conversation to see its matches.',
      moreSessions: 'Load more sessions', loadedMatches: 'Loaded matches', groupChanged: 'History changed since the session counts were loaded. Search again to refresh.'
    });
    Object.assign(zh, {
      grouped: '显示所有符合范围的对话中的全部匹配回复或事件，按消息时间排序。',
      matching: '每条匹配回复或事件显示一个结果，不按文本出现次数计数。最终回复不包含推理、工具和中间消息。',
      matchCase: '区分大小写', wholeWord: '全字匹配', useRegex: '使用正则表达式', searchModes: '匹配模式',
      regexHint: '正则表达式采用 JavaScript Unicode 语法，不需要 / 分隔符。复杂表达式可能超时。',
      fuzzy: '文本匹配', fuzzyOff: '精确', fuzzyTypo: '拼写容错', fuzzySubsequence: '子序列',
      fuzzyOnly: '未找到精确匹配。以下为模糊匹配结果。',
      fuzzyOffHint: '默认精确匹配。选择模糊模式可容忍拼写错误或使用缩写。正则表达式与模糊模式互斥。',
      fuzzyTypoHint: '匹配有少量拼写错误的完整词，包括相邻字母交换：wrokspace → workspace。1–3 字符的词需精确匹配，4–7 字符允许 1 次编辑，8 字符以上允许 2 次。查询最多 128 字符 / 16 个词。',
      fuzzySubsequenceHint: '在每个词内依序匹配字符：wrkspc → workspace。各词必须按查询顺序连续出现，不跨无关文本匹配。候选词长度不超过查询词长度的 4 倍加 8。查询最多 128 字符 / 16 个词。',
      pickerHint: '每项代表完整对话，按最近用户活动排序。空会话和内部会话不显示；未命名对话仍可搜索。',
      includeArchived: '包含已归档会话', archived: '已归档', finalOnly: '仅搜索模型最终回复',
      finalHint: '取消勾选以包含用户输入、中间回复、工具和存储的推理文本。',
      sort: '结果排序', newest: '最新优先', oldest: '最早优先', untitled: '未命名对话',
      refresh: '刷新会话', archivedHint: '请先在侧边栏或归档管理中恢复已归档会话，再打开对话。',
      workspace: '工作区', allWorkspaces: '所有工作区', ungroupedWorkspace: '未分组 / 无工作区',
      workspaceHint: '会话列表和搜索仅限所选工作区。切换工作区会清除已选会话。',
      view: '结果视图', timeline: '时间线', bySession: '按会话', matches: '条匹配消息',
      treeHint: '按各会话最新匹配消息排序（最早优先时反向）。展开会话以查看匹配消息。',
      moreSessions: '加载更多会话', loadedMatches: '已加载消息', groupChanged: '会话计数加载后历史记录已变化，请重新搜索以刷新。'
    });
    Object.assign(en, {filters: 'Search filters', tips: 'Search tips & matching rules', session: 'Session', readyTitle: 'Your conversations, within reach', emptyTitle: 'No matches yet', pendingTitle: 'More history to search', resultsHint: 'Matching messages', filterNames: 'Filter session list', navigation: 'Search navigation', typoExample: 'wrokspace → workspace', subsequenceExample: 'wrkspc → workspace'});
    Object.assign(zh, {filters: '搜索筛选', tips: '搜索提示与匹配规则', session: '会话', readyTitle: '轻松找回对话中的细节', emptyTitle: '暂未找到匹配', pendingTitle: '还有历史记录待搜索', resultsHint: '匹配消息', filterNames: '筛选会话列表', navigation: '搜索导航', typoExample: 'wrokspace → workspace', subsequenceExample: 'wrkspc → workspace'});
    Object.assign(en, {
      searchMode: 'When to search', liveMode: 'Real-time (300 ms debounce)', submitMode: 'Only on Enter / Search',
      modeHint: 'Applies to this profile. In Enter / Search mode, query and filter edits wait for submission.',
      save: 'Save', saving: 'Saving…', saved: 'Saved', settingsLoading: 'Loading search settings…', settingsError: 'Could not load search settings.',
      pendingChanges: 'Changes pending — press Enter or Search to apply the entire query and filters.',
      selectAll: 'Select all listed', clearSelection: 'Clear selection (all)', selectedCount: 'selected', filterOptions: 'Filter names or IDs…', noOptions: 'No options found.',
      workspaceHint: 'Choose one or more workspaces; an empty selection means all. Changing workspaces clears selected sessions.',
      timeRange: 'Message time', allTime: 'All time', today: 'Today', last24h: 'Last 24 hours', last7d: 'Last 7 days', thisMonth: 'This month', custom: 'Custom',
      startDate: 'Start date', endDate: 'End date', timeHint: 'Uses message timestamps, not session activity. Dates use your browser’s local timezone; the end date includes the entire local day. Relative ranges are fixed when searching and stay fixed while loading more.',
      timeError: 'Choose valid dates with the start date on or before the end date.',
      submitReady: 'Press Enter or Search to search with these filters.',
      sessionLimit: 'Select at most 1,000 sessions, or clear the selection to search all sessions.',
      workspaceLimit: 'Select at most 200 workspaces, or clear the selection to search all workspaces.'
    });
    Object.assign(zh, {
      searchMode: '搜索触发方式', liveMode: '实时搜索（防抖 300 毫秒）', submitMode: '仅按回车 / 点击搜索时',
      modeHint: '保存到当前配置档。回车 / 搜索模式下，文本与筛选修改将在提交后生效。',
      save: '保存', saving: '正在保存…', saved: '已保存', settingsLoading: '正在加载搜索设置…', settingsError: '无法加载搜索设置。',
      pendingChanges: '有待应用的修改 — 按回车或点击搜索以应用完整文本与筛选条件。',
      selectAll: '全选当前列表', clearSelection: '清除选择（全部）', selectedCount: '项已选', filterOptions: '筛选名称或 ID…', noOptions: '没有符合条件的选项。',
      workspaceHint: '可选择多个工作区；未选择表示全部。更改工作区将清除已选会话。',
      timeRange: '消息时间', allTime: '所有时间', today: '今天', last24h: '最近 24 小时', last7d: '最近 7 天', thisMonth: '本月', custom: '自定义',
      startDate: '开始日期', endDate: '结束日期', timeHint: '按消息时间戳筛选，而非会话活动时间。日期采用浏览器本地时区；结束日期包含当地整天。相对时间在搜索时固定，加载更多时不会移动。',
      timeError: '请选择有效日期，且开始日期不得晚于结束日期。', submitReady: '按回车或点击搜索，使用这些筛选条件开始搜索。',
      sessionLimit: '最多选择 1,000 个会话，或清除选择以搜索所有会话。',
      workspaceLimit: '最多选择 200 个工作区，或清除选择以搜索所有工作区。'
    });
    Object.assign(en, {conversationHighlights: 'Search highlights', clearHighlights: 'Clear highlights (Esc)', highlighting: 'Highlighting loaded conversation text…', highlightReady: 'Matching text is highlighted. Press Esc to clear.', highlightEmpty: 'No matches in the currently displayed text. Load older messages or expand collapsed content to highlight more.', highlightLimited: 'Highlight limit reached; only part of the displayed text is highlighted.', highlightZeroWidth: 'Nonempty matches are highlighted; zero-width regex matches have no text to paint.', highlightUnavailable: 'This browser does not support conversation highlights.', highlightFailed: 'Could not highlight conversation text.'});
    Object.assign(en, {
      highlightLimited: 'Display highlighting is capped (200,000 characters / 500 blocks / 2,048 marks). The selected message is prioritized; search results are not reduced.',
      highlightTargetHidden: 'The selected event is loaded, but its text is collapsed or not shown in Chat. Expand the relevant turn, reasoning or tool result.',
      highlightJumpFailed: 'Could not load the selected message. Return to search and try again.'
    });
    Object.assign(zh, {conversationHighlights: '搜索高亮', clearHighlights: '清除高亮（Esc）', highlighting: '正在高亮已加载的对话文本…', highlightReady: '匹配文本已高亮。按 Esc 清除。', highlightEmpty: '当前显示的文本中没有匹配。加载更早消息或展开折叠内容可继续高亮。', highlightLimited: '已达到高亮上限，仅高亮部分显示文本。', highlightZeroWidth: '已高亮非空匹配；零宽正则匹配没有可标黄文本。', highlightUnavailable: '当前浏览器不支持对话高亮。', highlightFailed: '无法高亮对话文本。'});
    Object.assign(zh, {
      highlightLimited: '显示高亮已达上限（20 万字符 / 500 文本块 / 2,048 处标记）。优先处理所选消息；搜索结果并未减少。',
      highlightTargetHidden: '所选事件已加载，但文本处于折叠状态或未在聊天视图中显示。请展开对应轮次、推理或工具结果。',
      highlightJumpFailed: '无法加载所选消息。请返回搜索后重试。'
    });
    const css = `
    .dss-page{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;width:100%;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px;line-height:1.5;container-type:inline-size}
    .dss-page *{box-sizing:border-box}.dss-page [hidden]{display:none!important}.dss-page p{margin:0}.dss-muted{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.65}
    .dss-head{padding:22px 28px;display:flex;justify-content:space-between;gap:16px;align-items:center;border-bottom:1px solid var(--dsw-alias-border-l1)}.dss-brand{display:flex;align-items:center;gap:13px;min-width:0}.dss-emblem{display:grid;place-items:center;width:42px;height:42px;flex-shrink:0;border-radius:13px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.dss-page h1{font-size:20px;line-height:1.35;letter-spacing:-.4px;margin:0 0 3px;font-weight:650}.dss-head-actions{display:flex;align-items:center;gap:12px;flex-shrink:0}
    .dss-body{overflow:auto;min-height:0;flex:1;padding:28px 28px 40px;scrollbar-gutter:stable}.dss-inner{max-width:1040px;margin:0 auto}.dss-controls{padding:20px;border:1px solid var(--dsw-alias-border-l1);border-radius:16px;background:var(--dsw-alias-bg-layer-1)}
    .dss-page input,.dss-page select{font:inherit;font-size:13px;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:9px 11px;min-width:0;min-height:38px;max-width:100%}.dss-page input::placeholder{color:var(--dsw-alias-label-secondary)}.dss-page button{font:inherit;font-size:13px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);padding:8px 12px;line-height:1.5;transition:background .15s,border-color .15s}.dss-page button:hover{background:var(--dsw-alias-bg-layer-2)}.dss-page button:disabled{opacity:.5;cursor:default}.dss-page button:focus-visible,.dss-page input:focus-visible,.dss-page select:focus-visible,.dss-page summary:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:3px}
    .dss-form{display:flex;gap:10px;margin:0 0 18px;align-items:stretch}.dss-searchbox{display:flex;align-items:center;flex:1;min-width:0;border:1px solid var(--dsw-alias-border-l2);border-radius:11px;background:var(--dsw-alias-bg-base);padding:4px 7px 4px 13px;gap:6px}.dss-searchbox>svg{flex-shrink:0;color:var(--dsw-alias-label-secondary)}.dss-page .dss-query{flex:1;width:100%;min-width:50px;font-size:15px;border:0;background:transparent;padding:10px 6px;box-shadow:none}.dss-searchbox:focus-within{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.dss-page .dss-query:focus-visible{outline:none}.dss-modes{display:flex;gap:2px;flex-shrink:0}.dss-page .dss-mode{font-family:monospace;font-size:13px;min-width:29px;min-height:29px;padding:3px 4px;border-radius:6px;border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}.dss-page .dss-mode[aria-pressed="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}.dss-mode-word{text-decoration:underline;text-underline-offset:3px}
    .dss-page .dss-primary{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);font-weight:600;background:var(--dsw-alias-bg-layer-2)}.dss-page .dss-submit{padding:10px 20px;border-radius:11px}.dss-page .dss-icon-button{width:32px;height:32px;padding:0;flex-shrink:0;border-color:transparent;background:transparent;font-size:21px;color:var(--dsw-alias-label-secondary)}.dss-page .dss-clear{font-size:18px;width:26px;height:28px}.dss-shortcut{white-space:nowrap;font-family:inherit;font-size:11px;border:1px solid var(--dsw-alias-border-l2);border-bottom-width:2px;border-radius:6px;padding:3px 7px;color:var(--dsw-alias-label-secondary)}
    .dss-filter-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,1fr);gap:14px}.dss-field{display:flex;flex-direction:column;gap:6px;min-width:0}.dss-field>label,.dss-field-label{font-size:11px;font-weight:600;letter-spacing:.3px;color:var(--dsw-alias-label-secondary)}.dss-field select{width:100%}.dss-session-field{grid-column:2 / 4}.dss-session-controls{display:grid;grid-template-columns:minmax(90px,.65fr) minmax(0,1fr);gap:8px}.dss-session-controls input,.dss-session-controls select{width:100%}.dss-match-row{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px}.dss-match-row>label{font-size:12px;color:var(--dsw-alias-label-secondary)}.dss-match-row select{padding:5px 10px;min-height:32px}
    .dss-options{display:flex;gap:10px 18px;flex-wrap:wrap;align-items:center;padding-top:16px;margin-top:16px;border-top:1px solid var(--dsw-alias-border-l1)}.dss-check{display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-size:12px;line-height:1.5}.dss-check input{width:15px;height:15px;min-height:0;padding:0;margin:0;accent-color:var(--dsw-alias-brand-primary)}.dss-page .dss-refresh{margin-left:auto;padding:4px 6px;font-size:12px;border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}
    .dss-tips{margin-top:13px;font-size:12px;color:var(--dsw-alias-label-secondary)}.dss-tips summary{cursor:pointer;display:list-item;width:fit-content;max-width:100%;padding:3px 0;user-select:none}.dss-tips[open] summary{margin-bottom:10px;color:var(--dsw-alias-label-primary)}.dss-tip-body{display:grid;gap:8px;padding:12px 14px;background:var(--dsw-alias-bg-base);border-radius:9px;line-height:1.7}.dss-tip-body strong{font-weight:600;color:var(--dsw-alias-label-primary)}
    .dss-divider{border:0;border-top:1px solid var(--dsw-alias-border-l1);margin:26px 0 20px;width:100%}.dss-results-toolbar{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}.dss-results-title{font-size:14px;font-weight:600;margin:0}.dss-display-options{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.dss-page select option{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}.dss-views{display:inline-flex;gap:2px;padding:3px;background:var(--dsw-alias-bg-layer-2);border-radius:8px}.dss-page .dss-view{font-size:12px;border-color:transparent;padding:3px 10px;background:transparent;border-radius:5px;color:var(--dsw-alias-label-secondary)}.dss-page .dss-view[aria-pressed="true"]{background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-border-l1);font-weight:600}
    .dss-note{margin:0 0 16px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.dss-result-count{color:var(--dsw-alias-label-primary);font-variant-numeric:tabular-nums}.dss-message{padding:48px 22px;text-align:center;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);line-height:1.8;color:var(--dsw-alias-label-secondary);font-size:13px}.dss-message>svg{display:block;margin:0 auto 16px;padding:12px;box-sizing:content-box;border-radius:16px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary)}.dss-message h3{font-size:16px;font-weight:600;color:var(--dsw-alias-label-primary);margin:0 0 7px}.dss-page .dss-fuzzy-notice{padding:12px 15px;margin:0 0 16px;border-left:3px solid var(--dsw-alias-brand-primary);border-radius:0 8px 8px 0;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.65}.dss-error{color:var(--dsw-alias-state-error-primary);padding:14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:14px 0;font-size:13px;overflow-wrap:anywhere}
    .dss-hit{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:13px;margin-bottom:12px;padding:18px 20px;transition:border-color .15s}.dss-hit:hover{border-color:var(--dsw-alias-border-l2)}.dss-hit h2{font-size:15px;line-height:1.5;margin:0;font-weight:600;overflow-wrap:anywhere}.dss-hit-heading{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.dss-meta{display:flex;align-items:center;gap:6px 12px;flex-wrap:wrap;margin:8px 0 12px;font-size:11px}.dss-event-type{font-weight:500;color:var(--dsw-alias-label-primary)}.dss-id{font-family:monospace;overflow-wrap:anywhere;font-size:10px}.dss-meta .dss-id{margin-left:auto}.dss-badge{display:inline-flex;gap:4px;align-items:center;min-width:0;max-width:100%;font-size:10px;line-height:1.7;font-weight:500;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:1px 6px;vertical-align:middle;overflow-wrap:anywhere}.dss-badge svg{flex-shrink:0}.dss-workspace-badge{max-width:100%}
    .dss-snippet{white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:13px;line-height:1.85;margin:0 0 14px;padding:12px 14px;background:var(--dsw-alias-bg-base);border-radius:8px;max-height:260px;overflow:auto}.dss-snippet mark{background:var(--dsw-alias-state-warn-primary);color:var(--dss-mark-ink,var(--dsw-alias-bg-base));font-weight:650;border-radius:3px;padding:0 1px;box-shadow:0 0 0 1px var(--dsw-alias-state-warn-primary);text-decoration:none}.dss-actions{display:flex;gap:12px;flex-wrap:wrap}.dss-page .dss-actions button{padding:3px 0;font-size:12px;border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}.dss-page .dss-actions .dss-primary{color:var(--dsw-alias-brand-primary);font-weight:500}.dss-page .dss-actions button:hover{color:var(--dsw-alias-brand-primary);text-decoration:underline}.dss-page .dss-more{display:flex;margin:22px auto;padding:9px 20px;border-radius:9px}
    .dss-group{border:1px solid var(--dsw-alias-border-l1);border-radius:13px;margin:0 0 12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}.dss-group h2{font-size:14px;margin:0}.dss-page .dss-group-toggle{display:flex;align-items:center;text-align:left;gap:11px;width:100%;border:0;border-radius:0;padding:17px 20px 10px;background:transparent}.dss-group-title{flex:1;min-width:0;overflow-wrap:anywhere;font-weight:600}.dss-chevron{flex-shrink:0;color:var(--dsw-alias-label-secondary);transition:transform .15s}.dss-group-toggle[aria-expanded="true"] .dss-chevron{transform:rotate(90deg)}.dss-group-count{font-size:11px;font-weight:500;color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);border-radius:6px;padding:3px 8px;text-align:right}.dss-group-meta{padding:0 20px 15px 45px;display:flex;gap:8px;flex-wrap:wrap;font-size:11px}.dss-group-body{margin:0 18px 18px 26px;padding-left:14px;border-left:2px solid var(--dsw-alias-border-l2)}.dss-group-body .dss-hit{background:var(--dsw-alias-bg-base);padding:12px 14px}.dss-group-body .dss-snippet{background:var(--dsw-alias-bg-layer-1)}.dss-group-body .dss-meta{margin-top:0}.dss-group-body .dss-message{padding:18px}.dss-group-progress{padding:8px 0;font-size:11px}.dss-group .dss-more{margin:12px auto}.dss-zero{display:inline-block;width:2px;min-height:1em;vertical-align:text-bottom;background:var(--dsw-alias-brand-primary)}
    @container(max-width:720px){.dss-head{padding:18px 20px}.dss-body{padding:20px}.dss-controls{padding:16px}.dss-filter-grid{grid-template-columns:1fr 1fr}.dss-session-field{grid-column:1 / -1}.dss-field:first-child{grid-column:1 / -1}.dss-shortcut{display:none}.dss-page .dss-refresh{margin-left:0}}
    @container(max-width:480px){.dss-head{padding:16px}.dss-head .dss-muted{font-size:11px}.dss-emblem{width:34px;height:34px;border-radius:10px}.dss-brand{gap:10px}.dss-page h1{font-size:18px}.dss-body{padding:16px 12px 28px}.dss-form{flex-wrap:wrap;gap:8px}.dss-searchbox{flex-basis:100%}.dss-page .dss-submit{width:100%;padding:8px}.dss-session-controls{grid-template-columns:1fr}.dss-options{align-items:flex-start;gap:12px;flex-direction:column}.dss-hit{padding:14px}.dss-meta .dss-id{margin-left:0}.dss-results-toolbar{align-items:flex-start}.dss-group-toggle .dss-group-count{max-width:105px}.dss-group-body{margin-left:12px;padding-left:10px}.dss-group-meta{padding-left:20px}}
    .dss-picker{position:relative;min-width:0}.dss-page .dss-picker-trigger{width:100%;justify-content:space-between;text-align:left;min-height:38px}.dss-picker-panel{position:absolute;z-index:20;top:calc(100% + 5px);left:0;width:100%;min-width:min(280px,80vw);max-width:85vw;padding:10px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-base)}.dss-picker-panel>input{width:100%}.dss-picker-tools{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.dss-page .dss-picker-tools button{font-size:11px;padding:3px 6px}.dss-picker-list{max-height:240px;overflow:auto;overscroll-behavior:contain}.dss-picker-option{display:flex;align-items:flex-start;gap:8px;padding:8px;border-radius:6px;overflow-wrap:anywhere;font-size:12px;cursor:pointer}.dss-picker-option:hover{background:var(--dsw-alias-bg-layer-2)}.dss-picker-option input{flex-shrink:0;width:15px;height:15px;min-height:0;padding:0;margin:3px 0;accent-color:var(--dsw-alias-brand-primary)}.dss-time-grid{margin-top:14px}.dss-pending{margin:12px 0;color:var(--dsw-alias-state-warn-primary);font-size:12px}.dss-settings{height:auto;display:block;padding:16px;border-radius:12px;border:1px solid var(--dsw-alias-border-l1)}.dss-settings .dss-field{margin-bottom:12px}.dss-settings .dss-save-row{display:flex;align-items:center;gap:12px}.dss-zero{background:var(--dsw-alias-state-warn-primary)!important}
    @media(prefers-reduced-motion:reduce){.dss-page *{transition:none!important}}
    `;
    function Icon({size = 20}) {
      return h('svg', {width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true},
        h('circle', {cx: 10.5, cy: 10.5, r: 6.8}), h('path', {d: 'm16 16 5 5'}));
    }
    function Glyph({kind, size = 15}) {
      const paths = {refresh: 'M20 7v5h-5 M4 17v-5h5 M6.1 7a7 7 0 0 1 11.5-2L20 8 M4 16l2.4 3A7 7 0 0 0 18 17', arrow: 'M5 12h14 M13 6l6 6-6 6', timeline: 'M8 5h12 M8 12h12 M8 19h12 M3 5h.01 M3 12h.01 M3 19h.01', folder: 'M3 7h6l2-3h5l2 3h3v13H3z', back: 'M19 12H5 M11 6l-6 6 6 6'};
      return h('svg', {width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true}, h('path', {d: paths[kind] || paths.arrow}));
    }
    function BranchIcon() {
      return h('svg', {width: 12, height: 12, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, 'aria-hidden': true},
        h('circle', {cx: 4, cy: 3, r: 1.5}), h('circle', {cx: 12, cy: 4, r: 1.5}), h('circle', {cx: 4, cy: 13, r: 1.5}), h('path', {d: 'M4 4.5v7M4 9h3a5 5 0 0 0 5-3.5'}));
    }
    const shortId = id => id.replace(/^session-/, '').slice(0, 8);
    // Only render Host-computed ranges: executing a user regex here could freeze the UI.
    // All session text remains React text nodes, never HTML.
    function Highlight({text, ranges}) {
      const source = String(text || '');
      if (!Array.isArray(ranges) || !ranges.length) return source;
      const parts = [];
      let start = 0;
      for (const [index, range] of ranges.slice(0, 100).entries()) {
        if (!Number.isInteger(range.start) || !Number.isInteger(range.end) || range.start < start || range.end < range.start || range.end > source.length) continue;
        parts.push(source.slice(start, range.start), h('mark', {key: index, className: range.start === range.end ? 'dss-zero' : undefined}, source.slice(range.start, range.end)));
        start = range.end;
      }
      parts.push(source.slice(start));
      return h(React.Fragment, null, ...parts);
    }
    // Parse date inputs as browser-local calendar dates, never UTC date-only strings.
    function localDay(value) {
      if (!value) return undefined;
      const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
      if (!match) return NaN;
      const [, year, month, day] = match.map(Number);
      const date = new Date(0); date.setFullYear(year, month - 1, day); date.setHours(0, 0, 0, 0);
      return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date.getTime() : NaN;
    }
    function timeBounds(preset, start, end, now) {
      if (preset === 'all') return {};
      if (preset === 'custom') {
        const after = localDay(start), endDay = localDay(end);
        if ((after !== undefined && !Number.isFinite(after)) || (endDay !== undefined && !Number.isFinite(endDay)) || (after !== undefined && endDay !== undefined && after > endDay)) return null;
        const date = endDay === undefined ? null : new Date(endDay);
        if (date) date.setDate(date.getDate() + 1);
        return {after, before: date?.getTime()};
      }
      if (preset === '24h' || preset === '7d') return {after: now - (preset === '24h' ? 1 : 7) * 86400000, before: now};
      const date = new Date(now); date.setHours(0, 0, 0, 0);
      if (preset === 'month') date.setDate(1);
      return {after: date.getTime(), before: now};
    }
    // Exact event identities only. Chat anchors can precede assistant settlement;
    // never navigate to the numerically nearest row (that could be another reply).
    function selectedChatNodeKeys(chat, seq) {
      if (!Number.isSafeInteger(seq) || !chat?.order || !chat.nodes?.get) return [];
      return chat.order.filter(key => {
        const node = chat.nodes.get(key);
        return node && [node.anchorSeq, node.data?.seq, node.data?.finalNode?.seq, node.data?.root?.seq].includes(seq);
      });
    }
    async function loadSelectedMessage(reference, intent, isCurrent) {
      await reference.ready;
      if (!isCurrent()) return false;
      if (Number.isSafeInteger(intent.seq)) await reference.binding.session.loadThrough(intent.seq);
      return isCurrent();
    }
    return {
      inject: ['slots', 'layout', 'locale', 'uiWorkspace', 'sessions'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'en', en));
        ctx.effect(() => ctx.locale.register(NS, 'zh', zh));
        const t = ctx.locale.bind(NS);
        const stored = {query: '', sessionIds: [], workspaceIds: [], includeSubagents: false, includeArchived: false, finalOnly: true, order: 'newest', matchCase: false, wholeWord: false, useRegex: false, fuzzy: 'off', view: 'timeline', timePreset: 'all', startDate: '', endDate: ''};
        const settingListeners = new Set();
        let settingsEpoch = 0;
        async function settingsApi(method = 'GET', searchMode, signal) {
          const response = await fetch(new URL('api/local-session-search-settings', document.baseURI), {
            method, credentials: 'same-origin', cache: 'no-store', signal,
            ...(method === 'POST' ? {headers: {'Content-Type': 'application/json'}, body: JSON.stringify({searchMode})} : {})
          });
          const value = await response.json();
          if (!response.ok) throw new Error(value.error || `HTTP ${response.status}`);
          if (!['live', 'submit'].includes(value.searchMode)) throw new Error(t('settingsError'));
          return value;
        }
        function SettingsForm({view}) {
          React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
          const [mode, setMode] = React.useState('live');
          const [loaded, setLoaded] = React.useState(false);
          const [busy, setBusy] = React.useState(false);
          const [error, setError] = React.useState('');
          const [saved, setSaved] = React.useState(false);
          const [retry, setRetry] = React.useState(0);
          const control = React.useRef(null);
          const id = React.useId();
          React.useEffect(() => {
            const controller = new AbortController(); control.current = controller;
            setLoaded(false); setError('');
            settingsApi('GET', undefined, controller.signal).then(value => {
              if (!controller.signal.aborted) {setMode(value.searchMode); setLoaded(true);}
            }).catch(err => {if (!controller.signal.aborted) setError(err.message);});
            return () => {controller.abort(); control.current?.abort();};
          }, [retry]);
          if (view === 'summary') return h('p', null, t('modeHint'));
          const save = async event => {
            event.preventDefault(); if (!loaded || busy) return;
            const controller = new AbortController(); control.current = controller;
            setBusy(true); setError(''); setSaved(false);
            try {
              const value = await settingsApi('POST', mode, controller.signal);
              if (controller.signal.aborted) return;
              settingsEpoch++; for (const listener of settingListeners) listener(value.searchMode);
              setMode(value.searchMode); setSaved(true);
            } catch (err) {if (!controller.signal.aborted) setError(err.message);}
            finally {if (!controller.signal.aborted) setBusy(false);}
          };
          return h('form', {className: 'dss-page dss-settings', onSubmit: save, 'aria-busy': !loaded && !error || busy}, h('style', null, css),
            h('div', {className: 'dss-field'}, h('label', {htmlFor: id}, t('searchMode')),
              h('select', {id, value: mode, disabled: !loaded || busy, onChange: e => {setMode(e.target.value); setSaved(false);}},
                h('option', {value: 'live'}, t('liveMode')), h('option', {value: 'submit'}, t('submitMode'))), h('p', {className: 'dss-muted'}, t('modeHint'))),
            !loaded && !error && h('p', {role: 'status'}, t('settingsLoading')),
            error && h('div', {className: 'dss-error', role: 'alert'}, error, !loaded && h('button', {type: 'button', onClick: () => setRetry(v => v + 1)}, t('retry'))),
            h('div', {className: 'dss-save-row'}, h('button', {type: 'submit', className: 'dss-primary', disabled: !loaded || busy}, t(busy ? 'saving' : 'save')),
              saved && h('span', {role: 'status'}, t('saved'))));
        }
        function MultiPicker({label, allLabel, values, options, onChange, disabled, hint}) {
          const [open, setOpen] = React.useState(false);
          const [filter, setFilter] = React.useState('');
          const root = React.useRef(null), trigger = React.useRef(null), field = React.useRef(null);
          const id = React.useId();
          React.useEffect(() => {if (disabled) setOpen(false);}, [disabled]);
          React.useEffect(() => {
            if (!open) return;
            field.current?.focus();
            const outside = event => {if (!root.current?.contains(event.target)) setOpen(false);};
            document.addEventListener('pointerdown', outside);
            return () => document.removeEventListener('pointerdown', outside);
          }, [open]);
          const known = new Set(options.map(option => option.id));
          const entries = [...options, ...values.filter(value => !known.has(value)).map(value => ({id: value, label: value}))];
          const visible = entries.filter(option => `${option.label} ${option.id}`.toLowerCase().includes(filter.toLowerCase()));
          const selected = new Set(values);
          return h('div', {className: 'dss-picker', ref: root, onBlur: event => {if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);}, onKeyDown: event => {
            if (event.key === 'Escape' && open) {event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus();}
          }}, h('button', {ref: trigger, type: 'button', className: 'dss-picker-trigger', disabled, title: hint, 'aria-label': label, 'aria-expanded': open, 'aria-controls': id, 'aria-haspopup': 'dialog', onClick: () => setOpen(value => !value)},
            values.length ? `${values.length} ${t('selectedCount')}` : allLabel, h('span', {'aria-hidden': true}, '▾')),
            open && h('div', {id, className: 'dss-picker-panel', role: 'dialog', 'aria-label': label},
              h('input', {ref: field, type: 'search', value: filter, placeholder: t('filterOptions'), 'aria-label': `${label}: ${t('filterNames')}`, onChange: e => setFilter(e.target.value)}),
              h('div', {className: 'dss-picker-tools'},
                h('button', {type: 'button', onClick: () => onChange([...new Set([...values, ...visible.map(option => option.id)])])}, t('selectAll')),
                h('button', {type: 'button', onClick: () => onChange([])}, t('clearSelection'))),
              h('div', {className: 'dss-picker-list', role: 'group', 'aria-label': label}, visible.length ? visible.map(option => h('label', {key: option.id, className: 'dss-picker-option', title: option.title || option.id},
                h('input', {type: 'checkbox', checked: selected.has(option.id), onChange: e => onChange(e.target.checked ? [...values, option.id] : values.filter(value => value !== option.id))}), h('span', null, option.label))) : h('p', {className: 'dss-muted'}, t('noOptions')))));
        }
        // Opaque warn fill remains yellow in both palettes. Pick a contrasting ink
        // from existing semantic surfaces, recalculating when the palette changes.
        function useHighlightContrast() {
          const root = React.useRef(null);
          React.useEffect(() => {
            const node = root.current; if (!node) return;
            const probe = document.createElement('span'); probe.hidden = true; node.append(probe);
            const luminance = color => {
              const rgb = color.match(/[\d.]+/g)?.slice(0, 3).map(Number);
              if (!rgb || rgb.length !== 3) return null;
              return rgb.map(value => {const v = value / 255; return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;}).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
            };
            const update = () => {
              const readColor = token => {probe.style.color = `var(${token})`; return luminance(getComputedStyle(probe).color);};
              const yellow = readColor('--dsw-alias-state-warn-primary');
              if (yellow === null) return;
              let best = '', score = 0;
              for (const token of ['--dsw-alias-label-primary', '--dsw-alias-bg-base']) {
                const ink = readColor(token); if (ink === null) continue;
                const contrast = (Math.max(ink, yellow) + .05) / (Math.min(ink, yellow) + .05);
                if (contrast > score) {score = contrast; best = token;}
              }
              if (best) node.style.setProperty('--dss-mark-ink', `var(${best})`);
            };
            update();
            const observer = new MutationObserver(update);
            observer.observe(document.body, {attributes: true, attributeFilter: ['style', 'class', 'data-ds-dark-theme']});
            observer.observe(document.documentElement, {attributes: true, attributeFilter: ['style', 'class']});
            return () => {observer.disconnect(); probe.remove();};
          }, []);
          return root;
        }
        const focusListeners = new Set();
        const focus = () => {for (const fn of focusListeners) fn();};
        ctx.effect(() => {
          const keydown = event => {
            if (!(event.ctrlKey || event.metaKey) || event.altKey || event.shiftKey || event.key.toLowerCase() !== 'f' || event.isComposing || event.repeat) return;
            try {ctx.layout.selectPanel(PANEL);} catch {return;}
            event.preventDefault();
            focus();
          };
          window.addEventListener('keydown', keydown);
          return () => window.removeEventListener('keydown', keydown);
        });
        async function api(input, signal) {
          const params = new URLSearchParams();
          for (const [key, value] of Object.entries(input)) if (value !== undefined && value !== '') params.set(key, Array.isArray(value) ? JSON.stringify(value) : value);
          // Relative to the mounted application URL; signed same-origin cookie only.
          const response = await fetch(new URL(`api/local-session-search?${params}`, document.baseURI), {credentials: 'same-origin', cache: 'no-store', signal});
          const value = await response.json();
          if (!response.ok) throw new Error(value.error || `HTTP ${response.status}`);
          return value;
        }
        // View-only intent: never saved to session events, storage, or the URL.
        let highlightIntent = null;
        let highlightPanelMounted = false;
        const HIGHLIGHT_PANEL = 'local-session-search-highlight';
        const highlightListeners = new Set();
        const setHighlightIntent = value => {highlightIntent = value; for (const listener of highlightListeners) listener();};
        const clearHighlights = () => {
          setHighlightIntent(null);
          if (highlightPanelMounted) ctx.layout.selectPanel('conversation');
        };
        ctx.effect(() => {
          const escape = event => {
            if (event.key !== 'Escape' || event.isComposing || !highlightIntent) return;
            event.preventDefault(); event.stopPropagation(); clearHighlights();
          };
          window.addEventListener('keydown', escape, true);
          return () => {window.removeEventListener('keydown', escape, true); setHighlightIntent(null); window.CSS?.highlights?.delete('dss-conversation-match');};
        });
        const HighlightRoot = React.createContext(null);
        const highlightCss = `
          .dss-conversation-root{display:flex;flex-direction:column;flex:1 1 auto;min-width:0;min-height:0;height:100%;position:relative}
          .dss-conversation-root *::highlight(dss-conversation-match){background:var(--dsw-alias-state-warn-primary);color:var(--dss-mark-ink,var(--dsw-alias-bg-base));text-decoration:none}
          .dss-highlight-header{display:flex;align-items:center;gap:12px;flex-wrap:wrap;flex-shrink:0;padding:12px 18px;border-bottom:1px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-base)}
          .dss-highlight-header>strong{flex:1;min-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
          .dss-highlight-header>button{font:inherit;cursor:pointer;padding:5px 9px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
          .dss-highlight-header>button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
          .dss-conversation-highlight-control{display:inline-flex;align-items:center;gap:6px;max-width:640px;min-width:0;color:var(--dsw-alias-label-secondary);font-size:11px}
          .dss-conversation-highlight-control span{white-space:normal;overflow-wrap:anywhere;line-height:1.5}
          .dss-conversation-highlight-control button{font:inherit;cursor:pointer;padding:3px 7px;border:1px solid var(--dsw-alias-border-l2);border-radius:6px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}
          .dss-conversation-highlight-control button:hover{background:var(--dsw-alias-bg-layer-2)}
          .dss-conversation-highlight-control button:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
        `;
        // Other main-panel keys have no ambient Session. Retain one explicit
        // reference, bind it through our own scoped child, and release on exit.
        function HighlightedConversation({renderSlot, SessionProvider}) {
          React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
          const intent = React.useSyncExternalStore(fn => {highlightListeners.add(fn); return () => highlightListeners.delete(fn);}, () => highlightIntent);
          const [opened, setOpened] = React.useState(null);
          const [error, setError] = React.useState('');
          React.useEffect(() => {
            highlightPanelMounted = true;
            return () => {highlightPanelMounted = false;};
          }, []);
          React.useEffect(() => {
            setOpened(null); setError('');
            if (!intent) return;
            let cancelled = false, reference;
            try {
              reference = ctx.sessions.retain(intent.sessionId, {source: 'gateway'});
              // Chat's latest page alone may not contain the selected event.
              loadSelectedMessage(reference, intent, () => !cancelled && highlightIntent === intent).then(current => {
                if (current) setOpened({intent, reference});
              }).catch(failure => {if (!cancelled && highlightIntent === intent) setError(`${t('highlightJumpFailed')} ${failure.message}`);});
            } catch (failure) {setError(failure.message);}
            return () => {cancelled = true; reference?.release();};
          }, [intent]);
          return opened?.intent === intent && intent ? h(SessionProvider, {session: opened.reference}, renderSlot('session-search.highlight.body', {})) :
            h('div', {className: 'dss-page'}, h('style', null, css),
              h('p', {role: error ? 'alert' : 'status'}, error || t('highlighting')),
              h('button', {type: 'button', onClick: clearHighlights}, t('close')));
        }
        function HighlightedConversationBody({sessionId, renderFactorySlot, useSessions, useChat}) {
          const root = useHighlightContrast();
          const title = useSessions(snapshot => snapshot.byId[sessionId]?.title);
          return h(HighlightRoot.Provider, {value: root}, h('div', {ref: root, className: 'dss-conversation-root'},
            h('style', null, highlightCss),
            h('header', {className: 'dss-highlight-header', 'data-dss-highlight-ui': ''},
              h('strong', {title: title || sessionId}, title || t('untitled')),
              h(ConversationHighlights, {sessionId, useChat}),
              h('button', {type: 'button', onClick: clearHighlights}, t('close'))),
            renderFactorySlot('conversation.content', {variant: 'embedded', phase: 'active', hero: false})));
        }
        // Read only our owned subtree; CSS Custom Highlights paint DOM Ranges
        // without inserting mark tags into React's tree or changing saved text.
        function collectHighlightBlocks(root, priorityRoots = []) {
          const excluded = 'script,style,textarea,input,select,button,header,nav,form,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="dialog"],[data-dss-highlight-ui]';
          const groups = [], seen = new Set();
          let total = 0, visited = 0, truncated = false;
          // Spend the bounded budget on the clicked message before earlier history.
          for (const scope of [...priorityRoots, root]) {
            if (truncated) break;
            const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
            let node, previousBlock;
          while ((node = walker.nextNode())) {
            if (++visited > 20000) {truncated = true; break;}
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'BR' || node.matches(excluded)) previousBlock = null;
              continue;
            }
            if (seen.has(node)) {previousBlock = null; continue;}
            seen.add(node);
            const parent = node.parentElement;
            if (!parent || parent.closest(excluded) || !node.data.length || !parent.getClientRects().length) {previousBlock = null; continue;}
            const style = getComputedStyle(parent);
            if (style.visibility === 'hidden' || style.visibility === 'collapse') {previousBlock = null; continue;}
            const block = parent.closest('p,pre,li,td,th,h1,h2,h3,h4,h5,h6,div,section,article') || parent;
            if (!root.contains(block)) continue;
            if ((previousBlock !== block && groups.length >= 500) || total + node.data.length > 200000) {truncated = true; break;}
            if (previousBlock !== block) {groups.push({text: '', nodes: []}); previousBlock = block;}
            const group = groups[groups.length - 1];
            group.nodes.push({node, start: group.text.length, text: node.data});
            group.text += node.data; total += node.data.length;
          }
          }
          return {blocks: groups, truncated};
        }
        function domHighlightRange(block, start, end, root) {
          if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start || end > block.text.length) return null;
          const first = block.nodes.find(part => part.start + part.text.length > start || start === block.text.length && part.start + part.text.length === start);
          const last = block.nodes.find(part => part.start + part.text.length >= end);
          if (!first || !last || !root.contains(first.node) || !root.contains(last.node)) return null;
          const range = document.createRange();
          range.setStart(first.node, start - first.start); range.setEnd(last.node, end - last.start);
          return range;
        }
        function ConversationHighlights({sessionId, useChat}) {
          const chat = useChat(snapshot => snapshot);
          const chatRef = React.useRef(chat); chatRef.current = chat;
          React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
          const root = React.useContext(HighlightRoot);
          const intent = React.useSyncExternalStore(fn => {highlightListeners.add(fn); return () => highlightListeners.delete(fn);}, () => highlightIntent);
          const active = intent?.sessionId === sessionId ? intent : null;
          const [status, setStatus] = React.useState({intent: null, key: 'highlighting'});
          React.useEffect(() => {
            if (!active || !root?.current) return;
            const registry = window.CSS?.highlights;
            if (!registry || typeof window.Highlight !== 'function') {setStatus({intent: active, key: 'highlightUnavailable'}); return;}
            const container = root.current;
            let timer, controller, disposed = false, generation = 0, landed = false, rowLocated = false, userMoved = false;
            const stopJump = () => {userMoved = true;};
            const stopKeyJump = event => {if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stopJump();};
            container.addEventListener('wheel', stopJump, {passive: true});
            container.addEventListener('touchstart', stopJump, {passive: true});
            container.addEventListener('pointerdown', stopJump);
            container.addEventListener('keydown', stopKeyJump);
            const targetRows = () => {
              const keys = new Set(selectedChatNodeKeys(chatRef.current, active.seq));
              // Compatibility adapter, scoped to our own embedded occurrence.
              // Data attributes are not a public navigation API: missing/changed
              // markup degrades to an explicit unavailable/hidden notice, never a
              // guess at a different message.
              return [...container.querySelectorAll('[data-chat-node-key]')].filter(row => keys.has(row.getAttribute('data-chat-node-key')));
            };
            const scrollRange = range => {
              if (landed || userMoved || !range.getClientRects().length) return;
              let viewport = range.startContainer.parentElement, scrolled = false;
              while (viewport && viewport !== container) {
                const style = getComputedStyle(viewport);
                if (/(auto|scroll)/.test(style.overflowY) && viewport.scrollHeight > viewport.clientHeight) {
                  // Tool/process bodies can scroll inside the main transcript.
                  // Re-read the range rectangle after each inner adjustment.
                  const rect = range.getBoundingClientRect(), box = viewport.getBoundingClientRect();
                  viewport.scrollTo({top: Math.max(0, viewport.scrollTop + rect.top - box.top - viewport.clientHeight * .35), behavior: 'instant'});
                  scrolled = true;
                }
                viewport = viewport.parentElement;
              }
              if (scrolled) landed = true;
            };
            const clearPaint = () => registry.delete('dss-conversation-match');
            // Throttle, rather than trailing debounce: streaming must not postpone
            // painting the settled messages forever. Keep old valid ranges meantime.
            const schedule = () => {
              if (timer || disposed) return;
              timer = setTimeout(() => {timer = null; scan();}, 250);
            };
            async function scan() {
              const current = ++generation;
              controller?.abort(); controller = new AbortController();
              const signal = controller.signal;
              setStatus({intent: active, key: 'highlighting'});
              try {
                const rows = targetRows();
                const visibleRows = rows.filter(row => row.getClientRects().length && getComputedStyle(row).visibility !== 'hidden');
                if (!landed && !userMoved && !rowLocated && visibleRows.length) {
                  visibleRows[0].scrollIntoView({block: 'center', behavior: 'instant'});
                  rowLocated = true;
                  // Let viewport-bound Chat content reveal after the row scroll.
                  schedule();
                }
                const snapshot = collectHighlightBlocks(container, visibleRows);
                const response = await fetch(new URL('api/local-session-search-highlight', document.baseURI), {
                  method: 'POST', credentials: 'same-origin', cache: 'no-store', signal,
                  headers: {'Content-Type': 'application/json'},
                  body: JSON.stringify({...active.spec, texts: snapshot.blocks.map(block => block.text)})
                });
                const value = await response.json();
                if (!response.ok) throw new Error(value.error || `HTTP ${response.status}`);
                if (disposed || signal.aborted || current !== generation || highlightIntent !== active) return;
                // A streaming block must not prevent stable messages being painted.
                const valid = snapshot.blocks.map(block => block.nodes.every(part => container.contains(part.node) && part.node.data === part.text));
                if (valid.some(value => !value)) schedule();
                const highlight = new window.Highlight();
                let count = 0, zeroWidth = false, selectedRange = null;
                for (const item of value.items || []) {
                  const block = snapshot.blocks[item.index]; if (!block || !valid[item.index]) continue;
                  for (const selected of item.ranges || []) {
                    if (selected.start === selected.end) {zeroWidth = true; continue;}
                    if (count >= 2048) break;
                    const range = domHighlightRange(block, selected.start, selected.end, container);
                    if (range) {
                      highlight.add(range); count++;
                      if (!selectedRange && rows.some(row => row.contains(range.startContainer))) selectedRange = range;
                    }
                  }
                }
                registry.set('dss-conversation-match', highlight);
                if (selectedRange) scrollRange(selectedRange);
                const limited = snapshot.truncated || value.truncated || count >= 2048 || value.items?.some(item => item.rangesTruncated);
                setStatus({intent: active, key: Number.isSafeInteger(active.seq) && !selectedRange && !landed ? 'highlightTargetHidden' : limited ? 'highlightLimited' : zeroWidth ? 'highlightZeroWidth' : count ? 'highlightReady' : 'highlightEmpty', limited});
              } catch (error) {
                if (!disposed && !signal.aborted && current === generation) {clearPaint(); setStatus({intent: active, key: 'highlightFailed', error: error.message});}
              }
            }
            const observer = new MutationObserver(changes => {
              if (changes.some(change => {
                const target = change.target.nodeType === Node.TEXT_NODE ? change.target.parentElement : change.target;
                return target && !target.closest('[data-dss-highlight-ui],style,header,nav,form,button,[contenteditable]:not([contenteditable="false"])');
              })) schedule();
            });
            observer.observe(container, {subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['hidden', 'open', 'class', 'style']});
            schedule();
            return () => {
              disposed = true; generation++; clearTimeout(timer); controller?.abort(); observer.disconnect(); clearPaint();
              container.removeEventListener('wheel', stopJump); container.removeEventListener('touchstart', stopJump);
              container.removeEventListener('pointerdown', stopJump); container.removeEventListener('keydown', stopKeyJump);
            };
          }, [active, root, sessionId]);
          if (!active) return null;
          const message = status.intent === active ? `${t(status.key)}${status.limited && status.key !== 'highlightLimited' ? ` ${t('highlightLimited')}` : ''}` : t('highlighting');
          return h('div', {'data-dss-highlight-ui': '', className: 'dss-conversation-highlight-control', role: 'status', title: `${message}${status.error ? ` ${status.error}` : ''}`},
            h('span', null, `${t('conversationHighlights')}: ${active.spec.query} — ${message}${status.intent === active && status.error ? ` ${status.error}` : ''}`),
            h('button', {type: 'button', title: t('clearHighlights'), 'aria-label': t('clearHighlights'), onClick: clearHighlights}, '×'));
        }
        function openHighlightedConversation(hit, request) {
          const spec = {query: request.query, matchCase: request.matchCase, wholeWord: request.wholeWord, useRegex: request.useRegex, fuzzy: request.fuzzy};
          const previous = highlightIntent;
          setHighlightIntent({sessionId: hit.sessionId, seq: hit.seq, spec});
          try {ctx.uiWorkspace.openSession(hit.sessionId); ctx.layout.selectPanel(HIGHLIGHT_PANEL);} catch (error) {setHighlightIntent(previous); throw error;}
        }
        // Keep pages mounted across view switches; a switch is presentation only.
        // Request keys isolate query/filter changes, and abort/generation guards
        // prevent late replies or pagination from overwriting a newer search.
        function usePaged(request, enabled, revision, delay = 300) {
          const key = JSON.stringify([request, revision]);
          const active = React.useRef({key, enabled}); active.current = {key, enabled};
          const [state, setState] = React.useState({key, page: null, busy: false, error: ''});
          const [retry, setRetry] = React.useState(0);
          const cache = React.useRef(null);
          const current = React.useRef(null);
          const moreControl = React.useRef(null);
          const requestRef = React.useRef(request); requestRef.current = request;
          React.useEffect(() => {
            const controller = new AbortController();
            current.current = controller; moreControl.current?.abort();
            if (cache.current?.key !== key) cache.current = null;
            const cached = cache.current?.page ?? null;
            setState({key, page: cached, busy: enabled && !cached, error: ''});
            if (enabled && !cached) {
              const timer = setTimeout(() => {
                if (controller.signal.aborted || active.current.key !== key || !active.current.enabled) return;
                api(requestRef.current, controller.signal).then(page => {
                  if (controller.signal.aborted || active.current.key !== key || !active.current.enabled) return;
                  cache.current = {key, page}; setState({key, page, busy: false, error: ''});
                }).catch(err => {
                  if (!controller.signal.aborted && active.current.key === key && active.current.enabled) setState({key, page: null, busy: false, error: err.message});
                });
              }, delay);
              return () => {clearTimeout(timer); controller.abort(); moreControl.current?.abort();};
            }
            return () => {controller.abort(); moreControl.current?.abort();};
          }, [key, enabled, retry, delay]);
          const value = enabled && state.key === key ? state : {page: null, busy: enabled, error: ''};
          async function more() {
            if (!enabled || active.current.key !== key || !active.current.enabled || value.busy || moreControl.current && !moreControl.current.signal.aborted || !value.page?.nextCursor) return;
            const controller = new AbortController(); moreControl.current = controller;
            const owner = current.current;
            setState(old => ({...old, busy: true, error: ''}));
            try {
              const next = await api({...request, cursor: value.page.nextCursor}, controller.signal);
              if (controller.signal.aborted || owner !== current.current || active.current.key !== key || !active.current.enabled) return;
              const identity = item => `${item.sessionId}:${item.seq ?? 'group'}`;
              const seen = new Set(value.page.items.map(identity));
              const page = {...next, items: [...value.page.items, ...next.items.filter(item => !seen.has(identity(item)))]};
              cache.current = {key, page}; setState({key, page, busy: false, error: ''});
            } catch (err) {
              if (!controller.signal.aborted && owner === current.current && active.current.key === key && active.current.enabled) setState(old => ({...old, busy: false, error: `${err.message} — ${t('stale')}`}));
            } finally {if (moreControl.current === controller) moreControl.current = null;}
          }
          return {...value, more, refresh: () => {cache.current = null; setRetry(v => v + 1);}};
        }
        function FuzzyNotice({page, busy, error}) {
          // This is scope-wide Host metadata, not a guess from the loaded snippets.
          // Never claim absence while loading, on failure, or with unreadable sessions.
          if (busy || error || !page || !['typo', 'subsequence'].includes(page.fuzzy) ||
              page.hasExactMatches !== false || !page.items.length || page.warnings?.length) return null;
          return h('p', {className: 'dss-fuzzy-notice', role: 'status'}, t('fuzzyOnly'));
        }
        function WorkspaceLabel({hit}) {
          const name = hit.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : hit.workspaceTitle || hit.workspacePath || hit.workspaceId || t('ungroupedWorkspace');
          return h('span', {className: 'dss-badge dss-workspace-badge', title: `${t('workspace')}: ${hit.workspacePath || name}`}, h(Glyph, {kind: 'folder', size: 11}), name);
        }
        function Badges({hit}) {
          return h(React.Fragment, null,
            hit.subagent && h('span', {className: 'dss-badge'}, h(BranchIcon), t('subagent')),
            hit.archived && h('span', {className: 'dss-badge'}, t('archived')));
        }
        function EmptyState({empty = false, pending = false}) {
          return h('div', {className: 'dss-message'}, h(Icon, {size: 25}),
            h('h3', null, t(pending ? 'pendingTitle' : empty ? 'emptyTitle' : 'readyTitle')),
            h('p', null, t(pending ? 'pending' : empty ? 'empty' : 'start')));
        }
        function ResultCard({hit, request, within, grouped = false, showWorkspace = false, fallbackTitle}) {
          return h('article', {className: 'dss-hit'},
            !grouped && h('div', {className: 'dss-hit-heading'}, h('h2', null, hit.title || fallbackTitle || t('untitled')),
              showWorkspace && h(WorkspaceLabel, {hit}), h(Badges, {hit})),
            h('div', {className: 'dss-meta dss-muted'}, h('span', {className: 'dss-event-type'}, hit.type), h('span', null, `${t('event')} #${hit.seq}`),
              hit.time !== undefined && h('time', {dateTime: new Date(hit.time).toISOString()}, new Date(hit.time).toLocaleString()),
              !grouped && h('span', {className: 'dss-id', title: hit.sessionId}, shortId(hit.sessionId))),
            h('pre', {className: 'dss-snippet'}, h(Highlight, {text: hit.snippet, ranges: hit.ranges})),
            h('div', {className: 'dss-actions'},
              h('button', {type: 'button', disabled: hit.archived, title: hit.archived ? t('archivedHint') : t('open'), onClick: () => openHighlightedConversation(hit, request)}, t('open'), h(Glyph, {kind: 'arrow', size: 13})),
              within && h('button', {type: 'button', className: 'dss-primary', onClick: () => within(hit.sessionId)}, t('within'))));
        }
        function SessionGroup({group, request, enabled, revision, within, delay}) {
          const [expanded, setExpanded] = React.useState(false);
          const bodyId = React.useId();
          // Narrow with the same plural scope contract, preserving frozen time bounds.
          const result = usePaged({...request, action: 'search', sessionIds: [group.sessionId]}, enabled && expanded, revision, delay);
          const changed = result.page && result.page.total !== group.count;
          return h('section', {className: 'dss-group'},
            h('h2', null, h('button', {type: 'button', className: 'dss-group-toggle', 'aria-expanded': expanded, 'aria-controls': bodyId, onClick: () => setExpanded(v => !v)},
              h('svg', {className: 'dss-chevron', width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true}, h('path', {d: 'm6 3 5 5-5 5'})),
              h('span', {className: 'dss-group-title'}, group.title || t('untitled')),
              h('span', {className: 'dss-group-count'}, `${group.count} · ${t('matches')}`))),
            h('div', {className: 'dss-group-meta dss-muted'}, request.workspaceIds.length !== 1 && h(WorkspaceLabel, {hit: group}), h(Badges, {hit: group}),
              h('span', {className: 'dss-id', title: group.sessionId}, shortId(group.sessionId)),
              group.time !== undefined && h('time', {dateTime: new Date(group.time).toISOString()}, new Date(group.time).toLocaleString())),
            h('div', {id: bodyId, hidden: !expanded, className: 'dss-group-body', 'aria-busy': result.busy},
              result.error && h('div', {className: 'dss-error', role: 'alert'}, result.error, ' ', h('button', {type: 'button', onClick: result.refresh}, t('retry'))),
              changed && h('div', {className: 'dss-error', role: 'status'}, t('groupChanged')),
              result.page?.warnings?.length > 0 && h('p', {className: 'dss-error', role: 'status'}, t('partial')),
              result.busy && !result.page && h('p', {className: 'dss-message', role: 'status'}, t('loading')),
              result.page?.items.map(hit => h(ResultCard, {key: `${hit.sessionId}:${hit.seq}`, hit, request, within, grouped: true})),
              result.page && h('p', {className: 'dss-muted dss-group-progress'}, `${t('loadedMatches')}: ${result.page.items.length} / ${result.page.total}`),
              result.page?.nextCursor && h('button', {type: 'button', className: 'dss-more', disabled: result.busy, onClick: result.more}, result.busy ? t('loading') : t('more'))));
        }
        function SessionGroups({request, enabled, revision, within, delay}) {
          const result = usePaged({...request, action: 'groups'}, enabled && Boolean(request.query.trim()), revision, delay);
          const key = JSON.stringify([request, revision]);
          return h('div', {hidden: !enabled},
            h('div', {className: 'dss-note dss-muted'}, h('span', {title: t('treeHint')}, t('bySession')),
              result.page && h('span', {className: 'dss-result-count'}, `${result.page.items.length} / ${result.page.total} ${t('sessions')} · ${result.page.totalMatches} ${t('matches')}`)),
            result.error && h('div', {className: 'dss-error', role: 'alert'}, result.error, ' ', h('button', {type: 'button', onClick: result.refresh}, t('retry'))),
            result.page?.warnings?.length > 0 && h('p', {className: 'dss-error', role: 'status'}, `${t('partial')} (${result.page.warnings.length})`),
            h('div', {'aria-live': 'polite', 'aria-busy': result.busy},
              !request.query.trim() ? h(EmptyState) : result.busy && !result.page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : result.page?.items.length === 0 ? h(EmptyState, {empty: true}) : null,
              h(FuzzyNotice, result),
              result.page?.items.map(group => h(SessionGroup, {key: `${key}:${group.sessionId}`, group, request, enabled, revision, within, delay})),
              result.page?.nextCursor && h('button', {type: 'button', className: 'dss-more', disabled: result.busy, onClick: result.more}, result.busy ? t('loading') : t('moreSessions'))));
        }
        function SearchPage() {
          React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
          const [query, setQuery] = React.useState(stored.query);
          const [sessionIds, setSessionIds] = React.useState(stored.sessionIds);
          const [workspaceIds, setWorkspaceIds] = React.useState(stored.workspaceIds);
          const [workspaces, setWorkspaces] = React.useState([]);
          const [includeSubagents, setIncludeSubagents] = React.useState(stored.includeSubagents);
          const [includeArchived, setIncludeArchived] = React.useState(stored.includeArchived);
          const [finalOnly, setFinalOnly] = React.useState(stored.finalOnly);
          const [order, setOrder] = React.useState(stored.order);
          const [matchCase, setMatchCase] = React.useState(stored.matchCase);
          const [wholeWord, setWholeWord] = React.useState(stored.wholeWord);
          const [useRegex, setUseRegex] = React.useState(stored.useRegex);
          const [fuzzy, setFuzzy] = React.useState(stored.fuzzy);
          const [view, setView] = React.useState(stored.view);
          const tree = sessionIds.length !== 1 && view === 'session';
          const content = finalOnly ? 'final' : 'all';
          const [timePreset, setTimePreset] = React.useState(stored.timePreset);
          const [startDate, setStartDate] = React.useState(stored.startDate);
          const [endDate, setEndDate] = React.useState(stored.endDate);
          const [settings, setSettings] = React.useState({mode: null, error: '', revision: 0});
          const [settingsRetry, setSettingsRetry] = React.useState(0);
          const [submitted, setSubmitted] = React.useState(null);
          const markRoot = useHighlightContrast();
          const [catalog, setCatalog] = React.useState([]);
          const [catalogState, setCatalogState] = React.useState('loading');
          const [loadedCatalogScope, setLoadedCatalogScope] = React.useState(null);
          const [catalogError, setCatalogError] = React.useState('');
          const [selectionError, setSelectionError] = React.useState('');
          const [catalogVersion, setCatalogVersion] = React.useState(0);
          const [version, setVersion] = React.useState(0);
          // Refreshing choices alone must not disable/restart a submitted search.
          // A genuinely different scope still waits for catalog reconciliation.
          const catalogScopeKey = JSON.stringify([workspaceIds, includeSubagents, includeArchived]);
          const catalogReady = loadedCatalogScope === catalogScopeKey;
          const draft = {query, workspaceIds, sessionIds, includeSubagents, includeArchived, content, order, matchCase, wholeWord, useRegex, fuzzy, timePreset, startDate, endDate};
          const draftKey = JSON.stringify(draft);
          // Clock reads occur only when the draft changes or an explicit search is
          // submitted. Pagination and presentation-only renders reuse this value.
          const resolved = React.useMemo(() => timeBounds(timePreset, startDate, endDate, Date.now()), [draftKey, version, settings.revision]);
          const makeRequest = bounds => ({query, workspaceIds: [...workspaceIds], sessionIds: [...sessionIds], includeSubagents, includeArchived, content, order, matchCase, wholeWord, useRegex, fuzzy, ...bounds});
          const liveRequest = React.useMemo(() => makeRequest(resolved || {}), [draftKey, resolved]);
          // Once a draft is edited, returning to old text must not silently run
          // that old submission again; only Enter/Search re-arms submit mode.
          React.useEffect(() => {setSubmitted(old => old?.draftKey === draftKey ? old : null);}, [draftKey]);
          const currentSubmission = submitted?.draftKey === draftKey && submitted?.settingsRevision === settings.revision;
          const request = currentSubmission ? submitted.request : liveRequest;
          const pendingChanges = settings.mode === 'submit' && Boolean(query.trim()) && !currentSubmission;
          const enabled = Boolean(settings.mode && !settings.error && resolved && query.trim() && catalogReady && !selectionError && (settings.mode === 'live' || currentSubmission));
          const revision = `${settings.revision}:${version}`;
          const delay = settings.mode === 'live' ? 300 : 0;
          const timeline = usePaged(request, enabled && !tree, revision, delay);
          const {page, error, busy, more} = timeline;
          const input = React.useRef(null);
          const setText = value => {stored.query = value; setQuery(value); if (!value.trim()) {setSubmitted(null); setSelectionError(''); setVersion(v => v + 1);}};
          const setTarget = values => {
            // Validate the raw selection; never silently truncate Select all.
            if (values.length > 1000) {setSelectionError('sessionLimit'); return;}
            setSelectionError(''); stored.sessionIds = values; setSessionIds(values);
          };
          const submit = () => {
            if (!settings.mode || settings.error || selectionError || !catalogReady || !query.trim()) return;
            const bounds = timeBounds(timePreset, startDate, endDate, Date.now());
            if (!bounds) return;
            setSubmitted({draftKey, settingsRevision: settings.revision, request: makeRequest(bounds)});
            setVersion(v => v + 1);
          };
          React.useEffect(() => {
            let controller;
            let active = true;
            const adopt = mode => {
              if (!active) return;
              // An unchanged focus revalidation must preserve the submitted
              // snapshot, relative-time bounds and pagination cache.
              setSettings(old => old.mode === mode && !old.error ? old : {mode, error: '', revision: old.mode === mode ? old.revision : old.revision + 1});
            };
            const revalidate = () => {
              controller?.abort(); controller = new AbortController();
              const owner = controller, epoch = settingsEpoch;
              settingsApi('GET', undefined, owner.signal).then(value => {
                if (active && !owner.signal.aborted && settingsEpoch === epoch) adopt(value.searchMode);
              }).catch(err => {
                if (active && !owner.signal.aborted && settingsEpoch === epoch) setSettings(old => ({...old, error: err.message}));
              });
            };
            const localChange = mode => {
              controller?.abort();
              setSubmitted(null);
              setSettings(old => ({mode, error: '', revision: old.revision + 1}));
            };
            settingListeners.add(localChange);
            window.addEventListener('focus', revalidate);
            revalidate();
            return () => {active = false; controller?.abort(); settingListeners.delete(localChange); window.removeEventListener('focus', revalidate);};
          }, [settingsRetry]);
          const setFuzzyMode = value => {
            stored.fuzzy = value; setFuzzy(value);
            if (value !== 'off') {stored.useRegex = false; setUseRegex(false);}
          };
          const setRegexMode = enabled => {
            stored.useRegex = enabled; setUseRegex(enabled);
            if (enabled) {stored.fuzzy = 'off'; setFuzzy('off');}
          };
          const setWorkspace = values => {
            if (values.length > 200) {setSelectionError('workspaceLimit'); return;}
            if (JSON.stringify(values) === JSON.stringify(workspaceIds)) {setSelectionError(''); return;}
            stored.workspaceIds = values; setWorkspaceIds(values);
            setTarget([]); setCatalog([]); setCatalogState('loading');
          };
          const setSubagents = enabled => {
            stored.includeSubagents = enabled; setIncludeSubagents(enabled);
            // Turning the scope off must not leave a hidden subagent selected.
            if (!enabled) setTarget(sessionIds.filter(id => catalog.some(item => item.sessionId === id && !item.subagent)));
          };
          const setArchives = enabled => {
            stored.includeArchived = enabled; setIncludeArchived(enabled);
            if (!enabled) setTarget(sessionIds.filter(id => !catalog.find(item => item.sessionId === id)?.archived));
          };
          React.useEffect(() => {
            const refocus = () => {input.current?.focus(); input.current?.select();};
            focusListeners.add(refocus); refocus();
            return () => focusListeners.delete(refocus);
          }, []);
          React.useEffect(() => {
            let active = true;
            const controller = new AbortController();
            setCatalogState('loading'); setCatalogError('');
            const load = async () => {
              let value;
              try {value = await api({action: 'sessions', workspaceIds, includeSubagents, includeArchived}, controller.signal);}
              catch (err) {
                if (controller.signal.aborted || !workspaceIds.length) throw err;
                // A deleted workspace makes the scoped catalog invalid. Read
                // the full catalog only to recover its current selection IDs.
                value = await api({action: 'sessions', workspaceIds: [], includeSubagents, includeArchived}, controller.signal);
                if (workspaceIds.every(id => value.workspaces.some(item => item.workspaceId === id))) throw err;
              }
              if (!active || controller.signal.aborted) return;
              setWorkspaces(value.workspaces || []);
              const knownWorkspaces = new Set(value.workspaces.map(item => item.workspaceId));
              const remainingWorkspaces = workspaceIds.filter(id => knownWorkspaces.has(id));
              if (remainingWorkspaces.length !== workspaceIds.length) {
                stored.workspaceIds = remainingWorkspaces; setWorkspaceIds(remainingWorkspaces);
                setTarget([]); setCatalog([]);
                return; // Re-fetch using the reconciled plural workspace scope.
              }
              const knownSessions = new Set(value.items.map(item => item.sessionId));
              const remainingSessions = stored.sessionIds.filter(id => knownSessions.has(id));
              if (remainingSessions.length !== stored.sessionIds.length) setTarget(remainingSessions);
              setCatalog(value.items); setCatalogState('ready'); setLoadedCatalogScope(catalogScopeKey);
            };
            load().catch(err => {if (active && !controller.signal.aborted) {setCatalogError(err.message); setCatalogState('error');}});
            return () => {active = false; controller.abort();};
          }, [catalogVersion, JSON.stringify(workspaceIds), includeSubagents, includeArchived]);
          const within = sessionId => {
            if (!enabled) return;
            const bounds = timeBounds(timePreset, startDate, endDate, Date.now());
            if (!bounds) return;
            setTarget([sessionId]);
            const nextDraft = {...draft, sessionIds: [sessionId]};
            setSubmitted({draftKey: JSON.stringify(nextDraft), settingsRevision: settings.revision, request: {...makeRequest(bounds), sessionIds: [sessionId]}});
            setVersion(v => v + 1);
          };
          const selected = sessionIds.length === 1 ? catalog.find(item => item.sessionId === sessionIds[0]) : null;
          const workspaceName = item => item.ungrouped || item.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : item.title || item.path || item.workspaceId;
          const visible = catalog.filter(item => (!workspaceIds.length || workspaceIds.includes(item.workspaceId)) && (includeSubagents || !item.subagent) && (includeArchived || !item.archived));
          const options = visible.map(item => ({id: item.sessionId, title: `${item.sessionId}${item.workspacePath ? ` · ${item.workspacePath}` : ''}`, label: `${item.title || t('untitled')}${item.subagent ? ` · ${t('subagent')}` : ''}${item.archived ? ` · ${t('archived')}` : ''}${workspaceIds.length !== 1 ? ` · ${item.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : item.workspaceTitle || item.workspacePath || ''}` : ''} · ${shortId(item.sessionId)}`}));
          return h('section', {ref: markRoot, className: 'dss-page', 'aria-label': t('title'), onKeyDown: e => {
            if (e.key === 'Escape' && e.target.tagName !== 'SELECT') {e.preventDefault(); ctx.layout.selectPanel(null);}
          }}, h('style', null, css),
            h('header', {className: 'dss-head'},
              h('div', {className: 'dss-brand'}, h('span', {className: 'dss-emblem'}, h(Icon, {size: 22})),
                h('div', null, h('h1', null, t('title')), h('p', {className: 'dss-muted'}, t('intro')))),
              h('nav', {className: 'dss-head-actions', 'aria-label': t('navigation')}, h('kbd', {className: 'dss-shortcut'}, t('shortcut')),
                h('button', {className: 'dss-icon-button', type: 'button', title: t('close'), 'aria-label': t('close'), onClick: () => ctx.layout.selectPanel(null)}, h(Glyph, {kind: 'back', size: 19})))),
            h('div', {className: 'dss-body'}, h('div', {className: 'dss-inner'},
              h('section', {className: 'dss-controls', 'aria-label': t('filters')},
                h('form', {className: 'dss-form', onSubmit: e => {e.preventDefault(); if (!e.nativeEvent?.isComposing) submit();}}, 
                  h('div', {className: 'dss-searchbox'}, h(Icon, {size: 18}),
                    h('input', {ref: input, className: 'dss-query', type: 'search', value: query, maxLength: 1024, placeholder: t('placeholder'), 'aria-label': t('placeholder'), onKeyDown: e => {if (e.key === 'Enter' && (e.nativeEvent.isComposing || e.nativeEvent.keyCode === 229)) e.preventDefault();}, onChange: e => setText(e.target.value)}),
                    query && h('button', {className: 'dss-icon-button dss-clear', type: 'button', title: t('clear'), 'aria-label': t('clear'), onClick: () => {setText(''); input.current?.focus();}}, '×'),
                    h('div', {className: 'dss-modes', role: 'group', 'aria-label': t('searchModes')},
                      ...[
                        ['matchCase', 'Aa', matchCase, setMatchCase],
                        ['wholeWord', 'ab', wholeWord, setWholeWord],
                        ['useRegex', '.*', useRegex, setRegexMode]
                      ].map(([name, label, enabled, setEnabled]) => h('button', {key: name, type: 'button', className: `dss-mode${name === 'wholeWord' ? ' dss-mode-word' : ''}`, title: t(name), 'aria-label': t(name), 'aria-pressed': enabled, onClick: () => {stored[name] = !enabled; setEnabled(!enabled);}}, label)))),
                  h('button', {className: 'dss-primary dss-submit', disabled: !query.trim() || !settings.mode || Boolean(settings.error) || !resolved || Boolean(selectionError) || !catalogReady, type: 'submit'}, t('search'), h(Glyph, {kind: 'arrow'}))),
                h('div', {className: 'dss-filter-grid'},
                  h('div', {className: 'dss-field'}, h('span', {className: 'dss-field-label'}, t('workspace')),
                    h(MultiPicker, {label: t('workspace'), allLabel: t('allWorkspaces'), values: workspaceIds, hint: t('workspaceHint'), options: workspaces.map(item => ({id: item.workspaceId, label: workspaceName(item), title: item.path})), onChange: setWorkspace})),
                  h('div', {className: 'dss-field dss-session-field'}, h('span', {className: 'dss-field-label'}, t('session')),
                    h(MultiPicker, {label: t('session'), allLabel: t('all'), values: sessionIds, hint: t('pickerHint'), options, onChange: setTarget, disabled: !catalogReady}))),
                h('div', {className: 'dss-filter-grid dss-time-grid'},
                  h('div', {className: 'dss-field'}, h('label', {htmlFor: 'dss-time'}, t('timeRange')),
                    h('select', {id: 'dss-time', value: timePreset, 'aria-describedby': 'dss-time-hint', onChange: e => {stored.timePreset = e.target.value; setTimePreset(e.target.value);}},
                      ...[['all', 'allTime'], ['today', 'today'], ['24h', 'last24h'], ['7d', 'last7d'], ['month', 'thisMonth'], ['custom', 'custom']].map(([value, label]) => h('option', {key: value, value}, t(label))))),
                  timePreset === 'custom' && h('div', {className: 'dss-field'}, h('label', {htmlFor: 'dss-start-date'}, t('startDate')),
                    h('input', {id: 'dss-start-date', type: 'date', value: startDate, 'aria-invalid': !resolved, onChange: e => {stored.startDate = e.target.value; setStartDate(e.target.value);}})),
                  timePreset === 'custom' && h('div', {className: 'dss-field'}, h('label', {htmlFor: 'dss-end-date'}, t('endDate')),
                    h('input', {id: 'dss-end-date', type: 'date', value: endDate, 'aria-invalid': !resolved, onChange: e => {stored.endDate = e.target.value; setEndDate(e.target.value);}}))),
                h('p', {className: 'dss-muted', id: 'dss-time-hint'}, t('timeHint')),
                !resolved && h('p', {className: 'dss-error', role: 'alert'}, t('timeError')),
                !settings.mode && !settings.error && h('p', {className: 'dss-muted', role: 'status'}, t('settingsLoading')),
                settings.error && h('div', {className: 'dss-error', role: 'alert'}, t('settingsError'), ' ', settings.error, ' ', h('button', {type: 'button', onClick: () => setSettingsRetry(v => v + 1)}, t('retry'))),
                pendingChanges && h('p', {className: 'dss-pending', role: 'status'}, t('pendingChanges')),
                 selectionError && h('p', {className: 'dss-error', role: 'alert'}, t(selectionError)),
                h('div', {className: 'dss-match-row'}, h('label', {htmlFor: 'dss-fuzzy'}, t('fuzzy')),
                  h('select', {id: 'dss-fuzzy', value: fuzzy, 'aria-describedby': 'dss-fuzzy-hint', onChange: e => setFuzzyMode(e.target.value)},
                    ...[['off', 'fuzzyOff'], ['typo', 'fuzzyTypo'], ['subsequence', 'fuzzySubsequence']].map(([value, label]) => h('option', {key: value, value}, t(label)))),
                  fuzzy !== 'off' && h('span', {className: 'dss-muted'}, t(fuzzy === 'typo' ? 'typoExample' : 'subsequenceExample'))),
                h('div', {className: 'dss-options'},
                  h('label', {className: 'dss-check', title: t('finalHint')}, h('input', {type: 'checkbox', checked: finalOnly, onChange: e => {stored.finalOnly = e.target.checked; setFinalOnly(e.target.checked);}}), t('finalOnly')),
                  h('label', {className: 'dss-check'}, h('input', {type: 'checkbox', checked: includeSubagents, onChange: e => setSubagents(e.target.checked)}), t('includeSubagents')),
                  h('label', {className: 'dss-check'}, h('input', {type: 'checkbox', checked: includeArchived, onChange: e => setArchives(e.target.checked)}), t('includeArchived')),
                  h('button', {className: 'dss-refresh', type: 'button', onClick: () => setCatalogVersion(v => v + 1)}, h(Glyph, {kind: 'refresh'}), t('refresh'))),
                h('details', {className: 'dss-tips'}, h('summary', null, t('tips')),
                  h('div', {className: 'dss-tip-body'},
                    h('p', {id: 'dss-fuzzy-hint'}, h('strong', null, `${t('fuzzy')}. `), t(fuzzy === 'typo' ? 'fuzzyTypoHint' : fuzzy === 'subsequence' ? 'fuzzySubsequenceHint' : 'fuzzyOffHint')),
                    h('p', null, t('workspaceHint')), h('p', null, t('pickerHint')), h('p', null, t('finalHint')), h('p', null, t('matching')))),
                useRegex && h('p', {className: 'dss-muted'}, t('regexHint')),
                catalogState === 'loading' && h('p', {className: 'dss-muted', role: 'status'}, t('loadingSessions')),
                catalogState === 'error' && h('div', {className: 'dss-error', role: 'alert'}, t('catalogError'), ' ', catalogError, ' ', h('button', {type: 'button', onClick: () => setCatalogVersion(v => v + 1)}, t('retry')))),
              h('hr', {className: 'dss-divider'}),
              h('div', {className: 'dss-results-toolbar'}, h('h2', {className: 'dss-results-title'}, t('results')),
                h('div', {className: 'dss-display-options'},
                  sessionIds.length !== 1 && h('div', {className: 'dss-views', role: 'group', 'aria-label': t('view')},
                    ...[['timeline', 'timeline'], ['session', 'bySession']].map(([value, label]) => h('button', {key: value, type: 'button', className: 'dss-view', 'aria-pressed': view === value, onClick: () => {stored.view = value; setView(value);}}, h(Glyph, {kind: value === 'timeline' ? 'timeline' : 'folder', size: 13}), t(label)))),
                  h('div', {className: 'dss-views dss-sort', role: 'group', 'aria-label': t('sort')},
                    ...['newest', 'oldest'].map(value => h('button', {key: value, type: 'button', className: 'dss-view', 'aria-pressed': order === value, onClick: () => {stored.order = value; setOrder(value);}}, t(value)))))),
              tree && !enabled && !query.trim() && h(EmptyState),
               h(SessionGroups, {request, enabled: enabled && tree, revision, within, delay}),
               h('div', {hidden: tree},
               h('div', {className: 'dss-note dss-muted'}, h('span', {title: sessionIds.length === 1 ? t('events') : t('grouped')}, selected?.title || (sessionIds.length === 1 ? t('unavailable') : t('resultsHint'))), page && h('span', {className: 'dss-result-count'}, `${page.items.length}${Number.isInteger(page.total) ? ` / ${page.total}` : page.nextCursor ? '+' : ''} · ${t('results')}`)),
              error && h('div', {className: 'dss-error', role: 'alert'}, h('p', null, error), h('button', {type: 'button', onClick: () => setVersion(v => v + 1)}, t('retry'))),
              page?.warnings?.length > 0 && h('div', {className: 'dss-error', role: 'status'}, `${t('partial')} (${page.warnings.length})`),
              h('div', {'aria-live': 'polite', 'aria-busy': busy},
                busy && !page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : !query.trim() ? h(EmptyState) : page?.items.length === 0 ? h(EmptyState, {empty: true, pending: Boolean(page.nextCursor)}) : null,
                h(FuzzyNotice, {page, busy, error}),
                page?.items.map(hit => h(ResultCard, {key: `${hit.sessionId}:${hit.seq}`, hit, request, fallbackTitle: selected?.title, showWorkspace: workspaceIds.length !== 1, within: sessionIds.length !== 1 ? within : undefined})),
                page?.nextCursor && h('button', {className: 'dss-more', type: 'button', disabled: busy, onClick: more}, busy ? t('loading') : t('more'))))
            )));
        }
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({name: 'sidebar.panellist', id: PANEL, order: -10, label: () => t('title')}, Icon));
        ctx.slots.inject('main', () => ctx.slots.register({name: 'main', key: PANEL}, SearchPage));
        // Add an isolated occurrence of the shared Conversation factory. Never
        // redeclare or replace the shipped main/conversation slot ownership.
        ctx.slots.inject('main', function* () {
          yield ctx.slots.register({name: 'main', key: HIGHLIGHT_PANEL,
            children: {'session-search.highlight.body': {kind: 'single', scope: 'session'}}}, HighlightedConversation);
          yield ctx.slots.register({name: 'session-search.highlight.body'}, HighlightedConversationBody);
        });
        ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({name: 'plugins.bundle.config', key: 'dsh-session-search', locale: NS}, SettingsForm));
      }
    };
  }
});
