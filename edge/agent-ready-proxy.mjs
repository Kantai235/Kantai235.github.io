/**
 * @file agent-ready-proxy.mjs
 * @description 可選用的邊緣層代理範本。
 *   這個 Worker 會替首頁加上 discovery Link 標頭，並在代理人送出
 *   Accept: text/markdown 時，回傳靜態 Markdown 備援內容。
 *
 * 使用方式：
 *   1. 將自訂網域流量導向這個 Worker。
 *   2. 設定環境變數 ORIGIN_BASE_URL 指向 GitHub Pages 原站，例如：
 *      https://kantai235.github.io
 *   3. 視需要擴充 MARKDOWN_PATHS 與 FORCED_CONTENT_TYPES。
 */

const DISCOVERY_LINK_HEADERS = [
  '</.well-known/api-catalog>; rel="api-catalog"',
  '</docs/agent/>; rel="service-doc"',
  '</.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"',
  '</.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"',
  '</.well-known/markdown/home.md>; rel="alternate"; type="text/markdown"'
];

const MARKDOWN_PATHS = new Map([
  ['/', '/.well-known/markdown/home.md']
]);

const FORCED_CONTENT_TYPES = new Map([
  [
    '/.well-known/api-catalog',
    'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
  ],
  [
    '/.well-known/mcp/server-card.json',
    'application/json; charset=utf-8'
  ],
  [
    '/.well-known/markdown/home.md',
    'text/markdown; charset=utf-8'
  ]
]);

function mergeVary(existingValue, nextValue) {
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

  headers.set('Vary', mergeVary(headers.get('Vary'), 'Accept'));
}

function buildOriginUrl(requestUrl, originBaseUrl) {
  const url = new URL(requestUrl);
  const target = new URL(originBaseUrl);

  target.pathname = url.pathname;
  target.search = url.search;

  return target.toString();
}

export default {
  async fetch(request, env) {
    if (!env.ORIGIN_BASE_URL) {
      return new Response('缺少 ORIGIN_BASE_URL 環境變數。', {
        status: 500,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8'
        }
      });
    }

    const url = new URL(request.url);
    const acceptHeader = request.headers.get('Accept') || '';
    const wantsMarkdown = acceptHeader.includes('text/markdown');
    const markdownPath = MARKDOWN_PATHS.get(url.pathname);

    if (wantsMarkdown && markdownPath) {
      const markdownUrl = new URL(markdownPath, env.ORIGIN_BASE_URL).toString();
      const markdownResponse = await fetch(markdownUrl, {
        headers: {
          Accept: 'text/markdown, text/plain;q=0.9, */*;q=0.1'
        }
      });

      const headers = new Headers(markdownResponse.headers);
      applyDiscoveryHeaders(headers, markdownPath);

      return new Response(markdownResponse.body, {
        status: markdownResponse.status,
        statusText: markdownResponse.statusText,
        headers: headers
      });
    }

    const upstreamRequest = new Request(
      buildOriginUrl(request.url, env.ORIGIN_BASE_URL),
      request
    );
    const upstreamResponse = await fetch(upstreamRequest);
    const headers = new Headers(upstreamResponse.headers);

    applyDiscoveryHeaders(headers, url.pathname);

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: headers
    });
  }
};
