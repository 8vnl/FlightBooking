document.addEventListener('DOMContentLoaded', function () {
  const hotelsContainer = document.getElementById('hotelsContainer');
  const hotelInfoDiv = document.getElementById('hotelInfo');
  const bookingForm = document.getElementById('hotelBookingForm');

  // Fetch predefined hotels data
  import('/hotelsData.js').then(module => {
    const predefinedHotels = module.default;

    // Function to fetch and display hotels with optional filters
    function fetchHotels(filters = {}) {
      let filteredHotels = predefinedHotels;

      if (filters.location) {
        filteredHotels = filteredHotels.filter(hotel => hotel.location === filters.location);
      }

      if (hotelsContainer) {
        if (filteredHotels.length === 0) {
          hotelsContainer.innerHTML = '<p>No hotels available.</p>';
          return;
        }
        hotelsContainer.innerHTML = ''; // Clear previous hotels

        filteredHotels.forEach(hotel => {
          const hotelCard = document.createElement('div');
          hotelCard.className = 'hotel-card';

          hotelCard.innerHTML = `
            <div class="hotel-card-left">
              <h3>${hotel.name}</h3>
              <p>Location: ${hotel.location}</p>
              <p>Amenities: ${hotel.amenities.join(', ')}</p>
            </div>
            <div class="hotel-card-right">
              <p>Room Types:</p>
              <ul>
                ${hotel.room_types.map(room => `<li>${room.type} - MYR ${room.price.toFixed(2)} (${room.available_rooms} rooms available)</li>`).join('')}
              </ul>
            </div>
            <button class="select-hotel-btn">Select</button>
          `;

          hotelsContainer.appendChild(hotelCard);

          const selectBtn = hotelCard.querySelector('.select-hotel-btn');
          selectBtn.addEventListener('click', () => {
            // Select the first room type by default for simplicity
            const selectedRoom = hotel.room_types[0];
            const selectedHotel = {
              hotel_id: hotel.hotel_id,
              name: hotel.name,
              location: hotel.location,
              roomType: selectedRoom.type,
              price: selectedRoom.price,
              checkin_time: hotel.checkin_time,
              checkout_time: hotel.checkout_time
            };
            localStorage.setItem('selectedHotel', JSON.stringify(selectedHotel));
            const params = new URLSearchParams(selectedHotel);
            window.location.href = `/hotel_booking.html?${params.toString()}`;
          });
        });
      }
    }

    // On hotels.html, read search parameters from URL query and fetch hotels
    if (hotelsContainer) {
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get('location') || '';
      const checkinDate = urlParams.get('checkinDate') || '';
      const checkoutDate = urlParams.get('checkoutDate') || '';
      const guests = urlParams.get('guests') || '1';

      // Update header spans dynamically
      const locationCitySpan = document.querySelector('.location-city');
      if (locationCitySpan && location) {
        locationCitySpan.textContent = location;
      }

      if (location && checkinDate && checkoutDate) {
        fetchHotels({ location });
      } else {
        hotelsContainer.innerHTML = '<p>Missing search parameters. Please search from the home page.</p>';
      }
    }

    // Display selected hotel info on hotel_booking.html
    if (hotelInfoDiv) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('hotel_id') && urlParams.has('name') && urlParams.has('roomType')) {
        const selectedHotel = {
          hotel_id: urlParams.get('hotel_id'),
          name: urlParams.get('name'),
          location: urlParams.get('location'),
          roomType: urlParams.get('roomType'),
          price: parseFloat(urlParams.get('price')) || 0,
          checkin_time: urlParams.get('checkin_time') || '',
          checkout_time: urlParams.get('checkout_time') || ''
        };
        hotelInfoDiv.innerHTML = `
          <p><strong>Hotel Name:</strong> ${selectedHotel.name}</p>
          <p><strong>Location:</strong> ${selectedHotel.location}</p>
          <p><strong>Room Type:</strong> ${selectedHotel.roomType}</p>
          <p><strong>Price per Night:</strong> MYR ${selectedHotel.price.toFixed(2)}</p>
        `;
        localStorage.setItem('selectedHotel', JSON.stringify(selectedHotel));

        // Update header spans dynamically
        const locationCitySpan = document.getElementById('locationCity');
        if (locationCitySpan) {
          locationCitySpan.textContent = selectedHotel.location;
        }
        const checkinDateSpan = document.getElementById('checkinDateDisplay');
        if (checkinDateSpan) {
          const checkinDate = new Date();
          checkinDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> Check-in Date`;
        }
        const guestsCountSpan = document.getElementById('guestsCount');
        if (guestsCountSpan) {
          guestsCountSpan.innerHTML = `<i class="fas fa-user"></i> 1 Guest`;
        }
      } else {
        hotelInfoDiv.innerHTML = '<p>No hotel selected. Please select a hotel first.</p>';
      }
    }

    // Multi-step booking form logic
    if (bookingForm) {
      let currentStep = 1;
      const totalSteps = 4;
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const submitBtn = document.getElementById('submitBooking');

      // Addon prices
      const addonPrices = {
        roomPreferences: {
          'Non-smoking': 0,
          'High Floor': 10,
          'Late Check-out': 20
        },
        extraBed: {
          0: 0,
          1: 50
        },
        airportPickup: 30
      };

      // Update price breakdown UI
      function updatePriceBreakdown() {
        const roomPriceDisplay = document.getElementById('roomPriceDisplay');
        const roomPreferencesPriceDisplay = document.getElementById('roomPreferencesPriceDisplay');
        const extraBedPriceDisplay = document.getElementById('extraBedPriceDisplay');
        const airportPickupPriceDisplay = document.getElementById('airportPickupPriceDisplay');
        const totalPriceDisplay = document.getElementById('totalPriceDisplay');

        // Get base room price from selected hotel info
        let roomPrice = 0;
        const storedHotel = localStorage.getItem('selectedHotel');
        if (storedHotel) {
          const hotel = JSON.parse(storedHotel);
          if (hotel.price) {
            roomPrice = hotel.price;
          }
        }

        // Get selected addon prices
        const roomPreferences = document.getElementById('roomPreferences').value;
        const extraBed = document.getElementById('extraBed').value;
        const airportPickupChecked = document.getElementById('airportPickup').checked;

        const roomPreferencesPrice = addonPrices.roomPreferences[roomPreferences] || 0;
        const extraBedPrice = addonPrices.extraBed[extraBed] || 0;
        const airportPickupPrice = airportPickupChecked ? addonPrices.airportPickup : 0;

        const totalPrice = roomPrice + roomPreferencesPrice + extraBedPrice + airportPickupPrice;

        roomPriceDisplay.textContent = `MYR ${roomPrice.toFixed(2)}`;
        roomPreferencesPriceDisplay.textContent = `MYR ${roomPreferencesPrice.toFixed(2)}`;
        extraBedPriceDisplay.textContent = `MYR ${extraBedPrice.toFixed(2)}`;
        airportPickupPriceDisplay.textContent = `MYR ${airportPickupPrice.toFixed(2)}`;
        totalPriceDisplay.textContent = `MYR ${totalPrice.toFixed(2)}`;
      }

      // Attach event listeners to addon inputs to update price breakdown dynamically
      function attachAddonListeners() {
        const roomPreferences = document.getElementById('roomPreferences');
        const extraBed = document.getElementById('extraBed');
        const airportPickup = document.getElementById('airportPickup');

        roomPreferences.addEventListener('change', updatePriceBreakdown);
        extraBed.addEventListener('change', updatePriceBreakdown);
        airportPickup.addEventListener('change', updatePriceBreakdown);
      }

      function showStep(step) {
        for (let i = 1; i <= totalSteps; i++) {
          const stepDiv = document.getElementById('step' + i);
          if (step === i) {
            stepDiv.style.display = 'block';
          } else {
            stepDiv.style.display = 'none';
          }
        }
        prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
        nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
        submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';

        // Update active step button in progression bar booking steps
        const headerSteps = document.querySelectorAll('.progression-bar-container .booking-steps .step');
        headerSteps.forEach((btn, index) => {
          if (index === step - 1) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }

      function validateStep(step) {
        const stepDiv = document.getElementById('step' + step);
        const inputs = stepDiv.querySelectorAll('input, select, textarea');
        for (const input of inputs) {
          if (!input.checkValidity()) {
            input.reportValidity();
            return false;
          }
        }
        return true;
      }

      prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
          currentStep--;
          showStep(currentStep);
        }
      });

      nextBtn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          if (currentStep < totalSteps) {
            currentStep++;
            showStep(currentStep);
          }
        }
      });

      bookingForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        if (!validateStep(currentStep)) {
          return;
        }

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

        // Collect all form data
        const bookingId = Date.now();
        const selectedHotel = JSON.parse(localStorage.getItem('selectedHotel'));
        let totalPrice = 0;
        if (selectedHotel) {
          totalPrice = selectedHotel.price;
        }

        // Calculate addon prices
        const roomPreferences = document.getElementById('roomPreferences').value;
        const extraBed = document.getElementById('extraBed').value;
        const airportPickupChecked = document.getElementById('airportPickup').checked;

        const addonPrices = {
          roomPreferences: {
            'Non-smoking': 0,
            'High Floor': 10,
            'Late Check-out': 20
          },
          extraBed: {
            0: 0,
            1: 50
          },
          airportPickup: 30
        };

        const roomPreferencesPrice = addonPrices.roomPreferences[roomPreferences] || 0;
        const extraBedPrice = addonPrices.extraBed[extraBed] || 0;
        const airportPickupPrice = airportPickupChecked ? addonPrices.airportPickup : 0;

        const totalAddonPrice = roomPreferencesPrice + extraBedPrice + airportPickupPrice;
        totalPrice += totalAddonPrice;

        const bookingData = {
          id: bookingId,
          guestName: document.getElementById('guestName').value,
          guestEmail: document.getElementById('guestEmail').value,
          guestPhone: document.getElementById('guestPhone').value,
          guestAddress: document.getElementById('guestAddress').value,
          guestCity: document.getElementById('guestCity').value,
          guestCountry: document.getElementById('guestCountry').value,
          additionalServices: {
            roomPreferences: roomPreferences,
            extraBed: extraBed,
            airportPickup: airportPickupChecked,
            specialRequests: document.getElementById('specialRequests').value
          },
          payment: {
            cardName: document.getElementById('cardName').value,
            cardNumber: document.getElementById('cardNumber').value,
            expiryDate: document.getElementById('expiryDate').value,
            cvv: document.getElementById('cvv').value
          },
          hotel: selectedHotel,
          totalPrice: totalPrice,
          username: username // Add username to booking data
        };

        // Store booking in bookings array in localStorage
        let bookings = JSON.parse(localStorage.getItem('hotelBookings') || '[]');
        bookings.push(bookingData);
        localStorage.setItem('hotelBookings', JSON.stringify(bookings));
        localStorage.setItem('hotelBookingData', JSON.stringify(bookingData));

        // Redirect to receipt page after successful booking
        window.location.href = `/receipt.html?booking=${bookingId}`;
      });

      showStep(currentStep);
      attachAddonListeners();
      updatePriceBreakdown();
    }
  });
});
