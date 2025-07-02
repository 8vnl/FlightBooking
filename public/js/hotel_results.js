document.addEventListener('DOMContentLoaded', function () {
  const hotelsContainer = document.getElementById('hotelsContainer');

  import('../hotelsData.js').then(module => {
    const predefinedHotels = module.default;

    function fetchHotels(filters = {}) {
      let filteredHotels = predefinedHotels;

      if (filters.location) {
        filteredHotels = filteredHotels.filter(hotel => hotel.location === filters.location);
      }

      if (hotelsContainer) {
        hotelsContainer.innerHTML = '<div class="loader"></div>'; // Show loader immediately

        const startTime = Date.now();
        const MIN_DELAY = 1500;

        setTimeout(() => {
          if (filteredHotels.length === 0) {
            hotelsContainer.innerHTML = '<p>No hotels available.</p>';
            return;
          }
          hotelsContainer.innerHTML = ''; // Clear loader

          filteredHotels.forEach(hotel => {
            const hotelCard = document.createElement('div');
            hotelCard.className = 'hotel-card';

            // Create left, center, right sections similar to flight cards
            hotelCard.innerHTML = `
              <div class="hotel-card-left">
                <h3 class="hotel-name">${hotel.name}</h3>
                <p class="hotel-location">
                  <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  ${hotel.location}
                </p>
                <div class="hotel-timings">
                  <span class="check-in-out">Check-in: ${hotel.checkin_time}</span>
                  <span class="check-in-out">Check-out: ${hotel.checkout_time}</span>
                </div>
                <div class="hotel-amenities">
                  ${hotel.amenities.map(amenity => `
                    <span class="amenity-badge">${amenity}</span>
                  `).join('')}
                </div>
              </div>
              <div class="hotel-card-center">
                <p class="room-types-title">Available Rooms</p>
                <div class="room-types-cards">
                  ${hotel.room_types.map((room, index) => `
                    <div class="room-type-card ${room.type.toLowerCase().replace(/\\s+/g, '-')}-room${index === 0 ? ' selected' : ''}" data-room-index="${index}">
                      <div class="room-type-name">${room.type}</div>
                      <div class="room-type-price">MYR ${room.price.toFixed(2)}</div>
                      <div class="room-type-availability">${room.available_rooms} rooms left</div>
                      <div class="room-type-select">Select</div>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="hotel-card-right">
                <button class="select-hotel-btn">Book Now</button>
              </div>
            `;
            hotelCard.classList.add('fade-in');

            hotelsContainer.appendChild(hotelCard);

            // Room type card selection logic
            const roomTypeCards = hotelCard.querySelectorAll('.room-type-card');

            roomTypeCards.forEach(card => {
              card.addEventListener('click', () => {
                // Remove selected class from all cards
                roomTypeCards.forEach(c => c.classList.remove('selected'));
                // Add selected class to clicked card
                card.classList.add('selected');
                // Get selected room index
                const selectedRoomIndex = parseInt(card.getAttribute('data-room-index'));
                const selectedRoom = hotel.room_types[selectedRoomIndex];
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
                const urlParams = new URLSearchParams(window.location.search);
                const guests = urlParams.get('guests') || '1';
                const checkinDate = urlParams.get('checkinDate') || '';
                const checkoutDate = urlParams.get('checkoutDate') || '';
                const params = new URLSearchParams(selectedHotel);
                params.set('guests', guests); // Add guests param
                params.set('checkinDate', checkinDate); // Add checkinDate param
                params.set('checkoutDate', checkoutDate); // Add checkoutDate param
                window.location.href = `/hotel_booking.html?${params.toString()}`;
              });
            });
          });
        }, MIN_DELAY);
      }
    }

    // On hotel_results.html, read search parameters from URL query and fetch hotels
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
  });
});
