document.addEventListener('DOMContentLoaded', () => {
    const membershipForm = document.getElementById('membershipForm');
    const formStatus = document.getElementById('formStatus');

    // Replace this URL with your deployed Google Apps Script web app URL for membership form
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyM5jkRi_VzoEDRcLPMfYCduebHLtP51v1LUD6m96Q67nRTabjAiYk2GnH6PWiP2W9G/exec';

    membershipForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();
        formStatus.textContent = '';

        let isValid = true;

        // Validate Name
        const nameInput = membershipForm.name;
        if (!nameInput.value.trim()) {
            showError(nameInput, 'Full Name is required');
            isValid = false;
        }

        // Validate Phone
        const phoneInput = membershipForm.phone;
        const phonePattern = /^\d{10}$/;
        if (!phoneInput.value.trim()) {
            showError(phoneInput, 'Phone Number is required');
            isValid = false;
        } else if (!phonePattern.test(phoneInput.value.trim())) {
            showError(phoneInput, 'Please enter a valid 10-digit phone number');
            isValid = false;
        }

        // Validate Email
        const emailInput = membershipForm.email;
        if (!emailInput.value.trim()) {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        }

        // Validate College
        const collegeInput = membershipForm.college;
        if (!collegeInput.value.trim()) {
            showError(collegeInput, 'College Name is required');
            isValid = false;
        }

        // Validate Course
        const courseInput = membershipForm.course;
        if (!courseInput.value.trim()) {
            showError(courseInput, 'Course is required');
            isValid = false;
        }

        // Validate Branch
        const branchInput = membershipForm.branch;
        if (!branchInput.value.trim()) {
            showError(branchInput, 'Branch is required');
            isValid = false;
        }

        // Validate Year
        const yearInput = membershipForm.year;
        if (!yearInput.value) {
            showError(yearInput, 'Year of Study is required');
            isValid = false;
        }

        // Validate Reason
        const reasonInput = membershipForm.reason;
        if (!reasonInput.value.trim()) {
            showError(reasonInput, 'Reason to Join is required');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Prepare data to send
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            college: collegeInput.value.trim(),
            course: courseInput.value.trim(),
            branch: branchInput.value.trim(),
            year: yearInput.value,
            reason: reasonInput.value.trim()
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
            formStatus.textContent = 'Thank you for applying! We will get back to you soon.';
            membershipForm.reset();
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
        const errorMessages = membershipForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => (msg.textContent = ''));
        const inputs = membershipForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => input.classList.remove('input-error'));
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }
});
