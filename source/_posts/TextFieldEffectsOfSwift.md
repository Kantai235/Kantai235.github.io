---
cover: /img/posts/TextFieldEffectsOfSwift/banner.png
title: iOS Swift 第三方套件介紹 - TextFieldEffects
description: 超商服務愈來愈方便，現在到超商繳費不用帳單只要用專屬APP，就能下載條碼直接繳費 ...
tags:
  - Swift
category:
  - 技術文件
  - iOS 實務
abbrlink: 45eb9165
date: 2017-05-16 00:00:00
---

有時候，在應用程式當中的小小細節，也能深得使用者的喜好，程式不只要好用才行，還必須搭配美觀的介面，才能深得人心，然而在 iOS 專案當中，原生的 Field 輸入框太過於古板，不是那麼的好看，所以有人寫了 [TextFieldEffects](https://github.com/raulriera/TextFieldEffects) 這款好用的第三方套件，來使 Field 更加的美觀。

目前他具備了以下幾種效果：

- Kaede
- Hoshi
- Jiro
- Isao
- Minoru
- Yoko
- Madoka
- Akira
- Yoshiko

## 實際效果

### Kaede
![Kaede Demo](/img/posts/TextFieldEffectsOfSwift/Kaede.gif)

### Hoshi
![Hoshi Demo](/img/posts/TextFieldEffectsOfSwift/Hoshi.gif)

### Jiro
![Jiro Demo](/img/posts/TextFieldEffectsOfSwift/Jiro.gif)

### Isao
![Isao Demo](/img/posts/TextFieldEffectsOfSwift/Isao.gif)

### Minoru
![Minoru Demo](/img/posts/TextFieldEffectsOfSwift/Minoru.gif)

### Yoko
![Yoko Demo](/img/posts/TextFieldEffectsOfSwift/Yoko.gif)

### Madoka
![Madoka Demo](/img/posts/TextFieldEffectsOfSwift/Madoka.gif)

### Akira
![Akira Demo](/img/posts/TextFieldEffectsOfSwift/Akira.gif)

### Yoshiko
![Yoshiko Demo](/img/posts/TextFieldEffectsOfSwift/Yoshiko.gif)

## 開始使用

首先你必須利用 Cocoapod 於你專案裡頭的 `Podfile` 引入 [TextFieldEffects](https://github.com/raulriera/TextFieldEffects)，並且 `pod install` 去安裝。

你可以參考 [CocoaPods iOS 第三方套件管理工具](https://blog.init.engineer/posts/CocoaPodsBasic/) 這篇文章。

```pod
use_frameworks!
pod "TextFieldEffects"
```

安裝完畢以後，我們可以在 `storyboard` 加入一些系統預設的 Field(文字輸入框)：

![1.png](/img/posts/TextFieldEffectsOfSwift/1.png)

然後對剛剛新增的這項 `Field` 做些變更，我們以 `Akiar` 為例子，將 `Custom Class` 當中的 `Class` 設定為 `AkiraTextField`，然而 `Module` 是來自於 `TextFieldEffects`：

![2.png](/img/posts/TextFieldEffectsOfSwift/2.png)

完畢了以後，這個 `Field` 的外表會有些許的改變，但這還不夠像參考範例的那樣，因為我們還必須把 `Border Style` (外框樣式) 設定為無邊框：

![3.png](/img/posts/TextFieldEffectsOfSwift/3.png)

再來賦予他一些高度：

![4.png](/img/posts/TextFieldEffectsOfSwift/4.png)

最後在 `Akiar Text Field` 當中給予自定義的顏色，就大功告成囉！

![5.png](/img/posts/TextFieldEffectsOfSwift/5.png)

## 或者你喜歡硬派寫程式

透過寫 Code 的方式來呈現效果，這也是可以的！

```swift
let textField = KaedeTextField(frame: textFieldFrame)
textField.placeholderColor = .darkGrayColor()
textField.foregroundColor = .lightGrayColor()

view.addSubView(textField)
```
