import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { HiX } from 'react-icons/hi';

// Lazy load the icons
const icons = {
  FaHome: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaHome }))),
  FaFire: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaFire }))),
  FaStar: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaStar }))),
  FaTags: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaTags }))),
  FaMusic: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaMusic }))),
  FaBook: React.lazy(() => import('react-icons/fa').then((mod) => ({ default: mod.FaBook }))),
};

const Slidebar = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);

  // Use `useCallback` to memoize toggle function
  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Close sidebar when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={toggleSidebar}
        className="p-4 bg-gray-800 text-white rounded-md"
        aria-controls="sidebar-menu"
        aria-expanded={isOpen}
        aria-label="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <div
        id="sidebar-menu"
        className={`fixed top-0 left-0 w-64 bg-white h-full shadow-md z-50 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
        role="navigation"
        aria-label="Sidebar Menu"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Menu</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-black"
            aria-label="Close Sidebar"
          >
            <HiX className="text-2xl" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {[
              { href: '/home', label: 'Home', Icon: icons.FaHome },
              { href: '/trending', label: 'Trending', Icon: icons.FaFire },
              { href: '/bestsellers', label: 'Best Sellers', Icon: icons.FaStar },
              { href: '/deals', label: "Today's Deals", Icon: icons.FaTags },
              { href: '/digital-content', label: 'Digital Content', Icon: icons.FaMusic },
              { href: '/kindle', label: 'Chat AI', Icon: icons.FaBook },
            ].map(({ href, label, Icon }) => (
              <li key={href} className="flex items-center">
                <React.Suspense fallback={<span>Loading...</span>}>
                  <Icon className="text-gray-600 mr-2" />
                </React.Suspense>
                <Link href={href} className="text-gray-700 hover:text-gray-900">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
});

Slidebar.displayName = 'Slidebar';

export default Slidebar;
