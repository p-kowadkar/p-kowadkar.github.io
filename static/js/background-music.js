// Background Music Player

document.addEventListener('DOMContentLoaded', function() {
    const backgroundMusic = document.getElementById('background-music');
    let isMuted = false;
    
    // Ensure music only plays once
    if (backgroundMusic) {
        backgroundMusic.loop = false; // Disable looping to play only once
    }
    
    // Function to play background music
    function playBackgroundMusic() {
        if (backgroundMusic) {
            backgroundMusic.volume = 0.3; // Set volume to 30%
            backgroundMusic.play().catch(error => {
                console.log('Audio playback was prevented:', error);
                // Audio controls disabled
            });
            // Audio controls disabled
            
            // Add event listener for when music ends
            backgroundMusic.addEventListener('ended', function() {
                console.log('Background music ended, waiting 0.5 seconds before transitioning to homepage');
                // Add a 0.5-second delay before transitioning to homepage
                setTimeout(function() {
                    // Trigger the transition to homepage
                    transitionToHomepage();
                }, 500); // 500ms = 0.5 seconds
            });
        }
    }
    
    // Function to handle transition to homepage when music ends
    function transitionToHomepage() {
        // Find the Netflix logo animation element if it exists
        const logoAnimation = document.querySelector('.netflix-logo-animation');
        if (logoAnimation) {
            logoAnimation.classList.remove('active');
            logoAnimation.style.display = 'none';
        }
        
        // Make the main content visible
        document.body.classList.add('content-visible');
        
        // Remove the audio control button as it's no longer needed
        const controlButton = document.getElementById('audio-control-button');
        if (controlButton) {
            controlButton.remove();
        }
    }
    
    // Try to play when animation starts
    setTimeout(function() {
        playBackgroundMusic();
    }, 1000); // Delay to sync with animation
    
    // Add a click event to the document to enable sound on first user interaction
    document.addEventListener('click', function() {
        playBackgroundMusic();
        // Remove initial enable button if it exists
        const audioButton = document.getElementById('enable-audio-button');
        if (audioButton) {
            audioButton.remove();
        }
    }, { once: true }); // This ensures it only triggers once
    
    // Function to create a button to enable audio if autoplay is blocked
    function createAudioEnableButton() {
        // Disabled to prevent audio button from appearing
        return;
    }
    
    // Function to create a persistent audio control button
    function createAudioControlButton() {
        // Disabled to prevent audio control button from appearing
        return;
    }
});