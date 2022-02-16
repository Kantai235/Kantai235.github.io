---
cover: /img/banners/HowToCopyrightIssue.png
title: 部落格遇到抄襲，如何提交 Copyright issue 以及提交 DMCA Takedown Policy
description: >-
  前陣子技術部落格遇到了文章抄襲事件，有部分的文章直接被完美的複製貼上到了其他人自己的網站當中，為了解決這樣的事情，於是開始查詢 GitHub Pages
  對於抄襲這件事有甚麼處置，如何提交 Copyright Issue 訊息出去 ...
tags:
  - Copyright
  - GitHub
category:
  - 經驗分享
abbrlink: 90841e1c
date: 2022-02-16 00:00:00
---

前陣子[技術部落格](https://Kantai235.github.io)遇到了文章抄襲事件，有部分的文章直接被完美的複製貼上到了其他人自己的網站當中，為了解決這樣的事情，於是開始查詢 GitHub Pages 對於抄襲這件事有甚麼處置，如何提交 Copyright Issue 訊息出去、如何提交 [DMCA Takedown Policy](https://docs.github.com/en/github/site-policy/dmca-takedown-policy) 去嚇嚇人家，最後便把這些過程記錄下來。

# 提交 Copyright Issue

首先我的第一個動作是寄信給 GitHub 專門處理這類案件的信箱，也就是 `copyright@github.com` 這個信箱，你需要明確闡述出你滿腔的憤怒！然後附上受害者、加害者，最後期待 GitHub 的回覆，所以我們先用中文來寫一下信件內容大概的樣子，再將其翻譯成英文，畢竟是要給 GitHub 去審核的。

## 版權聲明信件 中文內容

```text
親愛的工作人員，

這個 GitHub Pages 侵犯了我的版權，並且沒有提前通知我，
請立即刪除該使用者的 GitHub 帳號。
否則我將不得不對此類侵權行為採取適當的法律行動。

GitHub 上的違規頁面
GitHub Page => https://______.github.io/______
Source Code => https://github.com/______/______.github.io/...

GitHub 上的原作者
GitHub Page => https://______.github.io/______
Source Code => https://github.com/______/______.github.io/...

我期待您的回覆。

Sincerely,
YOUR_NAME
```

接著將其翻譯成英文，如果你遇到類似的案件，你也可以直接複製這些信件內容，將空格填寫一下，就可以直接寄信給 `copyright@github.com` 去檢舉了。

## 版權聲明信件 英文內容

```text
Dear Staff,

This Github page violated my copyright without been notice me advanced,
please takedown the github account immediately.
Or I will have to take suitable legal actions against such infringement.

Violated page on Github
GitHub Page => https://______.github.io/______
Source Code => https://github.com/______/______.github.io/...

Original Author
GitHub Page => https://______.github.io/______
Source Code => https://github.com/______/______.github.io/...

I look forward to your reply.

Sincerely,
YOUR_NAME
```

# 來自 GitHub 的回覆

寄出了 Copyright Issue 信件後，沒過多久我就收到了來自 GitHub 的回覆，大致內容如下:

```text
Hi 乾太,

Thanks for contacting us. A great first step is to try contacting the user directly; in many cases, this type of thing turns out to be a misunderstanding that can be resolved by reaching out to them. You can check their profile page for contact information, or open an issue in the repository itself. If that's not possible, you may want to learn more about our DMCA takedown process.

If you are the copyright holder and want to have the content removed, you have the option of filing a DMCA takedown notice. Instructions, examples, and policy details are available here:

https://docs.github.com/en/github/site-policy/dmca-takedown-policy

https://docs.github.com/en/github/site-policy/guide-to-submitting-a-dmca-takedown-notice

If you're not the copyright holder, your best bet would be to contact the owner of the content and let them decide if they'd like to take action.

Regards,

GitHub Trust & Safety
```

內容大致上 GitHub 是覺得這是誤會啦、不用那麼緊張啦！如果是這樣的內容，基本上就是獲得了來自 GitHub 的制式罐頭回覆，但內容當中還是有個地方有用，就是「[提交 DMCA 刪除通知的指南](https://docs.github.com/en/github/site-policy/guide-to-submitting-a-dmca-takedown-notice)」。

# 什麼是 DMCA

> 數位千禧年著作權法 (Digital Millennium Copyright Act，DMCA) 是美國著作權法，規定其網站上供人發表貼文/使用者創作內容的線上服務供應商若在收到著作權人或其代理人指稱侵權通知後即時移除不當內容，即可免除著作權侵權責任。 

資料來源: [著作權侵權 – DMCA 通知](https://www.amd.com/zh-hant/corporate/dmca-notice)

# 提交 DMCA

我們根據 GitHub 的回信當中得知，我們除了寄送 Copyright Issue 以外，我們還可以採取[提交 DMCA 刪除通知](https://docs.github.com/en/github/site-policy/guide-to-submitting-a-dmca-takedown-notice)的動作，這個部分我們需要先到[Copyright claims (DMCA)](https://github.com/contact/dmca)這個網頁，選擇裡面有個「[Submit a DMCA takedown notice](https://github.com/contact/dmca-notice)」的選項，去提交你的 DMCA 刪除通知。

![Submit a DMCA takedown notice](/img/posts/bcqSNve9qdndkEkv.png)

接下來是一系列的表單填寫，

1. Are you the copyright holder or authorized to act on the copyright owner's behalf?
   您是著作權所有者還是被有著作權的人授權代理？

    - Yes, I am the copyright holder.
      是的，我是著作權所有者。
    - Yes, I am authorized to act on the copyright owner's behalf.
      是的，我被有著作權的人授權代理。
    - No.
      不。

2. Are you submitting a revised DMCA notice after GitHub Trust & Safety requested you make changes to your original notice?
   在 GitHub Trust & Safety 要求您更改原始通知後，您是否提交了修改後的 DMCA 通知？ 

    - Yes.
      是的。
    - No.
      不。

3. Does your claim involve content on GitHub or npm.js?
   您的聲明是否涉及 GitHub 或 npm.js 上的內容？ 

    - GitHub
    - npm.js
    - Both
      兩個都有

4. Please describe the nature of your copyright ownership or authorization to act on the owner's behalf.
   請描述您的著作權或授權代理的性質。 

    ```text
    這是我的個人部落格，我並沒有授權任何人可以去盜取我的文章內容。
    This is my personal blog, and I do not authorize anyone to steal the content of my articles.
    ```

5. Please provide a detailed description of the original copyrighted work that has allegedly been infringed. If possible, include a URL to where it is posted online.
   請提供涉嫌侵權的原始著作權作品的詳細說明，如果可以，請包含一個其線上發佈位置的 URL。

    ```text
    從發佈日期就可以得知 kantai235.github.io 的時間比 tomyhhc.github.io 更早期，而內容以及呈現方式幾乎是一模一樣，翻開原始碼更是一模一樣。
    From the release date, it can be known that kantai235.github.io is earlier than tomyhhc.github.io, and the content and presentation method are almost the same, and opening the source code is the same. 
    
    Original Author
    GitHub Page => https://______.github.io/______
    Source Code => https://github.com/______/______.github.io/... 
    ```

6. What files should be taken down? Please provide URLs for each file, or if the entire repository, the repository’s URL.
   應該刪除哪些文件？請提供每個文件的 URL，如果是整個儲存庫，請提供儲存庫的 URL。

    ```text
    Violated page on Github
    GitHub Page => https://______.github.io/______
    Source Code => https://github.com/______/______.github.io/...
    ```

7. Do you claim to have any technological measures in place to control access to your copyrighted content? Please see our Complaints about Anti-Circumvention Technology if you are unsure.
   您是否聲稱已採取任何技術措施來控制對您受版權保護的內容的瀏覽？如果您不確定，請參閱我們關於反規避技術的申訴。

    - Yes.
      是的。
    - No.
      不。

8. What technological measures do you have in place and how do they effectively control access to your copyrighted material?
   您採取了哪些技術措施，它們如何有效地控制對您受版權保護的資源？ 

    ```text
    我沒有設定 LICENSE，但我這是這篇文章的作者，因此我有權利捍衛我的著作權。
    I have not set a license, but I am the author of this article, so I have the right to defend my copyright.
    ```

9. How is the accused project designed to circumvent your technological protection measures?
   被指控的項目是如何規避你們的技術保護措施的？

    ```text
    這個 GitHub Pages 侵犯了我的版權，並且沒有提前通知我。
    This Github page violated my copyright without been notice me advanced.
    ```

10. Have you searched for any forks of the allegedly infringing files or repositories? Each fork is a distinct repository and must be identified separately if you believe it is infringing and wish to have it taken down.
    您是否搜尋過涉嫌侵權的文件或儲存庫的任何分支？每個分支都是一個不同的儲存庫，如果您認為它侵權並希望將其刪除，則必須個別檢視它。

11. Is the work licensed under an open source license?
    作品是否在開源許可下獲得許可？

    - Yes.
      是的。
    - No.
      不。

12. What would be the best solution for the alleged infringement?
    對於涉嫌侵權的最佳解決方案是什麼？ 

    - Repository can be made private
      儲存庫可以設定為私有(Private)
    - Reported content must be removed
      必須刪除其內容
    - Other Change
      其他

13. Do you have the alleged infringer’s contact information? If so, please provide it.
    你有被控侵權人的聯繫方式嗎？如果有，請提供。

    ```text
    Facebook: ...
    Email: ...
    ```

14. I have a good faith belief that use of the copyrighted materials described above on the infringing web pages is not authorized by the copyright owner, or its agent, or the law.
    我確信在侵權網頁上使用上述受版權保護的材料未經版權所有者或其代理人或法律授權。

15. I swear, under penalty of perjury, that the information in this notification is accurate and that I am the copyright owner, or am authorized to act on behalf of the owner, of an exclusive right that is allegedly infringed.
    我宣誓，本通知中的信息是準確的，並且我是涉嫌侵權的專有權的版權所有者或被授權代表所有者行事，如果做偽證，我將受到懲罰。

16. I have taken fair use into consideration.
    我考慮了合理使用。

17. I have read and understand GitHub's Guide to Submitting a DMCA Takedown Notice.
    我已閱讀並理解 GitHub 提交 DMCA 刪除通知的指南。

18. So that we can get back to you, please provide either your telephone number or physical address.
    為了方便我們回复您，請提供您的電話號碼或實際地址。

    ```text
    Facebook: ...
    Email: ...
    Phone: +886 ...
    ```

19. Please type your full legal name below to sign this request.
    請在下方輸入您的法定全名以簽署此請求。

    ```text
    YOUR NAME
    ```

# 後續

因為我遇到的侵權案件在提交 DMCA 刪除請求以後，對方就將違規的文章直接刪除了，所以沒有後續的進度，因此只記錄到此。

- [「線上 String 字串亂數產生器」侵權事件原委](https://www.facebook.com/kantai.zeng/posts/1233845227147846)
