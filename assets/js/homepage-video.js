/**
 * @file homepage-video.js
 * @description 首頁背景影片延後升級器。
 *   首屏先以靜態背景圖顯示，等頁面主要內容穩定後再載入影片，
 *   兼顧首頁動態視覺與行動版首屏效能。
 */
(function() {
  /**
   * 判斷目前環境是否適合播放首頁背景影片。
   * 尊重使用者的省流量與降低動作偏好。
   * @returns {boolean}
   */
  function canUpgradeToVideo() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

    if (connection && connection.saveData) {
      return false;
    }

    return true;
  }

  /**
   * 將 data-src 套用到 <source> 後觸發影片載入。
   * @param {HTMLVideoElement} video
   */
  function hydrateVideoSource(video) {
    const source = video.querySelector('source[data-src]');

    if (!source || source.src) {
      return;
    }

    source.src = source.dataset.src;
    video.load();
  }

  /**
   * 等影片可以播放後淡入，並隱藏靜態背景圖。
   * @param {HTMLVideoElement} video
   * @param {HTMLImageElement | null} fallbackImage
   */
  function revealVideo(video, fallbackImage) {
    video.classList.remove('opacity-0');
    video.classList.add('opacity-100');

    if (fallbackImage) {
      fallbackImage.style.opacity = '0';
      fallbackImage.style.transition = 'opacity 0.5s ease';

      window.setTimeout(function() {
        fallbackImage.style.display = 'none';
      }, 500);
    }
  }

  /**
   * 初始化首頁背景影片延後載入。
   */
  function initHomepageVideo() {
    const video = document.getElementById('homepage-background-video');
    const fallbackImage = document.getElementById('homepage-background-image');

    if (!video || !canUpgradeToVideo()) {
      return;
    }

    function loadVideo() {
      hydrateVideoSource(video);

      const readyHandler = function() {
        revealVideo(video, fallbackImage);
      };

      video.addEventListener('loadeddata', readyHandler, { once: true });

      video.play().catch(function() {
        // 若瀏覽器封鎖自動播放，保留靜態背景圖即可。
      });
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadVideo, { timeout: 1500 });
      return;
    }

    window.setTimeout(loadVideo, 800);
  }

  if (document.readyState === 'complete') {
    initHomepageVideo();
  } else {
    window.addEventListener('load', initHomepageVideo, { once: true });
  }
})();
