import React, { useEffect } from 'react';

// Declare the global interface for the Google Maps library
declare global {
  interface Window {
    google: typeof google; // Declare google on the window object
  }
}

const Map: React.FC<{ address: string }> = ({ address }) => {
  useEffect(() => {
    const initMap = async () => {
      // Load the Google Maps library if it's not already loaded
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places`;
        script.async = true;
        script.onload = () => {
          createMap();
        };
        document.head.appendChild(script);
      } else {
        createMap();
      }
    };

    const createMap = async () => {
      const myLatlng = { lat: 17.339, lng: 78.551 }; // Default coordinates

      const map = new window.google.maps.Map(document.getElementById("map")!, {
        zoom: 10,
        center: myLatlng,
      });

      // Create the initial InfoWindow
      let infoWindow = new window.google.maps.InfoWindow({
        content: "Click the map to get Lat/Lng!",
        position: myLatlng,
      });

      infoWindow.open(map);

      // Use Geocoder to convert the address to coordinates
      const geocoder = new window.google.maps.Geocoder();
      if (address) {
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const location = results[0].geometry.location;
            map.setCenter(location); // Center the map on the geocoded location

            // Create a new InfoWindow at the geocoded location
            infoWindow.close();
            infoWindow = new window.google.maps.InfoWindow({
              position: location,
              content: `Location: ${address}`,
            });
            infoWindow.open(map);
          } else {
            console.error("Geocode was not successful for the following reason: " + status);
          }
        });
      }

      // Configure the click listener
      map.addListener("click", (mapsMouseEvent: google.maps.MapMouseEvent) => {
        // Close the current InfoWindow
        infoWindow.close();

        // Check if latLng is not null
        const latLng = mapsMouseEvent.latLng;
        if (latLng) {
          // Create a new InfoWindow
          infoWindow = new window.google.maps.InfoWindow({
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

    // Cleanup function to prevent memory leaks
    return () => {
      const mapElement = document.getElementById("map");
      if (mapElement) {
        mapElement.innerHTML = ""; // Clear the map on component unmount
      }
    };
  }, [address]); // Dependency array to re-run effect when address changes

  return (
    <div id="map" className="w-full h-96" />
  );
};

export default Map;
