import React from 'react';
import RoomCard from './RoomCard';

// Room type definition
type Room = {
  id: number;
  price: number;
  rating: number;
  amenities: string[];
  image: string;
  liked: boolean;
  reviews: { id: string | number }[];
  place: string;
};

interface RoomCardsProps {
  rooms: Room[];
}

const RoomCards: React.FC<RoomCardsProps> = ({ rooms }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          onToggleLike={() => {}}
        />
      ))}
    </div>
  );
};

export default RoomCards;
