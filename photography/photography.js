console.log("Photography JS loaded");

document.addEventListener("DOMContentLoaded", function() {
  const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Fallback for older browsers
    let active = false;

    const lazyLoad = function() {
      if (active === false) {
        active = true;

        setTimeout(function() {
          lazyImages.forEach(function(lazyImage) {
            if ((lazyImage.getBoundingClientRect().top <= window.innerHeight && lazyImage.getBoundingClientRect().bottom >= 0) && getComputedStyle(lazyImage).display !== "none") {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.remove("lazy");

              lazyImages = lazyImages.filter(function(image) {
                return image !== lazyImage;
              });

              if (lazyImages.length === 0) {
                document.removeEventListener("scroll", lazyLoad);
                window.removeEventListener("resize", lazyLoad);
                window.removeEventListener("orientationchange", lazyLoad);
              }
            }
          });

          active = false;
        }, 200);
      }
    };

    document.addEventListener("scroll", lazyLoad);
    window.addEventListener("resize", lazyLoad);
    window.addEventListener("orientationchange", lazyLoad);
  }

  // Modal functionality for the photo gallery
  const photoGallery = document.getElementById('photoGallery');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const closeBtn = document.querySelector('.close');

  // Safety check: ensure all essential elements are present
  if (!photoGallery || !modal || !modalImg || !closeBtn) {
    console.error("Critical Error: A required element (gallery or modal) is missing from the HTML.");
    return;
  }

  // --- Firebase Image Loading ---
  async function loadImagesFromFirebase() {
    try {
      const storage = firebase.storage();
      const photosRef = storage.ref().child('photos');
      const result = await photosRef.listAll();
      
      result.items.forEach(async (imageRef) => {
        try {
          const url = await imageRef.getDownloadURL();
          const photoItem = createPhotoItem(url);
          photoGallery.appendChild(photoItem);
        } catch (error) {
          console.error(`Failed to get URL for ${imageRef.fullPath}`, error);
        }
      });
    } catch (error) {
      console.error('Error loading images from Firebase:', error);
    }
  }

  // --- Create and set up a single photo item ---
  function createPhotoItem(url) {
    const photoItem = document.createElement('div');
    photoItem.className = 'photo-item';
    
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Photo from gallery';
    
    photoItem.addEventListener('click', () => showModal(url));
    
    photoItem.appendChild(img);
    return photoItem;
  }

  // --- Modal Logic ---
  const showModal = (url) => {
    modalImg.src = url;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // IMPORTANT: Restore background scrolling
  };

  // --- Event Listeners to close the modal ---
  closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    // Close if the click is on the dark background (the modal element or its direct content wrapper)
    // not the image itself
    if (event.target.classList.contains('modal') || event.target.classList.contains('modal-content-wrapper')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });
  
  // --- Start the application ---
  loadImagesFromFirebase();
});

// Global variables for modal navigation
let currentImageIndex = 0;
let imageUrls = []; 