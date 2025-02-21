import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import {
  MdShoppingCart,
  MdLocationOn,
  MdSearch,
  MdClose,
  MdNotifications,
  MdLogout,
} from 'react-icons/md';

const Slidebar = React.lazy(() => import('./slidebar'));

interface User {
  id: string;
  name: string;
  email?: string;
}

const Navbar: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSearchChange = debounce((value: string) => {
    console.log('Searching for:', value);
  }, 300);

  return (
    <div>
      {/* Top Navbar */}
      <div className="bg-gray-100 flex items-center justify-between px-4 py-2 shadow-md">
        <div className={`flex items-center ${isSearchOpen ? 'hidden' : 'flex'} md:flex`}>
          <div className="hidden md:block">
            <Suspense fallback={<div>Loading...</div>}>
              <Slidebar />
            </Suspense>
          </div>
          <div className="text-black font-bold text-2xl ml-2">SHELTERIC</div>
        </div>

        <div className="flex items-center flex-1 justify-center relative">
          <input
            type="text"
            className={`w-full max-w-md px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-950 ${
              isSearchOpen ? 'block' : 'hidden md:block'
            }`}
            placeholder="Search for products, brands, and more..."
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <MdSearch
            className={`absolute top-2 right-3 h-6 w-6 text-gray-950 hover:text-blue-600 transition duration-200 ease-in-out cursor-pointer ${
              isSearchOpen ? 'hidden' : 'block md:hidden'
            }`}
            onClick={toggleSearch}
          />
          <MdClose
            className={`absolute top-2 right-3 h-6 w-6 text-gray-950 hover:text-blue-600 transition duration-200 ease-in-out cursor-pointer ${
              isSearchOpen ? 'block' : 'hidden md:hidden'
            }`}
            onClick={toggleSearch}
          />
        </div>

        <nav className={`flex items-center space-x-8 ${isSearchOpen ? 'hidden' : 'hidden md:flex'}`}>
          <button
            aria-label="Location"
            className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out"
          >
            <MdLocationOn className="h-6 w-6 text-gray-950" />
          </button>
          <button
            aria-label="Shopping Cart"
            className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative"
          >
            <MdShoppingCart className="h-6 w-6 text-gray-950" />
          </button>
          <button
            aria-label="Notifications"
            className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative"
          >
            <MdNotifications className="h-6 w-6 text-gray-950" />
          </button>
          <div className="relative">
            <button
              aria-label="User Profile"
              onClick={toggleDropdown}
              className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out flex items-center"
            >
              {user ? (
                <span className="h-8 w-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-800 rounded-full text-lg">
                  ?
                </span>
              )}
            </button>
            {isDropdownOpen && user && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
              >
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-100"
                >
                  <MdLogout className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom Categories */}
      <div className="bg-base-300 px-4 py-2 shadow-sm">
        <ul className="flex space-x-8 text-lg text-black">
          <li>
            <Link href="/home" className="block">
              All
            </Link>
          </li>
          <li>
            <Link href="/stay" className="block">
              Stay
            </Link>
          </li>
          <li>
            <Link href="/food" className="block">
              Food
            </Link>
          </li>
          <li>
            <Link href="/travel" className="block">
              Travel
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
