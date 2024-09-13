import React, { useEffect } from 'react';
import useScript from '../hooks/useScript';

interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  elementId: string;
  center: Location;
}

const MapComponent: React.FC<MapProps> = ({ elementId, center }) => {
  const isScriptLoaded = useScript(`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}`);

  useEffect(() => {
    if (isScriptLoaded && window.google) {
      initializeMap(elementId, center);
    }
  }, [isScriptLoaded, elementId, center]);

  const initializeMap = (elementId: string, center: Location) => {
    const map = new google.maps.Map(document.getElementById(elementId) as HTMLElement, {
      center,
      zoom: 12,
    });

    new google.maps.Marker({
      position: center,
      map,
      title: 'Pickup Location',
    });
  };

  return (
    <div id={elementId} className="w-full h-96">
      {/* Map container with Tailwind CSS styling */}
    </div>
  );
};

export default MapComponent;
