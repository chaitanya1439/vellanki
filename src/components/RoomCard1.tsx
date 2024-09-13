import React from 'react';
import RoomCard from './RoomCard';

// Room type definition
type Room = {
  id: number;
  price: number;
  rating: number;
  amenities: string[];
  image: string; // Room image URL
};

// RoomCardsProps to hold an array of rooms
interface RoomCardsProps {
  rooms: Room[];
}

// RoomCards component to display the room grid
const RoomCards: React.FC<RoomCardsProps> = ({ rooms }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          title={`Room ${room.id}`}
          price={room.price}
          imageSrc={room.image}
        />
      ))}
    </div>
  );
};

export default RoomCards;
