---
name: post-discovery
description: 透過搜尋索引、文章列表與 sitemap 快速找到 blog.init.engineer 的技術文章。
---

# Post Discovery

## 何時使用

當你要在 `blog.init.engineer` 找技術文章、依主題縮小範圍，或從搜尋索引取得候選頁面時使用這個技能。

## 建議資料來源

- `/index.json`：Hugo 產生的搜尋索引，含 `title`、`summary`、`content`、`permalink`
- `/posts/`：文章列表頁
- `/sitemap.xml`：全站 URL 清單

## 搜尋策略

1. 先使用 `/index.json` 做關鍵字比對，優先查看 `title` 與 `summary`。
2. 若需要完整清單或驗證 canonical 路徑，再讀取 `/sitemap.xml`。
3. 若要給使用者可直接閱讀的入口，優先回傳文章 permalink，而不是只回傳索引資料。

## 路徑特徵

- 文章通常位於 `/posts/{slug}/`
- 預設語言文章使用無前綴網址
- 其他語言版本可能出現在 `/en/posts/{slug}/`、`/ja/posts/{slug}/`、`/zh-cn/posts/{slug}/`

## 注意事項

- 本站內容為公開唯讀，不提供文章寫入 API。
- 搜尋索引為靜態建置結果，應以實際文章頁內容為最終依據。
