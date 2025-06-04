# Test info

- Name: Flight Booking Flow >> Select flight and proceed through booking steps
- Location: D:\VSC Projects\Galaxy\tests\booking-flow.spec.js:4:3

# Error details

```
Error: page.waitForSelector: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.flight-card') to be visible

    at D:\VSC Projects\Galaxy\tests\booking-flow.spec.js:9:16
```

# Page snapshot

```yaml
- navigation:
  - link " Back to Menu":
    - /url: /index.html
  - heading " Galaxy" [level=1]
- heading " Flight Details" [level=2]
- button "Continue to Passenger Details " [disabled]
```

# Test source

```ts
   1 | const { test, expect } = require('@playwright/test');
   2 |
   3 | test.describe('Flight Booking Flow', () => {
   4 |   test('Select flight and proceed through booking steps', async ({ page }) => {
   5 |     // Go to booking page with search parameters
   6 |     await page.goto('http://localhost:3000/booking.html?departure=KUL&destination=SIN&departureDate=2024-07-01');
   7 |
   8 |     // Wait for flights to load
>  9 |     await page.waitForSelector('.flight-card');
     |                ^ Error: page.waitForSelector: Test timeout of 30000ms exceeded.
  10 |
  11 |     // Select Economy fare of the first flight
  12 |     const firstEconomy = await page.locator('.flight-card .fare-class.economy-class').first();
  13 |     await firstEconomy.click();
  14 |
  15 |     // Verify flight details updated and continue button enabled
  16 |     const flightDetails = await page.locator('#flightDetails');
  17 |     await expect(flightDetails).toContainText('Selected Flight');
  18 |     const continueBtn = await page.locator('#continueToPassenger');
  19 |     await expect(continueBtn).toBeEnabled();
  20 |
  21 |     // Click continue to passenger details
  22 |     await continueBtn.click();
  23 |
  24 |     // Verify passenger details step is visible
  25 |     const passengerStep = await page.locator('#passengerDetailsStep');
  26 |     await expect(passengerStep).toBeVisible();
  27 |
  28 |     // Fill passenger form
  29 |     await page.fill('#passengerName', 'John Doe');
  30 |     await page.fill('#passengerPassport', 'A1234567');
  31 |     await page.fill('#passengerEmail', 'john@example.com');
  32 |     await page.fill('#passengerPhone', '1234567890');
  33 |
  34 |     // Continue to add-ons
  35 |     await page.click('#continueToAddons');
  36 |
  37 |     // Verify add-ons step is visible
  38 |     const addonsStep = await page.locator('#addonsStep');
  39 |     await expect(addonsStep).toBeVisible();
  40 |
  41 |     // Continue to payment
  42 |     await page.click('#continueToPayment');
  43 |
  44 |     // Verify payment step is visible
  45 |     const paymentStep = await page.locator('#paymentStep');
  46 |     await expect(paymentStep).toBeVisible();
  47 |
  48 |     // Fill payment form
  49 |     await page.fill('#cardName', 'John Doe');
  50 |     await page.fill('#cardNumber', '4111111111111111');
  51 |     await page.fill('#cardExpiry', '12/25');
  52 |     await page.fill('#cardCvv', '123');
  53 |
  54 |     // Confirm booking
  55 |     await page.click('#confirmBooking');
  56 |
  57 |     // Wait for receipt page or confirmation (assuming redirect)
  58 |     await page.waitForURL('**/receipt.html');
  59 |
  60 |     // Verify receipt page content
  61 |     const receiptHeader = await page.locator('h1');
  62 |     await expect(receiptHeader).toContainText('Receipt');
  63 |   });
  64 | });
  65 |
```