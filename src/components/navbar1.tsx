import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Slidebar from './slidebar1';
import Image from 'next/image';
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

    const iconUrls = {
        stay: "/stay.png",
        food: "/food.png",
        travel: "/travel.png"
    };

    return (
        <div>
            <div className="bg-gray-100 flex items-center justify-between px-4 py-2 shadow-md">
                <div className={`flex items-center ${isSearchOpen ? 'hidden' : 'flex'} md:flex`}>
                    <div className="hidden md:block">
                        <Slidebar />
                    </div>
                    <div className="text-black font-bold text-2xl ml-2">
                        <Link href="/">SHELTERIC</Link>
                    </div>
                </div>
                <div className="flex items-center space-x-2 justify-center relative">
                    <div className="w-54 md:w-72 lg:w-80">
                        <div className="relative">
                            <input
                                className="w-full p-2 pl-10 rounded-full border border-gray-300"
                                placeholder="Search"
                                type="text"
                            />
                            <MdSearch className="absolute left-3 top-3 text-gray-500" />
                            <MdMic className="absolute right-10 top-3 text-gray-500" />
                            <MdQrCodeScanner className="absolute right-3 top-3 text-gray-500" />
                        </div>
                    </div>
                </div>
                <nav className={`flex items-center space-x-8 ${isSearchOpen ? 'hidden' : 'hidden md:flex'}`}>
                    <Link href="/location" aria-label="Location" className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out">
                        <MdLocationOn className="h-6 w-6 text-gray-950" />
                    </Link>
                    <Link href="/cart" aria-label="Shopping Cart" className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative">
                        <MdShoppingCart className="h-6 w-6 text-gray-950" />
                    </Link>
                    <Link href="/notifications" aria-label="Notifications" className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out relative">
                        <MdNotifications className="h-6 w-6 text-gray-950" />
                    </Link>
                    <button
                        aria-label="User Profile"
                        className="text-gray-600 hover:text-blue-600 transition duration-200 ease-in-out"
                        onClick={navigateToLogin}
                    >
                        <MdPerson className="h-6 w-6 text-gray-950" />
                    </button>
                </nav>
            </div>
            <div className="flex justify-start gap-6 lg:gap-4 mt-2 ml-4">
    <div className="text-center flex flex-col items-center">
        <Image
            alt="Stay Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.stay}
            width={50}
        />
        <p className="text-xs font-bold">Stay</p>
    </div>
    <div className="text-center flex flex-col items-center">
        <Image
            alt="Food Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.food}
            width={50}
        />
        <p className="text-xs font-bold">Food</p>
    </div>
    <div className="text-center flex flex-col items-center">
        <Image
            alt="Travel Icon"
            className="mx-auto mb-3 shadow-lg"
            height={50}
            src={iconUrls.travel}
            width={50}
        />
        <p className="text-xs font-bold">Travel</p>
    </div>
</div>
        </div>
    );
};

export default Navbar;
