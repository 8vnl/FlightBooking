document.addEventListener('DOMContentLoaded', function() {
  const packageInfoDiv = document.getElementById('packageInfo');
  const guestDetailsContainer = document.getElementById('guestDetailsContainer');
  const bookingForm = document.getElementById('packageBookingForm');
  
  // Load selected package from localStorage
  const selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));
  
  if (!selectedPackage) {
    window.location.href = '/package.html';
    return;
  }
  
  // Display package details
  function displayPackageDetails() {
    const departureDate = new Date(selectedPackage.flight.departureDate);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    
    packageInfoDiv.innerHTML = `
      <div class="package-flight-details">
        <h3>Flight</h3>
        <p><strong>${selectedPackage.flight.airline} ${selectedPackage.flight.flightNumber}</strong></p>
        <p>From: ${selectedPackage.flight.departure}</p>
        <p>To: ${selectedPackage.flight.destination}</p>
        <p>Departure: ${departureDate.toLocaleDateString('en-US', options)}</p>
        ${selectedPackage.flight.returnDate ? 
          `<p>Return: ${new Date(selectedPackage.flight.returnDate).toLocaleDateString('en-US', options)}</p>` : ''}
      </div>
      
      <div class="package-hotel-details">
        <h3>Hotel</h3>
        <p><strong>${selectedPackage.hotel.name}</strong></p>
        <p>Location: ${selectedPackage.hotel.location}</p>
        <p>Room Type: ${selectedPackage.hotel.roomType}</p>
        <p>Duration: ${selectedPackage.hotel.duration} nights</p>
        <p>Check-in: ${selectedPackage.hotel.checkin_time}</p>
        <p>Check-out: ${selectedPackage.hotel.checkout_time}</p>
      </div>
      
      <div class="package-price-summary">
        <p><strong>Total for ${selectedPackage.guests} guest${selectedPackage.guests > 1 ? 's' : ''} & ${selectedPackage.rooms} room${selectedPackage.rooms > 1 ? 's' : ''}:</strong> 
          <span>MYR ${selectedPackage.totalPrice.toFixed(2)}</span>
        </p>
      </div>
    `;
    
    // Update price breakdown
    const flightPrice = selectedPackage.flight.price * selectedPackage.guests;
    const hotelPrice = selectedPackage.hotel.price * selectedPackage.hotel.duration * selectedPackage.rooms;
    const discount = (flightPrice + hotelPrice) - selectedPackage.totalPrice;
    
    document.getElementById('flightPriceDisplay').textContent = `MYR ${flightPrice.toFixed(2)}`;
    document.getElementById('hotelPriceDisplay').textContent = `MYR ${hotelPrice.toFixed(2)}`;
    document.getElementById('discountDisplay').textContent = `-MYR ${discount.toFixed(2)}`;
    document.getElementById('totalPriceDisplay').textContent = `MYR ${selectedPackage.totalPrice.toFixed(2)}`;
    
    // Update header info
    document.getElementById('packageRoute').textContent = 
      `${selectedPackage.flight.departure} → ${selectedPackage.hotel.location}`;
    
    document.getElementById('packageDate').innerHTML = 
      `<i class="far fa-calendar-alt"></i> ${departureDate.toLocaleDateString('en-US', options)}`;
    
    document.getElementById('packageGuests').innerHTML = 
      `<i class="fas fa-user"></i> ${selectedPackage.guests} Guest${selectedPackage.guests > 1 ? 's' : ''}`;
  }
  
  // Generate guest detail forms
  function generateGuestForms() {
    guestDetailsContainer.innerHTML = '';
    
    for (let i = 1; i <= selectedPackage.guests; i++) {
      const guestForm = document.createElement('div');
      guestForm.className = 'guest-form';
      
      guestForm.innerHTML = `
        <h4>Guest ${i}</h4>
        <div class="form-grid">
          <div class="form-group">
            <label for="guestTitle${i}">Title</label>
            <select id="guestTitle${i}" required>
              <option value="">Select</option>
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Miss">Miss</option>
              <option value="Dr">Dr</option>
            </select>
          </div>
          <div class="form-group">
            <label for="guestFirstName${i}">First Name</label>
            <input type="text" id="guestFirstName${i}" required />
          </div>
          <div class="form-group">
            <label for="guestLastName${i}">Last Name</label>
            <input type="text" id="guestLastName${i}" required />
          </div>
          <div class="form-group">
            <label for="guestPassport${i}">Passport Number</label>
            <input type="text" id="guestPassport${i}" required />
          </div>
          <div class="form-group">
            <label for="guestNationality${i}">Nationality</label>
            <input type="text" id="guestNationality${i}" required />
          </div>
          <div class="form-group">
            <label for="guestDOB${i}">Date of Birth</label>
            <input type="date" id="guestDOB${i}" required />
          </div>
        </div>
      `;
      
      guestDetailsContainer.appendChild(guestForm);
    }
  }
  
  // Multi-step form logic
  if (bookingForm) {
    let currentStep = 1;
    const totalSteps = 3;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBooking');
    
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
      const inputs = stepDiv.querySelectorAll('input[required], select[required], textarea[required]');
      
      let isValid = true;
      for (const input of inputs) {
        if (!input.checkValidity()) {
          input.reportValidity();
          isValid = false;
          // Scroll to the first invalid input
          if (isValid) {
            input.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
      }
      return isValid;
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
    
    bookingForm.addEventListener('submit', async function(e) {
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
      
      // Collect guest details
      const guests = [];
      for (let i = 1; i <= selectedPackage.guests; i++) {
        guests.push({
          title: document.getElementById(`guestTitle${i}`).value,
          firstName: document.getElementById(`guestFirstName${i}`).value,
          lastName: document.getElementById(`guestLastName${i}`).value,
          passportNumber: document.getElementById(`guestPassport${i}`).value,
          nationality: document.getElementById(`guestNationality${i}`).value,
          dateOfBirth: document.getElementById(`guestDOB${i}`).value
        });
      }
      
      const bookingData = {
        id: bookingId,
        type: 'package',
        guests: guests,
        contactInfo: {
          email: document.getElementById('guestEmail').value,
          phone: document.getElementById('guestPhone').value,
          address: document.getElementById('guestAddress').value
        },
        payment: {
          cardName: document.getElementById('cardName').value,
          cardNumber: document.getElementById('cardNumber').value,
          expiryDate: document.getElementById('expiryDate').value,
          cvv: document.getElementById('cvv').value
        },
        package: selectedPackage,
        username: username
      };
      
      // Store booking in bookings array in localStorage
      let bookings = JSON.parse(localStorage.getItem('bookings') || []);
      bookings.push(bookingData);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      
      // Redirect to receipt page after successful booking
      window.location.href = `/receipt.html?booking=${bookingId}`;
    });
    
    showStep(currentStep);
  }
  
  // Initialize page
  displayPackageDetails();
  generateGuestForms();
});