import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface RideCardProps {
  ride: {
    id: string;
    currentLocationName: string;
    destinationLocationName: string;
    driver: { name: string };
    distance: number;
    charge: number;
    status: string;
    createdAt: string;
  };
}

export default function RideCard({ ride }: RideCardProps) {
  const {
    currentLocationName,
    destinationLocationName,
    driver,
    distance,
    charge,
    status,
    createdAt,
  } = ride;

  return (
    <div className="flex flex-col bg-gray-50 p-4 rounded-lg shadow-inner hover:shadow-md transition">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">{currentLocationName}</span>
        <span className="text-gray-400">→</span>
        <span className="font-medium text-gray-700">{destinationLocationName}</span>
      </div>
      <div className="text-sm text-gray-500 mb-1">
        Driver: <span className="font-medium text-gray-700">{driver.name || 'N/A'}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <div>Distance: <span className="font-medium">{(distance/1000).toFixed(2)} km</span></div>
        <div>Fare: <span className="font-medium">₹{charge.toFixed(2)}</span></div>
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Status: <span className="text-blue-600 font-medium">{status}</span></span>
        <span>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</span>
      </div>
    </div>
  );
}
