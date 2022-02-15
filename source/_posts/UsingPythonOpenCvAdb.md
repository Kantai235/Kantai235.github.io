---
cover : /img/banners/UsingPythonOpenCvAdb.png
title : 利用 Python + OpenCV + ADB 實現 Android 模擬器控制，以彈射世界 World Flipper 為例，操作篇
description : 最近在研究如何透過 OpenCV 來偵測畫面物件，並透過 ADB 來對 Android 模擬器做控制的動作，不過在此之前需要先做一個聲明，以下研究皆以學習、研究為目的 ...
date : 2021-11-28
tags :
  - python
  - opencv
  - adb
  - android
  - using
category :
  - 技術文件
  - Python 實務
---

# 系列文章
- [安裝篇](https://kantai235.github.io/InstallPythonOpenCvAdb/)
- [測試篇](https://kantai235.github.io/TestingPythonOpenCvAdb/)
- [操作篇(目前這篇)](https://kantai235.github.io/UsingPythonOpenCvAdb/)

透過前面兩篇(安裝篇、測試篇)文章，我們建立了 Python 的環境、使用了 adb 控制模擬器，以及透過 OpenCV 來抓出需要點擊的物件，接下來我們需要直接實際操作模擬器，並且做出一個可模組化的程式。

![展示頁面](/img/posts/yNBwqXy.png)

首先我們可以先讓透過 adb 自動擷取模擬器截圖的動作抽離出來，做成一個 `screenshot()` 的方法，只要執行這個方法，就會自動執行 adb 指令將模擬器截圖並輸出:

```python
def screenshot():
    subprocess.check_output('adb shell /system/bin/screencap -p /sdcard/screencap.png', shell=True)
    subprocess.check_output('adb pull /sdcard/screencap.png ./screencap.png', shell=True)
```

再來我們可以把透過 OpenCV 程式判斷這件事情抽離出來，做成一個 `scan_screenshot(prepared)` 的方法，每次只要丟目標物件進去，程式就自動抓取截圖，並且將判斷回傳:

```python
def scan_screenshot(prepared):
    screenshot = cv2.imread('./cache/screencap.png')
    result = cv2.matchTemplate(screenshot, prepared, cv2.TM_CCORR_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    return {'screenshot': screenshot, 'min_val': min_val, 'max_val': max_val, 'min_loc': min_loc, 'max_loc': max_loc}
```

最後我們只需要再寫一個自動計算目標物件方位的方法，把 OpenCV 的計算結果丟進去，然後自動算出 x, y 座標:

![物件與截圖範例](/img/posts/CWouOMG.png)

```python
def calculated(result, shape):
    mat_top, mat_left = result['max_loc']
    prepared_height, prepared_width, prepared_channels = shape

    x = {
        'left': int(mat_top),
        'center': int((mat_top + mat_top + prepared_width) / 2),
        'right': int(mat_top + prepared_width),
    }

    y = {
        'top': int(mat_left),
        'center': int((mat_left + mat_left + prepared_height) / 2),
        'bottom': int(mat_left + prepared_height),
    }

    return {
        'x': x,
        'y': y,
    }
```

接著就是將上面抽離出來的方法並實際應用即可，再這邊舉兩個例子，分別是判斷目標物件並執行點擊，以及判斷目標物件，再進行二次判斷才執行點擊:

```python
if __name__ == '__main__':
    while True:
        # 不斷刷新模擬器截圖
        screenshot()


        # 範例一、判斷目標物件並執行點擊
        # 先從圖庫當中，找出你想偵測的圖片
        target = cv2.imread('./images/XXX.png')
        # 丟去跟畫面做比對
        result = scan_screenshot(target, screen)
        # 判斷畫面是否有跟圖片相符
        if result['max_val'] > 0.9999:
            # 對模擬器按圖片的中心點位置
            points = util.calculated(result, target.shape)
            subprocess.check_output('adb shell input tap %d %d' % (x, y), shell=True)


        # 範例二、判斷目標物件，再進行二次判斷才執行點擊
        # 先從圖庫當中，找出你想偵測的圖片(1)
        target = cv2.imread('./images/XXX(1).png')
        # 把圖片(1)丟去跟畫面做比對
        result = scan_screenshot(target, screen)
        # 判斷畫面是否有跟圖片相符
        if result['max_val'] > 0.9999:
            print('[偵測] 有正在進行的任務，要繼續進行該任務嗎？')
            # 先從圖庫當中，找出你想偵測的圖片(2)
            target = cv2.imread('./images/XXX(2).png')
            # 把圖片(2)丟去跟畫面做比對
            result = scan_screenshot(target, screen)
            # 對模擬器按圖片的中心點位置
            points = calculated(result, target.shape)
            subprocess.check_output('adb shell input tap %d %d' % (x, y), shell=True)
```

以目前這樣的程式來講，仍然有一些問題所在，舉例來說透過 adb 對模擬器進行截圖並儲存起來，再透過 OpenCV 去讀取截圖的這個動作，會對硬碟造成大量讀寫的問題發生，這可能會導致硬碟壽命快速凋零，因此針對這樣的問題也有一個解決方案，就是不要直接將截圖儲存，而是讓它直接在程式之間傳送，走的是記憶體而不是硬碟。

```python
def screenshot():
    pipe = subprocess.Popen("adb shell screencap -p", stdin=subprocess.PIPE, stdout=subprocess.PIPE, shell=True)
    image_bytes = pipe.stdout.read().replace(b'\r\n', b'\n')
    image = cv2.imdecode(numpy.fromstring(image_bytes, numpy.uint8), cv2.IMREAD_COLOR)
    return image
```

這樣呼叫 `screenshot()` 方法就可以直接得到當前模擬器的截圖畫面，就可以直接在 `scan_screenshot()` 判斷目標物件的環節當中，直接去抓取當前模擬器截圖去取代讀取模擬器截圖的動作。

```python
def scan_screenshot(prepared):
    screenshot = screenshot()
    result = cv2.matchTemplate(screenshot, prepared, cv2.TM_CCORR_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
    return {'screenshot': screenshot, 'min_val': min_val, 'max_val': max_val, 'min_loc': min_loc, 'max_loc': max_loc}
```

到這邊利用 Python + OpenCV + ADB 實現 Android 模擬器控制就差不多告一段落，如果更伸下去著墨的話，還可以有很多花樣可以探索，就留給大家去摸索了。
