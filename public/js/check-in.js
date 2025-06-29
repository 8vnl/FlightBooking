document.addEventListener('DOMContentLoaded', async () => {
  const flightDetailsContent = document.getElementById('flightDetailsContent');
  const passengerSeatSelectionContainer = document.getElementById('passengerSeatSelectionContainer');
  const confirmCheckinBtn = document.getElementById('confirmCheckinBtn');

  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('booking');

  if (!bookingId) {
    flightDetailsContent.innerHTML = '<p>Booking ID is missing.</p>';
    return;
  }

  // Load booking data from localStorage or API
  let booking = null;
  try {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    booking = bookings.find(b => b.id === Number(bookingId));
    if (!booking) {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (response.ok) {
        booking = await response.json();
      } else {
        flightDetailsContent.innerHTML = '<p>Booking not found.</p>';
        return;
      }
    }
  } catch (error) {
    flightDetailsContent.innerHTML = '<p>Error loading booking data.</p>';
    console.error(error);
    return;
  }

  // Display flight info
  flightDetailsContent.innerHTML = `
    <p><strong>Airline:</strong> ${booking.flight.airline} ${booking.flight.flightNumber}</p>
    <p><strong>From:</strong> ${booking.flight.departure}</p>
    <p><strong>To:</strong> ${booking.flight.destination}</p>
    <p><strong>Departure Date:</strong> ${booking.flight.departureDate}</p>
    <p><strong>Fare Class:</strong> ${booking.flight.fareClass}</p>
    <p><strong>Passengers:</strong> ${booking.passengers.length}</p>
  `;

  // Simulate occupied seats (randomly or from booking data if available)
  // For demo, randomly mark some seats as occupied
  const occupiedSeats = new Set();
  const seatRows = 30;
  const seatCols = 6; // A-F
  const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  // Randomly occupy some seats
  for (let i = 0; i < 20; i++) {
    const row = Math.floor(Math.random() * seatRows) + 1;
    const col = seatLetters[Math.floor(Math.random() * seatCols)];
    occupiedSeats.add(col + row);
  }

  // Store selected seats per passenger
  const selectedSeats = new Array(booking.passengers.length).fill(null);

  // Create seat map UI for each passenger
  booking.passengers.forEach((passenger, index) => {
    const passengerDiv = document.createElement('div');
    passengerDiv.className = 'passenger-seat-selection';
    passengerDiv.innerHTML = '<h3>Passenger ' + (index + 1) + ': ' + passenger.title + ' ' + passenger.firstName + ' ' + passenger.lastName + '</h3>' +
      '<div class="seat-map" id="seatMap-' + index + '"></div>' +
      '<p>Selected Seat: <span id="selectedSeat-' + index + '">None</span></p>';
    passengerSeatSelectionContainer.appendChild(passengerDiv);

    const seatMapDiv = passengerDiv.querySelector('.seat-map');

    // Render seats
    for (let row = 1; row <= seatRows; row++) {
      for (let colIndex = 0; colIndex < seatCols; colIndex++) {
        const seatId = seatLetters[colIndex] + row;
        const seatDiv = document.createElement('div');
        seatDiv.className = 'seat';
        seatDiv.textContent = seatId;

        if (occupiedSeats.has(seatId)) {
          seatDiv.classList.add('occupied');
        }

        seatDiv.addEventListener('click', () => {
          if (seatDiv.classList.contains('occupied')) return;

          // Deselect previously selected seat for this passenger
          const prevSelectedSeat = selectedSeats[index];
          if (prevSelectedSeat) {
            const prevSeatDiv = seatMapDiv.querySelector('.seat.selected');
            if (prevSeatDiv) prevSeatDiv.classList.remove('selected');
          }

          // Check if seat is already selected by another passenger
          if (selectedSeats.includes(seatId)) {
            alert('This seat is already selected by another passenger.');
            return;
          }

          // Select this seat
          seatDiv.classList.add('selected');
          selectedSeats[index] = seatId;
          document.getElementById('selectedSeat-' + index).textContent = seatId;

          // Enable confirm button if all passengers have selected seats
          if (selectedSeats.every(seat => seat !== null)) {
            confirmCheckinBtn.disabled = false;
          } else {
            confirmCheckinBtn.disabled = true;
          }
        });

        seatMapDiv.appendChild(seatDiv);
      }
    }
  });

  confirmCheckinBtn.addEventListener('click', () => {
    // Save selected seats to booking data
    booking.passengers.forEach((passenger, index) => {
      passenger.seat = selectedSeats[index];
    });

    // Update bookings in localStorage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingIndex = bookings.findIndex(b => b.id === booking.id);
    if (bookingIndex !== -1) {
      bookings[bookingIndex] = booking;
    } else {
      bookings.push(booking);
    }
    localStorage.setItem('bookings', JSON.stringify(bookings));
    localStorage.setItem('bookingData', JSON.stringify(booking));

    // Redirect to boarding pass page with booking ID
    window.location.href = '/boarding-pass.html?booking=' + booking.id;
  });
});
