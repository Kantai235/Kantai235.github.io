---
title: 我的 GitHub 部落格收到了 warning 信件，這是怎麼回事？
description: >-
  今天在整理 Blog 的時候收到一封信，內容大致上是這樣：[Kantai235/Kantai235.github.io] Page build
  warning ...
tags:
  - GitHub Pages
category:
  - 經驗分享
abbrlink: 4f4004c2
date: 2018-09-08 00:00:00
cover:
---

今天在整理 Blog 的時候收到一封信，內容大致上是這樣：

- [Kantai235/Kantai235.github.io] Page build warning

```
The page build completed successfully, but returned the following warning for the `master` branch:

You are currently using the 'redcarpet' Markdown engine, which is no longer supported by GitHub Pages and may cease working at any time. To ensure your site continues to build, remove the 'markdown' setting in your site's '_config.yml' file and confirm your site renders as expected. For more information, see https://help.github.com/articles/updating-your-markdown-processor-to-kramdown/.

For information on troubleshooting Jekyll see:

  https://help.github.com/articles/troubleshooting-jekyll-builds

If you have any questions you can contact us by replying to this email.
```

大致上是在說你的 `_config` 引用了過期的套件(redcarpet)，GitHub Page 已經不支援這東西了，請你改引用 `kramdown`。

所以我們只要打開 `_config.yml` 這份設定檔文件，尋找 `markdown:` 的設定，並且將 `redcarpet` 更改為 `kramdown` 就可以解決問題了。
