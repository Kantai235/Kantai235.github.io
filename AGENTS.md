## 運作準則 (Operating Principles)

1. **嚴格遵守準則 (Strict Adherence)**
   最高優先級：本運作準則必須被嚴格執行。在每一個開發、修改網頁結構或撰寫內容的步驟中，請反覆確認是否符合所有規範。

2. **語言與用語規範 (Language Standards)**
   本專案的所有產出——包含網頁內容、文件、Git Commit Message、程式碼註解 (Code Comments) 必須統一使用**繁體中文 (台灣用語)**。
   **用語強制規範**：必須使用「專案、介面、快取、資料庫、變數、記憶體、伺服器、字串、陣列、執行緒、程式碼」，嚴禁使用「項目、接口、緩存、數據庫、變量、內存、服務器、字符串、數組、線程、代碼」等中國用語。

3. **安全與非破壞性原則 (Safety & Non-Destructive)**
   絕對避免破壞性變更。嚴禁隨意刪除既有的靜態資源 (圖片、CSS、JS)、內容檔案 (如 Markdown) 或覆寫 `.github/workflows/` 中的部署設定檔。若需進行大規模樣式重構或刪除舊有內容，必須先列出 Step-by-step 計畫並向使用者確認。

4. **靜態網站邊界嚴守 (Static Site Boundaries)**
   本專案為 GitHub Pages 靜態網站，無後端伺服器運行。所有邏輯必須能在瀏覽器端執行（純 HTML、CSS、JavaScript，或依賴靜態網站產生器的編譯結果）。請優先考量網頁載入速度、行動裝置適應性 (RWD) 與 SEO 語意化標籤。

5. **小規模驗證與模組化 (Small-scale Verification)**
   在修改全域樣式 (Global CSS) 或核心版面 (Layout) 時，應先在單一頁面或元件進行小規模驗證。確認顯示正常且無跑版後，再套用至全站。盡可能保持 CSS/JS 的模組化與簡潔。

6. **全盤檢視與文件同步 (Context & Documentation)**
   每次修改前，必須檢視相關版面與資料流。新增套件、更動建置流程或修改部署設定後，必須將變更同步更新到 `README.md`，保持單一事實來源。

7. **準則鎖定 (Principle Locking)**
   本文件的「運作準則」不允許被 AI 自行刪改，僅能由使用者發起變更。

## Hugo 與 Blowfish 協作守則

1. **覆寫原則 (Override Rules)**
   絕對不要直接修改 `themes/blowfish/`（Submodule）內的任何檔案。所有的樣式修改請集中於 `assets/css/custom.css`；所有版面或邏輯的覆寫，必須在專案根目錄的 `layouts/` 建立與主題相同路徑的同名檔案來覆蓋，Hugo 會自動優先載入專案層級的模板。

2. **多語言內容維護**
   新增或修改內容時，必須注意檔名的語言後綴（例如 `_index.ja.md`、`_index.en.md`、`_index.zh-cn.md`）。各語言版本的 Front Matter 參數（如 `title`、`description`、`tags`、`categories`）必須維持一致的結構，僅翻譯對應的文字內容。

## 專案脈絡 (Project Context)

### 內容結構

- **`content/posts/`** — 部落格文章（94 篇，橫跨 2017-2023），主題包含 Laravel、PHP 設計模式、技術指標、工具開發
- **`content/kemono/`** — 獸設（Kemono）角色介紹頁，含藝術委託作品展示
- **`content/engineer/`** — 工程師個人簡介頁

### 核心 JavaScript 模組

| 檔案 | 用途 |
|------|------|
| `assets/js/year-filter.js` | 文章列表的年份篩選（雙容器模式，避免與 Hugo 分頁衝突） |
| `assets/js/language-prompt.js` | 多語言切換提示（偵測瀏覽器語言，彈出切換建議） |
| `assets/js/lazy-loading.js` | 圖片懶載入（IntersectionObserver + WebP 偵測） |
| `assets/js/smooth-scroll.js` | 錨點平滑捲動 |
| `assets/js/search.js` | 站內搜尋（Fuse.js 模糊搜尋 + 分類/年份篩選） |
| `assets/js/shortcodes/gallery.js` | Packery 瀑布流圖庫初始化 |

### 自訂 Shortcodes

| Shortcode | 用途 | 資料來源 |
|-----------|------|----------|
| `artwork-gallery` | 藝術作品瀑布流展示 | `assets/img/kemono/{period}/artworks/*/data.json`（自動探索） |
| `kemono-setup` | 獸設頁面資料初始化 | `assets/img/kemono/elements.json`、`assets/img/kemono/*/data.json` |
| `kemono-interface` | 獸設頁面 Tab 切換與互動 | 依賴 `kemono-setup` |
| `sticker-gallery` | 貼圖集展示 | `assets/img/kemono/*/stickers/*/data.json`（自動探索） |
| `social-links` | 社群媒體連結按鈕 | `data/social.json` |
| `load-images` | 圖片漸進式載入器 | 參數傳入 |
| `qq-button` | QQ 聯絡按鈕 | 參數傳入 |

### 資料檔案

| 檔案 | 用途 |
|------|------|
| `assets/img/kemono/elements.json` | 獸設背景媒體對應 |
| `assets/img/kemono/{period}/data.json` | 各期間獸設 metadata（title、avatar） |
| `assets/img/kemono/{period}/artworks/*/data.json` | 每件委託作品的 alt 與 creator 資訊 |
| `assets/img/kemono/*/stickers/*/data.json` | 貼圖系列 metadata（title、creator、platforms） |
| `data/social.json` | 社群媒體連結（平台名稱、URL、圖示） |

### 自訂 Partials

| Partial | 用途 |
|---------|------|
| `helpers/get-default-pages.html` | 共用：從預設語言站台取得文章（避免多語言空頁問題） |
| `extend-head.html` | 擴展 `<head>`：RSS/JSON Feed、SEO meta、JS 載入 |
| `hero/thumbAndBackground.html` | 文章 Hero 圖：縮圖 + 背景疊加 |
| `home/background.html` | 首頁全螢幕背景（支援 MP4 影片） |
| `recent-articles/list.html` | 最近文章清單（多語言一致性） |
| `schema.html` | Schema.org JSON-LD 結構化資料 |

### 常見維護操作

#### 新增文章
```bash
hugo new posts/{年份}/{月-日}_{slug}/index.zh-tw.md
```
按照 `docs/content-guide.md` 的 Front Matter 模板填寫。

#### 新增語言版本
1. 建立 `config/_default/languages.{lang}.toml` 與 `menus.{lang}.toml`
2. 為 `content/` 下的 `_index` 檔案新增對應的語言後綴版本
3. 更新 `assets/js/language-prompt.js` 的 `languageMapping` 對映表

#### 新增藝術委託作品
1. 將圖片放入 `assets/img/kemono/{period}/` 目錄
2. 在 `data/kemono.json` 的對應 `artworks` 陣列新增項目
3. 確保包含 `id`、`class`、`alt`、`src`、`creator` 欄位

### 詳細文件索引

- `docs/components.md` — Shortcodes 與 Partials 完整參數參考
- `docs/data-schema.md` — JSON 資料檔案的 TypeScript 型別定義
- `docs/content-guide.md` — 文章 Front Matter 規範與命名慣例
- `docs/architecture.md` — 核心功能的設計決策與運作流程
