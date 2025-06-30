document.addEventListener('DOMContentLoaded', function () {
    const flightsContainer = document.getElementById('flightsContainer');
    const flightInfoDiv = document.getElementById('flightInfo');
    const bookingForm = document.getElementById('bookingForm');
    const passengerDetailsContainer = document.getElementById('passengerDetailsContainer');

    // Function to fetch and display flights with optional filters
    function fetchFlights(filters = {}) {
        const flightsContainer = document.getElementById('flightsContainer');
        flightsContainer.innerHTML = '<div class="loader"></div>'; // Show loader immediately

        let url = '/api/flights';
        const params = new URLSearchParams(filters);
        if ([...params].length > 0) {
            url += '?' + params.toString();
        }

        const startTime = Date.now();
        const MIN_DELAY = 1500; // Minimum time to show loader in ms

        fetch(url)
            .then(response => response.json())
            .then(flights => {
                const elapsed = Date.now() - startTime;
                const remainingDelay = Math.max(MIN_DELAY - elapsed, 0);

                setTimeout(() => {
                    flightsContainer.innerHTML = ''; // Clear loader

                    if (flights.length === 0) {
                        flightsContainer.innerHTML = '<p>No flights available.</p>';
                        return;
                    }

                    const airlineLogos = {
                        "Malaysia Airlines": "/images/airlines/MH.jpg",
                        "AirAsia": "/images/airlines/AK.jpg",
                        "Singapore Airlines": "/images/airlines/SQ.jpg",
                        "Philippine Airlines": "/images/airlines/PR.jpg",
                        "Thai Airways": "/images/airlines/TG.jpg",
                        "Garuda Indonesia": "/images/airlines/GA.jpg",
                        "Vietnam Airlines": "/images/airlines/VN.jpg",
                        "AirAsia Philippines": "/images/airlines/AK.jpg"
                    };

                    const urlParams = new URLSearchParams(window.location.search);
                    const tripType = urlParams.get('tripType') || 'one-way';

                    flights.forEach(flight => {
                        const flightCard = document.createElement('div');
                        flightCard.className = 'flight-card';
                        const departureTime = new Date(flight.departure_time);
                        const arrivalTime = new Date(flight.arrival_time);
                        const duration = calculateDuration(departureTime, arrivalTime);
                        const logoSrc = airlineLogos[flight.airline] || "/images/default-airline-logo.png";
                        const randomSeats = Math.floor(Math.random() * 10) + 1;
                        const economyPrice = tripType === 'roundtrip' ? flight.price * 1.5 : flight.price;
                        const businessPrice = tripType === 'roundtrip' ? (flight.price + 50) * 1.5 : (flight.price + 50);

                        flightCard.innerHTML = `
                            <!-- Flight Card HTML as before -->
                            <div class="flight-card-main" style="display:flex; flex-grow:1; gap:24px; align-items:center;">
                                <div class="flight-card-left" style="min-width:120px; display:flex; flex-direction:column; align-items:flex-start; gap:8px;">
                                    <div class="departure-time">${departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                    <div class="departure-airport">🛫 ${flight.departure_airport}</div>
                                    <div class="departure-airport" style="display:flex; align-items:center; gap:6px;">
                                        <img src="${logoSrc}" alt="${flight.airline}" style="width:28px; height:28px; border-radius:4px; object-fit:contain;" />
                                        <span>${flight.airline}</span>
                                    </div>
                                </div>
                                <div class="flight-card-center" style="display:flex; flex-direction:column; align-items:center; flex-grow:1; gap:10px; position:relative; padding:0 20px;">
                                    <div class="flight-duration" style="font-size:1.05rem; color:#718096; font-weight:600; margin-bottom:4px; background:#f8fafc; padding:6px 12px; border-radius:20px; display:flex; align-items:center; gap:8px;">
                                        ${duration} <span style="background:#22c55e; color:white; border-radius:12px; padding:2px 10px; font-size:0.8rem; font-weight:700; margin-left:12px;">Direct</span>
                                    </div>
                                    <div class="flight-path" style="display:flex; align-items:center; width:100%; max-width:240px; margin:8px 0;">
                                        <div class="flight-path-line" style="flex-grow:1; height:2px; background:linear-gradient(to right, #e2e8f0, #cbd5e0, #e2e8f0); position:relative;">
                                            <div style="position:absolute; width:8px; height:8px; background:#3498db; border-radius:50%; top:-3px; left:0;"></div>
                                            <div style="position:absolute; width:8px; height:8px; background:#3498db; border-radius:50%; top:-3px; right:0;"></div>
                                        </div>
                                    </div>
                                    <div class="flight-details-link"><a href="#" style="color:#3b82f6; text-decoration:none; font-weight:600; font-size:0.95rem; display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:6px;">Flight details →</a></div>
                                </div>
                                <div class="flight-card-right" style="display:flex; flex-direction:column; align-items:flex-end; min-width:180px; gap:12px;">
                                    <div class="arrival-time" style="font-size:1.8rem; font-weight:700; color:#2d3748; letter-spacing:-0.5px;">${arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                    <div class="arrival-airport" style="font-size:1.1rem; color:#4a5568; font-weight:600; display:flex; align-items:center; gap:6px;">${flight.arrival_airport}</div>
                                    <div class="flight-number" style="display:flex; align-items:center; margin-top:16px; font-weight:600; font-size:1rem; color:#4a5568; gap:10px; background:#f8fafc; padding:8px 12px; border-radius:8px;">
                                        <span>${flight.flight_number}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="fare-classes" style="display:flex; gap:20px; margin-left:40px; min-width:300px;">
                                <div class="fare-class economy-class" style="border-radius:12px; padding:18px 24px; min-width:140px; background-color:white; position:relative; cursor:pointer; transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); border:1px solid #e2e8f0; text-align:center; font-family:'Montserrat', sans-serif; font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.05); color:#1e40af; background:linear-gradient(135deg, #f5f9ff, #ffffff);">
                                    <div class="class-name" style="font-size:1.1rem; margin-bottom:10px; color:inherit; display:flex; align-items:center; justify-content:center; gap:6px;">
                                        <span style="display:inline-block; width:12px; height:12px; border-radius:2px; background:#3b82f6;"></span> Economy
                                    </div>
                                    <div class="price" style="font-size:1.4rem; font-weight:800; color:inherit; margin-bottom:4px;">MYR ${economyPrice.toFixed(2)}</div>
                                    <div class="price-subtext" style="font-size:0.75rem; color:#718096; font-weight:500;">per passenger</div>
                                </div>
                                <div class="fare-class business-class" style="border-radius:12px; padding:18px 24px; min-width:140px; background-color:white; position:relative; cursor:pointer; transition:all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); border:1px solid #e2e8f0; text-align:center; font-family:'Montserrat', sans-serif; font-weight:700; box-shadow:0 2px 8px rgba(0,0,0,0.05); color:#b45309; background:linear-gradient(135deg, #fffcf5, #ffffff);">
                                    ${randomSeats < 10 ? `<div class="seats-left-badge" style="position:absolute; top:-8px; right:-8px; background:linear-gradient(to right, #ef4444, #dc2626); color:white; font-size:0.7rem; font-weight:700; padding:6px 10px; border-radius:20px; white-space:nowrap; box-shadow:0 2px 8px rgba(239, 68, 68, 0.3); z-index:1;">${randomSeats} seats left</div>` : ''}
                                    <div class="class-name" style="font-size:1.1rem; margin-bottom:10px; color:inherit; display:flex; align-items:center; justify-content:center; gap:6px;">
                                        <span style="display:inline-block; width:12px; height:12px; border-radius:2px; background:#fbbf24;"></span> Business
                                    </div>
                                    <div class="price" style="font-size:1.4rem; font-weight:800; color:inherit; margin-bottom:4px;">MYR ${businessPrice.toFixed(2)}</div>
                                    <div class="price-subtext" style="font-size:0.75rem; color:#718096; font-weight:500;">per passenger</div>
                                </div>
                            </div>
                        `;

                        flightsContainer.appendChild(flightCard);

                        const economyDiv = flightCard.querySelector('.economy-class');
                        const businessDiv = flightCard.querySelector('.business-class');

                        function selectFlight(fareClass) {
                            const tripType = new URLSearchParams(window.location.search).get('tripType') || 'one-way';
                            const returnDate = new URLSearchParams(window.location.search).get('returnDate') || '';
                            const selectedFlight = {
                                flightNumber: flight.flight_number,
                                airline: flight.airline,
                                fareClass: fareClass,
                                departure: flight.departure_airport,
                                destination: flight.arrival_airport,
                                departureDate: flight.departure_time.split('T')[0],
                                tripType: tripType,
                                returnDate: returnDate,
                                price: (fareClass === 'Business' ? flight.price + 50 : flight.price) * (tripType === 'roundtrip' ? 1.5 : 1)
                            };
                            const urlParams = new URLSearchParams(window.location.search);
                            const passengers = urlParams.get('passengers') || '1';
                            selectedFlight.passengers = passengers;
                            const params = new URLSearchParams(selectedFlight);
                            window.location.href = `/booking.html?${params.toString()}`;
                        }

                        economyDiv.addEventListener('click', () => selectFlight('Economy'));
                        businessDiv.addEventListener('click', () => selectFlight('Business'));
                    });
                }, remainingDelay);
            })
            .catch(error => {
                flightsContainer.innerHTML = '<p>Failed to load flights.</p>';
                console.error('Error loading flights:', error);
            });
    }
    
    // On flights.html, read search parameters from URL query and fetch flights
    if (flightsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        const departure = urlParams.get('departure') || '';
        const destination = urlParams.get('destination') || '';
        const departureDate = urlParams.get('departureDate') || '';
        const passengers = urlParams.get('passengers') || '1';

        // Clear localStorage 'selectedFlight' if essential params are missing to avoid stale header data
        if (!departure || !destination || !departureDate) {
            localStorage.removeItem('selectedFlight');
        } else {
            // Update localStorage 'selectedFlight' with current search params
            const selectedFlight = {
                departure: departure,
                destination: destination,
                departureDate: departureDate,
                passengers: passengers
            };
            localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
        }

        // Update the flights header bar route-from-to span dynamically
        const routeFromToSpan = document.querySelector('.route-from-to');
        if (routeFromToSpan && departure && destination) {
            routeFromToSpan.textContent = `${departure} → ${destination}`;
        }

        // Update the flights header bar route-date span dynamically
        const routeDateSpan = document.querySelector('.route-date');
        if (routeDateSpan && departureDate) {
            const dateObj = new Date(departureDate);
            const options = { weekday: 'short', day: 'numeric', month: 'short' };
            const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
            routeDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
        }

        // Update the flights header bar route-passengers span dynamically
        const routePassengersSpan = document.querySelector('.route-passengers');
        if (routePassengersSpan && passengers) {
            routePassengersSpan.innerHTML = `<i class="fas fa-user"></i> ${passengers}`;
        }

        if (departure && destination && departureDate) {
            fetchFlights({ departure, destination, departureDate });
        } else {
            flightsContainer.innerHTML = '<p>Missing search parameters. Please search from the home page.</p>';
        }
    }

    // Display selected flight info on booking.html and generate passenger forms
    if (flightInfoDiv && passengerDetailsContainer) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('flightNumber') && urlParams.has('airline') && urlParams.has('fareClass')) {
            const selectedFlight = {
                flightNumber: urlParams.get('flightNumber'),
                airline: urlParams.get('airline'),
                fareClass: urlParams.get('fareClass'),
                departure: urlParams.get('departure'),
                destination: urlParams.get('destination'),
                departureDate: urlParams.get('departureDate'),
                tripType: urlParams.get('tripType') || 'one-way',
                returnDate: urlParams.get('returnDate') || '',
                price: parseFloat(urlParams.get('price')) || 0,
                passengers: parseInt(urlParams.get('passengers')) || 1
            };
            flightInfoDiv.innerHTML = `
                <p><strong>${selectedFlight.airline} ${selectedFlight.flightNumber} - ${selectedFlight.fareClass}</strong></p>
                <p>From: ${selectedFlight.departure}</p>
                <p>To: ${selectedFlight.destination}</p>
                <p>Departure Date: ${selectedFlight.departureDate}</p>
                <p>Price: MYR ${selectedFlight.price.toFixed(2)}</p>
                ${selectedFlight.tripType === 'roundtrip' ? `<p>Return Date: ${selectedFlight.returnDate}</p>` : ''}
                <p>Passengers: ${selectedFlight.passengers}</p>
            `;
            localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));

            // Update booking.html header spans dynamically
            const routeFromToSpan = document.getElementById('routeFromTo');
            if (routeFromToSpan) {
                routeFromToSpan.textContent = `${selectedFlight.departure} → ${selectedFlight.destination}`;
            }
            const routeDateSpan = document.getElementById('routeDate');
            if (routeDateSpan) {
                const dateObj = new Date(selectedFlight.departureDate);
                const options = { weekday: 'short', day: 'numeric', month: 'short' };
                const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
                routeDateSpan.innerHTML = `<i class="far fa-calendar-alt"></i> ${formattedDate}`;
            }
            const routePassengersSpan = document.getElementById('routePassengers');
            if (routePassengersSpan) {
                const passengersText = selectedFlight.passengers === 1 ? '1 Passenger' : `${selectedFlight.passengers} Passengers`;
                routePassengersSpan.innerHTML = `<i class="fas fa-user"></i> ${passengersText}`;
            }

            // Generate passenger detail forms based on number of passengers
            passengerDetailsContainer.innerHTML = '';
            for (let i = 1; i <= selectedFlight.passengers; i++) {
                const passengerForm = document.createElement('div');
                passengerForm.className = 'passenger-form';
                passengerForm.innerHTML = `
                    <h4>Passenger ${i}</h4>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="passengerTitle${i}">Title</label>
                            <select id="passengerTitle${i}" required>
                                <option value="">Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Miss">Miss</option>
                                <option value="Dr">Dr</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="passengerFirstName${i}">First Name</label>
                            <input type="text" id="passengerFirstName${i}" required />
                        </div>
                        <div class="form-group">
                            <label for="passengerLastName${i}">Last Name</label>
                            <input type="text" id="passengerLastName${i}" required />
                        </div>
                        <div class="form-group">
                            <label for="passengerPassport${i}">Passport Number</label>
                            <input type="text" id="passengerPassport${i}" required />
                        </div>
                        <div class="form-group">
                            <label for="passengerNationality${i}">Nationality</label>
                            <input type="text" id="passengerNationality${i}" required />
                        </div>
                        <div class="form-group">
                            <label for="passengerDOB${i}">Date of Birth</label>
                            <input type="date" id="passengerDOB${i}" required />
                        </div>
                        <div class="form-group">
                            <label for="passengerGender${i}">Gender</label>
                            <select id="passengerGender${i}" required>
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                                <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                        </div>
                    </div>
                `;
                passengerDetailsContainer.appendChild(passengerForm);
            }
        } else {
            flightInfoDiv.innerHTML = '<p>No flight selected. Please select a flight first.</p>';
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
            meal: {
                standard: 10,
                vegetarian: 12,
                vegan: 15,
                glutenFree: 14,
                kosher: 18,
                halal: 16
            },
            baggage: {
                0: 0,
                1: 30,
                2: 55,
                3: 75
            },
            priorityBoarding: 20
        };

        // Update price breakdown UI
        function updatePriceBreakdown() {
            const ticketPriceDisplay = document.getElementById('ticketPriceDisplay');
            const mealPriceDisplay = document.getElementById('mealPriceDisplay');
            const baggagePriceDisplay = document.getElementById('baggagePriceDisplay');
            const priorityBoardingPriceDisplay = document.getElementById('priorityBoardingPriceDisplay');
            const totalPriceDisplay = document.getElementById('totalPriceDisplay');

            // Get base ticket price from selected flight info
            const storedFlight = localStorage.getItem('selectedFlight');
            let ticketPrice = 0;
            let passengerCount = 1;
            
            if (storedFlight) {
                const flight = JSON.parse(storedFlight);
                if (flight.price) {
                    ticketPrice = flight.price;
                }
                if (flight.passengers) {
                    passengerCount = parseInt(flight.passengers) || 1;
                }
            }

            // Get selected addon prices
            const mealSelection = document.getElementById('mealSelection').value;
            const baggageSelection = document.getElementById('baggageSelection').value;
            const priorityBoardingChecked = document.getElementById('priorityBoarding').checked;

            const mealPrice = (addonPrices.meal[mealSelection] || 0) * passengerCount;
            const baggagePrice = (addonPrices.baggage[baggageSelection] || 0) * passengerCount;
            const priorityBoardingPrice = priorityBoardingChecked ? (addonPrices.priorityBoarding * passengerCount) : 0;

            const totalPrice = (ticketPrice * passengerCount) + mealPrice + baggagePrice + priorityBoardingPrice;

            // Update price displays
            ticketPriceDisplay.textContent = `MYR ${(ticketPrice * passengerCount).toFixed(2)}`;
            mealPriceDisplay.textContent = `MYR ${mealPrice.toFixed(2)}`;
            baggagePriceDisplay.textContent = `MYR ${baggagePrice.toFixed(2)}`;
            priorityBoardingPriceDisplay.textContent = `MYR ${priorityBoardingPrice.toFixed(2)}`;
            totalPriceDisplay.textContent = `MYR ${totalPrice.toFixed(2)}`;
        }

        // Attach event listeners to addon inputs to update price breakdown dynamically
        function attachAddonListeners() {
            const mealSelection = document.getElementById('mealSelection');
            const baggageSelection = document.getElementById('baggageSelection');
            const priorityBoarding = document.getElementById('priorityBoarding');

            mealSelection.addEventListener('change', updatePriceBreakdown);
            baggageSelection.addEventListener('change', updatePriceBreakdown);
            priorityBoarding.addEventListener('change', updatePriceBreakdown);
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
            const selectedFlight = JSON.parse(localStorage.getItem('selectedFlight'));
            const passengerCount = selectedFlight.passengers || 1;
            
            // Calculate base price
            let totalPrice = selectedFlight.price * passengerCount;
            if (selectedFlight.tripType === 'roundtrip') {
                totalPrice *= 1.5; // Adjusted price for return trip
            }

            // Calculate addon prices
            const mealSelection = document.getElementById('mealSelection').value;
            const baggageSelection = document.getElementById('baggageSelection').value;
            const priorityBoardingChecked = document.getElementById('priorityBoarding').checked;

            const mealPrice = (addonPrices.meal[mealSelection] || 0) * passengerCount;
            const baggagePrice = (addonPrices.baggage[baggageSelection] || 0) * passengerCount;
            const priorityBoardingPrice = priorityBoardingChecked ? (addonPrices.priorityBoarding * passengerCount) : 0;

            totalPrice += mealPrice + baggagePrice + priorityBoardingPrice;

            // Collect passenger details
            const passengers = [];
            for (let i = 1; i <= passengerCount; i++) {
                passengers.push({
                    title: document.getElementById(`passengerTitle${i}`).value,
                    firstName: document.getElementById(`passengerFirstName${i}`).value,
                    lastName: document.getElementById(`passengerLastName${i}`).value,
                    passportNumber: document.getElementById(`passengerPassport${i}`).value,
                    nationality: document.getElementById(`passengerNationality${i}`).value,
                    dateOfBirth: document.getElementById(`passengerDOB${i}`).value,
                    gender: document.getElementById(`passengerGender${i}`).value,
                });
            }

            const bookingData = {
                id: bookingId,
                passengers: passengers,
                contactInfo: {
                    email: document.getElementById('passengerEmail').value,
                    phone: document.getElementById('passengerPhone').value
                },
                additionalServices: {
                    mealSelection: mealSelection,
                    baggageSelection: baggageSelection,
                    priorityBoarding: priorityBoardingChecked,
                    specialRequests: document.getElementById('specialRequests').value
                },
                payment: {
                    cardName: document.getElementById('cardName').value,
                    cardNumber: document.getElementById('cardNumber').value,
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value
                },
                flight: selectedFlight,
                totalPrice: totalPrice,
                username: username // Add username to booking data
            };

            // Store booking in bookings array in localStorage
            let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            bookings.push(bookingData);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            localStorage.setItem('bookingData', JSON.stringify(bookingData));

            // Redirect to receipt page after successful booking
            window.location.href = `/receipt.html?booking=${bookingId}`;
        });

        showStep(currentStep);
        attachAddonListeners();
        updatePriceBreakdown();
    }

    // Utility function to calculate duration
    function calculateDuration(start, end) {
        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }

    // New code to toggle return date input visibility based on tripType selection
    const flightSearchForm = document.getElementById('flightSearchForm');
    if (flightSearchForm) {
        const returnDateContainer = document.getElementById('returnDateContainer');
        const tripTypeRadios = flightSearchForm.querySelectorAll('input[name="tripType"]');

        function toggleReturnDate() {
            const selectedTripType = flightSearchForm.querySelector('input[name="tripType"]:checked').value;
            if (selectedTripType === 'roundtrip') {
                returnDateContainer.style.display = 'block';
                // Make returnDate input required when visible
                returnDateContainer.querySelector('input').required = true;
            } else {
                returnDateContainer.style.display = 'none';
                // Remove required attribute when hidden
                returnDateContainer.querySelector('input').required = false;
            }
        }

        tripTypeRadios.forEach(radio => {
            radio.addEventListener('change', toggleReturnDate);
        });

        // Initialize on page load
        toggleReturnDate();
    }
});