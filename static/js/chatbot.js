// Enhanced Chatbot JavaScript for Netflix-inspired Portfolio Website
// This version communicates with the Flask backend instead of directly with DeepSeek API

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const chatbotClose = document.querySelector('.chatbot-close');
    const chatbotMessages = document.querySelector('.chatbot-messages');
    const chatbotInputField = document.getElementById('chatbot-input-field');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    
    // Generate a unique session ID for this chat session
    const sessionId = generateSessionId();
    
    // Greeting messages for variety
    const greetings = [
        `Hi there! I'm Pranav's AI assistant. How can I help you today?`,
        `Hello! I'm here to tell you about Pranav Kowadkar. What would you like to know?`,
        `Welcome! I'm Pranav's virtual assistant. Feel free to ask me anything about his background or skills!`,
        `Greetings! I can provide information about Pranav's experience, education, or projects. What interests you?`
    ];
    
    // Conversation suggestions to guide users
    const suggestions = [
        "Tell me about Pranav's experience",
        "What are Pranav's skills?",
        "Education background",
        "Show me projects",
        "Contact information"
    ];
    
    // Initialize chatbot with random greeting and suggestions
    function initChatbot() {
        // Clear existing messages
        chatbotMessages.innerHTML = '';
        
        // Add random greeting
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        addMessageToChat('bot', randomGreeting);
        
        // Add suggestion chips
        addSuggestionChips();
        
        // Show typing indicator briefly for effect
        showTypingIndicator();
        setTimeout(removeTypingIndicator, 1000);
    }
    
    // Add suggestion chips to guide user interaction
    function addSuggestionChips() {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestion-chips';
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', function() {
                // Add user message
                addMessageToChat('user', suggestion);
                
                // Process the suggestion
                processUserMessage(suggestion);
                
                // Remove suggestions after clicking
                suggestionsContainer.remove();
            });
            suggestionsContainer.appendChild(chip);
        });
        
        chatbotMessages.appendChild(suggestionsContainer);
        scrollToBottom();
    }
    
    // Toggle chatbot visibility with animation
    if (chatbotToggle) {
        chatbotToggle.addEventListener('click', function() {
            chatbotContainer.classList.toggle('active');
            
            // Initialize chatbot if it's being opened for the first time
            if (chatbotContainer.classList.contains('active') && chatbotMessages.childElementCount <= 1) {
                initChatbot();
            }
        });
    }
    
    // Close chatbot
    if (chatbotClose) {
        chatbotClose.addEventListener('click', function() {
            chatbotContainer.classList.remove('active');
        });
    }
    
    // Send message when clicking send button
    if (chatbotSendBtn) {
        chatbotSendBtn.addEventListener('click', sendMessage);
    }
    
    // Send message when pressing Enter key
    if (chatbotInputField) {
        chatbotInputField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Function to send user message and get response
    function sendMessage() {
        const userMessage = chatbotInputField.value.trim();
        
        if (userMessage === '') return;
        
        // Add user message to chat
        addMessageToChat('user', userMessage);
        
        // Clear input field
        chatbotInputField.value = '';
        
        // Process the message
        processUserMessage(userMessage);
    }
    
    // Process user message and generate response via Flask backend
    function processUserMessage(userMessage) {
        showTypingIndicator();
    
        // Enhanced API URL detection
        const apiUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? 'http://localhost:5000/api/chat'
            : 'https://p-kowadkar.github.io/api/chat';  // Use full GitHub Pages URL
    
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',  // Important for CORS with credentials
            body: JSON.stringify({
                message: userMessage,
                session_id: sessionId
            }),
        })
        .then(response => {
            if (!response.ok) {
                // More detailed error handling
                if (response.status === 404) {
                    throw new Error('API endpoint not found (404)');
                } else if (response.status === 500) {
                    throw new Error('Server error (500)');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Remove typing indicator
            removeTypingIndicator();
    
            // Handle error responses more specifically
            if (data.error) {
                const errorMessage = data.message || 'Sorry, I encountered an error. Please try again.';
                addMessageToChat('bot', errorMessage);
                
                // Add retry suggestion
                addFollowUpSuggestions(['Try again', 'Ask something else']);
            } else {
                addMessageToChat('bot', data.message);
                
                // Add contextual suggestions
                addContextualSuggestions(data.message);
            }
            scrollToBottom();
        })
        .catch(error => {
            console.error('API Connection Error:', error);
            removeTypingIndicator();
            addMessageToChat('bot', `Connection failed. Details: ${error.message}`);
            scrollToBottom();
            
            // Debugging help
            console.log('Attempted API URL:', apiUrl);
            console.log('Request Payload:', {
                message: userMessage,
                session_id: sessionId
            });
        });
    }

    // New function to handle contextual suggestions
    function addContextualSuggestions(responseText) {
        const suggestionsMap = {
            experience: ['Projects', 'Skills', 'Education'],
            skills: ['Projects', 'Experience', 'Certifications'],
            education: ['Work Experience', 'Technical Skills', 'Contact'],
            projects: ['Technologies Used', 'Demo Links', 'Challenges']
        };

        const key = Object.keys(suggestionsMap).find(k => 
            responseText.toLowerCase().includes(k)
        );
        
        if (key) {
            addFollowUpSuggestions(suggestionsMap[key]);
        }
    }
    
    // Add follow-up suggestion chips
    function addFollowUpSuggestions(suggestions) {
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'suggestion-chips follow-up';
        
        suggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.className = 'suggestion-chip';
            chip.textContent = suggestion;
            chip.addEventListener('click', function() {
                // Add user message
                addMessageToChat('user', suggestion);
                
                // Process the suggestion
                processUserMessage(suggestion);
                
                // Remove suggestions after clicking
                suggestionsContainer.remove();
            });
            suggestionsContainer.appendChild(chip);
        });
        
        chatbotMessages.appendChild(suggestionsContainer);
        scrollToBottom();
    }
    
    // Function to add message to chat with animation
    function addMessageToChat(sender, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(`message-${sender}`);
        
        // Check if message contains HTML (for links)
        if (message.includes('<a href=')) {
            messageElement.innerHTML = message;
        } else {
            messageElement.textContent = message;
        }
        
        // Add animation class
        messageElement.classList.add('message-animation');
        
        chatbotMessages.appendChild(messageElement);
        
        // Scroll to bottom of chat
        scrollToBottom();
    }
    
    // Function to show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.classList.add('typing-indicator');
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        
        chatbotMessages.appendChild(typingIndicator);
        
        // Scroll to bottom of chat
        scrollToBottom();
    }
    
    // Function to remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Function to scroll to bottom of chat
    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Function to generate a unique session ID
    function generateSessionId() {
        return 'session_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    // Function to reset conversation
    function resetConversation() {
        // Call API to reset conversation on server
        fetch('/api/reset_conversation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: sessionId
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Conversation reset:', data);
            
            // Clear chat UI
            chatbotMessages.innerHTML = '';
            
            // Reinitialize chatbot
            initChatbot();
        })
        .catch(error => {
            console.error('Error resetting conversation:', error);
        });
    }
    
    // Add reset button to chatbot header
    const chatbotHeader = document.querySelector('.chatbot-header');
    if (chatbotHeader) {
        const resetButton = document.createElement('button');
        resetButton.className = 'chatbot-reset';
        resetButton.innerHTML = '<i class="fas fa-redo"></i>';
        resetButton.title = 'Reset conversation';
        resetButton.addEventListener('click', resetConversation);
        
        // Insert before close button
        const closeButton = document.querySelector('.chatbot-close');
        if (closeButton) {
            chatbotHeader.insertBefore(resetButton, closeButton);
        } else {
            chatbotHeader.appendChild(resetButton);
        }
    }
    
    // Add CSS for new chatbot elements
    const style = document.createElement('style');
    style.textContent = `
        .chatbot-reset {
            background: none;
            border: none;
            color: var(--text-color);
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s ease;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin-right: 10px;
        }
        
        .chatbot-reset:hover {
            background-color: rgba(255, 255, 255, 0.2);
            transform: rotate(180deg);
        }
        
        .message-animation {
            animation: messageSlide 0.3s forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes messageSlide {
            to { opacity: 1; transform: translateY(0); }
        }
        
        .suggestion-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin: 10px 0;
            animation: fadeIn 0.5s forwards;
        }
        
        .suggestion-chip {
            background-color: rgba(196, 30, 58, 0.2);
            color: #fff;
            padding: 8px 12px;
            border-radius: 16px;
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid rgba(196, 30, 58, 0.5);
        }
        
        .suggestion-chip:hover {
            background-color: rgba(196, 30, 58, 0.4);
            transform: translateY(-3px);
        }
        
        .follow-up {
            margin-top: 5px;
            opacity: 0;
            animation: fadeIn 0.5s forwards 0.3s;
        }
        
        .message a {
            color: #4cc9f0;
            text-decoration: underline;
            transition: all 0.3s ease;
        }
        
        .message a:hover {
            color: #ffd166;
            text-decoration: none;
        }
        
        .message strong {
            color: #ffd166;
        }
    `;
    document.head.appendChild(style);
});
