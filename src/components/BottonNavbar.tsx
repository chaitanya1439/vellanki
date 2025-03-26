import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MdHome, MdShoppingCart, MdFavorite } from 'react-icons/md';
import Slidebar from './slidebar';

const BottomNavbar: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/auth/me', {
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
            >
              <div className="h-6 w-6 bg-gray-600 text-white flex items-center justify-center rounded-full text-sm font-bold">
                {user?.name ? user.name.charAt(0).toUpperCase() : '?' }
              </div>
              <Link href="/settings"><span>Profile</span></Link>
            </div>
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
