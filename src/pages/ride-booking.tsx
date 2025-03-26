import { useRouter } from "next/router";
import React from "react";

const RideBooking = () => {
  const router = useRouter();
  const { destination } = router.query;

  return (
    <div className="w-full h-screen bg-gray-100 p-4">
      {/* Destination Info */}
      <div className="bg-white p-3 rounded-lg shadow-md flex items-center justify-between">
        <span className="text-lg font-semibold">📍 {destination || "Select Destination"}</span>
        <button className="text-gray-500 text-sm">✏️ Edit</button>
      </div>

      {/* Ride Options */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Available Rides</h2>
        <ul className="space-y-3">
          {[
            { type: "🏍️ Bike", time: "2 mins", price: "₹27 (₹34)" },
            { type: "🛺 Auto", time: "2 mins", price: "₹50" },
            { type: "🚗 Cab Economy", time: "2 mins", price: "₹120" },
            { type: "🚕 Cab Premium", time: "2 mins", price: "₹145" },
          ].map((ride, index) => (
            <li key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <span>{ride.type} - {ride.time}</span>
              <span className="font-semibold">{ride.price}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment & Book Button */}
      <div className="fixed bottom-5 w-full px-4">
        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-md">
          <span>💵 Cash</span>
          <span>💰 Offers</span>
        </div>
        <button className="w-full bg-yellow-500 text-white text-lg py-3 mt-2 rounded-lg shadow-lg">
          Book Ride
        </button>
      </div>
    </div>
  );
};

export default RideBooking;
