import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: typeof google; // Declare google on the window object
  }
}

// Define the Location type
interface Location {
  lat: number;
  lng: number;
}

interface MapProps {
  elementId: string; // Prop for the map element ID
  center: Location; // Center coordinates
}

const Map: React.FC<MapProps> = ({ elementId, center }) => {
  useEffect(() => {
    const initMap = async () => {
      // Check if Google Maps library is already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.onload = createMap; // Create the map after loading the script
        document.head.appendChild(script);
      } else {
        createMap(); // Create the map if the library is already loaded
      }
    };

    const createMap = () => {
      const map = new window.google.maps.Map(document.getElementById(elementId)!, {
        zoom: 10,
        center: center,
      });

      // Create and manage InfoWindows
      let infoWindow = new window.google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: center,
      });

      infoWindow.open(map);

      // Configure the click listener
      map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
        // Close the current InfoWindow
        infoWindow.close();

        // Get the latLng from the click event
        const latLng = mapsMouseEvent.latLng;
        if (latLng) {
          // Create a new InfoWindow
          infoWindow = new window.google.maps.InfoWindow({
            position: latLng,
          });
          infoWindow.setContent(JSON.stringify(latLng.toJSON(), null, 2));
          infoWindow.open(map);
        } else {
          console.error("latLng is null");
        }
      });
    };

    initMap();

    return () => {
      const mapElement = document.getElementById(elementId);
      if (mapElement) {
        mapElement.innerHTML = ''; // Clean up the map element
      }
    };
  }, [elementId, center]);

  return <div id={elementId} className="w-full h-96" />;
};

export default Map;
