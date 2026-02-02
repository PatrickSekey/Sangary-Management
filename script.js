// ===== SANGARY MANAGEMENT WEBSITE SCRIPT (MOBILE SAFE) =====

document.addEventListener('DOMContentLoaded', () => {

  /* ======================================================
     MOBILE NAVIGATION TOGGLE (FIXED FOR PHONES)
  ====================================================== */
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    const toggleMenu = () => {
      navLinks.classList.toggle('active');
      menuToggle.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    };

    // Click (desktop + most mobile)
    menuToggle.addEventListener('click', toggleMenu);

    // Touch (required for some mobile browsers)
    menuToggle.addEventListener('touchstart', (e) => {
      e.preventDefault();
      toggleMenu();
    });
  }

  /* ======================================================
     NAVBAR SCROLL EFFECT (CLASS-BASED, SAFE)
  ====================================================== */
  const navbar = document.querySelector('.navbar');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 100);
    });
  }

  /* ======================================================
     CONTACT FORM HANDLING
  ====================================================== */
  const contactForm = document.getElementById('contactForm');
  const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const loadingIcon = submitBtn ? submitBtn.querySelector('.loading-icon') : null;
  const formMessage = contactForm ? contactForm.querySelector('.form-message') : null;

  if (contactForm && submitBtn && btnText && loadingIcon && formMessage) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const phoneInput = document.getElementById('phone');
      const iti = window.iti;

      if (iti && !iti.isValidNumber()) {
        showMessage('Please enter a valid phone number.', 'error');
        return;
      }

      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: iti ? iti.getNumber() : phoneInput.value.trim(),
        service: document.getElementById('service').value,
        message: document.getElementById('message').value.trim(),
        countryCode: iti ? iti.getSelectedCountryData().dialCode : '',
        country: iti ? iti.getSelectedCountryData().name : '',
        secret: 'CONTACT_FORM_2026'
      };

      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        showMessage('Please fill in all required fields.', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return;
      }

      submitBtn.disabled = true;
      btnText.textContent = 'Sending...';
      loadingIcon.style.display = 'inline-block';
      showMessage('Sending your message...', '');

      try {
        await fetch(
          'https://script.google.com/macros/s/AKfycbzj22Ytht2gCfXKKA5IGcVOk_kO4H-_dl7F5UMV3VYeplmG2f4ECBsG6ejwv0t8TIX1/exec',
          {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          }
        );

        showMessage(
          'Thank you! Your message has been sent successfully. We will contact you within 24 hours.',
          'success'
        );

        contactForm.reset();
        if (iti) iti.setNumber('');

      } catch (err) {
        console.error(err);
        showMessage(
          'Something went wrong. Please try again later or email patrick.sekey.ps@gmail.com.',
          'error'
        );
      } finally {
        submitBtn.disabled = false;
        btnText.textContent = 'Send Message';
        loadingIcon.style.display = 'none';
      }
    });
  }

  /* ======================================================
     HELPER: SHOW MESSAGE
  ====================================================== */
  function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = 'form-message ' + type;
    formMessage.style.display = 'block';
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ======================================================
     INTL-TEL-INPUT INITIALIZATION
  ====================================================== */
  const phoneInput = document.querySelector('#phone');

  if (phoneInput && window.intlTelInput) {
    const iti = intlTelInput(phoneInput, {
      initialCountry: 'auto',
      separateDialCode: true,
      preferredCountries: ['lr', 'us', 'gb', 'ng', 'gh'],
      geoIpLookup: (callback) => {
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => callback(data.country_code))
          .catch(() => callback('lr'));
      },
      utilsScript:
        'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js'
    });

    window.iti = iti;
  }

});
