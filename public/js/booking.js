document.addEventListener('DOMContentLoaded', function () {
    const flightsContainer = document.getElementById('flightsContainer');
    const flightInfoDiv = document.getElementById('flightInfo');
    const bookingForm = document.getElementById('bookingForm');

    // Function to fetch and display flights with optional filters
    function fetchFlights(filters = {}) {
        let url = '/api/flights';
        const params = new URLSearchParams(filters);
        if ([...params].length > 0) {
            url += '?' + params.toString();
        }
        fetch(url)
            .then(response => response.json())
            .then(flights => {
                if (flights.length === 0) {
                    flightsContainer.innerHTML = '<p>No flights available.</p>';
                    return;
                }
                flightsContainer.innerHTML = ''; // Clear previous flights

                const airlineLogos = {
                    "Malaysia Airlines": "/images/MH.jpg",
                    "AirAsia": "/images/AK.jpg",
                    "Singapore Airlines": "/images/SQ.jpg",
                    "Philippines Airlines": "/images/PR.jpg",
                    "Thai Airways": "/images/TG.jpg",
                    "Garuda Indonesia": "/images/GA.jpg"

                };

                flights.forEach(flight => {
                    const flightCard = document.createElement('div');
                    flightCard.className = 'flight-card';

                    const departureTime = new Date(flight.departure_time);
                    const arrivalTime = new Date(flight.arrival_time);
                    const duration = calculateDuration(departureTime, arrivalTime);

                    const logoSrc = airlineLogos[flight.airline] || "/images/default-airline-logo.png";

                    // Define randomSeats as a random number between 1 and 10
                    const randomSeats = Math.floor(Math.random() * 10) + 1;

                    flightCard.innerHTML = `
                        <div class="flight-card-left">
                            <div class="departure-time">${departureTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div class="departure-airport">${flight.departure_airport}</div>
                        </div>
                        <div class="flight-card-center">
                            <div class="flight-duration">${duration}</div>
                            <div class="flight-details-link"><a href="#">Flight details</a></div>
                        </div>
                        <div class="flight-card-right">
                            <div class="arrival-time">${arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                            <div class="arrival-airport">${flight.arrival_airport}</div>
                            <div class="flight-number">
                                <img src="${logoSrc}" alt="${flight.airline}" />
                                <span>${flight.airline} ${flight.flight_number}</span>
                            </div>
                        </div>
                        <div class="fare-classes">
                            <div class="fare-class economy-class">
                                <div class="class-name">Economy</div>
                                <div class="price">MYR ${flight.price.toFixed(2)}</div>
                            </div>
                            <div class="fare-class business-class">
                                <div class="class-name">Business</div>
                                <div class="price">MYR ${Math.round(flight.price * 1.7)}</div>
                                <div class="seats-left-badge">${randomSeats} seats left</div>
                            </div>
                        </div>
                    `;

                    flightsContainer.appendChild(flightCard);

                    const economyDiv = flightCard.querySelector('.economy-class');
                    const businessDiv = flightCard.querySelector('.business-class');

                    function selectFlight(fareClass) {
                        const selectedFlight = {
                            flightNumber: flight.flight_number,
                            airline: flight.airline,
                            fareClass: fareClass,
                            departure: flight.departure_airport,
                            destination: flight.arrival_airport,
                            departureDate: flight.departure_time.split('T')[0] // Use flight's actual departure date
                        };
                        const params = new URLSearchParams(selectedFlight);
                        window.location.href = `/booking.html?${params.toString()}`;
                    }

                    economyDiv.addEventListener('click', () => selectFlight('Economy'));
                    businessDiv.addEventListener('click', () => selectFlight('Business'));
                });
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

        if (departure && destination && departureDate) {
            fetchFlights({ departure, destination, departureDate });
        } else {
            flightsContainer.innerHTML = '<p>Missing search parameters. Please search from the home page.</p>';
        }
    }

    // Display selected flight info on booking.html
    if (flightInfoDiv) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('flightNumber') && urlParams.has('airline') && urlParams.has('fareClass')) {
            const selectedFlight = {
                flightNumber: urlParams.get('flightNumber'),
                airline: urlParams.get('airline'),
                fareClass: urlParams.get('fareClass'),
                departure: urlParams.get('departure'),
                destination: urlParams.get('destination'),
                departureDate: urlParams.get('departureDate')
            };
            flightInfoDiv.innerHTML = `
                <p><strong>${selectedFlight.airline} ${selectedFlight.flightNumber} - ${selectedFlight.fareClass}</strong></p>
                <p>From: ${selectedFlight.departure}</p>
                <p>To: ${selectedFlight.destination}</p>
                <p>Date: ${selectedFlight.departureDate}</p>
            `;
            localStorage.setItem('selectedFlight', JSON.stringify(selectedFlight));
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

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!validateStep(currentStep)) {
                return;
            }

            // Collect all form data
            const bookingId = Date.now();
            const bookingData = {
                id: bookingId,
                passengerName: document.getElementById('passengerName').value,
                passengerPassport: document.getElementById('passengerPassport').value,
                frequentFlyerProgram: document.getElementById('frequentFlyerProgram').value,
                passengerEmail: document.getElementById('passengerEmail').value,
                passengerPhone: document.getElementById('passengerPhone').value,
                additionalServices: {
                    extraBaggage: document.getElementById('extraBaggage').checked,
                    mealPreference: document.getElementById('mealPreference').checked,
                    seatSelection: document.getElementById('seatSelection').checked,
                    specialRequests: document.getElementById('specialRequests').value
                },
                payment: {
                    cardName: document.getElementById('cardName').value,
                    cardNumber: document.getElementById('cardNumber').value,
                    expiryDate: document.getElementById('expiryDate').value,
                    cvv: document.getElementById('cvv').value
                },
                flight: JSON.parse(localStorage.getItem('selectedFlight'))
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
    }

    // Utility function to calculate duration
    function calculateDuration(start, end) {
        const diffMs = end - start;
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    }
});
