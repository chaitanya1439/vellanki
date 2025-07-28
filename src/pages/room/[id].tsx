import React from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Image from 'next/image';
import { AiFillStar } from 'react-icons/ai';

export interface Room {
  id: number;
  price: number;
  rating: number;
  reviews: number[];
  amenities: string[];
  image: string;
  liked: boolean;
  lat: number;
  lng: number;
  place: string;
}

export const sampleRooms: Room[] = [
  { id: 1, price: 1200, rating: 4.5, reviews: [5,4,5,4], amenities: ['Wi-Fi','Pool'], image: '/imgs1.jpeg', liked: false, lat: 17.4435, lng: 78.3772, place: 'Hitech City' },
  { id: 2, price: 1000, rating: 4.2, reviews: [4,4,3,5], amenities: ['Wi-Fi','Gym'], image: '/imgs2.jpeg', liked: false, lat: 17.4323, lng: 78.4437, place: 'Banjara Hills' },
  { id: 3, price: 800,  rating: 4.0, reviews: [4,4,4], amenities: ['Parking','Wi-Fi'], image: '/imgs3.jpeg', liked: false, lat: 17.3850, lng: 78.4867, place: 'Secunderabad' },
  { id: 4, price: 900,  rating: 4.3, reviews: [5,4,4,4], amenities: ['Pool','Parking'], image: '/imgs4.jpeg', liked: false, lat: 17.3297, lng: 78.4483, place: 'Gachibowli' },
];

export default function RoomDetail() {
  const router = useRouter();
  const { id } = router.query;
  const room = sampleRooms.find(r => r.id === Number(id)); // import sampleRooms or fetch

  if (!room) return <Layout><p className="p-4">Room not found</p></Layout>;

  return (
    <Layout>
      <div className="space-y-4">
        <Image src={room.image} alt="room" width={800} height={500} className="rounded-lg" />
        <h1 className="text-2xl font-bold">{room.place} - ₹{room.price}</h1>
        <div className="flex items-center">
          <AiFillStar className="text-yellow-400" /> <span className="ml-1 font-semibold">{room.rating}</span>
          <span className="ml-2 text-gray-600">({room.reviews.length} reviews)</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {room.amenities.map((a: string) => (
            <div key={a} className="flex items-center space-x-2">
              ✓ <span>{a}</span>
            </div>
          ))}
        </div>
        <button className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700">
          Book Now
        </button>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <div className="space-y-4">
            {room.reviews.map((score: number, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  {Array.from({ length: score }).map((_, i) => <AiFillStar key={i} className="text-yellow-400" />)}
                </div>
                <p className="mt-2 text-gray-700">“Great stay!”</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}