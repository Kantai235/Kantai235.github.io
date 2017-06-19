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

<style>
    canvas {
        background: #eee;
        border: 3px solid #838383;
    }
</style>

> HTML5 的 canvas 元素使用 JavaScript 在网页上绘制图像。画布是一个矩形区域，您可以控制其每一像素。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
> 內容來源：http://www.w3school.com.cn/html5/html_5_canvas.asp

是的，這次要帶給大家的是 Canvas 標籤的基礎教學，它就像一塊畫布，能讓你在 HTML 標籤當中繪圖、動畫、遊戲，那我們就來個簡單的範例吧，就是做出一款經典的打磚塊遊戲！那我們首先要建立一個畫布，這個畫布大小是 480 * 320 的大小，並且在下方會有個開始遊戲的按鈕，按下去後，才開始執行遊戲：

# HTML
```html
<!-- 建立一個 canvas 標籤，id 為 canvas_1，大小為 480 * 320 -->
<canvas id="canvas_1" width="480" height="320">
    <!-- 倘若使用者的瀏覽器並不支援 canvas，將會顯示該段內容。 -->
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button>開始遊戲</button>
```

# 實例
<canvas id="canvas_1" width="480" height="320"></canvas>
<br />
<button>開始遊戲</button>

既然是經典的打磚塊遊戲，那麼應該要會有顆球在畫布當中跑來跑去嘛！所以我們要在 button 標籤當中加入 onclikc 事件，去啟動 JavaScript 的方法：

# HTML
```html
<!-- 建立一個 canvas 標籤，id 為 canvas_1，大小為 480 * 320 -->
<canvas id="canvas_2" width="480" height="320">
    <!-- 倘若使用者的瀏覽器並不支援 canvas，將會顯示該段內容。 -->
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_2()">開始遊戲</button>
```

# JavaScript
```javascript
function canvasGameStart_canvas_2() {
    // 抓取 id 為 canvas_1 的物件。
    var canvas = document.getElementById("canvas_2");
    // 建立繪圖物件，目前只支援 2d
    var ctx = canvas.getContext("2d");

    // 球體的座標
    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    
    // 球體移動的速度
    var ballMoveX = 2;
    var ballMoveY = 2;

    function drawBall() {
        // 開始一條路徑(繪圖)，或者重置當前的路徑(繪圖)
        ctx.beginPath();
        // 繪製弧線或曲線
        ctx.arc(ballPositionX, ballPositionY, 10, 0, Math.PI * 2);
        // 繪製顏色、漸變或模式
        ctx.fillStyle = "#0095DD";
        // 填充當前的圖案
        ctx.fill();
        // 關閉當前繪圖
        ctx.closePath();
    }

    function draw() {
        // 清除畫面 clearPect(左上角的X座標, 左上角的Y座標, 寬度, 高度)
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 重新畫出球體
        drawBall();

        // 重新計算球體下一次的位置
        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }

    // setInterval(function, delay)
    // 每隔 delay 毫秒，執行輸入 function(函數)
    setInterval(draw, 10);
}
```

這邊要稍微特別解釋一下 `arc()` 這方法，可以參考下圖：

![W3C arc() image](http://www.w3school.com.cn/i/arc.gif)

```javascript
// x                = 圓中心的 X 座標。
// y                = 圓中心的 Y 座標。
// r                = 圓的半徑。
// sAngle           = 起始角度，以弧度計算。
// eAngle           = 結束角度，以弧度計算。
// counterclockwise = 定義順時針繪圖還是逆時針繪圖，True 為順時針；False 為逆時針。
context.arc(x, y, r, sAngle, eAngle, counterclockwise);
```

# 實例
<canvas id="canvas_2" width="480" height="320">
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_2()">開始遊戲</button>
<script>
function canvasGameStart_canvas_2() {
    var canvas = document.getElementById("canvas_2");
    var ctx = canvas.getContext("2d");
    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    var ballMoveX = 2;
    var ballMoveY = 2;
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballPositionX, ballPositionY, 10, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }
    setInterval(draw, 10);
}
</script>

然後那顆球就這麼的直直掉下去了，這並不是我們想要的！我們希望他碰到牆壁的時候，能夠反彈，如果更白話一點來講的話，如果球體碰到畫框的邊界，就讓球體以反方向彈回去，那麼我們會修改到 JavaScript 的一些 function：

