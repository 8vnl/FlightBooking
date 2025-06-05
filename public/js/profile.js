document.addEventListener('DOMContentLoaded', function() {
    const bookingsContainer = document.getElementById('bookingsContainer');
    const filterSelect = document.getElementById('bookingFilter');
    const refreshButton = document.getElementById('refreshBookings');

    async function loadBookings() {
        // Fetch logged-in user info
        let username = null;
        try {
            const response = await fetch('/api/me', { credentials: 'include', cache: 'no-store' });
            if (response.ok) {
                const user = await response.json();
                username = user.username;
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }

        const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
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
            return;
        }

        bookingsContainer.innerHTML = filteredBookings.map(booking => `
            <div class="booking-card">
                <div class="booking-header">
                    <h3>${booking.flight.airline} ${booking.flight.flightNumber}</h3>
                    <span class="booking-status">${booking.status || 'Confirmed'}</span>
                </div>
                <div class="booking-details">
                    <p><strong>From:</strong> ${booking.flight.departure}</p>
                    <p><strong>To:</strong> ${booking.flight.destination}</p>
                    <p><strong>Date:</strong> ${new Date(booking.flight.departureDate).toLocaleDateString()}</p>
                    <p><strong>Passenger:</strong> ${booking.passengerName}</p>
                </div>
                <div class="booking-actions">
                    <button class="btn btn-secondary" onclick="location.href='/receipt.html?booking=${booking.id}'">
                        View Details
                    </button>
                </div>
            </div>
        `).join('');
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
