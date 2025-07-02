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
});
