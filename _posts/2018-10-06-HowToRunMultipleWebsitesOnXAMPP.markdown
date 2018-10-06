---
layout     : post
title      : "如何在 Linux/macOS 當中，利用 XAMPP 一次運行多個網站"
subtitle   : "`Laravel` 在默認的情況之下，所有的路由(Route)它會自動啟用 `CSRF` 保護，這在開發的過程當中，是一個非常方便的功能 ..."
date       : 2018-10-06 21:00:00
author     : "乾太 ₍₍ ◝(･◡･)◟ ⁾⁾"
tags       : XAMPP Linux macOS multiple websites
comments   : true
signature  : true
---

身為一位自由工作者，時常會接到不同廠商的網站案子，但同一時間下可能不會只有開發一個網站，但同一個通訊埠(Port)又只能連結一個網站，這時候就需要 `VirtualHost` 這種東西來解決這樣的問題了，它可以達成讓你根據 URL 的不同而觸發不同的網站來源。

1. 步驟一、首先我們必須告訴作業系統一些基本的路由，你必須打開你的 `終端機` 並且輸入以下指令:

```shell
sudo vim /etc/hosts
```

> 補充知識：Vim是從vi發展出來的一個文字編輯器。其代碼補完、編譯及錯誤跳轉等方便編程的功能特別豐富，在程式設計師中被廣泛使用。和Emacs並列成為類Unix系統用戶最喜歡的編輯器。
> 資料來源取自於 WiKi 維基百科

2. 步驟二、開始新增一些路由，這些路由讓你比較方便管理你的專案開發:

```text
##
# Host Database
#
# localhost is used to configure the loopback interface
# when the system is booting.  Do not change this entry.
##
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

127.0.0.1       local.exampleA.com
127.0.0.1       local.exampleB.com
127.0.0.1       local.exampleC.com
```

3. 步驟三、輸入完畢後，按一下 `ESC` 並且輸入 `:wq!` 即可儲存並退出，做完這些步驟後，電腦就知道如果你在瀏覽器輸入 `local.exampleA.com`、`local.exampleB.com`、`local.exampleC.com` 這些地方，那麼這些的目的地就是 `127.0.0.1` 這個 IP，但這樣還是沒辦法完成多網站的功能，因為 `XAMPP` 並不曉得哪些網域對應的是哪些專案。

> 補充知識： `:wq!` 這是 `Vim` 的指令，功能是 `w`(Write) 寫入檔案、`q`(Quit) 退出檔案，而驚嘆號 `!` 則是強制的意思，所以 `wq!` 意思則是強制寫入檔案並且退出。

4. 步驟四、所以接下來才真正要使用到 `VirtualHost` 這東西，首先我們要先開啟 XAMPP 的設定檔案:

```shell
sudo vim `路徑`
```

- macOS 路徑 `/Applications/XAMPP/xamppfiles/etc/httpd.conf`
- Linux 路徑 `/opt/lampp/etc/httpd.conf`

5. 步驟五、找到一個 `<VirtualHost *:80>` 的地方，並且改成以下內容:

```text
...

<VirtualHost *:80>
    ServerAdmin youremail@example.com
    ServerName local.exampleA.com
    DocumentRoot "/Applications/XAMPP/xamppfiles/htdocs/local.exampleA.com"
    ErrorLog "logs/kghs-eserc.com.tw-error.log"
    CustomLog "logs/kghs-eserc.com.tw-access.log" combined
    <Directory />
        Options Indexes FollowSymLinks Includes execCGI
        AllowOverride none
        Require all granted
    </Directory>
</VirtualHost>

<VirtualHost *:443>
    ServerAdmin youremail@example.com
    ServerName local.exampleA.com
    DocumentRoot "/Applications/XAMPP/xamppfiles/htdocs/local.exampleA.com"
    ErrorLog "logs/local.exampleA.com-error.log"
    CustomLog "logs/local.exampleA.com-access.log" combined
    <Directory />
        Options Indexes FollowSymLinks Includes execCGI
        AllowOverride none
        Require all granted
    </Directory>
    SSLEngine on
    SSLCertificateFile "/Applications/XAMPP/xamppfiles/apache2/conf/ssl.crt/certificate.crt"
    SSLCertificateKeyFile "/Applications/XAMPP/xamppfiles/apache2/conf/ssl.key/private.key"
    SSLCertificateChainFile "/Applications/XAMPP/xamppfiles/apache2/conf/ssl.crt/ca_bundle.crt"
</VirtualHost>

...
```

主要注意 `ServerName`(主機名稱)、`DocumentRoot`(檔案根目錄) 這兩個地方，一個是你剛剛在 `hosts` 設定的 `URL`，一個則是你專案的位置，設定完之後重啟 `apache` 就可以依據 `hosts` 所設定的位址來瀏覽不同專案。