#JavaScript
```javascript
    // 定義球體的半徑
    var ballRadius = 10;
    var ballMoveX = 2;
    var ballMoveY = 2;

    function draw() {
        // Code ...

        // 計算球體下一次 X 座標的位置
        var ballNextPositionX = ballPositionX + ballMoveX;
        // 如果碰到右邊(canvas.width-ballRadius) 或者左邊(ballRadius)
        if(ballNextPositionX > canvas.width-ballRadius || ballNextPositionX < ballRadius)
            // 改變 X 軸前進座標的方向
            ballMoveX *= -1;

        // 計算球體下一次 Y 座標的位置
        var ballNextPositionY = ballPositionY + ballMoveY;
        // 如果碰到底端(canvas.height-ballRadius) 或者頂端(ballRadius)
        if(ballNextPositionY > canvas.height-ballRadius || ballNextPositionY < ballRadius)
            // 改變 Y 軸前進座標的方向
            ballMoveY *= -1;

        // Code ...
    }
```

# 實例
<canvas id="canvas_3" width="480" height="320">
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_3()">開始遊戲</button>
<script>
function canvasGameStart_canvas_3() {
    var canvas = document.getElementById("canvas_3");
    var ctx = canvas.getContext("2d");
    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    var ballRadius = 10;
    var ballMoveX = 2;
    var ballMoveY = 2;
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        var ballNextPositionX = ballPositionX + ballMoveX;
        if(ballNextPositionX > canvas.width-ballRadius || ballNextPositionX < ballRadius)
            ballMoveX *= -1;
        var ballNextPositionY = ballPositionY + ballMoveY;
        if(ballNextPositionY > canvas.height-ballRadius || ballNextPositionY < ballRadius)
            ballMoveY *= -1;
        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }
    setInterval(draw, 10);
}
</script>

接下來我們要來繪製出給使用者操縱的板子，並且放置於底部：

# JavaScript
```javascript
    // 板子的高度及寬度
    var paddleHeight = 10;
    var paddleWidth = 75;

    // 將板子放置在底部中間
    var paddleX = (canvas.width-paddleWidth)/2;

    // 紀錄左右鍵是否被按下了
    var rightPressed = false;
    var leftPressed = false;

    // 增加事件(keydown = 當鍵盤上有按鍵被按下，keyup = 當鍵盤上有按鍵被放開)
    // addEventListener(event, function, useCapture)
    // event        = 事件名稱的字符串。
    // function     = 事件觸發後執行的函數。
    // useCapture   = 是否在捕獲階段執行。
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    // 當鍵盤上有按鍵被按下了
    function keyDownHandler(e) {
        switch(e.keyCode) {
            // 右鍵鍵盤控制代碼
            case 39:
                rightPressed = true;
                break;
            
            // 左鍵鍵盤控制代碼
            case 37:
                leftPressed = true;
                break;
        }
    }

    // 當鍵盤上有按鍵被放開了
    function keyUpHandler(e) {
        switch(e.keyCode) {
            // 右鍵鍵盤控制代碼
            case 39:
                rightPressed = false;
                break;
            
            // 左鍵鍵盤控制代碼
            case 37:
                leftPressed = false;
                break;
        }
    }

    // 繪製板子
    function drawPaddle() {
        // 開始繪製
        ctx.beginPath();
        // 繪製矩形 rect(左上方X座標, 左上方Y座標, 矩形寬度, 矩形高度)
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        // 繪製顏色、漸變或模式
        ctx.fillStyle = "#0095DD";
        // 填充當前的圖案
        ctx.fill();
        // 結束繪製
        ctx.closePath();
    }

    function draw() {
        // Code ...

        // 板子向右邊移動，但還沒超出範圍
        if(rightPressed && paddleX < canvas.width-paddleWidth)
            paddleX += 7;

        // 板子向左邊移動，但還沒超出範圍
        if(leftPressed && paddleX > 0)   
            paddleX -= 7;
        
        // Code ...
    }
```

