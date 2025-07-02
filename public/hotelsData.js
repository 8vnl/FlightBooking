const predefinedHotels = [
  {
    hotel_id: 'H100',
    name: 'Grand Singapore Hotel',
    location: 'Singapore',
    room_types: [
      { type: 'Standard', price: 120.00, available_rooms: 20 },
      { type: 'Deluxe', price: 180.00, available_rooms: 10 },
      { type: 'Suite', price: 250.00, available_rooms: 5 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Spa'],
    checkin_time: '14:00',
    checkout_time: '12:00'
  },
  {
    hotel_id: 'H101',
    name: 'Bangkok Riverside Hotel',
    location: 'Bangkok',
    room_types: [
      { type: 'Standard', price: 80.00, available_rooms: 30 },
      { type: 'Deluxe', price: 130.00, available_rooms: 15 },
      { type: 'Suite', price: 200.00, available_rooms: 7 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Restaurant'],
    checkin_time: '15:00',
    checkout_time: '11:00'
  },
  {
    hotel_id: 'H102',
    name: 'Kuala Lumpur City Hotel',
    location: 'Kuala Lumpur',
    room_types: [
      { type: 'Standard', price: 90.00, available_rooms: 25 },
      { type: 'Deluxe', price: 140.00, available_rooms: 12 },
      { type: 'Suite', price: 210.00, available_rooms: 6 }
    ],
    amenities: ['Free WiFi', 'Gym', 'Restaurant'],
    checkin_time: '14:00',
    checkout_time: '12:00'
  },
  {
    hotel_id: 'H103',
    name: 'Jakarta Central Hotel',
    location: 'Jakarta',
    room_types: [
      { type: 'Standard', price: 70.00, available_rooms: 40 },
      { type: 'Deluxe', price: 110.00, available_rooms: 20 },
      { type: 'Suite', price: 180.00, available_rooms: 8 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Gym'],
    checkin_time: '14:00',
    checkout_time: '12:00'
  },
  {
    hotel_id: 'H104',
    name: 'Manila Bay Hotel',
    location: 'Manila',
    room_types: [
      { type: 'Standard', price: 85.00, available_rooms: 35 },
      { type: 'Deluxe', price: 130.00, available_rooms: 18 },
      { type: 'Suite', price: 190.00, available_rooms: 7 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa'],
    checkin_time: '15:00',
    checkout_time: '11:00'
  },
  {
    hotel_id: 'H105',
    name: 'Hanoi Heritage Hotel',
    location: 'Hanoi',
    room_types: [
      { type: 'Standard', price: 75.00, available_rooms: 30 },
      { type: 'Deluxe', price: 120.00, available_rooms: 15 },
      { type: 'Suite', price: 170.00, available_rooms: 5 }
    ],
    amenities: ['Free WiFi', 'Gym', 'Restaurant'],
    checkin_time: '14:00',
    checkout_time: '12:00'
  },
  {
    hotel_id: 'H106',
    name: 'Aston Resort Batam',
    location: 'Batam',
    room_types: [
      { type: 'Standard', price: 60.00, available_rooms: 50 },
      { type: 'Deluxe', price: 100.00, available_rooms: 25 },
      { type: 'Suite', price: 150.00, available_rooms: 10 }
    ],
    amenities: ['Free WiFi', 'Pool', 'Spa'],
    checkin_time: '12:00',
    checkout_time: '12:00'
  }
];

export default predefinedHotels;
