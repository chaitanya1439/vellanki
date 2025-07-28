// components/Navbar.tsx
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { MdShoppingCart, MdLocationOn, MdNotifications } from 'react-icons/md';
import { useJsApiLoader } from '@react-google-maps/api';
import SearchBar from './SearchBar';

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

const iconUrls: Record<string, string> = {
  stay: '/stay.png',
  food: '/food.png',
  travel: '/travel.png',
};

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

interface NavbarProps {
  hideToAddress?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ hideToAddress = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [showOnlySearch, setShowOnlySearch] = useState(false);
  const [isSelectingFrom, setIsSelectingFrom] = useState(false);
  const [showLocationBtn, setShowLocationBtn] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { isLoaded } = useJsApiLoader(GOOGLE_MAPS_API_OPTIONS);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // add/remove scroll shadow
  useEffect(() => {
    if (!isClient) return;
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isClient]);

  // auth check
  useEffect(() => {
    if (!isClient) return;
    
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return void router.push('/login');
        }
        
        const res = await fetch(
          `http://localhost:3001/api/auth/me`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error('Auth failed');
        }

        const data = await res.json();
        
        // Validate user data structure
        if (!data?.user || typeof data.user !== 'object') {
          throw new Error('Invalid user data structure');
        }

        const userData = data.user;
        
        // Ensure required fields exist and are of correct type
        if (typeof userData.id !== 'string' || !userData.id.trim()) {
          throw new Error('Invalid user ID');
        }
        
        if (typeof userData.name !== 'string' || !userData.name.trim()) {
          throw new Error('Invalid user name');
        }

        // Create a validated user object
        const validatedUser: User = {
          id: userData.id.trim(),
          name: userData.name.trim(),
          email: typeof userData.email === 'string' ? userData.email : undefined,
          phone: typeof userData.phone === 'string' ? userData.phone : undefined,
          role: typeof userData.role === 'string' ? userData.role : 'user'
        };

        setUser(validatedUser);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, isClient]);

  // autofill FROM via Geolocation
  const handleLiveLocation = () => {
    if (!isClient || !navigator.geolocation || !isLoaded || !window.google) {
      alert('Geolocation or Maps API not available');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            let addr = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
            if (status === 'OK' && results?.[0]?.formatted_address) {
              addr = results[0].formatted_address;
            }
            setLocationName(addr);
            setFromAddress(addr);
            setLocationLoading(false);
            setShowLocationBtn(false);
          }
        );
      },
      () => {
        alert('Unable to retrieve your location.');
        setLocationLoading(false);
      }
    );
  };

  // open the mobile full-screen picker
  const openFullScreenSearch = () => {
    setShowOnlySearch(true);
    setIsSelectingFrom(false);
  };

  // when user picks "To"
  const handleToAddressSearch = (addr: string) => {
    setToAddress(addr);
    if (fromAddress) {
      router.push(
        `/travel?from=${encodeURIComponent(fromAddress)}&to=${encodeURIComponent(addr)}`
      );
    } else {
      setIsSelectingFrom(true);
      handleLiveLocation();
    }
  };

  // when user picks "From"
  const handleFromAddressSearch = (addr: string) => {
    setFromAddress(addr);
    if (toAddress) {
      router.push(
        `/travel?from=${encodeURIComponent(addr)}&to=${encodeURIComponent(toAddress)}`
      );
    } else {
      setIsSelectingFrom(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/80 backdrop-blur-md py-5'
      }`}
    >
      {showOnlySearch ? (
        <div className="min-h-screen bg-transparent flex flex-col">
          <div className="w-full max-w-md">
            {!isSelectingFrom ? (
              !hideToAddress && (
                <SearchBar
                  placeholder="To address"
                  value={toAddress}
                  setValue={setToAddress}
                  onSearch={handleToAddressSearch}
                  countryCode="in"
                />
              )
            ) : (
              <SearchBar
                placeholder="From address"
                value={fromAddress}
                setValue={setFromAddress}
                onSearch={handleFromAddressSearch}
                countryCode="in"
              />
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop / Tablet */}
          <div className="container mx-auto px-4 flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <Link href="/home" className="flex items-center space-x-2 group">
                  <Image
                    src="/shelteric.jpg"
                    alt="Shelteric Logo"
                    width={40}
                    height={40}
                    className="h-10 w-auto rounded-full shadow"
                  />
                  <span className="text-2xl font-bold text-brand-blue group-hover:text-blue-700 transition">
                    Shelteric
                  </span>
                </Link>
                {locationName && (
                  <div className="mt-1 text-xs text-brand-blue font-semibold flex items-center">
                    <MdLocationOn className="inline-block mr-1 text-base" />
                    <span className="truncate max-w-xs">{locationName}</span>
                  </div>
                )}
              </div>

              <nav className="hidden md:flex items-center space-x-4">
                <div className="w-64">
                  {!hideToAddress && (
                    <SearchBar
                      placeholder="To address"
                      value={toAddress}
                      setValue={setToAddress}
                      onSearch={handleToAddressSearch}
                      countryCode="in"
                    />
                  )}
                </div>
                <Link href="/stays" className="font-medium hover:text-brand-blue transition-colors">
                  Stays
                </Link>
                <Link href="/food" className="font-medium hover:text-brand-blue transition-colors">
                  Food
                </Link>
                <Link href="/travel" className="font-medium hover:text-brand-blue transition-colors">
                  Travel
                </Link>
                <button onClick={handleLiveLocation} className="hover:text-blue-600 transition">
                  <MdLocationOn className="text-xl text-gray-700" />
                </button>
                <button className="hover:text-blue-600 transition">
                  <MdShoppingCart className="text-xl text-gray-700" />
                </button>
                <button className="hover:text-blue-600 transition">
                  <MdNotifications className="text-xl text-gray-700" />
                </button>
                <Link href="/settings" className="flex items-center">
                  {isLoading ? (
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
                  ) : user?.name ? (
                    <div className="h-8 w-8 flex items-center justify-center bg-blue-600 text-white rounded-full font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-600 rounded-full">
                      ?
                    </div>
                  )}
                </Link>
              </nav>
            </div>
          </div>

          {/* Mobile */}
          <div className="md:hidden px-4 mt-2">
            <div className="relative flex items-center gap-2">
              {!hideToAddress && (
                <input
                  onFocus={openFullScreenSearch}
                  value={toAddress}
                  readOnly
                  placeholder="To address"
                  className="w-full border border-gray-300 rounded-full p-2"
                />
              )}
              {showLocationBtn && (
                <button
                  onClick={handleLiveLocation}
                  disabled={locationLoading}
                  className="absolute right-3 top-2.5"
                >
                  <MdLocationOn
                    className={`text-xl ${
                      locationLoading ? 'animate-pulse text-blue-500' : 'text-gray-700'
                    }`}
                  />
                </button>
              )}
            </div>
          </div>

          <div className="container mx-auto flex justify-between mt-6 pb-2 border-b md:hidden px-4">
            {Object.entries(iconUrls).map(([key, url]) => (
              <Link
                key={key}
                href={`/${key}`}
                className="flex flex-col items-center hover:scale-105 hover:opacity-90 transition"
              >
                <Image
                  src={url}
                  alt={`${key} icon`}
                  width={48}
                  height={48}
                  className="shadow-md rounded-full border border-gray-200"
                />
                <span className="mt-1 text-sm font-semibold text-gray-700">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;

