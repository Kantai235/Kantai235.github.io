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
  '</docs/agent/>; rel="service-doc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
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

function applyDiscoveryHeaders(headers, pathname) {
  DISCOVERY_LINK_HEADERS.forEach(function(linkValue) {
    headers.append('Link', linkValue);
  });

  const forcedContentType = FORCED_CONTENT_TYPES.get(pathname);
  if (forcedContentType) {
    headers.set('Content-Type', forcedContentType);
  }

  headers.set('Vary', mergeHeaderValue(headers.get('Vary'), 'Accept'));
  headers.set('Content-Signal', CONTENT_SIGNAL_POLICY);
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
