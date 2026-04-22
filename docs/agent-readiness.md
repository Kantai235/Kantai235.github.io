# Agent Readiness 補強紀錄

這份文件整理 `https://isitagentready.com/blog.init.engineer` 回報項目的落地方式、目前狀態，以及在 `Hugo + GitHub Pages + Cloudflare Worker` 架構下的處理方式。

## 已完成

### 1. Link discovery 資源與頁面內探索連結

- 已新增 `/.well-known/api-catalog`
- 已在 [layouts/partials/extend-head.html](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/layouts/partials/extend-head.html:1) 補上：
  - `rel="api-catalog"`
  - `rel="service-desc"`（OpenAPI 描述）
  - `rel="service-doc"`
  - `rel="describedby"`（技能索引、MCP 卡片、OAuth metadata）
  - `rel="alternate"`（首頁 Markdown 備援）
- 已在 [edge/agent-ready-proxy.mjs](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/edge/agent-ready-proxy.mjs:1) 實作實際的 Link 回應標頭注入
- 已提供 [wrangler.toml](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/wrangler.toml:1) 與 [static/_headers](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/static/_headers:1) 對應不同部署平臺

### 2. Markdown for Agents 備援

- 已新增首頁 Markdown 備援：`/.well-known/markdown/home.md`
- 已在 Worker 內實作 HTML → Markdown 轉換，當 HTML 頁面收到 `Accept: text/markdown` 時會回傳 `text/markdown`
- 轉換後的回應會補上 `Vary: Accept` 與 `x-markdown-tokens`

### 3. Content Signals

- 已於 [static/robots.txt](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/static/robots.txt:1) 新增：
  - `Content-Signal: ai-train=no, search=yes, ai-input=no`
- 已將 [config/_default/config.toml](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/config/_default/config.toml:19) 的 `enableRobotsTXT` 改為 `false`
  以便正式建置時直接使用自訂的 `static/robots.txt`，避免被 Hugo 內建的簡化版 `robots.txt` 覆蓋
- Worker 也會在邊緣回應層補上相同的 `Content-Signal` 標頭

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

### 6. A2A Agent Card

- 已新增 `/.well-known/agent-card.json`
- Agent Card 會宣告：
  - `supportedInterfaces` 指向 `https://blog.init.engineer/a2a`
  - `protocolBinding` 為 `JSONRPC`
  - `protocolVersion` 為 `1.0`
- Worker 已提供 `/a2a` discovery-only JSON-RPC 入口：
  - `GET /a2a` 會回傳 discovery 摘要
  - `POST /a2a` 會回傳標準 JSON-RPC 錯誤，明確說明目前尚未實作完整任務流程

### 7. WebMCP

- 已新增 [assets/js/webmcp.js](/Users/kantai/Projects.localized/KantaiDeveloper/Kantai235.github.io/assets/js/webmcp.js:1)
- 已提供工具：
  - `search-posts`
  - `list-site-sections`
  - `navigate-section`

### 8. MCP Server Card（以 WebMCP 橋接描述）

- 已新增 `/.well-known/mcp/server-card.json`
- 這份卡片明確標示本站目前提供的是「瀏覽器端 WebMCP 工具集合」，不是獨立遠端 MCP HTTP 伺服器

### 9. OAuth / OIDC Discovery Metadata

- 已新增 `/.well-known/oauth-authorization-server`
- 目前採用「metadata present, no grants」模式，明確宣告：
  - 尚未啟用可用的 OAuth grant flow
  - 未提供 `authorization_endpoint`、`token_endpoint`、`jwks_uri`
  - 若未來新增受保護 API，再替換成實際授權端點

### 10. OAuth Protected Resource Metadata

- 已新增 `/.well-known/oauth-protected-resource`
- 目前主要用途是讓代理人知道本站的資源識別與對應的 OAuth metadata 位置
- 若未來 API 改為需要 access token，再補上實際的 `scopes_supported` 與 Bearer Token 呈現方式

## 建議後續

若要讓這些 HTTP 層能力真的對正式站生效，還需要滿足以下部署條件：

1. 在 GitHub repository secrets 中設定 `CLOUDFLARE_API_TOKEN` 與 `CLOUDFLARE_ACCOUNT_ID`
2. 確認 `blog.init.engineer` 所屬的 `init.engineer` zone 已由 Cloudflare 管理
3. 讓 `.github/workflows/deploy.yml` 在 `main` branch push 後成功執行 `wrangler deploy --env production`
4. 確認 `wrangler.toml` 的 production custom domain 設定已成功把 `blog.init.engineer` 綁到 Worker

若上述條件尚未完成，GitHub Pages 版本仍會正常提供靜態站內容，但 Link 標頭與 Markdown 協商只會停留在 repo 設定層，不會出現在正式站回應裡。

## 驗證方式

- 可執行 `npm run verify:agent-http:local`
- 這個腳本會先在本地啟動 Wrangler Worker，再檢查：
  - 首頁是否有 `Link` 回應標頭
  - `Link` 是否同時包含 `api-catalog` 與 `service-desc`
  - `Accept: text/markdown` 是否回傳 `text/markdown` 與 `x-markdown-tokens`
  - Markdown 回應是否包含 `Vary: Accept`
  - `robots.txt` 是否包含 `Content-Signal`
- 可執行 `npm run verify:agent-http`
- 這個腳本會直接檢查正式站：
  - 首頁是否有 `Link` 回應標頭
  - `Link` 是否同時包含 `api-catalog` 與 `service-desc`
  - `Accept: text/markdown` 是否回傳 `text/markdown` 與 `x-markdown-tokens`
  - Markdown 回應是否包含 `Vary: Accept`
  - `robots.txt` 是否包含 `Content-Signal`
