/**
 * @file lazy-loading.js
 * @description 圖片懶載入腳本，提供兩大功能：
 *   1. 背景圖片懶載入 — 針對 `.lazy-bg` 元素，透過 IntersectionObserver 偵測進入視窗後載入。
 *   2. 一般圖片懶載入 — 針對 `img[loading="lazy"]` 元素，將 `data-src` 替換為 `src`。
 *   兩者皆支援 WebP 格式自動偵測（含快取），並為不支援 IntersectionObserver 的瀏覽器提供降級方案。
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * 偵測瀏覽器是否支援 WebP 圖片格式（含快取）。
     * 首次呼叫時透過解碼 base64 WebP 圖片判斷，後續呼叫直接回傳快取結果。
     * @param {function(boolean): void} callback - 回呼函式，參數為是否支援 WebP
     */
    let _webPSupported = null;
    function checkWebPSupport(callback) {
        if (_webPSupported !== null) {
            callback(_webPSupported);
            return;
        }
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            _webPSupported = webP.height === 2;
            callback(_webPSupported);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    /**
     * 懶載入背景圖片。
     * 為所有 `.lazy-bg` 元素註冊 IntersectionObserver，當元素進入視窗 50px 範圍時，
     * 根據 WebP 支援度從 `data-bg-webp` 或 `data-bg-fallback` 讀取圖片 URL 並設為背景。
     * 若瀏覽器不支援 IntersectionObserver，則立即載入所有背景圖。
     */
    function lazyLoadBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('.lazy-bg');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const element = entry.target;

                        checkWebPSupport(function(supportsWebP) {
                            const imageUrl = supportsWebP
                                ? element.dataset.bgWebp
                                : element.dataset.bgFallback;

                            if (imageUrl) {
                                element.style.backgroundImage = `url(${imageUrl})`;
                                element.classList.remove('lazy-bg');
                                element.classList.add('loaded');
                            }
                        });

                        imageObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyBackgrounds.forEach(function(lazyBackground) {
                imageObserver.observe(lazyBackground);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyBackgrounds.forEach(function(element) {
                checkWebPSupport(function(supportsWebP) {
                    const imageUrl = supportsWebP
                        ? element.dataset.bgWebp
                        : element.dataset.bgFallback;

                    if (imageUrl) {
                        element.style.backgroundImage = `url(${imageUrl})`;
                        element.classList.remove('lazy-bg');
                        element.classList.add('loaded');
                    }
                });
            });
        }
    }

    /**
     * 懶載入一般圖片。
     * 為所有 `img[loading="lazy"]` 元素註冊 IntersectionObserver，
     * 當圖片進入視窗 50px 範圍時，將 `data-src` 屬性的值設為 `src` 以觸發載入。
     */
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(function(lazyImage) {
                imageObserver.observe(lazyImage);
            });
        }
    }

    // 初始化懶載入
    lazyLoadBackgrounds();
    lazyLoadImages();
});
