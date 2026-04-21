---
name: site-navigation
description: 探索 blog.init.engineer 的主要區段、語言版本與機器可讀入口。
---

# Site Navigation

## 何時使用

當你需要快速理解 `blog.init.engineer` 的主要內容結構、語言版本或代理人探索入口時使用這個技能。

## 站點區段

- `/`：首頁
- `/posts/`：技術文章列表
- `/search/`：站內搜尋
- `/engineer/`：工程師簡介
- `/kemono/`：獸設與藝術委託展示

## 多語言規則

- 預設語言為繁體中文（`zh-tw`），通常不加語言前綴。
- `English` 頁面通常位於 `/en/`
- `日本語` 頁面通常位於 `/ja/`
- `简体中文` 頁面通常位於 `/zh-cn/`

## 代理人探索入口

- API Catalog：`/.well-known/api-catalog`
- Agent Skills 索引：`/.well-known/agent-skills/index.json`
- 站點中介資料：`/api/site-metadata.json`
- 首頁 Markdown 備援：`/.well-known/markdown/home.md`

## 使用建議

1. 先讀取 `/api/site-metadata.json` 取得 discovery 入口與語言資訊。
2. 若要理解可用技能，讀取 `/.well-known/agent-skills/index.json`。
3. 若需要文字版首頁摘要，可直接讀取 `/.well-known/markdown/home.md`。
