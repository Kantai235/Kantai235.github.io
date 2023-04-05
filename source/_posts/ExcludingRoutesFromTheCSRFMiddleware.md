---
cover: /img/posts/ExcludingRoutesFromTheCSRFMiddleware/banner.png
title: 在 Laravel 當中，如何移除特定 Router 的 CSRF？
description: Laravel 在默認的情況之下，所有的路由(Route)它會自動啟用 CSRF 保護，這在開發的過程當中，是一個非常方便的功能 ...
tags:
  - Laravel
  - CSRF
category:
  - 技術文件
  - Laravel 實務
abbrlink: 467cfb94
date: 2018-09-26 00:00:00
cover:
---

`Laravel` 在默認的情況之下，所有的路由(Route)它會自動啟用 `CSRF` 保護，這在開發的過程當中，是一個非常方便的功能。

但有時候，如果您在使用其他第三方服務時，你不需要設置 `Token` 的保護，那麼就產生了一個問題，如果第三方網站在訪問網站時，會發現網站告訴你該頁面已過期的訊息。

> The page has expired due to inactivity. 
> Please refresh and try again.

然而在 `Laravel 5.1` 開始，`app/Http/Middleware/VerifyCsrfToken` 提供了一個 `$except` 變數屬性，這個可以讓您自定義哪些路由可以忽略 `CSRF` 的保護，舉例來說：

`VerifyCsrfToken.php`
```php
...
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array
     */
    protected $except = [
        'example/*',
    ];
...
```

這樣子 `Laravel` 就會自動將你 `http://example.com/example/*` 的所有路由都忽略 `CSRF` 的保護了。