document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    const departureDateInput = document.getElementById('date');
    const returnDateInput = document.getElementById('returnDate');
    if (departureDateInput) {
        departureDateInput.setAttribute('min', today);
    }
    if (returnDateInput) {
        returnDateInput.setAttribute('min', today);
    }
    // For hotels.html check-in and check-out dates
    const checkinDateInput = document.getElementById('checkinDate');
    const checkoutDateInput = document.getElementById('checkoutDate');
    if (checkinDateInput) {
        checkinDateInput.setAttribute('min', today);
    }
    if (checkoutDateInput) {
        checkoutDateInput.setAttribute('min', today);
    }
});
