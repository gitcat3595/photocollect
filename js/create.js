// ========================================
// CREATE ALBUM PAGE - SIMPLIFIED & WORKING
// ========================================

// State
let uploadedPhotos = [];
const MAX_PHOTOS = 12;
const MIN_PHOTOS = 1;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (スマホの高解像度対応)

console.log('=== CREATE.JS LOADED ===');

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM LOADED - Initializing...');

  // 1. 要素取得（最初）
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('file-input');
  const browseButton = document.getElementById('browse-button');
  const photoPreviewGrid = document.getElementById('photo-preview-grid');
  const albumForm = document.getElementById('album-form');
  const submitButton = document.getElementById('submit-button');

  // 2. デバッグログ
  console.log('Elements:', {
    uploadArea: !!uploadArea,
    fileInput: !!fileInput,
    browseButton: !!browseButton,
    photoPreviewGrid: !!photoPreviewGrid,
    albumForm: !!albumForm,
    submitButton: !!submitButton
  });

  // 3. 要素チェック（最後、重複削除）
  if (!uploadArea || !fileInput || !browseButton || !submitButton) {
    console.error('❌ Required elements missing!');
    return;
  }

    // ========================================
    // BROWSE BUTTON CLICK
    // ========================================
    browseButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Browse button clicked');
        fileInput.click();
    });

    // ========================================
    // UPLOAD AREA CLICK
    // ========================================
    uploadArea.addEventListener('click', (e) => {
        if (e.target !== browseButton && !browseButton.contains(e.target)) {
            console.log('Upload area clicked');
            fileInput.click();
        }
    });

    // ========================================
    // FILE INPUT CHANGE
    // ========================================
    fileInput.addEventListener('change', (e) => {
        console.log('File input change event fired');
        const files = e.target.files;
        console.log('Files selected:', files.length);

        if (files.length === 0) {
            console.log('No files selected');
            return;
        }

        handleFiles(files);
    });

    // ========================================
    // DRAG & DROP
    // ========================================
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    uploadArea.addEventListener('dragover', () => {
        uploadArea.style.borderColor = '#B8975A';
        uploadArea.style.backgroundColor = 'rgba(184, 151, 90, 0.1)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        uploadArea.style.borderColor = '';
        uploadArea.style.backgroundColor = '';

        const files = e.dataTransfer.files;
        console.log('Files dropped:', files.length);
        handleFiles(files);
    });

    // ========================================
    // HANDLE FILES
    // ========================================
    function handleFiles(files) {
        console.log('=== HANDLING FILES ===');
        console.log('File count:', files.length);

        if (uploadedPhotos.length + files.length > MAX_PHOTOS) {
            alert(`Maximum ${MAX_PHOTOS} photos allowed!\nYou have ${uploadedPhotos.length} photos.\nTrying to add ${files.length} more.`);
            return;
        }

        Array.from(files).forEach((file, index) => {
            console.log(`Processing file ${index + 1}:`, file.name, file.type, file.size);

            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert(`"${file.name}" is not an image file.`);
                return;
            }

            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                alert(`"${file.name}" is too large (max 50MB).\nPlease use a smaller image.`);
                return;
            }

            // Read file
            const reader = new FileReader();

            reader.onload = (e) => {
                console.log(`File loaded: ${file.name}`);

                // Compress image before saving
                compressImage(e.target.result, file.name, (compressed) => {
                    const photoData = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        dataUrl: compressed.dataUrl,
                        ratio: compressed.ratio // 新しく追加
                    };

                    uploadedPhotos.push(photoData);
                    console.log('Total photos:', uploadedPhotos.length);
                    addPhotoPreview(photoData);
                    updateSubmitButton();
                });
            };


            reader.onerror = () => {
                console.error('Failed to read:', file.name);
                alert(`Failed to read: ${file.name}`);
            };

            reader.readAsDataURL(file);
        });

        // Clear input
        fileInput.value = '';
    }

    // ========================================
    // IMAGE COMPRESSION
    // ========================================
    function compressImage(dataUrl, fileName, callback) {
        console.log('Compressing image:', fileName);

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            const originalWidth = img.width;
            const originalHeight = img.height;
            const originalRatio = originalWidth / originalHeight; // 追加

            // localStorageに入るよう大幅に圧縮
            const MAX_WIDTH = 800;
            const MAX_HEIGHT = 800;

            let width = img.width;
            let height = img.height;

            console.log(`Original size: ${width}×${height}`);

            // Calculate new dimensions
            if (width > height) {
                if (width > MAX_WIDTH) {
                    height *= MAX_WIDTH / width;
                    width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                    width *= MAX_HEIGHT / height;
                    height = MAX_HEIGHT;
                }
            }

            console.log(`Resized to: ${Math.round(width)}×${Math.round(height)}`);

            canvas.width = width;
            canvas.height = height;

            // 描画
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // JPEG 70%品質（容量優先）
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);

            const originalSize = dataUrl.length;
            const compressedSize = compressedDataUrl.length;
            const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);

            console.log(`Compressed ${fileName}:`);
            console.log(`  Size reduction: ${reduction}%`);
            console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)}MB`);
            console.log(`  Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);

            // ここだけ変更：dataUrlではなくオブジェクトで返す
            callback({
                dataUrl: compressedDataUrl,
                ratio: originalRatio
            });
        };

        img.onerror = () => {
            console.error('Failed to compress:', fileName);
            // 失敗したときも同じ形で返す
            callback({
                dataUrl,
                ratio: null
            });
        };

        img.src = dataUrl;
    }


    // ========================================
    // ADD PHOTO PREVIEW
    // ========================================
    function addPhotoPreview(photo) {
        console.log('Adding preview for:', photo.name);

        const div = document.createElement('div');
        div.className = 'photo-preview-item';
        div.dataset.photoId = photo.id;

        // First photo is cover by default
        if (uploadedPhotos.length === 1) {
            div.classList.add('cover-photo');
        }

        div.innerHTML = `
            <img src="${photo.dataUrl}" alt="${photo.name}">
            <button type="button" class="photo-remove-button" onclick="removePhoto('${photo.id}')">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        photoPreviewGrid.appendChild(div);
        console.log('Preview added. Grid children:', photoPreviewGrid.children.length);

        // ダブルタップでカバー選択
        setupDoubleTap(div);

        // Visual feedback
        uploadArea.style.borderColor = '#B8975A';
        setTimeout(() => {
            uploadArea.style.borderColor = '';
        }, 1000);
    }

    // ========================================
    // DOUBLE TAP TO SELECT COVER
    // ========================================
    function setupDoubleTap(element) {
        let lastTap = 0;
        let tapTimeout;

        element.addEventListener('click', (e) => {
            // Ignore if clicking remove button
            if (e.target.closest('.photo-remove-button')) {
                return;
            }

            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;

            clearTimeout(tapTimeout);

            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected!
                e.preventDefault();
                toggleCover(element);
                lastTap = 0;
            } else {
                // Single tap
                lastTap = currentTime;

                // Visual feedback for single tap
                element.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 100);

                // Wait to see if there's a second tap
                tapTimeout = setTimeout(() => {
                    lastTap = 0;
                }, 500);
            }
        });
    }

    function toggleCover(element) {
        const photoId = element.dataset.photoId;
        const isCover = element.classList.contains('cover-photo');

        if (isCover) {
            // Remove cover (only if there are other photos)
            if (photoPreviewGrid.children.length > 1) {
                element.classList.remove('cover-photo');
                console.log('Cover removed from:', photoId);

                // Set first photo as cover if no cover exists
                setTimeout(() => {
                    const hasCover = photoPreviewGrid.querySelector('.cover-photo');
                    if (!hasCover && photoPreviewGrid.firstChild) {
                        photoPreviewGrid.firstChild.classList.add('cover-photo');
                        console.log('Auto-set first photo as cover');
                    }
                }, 100);

                // Visual feedback
                element.style.animation = 'pulse 0.3s ease-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 300);
            } else {
                // Can't remove cover if it's the only photo
                console.log('Cannot remove cover - only one photo');
                // Can't remove if only one photo

            }
        } else {
            // Set as cover
            photoPreviewGrid.querySelectorAll('.photo-preview-item').forEach(item => {
                item.classList.remove('cover-photo');
            });
            element.classList.add('cover-photo');
            console.log('Cover set to:', photoId);

            // Visual feedback
            element.style.animation = 'coverSelected 0.5s ease-out';
            setTimeout(() => {
                element.style.animation = '';
            }, 500);

            //Visual feedback only (no message);
        }
    }


    // ========================================
    // REMOVE PHOTO (GLOBAL FUNCTION)
    // ========================================
    window.removePhoto = function (photoId) {
        console.log('Removing photo:', photoId);

        uploadedPhotos = uploadedPhotos.filter(p => p.id != photoId);

        const element = document.querySelector(`[data-photo-id="${photoId}"]`);
        if (element) {
            element.remove();
        }

        // Update cover badge
        const firstItem = photoPreviewGrid.querySelector('.photo-preview-item');
        if (firstItem) {
            photoPreviewGrid.querySelectorAll('.photo-preview-item').forEach(item => {
                item.classList.remove('cover-photo');
            });
            firstItem.classList.add('cover-photo');
        }

        updateSubmitButton();
        console.log('Remaining photos:', uploadedPhotos.length);
    };

    // ========================================
    // UPDATE SUBMIT BUTTON
    // ========================================
    function updateSubmitButton() {
        const title = document.getElementById('album-title').value.trim();
        const catchphrase = document.getElementById('catchphrase').value.trim();
        const country = document.getElementById('country').value.trim();
        const year = document.getElementById('year').value.trim();
        const season = document.getElementById('season').value.trim();

        const allFilled = title && catchphrase && country && year;
        const hasPhotos = uploadedPhotos.length >= MIN_PHOTOS;

        console.log('Validation:', { allFilled, hasPhotos, photoCount: uploadedPhotos.length });

        if (allFilled && hasPhotos) {
            submitButton.disabled = false;
            submitButton.textContent = `Create Album (${uploadedPhotos.length} photo${uploadedPhotos.length !== 1 ? 's' : ''})`;
            submitButton.style.opacity = '1';
        } else {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.6';

            if (!hasPhotos && uploadedPhotos.length === 0) {
                submitButton.textContent = 'Upload at least 1 photo';
            } else if (!allFilled) {
                submitButton.textContent = 'Fill all required fields';
            } else {
                submitButton.textContent = 'Create Album';
            }
        }
    }


    //========================================
    // FORM INPUT LISTENERS
    // ========================================
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateSubmitButton);
    });

    // Initial button state
    updateSubmitButton();

    // ========================================
    // FORM SUBMIT
    // ========================================
    albumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('=== FORM SUBMITTED ===');

        if (uploadedPhotos.length < MIN_PHOTOS) {
            alert('Please upload at least 1 photo');
            return;
        }

        // カバー写真を取得
        const coverElement = photoPreviewGrid.querySelector('.cover-photo');
        const coverPhotoId = coverElement ? coverElement.dataset.photoId : null;

        // カバー写真を最初に並べ替え
        let orderedPhotos = [...uploadedPhotos];
        if (coverPhotoId) {
            const coverIndex = orderedPhotos.findIndex(p => p.id == coverPhotoId);
            if (coverIndex > 0) {
                const coverPhoto = orderedPhotos.splice(coverIndex, 1)[0];
                orderedPhotos.unshift(coverPhoto);
                console.log('Cover photo moved to first position');
            }
        }

        // === レイアウトモードの自動判定 ===
        let landscapeCount = 0;
        let portraitCount = 0;

        orderedPhotos.forEach(p => {
  if (!p.ratio) return;
  if (p.ratio >= 1.0) {           // 1.1 → 1.0（正方形も横長扱い）
    landscapeCount++;
  } else {
    portraitCount++;
  }
});

let layoutMode = 'portrait';
const totalCount = landscapeCount + portraitCount;
if (totalCount > 0) {
  const landscapeRatio = landscapeCount / totalCount;
  if (landscapeRatio >= 0.5) {    // 0.6 → 0.5（半分以上で横長）
    layoutMode = 'landscape';
  }
}

console.log('LAYOUTMODE:', layoutMode, {
  landscapeCount,
  portraitCount,
  ratio: totalCount > 0 ? (landscapeCount/totalCount).toFixed(2) : 0
});



        // Get form data
        const seasonValue = document.getElementById('season')
            ? document.getElementById('season').value.trim()
            : '';

        const albumData = {
            id: `album-${Date.now()}`,
            title: document.getElementById('album-title').value.trim().toUpperCase(),
            catchphrase: document.getElementById('catchphrase').value.trim(),
            country: document.getElementById('country').value.trim(),
            year: document.getElementById('year').value.trim(),
            season: seasonValue,
            photos: orderedPhotos,
            layoutMode: layoutMode,
            createdAt: new Date().toISOString()
        };

        // Add quotes to catchphrase
        if (!albumData.catchphrase.startsWith('"')) {
            albumData.catchphrase = `"${albumData.catchphrase}"`;
        }

        // Create subtitle
        if (albumData.season) {
            albumData.subtitle = `${albumData.season} in ${albumData.country} · ${albumData.year}`;
        } else {
            albumData.subtitle = `${albumData.country} · ${albumData.year}`;
        }

        // Show loading
        submitButton.disabled = true;
        submitButton.textContent = 'Creating...';
        submitButton.classList.add('loading');

        // Save to localStorage
        try {
            console.log('=== SAVING TO LOCALSTORAGE ===');

            let albums = JSON.parse(localStorage.getItem('familyAlbums')) || [];
            console.log('Existing albums:', albums.length);

            albums.push(albumData);

            const dataString = JSON.stringify(albums);
            const dataSize = (dataString.length / 1024).toFixed(2);
            console.log(`Data size: ${dataSize}KB`);

            localStorage.setItem('familyAlbums', dataString);
            console.log('✓ Saved successfully!');

            // Verify save
            const saved = localStorage.getItem('familyAlbums');
            if (!saved) {
                throw new Error('Failed to save - localStorage returned null');
            }

            const verifyAlbums = JSON.parse(saved);
            console.log('Verified albums:', verifyAlbums.length);
            console.log('Latest album:', verifyAlbums[verifyAlbums.length - 1].title);

            // Success
            submitButton.classList.remove('loading');
            submitButton.textContent = '✓ Ready to browse';
            submitButton.style.backgroundColor = '#B8975A';

            console.log('Waiting 1.5s before redirect...');

            setTimeout(() => {
                console.log('Redirecting to album');
                window.location.href = `index.html?albumId=${albumData.id}`;
            }, 1500);

        } catch (error) {
            console.error('=== SAVE ERROR ===');
            console.error('Error type:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);

            let errorMsg = 'Failed to save album.\n\n';

            if (error.message.includes('quota') || error.message.includes('too large')) {
                errorMsg += 'The album is too large for localStorage.\n';
                errorMsg += 'Try uploading fewer or smaller photos.\n';
                errorMsg += `Current size: ${(JSON.stringify(albumData).length / 1024).toFixed(0)}KB`;
            } else {
                errorMsg += 'Error: ' + error.message;
            }

            alert(errorMsg);

            submitButton.disabled = false;
            submitButton.textContent = 'Create Album';
            submitButton.classList.remove('loading');
            submitButton.style.backgroundColor = '';
        }
    });


    console.log('=== INITIALIZATION COMPLETE ===');
});
