import predefinedPackages from './predefinedPackages.js';

document.addEventListener('DOMContentLoaded', function() {
  const packageCardsContainer = document.getElementById('packageCardsContainer');

  function displayPredefinedPackages() {
    packageCardsContainer.innerHTML = '';

    predefinedPackages.forEach(pkg => {
      const packageCard = document.createElement('div');
      packageCard.className = 'package-card';

      packageCard.innerHTML = `
        <div class="package-header">
          <h3>${pkg.name}</h3>
          <div class="package-price">
            <span>Flight: MYR ${pkg.flight.price.toFixed(2)}</span> + 
            <span>Hotel: MYR ${pkg.hotel.room_types[0].price.toFixed(2)}</span>
          </div>
        </div>

        <div class="package-details">
          <div class="flight-details">
            <h4>Flight Details</h4>
            <p><strong>${pkg.flight.airline} ${pkg.flight.flight_number}</strong></p>
            <p>${pkg.flight.departure_airport} → ${pkg.flight.arrival_airport}</p>
          </div>

          <div class="hotel-details">
            <h4>Hotel Details</h4>
            <p><strong>${pkg.hotel.name}</strong></p>
            <p>Location: ${pkg.hotel.location}</p>
            <p>Room Type: ${pkg.hotel.room_types[0].type}</p>
            <p>Amenities: ${pkg.hotel.amenities.join(', ')}</p>
          </div>
        </div>

        <button class="select-package-btn btn-primary">Select Package</button>
      `;

      packageCardsContainer.appendChild(packageCard);

      const selectBtn = packageCard.querySelector('.select-package-btn');
      selectBtn.addEventListener('click', () => {
        selectPackage(pkg);
      });
    });
  }

  function selectPackage(pkg) {
    localStorage.setItem('selectedPackage', JSON.stringify(pkg));
    window.location.href = '/package-booking.html';
  }

  displayPredefinedPackages();
});
