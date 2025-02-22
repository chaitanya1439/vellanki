import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link'; 
import Slidebar from './slidebar1';
import { 
  MdShoppingCart, 
  MdPerson, 
  MdLocationOn, 
  MdNotifications, 
  MdSearch, 
  MdMic, 
  MdQrCodeScanner 
} from 'react-icons/md';

const Navbar: React.FC = () => {
    const [isSearchOpen] = useState(false);
    const router = useRouter();

   

    const navigateToLogin = () => {
        router.push('/login');
    };

    return (
        <div>
            {/* Main Navbar */}
            <div className="bg-gray-100 flex items-center justify-between px-4 py-2 shadow-md">
                {/* Slidebar and SHELTERIC text */}
                <div className={`flex items-center ${isSearchOpen ? 'hidden' : 'flex'} md:flex`}>
                    <div className="hidden md:block">
                        <Slidebar />
                    </div>
                    <div className="text-black font-bold text-2xl ml-2">
                        SHELTERIC
                    </div>
                </div>

                {/* Responsive Search Section */}
                <div className="flex items-center space-x-2 justify-center relative">
                    <div className="w-64 md:w-72 lg:w-80">
                        <div className="relative">
                            <input
                                className="w-full p-2 pl-10 rounded-full border border-gray-300"
                                placeholder="Search "
                                type="text"
                            />
                            <MdSearch className="absolute left-3 top-3 text-gray-500" />
                            <MdMic className="absolute right-10 top-3 text-gray-500" />
                            <MdQrCodeScanner className="absolute right-3 top-3 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
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

                    <button 
                        aria-label="User Profile" 
                        className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out"
                        onClick={navigateToLogin}
                    >
                        <MdPerson className="h-6 w-6 text-gray-950" />
                    </button>
                </nav>
            </div>

            {/* Secondary Navbar */}
            <div className="bg-base-300 px-4 py-2 shadow-sm">
                <ul className="flex space-x-8 text-lg text-gray-950">
                    <li>
                        <Link href="/all">
                            All
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Stay
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Food
                        </Link>
                    </li>
                    <li>
                        <Link href="/login">
                            Travel
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Navbar;
