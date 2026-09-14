(function () {
const gallerySets = {
    sora: {
        title: 'Sora',
        images: ['images/Him/Him.jpg', ...Array.from({ length: 19 }, (_, index) => {
            const number = index + 1;
            const extension = number === 19 ? 'JPG' : 'jpg';
            return `images/Him/Him${number}.${extension}`;
        })]
    },
    hera: {
        title: 'Hera',
        images: ['images/Her/Her.jpg', ...Array.from({ length: 196 }, (_, index) => {
            const number = index + 1;
            const extension = number >= 190 ? 'JPG' : 'jpg';
            return `images/Her/Her${number}.${extension}`;
        }), 'images/Her/baby.jpg']
    },
    both: {
        title: 'Us',
        images: ['images/Us/1.png', 'images/Us/Us.jpg', ...Array.from({ length: 145 }, (_, index) => {
            const number = index + 1;
            const extension = number === 111 ? 'png' : 'jpg';
            return `images/Us/Us${number}.${extension}`;
        }).filter((image) => !image.includes('Us93.') && !image.includes('Us98.'))],
        videos: ['images/Us/UsVid1.mov']
    },
    children: {
        title: 'Children',
        images: ['images/Children/Child.jpg', ...Array.from({ length: 6 }, (_, index) => `images/Children/Child${index + 1}.jpg`)]
    }
};

const gallery = document.querySelector('[data-gallery]');
const grid = document.querySelector('[data-photo-grid]');
const count = document.querySelector('[data-gallery-count]');
const galleryData = gallerySets[gallery.dataset.gallery];
const photoCount = galleryData.images.length + (galleryData.videos || []).length;

const lightbox = document.createElement('div');
lightbox.className = 'gallery-lightbox';
lightbox.setAttribute('aria-hidden', 'true');
lightbox.innerHTML = `
    <button class="gallery-lightbox-close" type="button" aria-label="Close photo viewer">&times;</button>
    <img class="gallery-lightbox-image" alt="">
`;
document.body.append(lightbox);

const lightboxImage = lightbox.querySelector('.gallery-lightbox-image');
const lightboxClose = lightbox.querySelector('.gallery-lightbox-close');
let lastFocusedPhoto;

function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastFocusedPhoto?.focus();
}

function openLightbox(photo) {
    lastFocusedPhoto = photo;
    lightboxImage.src = photo.currentSrc || photo.src;
    lightboxImage.alt = photo.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    lightboxClose.focus();
}

galleryData.images.forEach((image, index) => {
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${(index % 6) + 1}`;
    card.innerHTML = `<img src="${image}" alt="${galleryData.title} memory ${index + 1}" loading="lazy" tabindex="0"><figcaption>${String(index + 1).padStart(3, '0')} <span>${galleryData.title}</span></figcaption>`;
    grid.append(card);
});

(galleryData.videos || []).forEach((video, index) => {
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${((galleryData.images.length + index) % 6) + 1}`;
    card.innerHTML = `<video controls preload="metadata" aria-label="Video of ${galleryData.title} ${index + 1}"><source src="${video}" type="video/quicktime">Your browser does not support this video.</video><figcaption>${String(galleryData.images.length + index + 1).padStart(3, '0')} <span>Video of ${galleryData.title}</span></figcaption>`;
    grid.append(card);
});

count.textContent = `${photoCount} memories`;

grid.addEventListener('click', (event) => {
    const photo = event.target.closest('img');
    if (photo) {
        openLightbox(photo);
    }
});

grid.addEventListener('keydown', (event) => {
    const photo = event.target.closest('img');
    if (photo && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        openLightbox(photo);
    }
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) {
        closeLightbox();
    }
});
}());