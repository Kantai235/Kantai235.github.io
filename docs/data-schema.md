# 資料結構定義 (Data Schema)

本文件以 TypeScript Interface 格式定義專案中所有 JSON 資料檔案的結構，
供 AI 代理與開發者快速理解欄位用途與型別。

---

## 獸設資料（assets/img/kemono/）

獸設頁面採用目錄共置結構，資料與圖片放在同一目錄下，由模板自動探索。

### elements.json（`assets/img/kemono/elements.json`）

背景媒體元素對應表。

```typescript
/** elements.json — 鍵值為 DOM 元素 ID */
type ElementsData = Record<string, {
  /** 媒體資源路徑（相對於 assets/），支援 .mp4 影片或 .jpg 圖片 */
  src: string;
}>;
```

### 期間 data.json（`assets/img/kemono/{period}/data.json`）

每個期間（after / before / fursuit）的 metadata。

```typescript
/** 期間 data.json */
interface PeriodData {
  /** 時期標題（例如「現在的設定」） */
  title: string;
  /** 該時期的代表頭像作品（可選，fursuit 無此欄位） */
  avatar?: {
    /** DOM 元素 ID（例如 "avatar-after"） */
    id: string;
    /** CSS class */
    class: string;
    /** 圖片替代文字 */
    alt: string;
    /** 圖片資源路徑（相對於 assets/） */
    src: string;
    /** 創作者資訊 */
    creator: ArtworkCreator;
  };
}
```

### 作品 data.json（`assets/img/kemono/{period}/artworks/{name}/data.json`）

每件委託作品的 metadata，與圖片共置於同一目錄。圖片由模板自動探索，無需列舉。

```typescript
/** 作品 data.json */
interface ArtworkData {
  /** 圖片替代文字（無障礙用途） */
  alt: string;
  /** 創作者資訊 */
  creator: ArtworkCreator;
}

/** 繪師格式 */
interface ArtworkCreator {
  /** 創作者名稱 */
  name?: string;
  /** 創作者的社群或作品集連結 */
  link?: string;
  /** 攝影師名稱（獸裝照片用） */
  photographer?: string;
  /** 獸裝製作者名稱（獸裝照片用） */
  maker?: string;
}
```

### 貼圖系列 data.json（`assets/img/kemono/*/stickers/{series}/data.json`）

每套貼圖系列的 metadata，與貼圖圖片共置於同一目錄。圖片由模板自動探索。

```typescript
/** 貼圖系列 data.json */
interface StickerSeriesData {
  /** 系列標題 */
  title: string;
  /** 系列說明文字 */
  description: string;
  /** 創作者資訊 */
  creator: ArtworkCreator;
  /** 可下載的平台列表 */
  platforms: StickerPlatform[];
}

/** 貼圖發佈平台 */
interface StickerPlatform {
  /** 平台名稱（例如 "Telegram"） */
  name: string;
  /** 平台圖示名稱 */
  icon: string;
  /** 貼圖包連結 */
  url: string;
  /** 是否可供下載 */
  available: boolean;
}
```

---

## social.json（`data/social.json`）

社群媒體連結資料，分為主要連結與其他連結兩組。

```typescript
/** social.json 根結構 */
interface SocialData {
  /** 主要社群連結（顯示於頁面上方） */
  main: SocialLink[];
  /** 其他社群連結（顯示於頁面下方） */
  others: SocialLink[];
}

/** 單一社群連結 */
interface SocialLink {
  /** 平台識別 ID，同時作為 CSS class 後綴（例如 "telegram"、"facebook"） */
  id: string;
  /** 平台顯示名稱 */
  name: string;
  /** 連結 URL */
  url: string;
  /** 圖示名稱，對應 Blowfish 主題的 icon partial */
  icon: string;
  /** 按鈕背景色（十六進位色碼），與 gradient 二擇一 */
  color?: string;
  /** 按鈕背景漸層（CSS gradient 語法），與 color 二擇一 */
  gradient?: string;
}
```

---

## authors/kantai235.json（`data/authors/kantai235.json`）

作者個人資料，用於文章頁面的作者資訊區塊。

```typescript
/** 作者資料結構 */
interface AuthorData {
  /** 作者顯示名稱 */
  name: string;
  /** 頭像圖片路徑 */
  image: string;
  /** 一句話簡介（顯示於名稱下方） */
  headline: string;
  /** 完整自我介紹 */
  bio: string;
  /** 社群連結列表，每個物件僅包含一個鍵值對（平台名稱: URL） */
  social: Record<string, string>[];
}
```
