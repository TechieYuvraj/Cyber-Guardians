// Chatbot functionality
document.addEventListener('DOMContentLoaded', () => {
    // Create chatbot widget
    createChatbotWidget();
    
    // Initialize chatbot
    initChatbot();
});

function createChatbotWidget() {
    const chatbotHTML = `
        <div id="chatbot-widget">
            <button id="chatbot-icon" class="chatbot-icon" aria-label="Open chat">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="currentColor"/>
                    <path d="M6 9H18V11H6V9ZM14 15H6V13H14V15ZM18 7H6V5H18V7Z" fill="black"/>
                </svg>
            </button>
            <div id="chatbot-popup" class="chatbot-popup">
                <div class="chatbot-header">
                    <h3>Cyber Assistant</h3>
                    <button id="chatbot-close" class="chatbot-close" aria-label="Close chat">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="message bot-message">
                        <div class="message-content">
                            <p>Hello! I'm your Cyber Assistant. How can I help you today?</p>
                        </div>
                        <span class="message-time">Just now</span>
                    </div>
                </div>
                <div class="chatbot-input-container">
                    <input type="text" id="chatbot-input" placeholder="Type your message..." maxlength="500">
                    <button id="chatbot-send" class="chatbot-send" aria-label="Send message">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M2.01 21L23 12L2.01 3L2 10L17 12L2 14L2.01 21Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
}

function initChatbot() {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');
    
    let isOpen = false;
    
    // Toggle chatbot popup
    function toggleChatbot() {
        isOpen = !isOpen;
        chatbotPopup.classList.toggle('active', isOpen);
    }
    
    // Close chatbot
    function closeChatbot() {
        isOpen = false;
        chatbotPopup.classList.remove('active');
    }
    
    // Add message to chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
            <span class="message-time">${time}</span>
        `;
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    
    // Send message to webhook
    async function sendMessage(message) {
        if (!message.trim()) return;
        
        addMessage(message, true);
        chatbotInput.value = '';
        
        try {
            // Call the backend proxy endpoint to avoid CORS issues
            const proxyUrl = '/api/send-to-n8n';

            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    timestamp: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                addMessage(data.response || 'Thank you for your message! Our team will get back to you soon.');
            } else {
                addMessage('Sorry, I\'m having trouble connecting. Please try again later.');
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            addMessage('Sorry, I\'m having trouble connecting. Please try again later.');
        }
    }
    
    // Event listeners
    chatbotIcon.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', closeChatbot);
    chatbotSend.addEventListener('click', () => sendMessage(chatbotInput.value));
    
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(chatbotInput.value);
        }
    });
    
    // Close chatbot when clicking outside
    document.addEventListener('click', (e) => {
        if (isOpen && !chatbotPopup.contains(e.target) && e.target !== chatbotIcon) {
            closeChatbot();
        }
    });
}
