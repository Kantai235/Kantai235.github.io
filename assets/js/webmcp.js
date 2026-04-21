/**
 * @file webmcp.js
 * @description 在支援 WebMCP 的瀏覽器環境中註冊本站的代理人工具。
 *   工具皆以唯讀導覽與搜尋為主，避免代理人誤修改頁面狀態。
 */
document.addEventListener('DOMContentLoaded', function() {
  const modelContext = window.navigator.modelContext;

  if (!window.isSecureContext || !modelContext) {
    return;
  }

  const supportedLanguages = ['zh-tw', 'zh-cn', 'en', 'ja'];
  const sections = [
    {
      key: 'home',
      title: '首頁',
      path: '/',
      description: '網站首頁與整體導覽入口'
    },
    {
      key: 'posts',
      title: '文章列表',
      path: '/posts/',
      description: '技術文章與歷史文章索引'
    },
    {
      key: 'search',
      title: '站內搜尋',
      path: '/search/',
      description: '搜尋所有公開文章與頁面'
    },
    {
      key: 'engineer',
      title: '工程師簡介',
      path: '/engineer/',
      description: '工程師個人簡介頁'
    },
    {
      key: 'kemono',
      title: '獸設頁面',
      path: '/kemono/',
      description: '獸設角色與藝術委託展示'
    },
    {
      key: 'agent-docs',
      title: '代理人文件',
      path: '/docs/agent/',
      description: '代理人探索文件與公開端點說明'
    }
  ];

  let searchIndexPromise;

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
  }

  function inferLanguage(permalink) {
    if (permalink.startsWith('/en/')) return 'en';
    if (permalink.startsWith('/ja/')) return 'ja';
    if (permalink.startsWith('/zh-cn/')) return 'zh-cn';
    return 'zh-tw';
  }

  function toAbsoluteUrl(path) {
    return new URL(path, window.location.origin).toString();
  }

  function getSearchIndex() {
    if (!searchIndexPromise) {
      searchIndexPromise = fetch('/index.json')
        .then(function(response) {
          if (!response.ok) {
            throw new Error('搜尋索引載入失敗');
          }

          return response.json();
        });
    }

    return searchIndexPromise;
  }

  function scoreEntry(entry, terms) {
    const title = normalizeText(entry.title);
    const summary = normalizeText(entry.summary);
    const content = normalizeText(entry.content);

    return terms.reduce(function(score, term) {
      let nextScore = score;

      if (title.includes(term)) nextScore += 6;
      if (summary.includes(term)) nextScore += 3;
      if (content.includes(term)) nextScore += 1;

      return nextScore;
    }, 0);
  }

  function limitResults(value) {
    const parsed = Number.parseInt(value, 10);

    if (Number.isNaN(parsed)) return 5;
    return Math.min(Math.max(parsed, 1), 10);
  }

  const tools = [
    {
      name: 'search-posts',
      title: '搜尋文章',
      description: '搜尋本站公開文章與頁面，回傳最相關的結果清單。',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: '搜尋關鍵字。'
          },
          language: {
            type: 'string',
            description: '選填，限制特定語言。',
            enum: supportedLanguages
          },
          limit: {
            type: 'integer',
            description: '結果上限，介於 1 到 10，預設為 5。',
            minimum: 1,
            maximum: 10
          }
        },
        required: ['query']
      },
      annotations: {
        readOnlyHint: true
      },
      execute: async function(input) {
        const query = String(input.query || '').trim();
        const language = normalizeText(input.language);
        const limit = limitResults(input.limit);

        if (!query) {
          return {
            query: '',
            total: 0,
            results: [],
            message: '請提供非空白的搜尋關鍵字。'
          };
        }

        const entries = await getSearchIndex();
        const terms = query
          .toLowerCase()
          .split(/\s+/)
          .filter(Boolean);

        const results = entries
          .map(function(entry) {
            return {
              entry: entry,
              language: inferLanguage(entry.permalink || '/'),
              score: scoreEntry(entry, terms)
            };
          })
          .filter(function(result) {
            if (result.score <= 0) return false;
            if (!language) return true;
            return result.language === language;
          })
          .sort(function(left, right) {
            return right.score - left.score;
          })
          .slice(0, limit)
          .map(function(result) {
            return {
              title: result.entry.title,
              summary: result.entry.summary,
              url: toAbsoluteUrl(result.entry.permalink || '/'),
              language: result.language,
              section: result.entry.section || result.entry.type || '',
              score: result.score
            };
          });

        return {
          query: query,
          total: results.length,
          results: results
        };
      }
    },
    {
      name: 'list-site-sections',
      title: '列出站點區段',
      description: '列出本站主要區段與代理人探索入口。',
      inputSchema: {
        type: 'object',
        properties: {}
      },
      annotations: {
        readOnlyHint: true
      },
      execute: async function() {
        return {
          sections: sections.map(function(section) {
            return {
              key: section.key,
              title: section.title,
              description: section.description,
              url: toAbsoluteUrl(section.path)
            };
          }),
          discovery: {
            apiCatalog: toAbsoluteUrl('/.well-known/api-catalog'),
            agentSkills: toAbsoluteUrl('/.well-known/agent-skills/index.json'),
            markdownHome: toAbsoluteUrl('/.well-known/markdown/home.md'),
            metadata: toAbsoluteUrl('/api/site-metadata.json')
          }
        };
      }
    },
    {
      name: 'navigate-section',
      title: '切換站點區段',
      description: '將目前頁面導向本站的主要區段。',
      inputSchema: {
        type: 'object',
        properties: {
          target: {
            type: 'string',
            description: '目標區段代號。',
            enum: sections.map(function(section) {
              return section.key;
            })
          }
        },
        required: ['target']
      },
      execute: async function(input, client) {
        const target = sections.find(function(section) {
          return section.key === input.target;
        });

        if (!target) {
          return {
            ok: false,
            message: '找不到指定的站點區段。'
          };
        }

        if (client && typeof client.requestUserInteraction === 'function') {
          await client.requestUserInteraction(function() {
            const shouldNavigate = window.confirm('代理人想切換到「' + target.title + '」，是否允許？');

            if (!shouldNavigate) {
              throw new Error('使用者已取消頁面切換。');
            }

            return Promise.resolve({ approved: true });
          });
        }

        window.location.assign(target.path);

        return {
          ok: true,
          title: target.title,
          url: toAbsoluteUrl(target.path)
        };
      }
    }
  ];

  if (typeof modelContext.provideContext === 'function') {
    modelContext.provideContext({ tools: tools });
    return;
  }

  if (typeof modelContext.registerTool === 'function') {
    tools.forEach(function(tool) {
      modelContext.registerTool(tool);
    });
  }
});
