import { Location } from '@/pages/api/hello';

// Interface for booking details
interface BookingDetails {
  pickupLocation: Location;
  dropoffLocation: Location;
  rideOptionId: number;
}

// Function to submit booking details
const submitBooking = async (details: BookingDetails) => {
  const response = await fetch('/api/book-ride', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });
  return response.json();
};

// Function to update ride status via WebSocket
const updateRideStatus = (rideId: string) => {
  const socket = new WebSocket(`ws://yourapi.com/rides/${rideId}`);
  socket.onmessage = (event) => {
    const rideData = JSON.parse(event.data);
    // Example usage of rideData
    console.log('Ride data received:', rideData);
    // Here, you might update your map or UI based on rideData
  };
};

// Interface for driver information
interface Driver {
  name: string;
  carModel: string;
  rating: number;
}

// Function to fetch driver info for a given ride
const getDriverInfo = async (rideId: string): Promise<Driver> => {
  const response = await fetch(`/api/rides/${rideId}/driver`);
  return response.json();
};

export { submitBooking, updateRideStatus, getDriverInfo };
