document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Typing effect function for multiple elements
function typeWriter(element, text, speed, callback) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            callback(); // Call the next typing function once this one is done
        }
    }
    type();
}

// Sequential typing effect
function applyTypingEffect() {
    const elementsToAnimate = document.querySelectorAll('.typewriter'); // Select all elements with class "typewriter"
    let currentElement = 0;

    function startTypingNextElement() {
        if (currentElement < elementsToAnimate.length) {
            const element = elementsToAnimate[currentElement];
            const text = element.textContent;
            element.textContent = ''; // Clear the text initially
            typeWriter(element, text, 10, startTypingNextElement); // Start typing the next element when done
            currentElement++;
        }
    }

    startTypingNextElement(); // Start with the first element
}

// When the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    applyTypingEffect();
});