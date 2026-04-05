# 資料結構定義 (Data Schema)

本文件以 TypeScript Interface 格式定義 `data/` 目錄下所有 JSON 檔案的資���結構，
供 AI 代理與開發者快速理解欄位用途與型別��

---

## kemono.json

獸設（Kemono）頁面的核心資料，包含背景媒體元素與作品圖庫。

```typescript
/** kemono.json 根結構 */
interface KemonoData {
  /** 背景媒體元素（影片與圖片），鍵值為元��� ID */
  elements: Record<string, KemonoElement>;
  /** 作品圖庫，依時期（after / before）分類 */
  gallery: {
    after: KemonoGalleryPeriod;
    before: KemonoGalleryPeriod;
  };
}

/** 背景媒體元素 */
interface KemonoElement {
  /** 媒體資源路徑（相對於 assets/），支援 .mp4 影片或 .jpg 圖片 */
  src: string;
}

/** 單一時期的圖��資料 */
interface KemonoGalleryPeriod {
  /** ��期標題（例如「現在的設定」、「以前的設定」） */
  title: string;
  /** 該時期的代表頭像作品 */
  avatar: KemonoArtwork;
  /** 該時期���所有委託作品列表 */
  artworks: KemonoArtwork[];
}

/** 單一藝術作品 */
interface KemonoArtwork {
  /** 作品的唯一識別 ID，用於 DOM 元素綁定（���如 "artwork-after-1"） */
  id: string;
  /** Tailwind CSS class，控制圖庫中的格線寬��（例如 "grid-w50 md:grid-w33 xl:grid-w25"） */
  class: string;
  /** 圖片替代文字（無障礙用途） */
  alt: string;
  /** 圖片資源路徑（相對於 assets/） */
  src: string;
  /** 創作者（繪師）資訊 */
  creator: Creator;
}

/** 創作者資訊 */
interface Creator {
  /** 創作者名稱 */
  name: string;
  /** 創作者的社群或作品集連結 */
  link: string;
}
```

---

## social.json

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
  /** 按鈕背景色（十六進��色碼），與 gradient 二擇一 */
  color?: string;
  /** 按鈕背景漸層（CSS gradient 語法），與 color 二擇一 */
  gradient?: string;
}
```

---

## stickers.json

貼圖集合資料，包含多個貼圖系列。

```typescript
/** stickers.json 根結構 */
interface StickersData {
  /** 貼圖系列列表 */
  series: StickerSeries[];
}

/** 單一貼圖系列 */
interface StickerSeries {
  /** 系列識別 ID（例如 "bipu-glasses"） */
  id: string;
  /** 系列標題 */
  title: string;
  /** 系列說明文字 */
  description: string;
  /** 創作者資訊 */
  creator: Creator;
  /** 系列��圖路徑（用於預覽） */
  thumbnail: string;
  /** 可下載的平台列表 */
  platforms: StickerPlatform[];
  /** 系列中的所有貼圖 */
  stickers: Sticker[];
}

/** 貼圖發佈平台 */
interface StickerPlatform {
  /** 平台名稱（例如 "Telegram"） */
  name: string;
  /** 平台圖示名稱 */
  icon: string;
  /** 貼圖��連結 */
  url: string;
  /** 是否可供下載 */
  available: boolean;
}

/** 單一貼圖 */
interface Sticker {
  /** 貼圖唯一識別 ID */
  id: string;
  /** 貼圖圖片路徑 */
  src: string;
  /** 替代文字 */
  alt: string;
}
```

---

## authors/kantai235.json

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
