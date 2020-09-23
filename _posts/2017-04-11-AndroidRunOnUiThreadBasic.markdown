---
layout       : post
image        : 
title        : Android 執行緒使用經驗談 - runOnUiThread
description  : 在 Android 執行緒的世界當中，我們可以指派工作給員工去執行，例如今天我指派了很多事情給員工 ...
date         : 2017-04-11 17:30:00
author       : kantai235
tags         :
- Android
- runOnUiThread
paginate     : true
category     : tutorial
---

在 Android 執行緒的世界當中，我們可以指派工作給員工去執行，例如今天我指派了很多事情給員工，並且交代員工每完成一件事情，就請回報你的進度給我(顯示東西到畫面上)，那就會遇到「Only the original thread that created a view hierarchy can touch its views.」這樣的錯誤訊息，從 Google 翻譯上得到的解釋是「只有創建視圖層次結構的原始線程才能觸及其視圖」。

文字上可能有點難以理解，這麼說好了，你指派了很多事情給你的員工，同時你吩咐你的員工每個進度都要做簡報，然後還要上台來報告給你聽，對這員工來說，他沒辦法承擔那麼複雜的事情，他只能全部事情做完之後，才開始做簡報、上台報告給你聽，這就有點像是你下載 100 張照片，但手機必須 100 張下載完才告訴你它下載完了，你沒辦法知道它下載到第幾張照片了，這樣並不是我們想要的解決方案。

所以換個方式來想，我們可不可以 ... 這個員工Ａ就繼續忙他的事情，但另外吩咐一個員工Ｂ負責追蹤員工Ａ的進度，並且不斷向我們報告呢？答案是可以的！這時候我們就需要使用到 runOnUiThread 這執行緒，從最簡單的範例說起，我們希望 App 一執行，就使用 runOnUiThread 來顯示 Toast 訊息。

```java
public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main); 

        runOnUiThread(new Runnable() {
            public void run() {
                Toast.makeText(this, "runOnUiThread 執行了！", Toast.LENGTH_SHORT).show();
            }
        });
    }
}
```

不過如果某個 Activity 會時常用到 runOnUiThread 的話，我們也可以用這樣的方法來寫：

```java
private void __Show_Dialog(final int progress) {
    runOnUiThread(new Runnable() {
        public void run() {
            switch (progress) {
                case 0:
                    // 創造 Dialog 的方法
                    break;
                case 1:
                    // 更新 Dialog 的方法
                    break;
                case 2:
                    // 關閉 Dialog 的方法
                    break;

                // ... 或其他自定義的方法
            }
        }
    });
}
```

不過就只有這樣簡單解釋的話，好像有點太潦草了，所以我們追回 runOnUiThread 的 Android 原始程式碼去查看，得到這樣：

```java
/**
 * Runs the specified action on the UI thread. If the current thread is the UI
 * thread, then the action is executed immediately. If the current thread is
 * not the UI thread, the action is posted to the event queue of the UI thread.
 *
 * @param action the action to run on the UI thread
 */
public final void runOnUiThread(Runnable action) {
    if (Thread.currentThread() != mUiThread) {
        mHandler.post(action);
    } else {
        action.run();
    }
}
```

大致意思是，如果現在主執行緒上再處理的是我們要做的事情，那就直接執行我們要做的事情吧！如果不是的話，那麼我們就把事情排入 UI 執行緒的隊伍當中，等待我們的事情被執行。