---
layout       : post
image        : /assets/img/banner/LaravelUseRedisToHandleHighConcurrency.png
title        : Laravel 用 Redis 處理高併發問題
description  : 
date         : 2020-10-16 12:00:00
author       : kantai235
tags         :
- Laravel
- 高併發
- Redis
paginate     : true
category     : tutorial
---

高併發(High Concurrency)指的是系統在短時間內遭遇高請求、高流量的情形，舉例來說像是學生搶課、拍賣網站搶 1 元 iPhone ... 之類的，使用者會在短時間內集體做同一件事，系統無法負荷突如其來的請求、流量，因此而導致系統崩潰。

為了模擬簡易的高併發情況，這邊假設有一個 API 的行為是簽到點名，幫誰簽到不重要，系統簽到時會自動安插一段亂數字串並寫入資料庫，

```
素還太：「你們這般高併發若不解決」
素還太：「學員無法上課！」
素還太：「素還太開掛！」
素還太：「素還太大開掛！」

（素還太一聲吆喝）
（API 瘦身）
（架起 Redis）
（增加 Processe）
（排程丟 Worker）

高併發：「啊 ... 恨啊 ...」
高併發：「上天對我晚生太不公平啦！」

素還太：「天意啊 ...」
素還太：「今天你注該命喪六角平台」
素還太：「怒火燒盡九重天！」

高併發：「我恨啊－」

素還太：「吾又開掛 ...」
素還太：「為什麼要逼我忍無可忍呢 ...」
素還太：「該犧牲的人是我 ...」
素還太：「該死的人是素還太 ...」
```
