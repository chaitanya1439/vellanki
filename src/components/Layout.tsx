import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import BottomNavbar from './BottonNavbar';

interface LayoutProps { children: ReactNode; }
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar hideToAddress />
      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>
      <BottomNavbar />
    </div>
  );
}