---
cover :
title : 如何建立 NoCaptcha(我不是機器人) 的 Key、Secret？
description : 無論在手機應用程式或者網頁應用程式，你時常會看到「我不是機器人」或「請點選下面有包含汽車的圖」的功能，這功能其實來自於 Google 提供的 ...
date : 2018-09-09
tags :
  - Android
  - NoCaptcha
category :
  - 技術文件
  - Android 實務
---

無論在手機應用程式或者網頁應用程式，你時常會看到「我不是機器人」或「請點選下面有包含汽車的圖」的功能，這功能其實來自於 Google 提供的 [reCAPTCHA](https://www.google.com/recaptcha/intro/v3beta.html) 服務。

> reCAPTCHA計畫是由卡內基美濃大學所發展的系統，主要目的是利用CAPTCHA技術來幫助典籍數位化的進行，這個計畫將由書本掃描下來無法準確的被光學文字辨識技術（OCR, Optical Character Recognition）識別的文字顯示在CAPTCHA問題中，讓人類在回答CAPTCHA問題時用人腦加以識別[1]。reCAPTCHA正數位化《紐約時報》（New York Times）的掃描存檔[2]，目前已經完成20年份的資料，並希望在2010年完成110年份的資料。2009年9月17日，Google宣布收購reCAPTCHA。[3]
>
> - 取自於 WIKI

![reCAPTCHA 官方](/img/posts/QBUvYAP.jpg)

<br />
<hr />
<br />

申請的方式很簡單，你只要進入官方後，點擊右上角的「My reCAPTCHA」按鈕，或者點擊[這裡](https://www.google.com/recaptcha/admin)直接進入，你就可以看到詳細的列表、申請表單了。

![reCAPTCHA 列表、申請表單](/img/posts/Wbj8YBc.png)

<br />
<hr />
<br />

只要填入相對應的資料，就可以直接申請 reCAPTCHA 了，「Label」是給你自己方便辨識用，你可以填寫你這個 reCAPTCHA 是用在哪個應用程式上，如果你申請很多的時候，找東西會比較方便。

接下來比較重要的是選擇你的 reCAPTCHA 種類(Choose the type of reCAPTCHA)，總共有分別三個種類，我們依序來介紹：

1. reCAPTCHA v2
- 這個就是典型的「我不是機器人」方塊，如果使用者短時間內點太多次的話，會跳出一個類似「請點選下面有包含汽車的圖」的功能，作為防堵機器人的機制。
![reCAPTCHA v2](http://www.suratkabar.id/wp-content/uploads/2017/03/captcha-register.png)

2. Invisible reCAPTCHA
- 這是 reCAPTCHA 提供的新功能，這個防堵機器人的機制會隱藏在後台（螢幕的右下角），當有需要時才跳出來防堵。
![Invisible reCAPTCHA](https://camo.githubusercontent.com/85a08c4bec4457be5c41e55f6ce92c6a5fb6efba/687474703a2f2f692e696d6775722e636f6d2f31645a39584b6e2e706e67)

3. reCAPTCHA Android
- 這是 Android 原生裝置專用的 reCAPTCHA，這在我之前的文章有寫過詳細介紹、教學。
- [如何在 Android 當中引用 reCAPTCHA 來做防堵機器人的驗證。](https://kantai235.github.io/2017/06/13/AndroidSafetyNetReCAPTCHAAPI/)
![reCAPTCHA Android](https://cdn-images-1.medium.com/max/2000/1*R_zMnMYcK7jeOAvDKyw--A.png)

<br />
<hr />
<br />

如果你選擇了「reCAPTCHA v2」、「Invisible reCAPTCHA」，那麼接下來表單會再追問你你的網域(Domains)是什麼？只要簡單的寫上即可，例如: localhost.com

如果你選擇了「reCAPTCHA Android」，那麼接下來表單會再追問你你的專案名稱(Package Names)是什麼？也是一樣簡單的寫上即可，例如: com.yourname.appname

最後同意 reCAPTCHA 團隊的服務守則，基本上同意就對了。

![reCAPTCHA From](https://imgur.com/Wbj8YBc.png)

<br />
<hr />
<br />

最後你就可以獲得最重要的 Key、Secret 了，以及 reCAPTCHA 提供的簡易教學步驟，

![reCAPTCHA](https://imgur.com/loSWJZi.png)