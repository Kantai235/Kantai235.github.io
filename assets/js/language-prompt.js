(function() {
  const STORAGE_KEY = 'language-preference-dismissed';
  const DISMISS_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days
  
  const languageMapping = {
    'zh': 'zh-tw',
    'zh-tw': 'zh-tw',
    'zh-hk': 'zh-tw',
    'zh-cn': 'zh-tw',
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'ja': 'ja',
    'ja-jp': 'ja'
  };
  
  const languageNames = {
    'zh-tw': '繁體中文',
    'en': 'English',
    'ja': '日本語'
  };
  
  function getBrowserLanguage() {
    const lang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    
    for (const [prefix, mapped] of Object.entries(languageMapping)) {
      if (lang.startsWith(prefix)) {
        return mapped;
      }
    }
    
    return 'en';
  }
  
  function getCurrentLanguage() {
    const path = window.location.pathname;
    
    if (path.startsWith('/en/')) return 'en';
    if (path.startsWith('/ja/')) return 'ja';
    
    return 'zh-tw';
  }
  
  function getTargetURL(targetLang) {
    const path = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    let newPath;
    
    if (path === '/' || path === '') {
      // Home page
      newPath = targetLang === 'zh-tw' ? '/' : `/${targetLang}/`;
    } else {
      // Other pages
      const currentLang = getCurrentLanguage();
      
      if (targetLang === 'zh-tw') {
        // Remove language prefix
        newPath = path.replace(/^\/(en|ja)\//, '/');
      } else {
        if (currentLang === 'zh-tw') {
          // Add language prefix
          newPath = `/${targetLang}${path}`;
        } else {
          // Replace language prefix
          newPath = path.replace(/^\/(en|ja)\//, `/${targetLang}/`);
        }
      }
    }
    
    return newPath + search + hash;
  }
  
  function isDismissed() {
    const dismissedData = localStorage.getItem(STORAGE_KEY);
    if (!dismissedData) return false;
    
    try {
      const data = JSON.parse(dismissedData);
      const now = Date.now();
      
      // Check if dismissal has expired
      if (now - data.timestamp > DISMISS_DURATION) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
      
      // Check if dismissed for this language combination
      const browserLang = getBrowserLanguage();
      const currentLang = getCurrentLanguage();
      return data.dismissedFor === `${browserLang}-${currentLang}`;
    } catch {
      return false;
    }
  }
  
  function dismissPrompt() {
    const browserLang = getBrowserLanguage();
    const currentLang = getCurrentLanguage();
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dismissedFor: `${browserLang}-${currentLang}`,
      timestamp: Date.now()
    }));
  }
  
  function createPrompt(targetLang, targetURL) {
    const browserLang = getBrowserLanguage();
    
    // Create prompt container with very high z-index
    const promptContainer = document.createElement('div');
    promptContainer.id = 'language-prompt';
    promptContainer.className = 'fixed pt-4 bottom-4 right-4 animate-slide-in';
    promptContainer.style.zIndex = '200'; // Use inline style for highest priority
    promptContainer.innerHTML = `
      <div class="language-prompt-box">
        <div class="flex items-start space-x-3">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
            </svg>
          </div>
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              ${getPromptMessage(targetLang, browserLang)}
            </p>
            <div class="flex space-x-2">
              <button onclick="window.location.href='${targetURL}'" class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors shadow-sm">
                ${languageNames[targetLang]}
              </button>
              <button onclick="document.getElementById('language-prompt').remove(); window.languagePromptDismiss();" class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm">
                ${getDismissText(browserLang)}
              </button>
            </div>
          </div>
          <button onclick="document.getElementById('language-prompt').remove(); window.languagePromptDismiss();" class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    // Add CSS for animations and styles
    if (!document.getElementById('language-prompt-styles')) {
      const style = document.createElement('style');
      style.id = 'language-prompt-styles';
      style.textContent = `
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .language-prompt-box {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 0.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 1.25rem;
          max-width: 24rem;
          border: 1px solid rgba(229, 231, 235, 0.8);
        }
        @media (prefers-color-scheme: dark) {
          .language-prompt-box {
            background: rgba(31, 41, 55, 0.95);
            border: 1px solid rgba(55, 65, 81, 0.8);
          }
        }
        .dark .language-prompt-box {
          background: rgba(31, 41, 55, 0.95);
          border: 1px solid rgba(55, 65, 81, 0.8);
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(promptContainer);
  }
  
  function getPromptMessage(targetLang, browserLang) {
    // Display language based on browser language, not current page language
    const displayLang = browserLang || getBrowserLanguage();
    
    const messages = {
      'zh-tw': {
        'en': '切換到英文版？',
        'ja': '切換到日文版？',
        'zh-tw': '切換到繁體中文版？'
      },
      'ja': {
        'en': '英語版に切り替えますか？',
        'ja': '日本語版に切り替えますか？',
        'zh-tw': '繁体字中国語版に切り替えますか？'
      },
      'en': {
        'en': 'Switch to English?',
        'ja': 'Switch to Japanese?',
        'zh-tw': 'Switch to Traditional Chinese?'
      }
    };
    
    // Use browser language for display, fallback to English
    return messages[displayLang]?.[targetLang] || messages['en'][targetLang];
  }
  
  function getDismissText(browserLang) {
    // Display language based on browser language, not current page language
    const displayLang = browserLang || getBrowserLanguage();
    
    const texts = {
      'zh-tw': '不用了',
      'ja': 'いいえ',
      'en': 'No thanks'
    };
    
    return texts[displayLang] || texts['en'];
  }
  
  function removePrompt() {
    const prompt = document.getElementById('language-prompt');
    if (prompt) prompt.remove();
  }
  
  function init() {
    // Check if already dismissed
    if (isDismissed()) {
      return;
    }
    
    const browserLang = getBrowserLanguage();
    const currentLang = getCurrentLanguage();

    // If browser language differs from current page language
    if (browserLang !== currentLang) {
      const targetURL = getTargetURL(browserLang);
      
      // Wait a bit before showing the prompt
      setTimeout(() => {
        createPrompt(browserLang, targetURL);
      }, 500);
    }
  }
  
  // Global function for dismissing
  window.languagePromptDismiss = dismissPrompt;
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();