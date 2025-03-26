import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import BottomNavbar from '@/components/BottonNavbar';
import { useRouter } from 'next/router';




const HomePage: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim() !== "") {
      router.push(`/ride-booking?destination=${encodeURIComponent(search)}`);
    }
  };
  return (
    <div className="p-4">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
        <div className="flex items-center bg-white p-3 rounded-full shadow-md">
        <span className="text-gray-500 pl-3">🔍</span>
        <input
          type="text"
          placeholder="Where are you going?"
          className="w-full px-4 py-2 outline-none bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch} className="px-3 py-2 bg-blue-500 text-white rounded-md ml-2">
          Go
        </button>
      </div>

      {/* Recent Locations */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Recent Locations</h2>
        <ul className="space-y-2">
          {["LB Nagar Metro Station", "Hayathnagar Khalsa", "Bapu Nagar Chowdi"].map(
            (location, index) => (
              <li 
                key={index} 
                className="flex justify-between items-center p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                onClick={() => router.push(`/ride-booking?destination=${encodeURIComponent(location)}`)}
              >
                <span>{location}</span>
                <span className="text-gray-400">❤️</span>
              </li>
            )
          )}
        </ul>
      </div>
      </div>
      <BottomNavbar />
    </div>
  );
};

export default HomePage;
