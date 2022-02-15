---
cover :
title : Java 或 Android 上的 Json 基本教學
description : 很多應用程式開發時，傳遞都會使用 Json 作為規範格式，像是 Plurk API、Facebook API ...
date : 2017-01-09
tags :
  - Android
  - JSON
category :
  - 技術文件
  - Android 實務
---

很多應用程式開發時，傳遞都會使用 Json 作為規範格式，像是 Plurk API、Facebook API ... 等等，都是採用 Json 作為傳遞格式，因為它具備輕量化、易於閱讀的優點，其他詳細內容就不多做介紹了，詳細說明請見 [JSON (JavaScript Object Notation)](https://zh.wikipedia.org/wiki/JSON) 維基百科吧！

Json 格式以 Object、Array 作為兩大形式，用法如下：

一、物件形式 {}

```json
{
    "Key1": "Value1",
    "Key2": "Value2"
}
```

二、陣列刑式 []

```json
[
    "Value1",
    "Value2"
]
```

再來介紹 Json 支援的型態，總共有 String、Number、Boolean，用法如下：

一、String 字串 型態

```json
{
    "Key": "Value"
}
```

二、Number 整數 型態

```json
{
    "Key": 0
}
```

三、Boolean 布林 型態

```json
{
    "Key": true
}
```

既然基本教學都講完了，那我們來個簡單的隨堂小練習吧！我希望定義一個 Json 格式，這格式會傳遞每間教室的詳細資料(教室編號、教室名稱)，每間教室還會記載歸屬學生的資料(學生編號、學生姓名)，那這樣的 Json 該如何定義呢？

如果是我的話，我大概會想這樣定義：

```json
[
    {
        "教室資訊 (Class Detail)" : {
            "教室編號 (Class Number)" : "",
            "教室名稱 (Class Name)" : ""
        },
        "學生資訊 (Student Detail)" : [
            {
                "學生編號 (Student Number)" : "",
                "學生名稱 (Student Name)" : ""
            }
        ]
    }
]
```

當然方法有很多種！我只是其中一種方法而已，我們接下來看看用那樣的方法會變成什麼樣子吧！

假設有三間教室，編號分別為 Class01、Class02、Class03

>電腦教室 (Class01) 的學生：<br />
>*   Student0101 小明1號<br />
>*   Student0102 小明2號<br />
>*   Student0103 小明3號<br />
>*   Student0104 小明4號

>音樂教室 (Class02) 的學生：<br />
>*   Student0201 小智1號<br />
>*   Student0202 小智2號

>童軍教室 (Class03) 的學生：<br />
>*   Student0301 小春1號<br />
>*   Student0302 小春2號<br />
>*   Student0303 小春3號

```json
[
    {
        "ClassDetail" : {
            "ClassNumber" : "Class01",
            "ClassName" : "電腦教室"
        },
        "StudentDetail" : [
            {
                "StudentNumber" : "Student0101",
                "StudentName" : "小明1號"
            },
            {
                "StudentNumber" : "Student0102",
                "StudentName" : "小明2號"
            },
            {
                "StudentNumber" : "Student0103",
                "StudentName" : "小明3號"
            },
            {
                "StudentNumber" : "Student0104",
                "StudentName" : "小明4號"
            }
        ]
    },
    {
        "ClassDetail" : {
            "ClassNumber" : "Class02",
            "ClassName" : "音樂教室"
        },
        "StudentDetail" : [
            {
                "StudentNumber" : "Student0201",
                "StudentName" : "小智1號"
            },
            {
                "StudentNumber" : "Student0202",
                "StudentName" : "小智2號"
            }
        ]
    },
    {
        "ClassDetail" : {
            "ClassNumber" : "Class03",
            "ClassName" : "童軍教室"
        },
        "StudentDetail" : [
            {
                "StudentNumber" : "Student0301",
                "StudentName" : "小春1號"
            },
            {
                "StudentNumber" : "Student0302",
                "StudentName" : "小春2號"
            },
            {
                "StudentNumber" : "Student0303",
                "StudentName" : "小春3號"
            }
        ]
    }
]
```

接下來就要進入我們的主題囉！該如何在 Java 或 Android 當中，讀取 Json 的資料呢？我們先預想一整條 Json 就是一整串 String 字串吧！從最外層來看，這整個所有資料是包在一個 Json Array 當中，所以我們必須使用 JSONArray 來做初次的處理：

```java
// (1.) 將 JSON String 解析為 JSONArray
JSONArray jsonArray = new JSONArray("Your Json String");
```

解析完 JSONArray 之後，每個教室都是用 JSONObject 給包起來的，再來如果想要批次的把每間教室一條一條讀出來，我們就可以這樣做：

```java
// (1.) 將 JSON String 解析為 JSONArray
JSONArray jsonArray = new JSONArray("Your Json String");
// (2.) 利用 for 來將每一筆 JSONObject 給讀出來
for (int i = 0; i < jsonArray.length(); i++) {
    // (2.) 取得每一條 教室(JSONObject)
    JSONObject jsonObject = jsonArray.getJSONObject(i);
    // (2.) 取得 教室(JSONObject) 當中 "教室資訊(ClassDetail)" 這項 JSONObject
    JSONObject classDetailJson = jsonObject.getJSONObject("ClassDetail"); 
    // (2.) 取得 教室資訊(ClassDetail) 當中的 教室編號(ClassNumber)
    System.out.println("ClassNumber => " + classDetailJson.getString("ClassNumber"));
    // (2.) 取得 教室資訊(ClassDetail) 當中的 教室名稱(ClassName)
    System.out.println("ClassNumber => " + classDetailJson.getString("ClassName"));
}
```

當然我們讀完教室後，我們還可以再來讀教室裡面的學生！因為封裝的方法是把 學生(Data) 包成 JSONObject，然後把 學生們(JSONObject) 包成 JSONArray，然後把 學生們(JSONArray) 掛載在所屬的教室當中，所以現在我們要逆著解析回來：

```java
// (1.) 將 JSON String 解析為 JSONArray
JSONArray jsonArray = new JSONArray("Your Json String");
// (2.) 利用 for 來將每一筆 JSONObject 給讀出來
for (int i = 0; i < jsonArray.length(); i++) {
    // (2.) 取得每一條 教室(JSONObject)
    JSONObject jsonObject = jsonArray.getJSONObject(i);
    // (2.) 取得 教室(JSONObject) 當中 "教室資訊(ClassDetail)" 這項 JSONObject
    JSONObject classDetailJson = jsonObject.getJSONObject("ClassDetail"); 
    // (2.) 取得 教室資訊(ClassDetail) 當中的 教室編號(ClassNumber)
    System.out.println("ClassNumber => " + classDetailJson.getString("ClassNumber"));
    // (2.) 取得 教室資訊(ClassDetail) 當中的 教室名稱(ClassName)
    System.out.println("ClassNumber => " + classDetailJson.getString("ClassName"));

    // (3.) 取得 學生們(JSONArray) 的資料
    JSONArray students = jsonObject.getJSONArray("StudentDetail");
    // (3.) 利用 for 來將每一筆 學生(JSONObject) 給讀出來
    for (int i = 0; i < jsonArray.length(); i++) {
        // (3.) 取得每一位 學生(Student)
        JSONObject student = students.getJSONObject(i);
        // (3.) 取得 學生(Student) 當中的 學生編號(StudentNumber)
        System.out.println("StudentNumber => " + student.getString("StudentNumber"));
        // (3.) 取得 學生(Student) 當中的 學生名稱(StudentName)
        System.out.println("StudentName => " + student.getString("StudentName"));
    }
}
```

以上大約為在 Java 或 Android 當中，該如何讀取、解析 Json 的教學，至於還有沒有進階用法嘛 ... 大概就 ...

```java
/**
 * 判斷是否為 Null
 * @return Boolean
 */
JSONObject.isNull("Key");

/**
 * 取得所有的 Key
 * @return <String>
 */
JSONObject.keys();
```

如果你真的對 org.json 很有興趣，那也當然歡迎多看看 [org.json](https://developer.android.com/reference/org/json/package-summary.html) 的相關資料 ...

另外 乾太先生 很喜歡用一套線上 JSON 編輯器，也一起分享給大家：[JSON Editor Online](http://www.jsoneditoronline.org)