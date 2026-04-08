/**
 * sticker-gallery.js — 貼圖展示元件互動邏輯
 * 管理 Modal 開關、貼圖載入、GLightbox 整合與鍵盤導航。
 * 依賴：window.stickerData（由 sticker-gallery shortcode 注入）
 *       window.stickerI18n（由 sticker-gallery shortcode 注入 i18n 字串）
 */
/* global GLightbox */
(function() {
    'use strict';

    var i18n = window.stickerI18n || { creatorLabel: '繪師：', stickerSuffix: '貼圖' };
    var modalLightbox = null;

    function getPlatformIcon(iconName) {
        var icons = {
            telegram: '<path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>',
            line: '<path d="M12 0C5.373 0 0 4.975 0 11.111c0 5.497 4.486 9.998 10.124 10.999.481-.06.837-.382.837-.898v-3.12c0-.467-.335-.85-.748-.85-.414 0-.748.382-.748.85v2.121c-4.564-.845-8.017-4.764-8.017-9.547 0-5.298 4.478-9.592 10.004-9.592s10.004 4.294 10.004 9.592c0 4.783-3.453 8.702-8.017 9.547v-2.121c0-.467-.335-.85-.748-.85-.414 0-.748.382-.748.85v3.12c0 .516.356.838.837.898C19.514 21.109 24 16.608 24 11.111 24 4.975 18.627 0 12 0z"/>'
        };
        return icons[iconName] || '';
    }

    function openStickerModal(seriesId) {
        var modal = document.getElementById('sticker-modal');
        var modalTitle = document.getElementById('modal-title');
        var modalPlatforms = document.getElementById('modal-platforms');
        var modalGrid = document.getElementById('modal-stickers-grid');

        if (!modal || !modalTitle || !modalPlatforms || !modalGrid) return;
        if (!window.stickerData || !window.stickerData.series) return;

        var series = window.stickerData.series.find(function(s) { return s.id === seriesId; });
        if (!series) return;

        // 設定標題
        modalTitle.textContent = series.title;

        // 設定繪師資訊（使用 DOM API 避免 XSS）
        var modalCreator = document.getElementById('modal-creator');
        if (modalCreator && series.creator) {
            modalCreator.textContent = '';

            var iconSpan = document.createElement('span');
            iconSpan.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            modalCreator.appendChild(iconSpan);

            var labelSpan = document.createElement('span');
            labelSpan.textContent = i18n.creatorLabel;
            modalCreator.appendChild(labelSpan);

            if (series.creator.link) {
                var creatorLink = document.createElement('a');
                creatorLink.href = series.creator.link;
                creatorLink.target = '_blank';
                creatorLink.rel = 'noopener noreferrer';
                creatorLink.className = 'modal-creator-link';
                creatorLink.textContent = series.creator.name;
                modalCreator.appendChild(creatorLink);
            } else {
                var nameSpan = document.createElement('span');
                nameSpan.textContent = series.creator.name;
                modalCreator.appendChild(nameSpan);
            }

            modalCreator.style.display = 'flex';
        } else if (modalCreator) {
            modalCreator.style.display = 'none';
        }

        // 設定平台徽章
        modalPlatforms.innerHTML = '';
        series.platforms.forEach(function(platform) {
            var badge = document.createElement(platform.available ? 'a' : 'span');
            badge.className = 'platform-badge ' + (platform.available ? 'available' : 'unavailable');

            if (platform.available) {
                badge.href = platform.url;
                badge.target = '_blank';
                badge.rel = 'noopener noreferrer';
                badge.addEventListener('click', function(e) {
                    e.stopPropagation();
                });

                if (platform.url.includes('t.me') || platform.url.includes('telegram')) {
                    badge.style.background = 'linear-gradient(135deg, #0088CC, #229ED9)';
                    badge.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.3)';
                } else if (platform.url.includes('line.me')) {
                    badge.style.background = 'linear-gradient(135deg, #00C300, #00B900)';
                    badge.style.boxShadow = '0 4px 12px rgba(0, 195, 0, 0.3)';
                }
            }

            // 使用 DOM API 建構徽章內容，避免 innerHTML 注入
            var iconSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            iconSvg.setAttribute('class', 'platform-icon');
            iconSvg.setAttribute('width', '20');
            iconSvg.setAttribute('height', '20');
            iconSvg.setAttribute('viewBox', '0 0 24 24');
            iconSvg.setAttribute('fill', 'currentColor');
            iconSvg.innerHTML = getPlatformIcon(platform.icon);

            var labelSpan = document.createElement('span');
            labelSpan.textContent = platform.name + ' ' + i18n.stickerSuffix;

            badge.appendChild(iconSvg);
            badge.appendChild(labelSpan);
            modalPlatforms.appendChild(badge);
        });

        // 清空並重新載入貼圖
        modalGrid.innerHTML = '';
        series.stickers.forEach(function(sticker) {
            var stickerItem = document.createElement('div');
            stickerItem.className = 'sticker-item';

            var img = document.createElement('img');
            img.className = 'sticker-thumbnail glightbox';
            img.src = sticker.preview || sticker.src;
            img.alt = sticker.alt;
            img.loading = 'lazy';
            img.setAttribute('data-gallery', 'modal-sticker-series-' + seriesId);
            img.setAttribute('data-glightbox', 'title: ' + sticker.alt);

            stickerItem.appendChild(img);
            modalGrid.appendChild(stickerItem);
        });

        // 顯示模態框
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // 重新初始化 GLightbox
        setTimeout(function() {
            if (modalLightbox) {
                modalLightbox.destroy();
            }

            if (typeof GLightbox !== 'undefined') {
                modalLightbox = GLightbox({
                    selector: '[data-gallery="modal-sticker-series-' + seriesId + '"]',
                    touchNavigation: true,
                    loop: true,
                    closeOnOutsideClick: true,
                    zoomable: true
                });
            }
        }, 100);
    }

    function closeStickerModal() {
        var modal = document.getElementById('sticker-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';

        if (modalLightbox) {
            modalLightbox.destroy();
            modalLightbox = null;
        }
    }

    // ESC 鍵關閉模態框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            var modal = document.getElementById('sticker-modal');
            if (modal && modal.classList.contains('active')) {
                closeStickerModal();
            }
        }
    });

    // 初始化：以事件委派取代 inline onclick，符合 CSP 最佳實踐
    document.addEventListener('DOMContentLoaded', function() {
        // 開啟 modal — 點擊或按 Enter/Space 鍵
        document.querySelectorAll('[data-open-modal]').forEach(function(el) {
            el.addEventListener('click', function() {
                openStickerModal(this.dataset.openModal);
            });
            el.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openStickerModal(this.dataset.openModal);
                }
            });
        });

        // 關閉 modal — overlay 與關閉按鈕
        document.querySelectorAll('[data-close-modal]').forEach(function(el) {
            el.addEventListener('click', closeStickerModal);
        });
    });
})();
