import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { debounce } from 'lodash';
import {
  MdShoppingCart,
  MdLocationOn,
  MdSearch,
  MdNotifications,
  MdMic,
  MdQrCodeScanner,
} from 'react-icons/md';

const Slidebar = React.lazy(() => import('./slidebar'));

const iconUrls = {
  stay: '/stay.png', // Update these paths as needed
  food: '/food.png',
  travel: '/travel.png',
};

interface User {
  id: string;
  name: string;
  email?: string;
}

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('https://calling.shelteric.com/api/auth/me', {
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



  const handleSearchChange = debounce((value: string) => {
    console.log('Searching for:', value);
  }, 300);

  return (
    <div>
      {/* Top Navbar */}
      <div className="bg-gray-100 flex items-center justify-between px-4 py-2 shadow-md">
        <div className="flex items-center md:flex">
          <div className="hidden md:block">
            <Suspense fallback={<div>Loading...</div>}>
              <Slidebar />
            </Suspense>
          </div>
          <div className="text-black font-bold text-xl ml-2"><Link href="/home">SHELTERIC</Link></div>
        </div>

        {/* New Search Bar */}
        <div className="flex items-center space-x-2 justify-center relative w-full max-w-md">
          <div className="w-37 sm:w-40 md:w-72 lg:w-80">
            <div className="relative">
              <input
                className="w-full p-2 pl-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-400"
                placeholder="Search"
                type="text"
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={(e) => e.target.value === '' && setIsTyping(false)}
              />
              <MdSearch className="absolute left-3 top-3 text-gray-500" />
              {!isTyping && (
                <>
                  <MdMic className="absolute right-10 top-3 text-gray-500 transition-opacity duration-200" />
                  <MdQrCodeScanner className="absolute right-3 top-3 text-gray-500 transition-opacity duration-200" />
                </>
              )}
            </div>
          </div>
        </div>

        <nav className="flex items-center space-x-8 hidden md:flex">
          <button className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out">
            <MdLocationOn className="h-6 w-6 text-gray-950" />
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative">
            <MdShoppingCart className="h-6 w-6 text-gray-950" />
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative">
            <MdNotifications className="h-6 w-6 text-gray-950" />
          </button>
          <div className="relative">
            <button
              className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out flex items-center"
            >
              <Link href="/settings">
              {user ? (
                <span className="h-8 w-8 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="h-8 w-8 flex items-center justify-center bg-gray-300 text-gray-800 rounded-full text-lg">
                  ?
                </span>
              )}</Link>
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Categories with Images */}
      <div className="flex justify-start gap-6 lg:gap-4 mt-2 ml-4">
        <Link href="/stay" className="text-center flex flex-col items-center">
          <Image
            alt="Stay Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.stay}
            width={50}
          />
          <p className="text-xs font-bold">Stay</p>
        </Link>
        <Link href="/food" className="text-center flex flex-col items-center">
          <Image
            alt="Food Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.food}
            width={50}
          />
          <p className="text-xs font-bold">Food</p>
        </Link>
        <Link href="/travel" className="text-center flex flex-col items-center">
          <Image
            alt="Travel Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.travel}
            width={50}
          />
          <p className="text-xs font-bold">Travel</p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
