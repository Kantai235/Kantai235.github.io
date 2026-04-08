/**
 * 相簿系統共用模組
 * 提供 Lightbox、懶載入、URL hash 狀態管理
 */
(function () {
  'use strict';

  var KemonoGallery = {};

  /* ==========================================
     Lightbox
     ========================================== */

  KemonoGallery.Lightbox = (function () {
    var overlay = null;
    var imgEl = null;
    var counterEl = null;
    var creatorEl = null;
    var prevBtn = null;
    var nextBtn = null;
    var images = [];
    var currentIndex = 0;
    var scrollY = 0;
    var touchStartX = 0;
    var touchStartY = 0;
    var i18n = {};

    function init(options) {
      i18n = options && options.i18n || {};
      createDOM();
      bindEvents();
    }

    function createDOM() {
      overlay = document.createElement('div');
      overlay.className = 'gallery-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-label', 'Image viewer');

      var closeBtn = document.createElement('button');
      closeBtn.className = 'gallery-lightbox-close';
      closeBtn.setAttribute('aria-label', i18n.close || 'Close');
      closeBtn.innerHTML = '&times;';
      closeBtn.addEventListener('click', close);

      prevBtn = document.createElement('button');
      prevBtn.className = 'gallery-lightbox-nav prev';
      prevBtn.setAttribute('aria-label', 'Previous');
      prevBtn.innerHTML = '&#8249;';
      prevBtn.addEventListener('click', showPrev);

      nextBtn = document.createElement('button');
      nextBtn.className = 'gallery-lightbox-nav next';
      nextBtn.setAttribute('aria-label', 'Next');
      nextBtn.innerHTML = '&#8250;';
      nextBtn.addEventListener('click', showNext);

      imgEl = document.createElement('img');
      imgEl.className = 'gallery-lightbox-image';
      imgEl.alt = '';

      counterEl = document.createElement('div');
      counterEl.className = 'gallery-lightbox-counter';

      creatorEl = document.createElement('div');
      creatorEl.className = 'gallery-lightbox-creator';
      creatorEl.style.display = 'none';

      overlay.appendChild(closeBtn);
      overlay.appendChild(prevBtn);
      overlay.appendChild(nextBtn);
      overlay.appendChild(imgEl);
      overlay.appendChild(counterEl);
      overlay.appendChild(creatorEl);
      document.body.appendChild(overlay);
    }

    function bindEvents() {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) close();
      });

      document.addEventListener('keydown', function (e) {
        if (!overlay.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') showPrev();
        else if (e.key === 'ArrowRight') showNext();
      });

      overlay.addEventListener('touchstart', function (e) {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });

      overlay.addEventListener('touchend', function (e) {
        if (e.changedTouches.length === 1) {
          var dx = e.changedTouches[0].clientX - touchStartX;
          var dy = e.changedTouches[0].clientY - touchStartY;
          if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx > 0) showPrev();
            else showNext();
          }
        }
      }, { passive: true });
    }

    function open(imageList, startIndex) {
      images = imageList;
      currentIndex = startIndex || 0;
      scrollY = window.scrollY;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      showCurrent();
    }

    function close() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      window.scrollTo(0, scrollY);
    }

    function showCurrent() {
      var item = images[currentIndex];
      if (!item) return;

      imgEl.src = item.src;
      imgEl.alt = item.alt || '';

      counterEl.textContent = (currentIndex + 1) + ' / ' + images.length;

      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === images.length - 1;

      if (item.creator) {
        creatorEl.style.display = 'block';
        creatorEl.textContent = '';

        if (item.creator.name) {
          var label = document.createTextNode((i18n.creatorLabel || '') + ' ');
          creatorEl.appendChild(label);
          if (item.creator.link) {
            var a = document.createElement('a');
            a.href = item.creator.link;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = item.creator.name;
            creatorEl.appendChild(a);
          } else {
            creatorEl.appendChild(document.createTextNode(item.creator.name));
          }
        }
        if (item.creator.photographer) {
          creatorEl.textContent = '';
          var pLabel = document.createTextNode((i18n.photographerLabel || '') + item.creator.photographer);
          creatorEl.appendChild(pLabel);
          if (item.creator.maker) {
            creatorEl.appendChild(document.createTextNode(' / ' + (i18n.makerLabel || '') + item.creator.maker));
          }
        }
      } else {
        creatorEl.style.display = 'none';
      }
    }

    function showPrev() {
      if (currentIndex > 0) {
        currentIndex--;
        showCurrent();
      }
    }

    function showNext() {
      if (currentIndex < images.length - 1) {
        currentIndex++;
        showCurrent();
      }
    }

    return { init: init, open: open, close: close };
  })();

  /* ==========================================
     懶載入
     ========================================== */

  KemonoGallery.lazyLoad = function (container) {
    var lazyImages = container.querySelectorAll('img[data-src]');
    if (!lazyImages.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var img = entry.target;
          var placeholder = img.previousElementSibling;

          img.onload = function () {
            img.style.opacity = '1';
            if (placeholder && placeholder.classList.contains('gallery-placeholder')) {
              placeholder.remove();
            }
            KemonoGallery.relayoutPackery(img.closest('.gallery-grid'));
          };

          img.onerror = function () {
            img.style.opacity = '0.4';
            if (placeholder && placeholder.classList.contains('gallery-placeholder')) {
              placeholder.remove();
            }
            KemonoGallery.relayoutPackery(img.closest('.gallery-grid'));
          };

          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px 0px' });

    lazyImages.forEach(function (img) {
      observer.observe(img);
    });
  };

  /* ==========================================
     Packery 瀑布流排版
     ========================================== */

  var packeryInstances = {};

  KemonoGallery.initPackery = function (gridEl) {
    if (!gridEl || typeof Packery === 'undefined') return null;

    var id = gridEl.id || ('gallery-grid-' + Math.random().toString(36).slice(2, 8));
    gridEl.id = id;

    if (packeryInstances[id]) {
      packeryInstances[id].destroy();
    }

    var pckry = new Packery(gridEl, {
      percentPosition: true,
      gutter: 5,
      resize: true
    });

    packeryInstances[id] = pckry;
    return pckry;
  };

  KemonoGallery.relayoutPackery = function (gridEl) {
    if (!gridEl) return;
    var id = gridEl.id;
    if (id && packeryInstances[id]) {
      packeryInstances[id].layout();
    }
  };

  KemonoGallery.destroyPackery = function (gridEl) {
    if (!gridEl) return;
    var id = gridEl.id;
    if (id && packeryInstances[id]) {
      packeryInstances[id].destroy();
      delete packeryInstances[id];
    }
  };

  /* ==========================================
     URL Hash 狀態管理
     ========================================== */

  KemonoGallery.HashState = {
    get: function () {
      var params = {};
      var hash = window.location.hash.slice(1);
      if (!hash) return params;
      hash.split('&').forEach(function (pair) {
        var parts = pair.split('=');
        if (parts.length === 2) {
          params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        }
      });
      return params;
    },

    set: function (params) {
      var pairs = [];
      Object.keys(params).forEach(function (key) {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
          pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
      });
      var newHash = pairs.length ? '#' + pairs.join('&') : '';
      if (window.location.hash !== newHash) {
        history.replaceState(null, '', window.location.pathname + window.location.search + newHash);
      }
    }
  };

  /* ==========================================
     工具函式
     ========================================== */

  KemonoGallery.scrollToElement = function (el, offset) {
    var rect = el.getBoundingClientRect();
    var scrollTop = window.scrollY + rect.top - (offset || 80);
    window.scrollTo({ top: scrollTop, behavior: 'smooth' });
  };

  window.KemonoGallery = KemonoGallery;
})();
