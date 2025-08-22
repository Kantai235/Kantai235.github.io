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

{{< load-images 
  backgroundAfter="img/kemono/after/background.jpg"
  backgroundBefore="img/kemono/before/background.jpg"
  avatarAfter="img/kemono/after/artworks/magicpika1_1.jpg"
  avatarBefore="img/kemono/before/background.jpg"
  artworkAfter1="img/kemono/after/artworks/guruminn_1.jpg"
  artworkAfter2="img/kemono/after/artworks/magicpika1_1.jpg"
  artworkBefore1="img/kemono/before/artworks/cs637894_1.jpg"
  artworkBefore2="img/kemono/before/artworks/cs637894_2.jpg"
  artworkBefore3="img/kemono/before/artworks/ctf020308100_1.jpg"
  artworkBefore4="img/kemono/before/artworks/hauhau_mg_1.jpg"
  artworkBefore5="img/kemono/before/artworks/itdogcom_1.jpg"
  artworkBefore6="img/kemono/before/artworks/zelip_balloon_1.jpg"
>}}

<style>
.kemono-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 2px solid rgb(229 229 229 / var(--tw-border-opacity));
}

.dark .kemono-tabs {
  border-bottom-color: rgb(64 64 64 / var(--tw-border-opacity));
}

.kemono-tab {
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border: none;
  background: transparent;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgb(115 115 115 / var(--tw-text-opacity));
  transition: all 0.3s ease;
  position: relative;
}

.dark .kemono-tab {
  color: rgb(163 163 163 / var(--tw-text-opacity));
}

.kemono-tab:hover {
  color: rgb(64 64 64 / var(--tw-text-opacity));
}

.dark .kemono-tab:hover {
  color: rgb(229 229 229 / var(--tw-text-opacity));
}

.kemono-tab.active {
  color: rgb(31 41 55 / var(--tw-text-opacity));
}

.dark .kemono-tab.active {
  color: rgb(243 244 246 / var(--tw-text-opacity));
}

.kemono-tab.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgb(59 130 246 / var(--tw-background-opacity));
}

.kemono-tab-content {
  display: none;
  animation: fadeIn 0.5s ease;
}

.kemono-tab-content.active {
  display: block;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kemono-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -10;
  opacity: 0;
  transition: opacity 1s ease-in-out;
  margin: 0;
  padding: 0;
}

.kemono-background.active {
  opacity: 0.2;
}

.dark .kemono-background.active {
  opacity: 0.1;
}

.kemono-background img {
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  object-position: center;
  pointer-events: none;
  user-select: none;
  margin: 0;
  padding: 0;
  border: none;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
}

/* 移除 Tab 內容中的底線 */
.kemono-tab-content {
  text-decoration: none;
}

.kemono-tab-content * {
  text-decoration: none !important;
}

.kemono-tab-content a {
  text-decoration: none !important;
  border-bottom: none !important;
}

.kemono-tab-content h1,
.kemono-tab-content h2,
.kemono-tab-content h3,
.kemono-tab-content h4,
.kemono-tab-content h5,
.kemono-tab-content h6 {
  text-decoration: none !important;
  border-bottom: none !important;
}

/* 社群按鈕樣式 */
.social-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.social-buttons .btn {
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem !important;
  text-decoration: none !important;
  transition: all 0.3s ease !important;
  font-weight: 500 !important;
}

.social-buttons .btn svg {
  width: 1.25rem !important;
  height: 1.25rem !important;
  flex-shrink: 0 !important;
}

.social-buttons .btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}

/* 各社群平台顏色 */
.btn-email {
  background-color: #EA4335 !important;
  color: white !important;
}

.btn-facebook {
  background-color: #1877F2 !important;
  color: white !important;
}

.btn-plurk {
  background-color: #FF7900 !important;
  color: white !important;
}

.btn-threads {
  background-color: #000000 !important;
  color: white !important;
}

.btn-x {
  background-color: #000000 !important;
  color: white !important;
}

.btn-github {
  background-color: #333333 !important;
  color: white !important;
}

.btn-telegram {
  background-color: #0088CC !important;
  color: white !important;
}
</style>

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
        <img id="avatar-after" alt="現在的設定" class="mt-0 mb-0 rounded-lg shadow-lg">
      </div>
      {{< gallery >}}
        <img id="artwork-after-1" class="grid-w50 md:grid-w33 xl:grid-w25" />
      {{< /gallery >}}
    </div>
  </div>

  <div id="tab-before" class="kemono-tab-content">
    <div class="p-6 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg background-white/90 dark:background-gray-800/90 backdrop-blur">
      <div class="flex flex-col md:flex-row gap-8 mb-6">
        <img id="avatar-before" alt="以前的設定" class="mt-0 mb-0 rounded-lg shadow-lg">
      </div>
      {{< gallery >}}
        <img id="artwork-before-1" class="grid-w50 md:grid-w33 xl:grid-w25" />
        <img id="artwork-before-2" class="grid-w50 md:grid-w33 xl:grid-w25" />
        <img id="artwork-before-3" class="grid-w50 md:grid-w33 xl:grid-w25" />
        <img id="artwork-before-4" class="grid-w50 md:grid-w33 xl:grid-w25" />
        <img id="artwork-before-5" class="grid-w50 md:grid-w33 xl:grid-w25" />
        <img id="artwork-before-6" class="grid-w50 md:grid-w33 xl:grid-w25" />
      {{< /gallery >}}
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

