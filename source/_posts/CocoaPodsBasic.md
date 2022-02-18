---
title: CocoaPods iOS 第三方套件管理工具
description: 當我們在開發 iOS 應用程式的時候，時常會為了完成某些功能，而開始尋找有沒有人已經寫了相關套件來解決問題 ...
tags:
  - CocoaPods
category:
  - 技術文件
  - iOS 實務
abbrlink: 7f441f9e
date: 2017-04-08 00:00:00
cover:
---

當我們在開發 iOS 應用程式的時候，時常會為了完成某些功能，而開始尋找有沒有人已經寫了相關套件來解決問題，但是如果引用了太多第三方套件，又會變得難以管理整個專案，因此就有了 [CocoaPods](https://cocoapods.org) 這相依性套件管理工具。

1. 安裝 [CocoaPods](https://cocoapods.org)，請開啟終端機，並執行以下指令：

```sh
sudo gem install cocoapods
```

2. 去吃個飯、洗個澡之類的，因為這會花上非常久的時間。

安裝完成之後，就可以開始使用 [CocoaPods](https://cocoapods.org) 囉！首先我們利用 Xcode 在桌面當中，建立一個以 Swift 爲語言的 iOS 專案，接著我們開啟終端機，並 cd (移動)到專案的目錄下，執行以下指令：

```sh
pod init
```

這項指令的功能是在目錄下建立一個 podfile 檔案，用文字編輯直接打開 podfile 檔案即可，就可以發現它幫你撰寫了一些預設方法了：

```pod
# Uncomment the next line to define a global platform for your project
# platform :ios, '9.0'

target 'Your-Project' do
  # Comment the next line if you're not using Swift and don't want to use dynamic frameworks
  use_frameworks!

  # Pods for Your-Project

end
```

乾太在這邊稍微把註解刪除，並加上一小點說明，這時候我們就可以開始引入些第三方套件囉：

```pod
target 'Your-Project' do
  use_frameworks!

  # 加入你要引用的第三方套件
  pod 'OAuthSwift', '1.1.0'
  pod 'TextFieldEffects'
  pod 'NVActivityIndicatorView'
  pod 'PopupDialog', '~> 0.5'
  pod 'SwiftyJSON'

end
```

這邊我總共引用了 6 種我常用且非常喜歡的套件，也順便介紹給大家，分別是：

```
# [OAuthSwift](https://github.com/OAuthSwift/OAuthSwift)
# Swift 介接 OAuth 的第三方套件，使用方法簡單又直覺。

# [TextFieldEffects](https://github.com/raulriera/TextFieldEffects)
# 有別於以往 TextField 輸入框的第三方套件，提供較為美觀的輸入框。

# [NVActivityIndicatorView](https://github.com/ninjaprox/NVActivityIndicatorView)
# 提供許多無縫向量動圖，可使用於 Loading 或其他等待畫面當中，相當美觀。

# [PopupDialog](https://github.com/Orderella/PopupDialog)
# 提供較為美觀的 Dialog 畫面。

# [SwiftyJSON](https://github.com/SwiftyJSON/SwiftyJSON)
# 提供更簡潔的 JSON 使用方法。
```

另外如果對於 [OAuthSwift](https://github.com/OAuthSwift/OAuthSwift) 有興趣的話，教學可見 ＝> [iOS Swift 第三方套件 - OAuthSwift](https://kantai235.github.io/posts/OAuthForSwiftBasic/)

3. 輸入完以後，我們要開始執行安裝第三方套件，必須執行以下指令：

```sh
pod install
```

安裝完了以後，整個專案的檔案結構可能會不太一樣，會出現 `專案名稱.xcworkspace` 以及 `專案名稱.xcodeproj`，從今以後，這項專案我們必須開啟「xcworkspace」。

```sh
open 專案名稱.xcworkspace
```

往後如果要管理第三方套件，就直接修改 podfile，並且執行 `pod install` 即可。
