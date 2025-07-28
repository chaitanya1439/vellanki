import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast, Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { sendPushNotification } from '@/utils/notifications';
import { useJsApiLoader } from '@react-google-maps/api';

// Constants
const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 }; // Center of India

// Types
interface Location {
  lat: number;
  lng: number;
}

interface DriverType {
  id: string;
  vehicle_type: string;
  rate: string;
  location: Location;
}

interface TravelTimes {
  driving: string | null;
  walking: string | null;
  bicycling: string | null;
  transit: string | null;
}

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text: string;
    secondary_text: string;
  };
}

interface RouteInfo {
  distance: number;
  duration: string;
  distanceText: string;
}

// Dynamically import Google Maps components
const GoogleMap = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.GoogleMap),
  { ssr: false }
);

const Marker = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.Marker),
  { ssr: false }
);


const DirectionsRenderer = dynamic(
  () => import('@react-google-maps/api').then((mod) => mod.DirectionsRenderer),
  { ssr: false }
);

export default function Travel() {
  const router = useRouter();
  const { from, to } = router.query;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_MAPS_LIBRARIES,
    region: 'IN',
    language: 'en',
  });

  // State
  const ws = useRef<WebSocket | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [places, setPlaces] = useState<PlacePrediction[]>([]);
  const [query, setQuery] = useState("");
  const [mapCenter, setMapCenter] = useState<Location>(DEFAULT_CENTER);
  const [marker, setMarker] = useState<Location | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [, setDistance] = useState<number | null>(null);
  const [locationSelected, setLocationSelected] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState("Car");
  const [travelTimes, setTravelTimes] = useState<TravelTimes>({
    driving: null,
    walking: null,
    bicycling: null,
    transit: null,
  });
  const [driverLists, setDriverLists] = useState<DriverType[]>([]);
  const [driverLoader, setDriverLoader] = useState(true);
  const [estimatedArrival, setEstimatedArrival] = useState<string>('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const directionsService = useRef<google.maps.DirectionsService | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);

  // Initialize WebSocket
  const initializeWebSocket = useCallback(() => {
    ws.current = new WebSocket("ws://192.168.31.236:8080");
    
    ws.current.onopen = () => {
      console.log("Connected to websocket server");
      setWsConnected(true);
    };

    ws.current.onerror = (e) => {
      console.log("WebSocket error:", e);
    };

    ws.current.onclose = () => {
      console.log("WebSocket closed");
      setWsConnected(false);
      setTimeout(initializeWebSocket, 5000);
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'nearbyDrivers') {
          setDriverLists(data.drivers);
          setDriverLoader(false);
        }
    } catch (error) {
        console.error('Error parsing WebSocket message:', error);
    }
    };
  }, []);

  useEffect(() => {
    initializeWebSocket();
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [initializeWebSocket]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setCurrentLocation(location);
          setMapCenter(location);
        },
        (error) => {
          toast.error("Error getting location: " + error.message);
          // Fallback to default center if geolocation fails
          setMapCenter(DEFAULT_CENTER);
        }
      );
    }
  }, []);

  // Add effect to handle pre-filled addresses
  useEffect(() => {
    if (from && typeof from === 'string') {
      // Set current location from the "from" address
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: from }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setCurrentLocation(location);
          setMapCenter(location);
        }
      });
    }

    if (to && typeof to === 'string') {
      // Pre-fill the "Where to?" field
      setQuery(to);
      // Get coordinates for the destination
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: to }, (results, status) => {
        if (status === 'OK' && results?.[0]?.geometry?.location) {
          const location = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng()
          };
          setMarker(location);
          setMapCenter(location);
          setLocationSelected(true);
          
          // If we have both locations, calculate route
          if (currentLocation) {
            calculateRoute(currentLocation, location);
            fetchTravelTimes(currentLocation, location);
          }
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to, isLoaded, currentLocation]);





  const handlePlaceSelect = async (placeId: string) => {
    try {
      const response = await axios.get('/api/places', {
        params: {
          input: placeId,
          type: 'details'
        }
      });
      const { lat, lng } = response.data.result.geometry.location;
      const selectedDestination = { lat, lng };
      
      setMapCenter(selectedDestination);
      setMarker(selectedDestination);
      setPlaces([]);
      requestNearbyDrivers();
      setLocationSelected(true);
      
      if (currentLocation) {
        await fetchTravelTimes(currentLocation, selectedDestination);
        calculateRoute(currentLocation, selectedDestination);
      }
    } catch (error) { 
      console.error(error);
      toast.error("Error selecting place");
    }
  };

  const calculateRoute = async (origin: Location, destination: Location) => {
    if (!isLoaded || !directionsService.current) return;

    try {
      const result = await directionsService.current.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(result);
      if (result.routes[0]?.legs[0]) {
        const leg = result.routes[0].legs[0];
        if (leg.distance && leg.duration) {
          const distanceInKm = leg.distance.value / 1000;
          setDistance(distanceInKm);
          setRouteInfo({
            distance: distanceInKm,
            duration: leg.duration.text,
            distanceText: leg.distance.text
          });
        }
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      toast.error('Error calculating route');
    }
  };

  const fetchTravelTimes = async (origin: Location, destination: Location) => {
    const modes = ["driving", "walking", "bicycling", "transit"];
    const newTravelTimes: TravelTimes = {
      driving: null,
      walking: null,
      bicycling: null,
      transit: null,
    };

    for (const mode of modes) {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/distancematrix/json`,
          {
            params: {
              origins: `${origin.lat},${origin.lng}`,
              destinations: `${destination.lat},${destination.lng}`,
              key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
              mode,
              departure_time: mode === "driving" ? "now" : undefined,
            },
          }
        );

        const elements = response.data.rows[0].elements[0];
        if (elements.status === "OK") {
          newTravelTimes[mode as keyof TravelTimes] = elements.duration.text;
        }
      } catch (error) {
        console.error(error);
      }
    }

    setTravelTimes(newTravelTimes);
  };

  const requestNearbyDrivers = () => {
    if (currentLocation && wsConnected && ws.current) {
      ws.current.send(
        JSON.stringify({
          type: "requestRide",
          role: "user",
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
        })
      );
    }
  };

  const handleOrder = async () => {
    if (!currentLocation || !marker || !routeInfo) return;

    try {
      const [currentLocationName, destinationLocationName] = await Promise.all([
        axios.get('/api/places', {
          params: {
            input: `${currentLocation.lat},${currentLocation.lng}`,
            type: 'geocode'
          }
        }),
        axios.get('/api/places', {
          params: {
            input: `${marker.lat},${marker.lng}`,
            type: 'geocode'
          }
        })
      ]);

      const orderData = {
        currentLocation: {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          address: currentLocationName.data.results[0].formatted_address
        },
        destination: {
          latitude: marker.lat,
          longitude: marker.lng,
          address: destinationLocationName.data.results[0].formatted_address
        },
        route: {
          distance: routeInfo.distance.toFixed(2),
          distanceText: routeInfo.distanceText,
          duration: routeInfo.duration
        },
        selectedVehicle,
        estimatedArrival,
        timestamp: new Date().toISOString()
      };

      // Send to WebSocket server
      if (ws.current && wsConnected) {
        ws.current.send(JSON.stringify({
          type: "rideRequest",
          data: orderData,
        }));

        // Send notifications to all nearby drivers
        if (driverLists.length > 0) {
          const notifications = driverLists.map(driver => {
            const notificationData = {
              currentLocation: {
                latitude: currentLocation.lat,
                longitude: currentLocation.lng
              },
              marker: {
                latitude: marker.lat,
                longitude: marker.lng
              },
              distance: routeInfo.distance.toFixed(2),
              currentLocationName: currentLocationName.data.results[0].formatted_address,
              destinationLocation: destinationLocationName.data.results[0].formatted_address,
              driver: {
                id: driver.id,
                vehicle_type: driver.vehicle_type,
                rate: driver.rate
              }
            };
            return sendPushNotification(driver.id, { orderData: notificationData });
          });

          await Promise.all(notifications);
          toast.success("Ride request sent to nearby drivers!");
        } else {
          toast.error("No drivers available nearby");
        }
      } else {
        toast.error("Connection lost. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending ride request");
    }
  };

  // Helper function to parse duration string to minutes
  const parseDuration = (duration: string): number => {
    const parts = duration.split(' ');
    let minutes = 0;
    for (let i = 0; i < parts.length; i += 2) {
      const value = parseInt(parts[i]);
      const unit = parts[i + 1];
      if (unit.includes('hour')) {
        minutes += value * 60;
      } else if (unit.includes('min')) {
        minutes += value;
      }
    }
    return minutes;
  };

  // Calculate estimated arrival time
  const calculateEstimatedArrival = useCallback((travelTime: string | null) => {
    if (!travelTime) return 'N/A';
    const now = moment();
    const travelMinutes = parseDuration(travelTime);
    const arrivalTime = now.add(travelMinutes, 'minutes');
    return arrivalTime.format('h:mm A');
  }, []);

  // Update estimated arrival when travel times change
  useEffect(() => {
    if (travelTimes.driving) {
      setEstimatedArrival(calculateEstimatedArrival(travelTimes.driving));
    }
  }, [travelTimes.driving, calculateEstimatedArrival]);

  // Update the DirectionsRenderer options
  const directionsRendererOptions = {
    suppressMarkers: true,
    polylineOptions: {
      strokeColor: '#3B82F6',
      strokeWeight: 5,
      strokeOpacity: 0.8,
    },
    preserveViewport: true,
    hideRouteList: true,
    panel: null,
    draggable: false,
    suppressInfoWindows: true,
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar hideToAddress />
      <Toaster position="top-right" />
      <div className="flex flex-col h-screen">
        <div className="h-1/2">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: mapCenter.lat, lng: mapCenter.lng }}
            zoom={15}
            options={{
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {marker && (
              <Marker
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: "#FF4B4B",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 2,
                  anchor: new google.maps.Point(12, 24),
                }}
                label={{
                  text: "Drop-off",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                  className: "marker-label"
                }}
              />
            )}
            {currentLocation && (
              <Marker
                position={{ lat: currentLocation.lat, lng: currentLocation.lng }}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: "#4285F4",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 2,
                  anchor: new google.maps.Point(12, 24),
                }}
                label={{
                  text: "Pick-up",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  fontWeight: "bold",
                  className: "marker-label"
                }}
              />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={directionsRendererOptions}
              />
            )}
          </GoogleMap>
        </div>

        <div className="p-4">
          {locationSelected ? (
            <div>
              {driverLoader ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <button onClick={() => setLocationSelected(false)}>
                      ← Back
                    </button>
                    <h2 className="text-xl font-semibold">Gathering options</h2>
                  </div>

                  {routeInfo && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-500">Distance</div>
                          <div className="font-semibold">{routeInfo.distanceText}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-semibold">{routeInfo.duration}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {driverLists.map((driver) => (
                      <Card
                        key={driver.id}
                        className={`p-4 cursor-pointer ${
                          selectedVehicle === driver.vehicle_type ? 'border-2 border-blue-500' : ''
                        }`}
                        onClick={() => setSelectedVehicle(driver.vehicle_type)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-semibold">
                              RideWave {driver.vehicle_type}
                            </h3>
                            <p className="text-gray-600">
                              {travelTimes.driving} dropoff
                            </p>
                            <p className="text-sm text-gray-500">
                              Arrival: {estimatedArrival}
                            </p>
                          </div>
                          <div className="text-xl font-semibold">
                            BDT {(routeInfo ? routeInfo.distance * parseFloat(driver.rate) : 0).toFixed(2)}
                          </div>
                        </div>
                      </Card>
                    ))}
                    
                    <Button
                      className="w-full bg-black text-white"
                      onClick={handleOrder}
                      disabled={!routeInfo}
                    >
                      Confirm Booking
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <button onClick={() => router.back()}>
                  ← Back
                </button>
                <h2 className="text-2xl font-semibold">Plan your ride</h2>
              </div>

              <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
                <span className="mr-2">🕒</span>
                <span className="font-semibold">Pick-up now ({moment().format('h:mm A')})</span>
                <span className="ml-2">▼</span>
              </div>

              <div className="border-2 border-black rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="mr-2">📍</span>
                  <span className="text-blue-600">Current Location</span>
                </div>

                <div className="relative">
                  <Input
                    placeholder="Where to?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>

                {places.length > 0 && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {places.map((place) => (
                      <div
                        key={place.place_id}
                        className="flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                        onClick={() => handlePlaceSelect(place.place_id)}
                      >
                        <span className="mr-3 text-gray-400">📍</span>
                        <div>
                          <div className="font-medium text-gray-900">{place.description}</div>
                          <div className="text-sm text-gray-500">
                            {place.structured_formatting?.secondary_text || ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {!locationSelected && query.length > 0 && places.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  No places found. Try a different search term.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
  