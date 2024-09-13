import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CartPage from '../components/Cart1';
import BottomNavbar from '../components/BottonNavbar';
import PromotionSection from '../components/PromotionSection'; 

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow pt-12">
        <Banner />
      </div>
      
      <PromotionSection />
      
      <CartPage />
      <BottomNavbar />
    </div>
  );
};

export default Home;
