import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { MdHome, MdShoppingCart, MdFavorite, MdRoomService } from 'react-icons/md';

interface User {
  name: string;
  email?: string;
  phone?: string;
  role: string;
}

const BottomNavbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auth check
  useEffect(() => {
    if (!isClient) return;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch('http://localhost:3001/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Unauthorized');
        }

        const data = await res.json();
        // Validate user data structure
        if (!data?.user || typeof data.user !== 'object') {
          throw new Error('Invalid user data structure');
        }

        const userData = data.user;
        // Ensure required fields exist and are of correct type
        if (typeof userData.name !== 'string' || !userData.name.trim()) {
          throw new Error('Invalid user name');
        }

        // Create a validated user object
        const validatedUser: User = {
          name: userData.name.trim(),
          email: typeof userData.email === 'string' ? userData.email : undefined,
          phone: typeof userData.phone === 'string' ? userData.phone : undefined,
          role: typeof userData.role === 'string' ? userData.role : 'user'
        };

        setUser(validatedUser);
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isClient]);

  const tabs = [
    { key: 'home', label: 'Home', icon: MdHome, href: '/home' },
    { key: 'cart', label: 'Cart', icon: MdShoppingCart, href: '/cart' },
    { key: 'favorites', label: 'Favorites', icon: MdFavorite, href: '/favorites' },
    { key: 'service', label: 'Service', icon: MdRoomService, href: '/service' },
    { key: 'profile', label: 'Profile', icon: null, href: '/settings' },
  ];

  const renderTab = (tab: typeof tabs[number]) => {
    const isActive = activeTab === tab.key;
    const baseClass = 'flex flex-col items-center text-sm transition duration-200 p-2';
    const activeClass = isActive
      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-full'
      : 'text-gray-700';

    return (
      <Link
        key={tab.key}
        href={tab.href!}
        onClick={() => setActiveTab(tab.key)}
        className={`${baseClass} ${activeClass}`}
      >
        {tab.icon ? (
          <tab.icon className="h-6 w-6" />
        ) : (
          <div
            className={`h-6 w-6 ${
              isActive 
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white' 
                : 'bg-gray-300 text-gray-700'
            } flex items-center justify-center rounded-full text-sm font-bold`}
          >
            {isLoading ? (
              <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
            ) : user?.name ? (
              user.name.charAt(0).toUpperCase()
            ) : (
              '?'
            )}
          </div>
        )}
        <span>{tab.label}</span>
      </Link>
    );
  };

  if (!isClient) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md md:hidden">
        <ul className="flex justify-around items-center py-2">
          {tabs.map((tab) => (
            <div
              key={tab.key}
              className="flex flex-col items-center text-sm p-2 text-gray-400"
            >
              <div className="h-6 w-6 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-12 bg-gray-200 rounded mt-1 animate-pulse" />
            </div>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-md md:hidden">
      <ul className="flex justify-around items-center py-2">
        {tabs.map(renderTab)}
      </ul>
    </nav>
  );
};

export default BottomNavbar;
