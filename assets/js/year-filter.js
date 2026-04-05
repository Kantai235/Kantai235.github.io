/**
 * @file year-filter.js
 * @description 文章列表的年份篩選功能（雙容器模式）。
 *   為了解決「篩選」與「分頁」的衝突，頁面同時存在兩個文章容器：
 *   - `#articles-container`（分頁模式）：Hugo 產生的分頁文章清單，預設顯示。
 *   - `#all-articles-container`（篩選模式）：包含所有文章的隱藏容器，篩選時切換顯示。
 *
 *   全域暴露：window.yearFilter 物件，提供 filterByYear / clearFilter / isFiltering / switchContainer
 *   鍵盤快捷鍵：數字鍵 1-9 對應篩選按鈕、0 顯示全部、Esc 清除篩選。
 */
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.year-filter-btn');
    const paginatedContainer = document.getElementById('articles-container');
    const allArticlesContainer = document.getElementById('all-articles-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filterMessage = document.getElementById('filter-message');
    const filterText = document.getElementById('filter-text');
    const clearFilterBtn = document.getElementById('clear-filter');
    
    let allArticles = [];
    let allYearHeaders = [];
    let isFiltering = false;
    
    // 初始化：收集所有文章（來自篩選模式容器）
    if (allArticlesContainer) {
        allArticles = Array.from(allArticlesContainer.querySelectorAll('.article-item-all'));
        allYearHeaders = Array.from(allArticlesContainer.querySelectorAll('.year-header-all'));
    }
    
    /**
     * 切換分頁模式與篩選模式的容器顯示狀態。
     * @param {boolean} showPaginated - true 顯示分頁容器，false 顯示全文章篩選容器
     */
    function switchContainer(showPaginated) {
        // 檢查元素是否存在，避免在非文章列表頁面出錯
        if (!paginatedContainer || !allArticlesContainer || !paginationContainer) {
            return;
        }

        if (showPaginated) {
            // 顯示分頁模式
            paginatedContainer.style.display = 'block';
            allArticlesContainer.classList.add('hidden');
            paginationContainer.style.display = 'block';
        } else {
            // 顯示篩選模式
            paginatedContainer.style.display = 'none';
            allArticlesContainer.classList.remove('hidden');
            paginationContainer.style.display = 'none';
        }
    }
    
    /**
     * 依年份篩選文章。傳入 'all' 則回到分頁模式；
     * 傳入特定年份字串則切換至篩選模式，僅顯示該年份的文章與標題。
     * @param {string} year - 年份字串（如 '2023'）或 'all'
     */
    function filterArticlesByYear(year) {
        if (!allArticlesContainer || allArticles.length === 0) return;
        
        if (year === 'all') {
            // 回到分頁模式
            isFiltering = false;
            switchContainer(true);
            updateFilterMessage(year, 0);
        } else {
            // 切換到篩選模式
            isFiltering = true;
            switchContainer(false);
            
            let visibleCount = 0;
            
            // 篩選文章
            allArticles.forEach(article => {
                const articleYear = article.dataset.year;
                if (articleYear === year) {
                    article.style.display = 'block';
                    visibleCount++;
                } else {
                    article.style.display = 'none';
                }
            });
            
            // 篩選年份標題
            allYearHeaders.forEach(header => {
                const headerYear = header.dataset.year;
                if (headerYear === year) {
                    header.style.display = 'block';
                } else {
                    header.style.display = 'none';
                }
            });
            
            updateFilterMessage(year, visibleCount);
        }
        
        // 滾動到頂部
        const activeContainer = isFiltering ? allArticlesContainer : paginatedContainer;
        activeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    /**
     * 更新篩選結果的提示訊息（例如「顯示 2023 年的文章：共 5 篇」）。
     * @param {string} year - 當前篩選的年份或 'all'
     * @param {number} visibleCount - 符合篩選條件的文章數量
     */
    function updateFilterMessage(year, visibleCount) {
        if (!filterMessage || !filterText) return;
        
        if (year === 'all' || !isFiltering) {
            filterMessage.classList.add('hidden');
        } else {
            filterText.textContent = `顯示 ${year} 年的文章：共 ${visibleCount} 篇`;
            filterMessage.classList.remove('hidden');
        }
    }
    
    /**
     * 清除篩選狀態，模擬點擊「全部��按鈕以回到分頁模式。
     */
    function clearFilter() {
        const allButton = document.querySelector('[data-year="all"]');
        if (allButton) {
            allButton.click();
        }
    }
    
    /**
     * 更新篩選按鈕的 active/inactive 樣式，使當前選中的按鈕呈現高亮狀態。
     * @param {HTMLElement} activeButton - 被點擊的按鈕元素
     */
    function updateButtonStates(activeButton) {
        filterButtons.forEach(btn => {
            btn.classList.remove('active', 'bg-primary-500', 'text-white', 'dark:bg-primary-600');
            btn.classList.add('bg-neutral-200', 'dark:bg-neutral-700', 'text-neutral-700', 'dark:text-neutral-300');
        });
        
        activeButton.classList.add('active', 'bg-primary-500', 'text-white', 'dark:bg-primary-600');
        activeButton.classList.remove('bg-neutral-200', 'dark:bg-neutral-700', 'text-neutral-700', 'dark:text-neutral-300');
    }
    
    // 為篩選按鈕添加點擊事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const year = this.dataset.year;
            filterArticlesByYear(year);
            updateButtonStates(this);
            
            // 更新 URL
            if (year === 'all') {
                const urlWithoutHash = window.location.href.split('#')[0];
                history.pushState(null, null, urlWithoutHash);
            } else {
                const baseUrl = window.location.href.split('#')[0].split('?')[0];
                history.pushState(null, null, `${baseUrl}#year-${year}`);
            }
        });
    });
    
    // 清除篩選按鈕事件
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', clearFilter);
    }
    
    /**
     * 頁面載入時解析 URL hash（如 `#year-2023`），自動觸發對應年份的篩選。
     * 使用 setTimeout 延遲 100ms 確保 DOM 已完成渲染。
     */
    function handleInitialHash() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#year-')) {
            const year = hash.replace('#year-', '');
            const targetButton = document.querySelector(`[data-year="${year}"]`);
            
            if (targetButton) {
                setTimeout(() => {
                    targetButton.click();
                }, 100);
            }
        }
    }
    
    // 處理瀏覽器前進後退
    window.addEventListener('popstate', function() {
        // 如果回到沒有 hash 的頁面，自動點擊"全部"按鈕
        if (!window.location.hash) {
            const allButton = document.querySelector('[data-year="all"]');
            if (allButton && isFiltering) {
                allButton.click();
            }
        } else {
            handleInitialHash();
        }
    });
    
    // 頁面加載完成後處理 hash
    handleInitialHash();
    
    // 鍵盤支援
    document.addEventListener('keydown', function(e) {
        // 只在沒有焦點在輸入框時才啟用快捷鍵
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA' ||
            document.activeElement.isContentEditable) {
            return;
        }
        
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            if (filterButtons[index]) {
                filterButtons[index].click();
            }
        } else if (e.key === '0') {
            // 0 鍵顯示全部
            const allButton = document.querySelector('[data-year="all"]');
            if (allButton) allButton.click();
        } else if (e.key === 'Escape') {
            // Esc 鍵清除篩選
            clearFilter();
        }
    });
    
    /** 暴露至全域的公開 API，供其他腳本（如 smooth-scroll.js）呼叫 */
    window.yearFilter = {
        filterByYear: filterArticlesByYear,
        clearFilter: clearFilter,
        isFiltering: () => isFiltering,
        switchContainer: switchContainer
    };
    
    // 初始化：確保預設顯示分頁模式（只有在元素存在時才執行）
    if (paginatedContainer && allArticlesContainer && paginationContainer) {
        switchContainer(true);
    }
});