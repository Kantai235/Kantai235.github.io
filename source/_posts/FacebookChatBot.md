---
cover: /img/posts/FacebookChatBot/banner.png
title: Facebook Messenger 第三方聊天機器人 - Chatfuel
description: 在粉絲團或個人 Facebook 當中，如何建立一個自動聊天的機器人 ...
tags:
  - Chatfuel
category:
  - 技術文件
abbrlink: fae46c69
date: 2017-02-25 00:00:00
---

在很久以前，因為自己很邊緣人，生活寂寞又孤單，所以乾太有一個夢想，就是自己打造一個機器人老婆，每天陪自己聊天，來緩解自己空虛寂寞覺得冷的窘境，大概頂多參考了這篇 [自己動手設計交談機器人 (Eliza 中文版) - 使用 Java](http://ccckmit.wikidot.com/code:eliza) 做個小小的機器人，但如果要設計一套屬於自己的機器人，或者有點智慧的機器人，那會需要很多技術，像是機器學習或自然語言分析之類的，對於沒有程式基礎的人來說，需要投入相當多的時間去研究。

不過今天在大學的生活當中，意外學到了一個很有趣的東西，它叫做「[Chatfuel](https://chatfuel.com/)」，它是一款架於 Facebook 的第三方服務，你可以這樣來理解：

```
(1.) Facebook 提供各種 API 服務
    ↓ ↑
(2.) Chatfuel 平台將 API 服務做出人性化介面
    ↓ ↑
(3.) 使用者(You)
```

我們今天以 Facebook 粉絲團作為範例，目標是建立出一個自動回覆的機器人，所以首先我們必須先建立一個粉絲團(或者你已經有了)：

步驟一、請先到 [建立粉絲專頁](https://www.facebook.com/pages/create/) 當中去建立一個粉絲專頁。(如果已經有了，那你可以略過這步驟。)

![步驟一](/img/posts/FacebookChatBot/1.png)

步驟二、接下來我們要把這個粉絲專頁綁訂到 [Chatfuel](https://chatfuel.com/) 這平台當中，沒錯，請打開它。

![步驟二](/img/posts/FacebookChatBot/2.png)

步驟三、不管你要點「LOG IN」還是「GET STARTED FOR FREE」都可以，你都必須將你 Faecbook 帳號的權限授權給 Chatfuel，因為這樣平台才能透過你的帳號，來建立自動回覆機器人，完成之後會進入主控台。

![步驟三](/img/posts/FacebookChatBot/3.png)

步驟四、接下來我們選擇你要建立機器人的粉絲團，這邊當然我們就選擇我剛剛所建立的「[加摩爾會保護大家的！](https://www.facebook.com/%E5%8A%A0%E6%91%A9%E7%88%BE%E6%9C%83%E4%BF%9D%E8%AD%B7%E5%A4%A7%E5%AE%B6%E7%9A%84-407616019582120/)」囉～完成之後，會進入該粉絲團機器人的控制台。

![步驟四](/img/posts/FacebookChatBot/4.png)

步驟五、到這邊為止，我們甚麼都不做，就對這個粉絲團發 Messenger 訊息看看，看起來非常成功。

![步驟五](/img/posts/FacebookChatBot/5.png)

這樣簡單的機器人就完成囉！接下來開始解說 Chatfuel 機器人控制台的簡介，他總共有分幾項大功能，我們就拿兩個常用來稍作解釋：

1. Build => 事件方塊，你可以想像成模組，你可以設定很多種模組，例如歡迎光臨模組、預設回覆模組之類的，而這些模組是讓機器人回話用的。
2. Set up AI => 設定AI，如果有人對粉絲團留言，Chatfuel 會對留言做比對，例如比對到「加摩爾」這個字樣，就回覆某事件方塊(Build)。

光這樣看可能不了解在做甚麼，那我們就來個實際案例吧！我們希望做出「如果有人留言提到"一日千死"的字樣，那機器人就回覆對應的圖片，並且留言」的功能。

步驟一、我們到 Chatfuel 機器人的控制台 => Build 的功能選項裡頭，新建一個事件方塊：

![步驟一](/img/posts/FacebookChatBot/6.png)

步驟二、再來我們到 Set up AI 的功能選項，去新增一個判斷，如果留言內容有「一日千死」，或者可能留言有錯字，打成了「一日千屎」，那機器人要回應一日千死的這個事件方塊：

![步驟二](/img/posts/FacebookChatBot/7.png)

好的！接下來我們來看看機器人的成果：

![成果](/img/posts/FacebookChatBot/8.png)

基本教學到這邊，下一次來談談如何讓 Chatfuel 界街第三方 API，或者連接自己的伺服器，使用 JSON API 來控制機器人。
