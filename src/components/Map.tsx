import React, { useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';

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

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  elementId: string;
  center: Location;
}

const Map: React.FC<MapProps> = ({ elementId, center }) => {
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_API_OPTIONS);

  useEffect(() => {
    if (!isLoaded || !window.google) return; // Only run if Google Maps is loaded

    const map = new window.google.maps.Map(document.getElementById(elementId)!, {
      zoom: 10,
      center: center,
    });

    let infoWindow = new window.google.maps.InfoWindow({
      content: "Click the map to get Lat/Lng!",
      position: center,
    });

    infoWindow.open(map);

    map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
      infoWindow.close();
      const latLng = mapsMouseEvent.latLng;
      if (latLng) {
        infoWindow = new window.google.maps.InfoWindow({
          position: latLng,
        });
        infoWindow.setContent(JSON.stringify(latLng.toJSON(), null, 2));
        infoWindow.open(map);
      }
    });

    return () => {
      const mapElement = document.getElementById(elementId);
      if (mapElement) {
        mapElement.innerHTML = '';
      }
    };
  }, [isLoaded, elementId, center]);

  return <div id={elementId} className="w-full h-96" />;
};

export default Map;
