const gallerySets = {
    sora: {
        title: 'Sora',
        images: ['images/me.jpg', 'images/1.png', 'images/4.png', 'images/6.png', 'images/menbaby.JPG']
    },
    hera: {
        title: 'Hera',
        images: ['images/baby.jpg', 'images/2.png', 'images/5.png', 'images/7.png', 'images/8.png']
    },
    both: {
        title: 'Both',
        images: ['images/menbaby2.png', 'images/menbaby.JPG', 'images/3.png', 'images/6.png', 'images/8.png']
    }
};

const gallery = document.querySelector('[data-gallery]');
const grid = document.querySelector('[data-photo-grid]');
const count = document.querySelector('[data-gallery-count]');
const galleryData = gallerySets[gallery.dataset.gallery];
const photoCount = 100;

for (let index = 0; index < photoCount; index += 1) {
    const image = galleryData.images[index % galleryData.images.length];
    const card = document.createElement('figure');
    card.className = `photo-card photo-card-${(index % 6) + 1}`;
    card.innerHTML = `<img src="${image}" alt="${galleryData.title} memory ${index + 1}" loading="lazy"><figcaption>${String(index + 1).padStart(3, '0')} <span>${galleryData.title}</span></figcaption>`;
    grid.append(card);
}

count.textContent = `${photoCount} memories · updated as new photos are added`;