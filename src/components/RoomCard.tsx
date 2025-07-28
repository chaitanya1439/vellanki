import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

interface Room {
  id: string | number;
  image: string;
  liked: boolean;
  price: number;
  rating: number;
  reviews: { id: string | number }[];
  place: string;
  amenities: string[];
}

interface RoomCardProps {
  room: Room;
  onToggleLike: () => void;
}

export default function RoomCard({ room, onToggleLike }: RoomCardProps) {
  return (
    <Link href={`/room/${room.id}`} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="relative">
          <Image src={room.image} alt="room" width={400} height={250} className="object-cover" />
          <button onClick={(e) => { e.preventDefault(); onToggleLike(); }} className="absolute top-2 right-2">
            {room.liked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart className="text-white" />}
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-lg font-semibold">₹{room.price}</h2>
          <p className="text-sm text-gray-500">{room.rating} ★ ({room.reviews.length} reviews)</p>
          <p className="mt-1 text-xs text-gray-600">{room.place}</p>
          <p className="mt-2 text-xs text-gray-600 truncate">{room.amenities.join(', ')}</p>
        </div>
    </Link>
  );
}