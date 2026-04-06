# 內容撰寫指南 (Content Guide)

本文件定義文章 Front Matter 的標準格式、命名規範與多語言維護準則，
確保新舊文章之間的一致性。

---

## Front Matter 標準模板

所有文章應遵循以下 Front Matter 格式（TOML）：

```toml
+++
title = '文章標題'
slug = 'article-slug'
description = '文章的簡短描述，用於 SEO 與社群分享預覽'
summary = '文章摘要，顯示在列表頁'
date = 2024-01-15T00:00:00+08:00
lastmod = 2024-01-15T00:00:00+08:00
draft = false
categories = ['分類名稱']
tags = ['標籤1', '標籤2']
series = ['系列名稱']
+++
```

### 欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `title` | 是 | 文章標題，顯示於頁面標題與列表 |
| `slug` | 是 | URL 友善名稱，僅使用英文小寫、數字與連字號 |
| `description` | 是 | SEO 用描述，建議 50-160 字元 |
| `summary` | 否 | 列表頁顯示的摘要，若省略則使用 `description` |
| `date` | 是 | 發佈日期，格式 `YYYY-MM-DDT00:00:00+08:00`（台灣時區） |
| `lastmod` | 否 | 最後修改日期，格式同 `date` |
| `draft` | 是 | 是否為草稿，正式文章設為 `false` |
| `categories` | 是 | 分類陣列，如 `['PHP', 'Laravel']` |
| `tags` | 是 | 標籤陣列 |
| `series` | 否 | 系列文章名稱，如 `['PHP 設計模式']` |

### 不建議使用的欄位

- **`keywords`** — 與 `tags` 功能重複，已不建議使用

---

## 日期格式規範

統一使用不帶引號的 ISO 8601 格式，明確指定台灣時區：

```toml
# 正確
date = 2024-01-15T00:00:00+08:00

# 不建議（帶引號）
date = '2024-01-15T00:00:00+08:00'
```

---

## 文章目錄命名規範

```
content/posts/{年份}/{月-日}_{slug}/
├── index.zh-tw.md      ← 繁體中文（預設）
├── index.en.md          ← 英文
├── index.ja.md          ← 日文
├── index.zh-cn.md       ← 簡體中文
└── feature.jpg          ← 特色圖片（選填）
```

### 命名規則

- 年份目錄：`2024/`
- 文章目錄：`{月-日}_{slug}/`，例如 `01-15_my-article/`
- slug 僅使用英文小寫、數字與連字號

---

## 多語言維護

新增或修改文章時：

1. **結構一致**：所有語言版本的 Front Matter 欄位必須相同（`title`、`description`、`tags`、`categories`）
2. **僅翻譯文字**：`slug`、`date`、`draft` 等非文字欄位在各語言版本中保持相同
3. **語言後綴**：繁體中文使用 `.zh-tw.md`（或無後綴），其他語言分別為 `.en.md`、`.ja.md`、`.zh-cn.md`

---

## 特色圖片

- 支援的檔名：`feature.*`、`cover.*`、`thumbnail.*`
- 建議尺寸：1200x630px（符合 Open Graph 預覽比例）
- Hugo 會自動從文章目錄中偵測並使用
