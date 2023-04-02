---
title: 如何在 Android 當中，引用 reCAPTCHA 來做防堵機器人的驗證。
description: >-
  Google上周五（6/9）釋出了支援Android平台的reCAPTCHA
  API，此一API採用的是Google甫於今年3月發表的隱形reCAPTCHA技術，可於背景辨識用戶是真人或機器人，去除用戶使用行動程式的障礙 ...
tags:
  - Android
  - reCAPTCHA
category:
  - 技術文件
  - Android 實務
abbrlink: 304fbec2
date: 2017-06-13 00:00:00
cover:
---

我終於畢業啦(撒花)，不過玩咖的路上是沒有停歇的，偶然在公司工程師群組看到一則的新聞：

> Google上周五（6/9）釋出了支援Android平台的reCAPTCHA API，此一API採用的是Google甫於今年3月發表的隱形reCAPTCHA技術，可於背景辨識用戶是真人或機器人，去除用戶使用行動程式的障礙。
> 新聞來源：http://www.ithome.com.tw/news/114878

面白い(有趣)！我們就來玩玩看吧，於是找到了 reCAPTCHA 的官方文件：

[SafetyNet reCAPTCHA API Android Developers](https://developer.android.com/training/safetynet/recaptcha.html#tos)

【！注意！】在開始以前，這邊有個小地方需要注意，為了能夠正常使用這個 API，你的應用程式必須在 `AndroidManifest.xml` 文件中將 `minSdkVersion` 設置為 `14` 或 `更高`。

單純看注意，一定沒有人會聽的，所以我在這邊必須再次說明，你必須在 `AndroidManifest.xml` 當中加入 `<uses-sdk android:minSdkVersion="14" />`，否則 reCAPTCHA 會完全失效！完全沒有用！完全沒有畫面，下面是我的 `AndroidManifest.xml` 配置：

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.kumagaikanta.safetynetrecaptcha">

    <uses-sdk android:minSdkVersion="14" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <meta-data android:name="com.google.android.gms.version" android:value="@integer/google_play_services_version" />

        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

至於附加服務條款什麼的 ... 畢竟是使用 Google 的服務，當你使用這的同時，就代表你同意 Google 的相關服務條款囉！好的不管他，我們得重點在如何應用。

* 1. 您必須先到 [reCAPTCHA](https://www.google.com/recaptcha/admin#androidsignup) 註冊一個 reCAPTCHA 的金鑰。
    + Label: 指鑰匙的唯一標籤，通常是您使用公司或組織的名稱。
    + Package Names: 應用程式的 Package 名稱，為了讓應用程式使用 API，您輸入的 Package 名稱必須與該應用的 Package 名稱完全匹配。

![註冊應用程式](/img/posts/AndroidSafetyNetReCAPTCHAAPI/1.png)


* 2. 註冊完畢後，您會獲得 `Site key` 與 `Secret key`，請把他們記下來，待會會使用到。

![獲取key](/img/posts/AndroidSafetyNetReCAPTCHAAPI/2.png)


* 3. 接著我們回到 Android Studio 專案當中，畢竟這是 Android 以外的服務，所以我們必須在 `build.gradle` 當中依賴我們需要的套件包到專案當中：

```gradle
apply plugin: 'com.android.application'
...
dependencies {
    compile 'com.google.android.gms:play-services-base:11.0.0'
    compile 'com.google.android.gms:play-services-basement:11.0.0'
    compile 'com.google.android.gms:play-services-safetynet:11.0.0'
    compile 'com.google.android.gms:play-services-tasks:11.0.0'
}
```
PS: 如果出現錯誤訊息，那很正常的！因為你的 IDE 應該還沒有 Install 這些套件包，只需要 Install 就可以囉，這些動作 Android Studio 都會很智慧的幫你做完。


* 4. SafetyNet API 是 Google Play 所提供的服務之一，所以如果要連接到 API，您需要創建一個 GoogleApiClient 類的實例，創建與Google Play 服務的連接後，您可以使用 Google API Client 連接到 SafetyNet API。

```java
// 必須參考這些
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.safetynet.SafetyNet;

public class MainActivity extends AppCompatActivity {

    private GoogleApiClient mGoogleApiClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // 創建 Google Api Client 實例
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addApi(SafetyNet.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();

        mGoogleApiClient.connect();
    }
}
```


* 5. 因為 SafetyNet 會連線至 Google API，所以我們必須實作 `GoogleApiClient.ConnectionCallbacks` 與 `GoogleApiClient.OnConnectionFailedListener` 介面，這邊參考了 [這篇文章](http://www.codedata.com.tw/mobile/android-tutorial-the-4th-class-3-google-services-location/) 的做法：

```java
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.safetynet.SafetyNet;

public class MainActivity extends AppCompatActivity implements GoogleApiClient.ConnectionCallbacks,
        GoogleApiClient.OnConnectionFailedListener {

    private GoogleApiClient mGoogleApiClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addApi(SafetyNet.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .build();

        mGoogleApiClient.connect();
    }

    // ConnectionCallbacks
    @Override
    public void onConnected(Bundle bundle) {
        // 已經連線到 Google Services
    }

    // ConnectionCallbacks
    @Override
    public void onConnectionSuspended(int i) {
        // Google Services連線中斷
        // int參數是連線中斷的代號
    }

    // OnConnectionFailedListener
    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        // Google Services 連線失敗
        // ConnectionResult 參數是連線失敗的資訊
    }
}
```


* 6. 為了更好 Debug，我們在實作的實例當中加入一些 Toast 與 Log 來方便我們除錯：

```java
// ConnectionCallbacks
@Override
public void onConnected(Bundle bundle) {
    // 已經連線到 Google Services
    Toast.makeText(this, "已經連線到 Google Services", Toast.LENGTH_LONG).show();
    Log.d("onConnected", "已經連線到 Google Services");
}

// ConnectionCallbacks
@Override
public void onConnectionSuspended(int i) {
    // Google Services 連線中斷
    // int 參數是連線中斷的代號
    Toast.makeText(this, "Google Services 連線中斷，連線中斷代號 " + i, Toast.LENGTH_LONG).show();
    Log.d("onConnectionSuspended", "Google Services 連線中斷，連線中斷代號 " + i);
}

// OnConnectionFailedListener
@Override
public void onConnectionFailed(ConnectionResult connectionResult) {
    // Google Services 連線失敗
    // ConnectionResult 參數是連線失敗的資訊
    Toast.makeText(this, "Google Services 連線失敗，" + connectionResult.getErrorMessage(), Toast.LENGTH_LONG).show();
    Log.w("onConnectionFailed", "Google Services 連線失敗，" + connectionResult.getErrorMessage());
}
```


* 7. 再來我們希望說，點了某顆按鈕之後，reCAPTCHA 來幫我們驗證是不是機器人，所以請在 View 上拉一個 Button，並且賦予 onClick 事件：

```java
public void ButtonOnClikc(View view) {
    final TextView tvResult = (TextView) findViewById(R.id.textView);
    Toast.makeText(this, "Button on Clikc!", Toast.LENGTH_LONG).show();
    SafetyNet.SafetyNetApi.verifyWithRecaptcha(mGoogleApiClient, "YOUR_SITE_KEY")
            .setResultCallback(new ResultCallback<SafetyNetApi.RecaptchaTokenResult>() {
                @Override
                public void onResult(final SafetyNetApi.RecaptchaTokenResult result) {
                    final Status status = result.getStatus();
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if ((status != null) && status.isSuccess()) {
                                // 驗證通過
                                tvResult.setText("isSuccess()\n");

                                if (!result.getTokenResult().isEmpty()) {
                                    tvResult.append("!result.getTokenResult().isEmpty()");
                                } else {
                                    tvResult.append("result.getTokenResult().isEmpty()");
                                }
                            } else {
                                // 驗證失敗
                                Log.e("MY_APP_TAG", "Error occurred " +
                                        "when communicating with the reCAPTCHA service.");
                                tvResult.setText("Error occurred " +
                                        "when communicating with the reCAPTCHA service.");
                            }
                        }
                    });
                }
            });
}
```


* 8. 成果大概像這樣：

## 成功連線到 Google Services
![成功連線到 Google Services](/img/posts/AndroidSafetyNetReCAPTCHAAPI/3.png)

## 啟用 reCAPTCHA 的樣子
![啟用 reCAPTCHA 的樣子](/img/posts/AndroidSafetyNetReCAPTCHAAPI/4.png)

## 驗證成功狀態
![驗證成功狀態](/img/posts/AndroidSafetyNetReCAPTCHAAPI/5.png)

## 防堵機器人驗證
![防堵機器人驗證](/img/posts/AndroidSafetyNetReCAPTCHAAPI/6.png)

## 驗證失敗狀態
![驗證失敗狀態](/img/posts/AndroidSafetyNetReCAPTCHAAPI/7.png)
