---
layout       : post
image        : 
title        : Android 執行緒使用經驗談 - HandlerThread
description  : 單執行緒應用程式，就像單向車道般的常常塞車，但多執行緒的應用程式，就會像高速公路般的順暢流利 ...
date         : 2017-03-28 17:30:00
author       : kantai235
tags         :
- Android
- HandlerThread
paginate     : true
category     : tutorial
---

單執行緒的應用程式，就像一條單向車道般，有時候剛好碰到對向車道可能會塞車，可是雙執行緒的應用程式，他就像高速公路般，可以使得你的應用程式非常順暢。

你可以把整個作業系統理解成一家公司，而「執行緒」就是你的員工，你底下有許多位員工，你今天可以派發一件或多件工作給你的員工。

我們以 Android 作為範例(當然也適用於 Java)，先從做一件工作開始：

```java
public class MainActivity extends Activity {

    // 指定一件工作(Thread)
    private Thread __ThreadStudy;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); 

        // 指定 __ThreadStudy 這工作的工作內容為 __Study
        this.__ThreadStudy = new Thread(__Study);

        // 開始執行 __ThreadStudy 這件工作
        this.__ThreadStudy.start();
    }

    // 數數字的工作內容
    private Runnable __Study = new Runnable() {
        public void run() {
            for (int i = 0; i < 1000; i++);
        }
    };
}
```

不過這樣會面臨一個問題，當這個 Activity 結束時，在執行緒的地方上會發生錯誤，原因是因為 Study 這項工作並沒有結束，我們必須搭配 interrupt，告訴我們的 Study 該休息了：

```java
@Override
protected void onDestroy() {
    super.onDestroy();

    // 如果 __ThreadStudy 這項工作並不是 null
    if (this.__ThreadStudy != null)
        // 哈囉，這項工作該結束了。
        this.__ThreadStudy.interrupt();
}
```

這樣有了工作內容的概念以後，我們接下來要開始思考，如何僱請一位員工，並且開始請這位員工做些事情呢？這時候我們就要動用到 Handler 以及 HandlerThread，你可以把 Handler 想像成你自己，然後 HandlerThread 想像成是你的員工，你必須指派 Thread 工作內容給你的員工：

```java
public class MainActivity extends Activity {

    // 我們有一位老闆 _Handler
    private Handler __Handler;
    
    // 我們有一位員工 __HandlerThread
    private HandlerThread __HandlerThread;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); 

        // __HandlerThread 這位員工的名字叫做 HandlerThread
        this.__HandlerThread = new HandlerThread("HandlerThread");

        // 讓員工動起來，準備開始工作了！
        this.__HandlerThread.start();

        // 告訴 HandlerThread 這位工人，你的老闆是 _Handler
        this.__Handler = new Handler(__HandlerThread.getLooper());

        // 請老闆指派工作(數數字的工作)給員工
        this.__Handler.post(__Study);
    }

    // 數數字的工作內容
    private Runnable __Study = new Runnable() {
        public void run() {
            for (int i = 0; i < 1000; i++);
        }
    };

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // 如果 __HandlerThread 這員工並不是 null
        if (this.__HandlerThread != null)
            // 哈囉，你的工作結束囉！
            this.__HandlerThread.removeCallbacks(__Study);

        // 如果 __Handler 這老闆並不是 null
        if (this.__Handler != null)
            // 哈囉，該讓員工下班囉！
            this.__Handler.quit();
    }
}
```

HandlerThread 的基本教學大概就這樣，之後還有 runOnUiThread、Service、Broadcast ... 之類的可以寫 XD