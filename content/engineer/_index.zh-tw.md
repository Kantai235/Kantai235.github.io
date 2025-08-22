---
showTableOfContents: true
---

# 🛠️ 乾太，是個後端工程師。

## 簡歷

{{< lead >}}
身為資深後端工程師，我專精於運用 PHP 與 Laravel 進行穩健的應用程式開發。我的技術光譜不僅限於後端，亦熟悉使用 Python 與 Flask 建構微服務，並具備 Swift 及 Kotlin 的原生 App 開發能力，是一位具備全端思維的開發者。

我熱衷於鑽研新的語言特性與設計模式，深信多元的技術視角是做出卓越架構決策的基石。在開發哲學上，我重視程式碼的長期價值：面對既有專案，我會先融入並尊重現有架構，確保開發節奏的穩定；而在啟動新專案時，我則致力於前期的架構設計，追求系統的可擴展性與可維護性，以有效管理技術債。

工作流程上，我習慣採用 Scrum 方法論來管理進度，無論是獨立作業或團隊協作，都能有條不紊地推進。我相信，清晰的目標規劃結合敏捷的迭代調整，是確保專案成功的最佳實踐。
{{< /lead >}}

---

## 技能總覽

| 類別 | 技術與概念 | 熟練度 |
|---|---|---|
| 後端架構 | **程式語言**: PHP, Python <br />**框架**: Laravel, Flask, Django <br />**資料庫**: MySQL, MariaDB, PostgreSQL <br />**快取**: Redis | 比較擅長 |
| 前端開發 | Vue.js, JavaScript (ES6+), SCSS, Webpack | 稍微擅長 |
| 行動裝置開發 | Kotlin, Android SDK, Swift | 普普通通 |
| 腳本與自動化 | Python, Flask | 普普通通 |
| 維運與工具 | Git, GitHub, GitHub Actions, Docker, Jenkins | 普普通通 |
| 雲端平台 | AWS, GCP | 普普通通 |

### 核心專長

我的核心專長為後端系統開發，專注於架構的穩健性、可維護性與未來擴展性。
- **系統架構與設計**：以領域驅動設計 (DDD) 為核心，主導 API 的設計與開發，確保程式碼結構清晰並貼近業務需求。
- **效能與可靠性**：具備負載平衡 (Load Balancing) 與高可用性 (High Availability) 系統的實戰經驗，能應對高流量挑戰，確保服務穩定。
- **資料庫與最佳化**：擁有從零開始設計資料庫、分析效能瓶頸，並進行深度優化的完整經驗。

### 前後端協作

主導並實踐了後端與前端協作模式的現代化演進，歷程如下：
- **傳統 API 階段**：熟悉 RESTful API 設計原則，負責開發供前端（如 Vue/React）使用的獨立 API。
- **導入 Livewire**：為簡化特定場景下的開發流程，導入 Laravel Livewire。透過後端直接控制前端互動，有效降低了小型專案或內部後台在 API 開發與維護上的成本。
- **擁抱 Inertia.js**：在追求極致開發效率與使用者體驗的目標下，全面採用 Inertia.js 作為核心。此架構讓 Laravel 控制器能直接傳遞資料並渲染前端 Vue/React 元件，實現了 **「無 API (API-less)」** 的開發模式，完美融合了後端框架的強大功能與前端 SPA 的所有優點。

---

## 開源專案

### 純靠北工程師

專為工程師社群打造的匿名交流平台，致力於提供一個安全、自由的空間，讓每位工程師都能分享最真實的職場見聞與個人心聲。

#### 核心功能

- **最新文章牆**:
    此區展示所有通過社群審核的投稿文章。內容涵蓋工程師在職場百態、技術心得、專案挑戰與奇聞軼事，讓您一窺工程師的真實世界並找到共鳴。

- **群眾審核區**:
    這是本平台最大的特色。所有最新的投稿都會先進入此區，由廣大的社群成員共同審核、投票，來決定一篇文章是否能登上「最新文章牆」。這個機制確保了內容的品質與社群的自主性。

