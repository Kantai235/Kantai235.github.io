// 平滑滾動到指定年份
document.addEventListener('DOMContentLoaded', function() {
    // 為年份導航連結添加平滑滾動
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