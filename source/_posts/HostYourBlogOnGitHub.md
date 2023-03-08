---
cover: /img/posts/HostYourBlogOnGitHub/banner.png
title: 如何將 Hexo 部落格架設到 GitHub Pages 上
tags:
  - Hexo
  - GitHub
  - Butterfly
category:
  - 技術文件
abbrlink: c4073235
date: 2022-02-18 00:00:00
description: 前陣子嘗試將部落格更換框架、更換主題，從 Jekyll 框架改成了 Hexo 這個框架，從 Jekflix 這主題改變成了 Butterfly 這主題，更適合當做一個技術部落格來使用 ...
---

前陣子嘗試將部落格更換框架、更換主題，從 [Jekyll](https://jekyllrb.com/) 框架改成了 [Hexo](https://hexo.io/) 這個框架，從 [Jekflix](https://github.com/thiagorossener/jekflix-template/) 這主題改變成了 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly/) 這主題，更適合當做一個技術部落格來使用，如果對於之前的 [Jekyll](https://jekyllrb.com/) 有興趣，可以參考一下幾年前寫的「[如何在 GitHub 中建造一個屬於自己的部落格](/posts/HowToCreateBlogOnGithub)」這篇文章，而本篇主要概述從建立起一個自己的 [Hexo](https://hexo.io/) 部落格、選定主題樣式，到最後將自己建立好的部落格推送到 [GitHub Pages](https://pages.github.com/) 上面，循序漸進的步驟，從架設 Hexo 到部屬 [GitHub Pages](https://pages.github.com/)。

# 前置作業

首先因為 [Hexo](https://hexo.io/) 需要使用 [npm](https://www.npmjs.com/)(Node.js 預設的套件管理器)，所以我們可以先到 [Node.js](https://nodejs.org/) 去下載，安裝完畢後，直接在終端機(Terminal)輸入 `node -v` 並執行，看看是否有版本資訊顯示出來，如果有就說明順利安裝完畢了。

```shell
node -v
```

![node -v](/img/posts/HostYourBlogOnGitHub/1.png)

# 建置 Hexo 部落格專案

接下來我們要透過 [npm](https://www.npmjs.com/) 套件管理器來安裝 [Hexo](https://hexo.io/) 這個框架的 CLI(命令列介面 Command-Line Interface, CLI)，因此我們要在終端機(Terminal)輸入 `npm install hexo-cli -g` 並執行，正常情況下你會獲得如同下圖這樣的輸出結果。

```shell
npm install hexo-cli -g
```

![npm install hexo-cli -g](/img/posts/HostYourBlogOnGitHub/2.png)

完成了 `hexo-cli` 的安裝後，我們接下來可以在終端機(Terminal)當中輸入 `hexo` 並執行看看，如果出現了相關功能的內容提示，那代表你已經將 `hexo-cli` 安裝完成了，接下來我們可以透過它來建立一個部落格專案，通常我會建議專案以你部落格的網址作為名稱，因為我們最終要將部落格部屬到 [GitHub Pages](https://pages.github.com/) 當中，到時候的網址將會是 `YOUR_ACCOUNT.github.io`，其中「YOUR_ACCOUNT」指的是你的 [GitHub](https://github.com/) 帳號，舉例來說我的 [GitHub](https://github.com/) 是「Kantai235」，因此我的專案名稱、[GitHub Pages](https://pages.github.com/) 網址就會是「[Kantai235.github.io](Kantai235.github.io)」。

瞭解了專案名稱以後，我們要來建立部落格專案，在終端機(Terminal)當中輸入 `hexo init something.github.io` 就會開始建立，接下來在你執行終端機(Terminal)指令的目錄下就會多出一個「something.github.io」的資料夾，也就是你的部落格專案。

```shell
hexo
hexo init something.github.io
```

![hexo init something.github.io](/img/posts/HostYourBlogOnGitHub/3.png)

接著我們需要幫專案安裝相關的依賴套件，因此在終端機(Terminal)當中先 `cd something.github.io` 前往你的部落格專案資料夾當中，然後透過 `npm install` 來讓它自動執行安裝相關的依賴套件。

```shell
cd something.github.io
npm install
```

![npm install](/img/posts/HostYourBlogOnGitHub/4.png)

既然該安裝的依賴套件都處理得差不端了，我們接下來可以試著在本機運行看看成品如何，我們只要在終端機(Terminal)當中輸入 `hexo serve` 來運行專案，在正常的情況下，你會發現它運行後似乎沒有要停止的意思，而且還有一個 localhost 的網址出現，這就代表 [Hexo](https://hexo.io/) 已經在本地端運行了，只要到瀏覽器當中輸入「[http://localhost:4000/](http://localhost:4000/)」就可以直接瀏覽你剛剛建立的部落格了。

```shell
hexo serve
```

![hexo serve](/img/posts/HostYourBlogOnGitHub/5.png)

![localhost:4000](/img/posts/HostYourBlogOnGitHub/6.png)

接著如果你想要停止 [Hexo](https://hexo.io/) 運行的話，只需要在終端機(Terminal)當中，同時按下鍵盤上的 `Ctrl` + `C` 這兩個按鍵即可。

# 使用 Butterfly 主題

如果用 [Hexo](https://hexo.io/) 原生樣式的話，那部落格就太單調了，因此我們這裡以 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly/) 這主題作為套用的範例，我們需要透過 `npm` 來安裝相關的主題、套件，只要在終端機(Terminal)當中輸入 `npm install hexo-theme-butterfly hexo-renderer-pug hexo-renderer-stylus --save` 安裝 `hexo-theme-butterfly`、`hexo-renderer-pug` 以及 `hexo-renderer-stylus` 這三個套件。

```shell
npm install hexo-theme-butterfly hexo-renderer-pug hexo-renderer-stylus --save
```

![npm install hexo-theme-butterfly hexo-renderer-pug hexo-renderer-stylus --save](/img/posts/HostYourBlogOnGitHub/7.png)

接著我們需要將部落格專案的主題樣式從預設主題改成 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly/) 主題，因此我們需要打開部落格專案的 `_config.yml` 檔案，並且去找到 `theme: landscape` 將其修改為 `theme: butterfly` 並儲存。

```yaml
theme: butterfly
```

接著我們再嘗試運行一次專案，一樣在終端機(Terminal)當中輸入 `hexo serve` 即可運行，這裡會發現終端機(Terminal)輸出的內容跟剛剛不太一樣了，這代表你的主題套用已經成功，只要在瀏覽器當中輸入「[http://localhost:4000/](http://localhost:4000/)」就可以直接瀏覽你剛剛套用 [Butterfly](https://github.com/jerryc127/hexo-theme-butterfly/) 主題的部落格了。

```shell
hexo serve
```

![hexo serve](/img/posts/HostYourBlogOnGitHub/8.png)

![localhost:4000](/img/posts/HostYourBlogOnGitHub/9.png)

最後我們要嘗試建立一篇自己的文章，我們只要在部落格專案當中的 `source/_posts` 這資料夾底下新增 [Markdown](https://markdown.tw/) 檔案，檔案名稱就是你的文章連結，而副檔名需要是 `md` 或 `markdown`，這邊舉例我們新增了一個 `demo.md` 檔案，並且輸入以下內容。

```markdown
---
title: Demo
---

這是一篇測試文章。
```

這樣我們就成功建立了一篇文章，並且這篇文章的網址會是 `http://localhost:4000/2022/02/18/demo/` 這樣的路徑，這是因為在設定當中文章的網址是「`/:year/:month/:day/:title/`」這樣的編排方式。

![Demo 文章](/img/posts/HostYourBlogOnGitHub/10.png)

如果不喜歡這樣的路徑，我們可以到 `_config.yml` 檔案當中去修改 `permalink` 的資訊，舉例來說將 `:year/:month/:day/:title/` 修改為 `posts/:title/`，那麼網址就會從 `/2022/02/18/demo/` 變成 `/posts/demo/`。

```yaml
# permalink: :year/:month/:day/:title/
permalink: posts/:title/
```

# 部屬到 GitHub Pages

最後我們要把部落格部屬到 [GitHub Pages](https://pages.github.com/) 當中，對於軟體工程師而言，全部的過程都活在終端機的世界當中，是一件習以為常的事情，但對於其他人來說，就不見得那麼親民了，所以這邊我們選擇使用 [GitHub Desktop](https://desktop.github.com/) 這具有圖形化介面的軟體來操作 [GitHub](https://github.com/) 儲存庫，首先我們需要先去註冊 [GitHub](https://github.com/) 帳號，再來安裝 [GitHub Desktop](https://desktop.github.com/) 並且登入 [GitHub](https://github.com/) 當中，然後選擇「Create a new repository ...(新增一個新的儲存庫 ...)」，「Name(專案名稱)」的部分必須輸入 `YOUR_ACCOUNT.github.io`，其中「YOUR_ACCOUNT」指的是你的 [GitHub](https://github.com/) 帳號，然後「Local path(本地專案路徑)」需要選擇你的部落格專案，最後按下 `Create repository(新增儲存庫)` 即可。

![Create a new repository](/img/posts/HostYourBlogOnGitHub/11.png)

![Source Code](/img/posts/HostYourBlogOnGitHub/12.png)

這時候我們就已經幫部落格專案建立起了 Git 版本控制的機制，我們只要按下 [GitHub Desktop](https://desktop.github.com/) 軟體中上方的 `Publish repository` 就可以將部落格上傳到 [GitHub](https://github.com/) 當中，可以透過瀏覽器輸入網址 `https://github.com/YOUR_ACCOUNT/YOUR_ACCOUNT.github.io` 來觀看你的專案，以我自己部落格專案的網址來說是「[https://github.com/Kantai235/Kantai235.github.io](https://github.com/Kantai235/Kantai235.github.io)」。

![Publish repository](/img/posts/HostYourBlogOnGitHub/13.png)

接下來我們需要設定專案的成品輸出要部屬到 [GitHub](https://github.com/) 的哪個專案、哪個分支當中，所以我們需要在部落格專案的 `_config.yml` 當中，去修改 `deploy` 的資訊如下：

```yaml
# Deployment
## Docs: https://hexo.io/docs/one-command-deployment
deploy:
  type: git
  repo: git@github.com:YOUR_ACCOUNT/YOUR_ACCOUNT.github.io
  branch: github-pages
```

再來我們回到部落格專案的終端機(Terminal)當中，我們現在已經將部落格的原始碼丟到了 [GitHub](https://github.com/) 當中，因此我們需要先透過 `npm` 來安裝 `hexo-deployer-git` 這個套件，直接在終端機(Terminal)當中輸入 `npm install hexo-deployer-git` 即可，接下來我們只需要執行 `hexo deploy` 就可以部屬網頁到同一個專案下，所以你的部落格專案會有兩個分支，分別是 `main(原始碼)` 以及 `github-page(網頁輸出)`，

```shell
npm install hexo-deployer-git
hexo deploy
```

![hexo deploy](/img/posts/HostYourBlogOnGitHub/14.png)

終於到了最後一個步驟，就是跟 [GitHub](https://github.com/) 說你的專案是個 [GitHub Pages](https://pages.github.com/) 的專案，並且要讀取哪個分支來作為網頁輸出，因此你需要打開瀏覽器去找你的 [GitHub](https://github.com/) 儲存庫，並且點選 `Settings(設定)` 的分頁，找到 `Pages`，如果直接輸入網址的話，網址是 `https://github.com/YOUR_ACCOUNT/YOUR_ACCOUNT.github.io/settings/pages`，記得把「YOUR_ACCOUNT」替換掉。

然後將 `Branch(分支)` 的選項改為 `github-pages` 並且 `Save(儲存)`，等待幾分鐘的時間就可以部屬成功了，打開瀏覽器輸入網址 `https://YOUR_ACCOUNT.github.io` 就可以瀏覽到你剛剛所建立的部落格了。

![GitHub Pages Setting](/img/posts/HostYourBlogOnGitHub/15.png)

# 後續

到這邊我們的「如何將 Hexo 部落格架設到 GitHub Pages 上」就告一段落，後續若想針對主題樣式做出不一樣的調整，可以參考 [Butterfly 官方文件](https://butterfly.js.org/)，裡面有其他更詳細的設定操作。
