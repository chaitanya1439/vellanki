import React from 'react';
import Map from '../components/Map';
import RideOptionCard from '../components/RideOptionCard';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottonNavbar';

type Location = {
  lat: number;
  lng: number;
};

const center: Location = { lat: 40.748817, lng: -73.985428 }; // Example coordinates

const rideOptions = [
  { id: 1, type: 'Bike', price: 147, description: 'Economical and fast' },
  { id: 2, type: 'Auto', price: 300, description: 'Comfortable for small groups' },
  { id: 3, type: 'Ambulance', price: 750, description: 'Emergency transport' },
];


const HomePage: React.FC = () => {
  return (
    <div className="p-4">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      {/* Map Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Map and Ride Options</h2>
        <Map elementId="map" center={center} />
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
      <BottomNavbar />
    </div>
  );
};

export default HomePage;
