/**
 * @file gallery.js
 * @description 藝術作品瀑布流圖���的初始化腳本。
 *   使用 Packery 函式庫將 `.gallery-artworks` 容器內的圖片排列為瀑布流佈局，
 *   並透過 jQuery 監聽 `window.load` 事件確保圖片資源載入完成後才進行排列。
 *
 * @requires jQuery  — 透過 layouts/partials/vendor.html 以 `<script>` 引入，全域變數 `$`
 * @requires Packery — 透過 Hugo 資源管線引入，全域變數 `Packery`
 */

/**
 * 取得 Packery 的預設配置選項。
 * @returns {{ percentPosition: boolean, gutter: number, resize: boolean }} 預設選項物件
 */
function _getDefaultPackeryOptions() {
  return {
    percentPosition: true,
    gutter: 5,
    resize: true,
  };
}

/**
 * 從 DOM 元素的 `data-*` 屬���讀取自訂設定，並與預設值合併。
 * 支援的 dataset 屬性：`packeryGutter`、`packeryPercentPosition`、`packeryResize`。
 * @param {HTMLElement} nodeGallery - 帶有 data-* 屬性的圖��容器元素
 * @returns {{ percentPosition: boolean, gutter: number, resize: boolean }} 合併後的選項物件
 */
function _getPackeryOptions(nodeGallery) {
  const defaults = _getDefaultPackeryOptions();
  const {
    packeryGutter,
    packeryPercentPosition,
    packeryResize,
  } = nodeGallery.dataset;

  return {
    percentPosition:
      packeryPercentPosition !== undefined
        ? packeryPercentPosition === "true"
        : defaults.percentPosition,
    gutter:
      packeryGutter !== undefined ? parseInt(packeryGutter, 10) : defaults.gutter,
    resize:
      packeryResize !== undefined ? packeryResize === "true" : defaults.resize,
  };
}

/**
 * 初始化 IIFE：在頁面資源（含圖片）全部載入後，
 * 為所有 `.gallery-artworks` 容器建立 Packery 實例以啟用瀑布流佈局。
 * 僅處理 `.gallery-artworks`，不影響 `.gallery-avatar` 等其他圖庫容器。
 */
(function init() {
  $(window).on("load", function () {
    // 只選擇 .gallery-artworks，不處理 .gallery-avatar
    let nodeGalleries = document.querySelectorAll(".gallery-artworks");

    nodeGalleries.forEach((nodeGallery) => {
      new Packery(nodeGallery, _getPackeryOptions(nodeGallery));
    });
  });
})();