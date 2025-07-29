import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SearchBar from '@/components/SearchBar';
import FilterPanel from '@/components/FilterPanel';
import RoomCard from '@/components/RoomCard';


// Only import used icons/components
import { Bed, Hotel, House } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sampleRooms = [
  { id: 1, price: 1200, rating: 4.5, reviews: [{id: 5},{id: 4},{id: 5},{id: 4}], amenities: ['Wi-Fi','Pool'], image: '/imgs1.jpeg', liked: false, lat: 17.4435, lng: 78.3772, place: 'Hitech City' },
  { id: 2, price: 1000, rating: 4.2, reviews: [{id: 4},{id: 4},{id: 3},{id: 5}], amenities: ['Wi-Fi','Gym'], image: '/imgs2.jpeg', liked: false, lat: 17.4323, lng: 78.4437, place: 'Banjara Hills' },
  { id: 3, price: 800,  rating: 4.0, reviews: [{id: 4},{id: 4},{id: 4}], amenities: ['Parking','Wi-Fi'], image: '/imgs3.jpeg', liked: false, lat: 17.3850, lng: 78.4867, place: 'Secunderabad' },
  { id: 4, price: 900,  rating: 4.3, reviews: [{id: 5},{id: 4},{id: 4},{id: 4}], amenities: ['Pool','Parking'], image: '/imgs4.jpeg', liked: false, lat: 17.3297, lng: 78.4483, place: 'Gachibowli' },
];

const stayTypes = [
  { name: "Hotels", icon: <Hotel size={18} /> },
  { name: "Rooms", icon: <Bed size={18} /> },
  { name: "Houses", icon: <House size={18} /> },
  { name: "Hostels", icon: <Hotel size={18} /> }
];

export default function StayPage() {
  const [filtered, setFiltered] = useState(sampleRooms);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const handleSearch = (query: string) => {
    const lower = query.toLowerCase();
    const result = sampleRooms.filter(r => r.place.toLowerCase().includes(lower));
    setFiltered(result);
    if (result.length) setSelected(result[0].id);
  };

  const handleFilter = (f: Record<string, unknown>) => {
    const newFilters = { ...filters, ...f };
    setFilters(newFilters);
    let result = sampleRooms;
    if (newFilters.minPrice) result = result.filter(r => r.price >= Number(newFilters.minPrice));
    if (newFilters.maxPrice) result = result.filter(r => r.price <= Number(newFilters.maxPrice));
    if (newFilters.rating) result = result.filter(r => r.rating >= Number(newFilters.rating));
    if (newFilters.amenities) result = result.filter(r => (newFilters.amenities as string[]).every((a: string) => r.amenities.includes(a)));
    setFiltered(result);
    if (result.length) setSelected(result[0].id);
  };

  const toggleLike = (id: number) => setFiltered(prev => prev.map(r => r.id === id ? { ...r, liked: !r.liked } : r));

  return (
    <Layout>
      {/* Add margin-top to give space at the top */}
      <div className="mt-48" /> {/* You can adjust the value (e.g., mt-8, mt-12) as needed */}

      {/* OYO-style sticky search/filter bar */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="w-full md:w-auto">
            <FilterPanel onFilterChange={handleFilter} />
          </div>
        </div>
      </div>

      {/* Stay Types (OYO-style quick filter cards) */}
      <div className="container mx-auto px-4 pt-6">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {stayTypes.map((type, idx) => (
            <Card
              key={idx}
              className="min-w-[110px] w-28 hover:shadow-md transition-shadow cursor-pointer flex-shrink-0"
              onClick={() => handleFilter({ amenities: [type.name.slice(0, -1)] })}
            >
              <CardContent className="p-3 flex flex-col items-center justify-center text-center">
                <div className="bg-brand-blue/10 p-2 rounded-full mb-2">
                  {type.icon}
                </div>
                <span className="font-medium text-sm">{type.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-8 pb-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Room Listings */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-blue mb-1 flex items-center gap-2">
                <Hotel size={28} className="text-brand-blue" />
                Hotels in Hyderabad
              </h1>
              <p className="text-gray-600 text-base">
                Choose from budget and premium stays with instant booking, free cancellation, and exclusive deals.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {filtered.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                  No stays found for your search/filter.
                </div>
              )}
              {filtered.map(room => (
                <RoomCard key={room.id} room={room} onToggleLike={() => toggleLike(room.id)} />
              ))}
            </div>
          </div>
          {/* Right: MapView */}
          <div className="w-full lg:w-[420px] xl:w-[480px] h-[400px] lg:h-[calc(100vh-180px)] sticky top-28">
          </div>
        </div>
      </div>
    </Layout>
  );
}
