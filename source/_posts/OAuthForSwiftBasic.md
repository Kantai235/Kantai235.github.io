---
title: iOS Swift 第三方套件 - OAuthSwift
description: 在 iOS 開發介接第三方 API 相關的應用程式時，我們時常會需要遵循 OAuth 開放標準規範 ...
tags:
  - Swift
category:
  - 技術文件
  - iOS 實務
abbrlink: fbc45a3d
date: 2017-04-05 00:00:00
cover:
---

在 iOS 開發介接第三方 API 相關的應用程式時，我們時常會需要遵循 [OAuth 開放標準規範](https://zh.wikipedia.org/wiki/OAuth)，這過程十分繁雜，不過幸虧有大神寫出輕便使用的套件了，而且相容 OAuth 1.0、OAuth 2.0，那便是 [OAuthSwift](https://github.com/OAuthSwift/OAuthSwift)，注意哦！這邊是使用「Swift」語言，如果您是使用「Objective-C」開發 iOS 應用程式的話，你可能要採用另一位大神寫的 [OAuth2Client](https://github.com/nxtbgthng/OAuth2Client) 了。
<br /><br />
**以下範例我們以 [OAuthSwift](https://github.com/OAuthSwift/OAuthSwift) 作為範例。**
<br /><br />
首先我們必須在 iOS 應用程式的專案當中，引入 [OAuthSwift](https://github.com/OAuthSwift/OAuthSwift) 套件，引入的方式有兩種：

1. [CocoaPods](https://cocoapods.org/)
2. [Carthage](https://github.com/Carthage/Carthage)

這裡我們使用 [CocoaPods](https://cocoapods.org/) 做完教學使用，另外如果對於 [CocoaPods](https://cocoapods.org/)<br />
有興趣的話，教學可見 ＝> [CocoaPods iOS 第三方套件管理工具](https://kantai235.github.io/posts/CocoaPodsBasic/)<br />
<br />

引入 [CocoaPods](https://cocoapods.org/) 之後，我們接下來以介接「[Plurk API 2.0](https://www.plurk.com/API)」做完介接範例，我們必須先到 Plurk 註冊一個第三方手機或桌面應用程式的應用服務。<br />
=> [請到這裡註冊 Plurk 應用服務](https://www.plurk.com/PlurkApp/register)<br />
<br />

註冊完畢以後，我們可以多多善用 [Plurk API & OAuth test console for Developers](https://www.plurk.com/OAuth/test#/APP/Users/me) 噗浪 API 測試工具。<br />
=> [Plurk API & OAuth test console for Developers](https://www.plurk.com/OAuth/test#/APP/Users/me)
<br />
<br />
首先這邊介紹四種很重要的 "Key(金鑰)"<br />

1. App key => 用於驗證介接 API 端口的合法性，你可以理解為你「應用程式的帳號」
2. App secret => App key 的密鑰，你可以理解為你「應用程式的密碼」
3. Token => 令牌、通行證之類的，當然也有人解釋成紀念幣，不過你更應該把它理解為「使用者的令牌」
4. Token secret => Token 的密鑰，你可以理解為「使用者的密碼」

<br />
我們來試著獲取這四種很重要的金鑰吧！<br />
<br />
#### 1. 當你註冊完一款應用程式服務時，Plurk 會配發你一組 App key、App secret。
####     ↓  ↓  ↓
#### 2. 把這兩個輸入到測試工具當中相對應的欄位。
####     ↓  ↓  ↓
#### 3. 然後點選「Get Request Token」按鈕，這步驟是獲取「未授權」的 Token、Token secret。
####     ↓  ↓  ↓
#### 4. 再來點選「Open Authorization URL」按鈕，這步驟是開啟授權網址。
####     ↓  ↓  ↓
#### 5. 網頁會跳換至 Plurk 授權網頁，這裡是在詢問使用者是否以他的社群軟體身份，授權我們應用程式相關權限。
####     ↓  ↓  ↓
#### 6. 獲得授權時，Plruk Authorization URL 會賦予一個授權碼，這要先記下來。
####     ↓  ↓  ↓
#### 7. 最後點選「Get Access Token」按鈕，並輸入剛剛獲得的授權碼。
####     ↓  ↓  ↓
#### 8. 授權完畢以後，剛剛獲取的 Token、Token secret 就「已授權」了。
<br />

接下來你可以試著去獲取 Plurk API 相關的應用，我們先以「/APP/Users/me」為例子，直接按下「Invoke API」按鈕，就可以獲得自己的資料(JSON格式)。

![範例圖](/img/posts/5R2bxgk.png)

既然現在我們已經了解 OAuth 的運作概念了，那我們差不多該進入主題囉！該如何使用 OAuthSwift 呢？首先我們要思考到，我們會先請求使用者到 Plruk 網頁去認證，當使用者認證完畢後，網頁可能會做些什麼動作之類的，然後跳回我們的應用程式，那我們要開始思考，如何讓網頁能夠「呼叫應用程式」呢？
<br />

很直覺的，我們必須在我們的應用程式當中，設定一個「URL Schemes」網址呼叫方案，這可以讓瀏覽器呼叫某特別網址時，應用程式看到就知道說，這意思是在叫應用程式而不是網頁。

![呼叫應用程式](https://github.com/OAuthSwift/OAuthSwift/raw/master/Assets/URLSchemes.png)

設定完畢後，我們就要開始來撰寫程式邏輯了，在 Swift 當中，我們要先參考 OAuthSwift

```swift
import OAuthSwift
````

接著我們需要建立一個 Swift 物件，來幫我們完成 OAuth 相關事宜。

```swift
let _OAuthSwift : OAuth1Swift = OAuth1Swift(
    consumerKey:    "Your App key",
    consumerSecret: "Your App secret",
    requestTokenUrl: "http://www.plurk.com/OAuth/request_token",
    authorizeUrl:    "http://www.plurk.com/m/authorize",
    accessTokenUrl:  "http://www.plurk.com/OAuth/access_token"
)
```

再來使用者可能點個登入 Plurk 按鈕，就可以開啟瀏覽器登入 Plurk，並且授權我們的應用程式，這時候我們就要撰寫一個 function，執行這些事情：

```swift
_OAuthSwift.authorize(
    // URL 請賦予剛剛 URL Schemes 的 URL
    withCallbackURL: URL(string: "PlurkAPI://oauth-callback/plurk")!,
    
    // 如果授權成功
    success: { credential, response, parameters in
        // 賦予 OAuthSwfit 已授權的 Token
        _OAuthSwift.client.credential.oauthToken = credential.oauthToken
        NSLog("[Success] OAuth Token = \(credential.oauthToken)")
        
        // 賦予 OAuthSwfit 已授權的 Token secret
        _OAuthSwift.client.credential.oauthTokenSecret = credential.oauthTokenSecret
        NSLog("[Success] OAuth Token Secret = \(credential.oauthTokenSecret)")
    },

    // 如果授權失敗
    failure: { error in
        NSLog(error.localizedDescription)
    }
)
```

獲得使用者授權之後，我們接下來可以試著使用 OAuthSwift 囉！以下為基本規範：

```swift
let _ = _OAuthSwift.client.get(
    "Request URL，索取 Plurk API 的網址",
    parameters: [
        "Key" : "Value"
        // 這可以放些指定的參數
    ],
    success: { response in
        // 成功索取後的 function
        NSLog(response.string)
    },
    failure: { error in
        // 失敗後的 function
        NSLog(error.localizedDescription)
    }
)
```

那我們來點範例吧，我想要抓取使用者的資訊，也就是剛剛的「/APP/Users/me」的功能，那麼我們必須這樣寫：

```swift
let _ = _OAuthSwift.client.get(
    "http://www.plurk.com/APP/Users/me",
    success: { response in
        NSLog(response.string)
    },
    failure: { error in
        NSLog(error.localizedDescription)
    }
)
```

運行後，就可以在 Log 日誌當中看到使用者資料以 Json 格式的方式來回應囉！
