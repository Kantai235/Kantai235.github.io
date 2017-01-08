---
layout     : post
title      : "如何在 GitHub 中建造一個屬於自己的部落格。"
subtitle   : "單純第一篇文章而已。"
date       : 2017-01-07 01:30:00
author     : "乾太 ₍₍ ◝(･◡･)◟ ⁾⁾"
tags       : GitHub Blog Jekyll Hyde Disqus Rhadow.github.io
comments   : true
signature  : true
---

最近利用 [GitHub](https://github.com) 架設了一個靜態 Blog，感覺還挺酷炫的！你只需要有一個 [GitHub](https://github.com) 的帳號就可以了，其優點是免營運成本、無流量限制、無廣告，而且你可以客製自己的版型及功能，所以就把整個過程給記錄下來，分享給大家。

不過在這之前，你的電腦必須已經擁有 [Ruby](https://www.ruby-lang.org/zh_tw/) 這項軟體，以及 [RubyGems](https://rubygems.org) 這項 [Ruby](https://www.ruby-lang.org/zh_tw/) 套件管理的工具，如果沒有的話，就到他們的官方網站安裝一下吧！

這是一個利用 [Jekyll](https://jekyllrb.com) 去創建的部落格，所以我們必須先打開終端機，流程大概是：

```sh
# 1. 安裝 Jekyll
~ $ gem install jekyll bundler
# 2. 創造一個 Jekyll 專案
~ $ jekyll new '你的專案名稱'
```

到這邊為止，我們只是創造了一個空的部落格專案，接下來讓我們來看看這專案長什麼樣子吧！

```sh
# 3. 移動到 Jekyll 專案當中
~ $ cd '你的專案名稱'
# 4. 將專案 Compile 成 Blog 靜態網頁
~/你的專案名稱 $ jekyll build
# 5. 架設 Blog 服務
~/你的專案名稱 $ jekyll serve
# => Now browse to http://localhost:4000
```

就如註解所說的般，你現在可以前往 `http://localhost:4000` 看看，你會發現一個基礎的雛型已經出來了！不過好像還不夠完美，所以在網路上找到 [Hyde](https://github.com/poole/hyde) 這好東西，它是一款基於 [Jekyll](https://jekyllrb.com) 的基本板模，所以很多我們想得到的功能，基本上都沒有，所以我又參考到了兩篇很棒的文章：

[Jekyll x Github x Blog (Part 1)](https://rhadow.github.io/2015/02/18/Jekyll-x-Github-x-Blog-Part1/)
[Jekyll x Github x Blog (Part 2)](https://rhadow.github.io/2015/02/20/Jekyll-x-Github-x-Blog-Part2/)

當你整個部落格都撰寫完畢後，只需要把你的部落格 Push 到 GitHub 上就可以囉！

-- 這大概是一個東抄抄西抄抄沒營養的廢文吧 Orz --
