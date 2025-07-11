(function() {
  // Add event listener for debugResetBtn to clear all bookings (dev only)
  const debugResetBtn = document.getElementById('debugResetBtn');
  if (debugResetBtn) {
    debugResetBtn.addEventListener('click', () => {
      console.log('debugResetBtn clicked');
      if (confirm('Are you sure you want to reset all bookings? This action cannot be undone.')) {
        console.log('User confirmed reset');
        // Clear booking related data from localStorage
        localStorage.removeItem('flightBookings');
        localStorage.removeItem('hotelBookings');
        localStorage.removeItem('packageBookings');
        // Add any other booking related keys here if needed

        alert('All bookings have been reset.');
        location.reload();
      } else {
        console.log('User cancelled reset');
      }
    });
  }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Add hover effect for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
    });

    // Add click feedback for buttons on feature cards
    const featureButtons = document.querySelectorAll('.feature-card .btn');
    featureButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 200);
        });
    });

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Optional: Animate landing header on page load
    const landingHeader = document.querySelector('.landing-header h1');
    if (landingHeader) {
        landingHeader.style.opacity = 0;
        landingHeader.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            landingHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            landingHeader.style.opacity = 1;
            landingHeader.style.transform = 'translateY(0)';
        }, 100);
    }

    // Logout button handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                if (response.ok) {
                    window.location.href = 'login.html';
                } else {
                    alert('Logout failed. Please try again.');
                }
            } catch (error) {
                alert('An error occurred during logout.');
            }
        });
    }

    // New: Update auth buttons to show logged in user info
    const authButtonsDiv = document.querySelector('.auth-buttons');
    async function updateAuthButtons() {
        try {
            console.log('Fetching /api/me to update auth buttons...');
            const response = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
            if (!response.ok) {
                console.log('User not logged in or error fetching /api/me:', response.status);
                // Not logged in or error
                return;
            }
            const user = await response.json();
            console.log('User data received:', user);
            if (user && authButtonsDiv) {
                authButtonsDiv.innerHTML = `
                    <span><i class="fas fa-user"></i> Welcome<strong>${user.username}</strong></span>
                    <button id="logoutBtn" class="btn btn-secondary">Logout</button>
                `;
                // Add logout handler to new button
                const newLogoutBtn = document.getElementById('logoutBtn');
                if (newLogoutBtn) {
                    newLogoutBtn.addEventListener('click', async () => {
                        try {
                            const logoutResponse = await fetch('/api/logout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                            });
                            if (logoutResponse.ok) {
                                window.location.href = 'login.html';
                            } else {
                                alert('Logout failed. Please try again.');
                            }
                        } catch (error) {
                            alert('An error occurred during logout.');
                        }
                    });
                }
            }
        } catch (error) {
            console.error('Error in updateAuthButtons:', error);
        }
    }
    updateAuthButtons();

    // Add event listener for My Bookings button
    const myBookingsBtn = document.getElementById('myBookingsBtn');
    if (myBookingsBtn) {
        myBookingsBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                const response = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
                if (response.ok) {
                    // User is logged in, redirect to profile.html (My Bookings page)
                    window.location.href = 'profile.html';
                } else {
                    // Not logged in, redirect to login.html
                    window.location.href = 'login.html';
                }
            } catch (error) {
                console.error('Error checking login status:', error);
                // On error, redirect to login page as fallback
                window.location.href = 'login.html';
            }
        });
    }

    // Navigation toggle for mobile menu
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('nav-menu-visible');
        });
    }

    // Show/hide return date based on trip type selection
    const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
    const returnDateGroup = document.getElementById('returnDateGroup');

    function updateReturnDateVisibility() {
        const selectedTripType = document.querySelector('input[name="tripType"]:checked').value;
        if (selectedTripType === 'roundtrip') {
            returnDateGroup.style.display = 'block';
            document.getElementById('returnDate').setAttribute('required', 'required');
        } else {
            returnDateGroup.style.display = 'none';
            document.getElementById('returnDate').removeAttribute('required');
        }
    }

    tripTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateReturnDateVisibility);
    });

    // Initialize on page load
    updateReturnDateVisibility();

    // Debug reset button handler
    const debugResetBtn = document.getElementById('debugResetBtn');
    if (debugResetBtn) {
        debugResetBtn.addEventListener('click', () => {
            console.log('debugResetBtn clicked');
            if (confirm('Are you sure you want to reset all bookings? This action cannot be undone.')) {
                console.log('User confirmed reset');
                // Clear booking related data from localStorage
                localStorage.removeItem('flightBookings');
                localStorage.removeItem('hotelBookings');
                localStorage.removeItem('packageBookings');
                // Add any other booking related keys here if needed

                alert('All bookings have been reset.');
                location.reload();
            } else {
                console.log('User cancelled reset');
            }
        });
    }
});
  // Hero slider carousel
  const heroSlider = document.querySelector('.hero-slider');
  const heroSlides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.hero-prev');
  const nextBtn = document.querySelector('.hero-next');

  if (heroSlider && heroSlides.length > 0 && prevBtn && nextBtn) {
    let currentIndex = 0;
    const totalSlides = heroSlides.length;
    const slideDuration = 4000; // 4 seconds
    let slideInterval;

    // Set hero-slider width dynamically
    heroSlider.style.width = `${totalSlides * 100}%`;

    // Set each slide width dynamically
    heroSlides.forEach(slide => {
      slide.style.width = `${100 / totalSlides}%`;
    });

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      const translateXPercent = -(currentIndex * (100 / totalSlides));
      heroSlider.style.transform = `translateX(${translateXPercent}%)`;
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoSlide() {
      slideInterval = setInterval(nextSlide, slideDuration);
    }

    function stopAutoSlide() {
      clearInterval(slideInterval);
    }

    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    });

    // Initialize slider
    goToSlide(0);
    startAutoSlide();
  }
