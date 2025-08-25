---
layout: "simple"
---

# 嗨囉！這裡是乾太🦊

{{< lead >}}
台灣獸、台南獸、胖胖、宅宅、電波！

獸設是一隻咖啡色與黃色的狐狸，是個不折不扣的獸控，對於毛茸茸、可愛、胖胖的獸獸完全沒有抵抗力。

怕生，特別怕生，也很被動，躲在箱子會覺得很安全，但是不會亂咬人。

工作是在公司裡面當個稱職的掃地工，偶爾寫一點程式。
{{< /lead >}}

{{< kemono-setup >}}
{{< kemono-interface >}}

<div class="kemono-container">
  <!-- 背景圖片容器 -->
  <div id="background-after" class="kemono-background active">
    <img id="background-img-after" alt="現在的設定背景">
  </div>
  <div id="background-before" class="kemono-background">
    <img id="background-img-before" alt="以前的設定背景">
  </div>

  <!-- Tab 切換按鈕 -->
  <div class="kemono-tabs">
    <button class="kemono-tab active" data-tab="after">現在的設定</button>
    <button class="kemono-tab" data-tab="before">以前的設定</button>
  </div>

  <!-- Tab 內容 -->
  <div id="tab-after" class="kemono-tab-content active">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      <div class="flex flex-col md:flex-row gap-8 mb-6">
        {{< artwork-gallery collection="kemono.after.gallery" class="mt-0 mb-0 rounded-lg shadow-lg" >}}
      </div>
      {{< artwork-gallery collection="kemono.after.artworks" class="grid-w50 md:grid-w33 xl:grid-w25 rounded-lg shadow-lg" >}}
    </div>
  </div>

  <div id="tab-before" class="kemono-tab-content">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      <div class="flex flex-col md:flex-row gap-8 mb-6">
        {{< artwork-gallery collection="kemono.before.gallery" class="mt-0 mb-0 rounded-lg shadow-lg" >}}
      </div>
      {{< artwork-gallery collection="kemono.before.artworks" class="grid-w50 md:grid-w33 xl:grid-w25 rounded-lg shadow-lg" >}}
    </div>
  </div>
</div>

## 喜好與興趣

### 飲料
- **咖啡**: 黑咖啡、拿鐵、不要奶精、不要加糖
- **抹茶**: 特別喜歡宇治丸久小山園的五十鈴

### 拉麵
- **台南 - 寶來軒**: 超濃厚 mega 豚拉麵、豚骨魚介沾麵
- **台南 - 俺貳拉麵**: 特製濃厚豬雞魚介沾麵
- **高雄 - 麵屋翔**: 特製 SP 濃湯、叉燒飯
- **京都 - 貝だし麺きた田**: 蛤ラーメン

### 遊戲
- **PS5 Pro**: 死亡擱淺、對馬戰鬼、宇宙機器人、艾爾登法環、隻狼
- **NS2**: 薩爾達傳說、空洞騎士、寶可夢
- **PC**: Final Fantasy XIV
- **手機遊戲**: Pokémon TCG Pocket、Project XXL、女神異聞錄：夜幕魅影

## 喜歡與討厭
- 聊天有時候喜歡使用**注音文**、**顏文字**、**Emoji**、**貼圖**
- 相處得越熟，越沒有禮貌、直來直往，反之越討厭會表現得越禮貌
- 討厭噪音，常態性透過降躁耳機來讓自己處於寧靜狀態

## 聯絡與交流

歡迎來敲敲乾太哦 ฅ^•ﻌ•^ฅ

Email: kantai.developer@gmail.com

{{< social-links mainTitle="較常使用" othersTitle="其他" >}}
