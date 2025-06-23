document.addEventListener('DOMContentLoaded', function () {
  const hotelsContainer = document.getElementById('hotelsContainer');

  import('/hotelsData.js').then(module => {
    const predefinedHotels = module.default;

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

          // Create left, center, right sections similar to flight cards
          hotelCard.innerHTML = `
            <div class="hotel-card-left">
              <h3 class="hotel-name">${hotel.name}</h3>
              <p class="hotel-location">${hotel.location}</p>
              <p class="hotel-amenities">Amenities: ${hotel.amenities.join(', ')}</p>
            </div>
            <div class="hotel-card-center">
              <p class="room-types-title">Room Types & Prices:</p>
              <ul class="room-types-list">
                ${hotel.room_types.map(room => `<li>${room.type} - MYR ${room.price.toFixed(2)} (${room.available_rooms} rooms available)</li>`).join('')}
              </ul>
            </div>
            <div class="hotel-card-right">
              <button class="select-hotel-btn btn-primary">Select</button>
            </div>
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
