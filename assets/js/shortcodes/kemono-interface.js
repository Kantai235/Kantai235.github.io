/**
 * kemono-interface.js — Kemono（獸設）頁面互動介面
 * 管理 Tab 切換、背景圖片切換、圖片漸進式載入、Packery 重算與創作者資訊提示。
 * 依賴：window.pageImages（由 kemono-setup shortcode 初始化）
 *       window.kemonoI18n（由 kemono-interface shortcode 注入 i18n 字串）
 */
document.addEventListener('DOMContentLoaded', function() {
    // 延遲執行以確保數據載入完成
    setTimeout(function() {
    var i18n = window.kemonoI18n || { loading: '載入中...', creatorLabel: '繪師：', photographerLabel: '攝影師：', makerLabel: '製作者：' };

    // 獲取所有相關元素
    var tabs = document.querySelectorAll('.kemono-tab');
    var tabContents = document.querySelectorAll('.kemono-tab-content');
    var backgrounds = document.querySelectorAll('.kemono-background');
    var avatarAfter = document.getElementById('avatar-after');
    var avatarBefore = document.getElementById('avatar-before');
    var avatarFursuit = document.getElementById('avatar-fursuit');

    // 立即顯示頁面結構和佔位符
    var firstBackground = document.getElementById('background-after');
    if (firstBackground) {
        firstBackground.classList.add('active');
    }

    // 立即設定佔位符圖片
    function setPlaceholderImages() {
        /** @type {NodeListOf<HTMLImageElement>} */
        var imageElements = document.querySelectorAll('#avatar-after, #avatar-before, #avatar-fursuit, .gallery img');
        imageElements.forEach(function(img) {
            if (img.id && img.id.indexOf('featured-') !== 0) {
                img.classList.add('image-placeholder');
                img.alt = i18n.loading;
                // 設定一個透明的 1x1 pixel 圖片作為佔位符
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PC9zdmc+';
            }
        });
    }

    // 立即設定佔位符
    setPlaceholderImages();

    // 強制 Packery 重新計算
    /** @param {Element | null} [targetTab] */
    function forcePackeryRecalculation(targetTab) {
        if (!targetTab) {
            targetTab = document.querySelector('.kemono-tab-content.active');
        }
        if (!targetTab) return;

        var galleries = targetTab.querySelectorAll('.gallery-artworks');

        galleries.forEach(function(gallery) {
            var artworkImages = gallery.querySelectorAll('img[id*="artwork"], img[id*="featured"]');

            if (artworkImages.length > 0) {
                try {
                    /** @type {HTMLElement} */
                    var galleryEl = /** @type {HTMLElement} */ (gallery);
                    if (typeof Packery !== 'undefined') {
                        if (galleryEl.packeryInstance) {
                            galleryEl.packeryInstance.destroy();
                        }

                        galleryEl.packeryInstance = new Packery(galleryEl, {
                            percentPosition: true,
                            gutter: 5,
                            resize: true
                        });

                        setTimeout(function() {
                            galleryEl.style.opacity = '1';
                        }, 200);
                    } else {
                        for (var j = 0; j < 3; j++) {
                            (function(idx) {
                                setTimeout(function() {
                                    window.dispatchEvent(new Event('resize'));
                                }, idx * 200);
                            })(j);
                        }

                        setTimeout(function() {
                            galleryEl.style.opacity = '1';
                        }, 600);
                    }
                } catch (e) { // eslint-disable-line no-unused-vars
                    /** @type {HTMLElement} */ (gallery).style.opacity = '1';
                }
            }
        });
    }

    // 處理圖片載入（如果數據可用）
    if (window.pageImages) {
        try {
            // 手動設定備用背景資源
            ['after', 'before', 'fursuit'].forEach(function(period) {
                if (!window.pageImages['background-video-' + period] && !window.pageImages['background-img-' + period]) {
                    window.pageImages['background-img-' + period] = '/img/kemono/' + period + '/background.jpg';
                }
            });

            // 設定背景媒體（優先使用影片）
            /** @param {string} period */
            function setBackgroundMedia(period) {
                var videoId = 'background-video-' + period;
                var imgId = 'background-img-' + period;
                /** @type {HTMLVideoElement | null} */
                var videoElement = /** @type {HTMLVideoElement | null} */ (document.getElementById(videoId));
                /** @type {HTMLImageElement | null} */
                var imgElement = /** @type {HTMLImageElement | null} */ (document.getElementById(imgId));

                var videoUrl = window.pageImages[videoId];
                var imgUrl = window.pageImages[imgId];

                if (videoUrl && videoElement) {
                    /** @type {HTMLSourceElement | null} */
                    var source = videoElement.querySelector('source');
                    if (source) {
                        source.src = /** @type {string} */ (videoUrl);
                        videoElement.load();
                        videoElement.style.display = 'block';
                        videoElement.play().catch(function() {
                            videoElement.style.display = 'none';
                            if (imgUrl && imgElement) {
                                imgElement.src = /** @type {string} */ (imgUrl);
                                imgElement.style.display = 'block';
                            }
                        });
                    }
                    if (imgElement) {
                        imgElement.style.display = 'none';
                    }
                } else if (imgUrl && imgElement) {
                    imgElement.src = /** @type {string} */ (imgUrl);
                    imgElement.style.display = 'block';
                    if (videoElement) {
                        videoElement.style.display = 'none';
                    }
                }
            }

            // 設定初始背景
            setBackgroundMedia('after');
            setBackgroundMedia('before');
            setBackgroundMedia('fursuit');

            // 使用漸進式載入
            var allImageKeys = Object.keys(window.pageImages).filter(function(k) {
                return typeof window.pageImages[k] === 'string';
            });

            // 分類圖片：背景、當前 tab 頭像、其他
            var backgroundKeys = allImageKeys.filter(function(k) { return k.includes('background-img'); });
            var currentTabAvatar = ['avatar-after'];
            var otherKeys = allImageKeys.filter(function(k) {
                return !k.includes('background-img') && !currentTabAvatar.includes(k);
            });

            // 追蹤載入狀態
            var loadedImages = new Set();

            // 分批載入
            /**
             * @param {string[]} keys
             * @param {number} [delay]
             */
            function loadImagesProgressively(keys, delay) {
                delay = delay || 0;

                setTimeout(function() {
                    window.pageImages.loadProgressively(keys, function(result) {
                        if (result.error) {
                            loadedImages.add(result.key);
                        } else {
                            /** @type {HTMLImageElement | null} */
                            var element = /** @type {HTMLImageElement | null} */ (document.getElementById(result.key));
                            if (element) {
                                element.classList.add('loading');
                                element.src = /** @type {string} */ (window.pageImages[result.key]);
                                element.alt = element.alt.replace(i18n.loading, '');

                                element.onload = function() {
                                    element.classList.remove('image-placeholder', 'loading');
                                    element.classList.add('loaded');
                                    loadedImages.add(element.id);

                                    if (element.id.includes('avatar')) {
                                        element.style.position = 'relative';
                                        element.style.zIndex = '10';
                                        element.style.display = 'block';
                                        element.style.width = '100%';
                                        element.style.height = 'auto';
                                    }

                                    checkAndTriggerPackery();
                                };

                                element.onerror = function() {
                                    element.classList.remove('loading');
                                    element.classList.add('error');
                                    loadedImages.add(element.id);
                                    checkAndTriggerPackery();
                                };
                            } else {
                                loadedImages.add(result.key);
                            }
                        }
                    });
                }, delay);
            }

            // 檢查並觸發 Packery 重新計算
            function checkAndTriggerPackery() {
                var activeTab = document.querySelector('.kemono-tab-content.active');
                if (!activeTab) return;

                var tabImages = activeTab.querySelectorAll('img[id]');
                var tabImageIds = Array.from(tabImages).map(function(img) { return img.id; }).filter(function(id) { return id.indexOf('featured-') !== 0; });
                var allTabImagesLoaded = tabImageIds.every(function(id) { return loadedImages.has(id); });

                if (allTabImagesLoaded) {
                    setTimeout(function() {
                        forcePackeryRecalculation(activeTab);
                    }, 300);
                }
            }

            // 全局除錯函數
            window.forcePackeryReset = function() {
                var activeTab = document.querySelector('.kemono-tab-content.active');
                forcePackeryRecalculation(activeTab);
            };

            // 優先載入：背景和當前 tab 的頭像
            loadImagesProgressively(backgroundKeys, 0);
            loadImagesProgressively(currentTabAvatar, 100);

            // 延遲載入其他圖片
            var otherImagesLoaded = false;
            function loadRemainingImages() {
                if (!otherImagesLoaded) {
                    otherImagesLoaded = true;
                    loadImagesProgressively(otherKeys, 500);
                }
            }

            tabs.forEach(function(tab) {
                tab.addEventListener('click', loadRemainingImages, { once: true });
            });
            window.addEventListener('scroll', loadRemainingImages, { once: true });
            setTimeout(loadRemainingImages, 5000);

        } catch (e) { // eslint-disable-line no-unused-vars
            // 圖片載入初始化失敗，靜默處理
        }
    }

    // 切換背景
    /** @param {string} targetTab */
    function switchBackground(targetTab) {
        backgrounds.forEach(function(bg) {
            bg.classList.remove('active');
        });
        var targetBg = document.getElementById('background-' + targetTab);
        if (targetBg) {
            targetBg.classList.add('active');
        }
    }

    // Tab 點擊事件
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var clickedTab = /** @type {HTMLElement} */ (tab);
            var targetTab = clickedTab.dataset.tab;

            tabs.forEach(function(t) { t.classList.remove('active'); });
            clickedTab.classList.add('active');

            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            var targetContent = document.getElementById('tab-' + targetTab);
            if (targetContent) {
                /** @type {NodeListOf<HTMLElement>} */
                var galleries = targetContent.querySelectorAll('.gallery');
                galleries.forEach(function(gallery) {
                    gallery.style.opacity = '0';
                    gallery.style.transition = 'opacity 0.3s ease';
                });

                targetContent.classList.add('active');

                setTimeout(function() {
                    /** @type {NodeListOf<HTMLElement>} */
                    var avatarGalleries = targetContent.querySelectorAll('.gallery-avatar');
                    /** @type {NodeListOf<HTMLElement>} */
                    var artworkGalleries = targetContent.querySelectorAll('.gallery-artworks');

                    avatarGalleries.forEach(function(gallery) {
                        gallery.style.opacity = '1';
                        gallery.style.height = 'auto';
                        gallery.style.minHeight = 'auto';
                        gallery.style.maxHeight = 'none';

                        /** @type {NodeListOf<HTMLImageElement>} */
                        var avatarImages = gallery.querySelectorAll('img');
                        avatarImages.forEach(function(img) {
                            img.style.display = 'block';
                            img.style.opacity = '1';
                            img.style.visibility = 'visible';
                            img.style.position = 'relative';
                            img.style.left = 'auto';
                            img.style.top = 'auto';
                            img.style.transform = 'none';
                        });
                    });

                    artworkGalleries.forEach(function(gallery) {
                        /** @type {NodeListOf<HTMLImageElement>} */
                        var artworkImages = gallery.querySelectorAll('img');
                        artworkImages.forEach(function(img) {
                            img.style.display = 'block';
                            img.style.opacity = '1';
                            img.style.visibility = 'visible';
                            img.style.position = '';
                            img.style.left = '';
                            img.style.top = '';
                            img.style.transform = '';
                        });
                        gallery.style.opacity = '0';
                        gallery.style.transition = 'opacity 0.3s ease';
                    });

                    setTimeout(function() {
                        forcePackeryRecalculation(targetContent);
                    }, 100);
                }, 50);
            }

            switchBackground(targetTab);
        });
    });

    // 鍵盤導航
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            var activeTab = document.querySelector('.kemono-tab.active');
            if (activeTab) {
                var currentIndex = Array.from(tabs).indexOf(activeTab);
                var nextIndex;

                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
                } else {
                    nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
                }

                if (tabs[nextIndex]) {
                    /** @type {HTMLElement} */ (tabs[nextIndex]).click();
                }
            }
        }
    });

    // 創作者資訊提示功能
    var toast = document.getElementById('creator-toast');
    var toastText = document.getElementById('creator-text');
    var currentImageId = null;
    var lightboxWasOpen = false;

    /**
     * @param {HTMLElement} container
     * @param {string} label
     * @param {string} name
     * @param {string} [link]
     */
    function appendCreatorEntry(container, label, name, link) {
        var labelNode = document.createTextNode(label);
        container.appendChild(labelNode);

        if (link) {
            var a = document.createElement('a');
            a.href = link;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = name;
            container.appendChild(a);
        } else {
            container.appendChild(document.createTextNode(name));
        }
    }

    /**
     * @param {CreatorData} creatorData
     * @param {boolean} [isLightbox]
     */
    function showCreatorToast(creatorData, isLightbox) {
        if (typeof isLightbox === 'undefined') isLightbox = true;
        if (!creatorData) return;

        // 使用 DOM API 建構內容，避免 innerHTML 的 XSS 風險
        toastText.textContent = '';

        if (creatorData.photographer || creatorData.maker) {
            // 獸裝照片格式：顯示攝影師和製作者
            if (creatorData.photographer) {
                appendCreatorEntry(toastText, i18n.photographerLabel, creatorData.photographer, creatorData.photographerLink);
            }
            if (creatorData.photographer && creatorData.maker) {
                toastText.appendChild(document.createElement('br'));
            }
            if (creatorData.maker) {
                appendCreatorEntry(toastText, i18n.makerLabel, creatorData.maker, creatorData.makerLink);
            }
        } else {
            // 繪師格式：顯示繪師名稱
            appendCreatorEntry(toastText, i18n.creatorLabel, creatorData.name, creatorData.link);
        }

        toast.classList.add('show');
        lightboxWasOpen = isLightbox;
    }

    function hideCreatorToast() {
        toast.classList.remove('show');
        currentImageId = null;
        lightboxWasOpen = false;
    }

    // 監聽 lightbox 狀態變化
    var bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                var bodyClasses = document.body.classList;

                if (lightboxWasOpen && !bodyClasses.contains('glightbox-open')) {
                    hideCreatorToast();
                }
            }
        });
    });

    bodyObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
    });

    // 頁面卸載時清理 MutationObserver，避免記憶體洩漏
    window.addEventListener('beforeunload', function() {
        bodyObserver.disconnect();
    });

    // 監聽頁面點擊
    document.addEventListener('click', function(e) {
        var target = /** @type {HTMLElement} */ (e.target);
        if (currentImageId && toast.classList.contains('show') && !lightboxWasOpen) {
            if (!toast.contains(target) && !target.closest('#' + currentImageId)) {
                hideCreatorToast();
            }
        }
    }, true);

    // 監聽 ESC 鍵
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && currentImageId) {
            hideCreatorToast();
        }
    });

    // 為所有圖片加入點擊事件
    function setupImageListeners() {
        var avatarImages = [avatarAfter, avatarBefore, avatarFursuit];
        avatarImages.forEach(function(img) {
            if (img) {
                var hasLightbox = img.classList.contains('glightbox');

                img.addEventListener('click', function(e) {
                    var creator = window.creatorInfo[img.id];
                    if (creator) {
                        currentImageId = img.id;

                        if (hasLightbox) {
                            setTimeout(function() {
                                showCreatorToast(creator, true);
                            }, 100);
                        } else {
                            e.preventDefault();
                            showCreatorToast(creator, false);
                        }
                    }
                });
            }
        });

        /** @type {NodeListOf<HTMLImageElement>} */
        var galleryImages = document.querySelectorAll('.gallery img');
        galleryImages.forEach(function(img) {
            img.addEventListener('click', function() {
                var creator = window.creatorInfo[img.id];
                if (creator) {
                    currentImageId = img.id;
                    setTimeout(function() {
                        showCreatorToast(creator);
                    }, 100);
                }
            });
        });
    }

    // 設置圖片監聽器
    var allKeys = Object.keys(window.pageImages).filter(function(k) {
        return typeof window.pageImages[k] === 'string';
    });
    window.pageImages.preload(allKeys).then(function() {
        setTimeout(setupImageListeners, 500);
    }).catch(function() {
        setTimeout(setupImageListeners, 1000);
    });
    }, 100); // 延遲 100ms 執行
});
