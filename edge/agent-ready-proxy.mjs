/**
 * @file agent-ready-proxy.mjs
 * @description Cloudflare Worker 邊緣層，負責：
 *   1. 補上 RFC 8288 Link discovery 回應標頭
 *   2. 在 Accept: text/markdown 時把 HTML 轉成 Markdown
 *   3. 為 well-known JSON / Markdown 檔案設定正確 Content-Type
 *
 * 這支 Worker 會搭配 wrangler.toml 中的 ASSETS binding，
 * 直接讀取 Hugo 建置後的 public/ 靜態資產。
 */

const DISCOVERY_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</openapi/site-discovery.yaml>; rel="service-desc"; type="application/yaml"',
  '</docs/agent/>; rel="service-doc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/agent-card.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"',
  '</.well-known/oauth-authorization-server>; rel="describedby"; type="application/json"',
  '</.well-known/oauth-protected-resource>; rel="describedby"; type="application/json"',
  '</.well-known/markdown/home.md>; rel="alternate"; type="text/markdown"'
];

const CONTENT_SIGNAL_POLICY = 'ai-train=no, search=yes, ai-input=no';

const FORCED_CONTENT_TYPES = new Map([
  [
    '/.well-known/api-catalog',
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
  ],
  [
    '/.well-known/agent-skills/index.json',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/agent-card.json',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/mcp/server-card.json',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/oauth-authorization-server',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/oauth-protected-resource',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/markdown/home.md',
    'text/markdown; charset=utf-8'
  ],
  [
    '/openapi/site-discovery.yaml',
    'application/yaml; charset=utf-8'
  ]
]);

function decodeHtmlEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .replace(/&#x([0-9a-f]+);/gi, function(match, value) {
      return String.fromCodePoint(Number.parseInt(value, 16));
    })
    .replace(/&#([0-9]+);/g, function(match, value) {
      return String.fromCodePoint(Number.parseInt(value, 10));
    });
}

function stripTags(html) {
  return decodeHtmlEntities(String(html || '').replace(/<[^>]+>/g, ' '));
}

function normalizeInlineText(text) {
  return stripTags(text).replace(/\s+/g, ' ').trim();
}

function normalizeBlockText(text) {
  return decodeHtmlEntities(String(text || ''))
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function resolveAbsoluteUrl(pageUrl, maybeRelativeUrl) {
  if (!maybeRelativeUrl) {
    return '';
  }

  try {
    return new URL(maybeRelativeUrl, pageUrl).toString();
  } catch {
    return maybeRelativeUrl;
  }
}

function extractTitle(html) {
  const match = String(html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return normalizeInlineText(match ? match[1] : '');
}

function extractDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["'][^>]*>/i
  ];

  for (const pattern of patterns) {
    const match = String(html || '').match(pattern);
    if (match && match[1]) {
      return decodeHtmlEntities(match[1]).trim();
    }
  }

  return '';
}

function extractMainHtml(html) {
  const source = String(html || '');
  const mainMatch = source.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch && mainMatch[1]) {
    return mainMatch[1];
  }

  const articleMatch = source.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch && articleMatch[1]) {
    return articleMatch[1];
  }

  const bodyMatch = source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
  return bodyMatch && bodyMatch[1] ? bodyMatch[1] : source;
}

function readAttribute(tag, name) {
  const pattern = new RegExp(name + '=(["\'])(.*?)\\1', 'i');
  const match = String(tag || '').match(pattern);
  return match ? decodeHtmlEntities(match[2]) : '';
}

