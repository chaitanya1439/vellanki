import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Settings = () => {
  const [user, setUser] = useState<{ name: string, phoneNumber: string} | null>(null);
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
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      router.push('/');
    };
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex items-center space-x-4 pb-4 border-b">
        <button className="text-xl"><Link href="/home">←</Link></button>
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-4 mt-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl">{user?.name ? user.name.charAt(0).toUpperCase() : '?' }</span>
          </div>
          <div>
            <span className="text-lg font-semibold">{user?.name || 'User'}</span>
            <p className="text-gray-500">{user?.phoneNumber || 'User'}</p>
          </div>
        </div>
      </div>

      {/* Zepto Cash Section */}
      <div className="bg-purple-100 p-4 mt-4 rounded-lg shadow">
        <h3 className="font-semibold">Cash & Gift Card</h3>
        <div className="flex justify-between items-center mt-2">
          <p className="text-gray-600">Available Balance</p>
          <p className="font-semibold">₹0</p>
        </div>
        <button className="mt-2 w-full bg-purple-600 text-white py-2 rounded-lg">
          Add Balance
        </button>
      </div>

      {/* Menu Options */}
      <div className="bg-white p-4 mt-4 rounded-lg shadow">
        <ul className="space-y-4">
          {[
            { name: "Your Orders", icon: "👜" },
            { name: "E-Gift Cards", icon: "🎁" },
            { name: "Help & Support", icon: "💬" },
            { name: "Refunds", icon: "💰" },
            { name: "Saved Addresses", icon: "📍" },
            { name: "Profile", icon: "👤" },
          ].map((item) => (
            <li key={item.name} className="flex items-center justify-between">
              <span className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </span>
              <span>→</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Other Information */}
      <div className="bg-white p-4 mt-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Other Information</h3>
        <ul className="space-y-4">
          {[
            { name: "Suggest Products", icon: "⭐" },
            { name: "Notifications", icon: "🔔" },
            { name: "General Info", icon: "ℹ️" },
          ].map((item) => (
            <li key={item.name} className="flex items-center justify-between">
              <span className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </span>
              <span>→</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Logout Button */}
      <button className="mt-6 w-full bg-red-500 text-white py-2 rounded-lg"  onClick={handleLogout}>
        Log Out
      </button>
    </div>
  );
};

export default Settings;