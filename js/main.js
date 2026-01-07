// ========================================
// PHOTO COLLECT - MAIN (CLEAN)
// ========================================

const STATIC_ALBUM_IDS = ['yaeyama', 'alps', 'tuscany', 'kyoto'];

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
    ],
    layoutMode: 'portrait'
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
    ],
    layoutMode: 'portrait'
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
    ],
    layoutMode: 'portrait'
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
    ],
    layoutMode: 'portrait'
  }
};

let currentAlbum = null;
let swiperInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  loadCustomAlbums();
  initSwiperIfAvailable();
  bindInteractions();
  openAlbumFromQueryIfAny();
});

function getCustomAlbums() {
  try {
    return JSON.parse(localStorage.getItem('familyAlbums')) || [];
  } catch {
    return [];
  }
}

function setCustomAlbums(albums) {
  localStorage.setItem('familyAlbums', JSON.stringify(albums));
}

function loadCustomAlbums() {
  const customAlbums = getCustomAlbums();
  if (customAlbums.length === 0) return;

  const wrapper = document.querySelector('.swiper-wrapper');
  if (!wrapper) return;

  customAlbums.forEach(album => {
    // data layer
    albumsData[album.id] = {
      id: album.id,
      title: album.title,
      subtitle: album.subtitle,
      catchphrase: album.catchphrase,
      layoutMode: album.layoutMode || 'portrait',
      photos: (album.photos || []).map((p, idx) => ({
        url: p.dataUrl,
        caption: album.date || `Photo ${idx + 1}`
      }))
    };

    // DOM layer (cover uses first photo)
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="album-cover" data-album-id="${album.id}">
        <div class="album-image">
          <img src="${album.photos?.[0]?.dataUrl || ''}" alt="${album.title}">
          <div class="album-overlay">
            <h2 class="album-title">${album.title}</h2>
            <p class="album-year">${album.season || ''} ${album.year || ''}</p>
          </div>
        </div>
      </div>
    `;
    wrapper.insertBefore(slide, wrapper.firstChild);
  });
}

function initSwiperIfAvailable() {
  if (typeof Swiper === 'undefined') {
    console.warn('[MAIN] Swiper not loaded. Skipping.');
    return;
  }
  swiperInstance = new Swiper('.album-carousel', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    loop: true,
    spaceBetween: 15,
    initialSlide: 1,
    centerInsufficientSlides: true,
    coverflowEffect: { rotate: 8, stretch: 0, depth: 120, modifier: 1.2, slideShadows: true },
    speed: 600,
    autoplay: { delay: 4000, disableOnInteraction: false }
  });
}

function bindInteractions() {
  // click: open
  document.addEventListener('click', (e) => {
    const cover = e.target.closest('.album-cover');
    if (!cover) return;
    const albumId = cover.getAttribute('data-album-id');
    openAlbum(albumId);
  });

  // dblclick (PC): delete custom
  document.addEventListener('dblclick', (e) => {
    const cover = e.target.closest('.album-cover');
    if (!cover) return;

    const albumId = cover.getAttribute('data-album-id');
    if (STATIC_ALBUM_IDS.includes(albumId)) return;

    const title = cover.querySelector('.album-title')?.textContent || 'this album';
    if (confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) {
      deleteAlbum(albumId, cover);
    }
  });

  // long press (mobile mainly): delete custom
  setupLongPressDelete();
}

function setupLongPressDelete() {
  let timer = null;

  const start = (e) => {
    const cover = e.target.closest('.album-cover');
    if (!cover) return;

    const albumId = cover.getAttribute('data-album-id');
    if (STATIC_ALBUM_IDS.includes(albumId)) return;

    timer = setTimeout(() => {
      const title = cover.querySelector('.album-title')?.textContent || 'this album';
      if (confirm(`Delete "${title}"?\n\nThis action cannot be undone.`)) {
        deleteAlbum(albumId, cover);
      }
    }, 1000);
  };

  const cancel = () => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  document.addEventListener('touchstart', start, { passive: true });
  document.addEventListener('touchend', cancel);
  document.addEventListener('touchmove', cancel);

  document.addEventListener('mousedown', start);
  document.addEventListener('mouseup', cancel);
  document.addEventListener('mousemove', cancel);
}

function deleteAlbum(albumId, albumCover) {
  // storage
  const albums = getCustomAlbums().filter(a => a.id !== albumId);
  setCustomAlbums(albums);

  // memory
  delete albumsData[albumId];

  // DOM
  const slide = albumCover.closest('.swiper-slide');
  if (slide) slide.remove();
  if (swiperInstance) swiperInstance.update();
}

function openAlbum(albumId) {
  const album = albumsData[albumId];
  if (!album) return;

  currentAlbum = album;

  const overlay = document.querySelector('.book-opening-overlay');
  overlay?.classList.add('active');

  setTimeout(() => {
    document.getElementById('top-page')?.classList.remove('active');

    applyPhotoAspect(album.layoutMode || 'portrait');
    renderAlbum(album);

    document.getElementById('album-page')?.classList.add('active');
    overlay?.classList.remove('active');

    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(addParallaxEffect, 100);
  }, 1200);
}

function applyPhotoAspect(layoutMode) {
  const aspect = (layoutMode === 'landscape') ? '16 / 9' : '4 / 5';
  document.documentElement.style.setProperty('--photo-aspect', aspect);
  console.log('[MAIN] applied --photo-aspect =', aspect, 'layoutMode =', layoutMode);
}

function renderAlbum(album) {
  document.getElementById('album-title').textContent = album.title;
  document.getElementById('album-subtitle').textContent = album.subtitle;
  document.getElementById('album-catchphrase').textContent = album.catchphrase;

  const gallery = document.getElementById('photo-gallery');
  gallery.innerHTML = '';

  (album.photos || []).forEach((photo, index) => {
    gallery.appendChild(createPhotoBlock(photo, index));
  });
}

function createPhotoBlock(photo, index) {
  const block = document.createElement('div');
  block.className = 'photo-block';
  block.style.animationDelay = `${index * 0.1}s`;

  const wrapper = document.createElement('div');
  wrapper.className = 'photo-wrapper';

  const img = document.createElement('img');
  img.src = photo.url;
  img.alt = photo.caption || '';
  img.loading = 'lazy';
  img.onerror = function () {
    this.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop';
  };

  wrapper.appendChild(img);
  block.appendChild(wrapper);
  return block;
}

function backToGallery() {
  const albumPage = document.getElementById('album-page');
  albumPage.style.opacity = '0';

  setTimeout(() => {
    albumPage.classList.remove('active');
    albumPage.style.opacity = '1';
    document.getElementById('top-page').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    currentAlbum = null;
  }, 400);
}

// HTMLのonclickから呼べるように
window.backToGallery = backToGallery;
window.showCreateForm = () => (window.location.href = 'create.html');

function openAlbumFromQueryIfAny() {
  const albumId = new URLSearchParams(location.search).get('albumId');
  if (!albumId) return;

  if (albumsData[albumId]) {
    openAlbum(albumId);
    history.replaceState(null, '', 'index.html');
  }
}

function addParallaxEffect() {
  const photos = document.querySelectorAll('.photo-wrapper img');
  const onScroll = () => {
    photos.forEach(photo => {
      const rect = photo.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight && rect.bottom > 0) {
        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
        const translateY = (scrollPercent - 0.5) * 30;
        photo.style.transform = `scale(1.1) translateY(${translateY}px)`;
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}