- **內容跨平台發布**:
    凡通過審核的文章，系統將自動同步發布至各大主流社群平台（如 Facebook, Discord, Telegram, Plurk ... 等），極大化每一篇文章的觸及範圍與影響力。

{{< github repo="init-engineer/init.engineer" showThumbnail=false >}}

### PHP 設計模式

深度實踐的開源範例庫，收錄了多達 31 種設計模式。本專案不僅涵蓋經典的 GoF 23 種，更融入了作者對設計模式的獨到見解與多種實用的現代模式。

其最大特色是為每種模式都撰寫了完整的測試案例。這讓學習者不僅能理解模式的結構，更能透過撰寫與執行測試，來驗證邊界條件、深化對模式職責的理解。這是一份能同時提升架構設計與測試能力的絕佳資源。

{{< github repo="Kantai235/php-design-pattern" showThumbnail=false >}}

### Laravel 高流量、高併發研究

專案對比了傳統 MVC 直連資料庫在高併發下的瓶頸，並完整展示如何利用 Redis 快取與訊息佇列 (Message Queue) 將請求異步化，實現系統解耦與流量削峰填谷。

最終目標是打造一個能夠從容應對瞬間高流量的穩健後端架構，為需要處理類似場景的開發者提供一份可執行的架構藍圖。

{{< github repo="Kantai235/laravel-typical-high-load-example" showThumbnail=false >}}

---

## 社群志工

{{< timeline >}}
    {{< timelineItem header="行銷組組員" badge="SITCON" subheader="2022 ~ 2024" >}}
        負責開發潛在合作單位，主動接洽並維繫與贊助商、媒體及社群夥伴的關係。透過跨界合作的推廣，成功提升 SITCON 年會的品牌曝光度與大眾參與度。
    {{< /timelineItem >}}
    
    {{< timelineItem header="媒體合作夥伴" badge="SITCON" subheader="2022 ~ 2023" >}}
        以「純靠北工程師」身分擔任 SITCON 媒體合作夥伴。運用社群平台影響力，針對年會議題進行宣傳與互動，協助 SITCON 觸及更多跨溫層的潛在會眾，拓展品牌能見度。
    {{< /timelineItem >}}
    
    {{< timelineItem header="講者" badge="SITCON Hour of Code" subheader="2020" >}}
        Hour of Code 是一場面向所有年齡層的程式體驗活動，目的在揭開「程式」對大眾的神祕面紗，在一個小時內透過簡單的遊戲體驗來理解程式的神祕魔力，引導各年齡層的朋友們在活動中了解程式的樂趣。
    {{< /timelineItem >}}
    
    {{< timelineItem header="Panel 講者" badge="MOPCON" subheader="2020" >}}
        受邀擔任「斜槓 Side Project」主題論壇講者。看見問題就開始想方設法解決，對許多工程師來說已是早已養成的習慣，無論事發生在日常生活、社會大眾甚 至是與好友連線的電玩遊戲中。身為擁有解決問題技能的工程師，是如何洞察問題的癥結點，開發出能助人助 己的程式呢？又是如何去維持這些 Projects 運作？甚至從中獲得收入！讓我們一起來聊聊斜槓 Site Project 是怎 麼一回事！
    {{< /timelineItem >}}
    
    {{< timelineItem header="Talk 講者" badge="MOPCON" subheader="2019" >}}
        發表「純靠北工程師的技術演進之路」主題演講。分享該專案從最初的簡易架構，如何因應高流量與複雜需求，在技術選型、架構決策上進行迭代，最終演進為一個穩健的社群服務系統。
    {{< /timelineItem >}}
{{< /timeline >}}

---

## 聯絡我

如果你對我的技術經驗有興趣，或想要進行技術交流，歡迎透過以下方式聯絡我：

Email: kantai.developer@gmail.com

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

<style>
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