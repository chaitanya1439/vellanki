import React from 'react';
import MapComponent from '../components/MapComponent';
import RideOptionCard from '../components/RideOptionCard';
import BookingForm from '../components/BookingForm';
import { Location } from '@/pages/api/hello';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottonNavbar';

const center: Location = { lat: 40.748817, lng: -73.985428 }; // Example coordinates

const rideOptions = [
  { id: 1, type: 'Bike', price: 10, description: 'Economical and fast' },
  { id: 2, type: 'Auto', price: 20, description: 'Comfortable for small groups' },
  { id: 3, type: 'Ambulance', price: 50, description: 'Emergency transport' },
];

const pickupLocation: Location = { lat: 40.748817, lng: -73.985428 }; // Example pickup location
const dropoffLocation: Location = { lat: 40.751824, lng: -73.993964 }; // Example dropoff location
const rideOptionId = 1; // Example ride option ID

const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      {/* Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Map and Ride Options</h2>
        <MapComponent elementId="map" center={center} />
      </div>

      {/* Ride Options Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Ride Options</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rideOptions.map((option) => (
            <RideOptionCard
              key={option.id}
              id={option.id}
              type={option.type}
              price={option.price}
              description={option.description}
            />
          ))}
        </div>
      </div>

      {/* Booking Form Section */}
      <BookingForm
        pickupLocation={pickupLocation}
        dropoffLocation={dropoffLocation}
        rideOptionId={rideOptionId}
      />
      <BottomNavbar />
    </div>
  );
};

export default HomePage;
