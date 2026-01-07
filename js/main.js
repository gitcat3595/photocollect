// ========================================
// FAMILY ALBUMS - MAIN JAVASCRIPT
// Old Money Luxury × New Japan × Kinfolk
// ========================================

// Album Data
const albumsData = {
    yaeyama: {
        id: 'yaeyama',
        title: 'YAEYAMA ISLANDS',
        subtitle: 'Summer in Okinawa · 2025',
        catchphrase: '"Where turquoise waters meet ancient traditions"',
        photos: [
            { url: 'images/yaeyama-1.jpg', caption: 'June 15, 2025' },
            { url: 'images/yaeyama-2.jpg', caption: 'June 16, 2025' },
            { url: 'images/yaeyama-3.jpg', caption: 'June 17, 2025' },
            { url: 'images/yaeyama-4.jpg', caption: 'June 18, 2025' },
            { url: 'images/yaeyama-5.jpg', caption: 'June 19, 2025' },
            { url: 'images/yaeyama-6.jpg', caption: 'June 20, 2025' }
        ]
    },
    alps: {
        id: 'alps',
        title: 'ALPS WINTER RETREAT',
        subtitle: 'Switzerland · December 2024',
        catchphrase: '"Serenity in the snow"',
        photos: [
            { url: 'images/alps-1.jpg', caption: 'December 20, 2024' },
            { url: 'images/alps-2.jpg', caption: 'December 21, 2024' },
            { url: 'images/alps-3.jpg', caption: 'December 22, 2024' },
            { url: 'images/alps-4.jpg', caption: 'December 23, 2024' },
            { url: 'images/alps-5.jpg', caption: 'December 24, 2024' },
            { url: 'images/alps-6.jpg', caption: 'December 25, 2024' }
        ]
    },
    tuscany: {
        id: 'tuscany',
        title: 'TUSCAN HARVEST',
        subtitle: 'Italy · Autumn 2024',
        catchphrase: '"Golden hills and timeless beauty"',
        photos: [
            { url: 'images/tuscany-1.jpg', caption: 'October 5, 2024' },
            { url: 'images/tuscany-2.jpg', caption: 'October 6, 2024' },
            { url: 'images/tuscany-3.jpg', caption: 'October 7, 2024' },
            { url: 'images/tuscany-4.jpg', caption: 'October 8, 2024' },
            { url: 'images/tuscany-5.jpg', caption: 'October 9, 2024' },
            { url: 'images/tuscany-6.jpg', caption: 'October 10, 2024' }
        ]
    },
    kyoto: {
        id: 'kyoto',
        title: 'KYOTO SPRING',
        subtitle: 'Cherry Blossoms · April 2024',
        catchphrase: '"When sakura petals dance in the wind"',
        photos: [
            { url: 'images/kyoto-1.jpg', caption: 'April 1, 2024' },
            { url: 'images/kyoto-2.jpg', caption: 'April 2, 2024' },
            { url: 'images/kyoto-3.jpg', caption: 'April 3, 2024' },
            { url: 'images/kyoto-4.jpg', caption: 'April 4, 2024' },
            { url: 'images/kyoto-5.jpg', caption: 'April 5, 2024' },
            { url: 'images/kyoto-6.jpg', caption: 'April 6, 2024' }
        ]
    }
};

// Current State
let currentAlbum = null;
let swiperInstance = null;

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('=== MAIN.JS INITIALIZING ===');
  
  loadCustomAlbums();
  initializeCarousel();
  
  // 新しい統合イベントリスナーは global に登録済み
  console.log('✅ Initialization complete');
});

// ========================================
// LOAD CUSTOM ALBUMS FROM LOCALSTORAGE
// ========================================

