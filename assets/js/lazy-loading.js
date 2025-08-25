// Lazy loading for images with WebP support
document.addEventListener('DOMContentLoaded', function() {
    // Check WebP support
    function checkWebPSupport(callback) {
        const webP = new Image();
        webP.onload = webP.onerror = function() {
            callback(webP.height === 2);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    // Lazy load background images
    function lazyLoadBackgrounds() {
        const lazyBackgrounds = document.querySelectorAll('.lazy-bg');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        
                        checkWebPSupport(function(supportsWebP) {
                            const imageUrl = supportsWebP 
                                ? element.dataset.bgWebp 
                                : element.dataset.bgFallback;
                            
                            if (imageUrl) {
                                element.style.backgroundImage = `url(${imageUrl})`;
                                element.classList.remove('lazy-bg');
                                element.classList.add('loaded');
                            }
                        });
                        
                        imageObserver.unobserve(element);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyBackgrounds.forEach(function(lazyBackground) {
                imageObserver.observe(lazyBackground);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyBackgrounds.forEach(function(element) {
                checkWebPSupport(function(supportsWebP) {
                    const imageUrl = supportsWebP 
                        ? element.dataset.bgWebp 
                        : element.dataset.bgFallback;
                    
                    if (imageUrl) {
                        element.style.backgroundImage = `url(${imageUrl})`;
                        element.classList.remove('lazy-bg');
                        element.classList.add('loaded');
                    }
                });
            });
        }
    }

    // Lazy load regular images
    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries, observer) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(function(lazyImage) {
                imageObserver.observe(lazyImage);
            });
        }
    }

    // Initialize lazy loading
    lazyLoadBackgrounds();
    lazyLoadImages();
    
    // Re-run on dynamic content load
    document.addEventListener('DOMContentLoaded', function() {
        lazyLoadBackgrounds();
        lazyLoadImages();
    });
});