const gallerySets = {
    sora: {
        title: 'Sora',
        images: ['images/Him/Him.jpg', ...Array.from({ length: 16 }, (_, index) => `images/Him/Him${index + 1}.jpg`)]
    },
    hera: {
        title: 'Hera',
        images: ['images/Her/Her.jpg', ...Array.from({ length: 189 }, (_, index) => `images/Her/Her${index + 1}.jpg`), 'images/Her/baby.jpg']
    },
    both: {
        title: 'Both',
        images: ['images/Us/1.png', 'images/Us/Us.jpg', ...Array.from({ length: 19 }, (_, index) => `images/Us/Us${index + 1}.jpg`)]
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
const photoCount = galleryData.images.length;

galleryData.images.forEach((image, index) => {
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${(index % 6) + 1}`;
    card.innerHTML = `<img src="${image}" alt="${galleryData.title} memory ${index + 1}" loading="lazy"><figcaption>${String(index + 1).padStart(3, '0')} <span>${galleryData.title}</span></figcaption>`;
    grid.append(card);
});

count.textContent = `${photoCount} memories`;