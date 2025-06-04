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
            const response = await fetch('/api/me');
            if (!response.ok) {
                // Not logged in or error
                return;
            }
            const user = await response.json();
            if (user && authButtonsDiv) {
                authButtonsDiv.innerHTML = `
                    <span>Logged in as <strong>${user.username}</strong></span>
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
            // Ignore errors
        }
    }
    updateAuthButtons();

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
});