<div class="social-buttons">
  <a href="mailto:kantai.developer@gmail.com" class="btn btn-email">
    {{< icon "email" >}} Email
  </a>
  
  <a href="https://www.facebook.com/kantai.zeng" target="_blank" class="btn btn-facebook">
    {{< icon "facebook" >}} Facebook
  </a>
  
  <a href="https://www.plurk.com/huevo235" target="_blank" class="btn btn-plurk">
    {{< icon "star" >}} Plurk
  </a>
  
  <a href="https://www.threads.com/@init.engineer" target="_blank" class="btn btn-threads">
    {{< icon "threads" >}} Threads
  </a>
  
  <a href="https://x.com/KantaiDeveloper" target="_blank" class="btn btn-x">
    {{< icon "x-twitter" >}} X / Twitter
  </a>
  
  <a href="https://github.com/Kantai235" target="_blank" class="btn btn-github">
    {{< icon "github" >}} GitHub
  </a>
  
  <a href="https://t.me/KantaiDeveloper" target="_blank" class="btn btn-telegram">
    {{< icon "telegram" >}} Telegram
  </a>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // 獲取所有相關元素
    const tabs = document.querySelectorAll('.kemono-tab');
    const tabContents = document.querySelectorAll('.kemono-tab-content');
    const backgroundAfter = document.getElementById('background-after');
    const backgroundBefore = document.getElementById('background-before');
    const backgroundImgAfter = document.getElementById('background-img-after');
    const backgroundImgBefore = document.getElementById('background-img-before');
    const avatarAfter = document.getElementById('avatar-after');
    const avatarBefore = document.getElementById('avatar-before');
    
    // 等待 pageImages 定義
    if (window.pageImages) {
        // 手動設定背景圖片（如果 shortcode 沒有載入的話）
        if (!window.pageImages.backgroundAfter) {
            window.pageImages.backgroundAfter = '/img/kemono/after/background.jpg';
        }
        if (!window.pageImages.backgroundBefore) {
            window.pageImages.backgroundBefore = '/img/kemono/before/background.jpg';
        }
        
        // 批量設定圖片
        window.pageImages.setImages({
            'avatar-after': 'avatarAfter',
            'avatar-before': 'avatarBefore',
            'background-img-after': 'backgroundAfter',
            'background-img-before': 'backgroundBefore',
            'artwork-after-1': 'artworkAfter1',
            'artwork-after-2': 'artworkAfter2',
            'artwork-before-1': 'artworkBefore1',
            'artwork-before-2': 'artworkBefore2',
            'artwork-before-3': 'artworkBefore3',
            'artwork-before-4': 'artworkBefore4',
            'artwork-before-5': 'artworkBefore5',
            'artwork-before-6': 'artworkBefore6'
        });
        
        // 預載入所有圖片（包括 artwork）
        const allImageKeys = Object.keys(window.pageImages).filter(k => typeof window.pageImages[k] === 'string');
        window.pageImages.preload(allImageKeys)
            .then(results => {
                console.log('所有圖片載入成功:', results.map(r => r.key));
                // 圖片載入完成後確保顯示新背景
                if (backgroundAfter) {
                    backgroundAfter.classList.add('active');
                }
                
                // 圖片載入完成後，觸發一次 gallery 重新計算
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 200);
            })
            .catch(error => {
                console.error('圖片載入失敗:', error);
                // 即使失敗也顯示容器
                if (backgroundAfter) {
                    backgroundAfter.classList.add('active');
                }
            });
    } else {
        console.error('pageImages 未定義');
    }
    
    // 切換背景的函數
    function switchBackground(targetTab) {
        if (targetTab === 'after') {
            // 淡出舊背景，淡入新背景
            if (backgroundBefore) backgroundBefore.classList.remove('active');
            if (backgroundAfter) backgroundAfter.classList.add('active');
        } else if (targetTab === 'before') {
            // 淡出新背景，淡入舊背景
            if (backgroundAfter) backgroundAfter.classList.remove('active');
            if (backgroundBefore) backgroundBefore.classList.add('active');
        }
    }
    
    // Tab 點擊事件
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            // 更新 tab 按鈕的 active 狀態
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 更新 tab 內容的 active 狀態
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(`tab-${targetTab}`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // 延遲觸發 gallery 重新計算版面
                setTimeout(() => {
                    // 觸發 resize 事件來重新計算 gallery 版面
                    window.dispatchEvent(new Event('resize'));
                    
                    // 如果有 gallery 的重新計算函數，也可以直接調用
                    const galleries = targetContent.querySelectorAll('.gallery');
                    galleries.forEach(gallery => {
                        // 強制重新計算 gallery 內圖片的位置
                        const images = gallery.querySelectorAll('img');
                        images.forEach(img => {
                            if (img.src && img.complete) {
                                // 強制重繪
                                img.style.display = 'none';
                                img.offsetHeight; // 觸發重繪
                                img.style.display = '';
                            }
                        });
                    });
                }, 100);
            }
            
            // 切換背景圖片（淡出淡入效果）
            switchBackground(targetTab);
        });
    });
    
    // 處理鍵盤導航（可選）
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeTab = document.querySelector('.kemono-tab.active');
            if (activeTab) {
                const currentIndex = Array.from(tabs).indexOf(activeTab);
                let afterIndex;
                
                if (e.key === 'ArrowLeft') {
                    afterIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    afterIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }
                
                if (tabs[afterIndex]) {
                    tabs[afterIndex].click();
                }
            }
        }
    });
});
</script>
