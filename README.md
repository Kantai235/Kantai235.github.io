# 我不會寫程式 — Kantai's Blog

**乾太 (Kantai)** 的個人網站與部落格，部署於 [blog.init.engineer](https://blog.init.engineer)。

內容涵蓋軟體工程技術筆記（Laravel、Android、Swift、ASP.NET 等），以及個人獸設 (Kemono) 的介紹與相關攝影、藝術委託紀錄。

## 技術堆疊

| 類別 | 說明 |
|------|------|
| 靜態網站產生器 | [Hugo](https://gohugo.io/) v0.148.2 (extended) |
| 佈景主題 | [Blowfish](https://blowfish.page/)（Git Submodule） |
| CSS 預處理 | [Dart Sass](https://sass-lang.com/dart-sass/) v1.90.0 |
| 自訂字型 | LINE Seed TW（繁體中文） |
| 程式碼檢查 | [ESLint](https://eslint.org/) v10 + [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) |
| 部署 | GitHub Actions → GitHub Pages |
| 自訂域名 | `blog.init.engineer` |

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
```

專案已整合 [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged)，
在每次 `git commit` 時會自動對暫存區的 `*.js` 檔案執行 ESLint 檢查與自動修復。
執行 `npm install` 後即自動啟用，無需額外設定。

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
- **圖片延遲載入** — 使用 Intersection Observer 實作，提升頁面載入效能
- **平滑捲動** — 錨點連結支援平滑捲動動畫
- **深色模式** — 支援自動切換與手動切換
- **影片背景** — 首頁與獸設頁面使用 MP4 動態背景

## 自訂 Hugo Shortcodes

| Shortcode | 用途 |
|-----------|------|
| `artwork-gallery` | 藝術創作圖庫展示 |
| `kemono-setup` | 獸設角色資料卡 |
| `kemono-interface` | 獸設互動介面元件 |
| `sticker-gallery` | 貼圖圖庫（Packery 排版） |
| `load-images` | 圖片延遲載入處理 |
| `social-links` | 社群媒體連結展示 |
| `qq-button` | QQ 按鈕元件 |

## 目錄結構

```
├── .claude/                 ← Claude Code AI 工具設定
├── .github/workflows/       ← GitHub Actions 建置與部署
├── .husky/                  ← Git Hooks（pre-commit 自動檢查）
├── archetypes/              ← Hugo 內容範本
├── assets/
│   ├── css/custom.css       ← 自訂樣式（字型、排版覆寫）
│   ├── img/                 ← 圖片與影片素材
│   └── js/                  ← 自訂 JavaScript（篩選器、語言偵測等）
├── config/_default/         ← Hugo 設定（網站參數、多語言、選單）
├── content/                 ← 網站內容（文章、頁面）
│   ├── posts/               ← 部落格文章
│   ├── kemono/              ← 獸設角色介紹
│   └── engineer/            ← 工程師簡介
├── data/                    ← 結構化資料（作者、社群連結、貼圖等）
├── layouts/                 ← 自訂版面覆寫（優先於主題）
│   ├── partials/            ← 覆寫主題的區塊模板
│   ├── shortcodes/          ← 自訂 Shortcodes
│   └── posts/               ← 文章列表自訂版面
├── static/                  ← 靜態資源（favicon、字型、CNAME）
├── themes/blowfish/         ← Blowfish 佈景主題（Submodule，勿直接修改）
├── CLAUDE.md                ← Claude Code 運作準則
├── GEMINI.md                ← Gemini AI 工具設定
├── eslint.config.js         ← ESLint 設定（Flat Config 格式）
└── package.json             ← npm 套件管理
```

## AI 工具整合

本專案將 AI 輔助開發的設定檔納入版本控制，確保協作一致性：

- **CLAUDE.md** — Claude Code 的運作準則與專案脈絡，定義語言規範、安全原則與 Hugo 協作守則
- **.claude/** — Claude Code 的專案層級設定
- **GEMINI.md** — Google Gemini 的專案指引

## 授權

網站內容與程式碼版權歸 **KantaiDeveloper** 所有。
