# 元件型錄 (Component Reference)

本文件列出專案中所有自訂 Hugo 短代碼（Shortcodes）與常用的自訂 Partials，
供開發者與 AI 代理快速查閱元件用途���參數與使用語法。

---

## Shortcodes（短代碼）

### artwork-gallery

藝術作品瀑布流圖庫。自動探索 `assets/img/kemono/{period}/` 下的作品資料，以 Packery 瀑布流佈局呈現。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `collection` | `string` | 是 | 集合路徑，格式為 `kemono.{period}.{type}`，例如 `kemono.after.artworks` |
| `class` | `string` | 否 | 自訂 CSS class，覆寫資料中預設的 class |

**collection 路徑說明：**
- `kemono.after.gallery` — 現在的設定：頭像（單張，不使用 Packery）
- `kemono.after.artworks` — 現在的設定：所有委託作品（瀑布流）
- `kemono.before.gallery` — 以前的設定：頭像
- `kemono.before.artworks` — 以前的設定：所有委託作品
- `kemono.fursuit.artworks` — 半套獸裝：所有照片

```markdown
{{</* artwork-gallery collection="kemono.after.artworks" class="grid-w50 md:grid-w33 xl:grid-w25" */>}}
{{</* artwork-gallery collection="kemono.after.gallery" class="mt-0 mb-0 rounded-lg shadow-lg" */>}}
```

---

### kemono-setup

Kemono 頁面的資料初始化。從 `assets/img/kemono/elements.json` 與各期間 `data.json` 讀取圖片路徑與創作者資訊，
注入至 `window.pageImages` 與 `window.creatorInfo` 全域物件，供前端腳本使用。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| （無參數） | — | — | 此短���碼不接受任何參數 |

```markdown
{{</* kemono-setup */>}}
```

**注意：** 必須在 `kemono-interface` 之前呼叫，確保資料先行載入。

---

### kemono-interface

Kemono 頁面的��動介面。管理標籤頁（Tab）切換、背景影片切換、
圖片漸進式載入、Packery 瀑布流初始化，以及創作者資訊提示（Toast）。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| （無參數） | — | — | 此短代碼不接受任何參數 |

```markdown
{{</* kemono-interface */>}}
```

**依賴：** 必須先呼叫 `kemono-setup` 完成資料初始化。

---

### load-images

通用圖片載入元件。將指定的圖片路徑透過 Hugo 資源管線處理後，
注入至 `window.pageImages` 全域物件，並提供 `preload()`、`get()`、`setImage()` 等工具方法。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `bgAfter` | `string` | 否 | 背景圖路徑（後）|
| `bgBefore` | `string` | 否 | 背景圖路徑（前）|
| `avatarAfter` | `string` | 否 | 頭像圖路徑（後）|
| `avatarBefore` | `string` | 否 | 頭像圖路徑（前）|
| （任意鍵值） | `string` | 否 | 所有傳入的參數都會成為 `window.pageImages` 的鍵值 |

```markdown
{{</* load-images bgAfter="img/kemono/after/background.jpg" bgBefore="img/kemono/before/background.jpg" */>}}
```

---

### social-links

社群媒體連結集合。從 `data/social.json` 讀取資料��以按鈕形式呈現各平台連結。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `mainTitle` | `string` | 否 | 主要連結區塊的標題（空字串則不顯示） |
| `othersTitle` | `string` | 否 | 其他連結區塊的標題（空字串則不顯示） |

```markdown
{{</* social-links mainTitle="主要聯絡方式" othersTitle="其他社群平台" */>}}
```

---

### qq-button

QQ ���絡按鈕。產生一個帶有 QQ 圖示的連結按鈕。

| 參數 | 型別 | 必填 | 預設值 | 說明 |
|------|------|------|--------|------|
| `qqNumber` | `string` | 否 | `"3023115954"` | QQ 號碼 |
| `qqUrl` | `string` | 否 | `"https://qm.qq.com/q/iGQiWSo1j2"` | QQ 連結 URL |
| `buttonText` | `string` | 否 | `"QQ {qqNumber}"` | 按鈕顯示文字 |

```markdown
{{</* qq-button qqNumber="12345678" buttonText="加我 QQ" */>}}
```

---

### sticker-gallery

貼圖展示圖庫。自動探索 `assets/img/kemono/*/stickers/*/data.json`，
以卡片式介面展示各系列縮圖、說明與下載連結，並支援點擊展開瀏覽所有貼圖。

| 參數 | 型別 | 必填 | 說明 |
|------|------|------|------|
| （無參數） | — | — | 此短代碼不接受任何參數 |

```markdown
{{</* sticker-gallery */>}}
```

---

## 常用自訂 Partials

以下為 `layouts/partials/` 中常被其他模板引用的自訂局部模板。

### partials/vendor.html

載入第三方函式庫。目前引入 jQuery（slim）與 Mermaid 圖表支援。
gallery.js 等自訂腳本依賴此 partial 提供的 jQuery 全域變數。

### partials/extend-head.html

擴展 `<head>` 區段，注入 RSS / JSON Feed 連結與額外的 SEO meta 標籤。
此 partial 由 Blowfish 主題自動引入，無需手動呼叫。

### partials/translations.html

多語言切換器 UI。偵測當前頁面的可用翻譯版本，��以下拉選單呈現切換選項。

### partials/home/background.html

首頁背景版面。支援 `.mp4` 動態背景影片��靜態圖片，含深色模式適配。

### partials/recent-articles/list.html 與 main.html

最新文章清單。強制從繁體中文站台抓取文章，確保多語言首頁顯示一致的內容。
`main.html` 負責「查看更多」連結的多語言 URL 生成。

### partials/schema.html

Schema.org 結構化資料（JSON-LD）輸出��針對首頁、文章頁等不同類型產生對應標記。
