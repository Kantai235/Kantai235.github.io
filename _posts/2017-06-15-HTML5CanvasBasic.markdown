---
layout     : post
title      : "如何利用 JavaScript 在 HTML5 的 Canvas 標籤中繪圖 - 基礎教學"
subtitle   : "HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，您可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法 ..."
date       : 2017-06-14 09:00:00
author     : "乾太 ₍₍ ◝(･◡･)◟ ⁾⁾"
tags       : HTML5 JavaScript JS Canvas Basic 教學 標籤 網頁 基礎教學
comments   : true
signature  : true
---

> HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，您可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
> 內容來源：http://www.w3school.com.cn/html5/html_5_canvas.asp

是的，這次要帶給大家的是 Canvas 標籤的基礎教學，它就像一塊畫布，能讓你在 HTML 標籤當中繪圖、動畫、遊戲，那我們就來個簡單的範例吧，我想建立一個畫布，這個畫布大小是 400 * 400 的大小，並且在裡面畫出一個綠色框框：

# HTML
```html
<canvas id="canvas" class="center" width="400" height="400" style="border: 1px solid #d3d3d3;">您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。</canvas>
```

# JavaScript
```javascript
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

ctx.fillStyle = "green";
ctx.fillRect(10, 10, 100, 100);
```

<canvas id="canvas_1"></canvas>
<script>
    var canvas = document.getElementById("canvas_1");
    var ctx = canvas.getContext("2d");

    ctx.fillStyle = "green";
    ctx.fillRect(10, 10, 100, 100);
</script>

