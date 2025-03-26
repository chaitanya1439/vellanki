import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const FoodDelivery = () => {
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
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Location & Search */}
      <div className="bg-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-red-600">Sri Sai Nagar</h2>
            <p className="text-sm text-gray-500">Jahangir Nagar Colony, L. B. Nagar, Chint...</p>
          </div>
          <div className="bg-gray-200 p-2 rounded-full">
            <Link href="/settings"><span className="text-blue-500 font-bold">{user?.name ? user.name.charAt(0).toUpperCase() : '?' }</span></Link>
          </div>
        </div>

        <div className="mt-4 flex items-center bg-gray-100 p-2 rounded-lg">
          <input
            type="text"
            placeholder='Search "pizza"'
            className="bg-transparent flex-grow p-2 outline-none"
          />
          <button className="text-gray-500">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 21l-4.35-4.35M16 9a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Free Delivery Banner */}
      <div className="text-center py-6 bg-yellow-100">
        <h1 className="text-3xl font-bold text-yellow-700">FREE DELIVERY</h1>
        <p className="text-sm text-gray-600">and extra discounts with GOLD</p>
        <button className="mt-2 bg-black text-white px-4 py-2 rounded-lg">Join Gold now →</button>
      </div>

      {/* Categories */}
      <div className="flex overflow-x-scroll space-x-4 p-4">
        {["All", "Biryani", "Chicken", "Pizza"].map((category) => (
          <button key={category} className="bg-white shadow-md px-4 py-2 rounded-lg text-sm">
            {category}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex justify-between px-4 py-2">
        <button className="bg-gray-200 px-4 py-2 rounded-lg">Filters</button>
        <button className="bg-gray-200 px-4 py-2 rounded-lg">Under ₹250</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded-lg">New</button>
        <button className="bg-gray-200 px-4 py-2 rounded-lg">Schedule</button>
      </div>

      {/* Explore More */}
      <div className="p-4">
        <h3 className="text-lg font-bold">Explore More</h3>
        <div className="flex space-x-4 mt-2">
          {["Everyday", "Offers", "Plan"].map((item) => (
            <div key={item} className="bg-white shadow-md p-4 rounded-lg">
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white flex justify-around py-4 shadow-md">
        <button className="text-red-500 font-bold">Delivery</button>
        <button className="text-gray-500">Dining</button>
      </div>
    </div>
  );
};

export default FoodDelivery;
