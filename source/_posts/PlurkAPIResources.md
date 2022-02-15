---
cover :
title : Plurk API 官方說明文件 - 簡介
description : Plurk API 2.0 遵循 OAuth 1.0a 開放標準來保護使用者的隱私 ...
date : 2017-04-14
tags :
  - Plurk API
category :
  - 文件翻譯
  - Plurk API Docs
---

#### ***＊ 本文章為個人翻譯，故正式內容以 Plurk 官方為主 ＊***
#### ***＊ 原文請參照 https://www.plurk.com/API#toc ＊***

<br />

![Plurk API 2.0](https://s.plurk.com/23a9a0002c021cb9169293e4347c05e3.png)

# Plurk API 2.0

[Plurk API 2.0](https://www.plurk.com/API#toc) 是遵循 [OAuth 1.0a](https://oauth.net/core/1.0a/) 開放標準來保護使用者的隱私安全，它提供應用程式在 [Plurk](https://www.plurk.com) 平台上訪問和簽證等等的標準方式，應用程式可以讀取使用者的河道、發表噗文，並且基於使用者的利益，不會保留使用者的密碼，所以鼓勵所有希望訪問使用者資訊的應用程式盡快轉移到 [Plurk API 2.0](https://www.plurk.com/API#toc) [OAuth](https://zh.wikipedia.org/wiki/OAuth)。

> 附註說明：[OAuth（開放授權）是一個開放標準，允許用戶讓第三方應用存取該用戶在某一網站上儲存的私密的資源（如相片，影片，聯絡人列表），而無需將使用者名稱和密碼提供給第三方應用。](https://zh.wikipedia.org/wiki/OAuth)

[立即註冊](https://www.plurk.com/PlurkApp/register)自己的 Plurk 應用程式！或者在[這裡](https://www.plurk.com/PlurkApp/)管理您創建的 Plurk 應用程式。

[Plurk API 2.0](https://www.plurk.com/API#toc) 與我們原先基於 [session-based](http://fred-zone.blogspot.tw/2014/01/web-session.html) [Plurk API 1.0](https://www.plurk.com/API/1.0/) 之間的差異：

1. [Plurk API 2.0](https://www.plurk.com/API#toc) 是無狀態的(不需要登入使用者帳號)，而原先 [Plurk API 1.0](https://www.plurk.com/API/1.0/) 是基於 [session-based](http://fred-zone.blogspot.tw/2014/01/web-session.html) 的。
2. [Plurk API 2.0](https://www.plurk.com/API#toc) URL 前綴，帶有 https://www.plurk.com/APP/ ，而不是原先的 https://www.plurk.com/API/ 。
3. [Plurk API 2.0](https://www.plurk.com/API#toc) 的請求必須遵循 [OAuth Core 1.0a](https://oauth.net/core/1.0a/) 標準規範來進行簽章。
4. 輸出與輸出的參數與原先 [Plurk API 1.0](https://www.plurk.com/API/1.0/) 相同，但 [Plurk API 2.0](https://www.plurk.com/API#toc) 不需要「api_key」。

在使用 API 之前，[Plurk API 2.0](https://www.plurk.com/API#toc) 應用程式必須遵循 [OAuth](https://zh.wikipedia.org/wiki/OAuth) 的開放標準來獲得使用者的 Token。大多數的 API 使用 Three-Legged OAuth，它需要透過使用者金鑰/密鑰和 Token 金鑰/密鑰來簽證請求。然而有一些 API 還支持 Two-Legged OAuth，該請求可以使用應用程式金鑰/密鑰進行簽證。

> 附註說明：Three-Legged OAuth，意指用戶授權過程當中涉及三種角色，分別為 應用程式(Application)、服務提供者(Service Provider)、使用者(User)
> ![Three-Legged OAuth](http://puu.sh/2pJ4y.png)

> 附註說明：Two-Legged OAuth，則是授權過程只涉及兩種角色，分別為 應用程式(Application)、服務提供者(Service Provider)
> ![Two-Legged OAuth](http://puu.sh/2peUI.png)

如果您是機器人的開發人員或單獨只是給自己玩的使用者，則可以使用我們的 [測試控制台](https://www.plurk.com/OAuth/test) 獲取您自己的永久 Token，您不需要撰寫程式碼來獲取 Token。

[Plurk API 2.0](https://www.plurk.com/API#toc) 的資料返回是 [JSON](http://www.json.org) 文字格式，所以您應該使用 [JSON](http://www.json.org) 套件來解碼返回的資料。

# 相關資源

### 工具：

+ [Plurk OAuth 測試控制台](https://www.plurk.com/OAuth/test)
+ 開發人員可以查詢自己創立的應用程式 => [我開發的應用服務](https://www.plurk.com/PlurkApp/)
+ 使用者可以查詢自己授權的應用程式 => [授權的應用服務](https://www.plurk.com/APP/)
+ 關注相關的新聞和更新訊息 => [@plurkapi](https://www.plurk.com/plurkapi)
+ 回報臭蟲 Bug => [api@plurk.com](mailto:api@plurk.com)

### Plurk API 2.0 套件：

+ Python => [plurk-oauth](https://github.com/clsung/plurk-oauth) 作者 clsung
+ PHP => [plurkoauth](https://github.com/clsung/plurkoauth) 作者 clsung
+ Perl => [Net::Plurk](https://github.com/clsung/net-plurk) 作者 clsung
+ Java => [JPlurk-OAuth](https://github.com/qrtt1/jplurk-oauth/wiki) 作者 qrtt1
+ Ruby => [PlurkOAuth](https://github.com/rascov/PlurkOAuth) 作者 rascov
+ Lua => [LuaPlurk](https://github.com/ykhuang/LuaPlurk) 作者 ykhuang
+ JavaScript => [plurkjs](https://github.com/clsung/plurkjs) 作者 clsung
+ C# => [rsPlurkLib](https://github.com/rschiang/rsPlurkLib) 作者 rschiang
+ Go => [plurgo](https://github.com/clsung/plurgo) 作者 clsung

### OAuth 套件：

+ Python => [python-oauth2](https://github.com/joestump/python-oauth2)
+ PHP => [oauth-php](https://code.google.com/archive/p/oauth-php/)
+ Perl => [Net::OAuth](http://search.cpan.org/dist/Net-OAuth/)
+ Lua => [LuaOAuth](https://github.com/ignacio/LuaOAuth)
+ 其他的 OAuth 套件 => [http://oauth.net/code/](http://oauth.net/code/)

# OAuth 的流程及服務端口

一般來說，應用程式必須透過以下步驟，才能獲取使用者的 Token。

1. 在[這裡](https://www.plurk.com/PlurkApp/register)註冊獲取 Plurk 應用程式金鑰/密鑰(OAuth 應用程式金鑰/密鑰)
2. 請求臨時 Token (OAuth 回應 Token)
3. 將使用者導向到 Plurk 以授權權限
4. 在回應當中接收 OAuth 驗證
5. 請求永久使用者 Token (OAuth 使用者 Token)

獲取使用者的 Token 金鑰/密鑰後，應用程式就可以開始簽署請求，以使用任何 Plurk API 2.0 的功能。

### Plurk OAuth 的服務端口：

1. 獲取請求 Token => https://www.plurk.com/OAuth/request_token (HTTPS GET/POST)
2. 授權頁面(網頁) => https://www.plurk.com/OAuth/authorize
3. 授權頁面(手機) => https://www.plurk.com/m/authorize
4. 請求使用者 Token => https://www.plurk.com/OAuth/access_token (HTTPS GET/POST)

### 支持多種設備

您還可以將可選參數 "deviceid(裝置)" 傳遞給授權頁面，從而使您的應用程式能夠使用相同的 Plurk 帳號安裝在多個設備上。倘若以前使用過相同 "deviceid(裝置)" 登入應用服務，將會把以前的 Token 覆蓋掉。另外還可以傳遞另一個可選參數 "model"，以便有意義的 model 名稱來識別使用者的裝置。例如：

```url
https://www.plurk.com/OAuth/authorize?oauth_token=ReqKMrVIjOLI&deviceid=efa9183a839f421821dc5c&model=Apple+iPhone+4S
```

"deviceid" 的最大長度為 32 個字符，默認值為空("")，您應該使用唯一的 ID (例如 UUID)來識別使用者的裝置，例如："ab21862c272bbd703ef9d5b35458b78d"，該 model 名稱或 "deviceid" 將顯示在使用者的 [我授權的 Plurk 應用服務](https://www.plurk.com/APP) 頁面中，使用有意義的裝置名稱可以幫助使用者輕鬆識別他的授權裝置。

> 附註說明：[通用唯一識別碼(英語：Universally Unique Identifier，簡稱 UUID)](https://zh.wikipedia.org/wiki/通用唯一识别码)

![我授權的 Plurk 應用服務 Demo](https://images.plurk.com/4c31662a172aad703ef9d5535458b77f.jpg)

# Plurk OAuth 規範

+ 簽證方法是遵循 HMAC-SHA1。([?](https://oauth.net/core/1.0a/#anchor15))
+ 請在 HTTP 授權標頭當中傳遞 OAuth 參數。([?](https://oauth.net/core/1.0a/#anchor15))
+ 對於每個 [ 時間戳記 + 隨機值 ] 的請求，都應該是唯一的，而時間戳記應該是非常接近當前時間。([?](https://oauth.net/core/1.0a/#anchor15))
+ 在請求臨時 Token 之後，使用者必須在 30 分鐘內授權請求，Plurk App 必須在 60 分鐘以內獲得永久 Token。
+ 可以傳遞 [Plurk API 2.0](https://www.plurk.com/API#toc) 參數：GET (類似於 [Plurk API 1.0](https://www.plurk.com/API/1.0/)) 或 POST (推薦)。

# Plurk OAuth 資料流

![資料流](https://s.plurk.com/dfff32d09f129743ec7dc4d72a37b802.png)