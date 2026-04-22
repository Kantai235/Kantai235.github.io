/**
 * @file background-blur.js
 * @description 控制首頁與英雄區塊背景模糊透明度。
 *   以 passive scroll + requestAnimationFrame 更新 opacity，
 *   降低同步重排與主執行緒干擾。
 */
(function() {
  /**
   * 讀取無障礙設定。若 localStorage 內容損毀，回傳空物件避免腳本中斷。
   * @returns {{ disableBlur?: boolean, disableImages?: boolean }}
   */
  function readA11ySettings() {
    try {
      return JSON.parse(localStorage.getItem('a11ySettings') || '{}');
    } catch {
      return {};
    }
  }

  /**
   * 將數值限制在指定範圍內，避免 opacity 超出瀏覽器預期值。
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * 依目前捲動位置更新單一背景模糊層。
   * @param {string} targetId
   * @param {number} scrollDivisor
   * @param {boolean} disableBlur
   * @param {boolean} isMenuBlur
   */
  function setBackgroundBlur(targetId, scrollDivisor, disableBlur, isMenuBlur) {
    if (!targetId) {
      console.error('data-target-id is null');
      return;
    }

    const blurElement = document.getElementById(targetId);

    if (!blurElement) {
      return;
    }

    if (disableBlur) {
      blurElement.setAttribute('aria-hidden', 'true');

      if (!isMenuBlur) {
        blurElement.style.display = 'none';
        blurElement.style.opacity = '0';
      } else {
        blurElement.style.display = '';
      }
    } else {
      blurElement.style.display = '';
      blurElement.removeAttribute('aria-hidden');
    }

    blurElement.setAttribute('role', 'presentation');
    blurElement.setAttribute('tabindex', '-1');

    let ticking = false;
    let previousOpacity = '';

    function applyBlur() {
      ticking = false;

      if (disableBlur && !isMenuBlur) {
        return;
      }

      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const opacity = clamp(scrollTop / scrollDivisor, 0, 1).toFixed(3);

      if (opacity === previousOpacity) {
        return;
      }

      blurElement.style.opacity = opacity;
      previousOpacity = opacity;
    }

    function scheduleBlurUpdate() {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(applyBlur);
    }

    window.addEventListener('scroll', scheduleBlurUpdate, { passive: true });
    window.addEventListener('resize', scheduleBlurUpdate, { passive: true });
    scheduleBlurUpdate();
  }

  /**
   * 若使用者啟用停用圖片模式，隱藏對應背景圖片避免閃爍。
   * @param {{ disableImages?: boolean }} settings
   */
  function preventImageFlash(settings) {
    if (!settings.disableImages) {
      return;
    }

    document.querySelectorAll('script[data-image-id]').forEach(function(script) {
      const imageId = script.getAttribute('data-image-id');
      const image = imageId ? document.getElementById(imageId) : null;

      if (image) {
        image.style.display = 'none';
      }
    });
  }

  function initBackgroundBlur() {
    const settings = readA11ySettings();

    document.querySelectorAll('script[data-target-id]').forEach(function(script) {
      const targetId = script.getAttribute('data-target-id');
      const scrollDivisor = Number(script.getAttribute('data-scroll-divisor') || 300);
      const isMenuBlur = targetId === 'menu-blur';

      setBackgroundBlur(
        targetId,
        scrollDivisor,
        Boolean(settings.disableBlur),
        isMenuBlur
      );
    });

    preventImageFlash(settings);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundBlur, { once: true });
  } else {
    initBackgroundBlur();
  }
})();
