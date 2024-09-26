/*
* @Author: ArthurBernard
* @Date:   2024-09-26 10:04:00
* @Last Modified by:   ArthurBernard
* @Last Modified time: 2024-09-26 17:34:32
*/

// Items selection
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-header nav');
const navLinks = document.querySelectorAll('.main-nav a');

// Fonction pour basculer l'affichage du menu
function toggleMenu() {
    nav.classList.toggle('nav-open');
    menuToggle.classList.toggle('active');

    // Mise à jour de l'attribut aria-expanded pour l'accessibilité
    const isOpen = nav.classList.contains('nav-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
}

// Ajouter un écouteur d'événement sur le bouton du menu
menuToggle.addEventListener('click', toggleMenu);

// Fermer le menu lorsque l'on clique sur un lien
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        // Vérifie si le menu est ouvert
        if (nav.classList.contains('nav-open')) {
            toggleMenu();
        }
    });
});

// Fermer le menu lorsqu'on clique en dehors
document.addEventListener('click', (event) => {
    const isClickInsideMenu = nav.contains(event.target);
    const isClickOnMenuToggle = menuToggle.contains(event.target);

    if (!isClickInsideMenu && !isClickOnMenuToggle && nav.classList.contains('nav-open')) {
        toggleMenu();
    }
});

// Sélectionner toutes les sections avec la classe 'fade-in'
const faders = document.querySelectorAll('.fade-in');

// Options de l'Intersection Observer
const appearOptions = {
    threshold: 0.1, // Pourcentage de visibilité avant de déclencher
    rootMargin: "0px 0px -50px 0px" // Ajustement pour déclencher un peu avant
};

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target); // Arrêter d'observer une fois l'animation lancée
        }
    });
}, appearOptions);

// Observer chaque élément
faders.forEach(fader => {
    appearOnScroll.observe(fader);
});
