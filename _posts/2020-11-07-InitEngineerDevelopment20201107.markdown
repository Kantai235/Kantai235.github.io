---
layout       : post
image        : /assets/img/banner/InitEngineerDevelopment20201107.png
title        : 《純靠北開發日誌》將專案砍掉重練有甚麼意義？
description  : 
date         : 2020-11-07 12:00:00
author       : kantai235
tags         :
- 純靠北工程師
- 開發日誌
paginate     : true
category     : development
---

接下來會有一大段時間完全投入在純靠北工程師上，所以稍微紀錄一下 `v4.0` 的一些方向與構思，之後每當值得討論的議題到一定的量，就會將議題稍加整理並撰寫成文章發表。

---
## 第四次砍掉重寫
相信大多數人都並不曉得我純靠北版號第一個數字代表的是甚麼意思，甚至連純靠北其實有版本號這件事情都不知道，在軟體版本號命名風格當中，第一個數字意味著軟體經過了重大更新，而我不一樣，因為這是 Side Project，所以要重大更新就砍掉重練吧！不過這招也僅限使用於 Side Project，你可以在 Side Project 實踐你各種大膽的想法，如果發生了甚麼意想不到的錯誤，你就只需要趕快修一修就好了，或者摸摸鼻子趕快回去上一個版本，但在商案上就可能不太適用了，因為商案的使用者是有付錢給公司的，你會很難給使用者一個交代。

為什麼要近乎砍掉重寫呢？如果一份專案它全部都是由你來寫的，而它已經營運了幾年，你現在回過頭來看它，儘管它目前正常營運當中，但你會有種「我好像可以寫得更好」的想法，因為你的能力可能在這幾年當中又進步了，可是又會想到如果重寫這個，那個也要跟著重寫，而這種東修一塊、西修一塊的做法，我認為很容易產生意想不到的漏洞，如果你就是整個打掉重寫，那麼整個系統全部的範圍你都需要親自思考過、寫過，就不會有你改了這塊，卻沒想到那塊的問題發生。

### 額外補充 - 版本號
一般來說版本編號格式是 `[主版本號].[次版本號].[修訂版本號]`，而每個編號遞增的時機如下：

- 主版本號：軟體有重大更新的時候遞增，重大更新通常是指功能與介面都有大幅度變動的時候。
- 次版本號：軟體發佈新功能，但是並不會大幅影響到整個軟體的時候遞增。
- 修訂版本號：通常是在軟體有 bug，發布 bug 的修正版時遞增。

