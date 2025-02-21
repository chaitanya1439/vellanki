import { useRouter } from "next/router";
import Banner from "../components/Banner";
import BottomNavbar from "../components/BottonNavbar1";
import CartPage from "../components/Cart";
import Navbar from "../components/navbar1";
import { useEffect } from "react";

export function Index() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/home');
    }
  }, [router]);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow pt-12">
        <Banner />
      </div>
      <CartPage />
      <p>
        
      </p>
      <BottomNavbar />
    </div>
  );
}

export default Index;

