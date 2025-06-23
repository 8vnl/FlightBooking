document.addEventListener('DOMContentLoaded', function() {
  // Import flight and hotel data
  Promise.all([
    import('./flightsData.js'),
    import('../hotelsData.js')
  ]).then(([flightsModule, hotelsModule]) => {
    const predefinedFlights = flightsModule.default;
    const predefinedHotels = hotelsModule.default;
    
    const packageSearchForm = document.getElementById('packageSearchForm');
    const packageResultsContainer = document.getElementById('packageResultsContainer');
    const toggleSearchBtn = document.getElementById('toggleSearchForm');
    const searchFormContainer = document.getElementById('searchFormContainer');
    
    // Toggle search form visibility
    toggleSearchBtn.addEventListener('click', function() {
      const isHidden = searchFormContainer.style.display === 'none';
      searchFormContainer.style.display = isHidden ? 'block' : 'none';
      this.innerHTML = isHidden 
        ? '<i class="fas fa-times"></i> Close Search' 
        : '<i class="fas fa-search"></i> Modify Search';
    });
    
    // Handle package search form submission
    packageSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const searchParams = {
        departure: formData.get('departure'),
        destination: formData.get('destination'),
        departureDate: formData.get('departureDate'),
        returnDate: formData.get('returnDate'),
        guests: formData.get('guests'),
        rooms: formData.get('rooms')
      };
      
      // Update header info
      document.getElementById('packageRoute').textContent = 
        `${searchParams.departure} → ${searchParams.destination}`;
      
      const departureDate = new Date(searchParams.departureDate);
      const options = { weekday: 'short', day: 'numeric', month: 'short' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(departureDate);
      document.getElementById('packageDate').innerHTML = 
        `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
      
      document.getElementById('packageGuests').innerHTML = 
        `<i class="fas fa-user"></i> ${searchParams.guests} Guest${searchParams.guests > 1 ? 's' : ''}`;
      
      // Search for matching flights and hotels
      searchPackages(searchParams);
    });
    
    function searchPackages(searchParams) {
      packageResultsContainer.innerHTML = '<div class="loading-message"><p>Searching for packages...</p></div>';
      
      // Filter flights
      const matchingFlights = predefinedFlights.filter(flight => {
        return flight.departure_airport === searchParams.departure && 
               flight.arrival_airport === searchParams.destination;
      });
      
      // Filter hotels
      const matchingHotels = predefinedHotels.filter(hotel => {
        return hotel.location === searchParams.destination;
      });
      
      if (matchingFlights.length === 0 || matchingHotels.length === 0) {
        packageResultsContainer.innerHTML = '<div class="no-results"><p>No package deals available for your selected criteria.</p></div>';
        return;
      }
      
      // Generate package combinations
      generatePackageCombinations(matchingFlights, matchingHotels, searchParams);
    }
    
    function generatePackageCombinations(flights, hotels, searchParams) {
      // Calculate duration in days
      const departureDate = new Date(searchParams.departureDate);
      const returnDate = new Date(searchParams.returnDate || 
        new Date(departureDate.getTime() + 7 * 24 * 60 * 60 * 1000)); // Default to 7 days if no return date
      
      const durationDays = Math.ceil((returnDate - departureDate) / (1000 * 60 * 60 * 24));
      
      // Generate all possible flight + hotel combinations
      const packages = [];
      
      flights.forEach(flight => {
        hotels.forEach(hotel => {
          // Calculate total price
          const flightPrice = flight.price * searchParams.guests;
          const hotelPrice = hotel.room_types[0].price * durationDays * searchParams.rooms;
          const totalPrice = flightPrice + hotelPrice;
          
          // Apply package discount (10% off)
          const discountedPrice = totalPrice * 0.9;
          
          packages.push({
            flight,
            hotel,
            durationDays,
            originalPrice: totalPrice,
            discountedPrice,
            guests: searchParams.guests,
            rooms: searchParams.rooms
          });
        });
      });
      
      // Sort by price (low to high)
      packages.sort((a, b) => a.discountedPrice - b.discountedPrice);
      
      // Display packages
      displayPackages(packages, searchParams);
    }
    
    function displayPackages(packages, searchParams) {
      packageResultsContainer.innerHTML = '';
      
      if (packages.length === 0) {
        packageResultsContainer.innerHTML = '<div class="no-results"><p>No package deals available for your selected criteria.</p></div>';
        return;
      }
      
      packages.forEach(pkg => {
        const packageCard = document.createElement('div');
        packageCard.className = 'package-card';
        
        packageCard.innerHTML = `
          <div class="package-header">
            <h3>${pkg.hotel.name} Package</h3>
            <div class="package-price">
              <span class="original-price">MYR ${pkg.originalPrice.toFixed(2)}</span>
              <span class="discounted-price">MYR ${pkg.discountedPrice.toFixed(2)}</span>
              <span class="save-badge">Save 10%</span>
            </div>
          </div>
          
          <div class="package-details">
            <div class="flight-details">
              <h4>Flight Details</h4>
              <p><strong>${pkg.flight.airline} ${pkg.flight.flight_number}</strong></p>
              <p>${pkg.flight.departure_airport} → ${pkg.flight.arrival_airport}</p>
              <p>Departure: ${searchParams.departureDate}</p>
              ${searchParams.returnDate ? `<p>Return: ${searchParams.returnDate}</p>` : ''}
            </div>
            
            <div class="hotel-details">
              <h4>Hotel Details</h4>
              <p><strong>${pkg.hotel.name}</strong></p>
              <p>Location: ${pkg.hotel.location}</p>
              <p>Room Type: ${pkg.hotel.room_types[0].type}</p>
              <p>Duration: ${pkg.durationDays} nights</p>
              <p>Amenities: ${pkg.hotel.amenities.join(', ')}</p>
            </div>
          </div>
          
          <div class="package-summary">
            <p><strong>Total for ${pkg.guests} guest${pkg.guests > 1 ? 's' : ''} & ${pkg.rooms} room${pkg.rooms > 1 ? 's' : ''}:</strong> 
              <span class="total-price">MYR ${pkg.discountedPrice.toFixed(2)}</span>
            </p>
          </div>
          
          <button class="select-package-btn btn-primary">Select Package</button>
        `;
        
        packageResultsContainer.appendChild(packageCard);
        
        // Add event listener to select package
        const selectBtn = packageCard.querySelector('.select-package-btn');
        selectBtn.addEventListener('click', () => {
          selectPackage(pkg, searchParams);
        });
      });
    }
    
    function selectPackage(pkg, searchParams) {
      // Store package details in localStorage
      const packageData = {
        flight: {
          flightNumber: pkg.flight.flight_number,
          airline: pkg.flight.airline,
          departure: pkg.flight.departure_airport,
          destination: pkg.flight.arrival_airport,
          departureDate: searchParams.departureDate,
          returnDate: searchParams.returnDate,
          price: pkg.flight.price
        },
        hotel: {
          id: pkg.hotel.hotel_id,
          name: pkg.hotel.name,
          location: pkg.hotel.location,
          roomType: pkg.hotel.room_types[0].type,
          price: pkg.hotel.room_types[0].price,
          duration: pkg.durationDays,
          checkin_time: pkg.hotel.checkin_time,
          checkout_time: pkg.hotel.checkout_time
        },
        guests: searchParams.guests,
        rooms: searchParams.rooms,
        totalPrice: pkg.discountedPrice
      };
      
      localStorage.setItem('selectedPackage', JSON.stringify(packageData));
      
      // Redirect to package booking page
      window.location.href = '/package-booking.html';
    }
  });
});