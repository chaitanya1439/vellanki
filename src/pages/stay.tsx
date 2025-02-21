import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottonNavbar';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Image from 'next/image'; 

// Room type definition
type Room = {
  id: number;
  price: number;
  rating: number;
  amenities: string[];
  image: string;
  liked: boolean; // Added liked property
};

type RoomFilters = {
  minPrice?: number;
  rating?: number;
};

type SortOption = 'priceAsc' | 'priceDesc' | 'rating';

// Sample room data
const rooms: Room[] = [
  { id: 1, price: 100, rating: 4.5, amenities: ['Wi-Fi', 'Pool'], image: '/imgs1.jpeg', liked: false },
  { id: 2, price: 150, rating: 4.7, amenities: ['Wi-Fi', 'Gym'], image: '/imgs2.jpeg', liked: false },
  { id: 3, price: 200, rating: 4.2, amenities: ['Parking', 'Wi-Fi'], image: '/imgs3.jpeg', liked: false },
  { id: 4, price: 800, rating: 3.9, amenities: ['Pool', 'Parking'], image: '/imgs1.jpeg', liked: false },
];

// Filter rooms based on criteria
const filterRooms = (rooms: Room[], filters: RoomFilters) => {
  return rooms.filter(
    (room) =>
      (filters.minPrice === undefined || room.price >= filters.minPrice) &&
      (filters.rating === undefined || room.rating >= filters.rating)
  );
};

// Sort rooms based on criteria
const sortRooms = (rooms: Room[], sortOption: SortOption) => {
  switch (sortOption) {
    case 'priceAsc':
      return [...rooms].sort((a, b) => a.price - b.price);
    case 'priceDesc':
      return [...rooms].sort((a, b) => b.price - a.price);
    case 'rating':
      return [...rooms].sort((a, b) => b.rating - a.rating);
    default:
      return rooms;
  }
};

const Home: React.FC = () => {
  const [filters, setFilters] = useState<RoomFilters>({});
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(rooms);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value ? parseFloat(value) : undefined }));
  };

  const applyFilters = () => {
    const filtered = filterRooms(rooms, filters);
    const sorted = sortRooms(filtered, sortOption);
    setFilteredRooms(sorted);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as SortOption;
    setSortOption(value);
    const sorted = sortRooms(filteredRooms, value);
    setFilteredRooms(sorted);
  };

  const toggleLike = (id: number) => {
    setFilteredRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === id ? { ...room, liked: !room.liked } : room))
    );
  };

  const handleBooking = (room: Room) => {
    console.log(`Booking room ID: ${room.id}, Price: ₹${room.price}`);
    alert(`Room with ID: ${room.id} booked successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Available Rooms</h1>

        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Min Price</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Minimum Price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Rating</label>
              <input
                type="number"
                name="rating"
                placeholder="Minimum Rating"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">Sort By</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              onChange={handleSortChange}
            >
              <option value="rating">Rating (High to Low)</option>
              <option value="priceAsc">Price (Low to High)</option>
              <option value="priceDesc">Price (High to Low)</option>
            </select>
          </div>
          <button
            onClick={applyFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>

        <div>
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white p-4 shadow rounded-lg mb-4">
              <Image
                src={room.image}
                alt="Room"
                className="rounded-lg w-full h-48 object-cover"
                width={500}  // Specify the width
                height={300} // Specify the height
              />
              <div className="mt-2 flex items-center justify-between">
                <h3 className="font-bold text-lg">₹{room.price}</h3>
                <button onClick={() => toggleLike(room.id)}>
                  {room.liked ? (
                    <AiFillHeart className="text-red-500 text-2xl" />
                  ) : (
                    <AiOutlineHeart className="text-gray-500 text-2xl" />
                  )}
                </button>
              </div>
              <p className="text-gray-600">Rating: {room.rating}</p>
              <button
                onClick={() => handleBooking(room)}
                className="mt-2 px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
              >
                Book Now
              </button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default Home;
