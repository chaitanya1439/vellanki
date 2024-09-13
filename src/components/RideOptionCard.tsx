import React from 'react';
import { FaCar, FaBicycle, FaAmbulance } from 'react-icons/fa'; // Example icons

interface RideOptionProps {
  id: number;
  type: string;
  price: number;
  description: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Bike':
      return <FaBicycle className="text-green-500 mr-2" />;
    case 'Auto':
      return <FaCar className="text-blue-500 mr-2" />;
    case 'Ambulance':
      return <FaAmbulance className="text-red-500 mr-2" />;
    default:
      return <FaCar className="text-gray-500 mr-2" />;
  }
};

const RideOptionCard: React.FC<RideOptionProps> = ({ type, price, description }) => {
  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {getIcon(type)}
        <h3 className="text-lg font-semibold">{type}</h3>
      </div>
      <p className="text-gray-700 mb-2">{description}</p>
      <p className="text-green-500 text-xl font-bold">${price}</p>
    </div>
  );
};

export default RideOptionCard;

