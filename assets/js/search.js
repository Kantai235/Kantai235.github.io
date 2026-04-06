/**
 * @file search.js
 * @description 搜尋功能實作。
 *   使用 Fuse.js 進行模糊搜尋，支援分類與年份篩選、關鍵字高亮、
 *   搜尋結果統計與 URL 參數同步。
 *
 * @requires Fuse.js — 透過 Blowfish 主題內建引入
 *
 * 預期 DOM 元素：
 *   - #search-input（搜尋輸入框）
 *   - #category-filter（分類下拉選單）
 *   - #year-filter（年份下拉選單）
 *   - #search-results（結果容器）
 *   - #search-stats / #search-count（統計顯示）
 *   - #no-results（無結果提示）
 */
document.addEventListener('DOMContentLoaded', function() {
  let searchIndex = [];
  let fuse;

  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const yearFilter = document.getElementById('year-filter');
  const searchResults = document.getElementById('search-results');
  const searchStats = document.getElementById('search-stats');
  const searchCount = document.getElementById('search-count');
  const noResults = document.getElementById('no-results');

  if (!searchInput) return;

  // 從 <html lang="..."> 取得當前語言，用於日期格式化
  const currentLocale = document.documentElement.lang || 'zh-TW';

  /**
   * 載入搜尋索引並初始化 Fuse.js。
   * 索引檔由 Hugo 在建置時產生於 /index.json。
   */
  fetch('/index.json')
    .then(response => response.json())
    .then(data => {
      searchIndex = data;

      fuse = new Fuse(searchIndex, {
        keys: [
          { name: 'title', weight: 3 },
          { name: 'content', weight: 1 },
          { name: 'tags', weight: 2 },
          { name: 'categories', weight: 2 }
        ],
        threshold: 0.3,
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 2
      });

      // 從 URL 參數還原搜尋狀態
      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get('q');
      if (query) {
        searchInput.value = query;
        performSearch();
      }
    })
    .catch(function(error) {
      console.error('搜尋索引載入失敗:', error);
    });

  // 搜尋事件監聽（300ms 防抖）
  let searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
  });

  categoryFilter.addEventListener('change', performSearch);
  yearFilter.addEventListener('change', performSearch);

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      performSearch();
    }
  });

  /**
   * 執行搜尋：讀取輸入框與篩選器的值，透過 Fuse.js 搜尋後顯示結果。
   */
  function performSearch() {
    const query = searchInput.value.trim();
    const selectedCategory = categoryFilter.value;
    const selectedYear = yearFilter.value;

    if (!fuse || (!query && !selectedCategory && !selectedYear)) {
      searchResults.innerHTML = '';
      searchStats.style.display = 'none';
      noResults.style.display = 'none';
      return;
    }

    var results = query
      ? fuse.search(query)
      : searchIndex.map(function(item, index) {
          return { item: item, refIndex: index };
        });

    if (selectedCategory) {
      results = results.filter(function(result) {
        return result.item.categories && result.item.categories.includes(selectedCategory);
      });
    }

    if (selectedYear) {
      results = results.filter(function(result) {
        return new Date(result.item.date).getFullYear().toString() === selectedYear;
      });
    }

    displayResults(results, query);
    updateSearchStats(results.length, query);
    updateURL(query);
  }

  /**
   * 將搜尋結果渲染至 DOM。
   * @param {Array} results - Fuse.js 搜尋結果陣列
   * @param {string} query - 搜尋關鍵字
   */
  function displayResults(results, query) {
    searchResults.innerHTML = '';

    if (results.length === 0) {
      noResults.style.display = 'block';
      return;
    }

    noResults.style.display = 'none';

    results.forEach(function(result) {
      var item = result.item;
      var resultElement = createResultElement(item, query, result.matches);
      searchResults.appendChild(resultElement);
    });
  }

  /**
   * 建立單一搜尋結果的 DOM 元素。
   * @param {Object} item - 文章資料物件
   * @param {string} query - 搜尋關鍵字
   * @param {Array} matches - Fuse.js 匹配資訊
   * @returns {HTMLElement} 搜尋結果卡片
   */
  function createResultElement(item, query, matches) {
    var div = document.createElement('div');
    div.className = 'search-result p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors';

    var content = item.content || '';
    var title = item.title || '';

    if (matches && query) {
      matches.forEach(function(match) {
        if (match.key === 'title') {
          title = highlightMatches(title, match.indices);
        } else if (match.key === 'content') {
          content = getSnippet(content, match.indices);
        }
      });
    }

    var tagsHTML = '';
    if (item.tags) {
      tagsHTML = '<div class="mt-2 flex flex-wrap gap-1">' +
        item.tags.map(function(tag) {
          return '<span class="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-xs">' + tag + '</span>';
        }).join('') + '</div>';
    }

    var categoriesText = item.categories ? ' &bull; ' + item.categories.join(', ') : '';
    var contentPreview = content.substring(0, 200) + (content.length > 200 ? '...' : '');

    div.innerHTML =
      '<h3 class="text-lg font-semibold mb-2">' +
        '<a href="' + item.permalink + '" class="text-primary-600 dark:text-primary-400 hover:underline">' +
          title +
        '</a>' +
      '</h3>' +
      '<div class="text-sm text-neutral-500 dark:text-neutral-400 mb-2">' +
        formatDate(item.date) + categoriesText +
      '</div>' +
      '<p class="text-neutral-700 dark:text-neutral-300">' + contentPreview + '</p>' +
      tagsHTML;

    return div;
  }

  /**
   * 高亮匹配的文字片段。
   * @param {string} text - 原始文字
   * @param {Array} indices - Fuse.js 匹配索引陣列 [[start, end], ...]
   * @returns {string} 含有 <mark> 標籤的 HTML 字串
   */
  function highlightMatches(text, indices) {
    if (!indices || indices.length === 0) return text;

    var result = '';
    var lastIndex = 0;

    indices.forEach(function(pair) {
      var start = pair[0];
      var end = pair[1];
      result += text.slice(lastIndex, start);
      result += '<mark class="bg-yellow-200 dark:bg-yellow-800">' + text.slice(start, end + 1) + '</mark>';
      lastIndex = end + 1;
    });

    result += text.slice(lastIndex);
    return result;
  }

  /**
   * 從內容中擷取匹配片段，前後各取 50/100 字元的上下文。
   * @param {string} content - 完整內容
   * @param {Array} indices - Fuse.js 匹配索引
   * @returns {string} 含高亮標記的內容片段
   */
  function getSnippet(content, indices) {
    if (!indices || indices.length === 0) {
      return content.substring(0, 200);
    }

    var firstMatch = indices[0];
    var start = Math.max(0, firstMatch[0] - 50);
    var end = Math.min(content.length, firstMatch[1] + 100);

    var snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    var adjustedIndices = indices
      .map(function(pair) { return [pair[0] - start, pair[1] - start]; })
      .filter(function(pair) { return pair[0] >= 0 && pair[1] < snippet.length; });

    return highlightMatches(snippet, adjustedIndices);
  }

  /**
   * 更新搜尋結果統計數字。
   */
  function updateSearchStats(count, query) {
    searchCount.textContent = count;
    searchStats.style.display = (query || count > 0) ? 'block' : 'none';
  }

  /**
   * 將搜尋關鍵字同步至 URL query string（不觸發頁面重新載入）。
   */
  function updateURL(query) {
    var url = new URL(window.location);
    if (query) {
      url.searchParams.set('q', query);
    } else {
      url.searchParams.delete('q');
    }
    window.history.replaceState({}, '', url);
  }

  /**
   * 格式化日期字串，根據當前頁面語言選擇適當的 locale。
   * @param {string} dateString - ISO 格式日期字串
   * @returns {string} 在地化的日期字串
   */
  function formatDate(dateString) {
    var date = new Date(dateString);
    return date.toLocaleDateString(currentLocale);
  }

  // 自動 focus 搜尋框
  searchInput.focus();

  // 按 / 鍵快速 focus 搜尋框
  document.addEventListener('keydown', function(e) {
    if (e.key === '/' && e.target !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });
});
