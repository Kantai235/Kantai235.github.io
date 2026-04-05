# 我不會寫程式 — Kantai's Blog

**乾太 (Kantai)** 的個人網站與部落格，部署於 [blog.init.engineer](https://blog.init.engineer)。

內容涵蓋軟體工程技術筆記（Laravel、Android、Swift、ASP.NET 等），以及個人獸設 (Kemono) 的介紹與相關攝影、藝術委託紀錄。

## 技術堆疊

| 項目 | 說明 |
|------|------|
| 靜態網站產生器 | [Hugo](https://gohugo.io/) (extended) |
| 佈景主題 | [Blowfish](https://blowfish.page/)（Git Submodule） |
| CSS 預處理 | [Dart Sass](https://sass-lang.com/dart-sass/) |
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

## 目錄結構

```
├── .github/workflows/   ← GitHub Actions 建置與部署
├── assets/
│   ├── css/             ← 自訂樣式（custom.css）
│   ├── img/             ← 圖片與影片素材
│   └── js/              ← 自訂 JavaScript
├── config/_default/     ← Hugo 設定（網站參數、多語言、選單）
├── content/             ← 網站內容（文章、頁面）
├── data/                ← 結構化資料（作者、社群連結等）
├── layouts/             ← 自訂版面覆寫（優先於主題）
├── static/              ← 靜態資源（favicon、字型、robots.txt）
└── themes/blowfish/     ← Blowfish 佈景主題（Submodule，勿直接修改）
```

## 授權

網站內容與程式碼版權歸 **KantaiDeveloper** 所有。
