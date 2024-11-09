/*
* @Author: ArthurBernard
* @Date:   2024-11-06 21:50:25
* @Last Modified by:   ArthurBernard
* @Last Modified time: 2024-11-09 12:12:12
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

// Add event listener for "Enter" key on email input
document.getElementById('email').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Prevent form submission or newline
        sendOtp();  // Call the sendOtp function
    }
});

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
