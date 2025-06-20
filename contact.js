// contact.js - JavaScript to handle contact form submission to Google Sheets

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    // Replace this URL with your deployed Google Apps Script web app URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwpNYrQLbesnOBiT7QzIXa_8dIaKzup7AG5XyScie-HXCM0ce6tl37NfhZrudMuzdobNQ/exec';

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        formStatus.textContent = '';

        let isValid = true;

        // Validate Name
        const nameInput = contactForm.name;
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Name is required');
            isValid = false;
        }

        // Validate Email
        const emailInput = contactForm.email;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }

        // Validate Message
        const messageInput = contactForm.message;
        if (!messageInput.value.trim()) {
            showError(messageInput, 'Message is required');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Prepare data to send
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };

        // Send data to Google Apps Script
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            formStatus.style.color = 'var(--color-secondary)';
            formStatus.textContent = 'Thank you for contacting Cyber Guardians! We will get back to you soon.';
            contactForm.reset();
        })
        .catch(() => {
            formStatus.style.color = 'var(--color-accent-red)';
            formStatus.textContent = 'Oops! Something went wrong. Please try again later.';
        });
    });

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
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
});
