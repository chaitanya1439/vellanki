// pages/ride-confirmation.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { FaCheckCircle } from 'react-icons/fa';

const mapStyle = { width: '100%', height: '300px' };

const RideConfirmation: React.FC = () => {
  const router = useRouter();
  const { fromLat, fromLng, toLat, toLng, vehicleType } = router.query;
  const [directions, setDirections] = useState<google.maps.DirectionsResult|null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat:0,lng:0 });

  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!, libraries:['places','geometry'] });

  useEffect(() => {
    if (isLoaded && fromLat && fromLng && toLat && toLng) {
      const origin = { lat: +fromLat, lng: +fromLng };
      const dest = { lat: +toLat, lng: +toLng };
      const svc = new google.maps.DirectionsService();
      svc.route({ origin, destination: dest, travelMode: google.maps.TravelMode.DRIVING }, (res, status) => {
        if (status===google.maps.DirectionsStatus.OK && res) {
          setDirections(res);
          const path = res.routes[0].overview_path;
          const mid = path[Math.floor(path.length/2)];
          setCenter({ lat: mid.lat(), lng: mid.lng() });
        }
      });
    }
  }, [isLoaded, fromLat, fromLng, toLat, toLng]);

  const eta = directions? Math.ceil((directions.routes[0].legs[0].duration?.value||0)/60):null;
  const distText = directions? directions.routes[0].legs[0].distance?.text:'';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg mt-8">
        <div className="flex items-center space-x-3 mb-4">
          <FaCheckCircle className="text-green-500 text-3xl" />
          <h2 className="text-2xl font-semibold">Ride Confirmed!</h2>
        </div>
        <p className="text-gray-600 mb-4">Your {vehicleType} is on the way.</p>
        <div className="rounded-lg overflow-hidden mb-4">
          {isLoaded && center.lat!==0 && (
            <GoogleMap mapContainerStyle={mapStyle} center={center} zoom={13} options={{disableDefaultUI:true}}>
              {directions && <DirectionsRenderer directions={directions} options={{polylineOptions:{strokeColor:'#4A90E2',strokeWeight:4}}}/>}            
            </GoogleMap>
          )}
        </div>
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2"><span>ETA</span><span>{eta} mins</span></div>
          <div className="flex justify-between"><span>Distance</span><span>{distText}</span></div>
        </div>
        <button onClick={()=>router.push('/home')} className="w-full bg-blue-600 text-white py-3 rounded-lg">Back to Home</button>
      </div>
    </div>
  );
};

export default RideConfirmation;
