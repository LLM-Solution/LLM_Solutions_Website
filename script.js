// Content for both French and English languages
const translations = {
    fr: {
        title: "IA personnalisée pour les entreprises",
        description: "Nous créons des intelligences artificielles sur mesure, adaptées à vos besoins et à vos données privées.",
        cta: "Contactez-nous pour une démo",
        nav: {
            home: "Accueil",
            about: "À propos",
            services: "Services",
            contact: "Contact",
            langSwitch: "English"
        }
    },
    en: {
        title: "Custom AI for Businesses",
        description: "We create custom-made artificial intelligence solutions, tailored to your needs and private data.",
        cta: "Contact us for a demo",
        nav: {
            home: "Home",
            about: "About",
            services: "Services",
            contact: "Contact",
            langSwitch: "Français"
        }
    }
};

// Function to switch language
function switchLanguage(language) {
    document.querySelector('h1').textContent = translations[language].title;
    document.querySelector('p').textContent = translations[language].description;
    document.querySelector('a').textContent = translations[language].cta;
    
    // Update navigation text
    const navItems = document.querySelectorAll('nav ul li a');
    navItems[0].textContent = translations[language].nav.home;
    navItems[1].textContent = translations[language].nav.about;
    navItems[2].textContent = translations[language].nav.services;
    navItems[3].textContent = translations[language].nav.contact;
    navItems[4].textContent = translations[language].nav.langSwitch;
}

// Event listener for language switch
document.getElementById('switch-lang').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default anchor behavior
    
    // Get current language from the button text and switch
    const currentLanguage = this.textContent === "English" ? "en" : "fr";
    switchLanguage(currentLanguage);
});
