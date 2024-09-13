import Banner from "../components/Banner";
import BottomNavbar from "../components/BottonNavbar1";
import CartPage from "../components/Cart";
import Navbar from "../components/navbar1";

export function Index() {
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      <div className="flex-grow pt-12">
        <Banner />
      </div>
      <CartPage />
      <BottomNavbar />
    </div>
  );
}

export default Index;

