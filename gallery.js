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
        title: 'Both',
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

galleryData.images.forEach((image, index) => {
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${(index % 6) + 1}`;
    card.innerHTML = `<img src="${image}" alt="${galleryData.title} memory ${index + 1}" loading="lazy"><figcaption>${String(index + 1).padStart(3, '0')} <span>${galleryData.title}</span></figcaption>`;
    grid.append(card);
});

(galleryData.videos || []).forEach((video, index) => {
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${((galleryData.images.length + index) % 6) + 1}`;
    card.innerHTML = `<video controls preload="metadata" aria-label="${galleryData.title} video ${index + 1}"><source src="${video}" type="video/quicktime">Your browser does not support this video.</video><figcaption>${String(galleryData.images.length + index + 1).padStart(3, '0')} <span>${galleryData.title} video</span></figcaption>`;
    grid.append(card);
});

count.textContent = `${photoCount} memories`;