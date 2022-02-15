---
cover: /img/banners/ToolsURL.png
title: 線上編碼、解碼器 for URL
description: 一款簡單的線上編碼、解碼器，URL 是一種網際網路上標準的資源的位址（Address），如同在網路上的門牌。
tags:
  - Tools
  - URL
category:
  - 線上小工具
abbrlink: ae96c99e
date: 2019-07-14 00:00:00
---

<style type="text/css" media="screen">
    .container {
        margin: 0px auto;
        max-width: 800px;
    }

    textarea {
        margin-bottom: 0px !important;
        border-radius: 12px;
    }

    .contact-form button[type="button"] {
        display: inline;
        padding: 19px 39px 18px 39px;
        color: #fff;
        font-size: 1.125rem;
        width: 49%;
        border: 1px solid #ba0009;
            border-top-width: 1px;
            border-right-width: 1px;
            border-bottom-width: 1px;
            border-left-width: 1px;
        /* margin: 0px auto; */
        margin-top: .625rem;
        margin-bottom: .625rem;
        cursor: pointer;
        -webkit-transition: all .3s;
        transition: all .3s;
        outline: none;
    }

    select {
        padding: 9px 18px 9px 18px;
        width: 100%;
        /* border: 6px solid #032629 !important; */
        /* border-width: 2px 4px 4px 2px !important; */
        border-radius: 12px;
        margin: .625rem;
        padding: .625rem;
    }

    .contact-form .encode {
        width: 100%;
        height: auto !important;
        background: #086770;
        border: 6px solid #032629 !important;
        border-width: 2px 4px 4px 2px !important;
    }

    .contact-form .decode {
        width: 100%;
        height: auto !important;
        background: #427035;
        border: 6px solid #243e1d !important;
        border-width: 2px 4px 4px 2px !important;
    }

    .encode_textarea {
        width: 100%;
        height: 240px !important;
        border: 6px solid #086770 !important;
            border-top-width: 1px;
            border-right-width: 1px;
            border-bottom-width: 1px;
            border-left-width: 1px;
    }

    .decode_textarea {
        width: 100%;
        height: 240px !important;
        border: 6px solid #427035 !important;
        border-top-width: 1px;
        border-right-width: 1px;
        border-bottom-width: 1px;
        border-left-width: 1px;
    }
</style>

![線上編碼、解碼器 for URL Banner](/img/banners/ToolsURL.png)

<div class="container" style="padding-top: 16px; padding-bottom: 16px;">
    <div id="form" class="contact-form">
        <textarea type="text" class="encode_textarea" id="encode_value" name="encode_value" placeholder="在此輸入您想要「編碼」為 URL 的文本內容 ..."></textarea>
        <button type="button" class="encode" id="encode" onclick="encode()">編碼 Encode</button>
        <button type="button" class="decode" id="decode" onclick="decode()">解碼 Decode</button>
        <textarea type="text" class="decode_textarea" id="decode_value" name="decode_value" placeholder="在此輸入您想要「解碼」為文本的 URL 內容 ..."></textarea>
    </div>
</div>

<script>
    function encode () {
        var sMyInput = document.getElementById('encode_value').value;
        var sMyURL = encodeURI(sMyInput);
        document.getElementById('decode_value').value = sMyURL;
    };

    function decode () {
        var sMyURL = document.getElementById('decode_value').value;
        var sMyOutput = decodeURI(sMyURL);
        document.getElementById('encode_value').value = sMyOutput;
    };
</script>

> # URL
> 統一資源定位符（英語：Uniform Resource Locator，縮寫：URL；或稱統一資源定位器、定位位址、URL 位址，俗稱網頁位址或簡稱網址）是網際網路上標準的資源的位址（Address），如同在網路上的門牌。它最初是由提姆·柏內茲-李發明用來作為全球資訊網的位址，現在它已經被全球資訊網協會編制為網際網路標準 RFC 1738。
> 在網際網路的歷史上，統一資源定位符的發明是一個非常基礎的步驟。統一資源定位符的語法是一般的，可延伸的，它使用美國資訊交換標準程式碼的一部分來表示網際網路的位址。統一資源定位符的開始，一般會標誌著一個電腦網路所使用的網路協定。
> - 資料來源：[統一資源定位符 - 維基百科，自由的百科全書](https://zh.wikipedia.org/wiki/url)
