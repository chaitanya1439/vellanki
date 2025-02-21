import React, { useState } from 'react';
import { submitBooking } from './Booking';

interface BookingFormProps {
  pickupLocation: Location;
  dropoffLocation: Location;
  rideOptionId: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ pickupLocation, dropoffLocation, rideOptionId }) => {
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const details = {
      pickupLocation,
      dropoffLocation,
      rideOptionId,
    };
    
    try {
      await submitBooking(details);
      setStatus('Booking successful!');
    } catch (error) {
      setStatus('Booking failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Book a Ride</h2>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Book Now</button>
      {status && <p className="mt-2">{status}</p>}
    </form>
  );
};

export default BookingForm;
