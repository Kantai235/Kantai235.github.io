# 我不會寫程式 — Kantai's Blog

**乾太 (Kantai)** 的個人網站與部落格，部署於 [blog.init.engineer](https://blog.init.engineer)。

內容涵蓋軟體工程技術筆記（Laravel、Android、Swift、ASP.NET 等），以及個人獸設 (Kemono) 的介紹與相關攝影、藝術委託紀錄。

## 技術堆疊

| 類別 | 說明 |
|------|------|
| 靜態網站產生器 | [Hugo](https://gohugo.io/) v0.148.2 (extended) |
| 佈景主題 | [Blowfish](https://blowfish.page/)（Git Submodule） |
| CSS 預處理 | [Dart Sass](https://sass-lang.com/dart-sass/) v1.90.0 |
| 自訂字型 | LINE Seed TW（WOFF2 + TTF fallback） |
| 程式碼檢查 | [ESLint](https://eslint.org/) v10 + [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) |
| 部署 | GitHub Actions → GitHub Pages（正式靜態站）+ Cloudflare Workers（Agent HTTP 補強） |
| 自訂域名 | `blog.init.engineer` |

## Agent Readiness

本站已補上基礎的代理人探索資源，包含：

- `robots.txt` 的 `Content-Signal`
- `/.well-known/api-catalog`
- `/.well-known/agent-skills/index.json`
- `/.well-known/agent-card.json`
- `/.well-known/mcp/server-card.json`
- `/.well-known/oauth-authorization-server`
- `/.well-known/oauth-protected-resource`
- `/api/site-metadata.json`
- `/api/status.json`
- `/openapi/site-discovery.yaml`
- `/.well-known/markdown/home.md`
- `/a2a`（A2A discovery-only 入口）
- 瀏覽器端 `WebMCP` 工具註冊

其中真正的 HTTP 層補強由 Cloudflare Worker 處理，包含：

- `Link` 回應標頭
- `service-desc` 指向 `/openapi/site-discovery.yaml`
- `Accept: text/markdown` 內容協商

專案內已提供以下設定與說明：

- `wrangler.toml` — Cloudflare Worker 與靜態資產部署設定
- `static/_headers` — 給支援靜態標頭規則的平臺使用
- `edge/agent-ready-proxy.mjs` — 實際處理 Link 標頭、Markdown 協商與 Content-Signal 的 Worker
- `docs/agent-readiness.md` — 補強項目、限制與後續建議

Cloudflare 部署採用 `wrangler --env production`，
由 `wrangler.toml` 的 `production` 環境將 `blog.init.engineer` 綁定為 custom domain。

## 本地開發指南（macOS）

### 前置安裝

使用 [Homebrew](https://brew.sh/) 安裝 Hugo 與 Dart Sass：

```bash
brew install hugo dart-sass
```

### 初次 Clone

Clone 專案後，拉取 Blowfish 佈景主題的 Submodule 並安裝 npm 開發套件：

```bash
git clone https://github.com/Kantai235/Kantai235.github.io.git
cd Kantai235.github.io
git submodule update --init --recursive
npm install
```

### 啟動本地伺服器

```bash
hugo server -D
```

加上 `-D` 參數會同時渲染草稿文章。預設會在 `http://localhost:1313/` 啟動即時預覽。

### 程式碼檢查

```bash
npm run lint          # 執行 ESLint 檢查
npm run lint:fix      # 自動修復可修正的問題
npm run build         # 建置正式站（使用正式網域 baseURL）
npm run deploy:cloudflare:dry-run  # 乾跑驗證 Worker / Wrangler 設定
npm run report:agent-http  # 產生正式站 Agent HTTP 驗證報告（Markdown）
npm run verify:agent-http:local  # 本地啟動 Worker 並驗證 Link / Markdown / Content-Signal
npm run verify:agent-http  # 直接檢查正式站的 Link / Markdown / Content-Signal
npm run verify:agent-http:retries  # 正式站帶重試驗證，失敗時自動輸出報告
```

其中 `npm run verify:agent-http` 目前會檢查：

- 以 `HEAD /` 檢查首頁是否具有 `Link` 回應標頭
- 是否同時包含 `rel="api-catalog"` 與 `rel="service-desc"`
- 以 `HEAD /` 搭配 `Accept: text/markdown` 檢查是否回傳 `text/markdown`
- 是否補上 `x-markdown-tokens` 與 `Vary: Accept`
- `robots.txt` 是否包含 `Content-Signal`

GitHub Actions 會依 Cloudflare deployment 能力分流：

- 若已提供 `CLOUDFLARE_API_TOKEN` 與 `CLOUDFLARE_ACCOUNT_ID`，會執行正式站硬性驗證 `verify-live-agent-http`
- 若尚未提供 Cloudflare secrets，會改為執行 `report-live-agent-http-blocked`，只產生報告與 warning，不讓 workflow 因不可能成立的前提而失敗

專案已整合 [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)，
在每次 `git commit` 時會自動對暫存區的 `*.js` 檔案執行 ESLint 檢查與自動修復。
執行 `npm install` 後即自動啟用，無需額外設定。

### 新增文章

```bash
hugo new posts/2024/01-15_my-article/index.zh-tw.md
```

Front Matter 格式規範請參閱 `docs/content-guide.md`。

## 多語言架構

本站支援四種語言，繁體中文為預設語言：

| 語言 | 設定檔 | 內容後綴 |
|------|--------|----------|
| 繁體中文（預設） | `languages.zh-tw.toml` | `_index.zh-tw.md` 或無後綴 |
| 簡體中文 | `languages.zh-cn.toml` | `_index.zh-cn.md` |
| English | `languages.en.toml` | `_index.en.md` |
| 日本語 | `languages.ja.toml` | `_index.ja.md` |

多語言設定檔位於 `config/_default/`，內容檔案以語言後綴區分，放置於 `content/` 對應目錄下。

## 主要功能特色

- **年份篩選器** — 文章列表頁支援依年份篩選，並提供鍵盤快捷鍵（`1`-`9` 選擇年份、`0` 全部、`Esc` 清除）
- **語言偵測提示** — 根據瀏覽器語系自動偵測，並顯示語言切換提示視窗
- **圖片延遲載入** — 使用 Intersection Observer 實作，支援 WebP 自動偵測與快取
- **站內搜尋** — 使用 Fuse.js 模糊搜尋，支援分類與年份篩選
- **平滑捲動** — 錨點連結支援平滑捲動動畫
- **深色模式** — 支援自動切換與手動切換
- **影片背景** — 首頁與獸設頁面使用 MP4 動態背景

## 自訂 Hugo Shortcodes

| Shortcode | 用途 |
|-----------|------|
| `artwork-gallery` | 藝術創作圖庫展示（Packery 瀑布流） |
| `kemono-setup` | 獸設角色資料初始化 |
| `kemono-interface` | 獸設互動介面（Tab 切換、漸進式載入） |
| `sticker-gallery` | 貼圖圖庫展示 |
| `social-links` | 社群媒體連結按鈕 |
| `load-images` | 圖片漸進式載入器 |
| `qq-button` | QQ 聯絡按鈕 |

完整參數說明請參閱 `docs/components.md`。

## 目錄結構

```
├── .claude/                 ← Claude Code AI 工具設定
├── .github/workflows/       ← GitHub Actions 建置與部署（含 ESLint 檢查）
├── .husky/                  ← Git Hooks（pre-commit 自動 lint）
├── archetypes/              ← Hugo 內容範本（含標準 Front Matter 模板）
├── assets/
│   ├── css/custom.css       ← 自訂樣式（字型、排版、社群按鈕）
│   ├── img/                 ← 圖片與影片素材
│   └── js/                  ← 自訂 JavaScript 模組
│       ├── year-filter.js   ← 年份篩選（雙容器架構）
│       ├── language-prompt.js ← 語言偵測提示
│       ├── lazy-loading.js  ← 圖片懶載入（含 WebP 快取）
│       ├── search.js        ← 站內搜尋（Fuse.js）
│       ├── smooth-scroll.js ← 平滑捲動
│       └── shortcodes/      ← Shortcode 專用腳本
├── config/_default/         ← Hugo 設定（含行內註解說明設計決策）
├── content/                 ← 網站內容（文章、頁面）
│   ├── posts/               ← 部落格文章（94 篇）
│   ├── kemono/              ← 獸設角色介紹
│   └── engineer/            ← 工程師簡介
├── data/                    ← 結構化資料
│   ├── kemono.json          ← 藝術作品集與創作者資訊
│   ├── social.json          ← 社群媒體連結
│   └── stickers.json        ← 貼圖系列（4 套共 122 張）
├── docs/                    ← 開發文件
│   ├── components.md        ← Shortcodes 與 Partials 參數參考
│   ├── data-schema.md       ← JSON 資料 TypeScript 型別定義
│   ├── content-guide.md     ← 文章 Front Matter 規範
│   ├── architecture.md      ← 核心功能設計決策
│   └── agent-readiness.md   ← Agent Readiness 補強紀錄與部署建議
├── edge/                    ← 邊緣層代理範本（Link 標頭 / Markdown 協商）
├── layouts/                 ← 自訂版面覆寫（優先於主題）
│   ├── partials/            ← 覆寫主題的區塊模板
│   │   └── helpers/         ← 共用工具 partial
│   ├── shortcodes/          ← 自訂 Shortcodes
│   └── posts/               ← 文章列表自訂版面
├── static/                  ← 靜態資源（favicon、字型、CNAME、.well-known、API 探索檔）
├── themes/blowfish/         ← Blowfish 佈景主題（Submodule，勿直接修改）
├── CLAUDE.md                ← Claude Code 運作準則與專案脈絡
├── GEMINI.md                ← Gemini AI 工具設定
├── eslint.config.js         ← ESLint 設定（Flat Config 格式）
├── package.json             ← npm 套件管理
└── wrangler.toml            ← Cloudflare Worker 設定
```

## AI 工具整合

本專案將 AI 輔助開發的設定檔納入版本控制，確保協作一致性：

- **CLAUDE.md** — Claude Code 的運作準則、Hugo 協作守則與專案脈絡（JS 模組、Shortcodes、資料結構、常見操作指引）
- **.claude/** — Claude Code 的專案層級設定
- **GEMINI.md** — Google Gemini 的專案指引

## 授權

網站內容與程式碼版權歸 **KantaiDeveloper** 所有。
