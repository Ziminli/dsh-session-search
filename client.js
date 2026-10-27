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
    const css = `
    .dss-page{box-sizing:border-box;display:flex;flex-direction:column;height:100%;min-height:0;width:100%;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:14px}
    .dss-page *{box-sizing:border-box}.dss-head{padding:24px 28px 18px;border-bottom:1px solid var(--dsw-alias-border-l1);display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
    .dss-page h1{font-size:22px;line-height:1.35;margin:0 0 6px;font-weight:600}.dss-muted{color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1.6}.dss-page p{margin:0}
    .dss-body{overflow:auto;min-height:0;flex:1;padding:22px 28px 32px}.dss-inner{max-width:980px;margin:0 auto}.dss-form{display:flex;gap:8px;margin:0 0 16px}
    .dss-page input,.dss-page select{font:inherit;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1);border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:10px 12px;min-width:0}
    .dss-searchbox{display:flex;align-items:center;flex:1;min-width:220px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-layer-1);padding-right:6px}.dss-page .dss-query{flex:1;width:100%;border:0;background:transparent}.dss-searchbox:focus-within{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}.dss-page .dss-query:focus-visible{outline:none}.dss-modes{display:flex;gap:2px;flex-shrink:0}.dss-page .dss-mode{font-family:monospace;font-size:13px;min-width:30px;padding:3px 4px;border-radius:5px;border-color:transparent;background:transparent}.dss-page .dss-mode[aria-pressed="true"]{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2)}.dss-mode-word{text-decoration:underline;text-underline-offset:3px}.dss-page input::placeholder{color:var(--dsw-alias-label-secondary)}
    .dss-page button{font:inherit;cursor:pointer;border:1px solid var(--dsw-alias-border-l2);border-radius:9px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);padding:8px 12px;line-height:1.5}
    .dss-page button:hover{background:var(--dsw-alias-bg-layer-2)}.dss-page button:disabled{opacity:.55;cursor:default}.dss-page button:focus-visible,.dss-page input:focus-visible,.dss-page select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}
    .dss-page .dss-primary{border-color:var(--dsw-alias-brand-primary);color:var(--dsw-alias-brand-primary)}
    .dss-scope{display:grid;grid-template-columns:auto minmax(140px,1fr) minmax(150px,2fr);gap:10px;align-items:center;margin-bottom:10px}.dss-scope select{max-width:100%;width:100%}.dss-scope label{font-weight:500}
    .dss-note{margin:18px 0 12px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap}.dss-message{padding:32px 20px;text-align:center;border:1px dashed var(--dsw-alias-border-l2);border-radius:12px;margin-top:24px;line-height:1.7;color:var(--dsw-alias-label-secondary)}
    .dss-error{color:var(--dsw-alias-state-error-primary);padding:14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;margin:14px 0;overflow-wrap:anywhere}
    .dss-hit{border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);border-radius:12px;margin-bottom:12px;padding:16px 18px}.dss-hit h2{font-size:15px;margin:0 0 5px;font-weight:600;overflow-wrap:anywhere}
    .dss-meta{display:flex;gap:10px;flex-wrap:wrap;margin:4px 0 12px}.dss-id{font-family:monospace;overflow-wrap:anywhere;font-size:11px}
    .dss-options{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin:12px 0 8px}.dss-check{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font-size:13px}.dss-check input{width:16px;height:16px;margin:0;accent-color:var(--dsw-alias-brand-primary)}
    .dss-hit-heading{display:flex;gap:9px;align-items:baseline;flex-wrap:wrap}.dss-badge{display:inline-flex;gap:5px;align-items:center;flex-shrink:0;font-size:11px;line-height:1.6;font-weight:500;color:var(--dsw-alias-brand-primary);background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:999px;padding:1px 8px;vertical-align:middle}.dss-badge svg{align-self:center}
    .dss-snippet{white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:13px;line-height:1.75;margin:10px 0 14px;max-height:260px;overflow:auto}.dss-snippet mark{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);font-weight:600;border-radius:2px}
    .dss-actions{display:flex;gap:8px;flex-wrap:wrap}.dss-more{display:block;margin:20px auto!important}.dss-shortcut{white-space:nowrap;font-family:monospace;border:1px solid var(--dsw-alias-border-l1);border-radius:5px;padding:2px 6px;margin-right:10px}
    .dss-views{display:inline-flex;gap:3px;padding:3px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px}.dss-page .dss-view{border-color:transparent;padding:5px 10px;background:transparent}.dss-page .dss-view[aria-pressed="true"]{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-border-l2)}
    .dss-group{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;margin:0 0 12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}.dss-group h2{font-size:14px;margin:0}.dss-page .dss-group-toggle{display:flex;align-items:center;text-align:left;gap:10px;width:100%;border:0;border-radius:0;padding:15px 18px;background:transparent}.dss-group-title{flex:1;min-width:0;overflow-wrap:anywhere;font-weight:600}.dss-chevron{flex-shrink:0;transition:transform .12s}.dss-group-toggle[aria-expanded="true"] .dss-chevron{transform:rotate(90deg)}.dss-group-count{font-size:12px;color:var(--dsw-alias-label-secondary);white-space:nowrap}.dss-group-meta{padding:0 18px 12px 42px;display:flex;gap:10px;flex-wrap:wrap}.dss-group-body{margin:0 16px 16px 26px;padding-left:14px;border-left:2px solid var(--dsw-alias-border-l2)}.dss-group-body .dss-hit{background:var(--dsw-alias-bg-base);padding:12px 14px}.dss-group-body .dss-meta{margin-top:0}.dss-group-body .dss-message{margin-top:0;padding:18px}.dss-group-progress{padding:8px 0}.dss-group .dss-more{margin:12px auto!important}
    .dss-zero{display:inline-block;width:2px;min-height:1em;vertical-align:text-bottom;background:var(--dsw-alias-brand-primary)}
    @media(max-width:650px){.dss-head{padding:18px 16px}.dss-body{padding:18px 16px}.dss-scope{grid-template-columns:1fr}.dss-form{flex-wrap:wrap}.dss-searchbox{flex-basis:100%;min-width:0}.dss-shortcut{display:none}.dss-hit{padding:14px}.dss-head .dss-muted{max-width:200px}}
    `;
    function Icon({size = 20}) {
      return h('svg', {width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, 'aria-hidden': true},
        h('circle', {cx: 10.5, cy: 10.5, r: 6.8}), h('path', {d: 'm16 16 5 5'}));
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
        const stored = {query: '', scope: '', workspaceId: '', includeSubagents: false, includeArchived: false, finalOnly: true, order: 'newest', matchCase: false, wholeWord: false, useRegex: false, view: 'timeline'};
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
        function WorkspaceLabel({hit}) {
          const name = hit.workspaceId === '__ungrouped__' ? t('ungroupedWorkspace') : hit.workspaceTitle || hit.workspacePath || hit.workspaceId || t('ungroupedWorkspace');
          return h('span', {className: 'dss-badge', title: hit.workspacePath || name}, `${t('workspace')}: ${name}`);
        }
        function Badges({hit}) {
          return h(React.Fragment, null,
            hit.subagent && h('span', {className: 'dss-badge'}, h(BranchIcon), t('subagent')),
            hit.archived && h('span', {className: 'dss-badge'}, t('archived')));
        }
        function ResultCard({hit, within, grouped = false}) {
          return h('article', {className: 'dss-hit'},
            !grouped && h('div', {className: 'dss-hit-heading'}, h('h2', null, hit.title || t('untitled')), h(Badges, {hit})),
            h('div', {className: 'dss-meta dss-muted'}, h('span', null, hit.type), h('span', null, `${t('event')} #${hit.seq}`),
              hit.time !== undefined && h('time', {dateTime: new Date(hit.time).toISOString()}, new Date(hit.time).toLocaleString()),
              !grouped && h('span', {className: 'dss-id'}, hit.sessionId)),
            h('pre', {className: 'dss-snippet'}, h(Highlight, {text: hit.snippet, ranges: hit.ranges})),
            h('div', {className: 'dss-actions'},
              h('button', {type: 'button', disabled: hit.archived, title: hit.archived ? t('archivedHint') : t('open'), onClick: () => ctx.uiWorkspace.openSession(hit.sessionId)}, t('open')),
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
              h('span', {className: 'dss-id'}, group.sessionId),
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
            h('div', {className: 'dss-note dss-muted'}, h('span', null, t('treeHint')),
              result.page && h('span', null, `${result.page.items.length} / ${result.page.total} ${t('sessions')} · ${result.page.totalMatches} ${t('matches')}`)),
            result.error && h('div', {className: 'dss-error', role: 'alert'}, result.error, ' ', h('button', {type: 'button', onClick: result.refresh}, t('retry'))),
            result.page?.warnings?.length > 0 && h('p', {className: 'dss-error', role: 'status'}, `${t('partial')} (${result.page.warnings.length})`),
            h('div', {'aria-live': 'polite', 'aria-busy': result.busy},
              !request.query.trim() ? h('div', {className: 'dss-message'}, h(Icon, {size: 28}), h('p', null, t('start'))) : result.busy && !result.page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : result.page?.items.length === 0 ? h('div', {className: 'dss-message'}, t('empty')) : null,
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
          const [view, setView] = React.useState(stored.view);
          const tree = !scope && view === 'session';
          const content = finalOnly ? 'final' : 'all';
          const [filter, setFilter] = React.useState('');
          const [catalog, setCatalog] = React.useState([]);
          const [catalogState, setCatalogState] = React.useState('loading');
          const [catalogVersion, setCatalogVersion] = React.useState(0);
          const [version, setVersion] = React.useState(0);
          const request = {query, workspaceId: workspaceId || undefined, includeSubagents, includeArchived, content, order, matchCase, wholeWord, useRegex};
          const timeline = usePaged({...request, sessionId: scope || undefined}, !tree && Boolean(query.trim()), version);
          const {page, error, busy, more} = timeline;
          const input = React.useRef(null);
          const setText = value => {stored.query = value; setQuery(value);};
          const setTarget = value => {stored.scope = value; setScope(value);};
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
            h('header', {className: 'dss-head'}, h('div', null, h('h1', null, t('title')), h('p', {className: 'dss-muted'}, t('intro'))),
              h('div', null, h('span', {className: 'dss-shortcut dss-muted'}, t('shortcut')), h('button', {type: 'button', title: t('close'), 'aria-label': t('close'), onClick: () => ctx.layout.selectPanel(null)}, '×'))),
            h('div', {className: 'dss-body'}, h('div', {className: 'dss-inner'},
              h('form', {className: 'dss-form', onSubmit: e => {e.preventDefault(); setVersion(v => v + 1);}},
                h('div', {className: 'dss-searchbox'},
                  h('input', {ref: input, className: 'dss-query', type: 'search', value: query, maxLength: 1024, placeholder: t('placeholder'), 'aria-label': t('placeholder'), onChange: e => setText(e.target.value)}),
                  h('div', {className: 'dss-modes', role: 'group', 'aria-label': t('searchModes')},
                    ...[
                      ['matchCase', 'Aa', matchCase, setMatchCase],
                      ['wholeWord', 'ab', wholeWord, setWholeWord],
                      ['useRegex', '.*', useRegex, setUseRegex]
                    ].map(([name, label, enabled, setEnabled]) => h('button', {key: name, type: 'button', className: `dss-mode${name === 'wholeWord' ? ' dss-mode-word' : ''}`, title: t(name), 'aria-label': t(name), 'aria-pressed': enabled, onClick: () => {stored[name] = !enabled; setEnabled(!enabled);}}, label)))),
                h('button', {className: 'dss-primary', disabled: !query.trim(), type: 'submit'}, t('search')),
                query && h('button', {type: 'button', onClick: () => {setText(''); input.current?.focus();}}, t('clear'))),
              h('div', {className: 'dss-options'}, h('label', {htmlFor: 'dss-workspace'}, t('workspace')),
                h('select', {id: 'dss-workspace', value: workspaceId, title: t('workspaceHint'), onChange: e => setWorkspace(e.target.value)},
                  h('option', {value: ''}, t('allWorkspaces')),
                  workspaceId && !workspaces.some(item => item.workspaceId === workspaceId) && h('option', {value: workspaceId}, workspaceId),
                  ...workspaces.map(item => h('option', {key: item.workspaceId, value: item.workspaceId, title: item.path || workspaceName(item)}, workspaceName(item))))),
              h('p', {className: 'dss-muted'}, t('workspaceHint')),
              h('div', {className: 'dss-scope'}, h('label', {htmlFor: 'dss-scope'}, t('scope')),
                h('input', {type: 'search', value: filter, placeholder: t('sessionFilter'), 'aria-label': t('sessionFilter'), onChange: e => setFilter(e.target.value)}),
                h('select', {id: 'dss-scope', value: scope, disabled: catalogState !== 'ready', onChange: e => setTarget(e.target.value)},
                  h('option', {value: ''}, t('all')),
                  scope && !selected && h('option', {value: scope}, `${t('unavailable')} · ${scope}`),
                  ...options,
                   null)),
              h('p', {className: 'dss-muted'}, t('pickerHint')),
              h('div', {className: 'dss-options'}, h('label', {className: 'dss-check'},
                h('input', {type: 'checkbox', checked: includeSubagents, onChange: e => setSubagents(e.target.checked)}), t('includeSubagents')),
                h('label', {className: 'dss-check'}, h('input', {type: 'checkbox', checked: includeArchived, onChange: e => setArchives(e.target.checked)}), t('includeArchived')),
                h('label', {className: 'dss-check', title: t('finalHint')}, h('input', {type: 'checkbox', checked: finalOnly, onChange: e => {stored.finalOnly = e.target.checked; setFinalOnly(e.target.checked);}}), t('finalOnly')),
                h('button', {type: 'button', onClick: () => {setCatalogVersion(v => v + 1); setVersion(v => v + 1);}}, t('refresh'))),
              h('p', {className: 'dss-muted'}, t('finalHint')),
              h('div', {className: 'dss-options'}, h('label', {htmlFor: 'dss-order'}, t('sort')),
                h('select', {id: 'dss-order', value: order, onChange: e => {stored.order = e.target.value; setOrder(e.target.value);}},
                  h('option', {value: 'newest'}, t('newest')), h('option', {value: 'oldest'}, t('oldest'))),
                !scope && h('div', {className: 'dss-views', role: 'group', 'aria-label': t('view')},
                  ...[['timeline', 'timeline'], ['session', 'bySession']].map(([value, label]) => h('button', {key: value, type: 'button', className: 'dss-view', 'aria-pressed': view === value, onClick: () => {stored.view = value; setView(value);}}, t(label))))),
              h('p', {className: 'dss-muted'}, t('matching')),
              useRegex && h('p', {className: 'dss-muted'}, t('regexHint')),
              catalogState === 'loading' && h('p', {className: 'dss-muted', role: 'status'}, t('loadingSessions')),
              catalogState === 'error' && h('div', {className: 'dss-error', role: 'alert'}, t('catalogError'), ' ', h('button', {type: 'button', onClick: () => setCatalogVersion(v => v + 1)}, t('retry'))),
              h(SessionGroups, {key: scope, request, enabled: tree, revision: version, within}),
               h('div', {hidden: tree},
               h('div', {className: 'dss-note dss-muted'}, h('span', null, scope ? t('events') : t('grouped')), page && h('span', null, `${page.items.length}${Number.isInteger(page.total) ? ` / ${page.total}` : page.nextCursor ? '+' : ''} · ${t('results')}`)),
              error && h('div', {className: 'dss-error', role: 'alert'}, h('p', null, error), h('button', {type: 'button', onClick: () => setVersion(v => v + 1)}, t('retry'))),
              page?.warnings?.length > 0 && h('div', {className: 'dss-error', role: 'status'}, `${t('partial')} (${page.warnings.length})`),
              h('div', {'aria-live': 'polite', 'aria-busy': busy},
                busy && !page ? h('div', {className: 'dss-message', role: 'status'}, t('loading')) : !query.trim() ? h('div', {className: 'dss-message'}, h(Icon, {size: 28}), h('p', null, t('start'))) : page?.items.length === 0 ? h('div', {className: 'dss-message'}, t(page.nextCursor ? 'pending' : 'empty')) : null,
                page?.items.map(hit => h('article', {className: 'dss-hit', key: `${hit.sessionId}:${hit.seq}`},
                  h('div', {className: 'dss-hit-heading'}, h('h2', null, hit.title || selected?.title || t('untitled')),
                    !workspaceId && h(WorkspaceLabel, {hit}),
                    hit.subagent && h('span', {className: 'dss-badge'}, h(BranchIcon), t('subagent')),
                    hit.archived && h('span', {className: 'dss-badge'}, t('archived'))),
                  h('div', {className: 'dss-meta dss-muted'}, h('span', null, hit.type), h('span', null, `${t('event')} #${hit.seq}`), hit.time !== undefined && h('time', {dateTime: new Date(hit.time).toISOString()}, new Date(hit.time).toLocaleString()), h('span', {className: 'dss-id'}, hit.sessionId)),
                  h('pre', {className: 'dss-snippet'}, h(Highlight, {text: hit.snippet, ranges: hit.ranges})),
                  h('div', {className: 'dss-actions'},
                    h('button', {type: 'button', disabled: hit.archived, title: hit.archived ? t('archivedHint') : t('open'), onClick: () => ctx.uiWorkspace.openSession(hit.sessionId)}, t('open')),
                    !scope && h('button', {type: 'button', className: 'dss-primary', onClick: () => {setTarget(hit.sessionId); setFilter('');}}, t('within'))))),
                page?.nextCursor && h('button', {className: 'dss-more', type: 'button', disabled: busy, onClick: more}, busy ? t('loading') : t('more'))))
            )));
        }
        ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({name: 'sidebar.panellist', id: PANEL, order: -10, label: () => t('title')}, Icon));
        ctx.slots.inject('main', () => ctx.slots.register({name: 'main', key: PANEL}, SearchPage));
      }
    };
  }
});
