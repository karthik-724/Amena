document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userMessageInput = document.getElementById('user-message');
    const sendButton = document.getElementById('send-button');
    const voiceButton = document.getElementById('voice-button');
    const hearButton = document.getElementById('hear-button');
    hearButton.addEventListener('click', () => {
        readMessage(content);
    });

    function addMessage(content, type) {
        const message = document.createElement('div');
        message.className = `message ${type}`;
        if (type === 'received') {
            // Create a "Hear" button with a speaker icon for received messages
            const hearButton = document.createElement('button');
            hearButton.className = 'hear-button';
            const icon = document.createElement('i');
            icon.className = 'material-icons';
            icon.textContent = 'volume_up'; // Speaker icon
            hearButton.appendChild(icon);
            hearButton.addEventListener('click', () => {
                readMessage(content);
            });
            message.appendChild(hearButton);
        }
        
        // Create a div for the message content
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        message.appendChild(messageContent);
    
       
    
        // Add the message to the chat container
        chatMessages.appendChild(message);
    }
    
    userMessageInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const userMessage = userMessageInput.value;
        if (userMessage) {
            sendMessage(userMessage);
            userMessageInput.value = '';
        }
        }
    });
    // Function to send a message and receive a response
    function sendMessage(message) {
        addMessage(message, 'sent');
        // Send the user's message to your Flask backend for processing
        fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ user_message: message }),
        })
        .then(response => response.json())
        .then(data => {
            const response = data.response;
            addMessage(response, 'received');
        })
        .catch(error => console.error(error));
    }
    function readMessage(message) {
        const speech = new SpeechSynthesisUtterance(message);
        window.speechSynthesis.speak(speech);
    }

    // Event listener for the "Hear" buttons
    chatMessages.addEventListener('click', function(event) {
        if (event.target.classList.contains('hear-button')) {
            const message = event.target.previousElementSibling.innerText;
            readMessage(message);
        }
    });

    sendButton.addEventListener('click', () => {
        const userMessage = userMessageInput.value;
        if (userMessage) {
            sendMessage(userMessage);
            userMessageInput.value = '';
        }
    });

    voiceButton.addEventListener('click', () => {
        const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
        recognition.onresult = function(event) {
            const voiceMessage = event.results[0][0].transcript;
            sendMessage(voiceMessage); // Send the voice message to the server
            userMessageInput.value = '';
        };
        recognition.start();
    });
});
