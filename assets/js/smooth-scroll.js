/**
 * @file smooth-scroll.js
 * @description 年份導覽的平滑捲動功能。
 *   為 `.year-navigation` 內的錨點連結（`a[href^="#year-"]`）加入平滑捲動行為，
 *   取代瀏覽器預設的瞬間跳轉。同時在頁面載入時，若 URL 帶有 `#year-` hash，
 *   延遲 100ms 後自動捲動至對應位置（延遲是為了確保 DOM 渲染完成）。
 */
document.addEventListener('DOMContentLoaded', function() {
    const yearLinks = document.querySelectorAll('.year-navigation a[href^="#year-"]');
    
    yearLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // 更新 URL hash
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
    
    // 處理頁面加載時的 hash 滾動
    if (window.location.hash && window.location.hash.startsWith('#year-')) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    }
});