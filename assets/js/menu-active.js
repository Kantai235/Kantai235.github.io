/**
 * @file menu-active.js
 * @description 以原生 JavaScript 標記目前頁面的導覽列項目，
 *   取代主題原本為了同一件事而在全站載入 jQuery 的做法。
 */
document.addEventListener('DOMContentLoaded', function() {
  const currentPath = window.location.pathname;
  const menuLinks = document.querySelectorAll('.main-menu a[href]');

  menuLinks.forEach(function(link) {
    const href = link.getAttribute('href');

    if (!href || href.startsWith('#')) {
      return;
    }

    const resolvedUrl = new URL(href, window.location.origin);

    if (resolvedUrl.origin !== window.location.origin) {
      return;
    }

    if (resolvedUrl.pathname !== currentPath) {
      return;
    }

    link.querySelectorAll('p').forEach(function(label) {
      label.classList.add('active');
    });
  });
});