# 實例
<canvas id="canvas_4" width="480" height="320">
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_4()">開始遊戲</button>
<script>
function canvasGameStart_canvas_4() {
    var canvas = document.getElementById("canvas_4");
    var ctx = canvas.getContext("2d");
    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    var ballRadius = 10;
    var ballMoveX = 2;
    var ballMoveY = 2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var rightPressed = false;
    var leftPressed = false;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = true;
                break;
            case 37:
                leftPressed = true;
                break;
        }
    }
    function keyUpHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = false;
                break;
            case 37:
                leftPressed = false;
                break;
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        if(rightPressed && paddleX < canvas.width-paddleWidth)
            paddleX += 7;
        if(leftPressed && paddleX > 0)   
            paddleX -= 7;
        var ballNextPositionX = ballPositionX + ballMoveX;
        if(ballNextPositionX > canvas.width-ballRadius || ballNextPositionX < ballRadius)
            ballMoveX *= -1;
        var ballNextPositionY = ballPositionY + ballMoveY;
        if(ballNextPositionY > canvas.height-ballRadius || ballNextPositionY < ballRadius)
            ballMoveY *= -1;
        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }
    setInterval(draw, 10);
}
</script>

到目前為止都還蠻正常的，但還是有些許小缺點，我們接下來希望球體碰到底下時，代表我們的板子並沒有接到球體，遊戲必須重新開始，而球體碰到我們的板子時，才執行反彈球體的動作，所以我們必須修改 `draw()` 的一些寫法：

# JavaScript
```javascript
    // 原本的寫法
    function draw() {
        // Code ...

        var ballNextPositionY = ballPositionY + ballMoveY;
        if(ballNextPositionY > canvas.height-ballRadius || ballNextPositionY < ballRadius)
            ballMoveY *= -1;
        
        // Code ...
    }
```

```javascript
    // 修改過後的寫法
    function draw() {
        // Code ...

        // 球體下一次 Y 軸的位置
        var ballNextPositionY = ballPositionY + ballMoveY;
        // 檢查球體 Y 軸位置有沒有碰到頂端
        if(ballNextPositionY < ballRadius)
            // 反轉移動方向
            ballMoveY *= -1;
        // 檢查球體 Y 軸有沒有碰到底端
        if(ballNextPositionY > canvas.height-ballRadius)
            // 再次檢查球體 Y 軸有沒有碰到板子
            if(ballPositionX > paddleX && ballPositionX < paddleX + paddleWidth)
                // 反轉移動方向
                ballMoveY *= -1; 

        // Code ...
    }
```

# 實例
<canvas id="canvas_5" width="480" height="320">
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_5()">開始遊戲</button>
<script>
function canvasGameStart_canvas_5() {
    var canvas = document.getElementById("canvas_5");
    var ctx = canvas.getContext("2d");
    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    var ballRadius = 10;
    var ballMoveX = 2;
    var ballMoveY = 2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width-paddleWidth)/2;
    var rightPressed = false;
    var leftPressed = false;
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    function keyDownHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = true;
                break;
            case 37:
                leftPressed = true;
                break;
        }
    }
    function keyUpHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = false;
                break;
            case 37:
                leftPressed = false;
                break;
        }
    }
    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBall();
        drawPaddle();
        if(rightPressed && paddleX < canvas.width-paddleWidth)
            paddleX += 7;
        if(leftPressed && paddleX > 0)   
            paddleX -= 7;
        var ballNextPositionX = ballPositionX + ballMoveX;
        if(ballNextPositionX > canvas.width-ballRadius || ballNextPositionX < ballRadius)
            ballMoveX *= -1;
        var ballNextPositionY = ballPositionY + ballMoveY;
        if(ballNextPositionY < ballRadius)
            ballMoveY *= -1;
        if(ballNextPositionY > canvas.height-ballRadius)
            if(ballPositionX > paddleX && ballPositionX < paddleX + paddleWidth)
                ballMoveY *= -1; 
        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }
    setInterval(draw, 10);
}
</script>

是的！球體如果沒有碰到我們的板子，那球體將會直直的掉下去了，球體如果碰到我們的板子，那球體將會反彈，基本物件都做好了，那我們接下來必須開始做我們的磚塊了！

