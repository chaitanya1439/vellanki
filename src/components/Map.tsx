import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface MapProps {
  address: string;
}

// Define a default location (e.g., New Delhi, India)
const DEFAULT_LOCATION: google.maps.LatLngLiteral = { lat: 28.6139, lng: 77.2090 };

const Map: React.FC<MapProps> = ({ address }) => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral>(DEFAULT_LOCATION);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const response = await fetch(`/api/hello?address=${encodeURIComponent(address)}`);
        const coords = await response.json();
        if (coords && coords.lat && coords.lng) {
          setLocation({ lat: coords.lat, lng: coords.lng }); // Update location with fetched coordinates
        } else {
          console.error('Invalid coordinates:', coords);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    if (address) {
      fetchLocation();
    }
  }, [address]);

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  return (
    <div className="w-full h-80 rounded-lg shadow-lg">
      <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY as string}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={location}
          zoom={12}
        >
          <Marker position={location}>
            <InfoWindow position={location}>
              <div>{address || 'Default Location'}</div>
            </InfoWindow>
          </Marker>
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default Map;
