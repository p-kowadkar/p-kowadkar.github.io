// Enhanced Chatbot JavaScript for Netflix-inspired Portfolio Website
// This version temporarily disables the chatbot and shows an "out sick" message

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');

    // Style the chatbot toggle as a circular 🤖 icon
    if (chatbotToggle) {
        chatbotToggle.innerHTML = '🤖';
        chatbotToggle.style.display = 'flex';
        chatbotToggle.style.alignItems = 'center';
        chatbotToggle.style.justifyContent = 'center';
        chatbotToggle.style.width = '56px';
        chatbotToggle.style.height = '56px';
        chatbotToggle.style.borderRadius = '50%';
        chatbotToggle.style.background = '#c41e3a';
        chatbotToggle.style.color = '#fff';
        chatbotToggle.style.fontSize = '2rem';
        chatbotToggle.style.cursor = 'pointer';
        chatbotToggle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        chatbotToggle.style.position = 'fixed';
        chatbotToggle.style.bottom = '32px';
        chatbotToggle.style.right = '32px';
        chatbotToggle.style.zIndex = '9999';
        chatbotToggle.style.border = 'none';
        chatbotToggle.style.transition = 'background 0.3s';
    }

    // Create the floating popup (hidden by default)
    let chatbotPopup = document.createElement('div');
    chatbotPopup.id = 'chatbot-popup-message';
    chatbotPopup.style.display = 'none';
    chatbotPopup.innerHTML = `
        <div class="chatbot-popup-content">
            🤖 Pranav’s AI Assistant is out sick!<br>
            The poor bot caught a bad case of recursive loop flu and is busy recharging its neural batteries.<br><br>
            While it recuperates, feel free to contact Pranav directly at <a href="mailto:pk.kowadkar@gmail.com">pk.kowadkar@gmail.com</a> or via <a href="https://linkedin.com/in/pkowadkar" target="_blank">LinkedIn</a>.<br><br>
            Thanks for your patience — service will resume once the circuits stop sneezing! 😊
        </div>
    `;
    document.body.appendChild(chatbotPopup);

    // Style for the popup
    const style = document.createElement('style');
    style.textContent = `
        #chatbot-popup-message {
            position: fixed;
            bottom: 100px;
            right: 40px;
            z-index: 10001;
            background: #232323;
            color: #fff;
            border-radius: 18px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.25);
            padding: 22px 20px 22px 20px;
            min-width: 280px;
            max-width: 340px;
            font-size: 1rem;
            line-height: 1.5;
            animation: fadeIn 0.3s;
        }
        .chatbot-popup-content a {
            color: #4cc9f0;
            text-decoration: underline;
        }
        .chatbot-popup-content a:hover {
            color: #ffd166;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px);}
            to { opacity: 1; transform: translateY(0);}
        }
    `;
    document.head.appendChild(style);

    // Toggle popup on icon click
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            if (chatbotPopup.style.display === 'none') {
                chatbotPopup.style.display = 'block';
            } else {
                chatbotPopup.style.display = 'none';
            }
        });
    }
});
