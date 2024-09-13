import React from 'react';
import Image from 'next/image';

// RoomCardProps for individual room card
interface RoomCardProps {
  title: string;
  price: number;
  imageSrc: string;
}

// Individual RoomCard component using next/image
const RoomCard: React.FC<RoomCardProps> = ({ title, price, imageSrc }) => {
  return (
    <div className="max-w-xs rounded overflow-hidden shadow-lg bg-white">
      <Image
        src={imageSrc}
        alt={title}
        width={400}
        height={300}
        className="w-full h-48 object-cover rounded-md"
        objectFit="cover" // Ensures the image fills the area without distortion
      />
      <div className="p-4">
        <h2 className="font-bold text-xl">{title}</h2>
        <p className="mt-2 text-gray-600">Price per night: ${price}</p>
        <button className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
