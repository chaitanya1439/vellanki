import React from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export const GOOGLE_MAPS_API_OPTIONS = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  libraries: ['places', 'geometry'] as (
    | 'places'
    | 'drawing'
    | 'geometry'
    | 'visualization'
  )[],
  region: 'IN',
  language: 'en',
};

interface Room {
  id: number;
  lat: number;
  lng: number;
  // Add other properties if needed
}

interface MapViewProps {
  rooms: Room[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const containerStyle = { width: '100%', height: '300px' };

export default function MapView({ rooms, selectedId, onSelect }: MapViewProps) {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_API_OPTIONS);
  if (!isLoaded) return <div>Loading map...</div>;
  if (!rooms.length) return <div className="p-4 text-center text-gray-500">No locations</div>;
  const centerRoom = selectedId ? rooms.find(r => r.id === selectedId) : rooms[0];
  if (!centerRoom) return <div className="p-4 text-center text-gray-500">No matching location</div>;
  return (
    <GoogleMap mapContainerStyle={containerStyle} center={{ lat: centerRoom.lat, lng: centerRoom.lng }} zoom={13}>
      {rooms.map(r => (
        <Marker
          key={r.id}
          position={{ lat: r.lat, lng: r.lng }}
          onClick={() => onSelect(r.id)}
          icon={selectedId === r.id ? '/marker-selected.svg' : '/marker.svg'}
        />
      ))}
    </GoogleMap>
  );
}