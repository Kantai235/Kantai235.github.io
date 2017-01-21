---
layout     : post
title      : "如何在 Android 裡的 Thread 當中更新 UI 元件"
subtitle   : "在 Android 的世界當中，我們時常會運用到各種畫面上的元件 ..."
date       : 2017-01-10 12:00:00
author     : "乾太 ₍₍ ◝(･◡･)◟ ⁾⁾"
tags       : Android runOnUiThread() 教學
comments   : true
signature  : true
---

在 [Android](https://developer.android.com/index.html) 的世界當中，我們時常會運用到各種畫面上的元件，尤其是 Dialog 這種東西，如果有在開發介接第三方 API 應用程式的話，一定會碰到 json 格式的資料傳遞，而在 Android 當中，必須利用 try catch 將其包起來，以防例外錯誤的發生，但在這情況下，如果你使用了 Dialog 或其他各種 UI 元件來顯示訊息的話，Android 會跳出來告訴你說：

`Android : 「歐歐！你不能在執行緒當中更新你的畫面。」`

紙上談兵好像不是很好，所以我們直接來實際案例吧！我們試試看寫一個空的 Android 專案，然後這個 App 一執行的時候，就 show 出 Dialog 告訴我程式執行完畢。

![顯示 Dialog](http://i.imgur.com/F58dj6D.png)

程式碼也很簡單，就只有在 onCreate 去顯示一個 Dialog：

```java
package com.example.kantai.runonuithread;

import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        new AlertDialog.Builder(this).setTitle("Title").setMessage("Message").create().show();
    }
}
```

接下來我們考慮到說，我們可能會抓取網路上的資料，並且以 Json 作為主要傳遞格式，不過在 Android 當中，如果要解析 Json 就必須使用 try catch 包起來做處理，所以我們定義一個 Json 資料，格式大概是：

```json
{
    "Title" : "每日頭條",
    "Message" : "全民喝好茶，激夯！"
}
```

很簡單的 Json 範例，接下來我們在 onCreate() 當中解析這個 Json 資料，並且將資料塞入 Dialog 當中、並顯示出來：

![利用 Dialog 顯示 Json 的資料](http://i.imgur.com/klYcSQD.png)

```java
package com.example.kantai.runonuithread;

import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import org.json.JSONException;
import org.json.JSONObject;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        try {
            String __jsonData = "{\"Title\":\"每日頭條\",\"Message\":\"全民喝好茶，激夯！\"}";
            JSONObject jsonObject = new JSONObject(__jsonData);
            new AlertDialog.Builder(this)
                    .setTitle(jsonObject.getString("Title"))
                    .setMessage(jsonObject.getString("Message"))
                    .create()
                    .show();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

}
```

試不出錯誤，未完待續。