/** Hugo shortcode 注入的全域變數型別宣告 */

interface KemonoI18n {
  loading: string;
  creatorLabel: string;
  photographerLabel: string;
  makerLabel: string;
}

interface StickerI18n {
  creatorLabel: string;
  stickerSuffix: string;
}

interface PageImagesLoadResult {
  key: string;
  img?: HTMLImageElement;
  error?: string;
  loaded: number;
  total: number;
  progress: number;
}

interface PageImages {
  [key: string]: string | ((...args: any[]) => any);
  loadProgressively: (keys: string[], onProgress: (result: PageImagesLoadResult) => void) => void;
  preload: (keys?: string[]) => Promise<PageImagesLoadResult[]>;
  setImages: (elementIds?: string[]) => void;
}

interface CreatorData {
  name?: string;
  link?: string;
  photographer?: string;
  photographerLink?: string;
  maker?: string;
  makerLink?: string;
}

interface CreatorInfo {
  [key: string]: CreatorData;
}

/** 擴充 HTMLElement 以支援 Packery 動態掛載 */
interface HTMLElement {
  packeryInstance?: any;
}

interface Window {
  kemonoI18n: KemonoI18n;
  stickerI18n: StickerI18n;
  pageImages: PageImages;
  creatorInfo: CreatorInfo;
  forcePackeryReset: () => void;
}

declare var Packery: any;
