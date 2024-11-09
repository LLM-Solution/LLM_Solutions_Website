/*
* @Author: ArthurBernard
* @Date:   2024-11-09 12:03:25
* @Last Modified by:   ArthurBernard
* @Last Modified time: 2024-11-09 12:12:10
*/

// Chatbot javascript with english message

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
    botMessageDiv.textContent = 'MiniChatBot is thinking...';

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
            alert("Session expired. Please log in again.");
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

function sendOtp() {
    const email = document.getElementById('email').value;
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
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
            alert('Error sending the code');
        }
    });
}

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
            throw new Error('Incorrect or expired code');
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
        console.error('Error verifying OTP code:', error);
        alert(error.message);
    });
}