> 詳細教學可以閱讀 [SLMT's Blog - 版本編號的命名規則](https://www.slmt.tw/blog/2015/07/19/version-number-naming-convention) 這篇文章，額外補充的內容都取自於這篇文章，裡面解說得非常詳盡。

---
## 砍掉重練的風險與防範
那麼這樣的決定，會不會有甚麼風險呢？事實上是有的，歷經數次的砍掉重練，有不少需要注意的點，像是資料庫有沒有要重新規劃？你網頁服務的路由會不會變更？

![g0nP4zq5VNN9lhPVqO4P5SiAWOmRN3K3FTwP7S69q3n6kTDN9P4m8fvUamqtx4RI](/assets/img/posts/g0nP4zq5VNN9lhPVqO4P5SiAWOmRN3K3FTwP7S69q3n6kTDN9P4m8fvUamqtx4RI.png)
### 修改資料庫架構，而發生新舊資料轉移的問題
通常砍掉重練的過程中，除了程式以外，還會考慮到資料流的問題，你可能會為了解決營運所產生出來的問題，像是原本設計在理論上每筆資料都很重要，但實際營運後發現某項資料是多餘的，甚至某些資料應該被刪除或它被放到不該放的地方，為了解決這些經營運後才發現的問題，因此而重新設計資料表的結構，這時你將面臨舊有資料如何保留，並且轉換為新結構格式的問題。

在於資料的轉移，原先資料庫的架構可能會在新版本當中重新設計，為了符合新的設計，同時不能遺棄舊有的資料，你會需要做資料轉移，而且這段過程不能出任何一點差錯，這是我覺得砍掉重練最困難也最需要謹慎處理的地方，尤其是當你的資料量開始龐大之後，所以再對於新舊資料轉移的問題，最後摸索出了較為穩定的流程，假使現在你擁有舊資料，並且已經將新的資料庫結構定義好了，那麼我八九不離十會照著這個流程來進行：

1. 建立兩個資料庫，一個是舊的資料庫結構，一個是新的資料庫結構。
2. 模擬一套舊結構的假資料，並且存在舊的資料庫結構，資料量不需要太大，但盡可能模擬所有資料狀態。
3. 根據舊結構的假資料，下去推論這些假資料如果轉移成新結構，新結構的假資料應該有的樣子，不需要儲存於新的資料庫結構。
4. 以你覺得熟練的程式語言，去寫驗證程式，驗證新的資料庫結構內的資料，這邊幾乎就是把前步驟的資料複製貼到程式碼當中，並且把新的資料庫結構資料抓出來判斷是否相等。
5. 無論是 SQL 或其他語言都可以，寫一套轉換的程式集來去把舊資料抓出來並轉換成新資料儲存於新的資料庫結構。
6. 執行你第四個步驟所寫的驗證程式，以確保轉換完後的資料是你所想的樣子。

完成上面的步驟後，基本上你已經有十足的信心去肯定你的轉換程式八九不離十是正確的，接下來只差執行轉移的步驟，基本上還是會有一些需要注意的要點需要謹慎：

1. 完整備份你舊的資料庫，無論如何就是求個可以回頭的安心。
2. 千萬不要直接把新資料庫覆蓋舊資料庫，你應該另起一個資料庫去存放轉移後的結果，當新服務運行一段時間之後，再回頭來考慮是否該刪除。

![gNta8FErJrEthD2mypDXng4O2uilwFQ7OIQzPTQ4GNX4qmdvHL145e1JnfjGBZzU](/assets/img/posts/gNta8FErJrEthD2mypDXng4O2uilwFQ7OIQzPTQ4GNX4qmdvHL145e1JnfjGBZzU.png)
### 更新網頁的路由，而導致流量暴跌
有時候你會發現你以前設計的路由，在新的結構下似乎可以更為簡短，甚至路徑可以寫得更有意義，但如果你想要更新路由，那麼你可能會面臨流量會不會因此而暴跌的問題，這是個很有趣的問題，目前這個部落格在以前每篇文章的路徑如下：

```
https://kantai235.github.io/{年}/{月}/{日}/{文章檔名}
```

有一次將整個部落格的樣式改寫，連文章路徑也一起更新成新的結構：

```
https://kantai235.github.io/{文章檔名}
```

原本部落格每個月的流量從數萬直接消失了九成以上，你沒有看錯，並不是剩下九成，而是消失了九成，每個月的觀看人數只有數百人，而且這個狀況持續了一年以上，直到最近才恢復到每個月幾千人，這個流量是你從剛開始起步慢慢累積上來的，當你更新重要的路由之後，幾乎就是把所有的流量清空，整個網站從頭開始。

面對這個狀況，這是必須避免的，你必須將同一個服務支援到你的舊路徑以及新路徑，你可以建立新的路徑，並且要記得保留舊的路徑，或者讓舊路徑自動轉址到新路徑上，這件事情是小事，但絕對不能發生，因為一旦發生就算回頭也來不及了，失去的流量將會要重新累積。

---
## 最後，喝杯咖啡？
這是 `v4.0` 準備動工時，所想到的一些想法、經驗回顧，之後開發上可能會遇到些有趣的東西，或者開發上的思維，也會透過開發日誌的方式來記錄下來，如果你覺得這很有趣想支持的話，`歡迎請乾太喝杯咖啡哦 O_<`

如果你有甚麼想問、想了解、想探討的議題，也歡迎透過[《純靠北工程師 Facebook 正式機 粉絲團》](https://www.facebook.com/init.kobeengineer)來發問。

<div style="padding: 2rem;">
    <style>
        a.animated-button:link, a.animated-button:visited {
            position: relative;
            display: block;
            margin: 30px auto 0;
            padding: 14px 15px;
            color: #000;
            font-size:14px;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            overflow: hidden;
            letter-spacing: .08em;
            border-radius: 0;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(0, 0, 0, 0.2);
            -webkit-transition: all 1s ease;
            -moz-transition: all 1s ease;
            -o-transition: all 1s ease;
            transition: all 1s ease;
        }
        a.animated-button:link:after, a.animated-button:visited:after {
            content: "";
            position: absolute;
            color: #fff;
            height: 0%;
            left: 50%;
            top: 50%;
            width: 150%;
            z-index: -1;
            -webkit-transition: all 0.75s ease 0s;
            -moz-transition: all 0.75s ease 0s;
            -o-transition: all 0.75s ease 0s;
            transition: all 0.75s ease 0s;
        }
        a.animated-button:link:hover, a.animated-button:visited:hover {
            color: #FFF;
            text-shadow: none;
        }
        a.animated-button:link:hover:after, a.animated-button:visited:hover:after {
            height: 450%;
        }
        a.animated-button:link, a.animated-button:visited {
            position: relative;
            display: block;
            margin: 30px auto 0;
            padding: 14px 15px;
            color: #000;
            font-size:14px;
            border-radius: 0;
            font-weight: bold;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            overflow: hidden;
            letter-spacing: .08em;
            text-shadow: 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(0, 0, 0, 0.2);
            -webkit-transition: all 1s ease;
            -moz-transition: all 1s ease;
            -o-transition: all 1s ease;
            transition: all 1s ease;
        }
        a.animated-button.victoria-four {
            border: 2px solid #D24D57;
        }
        a.animated-button.victoria-four:after {
            background: #D24D57;
            opacity: .5;
            -moz-transform: translateY(-50%) translateX(-50%) rotate(90deg);
            -ms-transform: translateY(-50%) translateX(-50%) rotate(90deg);
            -webkit-transform: translateY(-50%) translateX(-50%) rotate(90deg);
            transform: translateY(-50%) translateX(-50%) rotate(90deg);
        }
        a.animated-button.victoria-four:hover:after {
            opacity: 1;
            height: 600% !important;
        }
    </style>
    <a href="https://cart.cashier.ecpay.com.tw/qp/jnb0" class="animated-button victoria-four" style="font-size: 2rem;" target="_blank">
        <img src="https://www.flaticon.com/svg/static/icons/svg/616/616519.svg" style="width: 3rem;">
        請乾太喝杯咖啡
    </a>
</div>

---
## 相關連結
- [純靠北工程師 feature/v4.0 GitHub](https://github.com/init-engineer/init.engineer/tree/feature/v4.0)
