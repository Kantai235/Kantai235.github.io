/* global KemonoGallery */
/**
 * 「現在的設定」相簿頁面專屬邏輯
 * 處理：時間軸導航、繪師篩選、月份分組渲染、URL hash 狀態同步
 * 使用 Packery 瀑布流排版（window load 後初始化，與介紹頁一致）
 */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var data = window.galleryAfterData;
    if (!data || !data.images.length) return;
    if (!window.KemonoGallery) return;

    var i18n = data.i18n || {};
    var sidebar = document.getElementById('gallery-after-sidebar');
    var mobileTimeline = document.getElementById('gallery-after-mobile-timeline');
    var filterContainer = document.getElementById('gallery-after-filter');
    var contentContainer = document.getElementById('gallery-after-content');

    var activeCreators = {};
    var activeMonth = null;
    var packeryInstances = [];

    KemonoGallery.Lightbox.init({
      i18n: {
        close: i18n.close,
        creatorLabel: i18n.creatorLabel,
        photographerLabel: i18n.photographerLabel,
        makerLabel: i18n.makerLabel
      }
    });

    buildSidebar();
    buildMobileTimeline();
    buildCreatorFilter();
    renderContent();
    applyHashState();

    window.addEventListener('hashchange', applyHashState);

    /* 圖片全部載入後初始化 Packery */
    if (typeof Packery !== 'undefined') {
      var grids = contentContainer.querySelectorAll('.gallery-grid');
      grids.forEach(function (grid) {
        var imgs = grid.querySelectorAll('img');
        var loaded = 0;
        var total = imgs.length;
        function onReady() {
          loaded++;
          if (loaded >= total) {
            packeryInstances.push(new Packery(grid, {
              percentPosition: true,
              gutter: 5,
              resize: true
            }));
          }
        }
        imgs.forEach(function (img) {
          if (img.complete) onReady();
          else {
            img.addEventListener('load', onReady);
            img.addEventListener('error', onReady);
          }
        });
        if (total === 0) {
          packeryInstances.push(new Packery(grid, {
            percentPosition: true,
            gutter: 5,
            resize: true
          }));
        }
      });
    }

    /* ------------------------------------------
       建構側邊時間軸
       ------------------------------------------ */
    function buildSidebar() {
      var currentYear = '';
      data.months.forEach(function (m) {
        if (m.year !== currentYear) {
          currentYear = m.year;
          var yearEl = document.createElement('div');
          yearEl.className = 'gallery-sidebar-year';
          yearEl.textContent = m.year;
          sidebar.appendChild(yearEl);
        }
        var link = document.createElement('a');
        link.className = 'gallery-sidebar-month';
        link.href = '#month=' + m.key;
        link.setAttribute('data-month', m.key);
        link.textContent = parseInt(m.month, 10) + ' 月';
        link.addEventListener('click', function (e) {
          e.preventDefault();
          scrollToMonth(m.key);
          updateHash();
        });
        sidebar.appendChild(link);
      });
    }

    /* ------------------------------------------
       建構行動版時間軸
       ------------------------------------------ */
    function buildMobileTimeline() {
      data.months.forEach(function (m) {
        var pill = document.createElement('button');
        pill.className = 'gallery-mobile-timeline-item';
        pill.setAttribute('data-month', m.key);
        pill.textContent = m.year + '/' + parseInt(m.month, 10);
        pill.addEventListener('click', function () {
          scrollToMonth(m.key);
          updateHash();
        });
        mobileTimeline.appendChild(pill);
      });
    }

    /* ------------------------------------------
       建構繪師篩選列
       ------------------------------------------ */
    function buildCreatorFilter() {
      var label = document.createElement('span');
      label.className = 'gallery-creator-filter-label';
      label.textContent = i18n.filterLabel || '';
      filterContainer.appendChild(label);

      var allBtn = document.createElement('button');
      allBtn.className = 'gallery-creator-pill active';
      allBtn.textContent = i18n.filterAll || 'All';
      allBtn.addEventListener('click', function () {
        activeCreators = {};
        updateFilterUI();
        applyFilters();
        updateHash();
      });
      filterContainer.appendChild(allBtn);

      data.creators.forEach(function (c) {
        var pill = document.createElement('button');
        pill.className = 'gallery-creator-pill';
        pill.setAttribute('data-creator', c.id);
        pill.textContent = c.name;
        pill.addEventListener('click', function () {
          if (activeCreators[c.id]) {
            delete activeCreators[c.id];
          } else {
            activeCreators[c.id] = true;
          }
          updateFilterUI();
          applyFilters();
          updateHash();
        });
        filterContainer.appendChild(pill);
      });
    }

    function updateFilterUI() {
      var hasActive = Object.keys(activeCreators).length > 0;
      var pills = filterContainer.querySelectorAll('.gallery-creator-pill');
      pills.forEach(function (pill) {
        var creatorId = pill.getAttribute('data-creator');
        if (!creatorId) {
          pill.classList.toggle('active', !hasActive);
        } else {
          pill.classList.toggle('active', !!activeCreators[creatorId]);
        }
      });
    }

    /* ------------------------------------------
       渲染月份分組內容
       ------------------------------------------ */
    function renderContent() {
      var groupedByMonth = {};
      data.images.forEach(function (img) {
        var key = img.yearMonth || 'unknown';
        if (!groupedByMonth[key]) groupedByMonth[key] = [];
        groupedByMonth[key].push(img);
      });

      data.months.forEach(function (m) {
        var monthImages = groupedByMonth[m.key] || [];
        if (!monthImages.length) return;

        var section = document.createElement('div');
        section.className = 'gallery-month-section';
        section.id = 'month-' + m.key;

        var header = document.createElement('div');
        header.className = 'gallery-month-header';

        var title = document.createElement('h3');
        title.className = 'gallery-month-title';
        title.textContent = formatMonth(m.year, m.month);

        var count = document.createElement('span');
        count.className = 'gallery-month-count';
        count.textContent = '(' + monthImages.length + ' ' + (i18n.countSuffix || '') + ')';

        header.appendChild(title);
        header.appendChild(count);
        section.appendChild(header);

        var grid = document.createElement('div');
        grid.className = 'gallery-grid';

        monthImages.forEach(function (img) {
          var item = document.createElement('div');
          item.className = 'gallery-grid-item';
          item.setAttribute('data-creator', img.creatorId);
          item.setAttribute('data-month', m.key);

          var imgEl = document.createElement('img');
          imgEl.src = img.src;
          imgEl.alt = img.alt;
          imgEl.className = 'nozoom rounded-lg shadow-lg';
          imgEl.loading = 'lazy';

          item.appendChild(imgEl);
          grid.appendChild(item);

          item.addEventListener('click', function () {
            var visibleImages = getVisibleImages();
            var visibleIndex = visibleImages.indexOf(img);
            if (visibleIndex === -1) visibleIndex = 0;
            KemonoGallery.Lightbox.open(visibleImages, visibleIndex);
          });
        });

        section.appendChild(grid);
        contentContainer.appendChild(section);
      });
    }

    /* ------------------------------------------
       篩選邏輯
       ------------------------------------------ */
    function applyFilters() {
      var hasCreatorFilter = Object.keys(activeCreators).length > 0;
      var visibleMonths = {};

      var sections = contentContainer.querySelectorAll('.gallery-month-section');
      sections.forEach(function (section) {
        var monthKey = section.id.replace('month-', '');
        var items = section.querySelectorAll('.gallery-grid-item');
        var visibleCount = 0;

        items.forEach(function (item) {
          var creatorId = item.getAttribute('data-creator');
          var hidden = hasCreatorFilter && !activeCreators[creatorId];
          item.classList.toggle('filtered-out', hidden);
          if (!hidden) visibleCount++;
        });

        var sectionHidden = visibleCount === 0;
        section.classList.toggle('filtered-out', sectionHidden);

        if (!sectionHidden) {
          visibleMonths[monthKey] = true;
        }

        var countEl = section.querySelector('.gallery-month-count');
        if (countEl) {
          countEl.textContent = '(' + visibleCount + ' ' + (i18n.countSuffix || '') + ')';
        }
      });

      /* 同步更新側邊時間軸與行動版時間軸 */
      updateTimelineVisibility(visibleMonths, hasCreatorFilter);

      /* 篩選後重排 Packery */
      packeryInstances.forEach(function (pckry) {
        pckry.layout();
      });

      /* 根據目前捲動位置，標記最接近的可見月份為 active */
      var visibleSections = contentContainer.querySelectorAll('.gallery-month-section:not(.filtered-out)');
      var found = null;
      visibleSections.forEach(function (section) {
        if (section.getBoundingClientRect().top <= 120) {
          found = section.id.replace('month-', '');
        }
      });
      if (!found && visibleSections.length) {
        found = visibleSections[0].id.replace('month-', '');
      }
      if (found) {
        activeMonth = found;
        updateTimelineUI();
      }
    }

    function updateTimelineVisibility(visibleMonths, hasFilter) {
      /* 桌面版側邊欄 */
      var visibleYears = {};
      sidebar.querySelectorAll('.gallery-sidebar-month').forEach(function (el) {
        var monthKey = el.getAttribute('data-month');
        var hidden = hasFilter && !visibleMonths[monthKey];
        el.style.display = hidden ? 'none' : '';
        if (!hidden) {
          var year = monthKey.split('-')[0];
          visibleYears[year] = true;
        }
      });
      sidebar.querySelectorAll('.gallery-sidebar-year').forEach(function (el) {
        var year = el.textContent.trim();
        el.style.display = (hasFilter && !visibleYears[year]) ? 'none' : '';
      });

      /* 行動版時間軸 */
      mobileTimeline.querySelectorAll('.gallery-mobile-timeline-item').forEach(function (el) {
        var monthKey = el.getAttribute('data-month');
        var hidden = hasFilter && !visibleMonths[monthKey];
        el.style.display = hidden ? 'none' : '';
      });
    }

    function getVisibleImages() {
      var hasCreatorFilter = Object.keys(activeCreators).length > 0;
      return data.images.filter(function (img) {
        return !hasCreatorFilter || activeCreators[img.creatorId];
      });
    }

    /* ------------------------------------------
       時間軸導航
       ------------------------------------------ */
    function scrollToMonth(monthKey) {
      activeMonth = monthKey;
      updateTimelineUI();

      var section = document.getElementById('month-' + monthKey);
      if (section) {
        KemonoGallery.scrollToElement(section, 80);
      }
    }

    function updateTimelineUI() {
      sidebar.querySelectorAll('.gallery-sidebar-month').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-month') === activeMonth);
      });
      mobileTimeline.querySelectorAll('.gallery-mobile-timeline-item').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-month') === activeMonth);
      });
    }

    /* 滾動時自動高亮目前所在的月份 */
    var scrollTimer = null;
    window.addEventListener('scroll', function () {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function () {
        var sections = contentContainer.querySelectorAll('.gallery-month-section:not(.filtered-out)');
        var found = null;
        sections.forEach(function (section) {
          var rect = section.getBoundingClientRect();
          if (rect.top <= 120) {
            found = section.id.replace('month-', '');
          }
        });
        if (found && found !== activeMonth) {
          activeMonth = found;
          updateTimelineUI();
        }
      }, 100);
    }, { passive: true });

    /* ------------------------------------------
       URL Hash 狀態
       ------------------------------------------ */
    function applyHashState() {
      var state = KemonoGallery.HashState.get();

      if (state.creator) {
        activeCreators = {};
        state.creator.split(',').forEach(function (id) {
          if (id) activeCreators[id] = true;
        });
        updateFilterUI();
        applyFilters();
      }

      if (state.month) {
        setTimeout(function () {
          scrollToMonth(state.month);
        }, 200);
      }
    }

    function updateHash() {
      var params = {};
      var creatorKeys = Object.keys(activeCreators);
      if (creatorKeys.length > 0) {
        params.creator = creatorKeys.join(',');
      }
      if (activeMonth) {
        params.month = activeMonth;
      }
      KemonoGallery.HashState.set(params);
    }

    /* ------------------------------------------
       工具函式
       ------------------------------------------ */
    function formatMonth(year, month) {
      var fmt = i18n.monthFormat || '%s/%s';
      return fmt.replace('%s', year).replace('%s', parseInt(month, 10));
    }
  });
})();
