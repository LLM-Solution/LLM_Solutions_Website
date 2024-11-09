/*
* @Author: ArthurBernard
* @Date:   2024-11-06 21:50:25
* @Last Modified by:   ArthurBernard
* @Last Modified time: 2024-11-09 10:39:02
*/

// MiniChatBot

document.getElementById('send-btn').addEventListener('click', sendMessage);

document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission or newline
        sendMessage();  // Call sendMessage function
    }
});

/*const API_BASE_URL = 'http://127.0.0.1:5000';*/
const API_BASE_URL = 'https://api.llm-solutions.fr';

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('sessionToken');

    displayMessage('User', userInput);
    document.getElementById('user-input').value = '';

    // Create a container for the bot's response
    const botMessageDiv = createMessageContainer('Bot');

    // Create a typing indicator for the bot
    botMessageDiv.textContent = 'Bot is thinking...';

    fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            question: userInput,
            email: email,
            stream: true
        }),
    }).then(response => {
        if (response.status === 401) {
            alert("Session expirée. Veuillez vous reconnecter.");
            console.log("Error 401 - session expired");
            logout();
            return;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            console.log("Unexpected error");
            logout();
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Remove typing indicator
        botMessageDiv.textContent = '';

        // Process chunks of text as they arrive
        function readChunk() {
            reader.read().then(({ done, value }) => {
                if (done) {
                    console.log("Streaming finished");
                    return;
                }

                // Decode and append the chunk to the existing message
                const chunk = decoder.decode(value, { stream: true });
                appendToMessageContainer(botMessageDiv, chunk);

                // Keep reading chunks
                readChunk();
            });
        }

        readChunk();
    }).catch(error => {
        appendToMessageContainer(botMessageDiv, 'Sorry, there was an error.');
        console.error('Error:', error);
    });
}

// Create a message container for the bot or user
function createMessageContainer(sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    document.getElementById('messages').appendChild(messageDiv);
    messageDiv.scrollIntoView();
    return messageDiv;
}

// Append chunks to the bot's message container
function appendToMessageContainer(container, chunk) {
    container.innerHTML += chunk
    container.scrollIntoView();  // Scroll to the latest message
}

function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender.toLowerCase());
    messageDiv.textContent = message;

    document.getElementById('messages').appendChild(messageDiv);
    messageDiv.scrollIntoView();
}

function displayStreamedMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'bot');
    messageDiv.textContent = message;
    document.getElementById('messages').appendChild(messageDiv);
    messageDiv.scrollIntoView();
}

// OTP authentification
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function sendOtp() {
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        alert("Veuillez entrer une adresse e-mail valide.");
        return;
    }
    fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
    }).then(response => {
        if (response.ok) {
            document.getElementById('verify-otp-input-container').style.display = 'flex';

            // Focus on OTP input after it becomes visible
            document.getElementById('otp').focus();
        } else {
            alert('Erreur lors de l\'envoi du code');
        }
    });
}

// Add event listener for "Enter" key on email input
document.getElementById('email').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission or newline
        sendOtp();  // Call the sendOtp function
    }
});

function verifyOtp() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Code incorrect ou expiré');
        }
        return response.json();
    })
    .then(data => {
        sessionStorage.setItem('sessionToken', data.token);
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('isLoggedIn', 'true');
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('chatbot-container').style.display = 'block';
    })
    .catch(error => {
        console.error('Erreur lors de la vérification du code OTP:', error);
        alert(error.message);
    });
}

// Add event listener for "Enter" key on OTP input
document.getElementById('otp').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission or newline
        verifyOtp();  // Call the verifyOtp function
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Check if server is up or down
    checkServerStatus();
});

function checkServerStatus() {
    fetch(`${API_BASE_URL}/health`, { method: 'GET' })
        .then(response => {
            if (!response.ok) throw new Error('Server is down');
            document.getElementById('server-error-container').style.display = 'none';
            // Check if user is already logger
            if (sessionStorage.getItem('isLoggedIn') === 'true') {
                document.getElementById('auth-container').style.display = 'none';
                document.getElementById('chatbot-container').style.display = 'block';
            } else {
                document.getElementById('auth-container').style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Erreur :', error);
            displayServerErrorMessage();
        });
}

function displayServerErrorMessage() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('chatbot-container').style.display = 'none';
    document.getElementById('server-error-container').style.display = 'block';
}

function logout() {
    console.log("Logout")
    sessionStorage.removeItem('sessionToken');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('isLoggedIn')
    document.getElementById('auth-container').style.display = 'block';
    document.getElementById('chatbot-container').style.display = 'none';
}