# JavaScript
```javascript
    var brickRowCount       = 3;    // 磚塊列數
    var brickColumnCount    = 5;    // 磚塊行數
    var brickWidth          = 75;   // 磚塊寬度
    var brickHeight         = 20;   // 磚塊高度
    var brickPadding        = 10;   // 磚塊間隔空白
    var brickOffsetTop      = 30;   // 磚塊離上邊牆距離
    var brickOffsetLeft     = 30;   // 磚塊離左邊牆距離

    // bricks 初值為空陣列
    var bricks = [];

    // 把磚塊在螢幕上的位置保存在一個二維陣列中，共有 brickColumnCount 行，brickRowCount 列，也將用於以後的碰撞檢測
    // brickColumnCount 行迴圈
    for(column = 0; column < brickColumnCount; column++) {
        // 初值為空陣列
        bricks[column] = [];
        // brickRowCount 列迴圈
        for(row = 0; row < brickRowCount; row++)
            // 將每一個磚塊 X、Y 軸座標初始值設定 0
            bricks[column][row] = {
                x: 0,
                y: 0
            };
    }

    function drawBricks() {
        // brickColumnCount 行迴圈
        for(column = 0; column < brickColumnCount; column++) {
            // brickRowCount 列迴圈
            for(row = 0; row < brickRowCount; row++) {
                // 磚塊 X 軸 = (行數 * (磚塊寬度 + 磚塊間隔空白)) + 磚塊離左邊牆距離
                var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
                // 磚塊 Y 軸 = (列數 * (磚塊高度 + 磚塊間隔空白)) + 磚塊離上邊牆距離
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;

                // 磚塊 x 軸座標
                bricks[column][row].x = brickX;
                // 磚塊 y 軸座標
                bricks[column][row].y = brickY;

                // 開始繪製磚塊
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }

    function draw() {
        // Code ...

        // 開始繪製磚塊
        drawBricks();

        // Code ...
    }
```

# 實例
<canvas id="canvas_6" width="480" height="320">
    您的瀏覽器必須支援 HTML5 標籤語法，才能遊玩該遊戲。
</canvas>
<br />
<button onclick="canvasGameStart_canvas_6()">開始遊戲</button>
<script>
function canvasGameStart_canvas_6() {
    var canvas = document.getElementById("canvas_6");
    var ctx = canvas.getContext("2d");

    var ballPositionX = canvas.width  / 2;
    var ballPositionY = canvas.height / 2;
    
    var ballRadius = 10;
    var ballMoveX = 2;
    var ballMoveY = 2;

    var brickRowCount = 3;
    var brickColumnCount = 5;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;

    var bricks = [];

    for(column = 0; column < brickColumnCount; column++) {
        bricks[column] = [];
        for(row = 0; row < brickRowCount; row++)
            bricks[column][row] = { x: 0, y: 0};
    }

    function drawBricks() {
        for(column = 0; column < brickColumnCount; column++)
            for(row = 0; row < brickRowCount; row++) {
                var brickX = (column * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (row * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[column][row].x = brickX;
                bricks[column][row].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
    }

    var paddleHeight = 10;
    var paddleWidth = 75;
    
    var paddleX = (canvas.width-paddleWidth)/2;
    
    var rightPressed = false;
    var leftPressed = false;

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);

    function keyDownHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = true;
                break;
            
            case 37:
                leftPressed = true;
                break;
        }
    }

    function keyUpHandler(e) {
        switch(e.keyCode) {
            case 39:
                rightPressed = false;
                break;
            
            case 37:
                leftPressed = false;
                break;
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawPaddle();
        drawBricks();

        if(rightPressed && paddleX < canvas.width-paddleWidth)
            paddleX += 7;
        else if(leftPressed && paddleX > 0)
            paddleX -= 7;
        
        var ballNextPositionX = ballPositionX + ballMoveX;
        if(ballNextPositionX > canvas.width-ballRadius || ballNextPositionX < ballRadius)
            ballMoveX *= -1;

        var ballNextPositionY = ballPositionY + ballMoveY;
        if(ballNextPositionY < ballRadius)
            ballMoveY *= -1;
        if(ballNextPositionY > canvas.height-ballRadius)
            if(ballPositionX > paddleX && ballPositionX < paddleX + paddleWidth)
                ballMoveY *= -1; 

        ballPositionX += ballMoveX; 
        ballPositionY += ballMoveY;
    }

    setInterval(draw, 10);
}
</script>





# 參考資料
+ [網頁2D遊戲開發-以打磚塊遊戲為例](http://newsletter.ascc.sinica.edu.tw/news/read_news.php?nid=3745)
+ [W3school 在線教程](http://www.w3school.com.cn/index.html)
+ [Mozilla Developer Network](https://developer.mozilla.org/zh-TW/)