// Add this code to your netflix-portfolio.js file
// Add this function to convert overlay cards to below-image display
document.addEventListener('DOMContentLoaded', function() {
    // Convert overlay cards to below-image display
    const netflixCards = document.querySelectorAll('.netflix-card');
    
    netflixCards.forEach(card => {
        // Skip cards that already have card-content (skills section)
        if (card.querySelector('.netflix-card-content')) {
            return;
        }
        
        const overlay = card.querySelector('.netflix-card-overlay');
        const img = card.querySelector('img');
        
        if (overlay && img) {
            // Create image container
            const imgContainer = document.createElement('div');
            imgContainer.className = 'netflix-card-image-container';
            
            // Move image into container
            card.removeChild(img);
            imgContainer.appendChild(img);
            
            // Create a new element for the details below the image
            const cardDetails = document.createElement('div');
            cardDetails.className = 'netflix-card-details';
            
            // Move the content from overlay to the new details section
            cardDetails.innerHTML = overlay.innerHTML;
            
            // Remove the overlay
            overlay.remove();
            
            // Append the image container and details section to the card
            card.appendChild(imgContainer);
            card.appendChild(cardDetails);
        }
    });
});

const skillsCards = document.querySelectorAll('#skills .netflix-card');

skillsCards.forEach(card => {
    card.addEventListener('click', function() {
        // If this card is already active, just toggle it off
        if (this.classList.contains('active')) {
            this.classList.remove('active');
        } else {
            // Otherwise, remove active class from all cards and add to this one
            skillsCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Function to hide arrows when no overflow
function updateSliderArrows() {
    const sliders = document.querySelectorAll('.netflix-slider');
    
    sliders.forEach(slider => {
        const sliderInner = slider.querySelector('.netflix-slider-inner');
        const prevArrow = slider.querySelector('.slider-arrow.prev');
        const nextArrow = slider.querySelector('.slider-arrow.next');
    
        if (!prevArrow || !nextArrow || !sliderInner) return;
    
        // Check if content overflows
        const hasOverflow = sliderInner.scrollWidth > sliderInner.clientWidth;
    
        // Show/hide arrows based on overflow
        prevArrow.style.display = hasOverflow ? 'flex' : 'none';
        nextArrow.style.display = hasOverflow ? 'flex' : 'none';
    });
}

// Run on page load and window resize
document.addEventListener('DOMContentLoaded', updateSliderArrows);
window.addEventListener('resize', updateSliderArrows);