function loadCustomAlbums() {
    const customAlbums = JSON.parse(localStorage.getItem('familyAlbums')) || [];
    console.log('[MAIN] Loading custom albums:', customAlbums.length);

    if (customAlbums.length === 0) {
        console.log('[MAIN] No custom albums found');
        return;
    }

    const swiperWrapper = document.querySelector('.swiper-wrapper');
    if (!swiperWrapper) {
        console.error('[MAIN] Swiper wrapper not found');
        return;
    }

    // Add custom albums to albumsData and DOM
    customAlbums.forEach(album => {
        // Add to albumsData
        albumsData[album.id] = {
            id: album.id,
            title: album.title,
            subtitle: album.subtitle,
            catchphrase: album.catchphrase,
            photos: album.photos.map((photo, index) => ({
                url: photo.dataUrl,
                caption: album.date || `Photo ${index + 1}`
            }))
        };

        // Create slide HTML
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="album-cover" data-album-id="${album.id}">
                <div class="album-image">
                    <img src="${album.photos[0].dataUrl}" alt="${album.title}">
                    <div class="album-overlay">
                        <h2 class="album-title">${album.title}</h2>
                        <p class="album-year">${album.season} ${album.year}</p>
                    </div>
                </div>
            </div>
        `;

        // Insert before the first existing slide (so custom albums appear first)
        swiperWrapper.insertBefore(slide, swiperWrapper.firstChild);

        console.log('[MAIN] Added album:', album.title);
    });
}

/// ========================================
// CAROUSEL INITIALIZATION
// ========================================

function initializeCarousel() {
    swiperInstance = new Swiper('.album-carousel', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        loop: true,
        spaceBetween: 15,
        initialSlide: 1,
        centerInsufficientSlides: true,

        coverflowEffect: {
            rotate: 8,
            stretch: 0,
            depth: 120,
            modifier: 1.2,
            slideShadows: true,        // 影を有効化
        },
        speed: 600,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            // スマホ（左右が見える）
            320: {
                slidesPerView: 1.3,        // 1.2 → 1.3
                spaceBetween: 15,
                coverflowEffect: {
                    rotate: 12,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                }
            },
            // 少し大きいスマホ
            480: {
                slidesPerView: 1.5,
                spaceBetween: 20,
                coverflowEffect: {
                    rotate: 10,
                    depth: 110,
                    modifier: 1.1,
                    slideShadows: true,
                }
            },
            // タブレット
            768: {
                slidesPerView: 1.8,
                spaceBetween: 25,
                coverflowEffect: {
                    rotate: 10,
                    depth: 110,
                    modifier: 1.1,
                    slideShadows: true,
                }
            },
            // PC
            1024: {
                slidesPerView: 2.2,
                spaceBetween: 30,
                coverflowEffect: {
                    rotate: 8,
                    depth: 120,
                    modifier: 1.2,
                    slideShadows: true,
                }
            },
            // 大画面
            1400: {
                slidesPerView: 2.5,
                spaceBetween: 40,
                coverflowEffect: {
                    rotate: 6,
                    depth: 130,
                    modifier: 1.3,
                    slideShadows: true,
                }
            }
        }
    });

}

// ========================================
// ALBUM INTERACTIONS (Click + Delete)
// ========================================

let longPressTimer = null;
let longPressTarget = null;
const STATIC_ALBUMS = ['yaeyama', 'alps', 'tuscany', 'kyoto'];

// シングルイベントリスナーで全て処理
document.addEventListener('click', (e) => {
  const albumCover = e.target.closest('.album-cover');
  if (!albumCover) return;

  const albumId = albumCover.getAttribute('data-album-id');
  console.log('[MAIN] Album clicked:', albumId);

  // クリックで開く（シングルクリック）
  openAlbum(albumId);
});

document.addEventListener('dblclick', (e) => {
  const albumCover = e.target.closest('.album-cover');
  if (!albumCover) return;

  const albumId = albumCover.getAttribute('data-album-id');
  
  // 静的アルバムは削除不可
  if (STATIC_ALBUMS.includes(albumId)) return;
  
  const albumTitle = albumCover.querySelector('.album-title')?.textContent || 'this album';
  
  if (confirm(`Delete "${albumTitle}"?\n\nThis action cannot be undone.`)) {
    deleteAlbum(albumId, albumCover);
  }
});

// ロングプレス削除（PC + Mobile 共通）
['mousedown', 'touchstart'].forEach(eventType => {
  document.addEventListener(eventType, (e) => {
    const albumCover = e.target.closest('.album-cover');
    if (!albumCover) return;

    const albumId = albumCover.getAttribute('data-album-id');
    if (STATIC_ALBUMS.includes(albumId)) return;

    longPressTarget = albumCover;
    longPressTimer = setTimeout(() => {
      const albumTitle = albumCover.querySelector('.album-title')?.textContent || 'this album';
      if (confirm(`Delete "${albumTitle}"?\n\nThis action cannot be undone.`)) {
        deleteAlbum(albumId, albumCover);
      }
    }, 1000);
  });
});

// ロングプレスキャンセル（PC + Mobile）
['mouseup', 'touchend', 'mousemove', 'touchmove'].forEach(eventType => {
  document.addEventListener(eventType, () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
      longPressTarget = null;
    }
  });
});

function deleteAlbum(albumId, albumCover) {
  console.log('[MAIN] Deleting album:', albumId);

  // localStorage から削除
  const customAlbums = JSON.parse(localStorage.getItem('familyAlbums')) || [];
  const filteredAlbums = customAlbums.filter(album => album.id !== albumId);
  localStorage.setItem('familyAlbums', JSON.stringify(filteredAlbums));

  // DOM からスライド削除
  const slide = albumCover.closest('.swiper-slide');
  if (slide) {
    slide.remove();
    if (swiperInstance) {
      swiperInstance.update();
    }
  }

  // albumsData から削除
  delete albumsData[albumId];

  console.log('[MAIN] Album deleted successfully');
}

// ========================================
// OPEN ALBUM WITH BOOK ANIMATION
// ========================================

function openAlbum(albumId) {
    if (!albumsData[albumId]) return;

    currentAlbum = albumsData[albumId];

    // Show book opening animation
    const overlay = document.querySelector('.book-opening-overlay');
    overlay.classList.add('active');

    // Wait for animation to complete
    setTimeout(() => {
        // Hide top page
        document.getElementById('top-page').classList.remove('active');

        // Update album content
        updateAlbumContent(currentAlbum);

        // Show album page
        document.getElementById('album-page').classList.add('active');

        // Remove overlay
        overlay.classList.remove('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Add parallax effect to photos
        setTimeout(() => {
            addParallaxEffect();
        }, 100);

    }, 1200);
}

// ========================================
// UPDATE ALBUM CONTENT
// ========================================

function updateAlbumContent(album) {
    // Update header
    document.getElementById('album-title').textContent = album.title;
    document.getElementById('album-subtitle').textContent = album.subtitle;
    document.getElementById('album-catchphrase').textContent = album.catchphrase;

    function updateAlbumContent(album) {
        // Update header
        document.getElementById('album-title').textContent = album.title;
        document.getElementById('album-subtitle').textContent = album.subtitle;
        document.getElementById('album-catchphrase').textContent = album.catchphrase;

        // === レイアウトモードを適用 ===
        const albumContent = document.querySelector('.album-content');
        albumContent.classList.remove('layout-portrait', 'layout-landscape');

        if (album.layoutMode === 'landscape') {
            albumContent.classList.add('layout-landscape');
            console.log('Applied landscape layout');
        } else {
            albumContent.classList.add('layout-portrait');
            console.log('Applied portrait layout');
        }

        // Update photo gallery
        const gallery = document.getElementById('photo-gallery');
        gallery.innerHTML = '';
        album.photos.forEach((photo, index) => {
            const photoBlock = createPhotoBlock(photo, index);
            gallery.appendChild(photoBlock);
        });
    }

    // Update photo gallery
    const gallery = document.getElementById('photo-gallery');
    gallery.innerHTML = '';

    album.photos.forEach((photo, index) => {
        const photoBlock = createPhotoBlock(photo, index);
        gallery.appendChild(photoBlock);
    });
}

// ========================================
// CREATE PHOTO BLOCK
// ========================================

function createPhotoBlock(photo, index) {
    const block = document.createElement('div');
    block.className = 'photo-block';
    block.style.animationDelay = `${index * 0.1}s`;

    const wrapper = document.createElement('div');
    wrapper.className = 'photo-wrapper';

    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.caption;
    img.loading = 'lazy';

    // Add error handling for missing images
    img.onerror = function () {
        this.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop';
    };

    const caption = document.createElement('p');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption;

    wrapper.appendChild(img);
    block.appendChild(wrapper);
    // block.appendChild(caption); //今はキャプション非表示

    return block;
}

// ========================================
// BACK TO GALLERY
// ========================================

function backToGallery() {
    // Fade out album page
    const albumPage = document.getElementById('album-page');
    albumPage.style.opacity = '0';

    setTimeout(() => {
        albumPage.classList.remove('active');
        albumPage.style.opacity = '1';

        // Show top page
        document.getElementById('top-page').classList.add('active');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset current album
        currentAlbum = null;

    }, 400);
}

// ========================================
// PARALLAX EFFECT FOR PHOTOS
// ========================================

function addParallaxEffect() {
    const photos = document.querySelectorAll('.photo-wrapper img');

    window.addEventListener('scroll', () => {
        photos.forEach(photo => {
            const rect = photo.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if photo is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                const translateY = (scrollPercent - 0.5) * 30;

                photo.style.transform = `scale(1.1) translateY(${translateY}px)`;
            }
        });
    });
}

// ========================================
// CREATE ALBUM FORM
// ========================================

function showCreateForm() {
    window.location.href = 'create.html';
}

// ========================================
// SMOOTH SCROLL TO TOP
// ========================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', (e) => {
    // ESC key - back to gallery
    if (e.key === 'Escape' && currentAlbum) {
        backToGallery();
    }

    // Left/Right arrows - navigate carousel (when on top page)
    if (!currentAlbum && swiperInstance) {
        if (e.key === 'ArrowLeft') {
            swiperInstance.slidePrev();
        } else if (e.key === 'ArrowRight') {
            swiperInstance.slideNext();
        }
    }
});

// ========================================
// MOBILE TOUCH GESTURES
// ========================================

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
}, false);

function handleSwipeGesture() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    // Only handle swipes when viewing album
    if (currentAlbum && Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left (could implement next album)
            console.log('Swiped left');
        } else {
            // Swipe right (could implement previous album)
            console.log('Swiped right');
        }
    }
}

// ========================================
// LAZY LOADING IMAGES
// ========================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    // Observe all lazy images
    document.addEventListener('DOMContentLoaded', () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    });
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle parallax effect
const throttledParallax = debounce(() => {
    // Parallax logic here
}, 16);

// ========================================
// CONSOLE GREETING
// ========================================

console.log('%c Family Albums ', 'background: #2C2416; color: #B8975A; font-size: 24px; font-weight: bold; padding: 10px;');
console.log('%c Timeless Memories, Elegantly Preserved ', 'background: #F5F1E8; color: #1A1511; font-size: 14px; padding: 5px;');
console.log('%c Built with ❤️ for luxury and simplicity ', 'color: #6B5D52; font-size: 12px; font-style: italic;');


// PC Double-click Delete
document.addEventListener('dblclick',(e)=>{const t=e.target.closest('.album-cover');if(t){const a=t.getAttribute('data-album-id');if(!['yaeyama','alps','tuscany','kyoto'].includes(a)&&confirm('Delete album?')){const l=JSON.parse(localStorage.getItem('familyAlbums')||'[]').filter(b=>b.id!==a);localStorage.setItem('familyAlbums',JSON.stringify(l));delete albumsData[a];const s=t.closest('.swiper-slide');s&&s.remove();swiperInstance&&swiperInstance.update()}}});
