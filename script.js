/*
* @Author: ArthurBernard
* @Date:   2024-09-26 10:04:00
* @Last Modified by:   ArthurBernard
* @Last Modified time: 2024-10-25 08:27:06
*/

// Select items
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-header nav');
const navLinks = document.querySelectorAll('.main-nav a');

// Function to toggle the menu display
function toggleMenu() {
    nav.classList.toggle('nav-open');
    menuToggle.classList.toggle('active');

    // Update aria-expanded attribute for accessibility
    const isOpen = nav.classList.contains('nav-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Close the menu' : 'Open the menu');
}

// Add event listener to the menu button
menuToggle.addEventListener('click', toggleMenu);

// Close the menu when clicking on a link
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        // Check if the menu is open
        if (nav.classList.contains('nav-open')) {
            toggleMenu();
        }
    });
});

// Close the menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideMenu = nav.contains(event.target);
    const isClickOnMenuToggle = menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnMenuToggle && nav.classList.contains('nav-open')) {
        toggleMenu();
    }
});

// Select all sections with the 'fade-in' class
const faders = document.querySelectorAll('.fade-in');

// Intersection Observer options
const appearOptions = {
    threshold: 0.1, // Visibility percentage before triggering
    rootMargin: "0px 0px -50px 0px" // Adjust to trigger slightly before
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Stop observing once the animation is triggered
        }
    });
}, appearOptions);

// Observe each element
faders.forEach(fader => {
    appearOnScroll.observe(fader);
});

// Select the theme toggle button
const themeToggle = document.getElementById('theme-toggle');

// Check the current theme in local storage or default to dark
let currentTheme = localStorage.getItem('theme') || 'dark';

// Function to apply the theme
function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('theme', theme);
}

// Apply the theme on page load
applyTheme(currentTheme);

// Event listener for the theme toggle button
themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
});

// Select all buttons to show examples
const exampleButtons = document.querySelectorAll('.show-example');

// Add hover event to each button
exampleButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
        const usageBox = button.nextElementSibling;
        usageBox.style.display = 'block';
    });

    button.addEventListener('mouseout', () => {
        const usageBox = button.nextElementSibling;
        usageBox.style.display = 'none';
    });
});

// Cookies and Google Analytics
document.addEventListener("DOMContentLoaded", function() {
  let cookieConsent = localStorage.getItem("cookieConsent");

  /*if (cookieConsent === null) {
    document.getElementById("cookieConsent").style.display = "block";
  } else if (cookieConsent === "true") {
    loadGoogleAnalytics();
  }*/
  if (cookieConsent === null) {
    const cookieBanner = document.getElementById("cookieConsent");
    cookieBanner.style.display = "block"; // Rendre le pop-up visible
    setTimeout(() => {
      cookieBanner.style.opacity = "1"; // Faire apparaître progressivement
    }, 100); // Légère attente pour s'assurer que l'élément est visible avant de commencer le fondu
  } else if (cookieConsent === "true") {
    loadGoogleAnalytics(); // Charge Google Analytics si l'utilisateur a déjà consenti
  }

  document.getElementById("acceptCookie").addEventListener("click", function() {
    localStorage.setItem("cookieConsent", "true");
    document.getElementById("cookieConsent").style.display = "none";
    loadGoogleAnalytics(); // Charge Google Analytics après acceptation
  });

  document.getElementById("declineCookie").addEventListener("click", function() {
    localStorage.setItem("cookieConsent", "false");
    document.getElementById("cookieConsent").style.display = "none";
  });
});

function removeGoogleAnalytics() {
  var scripts = document.querySelectorAll('script[src*="googletagmanager.com/gtag/js"]');
  scripts.forEach(function(script) {
    script.parentNode.removeChild(script);
  });
  window['ga-disable-G-5MD3JTC1RT'] = true;
}

function loadGoogleAnalytics() {
  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-5MD3JTC1RT";
  document.head.appendChild(script);

  script.onload = function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-5MD3JTC1RT');
  };
}


// MiniChatBot
document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();  // Empêche le saut de ligne par défaut
        sendMessage();  // Envoie le message
    }
});

function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    displayMessage('User', userInput);
    document.getElementById('user-input').value = '';

    // Create a container for the bot's response
    const botMessageDiv = createMessageContainer('Bot');

    // Create a typing indicator for the bot
    botMessageDiv.textContent = 'Bot is thinking...';

    /*fetch('http://127.0.0.1:5000/ask', {*/
    fetch('https://api.llm-solutions.fr/ask', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: userInput,
            stream: true,
        }),
    })
    .then(response => {
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
    })
    .catch(error => {
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
