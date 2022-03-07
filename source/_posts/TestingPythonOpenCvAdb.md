---
cover: /img/banners/TestingPythonOpenCvAdb.png
title: 利用 Python + OpenCV + ADB 實現 Android 模擬器控制，以彈射世界 World Flipper 為例，測試篇
description: >-
  透過安裝篇的文章，我們已經將 Python、OpenCV、ADB 這些環境處理完畢了，接下來我們需要進行測試，測試 ADB
  是否能夠抓取模擬器的螢幕截圖、測試 OpenCV 是否能夠抓取我們所想要的圖片，並且計算其位置、其準確率 ...
tags:
  - python
  - opencv
  - adb
  - android
  - testing
category:
  - 技術文件
  - Python 實務
abbrlink: 80007d8
date: 2021-11-27 00:00:00
---

# 系列文章
- [安裝篇](https://blog.init.engineer/posts/InstallPythonOpenCvAdb/)
- [測試篇(目前這篇)](https://blog.init.engineer/posts/TestingPythonOpenCvAdb/)
- [操作篇](https://blog.init.engineer/posts/UsingPythonOpenCvAdb/)

透過安裝篇的文章，我們已經將 Python、OpenCV、ADB 這些環境處理完畢了，接下來我們需要進行測試，測試 ADB 是否能夠抓取模擬器的螢幕截圖、測試 OpenCV 是否能夠抓取我們所想要的圖片，並且計算其位置、其準確率。

# 測試 ADB 截圖
首先第一步我們需要測試的是「測試 ADB 是否能夠抓取模擬器的螢幕截圖」，這邊我們會需要 `import os` 引入，並且透過 `os.popen` 去呼叫 adb 指令來進行模擬器截圖、模擬器輸出圖片的動作。

```python
import os

if __name__ == '__main__':
    # 讓程式持續運作
    while True:
        # 透過 adb 去將模擬器截圖起來儲存於 sdcard 當中
        os.system('adb shell /system/bin/screencap -p /sdcard/screencap.png')
        # 透過 adb 將模擬器儲存的截圖輸出到專案根目錄底下
        os.system('adb pull /sdcard/screencap.png ./screencap.png')
```

不過我們會發現終端機不斷地輸出訊息如下:

```text
/sdcard/screencap.png: 1 file pulled, 0 skipped. 38.9 MB/s (401994 bytes in 0.010s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 47.1 MB/s (468572 bytes in 0.009s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 41.2 MB/s (469204 bytes in 0.011s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 22.9 MB/s (467375 bytes in 0.019s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 56.3 MB/s (468928 bytes in 0.008s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 48.3 MB/s (468177 bytes in 0.009s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 46.9 MB/s (468718 bytes in 0.010s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 53.9 MB/s (468843 bytes in 0.008s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 55.6 MB/s (468152 bytes in 0.008s)
/sdcard/screencap.png: 1 file pulled, 0 skipped. 41.6 MB/s (468735 bytes in 0.011s)
```

如果我們希望系統不要輸出這些資訊，那我們就要換另一種寫法，使用 `subprocess` 的 `check_output` 來呼叫 adb 指令。

```python
import os

if __name__ == '__main__':
    # 讓程式持續運作
    while True:
        # 透過 adb 去將模擬器截圖起來儲存於 sdcard 當中
        subprocess.check_output('adb shell /system/bin/screencap -p /sdcard/screencap.png', shell=True)
        # 透過 adb 將模擬器儲存的截圖輸出到專案根目錄底下
        subprocess.check_output('adb pull /sdcard/screencap.png ./screencap.png', shell=True)
```

這樣我們就可以在根目錄底下獲得 `screencap.png` 這個螢幕截圖了，而且根據程式持續運作，這張截圖會不斷更新模擬器最新的畫面，既然我們現在已經能將模擬器實時截圖並輸出到專案的根目錄當中了，那麼接下來我們需要測試 OpenCV 能不能偵測我們想要的目標物件，並且將目標物件透過畫框的方式繪製出範圍。

# 測試 OpenCV 偵測物件
首先我們需要有一個主要的螢幕截圖，這裡我們稱做 `screencap.png`，以及我們的目標 `prepared.png`，而我們希望達成的事情是透過 OpenCV 去找尋 `screencap.png` 當中有沒有符合 `prepared.png` 的地方，其座標、相符率有多少。

![物件與截圖範例](/img/posts/CWouOMG.png)

首先我們需要 `import cv2` 引入，然後透過 `cv2.imread` 來載入 `screencap.png` 螢幕截圖以及載入 `prepared.png` 目標物件，再來透過 `cv2.matchTemplate` 來計算 `screencap.png` 螢幕截圖當中，與 `prepared.png` 目標物件有多少相符率，以及其座標位置，再來透過 `cv2.rectangle` 來繪製目標物件的位置及大小，最後以 `cv2.imwrite` 的方式來輸出圖片並儲存為 `output.png`，整個流程到處都會使用到 `cv2` 的功能。

```python
import cv2

if __name__ == '__main__':
    # 讓程式持續運作
    while True:
        # 螢幕截圖
        screenshot = cv2.imread('./screencap.png')
        # 目標取樣
        prepared = cv2.imread('./prepared.png')
        
        # matchTemplate(image, templ, method[, result])
        #   - image
        #       - 被尋找的圖片，必須為 8-bit or 32-bit
        #   - templ
        #       - 尋找的物品圖片，size 不能大於 image，且格式需一致
        #   - method
        #       - 比對的方法
        #           - TM_SQDIFF         | 平方差，越小越相似
        #           - TM_SQDIFF_NORMED  | 正規化平方差，越小越相似
        #           - TM_CCORR          | 相關係數，越大越相似
        #           - TM_CCORR_NORMED   | 正規化相關係數，越大越相似
        #           - TM_CCOEFF         | 去掉直流成份的相關係數，越大越相似
        #           - TM_CCOEFF_NORMED  | 正規化 去掉直流成份的相關係數
        #   - result
        #       - 比較的結果，格式為 numpy.ndarray (dtype=float32)
        result = cv2.matchTemplate(screenshot, prepared, cv2.TM_CCORR_NORMED)
        
        # 取得搜尋結果最大值、最小值
        # 計算矩陣 Mat 中最大值、最小值、返回最大最小的索引
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

        # TM_CCORR_NORMED 最大值
        mat_top, mat_left = max_loc
        
        # 取得目標取樣的高度及寬度
        # image.shape = (height, width, channels)
        prepared_height, prepared_width, prepared_channels = prepared.shape
        
        # 取得需要繪製終點的右下位置(左上 + 高, 左上 + 寬)
        bottom_right = (mat_top + prepared_width, mat_left + prepared_height)
        
        # 繪製長方形(左上 + 高, 左上 + 寬)
        # rectangle(繪製物件, 繪製的起始位置(x, y), 繪製的終點位置(x, y), 繪製顏色(RGB), 線條寬度)
        cv2.rectangle(screenshot, (mat_top, mat_left), bottom_right, (101, 67, 196), 2)

        # 輸出圖片結果
        cv2.imwrite('./output.png', screenshot)
```

透過這樣的程式碼，我們可以獲得一個非常成功的輸出結果。

![輸出後的結果](/img/posts/twAWabxQ.png)

但目前這樣有個缺點，在畫面有我們所想找的目標物件時，OpenCV 可以精確地找到目標物件的位置，但如果目前畫面沒有目標物件時，OpenCV 仍然會找出相似度最高的物件，這會導致我們的程式一直在判斷錯誤的地方執行觸發，直到有正確目標物件出現時才能觸發正確的事件，為了避免這樣的情況發生，我們必須去比對 `max_val` 這項數值，這項數值意旨目標物件的相似率，所以我們可以這樣設計，先讓 OpenCV 去計算目標物件，然後判斷 `max_val` 這項數值有沒有大於一定的百分比，如果有才進行動作，並且結合前面 adb 擷取螢幕截圖的部份的話，我們就可以寫出一個實時監控的程式。

```python
import cv2

if __name__ == '__main__':
    # 讓程式持續運作
    while True:
        subprocess.check_output('adb shell /system/bin/screencap -p /sdcard/screencap.png', shell=True)
        subprocess.check_output('adb pull /sdcard/screencap.png ./screencap.png', shell=True)

        screenshot = cv2.imread('./screencap.png')
        prepared = cv2.imread('./prepared.png')
        result = cv2.matchTemplate(screenshot, prepared, cv2.TM_CCORR_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)

        if max_val >= 0.99:
            mat_top, mat_left = max_loc
            prepared_height, prepared_width, prepared_channels = prepared.shape
            bottom_right = (mat_top + prepared_width, mat_left + prepared_height)
            cv2.rectangle(screenshot, (mat_top, mat_left), bottom_right, (101, 67, 196), 2)
            cv2.imwrite('./output.png', screenshot)
```

到這邊為止，測試篇的內容就差不多了，我們測試了 adb 對模擬器的控制，以及 OpenCV 去判斷截圖的偵測，下一篇將講述如何結合 OpenCV 並透過 adb 去控制模擬器，做出相對應的動作。

下一篇文章：[操作篇](https://blog.init.engineer/posts/UsingPythonOpenCvAdb/)
