// Photo Gallery Manager
class PhotoGalleryManager {
    constructor() {
        this.photosData = {};
        this.currentPhotoIndex = 0;
        this.currentPhotos = [];
        this.modal = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.init();
    }

    async init() {
        await this.loadPhotosData();
        this.createModal();
        this.bindEvents();
        this.populateGalleries();
    }

    async loadPhotosData() {
        try {
            const response = await fetch('photos-data.yaml');
            const yamlText = await response.text();
            this.photosData = this.parseYAML(yamlText);
        } catch (error) {
            console.error('Error loading photos data:', error);
        }
    }

    // Simple YAML parser for our specific structure
    parseYAML(yamlText) {
        const lines = yamlText.split('\n');
        const result = {};
        let currentSection = null;
        let currentSubsection = null;
        let indent = 0;

        for (let line of lines) {
            if (!line.trim()) continue;
            
            const lineIndent = line.length - line.trimStart().length;
            const content = line.trim();
            
            if (lineIndent === 0 && content.endsWith(':')) {
                // Main section
                currentSection = content.slice(0, -1);
                result[currentSection] = {};
                currentSubsection = null;
            } else if (lineIndent === 2 && content.endsWith(':')) {
                // Subsection
                currentSubsection = content.slice(0, -1);
                result[currentSection][currentSubsection] = [];
            } else if (content.startsWith('- src:')) {
                // Photo item
                const src = content.match(/src: "([^"]+)"/)?.[1];
                const alt = lines[lines.indexOf(line) + 1]?.trim().match(/alt: "([^"]+)"/)?.[1];
                
                if (src && alt) {
                    const photoData = { src, alt };
                    
                    if (currentSubsection) {
                        result[currentSection][currentSubsection].push(photoData);
                    } else {
                        if (!Array.isArray(result[currentSection])) {
                            result[currentSection] = [];
                        }
                        result[currentSection].push(photoData);
                    }
                }
            }
        }
        
        return result;
    }

    createModal() {
        const modalHTML = `
            <div id="photo-gallery-modal" class="photo-gallery-modal">
                <div class="modal-overlay" onclick="photoGalleryManager.closeModal()"></div>
                <div class="modal-content">
                    <button class="modal-close" onclick="photoGalleryManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                    
                    <button class="modal-nav modal-prev" onclick="photoGalleryManager.previousPhoto()">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    
                    <div class="modal-image-container">
                        <img id="modal-image" src="" alt="" />
                        <div class="modal-counter">
                            <span id="modal-counter-text">1 / 1</span>
                        </div>
                    </div>
                    
                    <button class="modal-nav modal-next" onclick="photoGalleryManager.nextPhoto()">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    
                    <div class="modal-dots">
                        <div id="modal-dots-container"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('photo-gallery-modal');
    }

    bindEvents() {
        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (!this.modal.classList.contains('active')) return;
            
            switch (e.key) {
                case 'Escape':
                    this.closeModal();
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.previousPhoto();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.nextPhoto();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToPhoto(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToPhoto(this.currentPhotos.length - 1);
                    break;
            }
        });

        // Touch events for mobile swipe
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
        });

        this.modal.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        // Prevent scrolling when modal is open
        this.modal.addEventListener('wheel', (e) => {
            if (this.modal.classList.contains('active')) {
                e.preventDefault();
            }
        });
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextPhoto(); // Swipe left = next
            } else {
                this.previousPhoto(); // Swipe right = previous
            }
        }
    }

    populateGalleries() {
        // Populate about section
        this.populateAboutGallery();
        
        // Populate story cards
        this.populateStoryCards();
        
        // Populate athlete cards
        this.populateAthleteCards();
        
        // Populate help cards
        this.populateHelpCards();
    }

    populateAboutGallery() {
        const aboutGallery = document.querySelector('.about-gallery');
        if (!aboutGallery || !this.photosData.about) return;

        aboutGallery.innerHTML = '';
        
        this.photosData.about.forEach((photo, index) => {
            const photoElement = document.createElement('div');
            photoElement.className = 'about-image';
            photoElement.onclick = () => this.openModal(this.photosData.about, index);
            
            photoElement.innerHTML = `
                <img src="${photo.src}" alt="${photo.alt}" class="gallery-img">
                <div class="image-controls">
                    <button class="image-control-btn" onclick="event.stopPropagation(); photoGalleryManager.openModal(photoGalleryManager.photosData.about, ${index})" title="View gallery">
                        <i class="fas fa-images"></i>
                    </button>
                </div>
            `;
            
            aboutGallery.appendChild(photoElement);
        });
    }

    populateStoryCards() {
        const storyCards = document.querySelectorAll('.story-card');
        const storyKeys = ['gabriel_gb', 'young_talents'];
        
        storyCards.forEach((card, index) => {
            const storyKey = storyKeys[index];
            if (!this.photosData.stories || !this.photosData.stories[storyKey]) return;
            
            const photos = this.photosData.stories[storyKey];
            const storyImg = card.querySelector('.story-img');
            
            if (storyImg && photos.length > 0) {
                storyImg.onclick = () => this.openModal(photos, 0);
                
                // Update the main image
                const img = storyImg.querySelector('img');
                if (img) {
                    img.src = photos[0].src;
                    img.alt = photos[0].alt;
                }
                
                // Update image controls
                const imageControls = storyImg.querySelector('.image-controls');
                if (imageControls) {
                    imageControls.innerHTML = `
                        <button class="image-control-btn" onclick="event.stopPropagation(); photoGalleryManager.openModal(photoGalleryManager.photosData.stories.${storyKey}, 0)" title="View gallery">
                            <i class="fas fa-images"></i>
                        </button>
                    `;
                }
                
                // Remove old gallery and read more functionality
                const readMore = card.querySelector('.read-more');
                const storyGallery = card.querySelector('.story-gallery');
                if (readMore) readMore.remove();
                if (storyGallery) storyGallery.remove();
            }
        });
    }

    populateAthleteCards() {
        const athleteCards = document.querySelectorAll('#athletes .story-card');
        const athleteKeys = ['european_championship', 'regional_championships', 'south_american_championship'];
        
        athleteCards.forEach((card, index) => {
            const athleteKey = athleteKeys[index];
            if (!this.photosData.athletes || !this.photosData.athletes[athleteKey]) return;
            
            const photos = this.photosData.athletes[athleteKey];
            const storyImg = card.querySelector('.story-img');
            
            if (storyImg && photos.length > 0) {
                storyImg.onclick = () => this.openModal(photos, 0);
                
                // Update the main image
                const img = storyImg.querySelector('img');
                if (img) {
                    img.src = photos[0].src;
                    img.alt = photos[0].alt;
                }
                
                // Update image controls
                const imageControls = storyImg.querySelector('.image-controls');
                if (imageControls) {
                    imageControls.innerHTML = `
                        <button class="image-control-btn" onclick="event.stopPropagation(); photoGalleryManager.openModal(photoGalleryManager.photosData.athletes.${athleteKey}, 0)" title="View gallery">
                            <i class="fas fa-images"></i>
                        </button>
                    `;
                }
            }
        });
    }

    populateHelpCards() {
        const helpCards = document.querySelectorAll('.help-card');
        const helpKeys = ['financial_donations', 'athlete_sponsorship', 'volunteering'];
        
        helpCards.forEach((card, index) => {
            const helpKey = helpKeys[index];
            if (!this.photosData.help || !this.photosData.help[helpKey]) return;
            
            const photos = this.photosData.help[helpKey];
            if (photos.length > 0) {
                card.onclick = () => this.openModal(photos, 0);
                
                // Update background image
                const bgImg = card.querySelector('.help-card-bg');
                if (bgImg) {
                    bgImg.src = photos[0].src;
                    bgImg.alt = photos[0].alt;
                }
            }
        });
    }

    openModal(photos, startIndex = 0) {
        this.currentPhotos = photos;
        this.currentPhotoIndex = startIndex;
        this.updateModalContent();
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    nextPhoto() {
        if (this.currentPhotoIndex < this.currentPhotos.length - 1) {
            this.currentPhotoIndex++;
            this.updateModalContent();
        }
    }

    previousPhoto() {
        if (this.currentPhotoIndex > 0) {
            this.currentPhotoIndex--;
            this.updateModalContent();
        }
    }

    goToPhoto(index) {
        if (index >= 0 && index < this.currentPhotos.length) {
            this.currentPhotoIndex = index;
            this.updateModalContent();
        }
    }

    updateModalContent() {
        const modalImage = document.getElementById('modal-image');
        const counterText = document.getElementById('modal-counter-text');
        const dotsContainer = document.getElementById('modal-dots-container');
        const prevBtn = document.querySelector('.modal-prev');
        const nextBtn = document.querySelector('.modal-next');
        
        const currentPhoto = this.currentPhotos[this.currentPhotoIndex];
        
        // Add loading state
        modalImage.style.opacity = '0.5';
        
        // Create a new image to preload
        const newImg = new Image();
        newImg.onload = () => {
            // Update image source and restore opacity when loaded
            modalImage.src = newImg.src;
            modalImage.alt = currentPhoto.alt;
            modalImage.style.opacity = '1';
        };
        newImg.onerror = () => {
            // Handle error case
            modalImage.alt = 'Image failed to load';
            modalImage.style.opacity = '1';
        };
        newImg.src = currentPhoto.src;
        
        // Update counter
        counterText.textContent = `${this.currentPhotoIndex + 1} / ${this.currentPhotos.length}`;
        
        // Update dots
        dotsContainer.innerHTML = '';
        this.currentPhotos.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = `modal-dot ${index === this.currentPhotoIndex ? 'active' : ''}`;
            dot.onclick = () => this.goToPhoto(index);
            dotsContainer.appendChild(dot);
        });
        
        // Update navigation buttons visibility
        prevBtn.style.display = this.currentPhotoIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = this.currentPhotoIndex === this.currentPhotos.length - 1 ? 'none' : 'block';
        
        // Show navigation buttons if there are multiple photos
        if (this.currentPhotos.length > 1) {
            prevBtn.style.opacity = this.currentPhotoIndex === 0 ? '0.5' : '1';
            nextBtn.style.opacity = this.currentPhotoIndex === this.currentPhotos.length - 1 ? '0.5' : '1';
        }
    }
}

// Initialize the photo gallery manager when DOM is loaded
let photoGalleryManager;
document.addEventListener('DOMContentLoaded', () => {
    photoGalleryManager = new PhotoGalleryManager();
});