function convertHtmlToMarkdown(html, pageUrl) {
  let source = extractMainHtml(html)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, '');

  const stashedBlocks = [];

  function stash(markdown) {
    const index = stashedBlocks.push(markdown) - 1;
    return '__MD_BLOCK_' + index + '__';
  }

  source = source.replace(/<pre\b[^>]*>\s*<code\b[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi, function(match, code) {
    return stash('\n```\n' + normalizeBlockText(stripTags(code)) + '\n```\n');
  });

  source = source.replace(/<code\b[^>]*>([\s\S]*?)<\/code>/gi, function(match, code) {
    return stash('`' + normalizeInlineText(code) + '`');
  });

  source = source.replace(/<img\b[^>]*>/gi, function(tag) {
    const alt = readAttribute(tag, 'alt') || '圖片';
    const src = resolveAbsoluteUrl(pageUrl, readAttribute(tag, 'src'));

    if (!src) {
      return '';
    }

    return stash('![' + alt + '](' + src + ')');
  });

  source = source.replace(/<a\b[^>]*>[\s\S]*?<\/a>/gi, function(anchorTag) {
    const href = resolveAbsoluteUrl(pageUrl, readAttribute(anchorTag, 'href'));
    const innerMatch = anchorTag.match(/<a\b[^>]*>([\s\S]*?)<\/a>/i);
    const label = normalizeInlineText(innerMatch ? innerMatch[1] : href) || href;

    if (!href) {
      return label;
    }

    return '[' + label + '](' + href + ')';
  });

  source = source.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, function(match, level, text) {
    return '\n' + '#'.repeat(Number(level)) + ' ' + normalizeInlineText(text) + '\n\n';
  });

  source = source.replace(/<blockquote\b[^>]*>([\s\S]*?)<\/blockquote>/gi, function(match, text) {
    return '\n> ' + normalizeInlineText(text) + '\n\n';
  });

  source = source.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, function(match, text) {
    return '- ' + normalizeInlineText(text) + '\n';
  });

  source = source.replace(/<\/(ul|ol)>/gi, '\n');
  source = source.replace(/<br\s*\/?>/gi, '\n');
  source = source.replace(/<\/p>/gi, '\n\n');
  source = source.replace(/<\/div>/gi, '\n\n');
  source = source.replace(/<hr\b[^>]*>/gi, '\n---\n');
  source = source.replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, function(match, text) {
    return '**' + normalizeInlineText(text) + '**';
  });
  source = source.replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, function(match, text) {
    return '*' + normalizeInlineText(text) + '*';
  });
  source = source.replace(/<[^>]+>/g, ' ');

  let markdownBody = decodeHtmlEntities(source)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  markdownBody = markdownBody.replace(/__MD_BLOCK_(\d+)__/g, function(match, index) {
    return stashedBlocks[Number(index)] || '';
  });

  const title = extractTitle(html) || '未命名頁面';
  const description = extractDescription(html);
  const lines = ['# ' + title, '', '> 原始網址：' + pageUrl];

  if (description) {
    lines.push('', description);
  }

  if (markdownBody) {
    lines.push('', markdownBody);
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function estimateMarkdownTokens(markdown) {
  const plainText = String(markdown || '').trim();
  if (!plainText) {
    return '0';
  }

  return String(Math.max(1, Math.ceil(plainText.length / 4)));
}

function mergeHeaderValue(existingValue, nextValue) {
  const parts = String(existingValue || '')
    .split(',')
    .map(function(value) {
      return value.trim();
    })
    .filter(Boolean);

  if (!parts.includes(nextValue)) {
    parts.push(nextValue);
  }

  return parts.join(', ');
}

function appendUniqueHeaderValue(headers, name, value) {
  headers.set(name, mergeHeaderValue(headers.get(name), value));
}

function applyDiscoveryHeaders(headers, pathname) {
  DISCOVERY_LINK_HEADERS.forEach(function(linkValue) {
    appendUniqueHeaderValue(headers, 'Link', linkValue);
  });

  const forcedContentType = FORCED_CONTENT_TYPES.get(pathname);
  if (forcedContentType) {
    headers.set('Content-Type', forcedContentType);
  }

  headers.set('Vary', mergeHeaderValue(headers.get('Vary'), 'Accept'));
  headers.set('Content-Signal', CONTENT_SIGNAL_POLICY);
}

function jsonResponse(payload, init) {
  return new Response(JSON.stringify(payload, null, 2), {
    status: init.status,
    statusText: init.statusText,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}

function isHtmlResponse(response) {
  return String(response.headers.get('Content-Type') || '').includes('text/html');
}

function isMarkdownResponse(response, pathname) {
  if (pathname.endsWith('.md')) {
    return true;
  }

  return String(response.headers.get('Content-Type') || '').includes('text/markdown');
}

export default {
  async fetch(request, env) {
    if (!env.ASSETS || typeof env.ASSETS.fetch !== 'function') {
      return new Response('缺少 ASSETS binding，無法讀取靜態資產。', {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      });
    }

    const url = new URL(request.url);
    const acceptHeader = request.headers.get('Accept') || '';
    const wantsMarkdown = acceptHeader.includes('text/markdown');

    if (url.pathname === '/a2a') {
      if (request.method === 'GET') {
        const response = jsonResponse({
          endpoint: 'https://blog.init.engineer/a2a',
          protocol: 'A2A JSON-RPC',
          status: 'discovery-only',
          message: '此入口目前主要用於公布 Agent Card 指向的服務位置，尚未實作完整的 A2A 任務處理流程。',
          card: 'https://blog.init.engineer/.well-known/agent-card.json',
          documentation: 'https://blog.init.engineer/docs/agent/'
        }, {
          status: 200,
          statusText: 'OK'
        });

        const headers = new Headers(response.headers);
        applyDiscoveryHeaders(headers, url.pathname);

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: headers
        });
      }

      if (request.method === 'POST') {
        let requestBody = null;

        try {
          requestBody = await request.json();
        } catch {
          const parseErrorResponse = jsonResponse({
            jsonrpc: '2.0',
            id: null,
            error: {
              code: -32700,
              message: 'Parse error'
            }
          }, {
            status: 400,
            statusText: 'Bad Request'
          });
          const headers = new Headers(parseErrorResponse.headers);
          applyDiscoveryHeaders(headers, url.pathname);

          return new Response(parseErrorResponse.body, {
            status: parseErrorResponse.status,
            statusText: parseErrorResponse.statusText,
            headers: headers
          });
        }

        const methodName = requestBody && typeof requestBody.method === 'string'
          ? requestBody.method
          : '';
        const unsupportedResponse = jsonResponse({
          jsonrpc: '2.0',
          id: requestBody && Object.prototype.hasOwnProperty.call(requestBody, 'id')
            ? requestBody.id
            : null,
          error: {
            code: -32601,
            message: 'Method not found',
            data: {
              endpointStatus: 'discovery-only',
              requestedMethod: methodName,
              documentation: 'https://blog.init.engineer/docs/agent/',
              agentCard: 'https://blog.init.engineer/.well-known/agent-card.json'
            }
          }
        }, {
          status: 501,
          statusText: 'Not Implemented'
        });
        const headers = new Headers(unsupportedResponse.headers);
        applyDiscoveryHeaders(headers, url.pathname);

        return new Response(unsupportedResponse.body, {
          status: unsupportedResponse.status,
          statusText: unsupportedResponse.statusText,
          headers: headers
        });
      }

      const methodNotAllowedResponse = jsonResponse({
        error: 'Method Not Allowed'
      }, {
        status: 405,
        statusText: 'Method Not Allowed'
      });
      const headers = new Headers(methodNotAllowedResponse.headers);
      applyDiscoveryHeaders(headers, url.pathname);
      headers.set('Allow', 'GET, POST');

      return new Response(methodNotAllowedResponse.body, {
        status: methodNotAllowedResponse.status,
        statusText: methodNotAllowedResponse.statusText,
        headers: headers
      });
    }

    const assetResponse = await env.ASSETS.fetch(request);

    if (wantsMarkdown && isHtmlResponse(assetResponse)) {
      const html = await assetResponse.text();
      const markdown = convertHtmlToMarkdown(html, url.toString());
      const headers = new Headers(assetResponse.headers);

      applyDiscoveryHeaders(headers, url.pathname);
      headers.set('Content-Type', 'text/markdown; charset=utf-8');
      headers.set('x-markdown-tokens', estimateMarkdownTokens(markdown));

      return new Response(markdown, {
        status: assetResponse.status,
        statusText: assetResponse.statusText,
        headers: headers
      });
    }

    const headers = new Headers(assetResponse.headers);
    applyDiscoveryHeaders(headers, url.pathname);

    if (isMarkdownResponse(assetResponse, url.pathname)) {
      const markdown = await assetResponse.clone().text();
      headers.set('x-markdown-tokens', estimateMarkdownTokens(markdown));
    }

    return new Response(assetResponse.body, {
      status: assetResponse.status,
      statusText: assetResponse.statusText,
      headers: headers
    });
  }
};
