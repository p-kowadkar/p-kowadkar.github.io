// ... existing code ...

// Skills cards toggle functionality
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
});

// ... existing code ...