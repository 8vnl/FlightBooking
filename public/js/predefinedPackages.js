const predefinedPackages = [
  {
    id: 1,
    name: "Bangkok Explorer",
    flight: {
      flight_number: "TG123",
      airline: "Thai Airways",
      departure_airport: "Singapore",
      arrival_airport: "Bangkok",
      price: 300
    },
    hotel: {
      hotel_id: 101,
      name: "Bangkok Grand Hotel",
      location: "Bangkok",
      room_types: [
        { type: "Deluxe", price: 80 }
      ],
      amenities: ["Free WiFi", "Pool", "Gym"],
      checkin_time: "14:00",
      checkout_time: "12:00"
    }
  },
  {
    id: 2,
    name: "Kuala Lumpur Getaway",
    flight: {
      flight_number: "MH456",
      airline: "Malaysia Airlines",
      departure_airport: "Singapore",
      arrival_airport: "Kuala Lumpur",
      price: 200
    },
    hotel: {
      hotel_id: 102,
      name: "KL City Hotel",
      location: "Kuala Lumpur",
      room_types: [
        { type: "Standard", price: 70 }
      ],
      amenities: ["Free Breakfast", "Spa", "WiFi"],
      checkin_time: "15:00",
      checkout_time: "11:00"
    }
  },
  {
    id: 3,
    name: "Jakarta Adventure",
    flight: {
      flight_number: "GA789",
      airline: "Garuda Indonesia",
      departure_airport: "Singapore",
      arrival_airport: "Jakarta",
      price: 250
    },
    hotel: {
      hotel_id: 103,
      name: "Jakarta Central Hotel",
      location: "Jakarta",
      room_types: [
        { type: "Suite", price: 90 }
      ],
      amenities: ["Pool", "Gym", "Free WiFi"],
      checkin_time: "14:00",
      checkout_time: "12:00"
    }
  }
];

export default predefinedPackages;
