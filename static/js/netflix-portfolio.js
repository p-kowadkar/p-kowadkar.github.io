// Add this function to your netflix-portfolio.js file
document.addEventListener('DOMContentLoaded', function() {
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
    // function updateSliderArrows() {
    //     const sliders = document.querySelectorAll('.netflix-slider');
        
    //     sliders.forEach(slider => {
    //         const sliderInner = slider.querySelector('.netflix-slider-inner');
    //         const prevArrow = slider.querySelector('.slider-arrow.prev');
    //         const nextArrow = slider.querySelector('.slider-arrow.next');
            
    //         if (!prevArrow || !nextArrow) return;
            
    //         // Check if content overflows
    //         const hasOverflow = sliderInner.scrollWidth > sliderInner.clientWidth;
            
    //         // Show/hide arrows based on overflow
    //         prevArrow.style.display = hasOverflow ? 'flex' : 'none';
    //         nextArrow.style.display = hasOverflow ? 'flex' : 'none';
    //     });
    // }
    
    // Run on page load
    updateSliderArrows();
    window.addEventListener('resize', updateSliderArrows);
    
    // Run on window resize
    window.addEventListener('resize', updateSliderArrows);
});