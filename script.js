document.addEventListener('DOMContentLoaded', () => {
    // Modal functionality
    const modal = document.getElementById('imageModal');
    const modalContent = modal.querySelector('.modal-content');
    const modalImg = modal.querySelector('.modal-img');
    const profileImg = document.querySelector('.profile-img');
    const closeBtn = document.querySelector('.close-btn');
    let isAnimating = false;

    // Open modal when clicking profile image
    profileImg.addEventListener('click', (e) => {
        if (isAnimating) return;
        isAnimating = true;

        const rect = profileImg.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Set initial position to match profile image
        modalContent.style.position = 'absolute';
        modalContent.style.top = `${rect.top}px`;
        modalContent.style.left = `${rect.left}px`;
        modalContent.style.width = `${rect.width}px`;
        modalContent.style.height = `${rect.height}px`;
        modalContent.style.transform = 'scale(0.3)';
        modalContent.style.opacity = '0';
        
        // Show modal
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        
        // Force reflow
        modalContent.offsetHeight;
        
        // Start animation
        requestAnimationFrame(() => {
            modal.classList.add('show');
            modalContent.style.position = 'relative';
            modalContent.style.top = '';
            modalContent.style.left = '';
            modalContent.style.width = '';
            modalContent.style.height = '';
            modalContent.style.transform = '';
            modalContent.style.opacity = '';
            
            // Reset animation flag after animation completes
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        });
    });

    // Close modal when clicking close button
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeModal();
    });

    // Close modal when clicking outside the image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        if (isAnimating) return;
        isAnimating = true;

        const rect = profileImg.getBoundingClientRect();
        
        // Add closing class for animation
        modal.classList.add('closing');
        
        // Wait for animation to complete
        setTimeout(() => {
            modal.classList.remove('show', 'closing');
            document.body.classList.remove('modal-open');
            modal.style.display = 'none';
            
            // Add class to trigger re-animation
            document.body.classList.add('modal-closed');
            
            // Remove class after animations complete
            setTimeout(() => {
                document.body.classList.remove('modal-closed');
                isAnimating = false;
            }, 2000);
        }, 300);
    }

    // Add mouse movement effect to profile image
    profileImg.addEventListener('mousemove', (e) => {
        const rect = profileImg.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleRad = Math.atan2(y - centerY, x - centerX);
        const angleDeg = (angleRad * 180 / Math.PI + 360) % 360;
        
        profileImg.style.backgroundImage = `linear-gradient(${angleDeg}deg, #12e9c5, #0ae61d, #5de7ff, #29da19)`;
    });

    // Reset gradient on mouse leave
    profileImg.addEventListener('mouseleave', () => {
        profileImg.style.backgroundImage = 'linear-gradient(90deg, #12e9c5, #0ae61d, #5de7ff, #29da19)';
    });

    // Re-trigger animations when page is shown from bfcache
    window.addEventListener('pageshow', (event) => {
        if (event.persisted) {
            document.body.classList.add('modal-closed');
            setTimeout(() => {
                document.body.classList.remove('modal-closed');
            }, 2000);
        }
    });
}); 