import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdHome, MdShoppingCart, MdFavorite, MdLogout } from 'react-icons/md';
import Slidebar from './slidebar';

const BottomNavbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://192.168.31.236:3001/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          router.push('/');
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        router.push('/');
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white shadow-md md:hidden">
      <ul className="flex justify-around items-center py-2">
        <li>
          <Link href="/home" className="flex flex-col items-center text-sm hover:text-blue-500 transition duration-200">
            <MdHome className="h-6 w-6" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <Link href="/cart" className="flex flex-col items-center text-sm hover:text-blue-500 transition duration-200">
            <MdShoppingCart className="h-6 w-6" />
            <span>Cart</span>
          </Link>
        </li>
        <li>
          <Link href="/favorites" className="flex flex-col items-center text-sm hover:text-blue-500 transition duration-200">
            <MdFavorite className="h-6 w-6" />
            <span>Favorites</span>
          </Link>
        </li>
        <li>
          <div className="relative">
            <div
              className="flex flex-col items-center text-sm hover:text-blue-500 transition duration-200 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="h-6 w-6 bg-gray-600 text-white flex items-center justify-center rounded-full text-sm font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : '?' }
              </div>
              <span>Profile</span>
            </div>
            {isDropdownOpen && (
              <div className="absolute bottom-12 right-0 bg-gray-700 text-white p-2 rounded-lg shadow-lg">
                <div className="flex items-center mb-2">
                  <div className="h-6 w-6 bg-gray-600 text-white flex items-center justify-center rounded-full text-sm font-bold mr-2">
                    {user?.name ? user.name.charAt(0).toUpperCase() : '?' }
                  </div>
                  <span className="text-sm">{user?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-red-500 hover:text-red-600 transition duration-200"
                >
                  <MdLogout className="h-5 w-5 mr-2" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            )}
          </div>
        </li>
        <li>
          <div className="flex flex-col items-center text-sm hover:text-blue-500 transition duration-200">
            <Slidebar />
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default BottomNavbar;
