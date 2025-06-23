// File: script.js
// Wait for DOM content to load before running scripts
document.addEventListener('DOMContentLoaded', () => {
    // Sticky navbar on scroll
    const navbar = document.getElementById('navbar');
    const stickyOffset = navbar.offsetTop;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > stickyOffset) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });

    // Toggleable mobile menu (hamburger)
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('nav ul');

    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Helper functions
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.textContent = message;
        input.classList.add('input-error');
    }

    function clearErrors() {
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => (msg.textContent = ''));
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => input.classList.remove('input-error'));
    }

    function validateEmail(email) {
        // Simple email regex for validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const toggleHeaders = document.querySelectorAll('.toggle-header');
    toggleHeaders.forEach(header => {
        const toggleButton = header.querySelector('.toggle-button');
        const content = header.nextElementSibling;

        // Initialize button text
        toggleButton.textContent = '[+]';

        header.style.cursor = 'pointer';

        const toggleContent = () => {
            if (content.style.display === 'none' || content.style.display === '') {
                content.style.display = 'block';
                toggleButton.textContent = '[-]';
            } else {
                content.style.display = 'none';
                toggleButton.textContent = '[+]';
            }
        };

        header.addEventListener('click', toggleContent);
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleContent();
        });
    });
});
