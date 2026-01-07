// ========================================
// PHOTO COLLECT - CREATE (FIXED)
// ========================================

let uploadedPhotos = [];

const MAX_PHOTOS = 12;
const MIN_PHOTOS = 1;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_SIDE = 800;
const JPEG_QUALITY = 0.7;

document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseButton = document.getElementById('browse-button');
  const photoPreviewGrid = document.getElementById('photo-preview-grid');
  const albumForm = document.getElementById('album-form');
  const submitButton = document.getElementById('submit-button');

  if (!uploadArea || !fileInput || !browseButton || !photoPreviewGrid || !albumForm || !submitButton) {
    console.error('[CREATE] Required elements missing.');
    return;
  }

  // DEBUG (optional)
  window.__getUploadedPhotos = () => uploadedPhotos;

  // ------- UI events -------
  browseButton.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInput.click();
  });

  uploadArea.addEventListener('click', (e) => {
    if (e.target !== browseButton && !browseButton.contains(e.target)) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
    fileInput.value = '';
  });

  // drag & drop
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
    uploadArea.addEventListener(evt, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  uploadArea.addEventListener('dragover', () => uploadArea.classList.add('dragover'));
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('dragover'));

  uploadArea.addEventListener('drop', (e) => {
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    handleFiles(files);
  });

  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateSubmitButton);
  });

  updateSubmitButton();

  // ------- handlers -------
  async function handleFiles(fileList) {
    if (uploadedPhotos.length + fileList.length > MAX_PHOTOS) {
      alert(`Maximum ${MAX_PHOTOS} photos allowed.`);
      return;
    }

    for (const file of Array.from(fileList)) {
      if (!file.type.startsWith('image/')) {
        alert(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(`"${file.name}" is too large (max 50MB).`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataURL(file);
        const compressed = await compressToJpeg(dataUrl);

        // 1px判定は「元画像寸法」でやる
        const w = compressed.originalWidth;
        const h = compressed.originalHeight;

        uploadedPhotos.push({
          id: `${Date.now()}-${Math.random()}`,
          name: file.name,
          dataUrl: compressed.dataUrl,
          width: w,
          height: h,
          orientation: classifyOrientation(w, h) // square/portrait/landscape
        });

        addPhotoPreview(uploadedPhotos[uploadedPhotos.length - 1]);
        updateSubmitButton();
      } catch (err) {
        console.error('[CREATE] Failed to read/compress:', file.name, err);
        alert(`Failed to process: ${file.name}`);
      }
    }
  }

  function addPhotoPreview(photo) {
    const div = document.createElement('div');
    div.className = 'photo-preview-item';
    div.dataset.photoId = photo.id;

    if (uploadedPhotos.length === 1) div.classList.add('cover-photo');

    div.innerHTML = `
      <img src="${photo.dataUrl}" alt="${photo.name}">
      <button type="button" class="photo-remove-button" aria-label="Remove photo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;

    div.querySelector('.photo-remove-button').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      removePhoto(photo.id);
    });

    setupCoverSelect(div);
    photoPreviewGrid.appendChild(div);
  }

  function setupCoverSelect(element) {
    let lastTap = 0;
    let tapTimeout;

    element.addEventListener('click', (e) => {
      if (e.target.closest('.photo-remove-button')) return;

      const now = Date.now();
      const delta = now - lastTap;
      clearTimeout(tapTimeout);

      if (delta > 0 && delta < 450) {
        e.preventDefault();
        setCover(element.dataset.photoId);
        lastTap = 0;
      } else {
        lastTap = now;
        tapTimeout = setTimeout(() => (lastTap = 0), 450);
      }
    });
  }

  function setCover(photoId) {
    photoPreviewGrid.querySelectorAll('.photo-preview-item').forEach(el => el.classList.remove('cover-photo'));
    const el = photoPreviewGrid.querySelector(`[data-photo-id="${photoId}"]`);
    if (el) el.classList.add('cover-photo');
  }

  function removePhoto(photoId) {
    uploadedPhotos = uploadedPhotos.filter(p => p.id !== photoId);
    const el = photoPreviewGrid.querySelector(`[data-photo-id="${photoId}"]`);
    if (el) el.remove();

    // ensure cover exists
    if (!photoPreviewGrid.querySelector('.cover-photo')) {
      const first = photoPreviewGrid.querySelector('.photo-preview-item');
      if (first) first.classList.add('cover-photo');
    }

    updateSubmitButton();
  }

  function updateSubmitButton() {
    const title = document.getElementById('album-title')?.value.trim();
    const catchphrase = document.getElementById('catchphrase')?.value.trim();
    const country = document.getElementById('country')?.value.trim();
    const year = document.getElementById('year')?.value.trim();

    const allFilled = title && catchphrase && country && year;
    const hasPhotos = uploadedPhotos.length >= MIN_PHOTOS;

    submitButton.disabled = !(allFilled && hasPhotos);
    submitButton.style.opacity = submitButton.disabled ? '0.6' : '1';

    if (!hasPhotos) submitButton.textContent = 'Upload at least 1 photo';
    else if (!allFilled) submitButton.textContent = 'Fill all required fields';
    else submitButton.textContent = `Create Album (${uploadedPhotos.length})`;
  }

  // ------- submit -------
  albumForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (uploadedPhotos.length < MIN_PHOTOS) {
      alert('Please upload at least 1 photo');
      return;
    }

    // cover first
    const coverEl = photoPreviewGrid.querySelector('.cover-photo');
    const coverId = coverEl?.dataset.photoId || null;

    const orderedPhotos = [...uploadedPhotos];
    if (coverId) {
      const idx = orderedPhotos.findIndex(p => p.id === coverId);
      if (idx > 0) {
        const cover = orderedPhotos.splice(idx, 1)[0];
        orderedPhotos.unshift(cover);
      }
    }

    // counts + layoutMode (squareはノーカウント)
    const counts = countOrientations(orderedPhotos);
    const layoutMode = (counts.landscape > counts.portrait) ? 'landscape' : 'portrait';

    const season = document.getElementById('season')?.value.trim() || '';
    const title = document.getElementById('album-title').value.trim().toUpperCase();
    let catchphrase = document.getElementById('catchphrase').value.trim();
    const country = document.getElementById('country').value.trim();
    const year = document.getElementById('year').value.trim();

    if (!catchphrase.startsWith('"')) catchphrase = `"${catchphrase}"`;

    const subtitle = season
      ? `${season} in ${country} · ${year}`
      : `${country} · ${year}`;

    console.log('[CREATE] LAYOUTMODE:', layoutMode, counts);

    const albumData = {
      id: `album-${Date.now()}`,
      title,
      catchphrase,
      country,
      year,
      season,
      subtitle,
      layoutMode,
      orientationCounts: counts,
      photos: orderedPhotos.map(p => ({
        id: p.id,
        name: p.name,
        dataUrl: p.dataUrl,
        width: p.width,
        height: p.height,
        orientation: p.orientation
      })),
      createdAt: new Date().toISOString()
    };

    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Creating...';
      submitButton.classList.add('loading');

      const albums = getCustomAlbums();
      albums.push(albumData);
      setCustomAlbums(albums);

      setTimeout(() => {
        window.location.href = `index.html?albumId=${albumData.id}`;
      }, 600);
    } catch (err) {
      console.error('[CREATE] save error:', err);
      alert('Failed to save album (localStorage quota?). Try fewer photos.');
      submitButton.disabled = false;
      submitButton.textContent = 'Create Album';
      submitButton.classList.remove('loading');
    }
  });

  function getCustomAlbums() {
    try { return JSON.parse(localStorage.getItem('familyAlbums')) || []; }
    catch { return []; }
  }

  function setCustomAlbums(albums) {
    localStorage.setItem('familyAlbums', JSON.stringify(albums));
  }
});

// -------- utilities --------
function classifyOrientation(w, h) {
  if (w > h) return 'landscape';
  if (h > w) return 'portrait';
  return 'square';
}

function countOrientations(photos) {
  const counts = { landscape: 0, portrait: 0, square: 0 };
  photos.forEach(p => {
    if (p.orientation === 'landscape') counts.landscape++;
    else if (p.orientation === 'portrait') counts.portrait++;
    else if (p.orientation === 'square') counts.square++;
  });
  return counts;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function compressToJpeg(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let width = originalWidth;
      let height = originalHeight;

      if (width > height) {
        if (width > MAX_SIDE) {
          height = Math.round(height * (MAX_SIDE / width));
          width = MAX_SIDE;
        }
      } else {
        if (height > MAX_SIDE) {
          width = Math.round(width * (MAX_SIDE / height));
          height = MAX_SIDE;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const out = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

      resolve({
        dataUrl: out,
        originalWidth,
        originalHeight
      });
    };

    img.onerror = reject;
    img.src = dataUrl;
  });
}
