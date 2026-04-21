# Agent Readiness 補強紀錄

這份文件整理 `https://isitagentready.com/blog.init.engineer` 回報項目的落地方式、目前狀態，以及在 `Hugo + GitHub Pages` 架構下的限制。

## 已完成

### 1. Link discovery 資源與頁面內探索連結

- 已新增 `/.well-known/api-catalog`
- 已在 [layouts/partials/extend-head.html](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/layouts/partials/extend-head.html:1) 補上：
  - `rel="api-catalog"`
  - `rel="service-doc"`
  - `rel="describedby"`（技能索引與 MCP 卡片）
  - `rel="alternate"`（首頁 Markdown 備援）
- 已提供 [static/_headers](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/static/_headers:1) 與 [edge/agent-ready-proxy.mjs](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/edge/agent-ready-proxy.mjs:1) 作為邊緣層標頭範本

### 2. Markdown for Agents 備援

- 已新增首頁 Markdown 備援：`/.well-known/markdown/home.md`
- 已提供邊緣層 Worker 範本，在首頁收到 `Accept: text/markdown` 時可改回傳 Markdown
- GitHub Pages 直出模式無法自行做 `Accept` 協商，需額外掛邊緣代理才會真正生效

### 3. Content Signals

- 已於 [static/robots.txt](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/static/robots.txt:1) 新增：
  - `Content-Signal: ai-train=no, search=yes, ai-input=no`

### 4. API Catalog

- 已新增 `/.well-known/api-catalog`
- 已新增公開探索 API：
  - `/api/site-metadata.json`
  - `/api/status.json`
  - `/openapi/site-discovery.yaml`
  - `/docs/agent/`

### 5. Agent Skills Discovery

- 已新增 `/.well-known/agent-skills/index.json`
- 已新增技能：
  - `site-navigation`
  - `post-discovery`

### 6. WebMCP

- 已新增 [assets/js/webmcp.js](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/assets/js/webmcp.js:1)
- 已提供工具：
  - `search-posts`
  - `list-site-sections`
  - `navigate-section`

### 7. MCP Server Card（以 WebMCP 橋接描述）

- 已新增 `/.well-known/mcp/server-card.json`
- 這份卡片明確標示本站目前提供的是「瀏覽器端 WebMCP 工具集合」，不是獨立遠端 MCP HTTP 伺服器

## 暫不發布

### 8. OAuth / OIDC Discovery Metadata

目前本站沒有受保護 API，也沒有登入流程，因此不適合捏造：

- `/.well-known/openid-configuration`
- `/.well-known/oauth-authorization-server`

若未來新增需要登入的 API，應再依實際授權伺服器資訊發布。

### 9. OAuth Protected Resource Metadata

目前沒有 OAuth 保護資源，因此不發布：

- `/.well-known/oauth-protected-resource`

若未來 API 改為需要 access token，再補上 `resource`、`authorization_servers`、`scopes_supported`。

## 建議後續

若要讓 `Link` 回應標頭與 `Accept: text/markdown` 真正在正式站生效，建議採用以下其中一種方式：

1. 保留 GitHub Pages 作為 origin，外層加 Cloudflare Worker / 其他反向代理。
2. 遷移到支援 `_headers` 與邊緣規則的靜態託管平臺。

在維持目前 GitHub Pages 直出的前提下，專案內已盡量補齊所有可由靜態資源與前端腳本完成的項目。
