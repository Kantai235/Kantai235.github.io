/** Hugo shortcode 注入的全域變數型別宣告 */

interface KemonoI18n {
  loading: string;
  creatorLabel: string;
  photographerLabel: string;
  makerLabel: string;
  lang?: string;
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

type LocalizedText = Partial<Record<'zh-tw' | 'en' | 'ja' | 'zh-cn', string>>;

interface CreatorData {
  name?: string | LocalizedText;
  link?: string;
  photographer?: string | LocalizedText;
  photographerLink?: string;
  maker?: string | LocalizedText;
  makerLink?: string;
}

interface CreatorInfo {
  [key: string]: CreatorData;
}

interface ArtworkCredit {
  label?: string | LocalizedText;
  type?: string | LocalizedText;
  name?: string | LocalizedText;
  value?: string | LocalizedText;
  link?: string;
  url?: string;
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
