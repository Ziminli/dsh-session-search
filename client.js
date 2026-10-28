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
    .dss-snippet{white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:13px;line-height:1.85;margin:0 0 14px;padding:12px 14px;background:var(--dsw-alias-bg-base);border-radius:8px;max-height:260px;overflow:auto}.dss-snippet mark{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);font-weight:650;border-radius:3px;text-decoration:underline;text-decoration-color:var(--dsw-alias-brand-primary);text-underline-offset:3px}.dss-actions{display:flex;gap:12px;flex-wrap:wrap}.dss-page .dss-actions button{padding:3px 0;font-size:12px;border-color:transparent;background:transparent;color:var(--dsw-alias-label-secondary)}.dss-page .dss-actions .dss-primary{color:var(--dsw-alias-brand-primary);font-weight:500}.dss-page .dss-actions button:hover{color:var(--dsw-alias-brand-primary);text-decoration:underline}.dss-page .dss-more{display:flex;margin:22px auto;padding:9px 20px;border-radius:9px}
    .dss-group{border:1px solid var(--dsw-alias-border-l1);border-radius:13px;margin:0 0 12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}.dss-group h2{font-size:14px;margin:0}.dss-page .dss-group-toggle{display:flex;align-items:center;text-align:left;gap:11px;width:100%;border:0;border-radius:0;padding:17px 20px 10px;background:transparent}.dss-group-title{flex:1;min-width:0;overflow-wrap:anywhere;font-weight:600}.dss-chevron{flex-shrink:0;color:var(--dsw-alias-label-secondary);transition:transform .15s}.dss-group-toggle[aria-expanded="true"] .dss-chevron{transform:rotate(90deg)}.dss-group-count{font-size:11px;font-weight:500;color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);border-radius:6px;padding:3px 8px;text-align:right}.dss-group-meta{padding:0 20px 15px 45px;display:flex;gap:8px;flex-wrap:wrap;font-size:11px}.dss-group-body{margin:0 18px 18px 26px;padding-left:14px;border-left:2px solid var(--dsw-alias-border-l2)}.dss-group-body .dss-hit{background:var(--dsw-alias-bg-base);padding:12px 14px}.dss-group-body .dss-snippet{background:var(--dsw-alias-bg-layer-1)}.dss-group-body .dss-meta{margin-top:0}.dss-group-body .dss-message{padding:18px}.dss-group-progress{padding:8px 0;font-size:11px}.dss-group .dss-more{margin:12px auto}.dss-zero{display:inline-block;width:2px;min-height:1em;vertical-align:text-bottom;background:var(--dsw-alias-brand-primary)}
    @container(max-width:720px){.dss-head{padding:18px 20px}.dss-body{padding:20px}.dss-controls{padding:16px}.dss-filter-grid{grid-template-columns:1fr 1fr}.dss-session-field{grid-column:1 / -1}.dss-field:first-child{grid-column:1 / -1}.dss-shortcut{display:none}.dss-page .dss-refresh{margin-left:0}}
    @container(max-width:480px){.dss-head{padding:16px}.dss-head .dss-muted{font-size:11px}.dss-emblem{width:34px;height:34px;border-radius:10px}.dss-brand{gap:10px}.dss-page h1{font-size:18px}.dss-body{padding:16px 12px 28px}.dss-form{flex-wrap:wrap;gap:8px}.dss-searchbox{flex-basis:100%}.dss-page .dss-submit{width:100%;padding:8px}.dss-session-controls{grid-template-columns:1fr}.dss-options{align-items:flex-start;gap:12px;flex-direction:column}.dss-hit{padding:14px}.dss-meta .dss-id{margin-left:0}.dss-results-toolbar{align-items:flex-start}.dss-group-toggle .dss-group-count{max-width:105px}.dss-group-body{margin-left:12px;padding-left:10px}.dss-group-meta{padding-left:20px}}
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
    return {
      inject: ['slots', 'layout', 'locale', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'en', en));
        ctx.effect(() => ctx.locale.register(NS, 'zh', zh));
        const t = ctx.locale.bind(NS);
        const stored = {query: '', scope: '', workspaceId: '', includeSubagents: false, includeArchived: false, finalOnly: true, order: 'newest', matchCase: false, wholeWord: false, useRegex: false, fuzzy: 'off', view: 'timeline'};
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
          for (const [key, value] of Object.entries(input)) if (value !== undefined && value !== '') params.set(key, value);
          // Relative to the mounted application URL; signed same-origin cookie only.
          const response = await fetch(new URL(`api/local-session-search?${params}`, document.baseURI), {credentials: 'same-origin', cache: 'no-store', signal});
          const value = await response.json();
          if (!response.ok) throw new Error(value.error || `HTTP ${response.status}`);
          return value;
        }
        // Keep pages mounted across view switches; a switch is presentation only.
        // Request keys isolate query/filter changes, and abort/generation guards
        // prevent late replies or pagination from overwriting a newer search.
        function usePaged(request, enabled, revision) {
          const key = JSON.stringify([request, revision]);
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
                api(requestRef.current, controller.signal).then(page => {
                  if (controller.signal.aborted) return;
                  cache.current = {key, page}; setState({key, page, busy: false, error: ''});
                }).catch(err => {
                  if (!controller.signal.aborted) setState({key, page: null, busy: false, error: err.message});
                });
              }, 300);
              return () => {clearTimeout(timer); controller.abort(); moreControl.current?.abort();};
            }
            return () => {controller.abort(); moreControl.current?.abort();};
          }, [key, enabled, retry]);
          const value = state.key === key ? state : {page: null, busy: enabled, error: ''};
          async function more() {
            if (!enabled || value.busy || !value.page?.nextCursor) return;
            const controller = new AbortController(); moreControl.current = controller;
            const owner = current.current;
            setState(old => ({...old, busy: true, error: ''}));
            try {
              const next = await api({...request, cursor: value.page.nextCursor}, controller.signal);
              if (controller.signal.aborted || owner !== current.current) return;
              const identity = item => `${item.sessionId}:${item.seq ?? 'group'}`;
              const seen = new Set(value.page.items.map(identity));
              const page = {...next, items: [...value.page.items, ...next.items.filter(item => !seen.has(identity(item)))]};
              cache.current = {key, page}; setState({key, page, busy: false, error: ''});
            } catch (err) {
              if (!controller.signal.aborted && owner === current.current) setState(old => ({...old, busy: false, error: `${err.message} — ${t('stale')}`}));
            }
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
        function ResultCard({hit, within, grouped = false, showWorkspace = false, fallbackTitle}) {
          return h('article', {className: 'dss-hit'},
            !grouped && h('div', {className: 'dss-hit-heading'}, h('h2', null, hit.title || fallbackTitle || t('untitled')),
              showWorkspace && h(WorkspaceLabel, {hit}), h(Badges, {hit})),
            h('div', {className: 'dss-meta dss-muted'}, h('span', {className: 'dss-event-type'}, hit.type), h('span', null, `${t('event')} #${hit.seq}`),
              hit.time !== undefined && h('time', {dateTime: new Date(hit.time).toISOString()}, new Date(hit.time).toLocaleString()),
              !grouped && h('span', {className: 'dss-id', title: hit.sessionId}, shortId(hit.sessionId))),
            h('pre', {className: 'dss-snippet'}, h(Highlight, {text: hit.snippet, ranges: hit.ranges})),
            h('div', {className: 'dss-actions'},
              h('button', {type: 'button', disabled: hit.archived, title: hit.archived ? t('archivedHint') : t('open'), onClick: () => ctx.uiWorkspace.openSession(hit.sessionId)}, t('open'), h(Glyph, {kind: 'arrow', size: 13})),
              within && h('button', {type: 'button', className: 'dss-primary', onClick: () => within(hit.sessionId)}, t('within'))));
        }
        function SessionGroup({group, request, enabled, revision, within}) {
          const [expanded, setExpanded] = React.useState(false);
          const bodyId = React.useId();
          const result = usePaged({...request, action: 'search', sessionId: group.sessionId}, enabled && expanded, revision);
          const changed = result.page && result.page.total !== group.count;
          return h('section', {className: 'dss-group'},
            h('h2', null, h('button', {type: 'button', className: 'dss-group-toggle', 'aria-expanded': expanded, 'aria-controls': bodyId, onClick: () => setExpanded(v => !v)},
              h('svg', {className: 'dss-chevron', width: 14, height: 14, viewBox: '0 0 16 16', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true}, h('path', {d: 'm6 3 5 5-5 5'})),
              h('span', {className: 'dss-group-title'}, group.title || t('untitled')),
              h('span', {className: 'dss-group-count'}, `${group.count} · ${t('matches')}`))),
            h('div', {className: 'dss-group-meta dss-muted'}, !request.workspaceId && h(WorkspaceLabel, {hit: group}), h(Badges, {hit: group}),
              h('span', {className: 'dss-id', title: group.sessionId}, shortId(group.sessionId)),
              group.time !== undefined && h('time', {dateTime: new Date(group.time).toISOString()}, new Date(group.time).toLocaleString())),
            h('div', {id: bodyId, hidden: !expanded, className: 'dss-group-body', 'aria-busy': result.busy},
              result.error && h('div', {className: 'dss-error', role: 'alert'}, result.error, ' ', h('button', {type: 'button', onClick: result.refresh}, t('retry'))),
              changed && h('div', {className: 'dss-error', role: 'status'}, t('groupChanged')),
              result.page?.warnings?.length > 0 && h('p', {className: 'dss-error', role: 'status'}, t('partial')),
              result.busy && !result.page && h('p', {className: 'dss-message', role: 'status'}, t('loading')),
              result.page?.items.map(hit => h(ResultCard, {key: `${hit.sessionId}:${hit.seq}`, hit, within, grouped: true})),
              result.page && h('p', {className: 'dss-muted dss-group-progress'}, `${t('loadedMatches')}: ${result.page.items.length} / ${result.page.total}`),
              result.page?.nextCursor && h('button', {type: 'button', className: 'dss-more', disabled: result.busy, onClick: result.more}, result.busy ? t('loading') : t('more'))));
        }
        function SessionGroups({request, enabled, revision, within}) {
          const result = usePaged({...request, action: 'groups'}, enabled && Boolean(request.query.trim()), revision);
          const key = JSON.stringify([request, revision]);
          return h('div', {hidden: !enabled},
            h('div', {className: 'dss-note dss-muted'}, h('span', {title: t('treeHint')}, t('bySession')),
              result.page && h('span', {className: 'dss-result-count'}, `${result.page.items.length} / ${result.page.total} ${t('sessions')} · ${result.page.totalMatches} ${t('matches')}`)),
            result.error && h('div', {className: 'dss-error', role: 'alert'}, result.error, ' ', h('button', {type: 'button', onClick: result.refresh}, t('retry'))),
            result.page?.warnings?.length > 0 && h('p', {className: 'dss-error', role: 'status'}, `${t('partial')} (${result.page.warnings.length})`),
            h('div', {'aria-live': 'polite', 'aria-busy': result.busy},
              !request.query.trim() ? h(EmptyState) : result.busy && !result.page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : result.page?.items.length === 0 ? h(EmptyState, {empty: true}) : null,
              h(FuzzyNotice, result),
              result.page?.items.map(group => h(SessionGroup, {key: `${key}:${group.sessionId}`, group, request, enabled, revision, within})),
              result.page?.nextCursor && h('button', {type: 'button', className: 'dss-more', disabled: result.busy, onClick: result.more}, result.busy ? t('loading') : t('moreSessions'))));
        }
        function SearchPage() {
          React.useSyncExternalStore(fn => ctx.locale.subscribe(fn), () => ctx.locale.getSnapshot());
          const [query, setQuery] = React.useState(stored.query);
          const [scope, setScope] = React.useState(stored.scope);
          const [workspaceId, setWorkspaceId] = React.useState(stored.workspaceId);
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
          const tree = !scope && view === 'session';
          const content = finalOnly ? 'final' : 'all';
          const [filter, setFilter] = React.useState('');
          const [catalog, setCatalog] = React.useState([]);
          const [catalogState, setCatalogState] = React.useState('loading');
          const [catalogVersion, setCatalogVersion] = React.useState(0);
          const [version, setVersion] = React.useState(0);
          const request = {query, workspaceId: workspaceId || undefined, includeSubagents, includeArchived, content, order, matchCase, wholeWord, useRegex, fuzzy};
          const timeline = usePaged({...request, sessionId: scope || undefined}, !tree && Boolean(query.trim()), version);
          const {page, error, busy, more} = timeline;
          const input = React.useRef(null);
          const setText = value => {stored.query = value; setQuery(value);};
          const setTarget = value => {stored.scope = value; setScope(value);};
          const setFuzzyMode = value => {
            stored.fuzzy = value; setFuzzy(value);
            if (value !== 'off') {stored.useRegex = false; setUseRegex(false);}
          };
          const setRegexMode = enabled => {
            stored.useRegex = enabled; setUseRegex(enabled);
            if (enabled) {stored.fuzzy = 'off'; setFuzzy('off');}
          };
          const setWorkspace = value => {
            stored.workspaceId = value; setWorkspaceId(value);
            setTarget(''); setFilter(''); setCatalog([]); setCatalogState('loading');
          };
          const setSubagents = enabled => {
            stored.includeSubagents = enabled; setIncludeSubagents(enabled);
            // Turning the scope off must not leave a hidden subagent selected.
            if (!enabled && scope && !catalog.some(item => item.sessionId === scope && !item.subagent)) setTarget('');
          };
          const setArchives = enabled => {
            stored.includeArchived = enabled; setIncludeArchived(enabled);
            if (!enabled && catalog.find(item => item.sessionId === scope)?.archived) setTarget('');
          };
          React.useEffect(() => {
            const refocus = () => {input.current?.focus(); input.current?.select();};
            focusListeners.add(refocus); refocus();
            return () => focusListeners.delete(refocus);
          }, []);
          React.useEffect(() => {
            let active = true;
            const controller = new AbortController();
            setCatalogState('loading');
            api({action: 'sessions', workspaceId: workspaceId || undefined, includeSubagents, includeArchived}, controller.signal).then(value => {
              if (active) {
                setWorkspaces(value.workspaces || []);
                setCatalog(value.items); setCatalogState('ready');
                if (stored.scope && !value.items.some(item => item.sessionId === stored.scope)) {stored.scope = ''; setScope('');}
              }
            }).catch(err => {if (active && err.name !== 'AbortError') setCatalogState('error');});
            return () => {active = false; controller.abort();};
          }, [catalogVersion, workspaceId, includeSubagents, includeArchived]);
          const within = sessionId => {setTarget(sessionId); setFilter('');};
          const selected = catalog.find(item => item.sessionId === scope && (!workspaceId || item.workspaceId === workspaceId));
          const workspaceName = item => item.ungrouped || item.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : item.title || item.path || item.workspaceId;
          const visible = catalog.filter(item => (!workspaceId || item.workspaceId === workspaceId) && (includeSubagents || !item.subagent) && (includeArchived || !item.archived) && (item.sessionId === scope || `${item.title} ${item.sessionId}`.toLowerCase().includes(filter.toLowerCase())));
          const options = visible.map(item => h('option', {key: item.sessionId, value: item.sessionId, title: `${item.sessionId}${item.workspacePath ? ` · ${item.workspacePath}` : ''}`}, `${item.title || t('untitled')}${item.subagent ? ` · ${t('subagent')}` : ''}${item.archived ? ` · ${t('archived')}` : ''}${!workspaceId ? ` · ${item.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : item.workspaceTitle || item.workspacePath || ''}` : ''} · ${shortId(item.sessionId)}`));
          return h('section', {className: 'dss-page', 'aria-label': t('title'), onKeyDown: e => {
            if (e.key === 'Escape' && e.target.tagName !== 'SELECT') {e.preventDefault(); ctx.layout.selectPanel(null);}
          }}, h('style', null, css),
            h('header', {className: 'dss-head'},
              h('div', {className: 'dss-brand'}, h('span', {className: 'dss-emblem'}, h(Icon, {size: 22})),
                h('div', null, h('h1', null, t('title')), h('p', {className: 'dss-muted'}, t('intro')))),
              h('nav', {className: 'dss-head-actions', 'aria-label': t('navigation')}, h('kbd', {className: 'dss-shortcut'}, t('shortcut')),
                h('button', {className: 'dss-icon-button', type: 'button', title: t('close'), 'aria-label': t('close'), onClick: () => ctx.layout.selectPanel(null)}, h(Glyph, {kind: 'back', size: 19})))),
            h('div', {className: 'dss-body'}, h('div', {className: 'dss-inner'},
              h('section', {className: 'dss-controls', 'aria-label': t('filters')},
                h('form', {className: 'dss-form', onSubmit: e => {e.preventDefault(); setVersion(v => v + 1);}},
                  h('div', {className: 'dss-searchbox'}, h(Icon, {size: 18}),
                    h('input', {ref: input, className: 'dss-query', type: 'search', value: query, maxLength: 1024, placeholder: t('placeholder'), 'aria-label': t('placeholder'), onChange: e => setText(e.target.value)}),
                    query && h('button', {className: 'dss-icon-button dss-clear', type: 'button', title: t('clear'), 'aria-label': t('clear'), onClick: () => {setText(''); input.current?.focus();}}, '×'),
                    h('div', {className: 'dss-modes', role: 'group', 'aria-label': t('searchModes')},
                      ...[
                        ['matchCase', 'Aa', matchCase, setMatchCase],
                        ['wholeWord', 'ab', wholeWord, setWholeWord],
                        ['useRegex', '.*', useRegex, setRegexMode]
                      ].map(([name, label, enabled, setEnabled]) => h('button', {key: name, type: 'button', className: `dss-mode${name === 'wholeWord' ? ' dss-mode-word' : ''}`, title: t(name), 'aria-label': t(name), 'aria-pressed': enabled, onClick: () => {stored[name] = !enabled; setEnabled(!enabled);}}, label)))),
                  h('button', {className: 'dss-primary dss-submit', disabled: !query.trim(), type: 'submit'}, t('search'), h(Glyph, {kind: 'arrow'}))),
                h('div', {className: 'dss-filter-grid'},
                  h('div', {className: 'dss-field'}, h('label', {htmlFor: 'dss-workspace'}, t('workspace')),
                    h('select', {id: 'dss-workspace', value: workspaceId, title: t('workspaceHint'), onChange: e => setWorkspace(e.target.value)},
                      h('option', {value: ''}, t('allWorkspaces')),
                      workspaceId && !workspaces.some(item => item.workspaceId === workspaceId) && h('option', {value: workspaceId}, workspaceId),
                      ...workspaces.map(item => h('option', {key: item.workspaceId, value: item.workspaceId, title: item.path || workspaceName(item)}, workspaceName(item))))),
                  h('div', {className: 'dss-field dss-session-field'}, h('label', {htmlFor: 'dss-scope'}, t('session')),
                    h('div', {className: 'dss-session-controls'},
                      h('input', {type: 'search', value: filter, placeholder: t('sessionFilter'), 'aria-label': t('filterNames'), onChange: e => setFilter(e.target.value)}),
                      h('select', {id: 'dss-scope', value: scope, title: t('pickerHint'), disabled: catalogState !== 'ready', onChange: e => setTarget(e.target.value)},
                        h('option', {value: ''}, t('all')), scope && !selected && h('option', {value: scope}, `${t('unavailable')} · ${scope}`), ...options)))),
                h('div', {className: 'dss-match-row'}, h('label', {htmlFor: 'dss-fuzzy'}, t('fuzzy')),
                  h('select', {id: 'dss-fuzzy', value: fuzzy, 'aria-describedby': 'dss-fuzzy-hint', onChange: e => setFuzzyMode(e.target.value)},
                    ...[['off', 'fuzzyOff'], ['typo', 'fuzzyTypo'], ['subsequence', 'fuzzySubsequence']].map(([value, label]) => h('option', {key: value, value}, t(label)))),
                  fuzzy !== 'off' && h('span', {className: 'dss-muted'}, t(fuzzy === 'typo' ? 'typoExample' : 'subsequenceExample'))),
                h('div', {className: 'dss-options'},
                  h('label', {className: 'dss-check', title: t('finalHint')}, h('input', {type: 'checkbox', checked: finalOnly, onChange: e => {stored.finalOnly = e.target.checked; setFinalOnly(e.target.checked);}}), t('finalOnly')),
                  h('label', {className: 'dss-check'}, h('input', {type: 'checkbox', checked: includeSubagents, onChange: e => setSubagents(e.target.checked)}), t('includeSubagents')),
                  h('label', {className: 'dss-check'}, h('input', {type: 'checkbox', checked: includeArchived, onChange: e => setArchives(e.target.checked)}), t('includeArchived')),
                  h('button', {className: 'dss-refresh', type: 'button', onClick: () => {setCatalogVersion(v => v + 1); setVersion(v => v + 1);}}, h(Glyph, {kind: 'refresh'}), t('refresh'))),
                h('details', {className: 'dss-tips'}, h('summary', null, t('tips')),
                  h('div', {className: 'dss-tip-body'},
                    h('p', {id: 'dss-fuzzy-hint'}, h('strong', null, `${t('fuzzy')}. `), t(fuzzy === 'typo' ? 'fuzzyTypoHint' : fuzzy === 'subsequence' ? 'fuzzySubsequenceHint' : 'fuzzyOffHint')),
                    h('p', null, t('workspaceHint')), h('p', null, t('pickerHint')), h('p', null, t('finalHint')), h('p', null, t('matching')))),
                useRegex && h('p', {className: 'dss-muted'}, t('regexHint')),
                catalogState === 'loading' && h('p', {className: 'dss-muted', role: 'status'}, t('loadingSessions')),
                catalogState === 'error' && h('div', {className: 'dss-error', role: 'alert'}, t('catalogError'), ' ', h('button', {type: 'button', onClick: () => setCatalogVersion(v => v + 1)}, t('retry')))),
              h('hr', {className: 'dss-divider'}),
              h('div', {className: 'dss-results-toolbar'}, h('h2', {className: 'dss-results-title'}, t('results')),
                h('div', {className: 'dss-display-options'},
                  !scope && h('div', {className: 'dss-views', role: 'group', 'aria-label': t('view')},
                    ...[['timeline', 'timeline'], ['session', 'bySession']].map(([value, label]) => h('button', {key: value, type: 'button', className: 'dss-view', 'aria-pressed': view === value, onClick: () => {stored.view = value; setView(value);}}, h(Glyph, {kind: value === 'timeline' ? 'timeline' : 'folder', size: 13}), t(label)))),
                  h('div', {className: 'dss-views dss-sort', role: 'group', 'aria-label': t('sort')},
                    ...['newest', 'oldest'].map(value => h('button', {key: value, type: 'button', className: 'dss-view', 'aria-pressed': order === value, onClick: () => {stored.order = value; setOrder(value);}}, t(value)))))),
              h(SessionGroups, {key: scope, request, enabled: tree, revision: version, within}),
               h('div', {hidden: tree},
               h('div', {className: 'dss-note dss-muted'}, h('span', {title: scope ? t('events') : t('grouped')}, selected?.title || (scope ? t('unavailable') : t('resultsHint'))), page && h('span', {className: 'dss-result-count'}, `${page.items.length}${Number.isInteger(page.total) ? ` / ${page.total}` : page.nextCursor ? '+' : ''} · ${t('results')}`)),
              error && h('div', {className: 'dss-error', role: 'alert'}, h('p', null, error), h('button', {type: 'button', onClick: () => setVersion(v => v + 1)}, t('retry'))),
              page?.warnings?.length > 0 && h('div', {className: 'dss-error', role: 'status'}, `${t('partial')} (${page.warnings.length})`),
              h('div', {'aria-live': 'polite', 'aria-busy': busy},
                busy && !page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : !query.trim() ? h(EmptyState) : page?.items.length === 0 ? h(EmptyState, {empty: true, pending: Boolean(page.nextCursor)}) : null,
                h(FuzzyNotice, {page, busy, error}),
                page?.items.map(hit => h(ResultCard, {key: `${hit.sessionId}:${hit.seq}`, hit, fallbackTitle: selected?.title, showWorkspace: !workspaceId, within: !scope ? within : undefined})),
                page?.nextCursor && h('button', {className: 'dss-more', type: 'button', disabled: busy, onClick: more}, busy ? t('loading') : t('more'))))
            )));
        }
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({name: 'sidebar.panellist', id: PANEL, order: -10, label: () => t('title')}, Icon));
        ctx.slots.inject('main', () => ctx.slots.register({name: 'main', key: PANEL}, SearchPage));
      }
    };
  }
});
