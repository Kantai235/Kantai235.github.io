# 架構設計文件 (Architecture)

本文件記錄專案中核心功能的設計決策與運作流程，
供開發者與 AI 工具理解各模組的互動關係。

---

## 年份篩選器（雙容器架構）

**相關檔案：** `assets/js/year-filter.js`、`layouts/posts/list.html`

### 問題背景

Hugo 的分頁（Pagination）與前端篩選天生衝突——分頁只顯示部分文章，
但篩選需要存取所有文章。若直接在分頁結果上篩選，會遺漏其他頁面的文章。

### 解決方案：雙容器模式

頁面同時渲染兩組文章容器：

```
┌─ #articles-container（分頁模式，預設顯示）──────────┐
│  Hugo .Paginate 產生的文章，附帶分頁器               │
└────────────────────────────────────────────────────┘

┌─ #all-articles-container（篩選模式，預設隱藏）───────┐
│  所有文章的完整清單，不經 Paginate                    │
└────────────────────────────────────────────────────┘
```

- 使用者點擊年份按鈕 → 隱藏分頁容器、顯示全文章容器，對後者做 DOM 篩選
- 使用者點擊「全部」→ 回到分頁容器，恢復 Hugo 原生分頁

### 鍵盤快捷鍵

| 按鍵 | 功能 |
|------|------|
| `1`-`9` | 對應年份篩選按鈕 |
| `0` | 顯示全部 |
| `Esc` | 清除篩選 |

### 全域 API

```javascript
window.yearFilter.filterByYear('2023')  // 篩選指定年份
window.yearFilter.clearFilter()          // 清除篩選
window.yearFilter.isFiltering()          // 是否正在篩選中
```

---

## 語言偵測提示

**相關檔案：** `assets/js/language-prompt.js`

### 運作流程

```
1. 偵測瀏覽器語言（navigator.language）
2. 對映至本站支援的四種語言（zh-tw / zh-cn / en / ja）
3. 比對當前頁面語言（從 URL 路徑解析）
4. 若不同且未被關閉（localStorage 紀錄 30 天）→ 延遲 500ms 顯示提示
5. 使用者選擇切換或關閉
```

### URL 語言前綴規則

- 繁體中文（預設）：無前綴，例如 `/posts/my-article/`
- 其他語言：`/{lang}/posts/my-article/`，例如 `/en/posts/my-article/`

---

## Packery 瀑布流佈局

**相關檔案：** `assets/js/shortcodes/gallery.js`、`layouts/shortcodes/artwork-gallery.html`

### 概述

使用 [Packery](https://packery.metafizzy.co/) 函式庫實現圖片瀑布流佈局，
主要用於獸設頁面的藝術作品展示。

### 資料流

```
assets/img/kemono/{period}/artworks/*/data.json → artwork-gallery shortcode → Packery 初始化
                                              ↓
                                   gallery.js（window.load 事件後執行）
```

### 設定方式

透過 HTML `data-*` 屬性自訂 Packery 參數：

| data 屬性 | 對應參數 | 預設值 |
|-----------|---------|--------|
| `data-packery-gutter` | `gutter` | `5` |
| `data-packery-percent-position` | `percentPosition` | `true` |
| `data-packery-resize` | `resize` | `true` |

---

## 多語言頁面共用 Partial

**相關檔案：** `layouts/partials/helpers/get-default-pages.html`

### 問題背景

本站的文章僅以繁體中文撰寫，但多語言版本的首頁與列表頁也需要顯示文章。
若直接使用 `.Site.RegularPages` 會抓到當前語言的空頁面。

### 解決方案

`get-default-pages.html` 共用 partial 統一從 zh-tw 站台取得文章：

```go-html-template
{{ $pages := partial "helpers/get-default-pages.html" . }}
```

此 partial 被以下模板引用：
- `layouts/posts/list.html`（文章列表）
- `layouts/partials/recent-articles/list.html`（最近文章）

---

## 圖片漸進式載入

**相關檔案：** `layouts/shortcodes/kemono-setup.html`、`layouts/shortcodes/kemono-interface.html`

### 載入策略

獸設頁面的圖片依優先順序分批載入，降低首次載入時間：

```
第 1 批（立即）：背景圖片
第 2 批（100ms 後）：當前 Tab 的頭像
第 3 批（使用者互動後）：其他所有圖片
                       └─ 5 秒無互動則自動載入
```

### 全域物件

- `window.pageImages` — 所有圖片路徑與載入工具方法（由 `kemono-setup` 注入）
- `window.creatorInfo` — 創作者資訊對映表（由 `kemono-setup` 注入）
- `window.forcePackeryReset()` — 手動觸發 Packery 重新計算（除錯用）

---

## CI/CD 流程

**相關檔案：** `.github/workflows/deploy.yml`

### 建置流程

```
push to main → Checkout → Setup (Go, Node.js, Dart Sass, Hugo)
             → npm ci → ESLint 檢查 → Hugo 建置 (--gc --minify)
             → 上傳 artifact → 部署至 GitHub Pages
```

### 快取策略

Hugo 建置快取使用內容檔案的 hash 作為 key，
當 `content/`、`config/`、`assets/`、`layouts/` 目錄有變更時自動失效。
