// components/Map.tsx
import React, { useEffect } from 'react';

declare global {
  interface Window {
    google: typeof google; // Declare google on the window object
  }
}

const Map: React.FC = () => {
  useEffect(() => {
    const initMap = async () => {
      // Load the Google Maps library
      const { Map } = await window.google.maps.importLibrary("maps") as google.maps.MapsLibrary;

      const myLatlng = { lat: 17.339, lng: 78.551 };

      const map = new Map(document.getElementById("map")!, {
        zoom: 4,
        center: myLatlng,
      });

      // Create the initial InfoWindow
      let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
      });

      infoWindow.open(map);

      // Configure the click listener
      map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
        // Close the current InfoWindow
        infoWindow.close();

        // Check if latLng is not null
        const latLng = mapsMouseEvent.latLng;
        if (latLng) {
          // Create a new InfoWindow
          infoWindow = new google.maps.InfoWindow({
            position: latLng,
          });
          infoWindow.setContent(
            JSON.stringify(latLng.toJSON(), null, 2)
          );
          infoWindow.open(map);
        } else {
          console.error("latLng is null");
        }
      });
    };

    initMap();
  }, []);

  return (
    <div id="map" className="w-full h-96" />
  );
};

export default Map;