// pages/index.tsx

import React, { useState } from 'react';
import RoomCards from '../components/RoomCard1';
import dynamic from 'next/dynamic';
import Search from '@/components/Search';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottonNavbar';

// Room type definition
type Room = {
  id: number;
  price: number;
  rating: number;
  amenities: string[];
  image: string; // Room image URL
};

type RoomFilters = {
  minPrice?: number;
  rating?: number;
};

type Booking = {
  roomId: number;
  startDate: Date;
  endDate: Date;
  guestCount: number;
};

// Sample room data
const Map = dynamic(() => import('../components/Map'), { ssr: false });

const rooms: Room[] = [
  { id: 1, price: 100, rating: 4.5, amenities: ['Wi-Fi', 'Pool'], image: '/imgs1.jpeg' },
  { id: 2, price: 150, rating: 4.7, amenities: ['Wi-Fi', 'Gym'], image: '/imgs2.jpeg' },
  { id: 3, price: 200, rating: 4.2, amenities: ['Parking', 'Wi-Fi'], image: '/imgs3.jpeg' },
  { id: 4, price: 80, rating: 3.9, amenities: ['Pool', 'Parking'], image: '/imgs1.jpeg' },
];

// Function to filter rooms based on the filters
const filterRooms = (rooms: Room[], filters: RoomFilters) => {
  return rooms.filter(room =>
    (filters.minPrice !== undefined ? room.price >= filters.minPrice : true) &&
    (filters.rating !== undefined ? room.rating >= filters.rating : true)
  );
};

// Function to calculate the total price for a booking
const calculateTotalPrice = (booking: Booking, pricePerNight: number): number => {
  const days = (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) / (1000 * 3600 * 24);
  return days * pricePerNight;
};

const Home: React.FC = () => {
  const [filters, setFilters] = useState<RoomFilters>({});
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);
  const [booking, setBooking] = useState<Partial<Booking>>({});
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');

  const handleSearch = (address: string) => {
    setAddress(address);
  }

  // Handle form input changes and update filters
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value ? parseFloat(value) : undefined,
    }));
  };

  // Handle filter application
  const applyFilters = () => {
    const result = filterRooms(rooms, filters);
    setFilteredRooms(result);
  };

  // Handle booking input changes
  const handleBookingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBooking((prevBooking) => ({
      ...prevBooking,
      [name]: name === 'guestCount' ? parseInt(value) : value,
    }));
  };

  // Handle total price calculation
  const calculatePrice = () => {
    if (booking.roomId && booking.startDate && booking.endDate) {
      const selectedRoom = rooms.find((room) => room.id === booking.roomId);
      if (selectedRoom) {
        const price = calculateTotalPrice(booking as Booking, selectedRoom.price);
        setTotalPrice(price);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
     <Map address={address} />
      <Search onSearch={handleSearch} />
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>

        {/* Filter Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Minimum Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                step="0.1"
                onChange={handleChange}
              />
            </div>
          </div>
          <button
            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={applyFilters}
          >
            Apply Filters
          </button>
        </div>

        {/* Display Filtered Rooms */}
        <RoomCards rooms={filteredRooms} />

        {/* Booking Form */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4">Book a Room</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Room ID</label>
              <input
                type="number"
                name="roomId"
                placeholder="Room ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleBookingChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Guest Count</label>
              <input
                type="number"
                name="guestCount"
                placeholder="Number of Guests"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleBookingChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleBookingChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">End Date</label>
              <input
                type="date"
                name="endDate"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleBookingChange}
              />
            </div>
          </div>
          <button
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
            onClick={calculatePrice}
          >
            Calculate Total Price
          </button>

          {/* Display Total Price */}
          {totalPrice !== null && (
            <p className="text-xl font-bold mt-4">
              Total Price: ${totalPrice.toFixed(2)}
            </p>
          )}
        </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Home;
