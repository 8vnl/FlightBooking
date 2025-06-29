
document.addEventListener('DOMContentLoaded', function() {
    const bookingsContainer = document.getElementById('bookingsContainer');
    const hotelBookingsContainer = document.getElementById('hotelBookingsContainer');
    const filterSelect = document.getElementById('bookingFilter');
    const refreshButton = document.getElementById('refreshBookings');
    const authButtonsDiv = document.getElementById('authButtonsContainer');

    const airlineLogos = {
        "Malaysia Airlines": "/images/airlines/MH.jpg",
        "AirAsia": "/images/airlines/AK.jpg",
        "Singapore Airlines": "/images/airlines/SQ.jpg",
        "Philippine Airlines": "/images/airlines/PR.jpg",
        "Thai Airways": "/images/airlines/TG.jpg",
        "Garuda Indonesia": "/images/airlines/GA.jpg",
        "Vietnam Airlines": "/images/airlines/VN.jpg",
        "AirAsia Philippines": "/images/airlines/AK.jpg",
        "Charter Airlines": "/images/airlines/TG.jpg",
    };

    async function loadBookings() {
        // Fetch logged-in user info
        let username = null;
        try {
            const response = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
            if (response.ok) {
                const user = await response.json();
                username = user.username;
                updateAuthButtons(user.username);
            } else {
                updateAuthButtons(null);
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            updateAuthButtons(null);
        }

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        const hotelBookings = JSON.parse(localStorage.getItem('hotelBookings')) || [];
        const filterValue = filterSelect ? filterSelect.value : 'all';

        // Filter bookings by logged-in username
        let userBookings = bookings;
        if (username) {
            userBookings = bookings.filter(b => b.username === username);
        } else {
            // If no user logged in, show no bookings
            userBookings = [];
        }

        let filteredBookings = userBookings;
        if (filterValue === 'upcoming') {
            filteredBookings = userBookings.filter(b => 
                new Date(b.flight.departureDate) > new Date()
            );
        } else if (filterValue === 'past') {
            filteredBookings = userBookings.filter(b => 
                new Date(b.flight.departureDate) <= new Date()
            );
        }

        if (!bookingsContainer) return;

        if (filteredBookings.length === 0) {
            bookingsContainer.innerHTML = '<p>No bookings found.</p>';
        } else {
            bookingsContainer.innerHTML = filteredBookings.map(booking => {
                const logoSrc = airlineLogos[booking.flight.airline] || '';
                return `
                <div class="booking-card">
                <div class="booking-header">
                    <h3>
                      ${logoSrc ? `<img class="airline-logo" src="${logoSrc}" alt="${booking.flight.airline} logo" />` : ''}
                      ${booking.flight.airline} ${booking.flight.flightNumber}
                    </h3>
                    <span class="booking-status">${booking.status || 'Confirmed'}</span>
                </div>
                    <div class="booking-details">
                        <p><strong>From:</strong> ${booking.flight.departure}</p>
                        <p><strong>To:</strong> ${booking.flight.destination}</p>
                        <p><strong>Date:</strong> ${new Date(booking.flight.departureDate).toLocaleDateString()}</p>
<p><strong>Passenger:</strong> ${
    booking.passengers && booking.passengers.length > 0
        ? booking.passengers[0].firstName + ' ' + booking.passengers[0].lastName
        : 'Unknown'
}</p>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-secondary" onclick="location.href='/receipt.html?booking=${booking.id}'">
                            View Details
                        </button>
                    </div>
                </div>
            `}).join('');
        }

        // Filter hotel bookings by logged-in username
        let userHotelBookings = hotelBookings;
        if (username) {
            userHotelBookings = hotelBookings.filter(b => b.username === username);
        } else {
            userHotelBookings = [];
        }

        if (!hotelBookingsContainer) return;

        if (userHotelBookings.length === 0) {
            hotelBookingsContainer.innerHTML = '<p>No hotel bookings found.</p>';
        } else {
            hotelBookingsContainer.innerHTML = userHotelBookings.map(booking => `
                <div class="booking-card">
                    <div class="booking-header">
                        <h3>${booking.hotel.name}</h3>
                        <span class="booking-status">Confirmed</span>
                    </div>
                    <div class="booking-details">
                        <p><strong>Location:</strong> ${booking.hotel.location}</p>
                        <p><strong>Room Type:</strong> ${booking.hotel.roomType}</p>
                        <p><strong>Check-in:</strong> ${booking.hotel.checkin_time}</p>
                        <p><strong>Check-out:</strong> ${booking.hotel.checkout_time}</p>
                        <p><strong>Total Price:</strong> MYR ${booking.totalPrice.toFixed(2)}</p>
                    </div>
                    <div class="booking-actions">
                        <button class="btn btn-secondary" onclick="location.href='/hotel_receipt.html?booking=${booking.id}'">
                            View Details
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    function updateAuthButtons(username) {
        if (!authButtonsDiv) return;
        if (username) {
            authButtonsDiv.innerHTML = `
                <span><i class="fas fa-user"></i> Welcome <strong>${username}</strong></span>
                <button id="logoutBtn" class="btn btn-secondary">Logout</button>
            `;
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
        } else {
            authButtonsDiv.innerHTML = `
                <a href="login.html" class="btn-primary" style="text-decoration: none; font-weight: 500;">Login</a>
                <a href="register.html" class="btn-primary" style="text-decoration: none; font-weight: 500;">Register</a>
            `;
        }
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', loadBookings);
    }
    if (refreshButton) {
        refreshButton.addEventListener('click', loadBookings);
    }
    
    // Initial load
    loadBookings();
});
