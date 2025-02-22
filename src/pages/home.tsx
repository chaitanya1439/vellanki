import React, { useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CartPage from '../components/Cart1';
import BottomNavbar from '../components/BottonNavbar';
import PromotionSection from '../components/PromotionSection';

const Home: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // Effect to handle token from query parameters and cleanup URL
  useEffect(() => {
    if (!router.isReady) return;
    
    const queryToken = router.query.token;
    if (queryToken && typeof queryToken === 'string') {
      localStorage.setItem('token', queryToken);
      router
        .replace(router.pathname, undefined, { shallow: true })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router.isReady, router.query.token, router.pathname, router]); // ✅ Fixed dependencies

  // Effect to check for token and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      startTransition(() => {
        router.push('/');
      });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://call.shelteric.com:3001/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          startTransition(() => {
            setUser(data.user);
          });
        } else {
          localStorage.removeItem('token');
          startTransition(() => {
            router.push('/');
          });
        }
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        startTransition(() => {
          router.push('/');
        });
      }
    };

    fetchUser();
  }, [router]);

  // If still loading (or cleaning up the URL), show a loading indicator.
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Fixed navigation bar */}
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      {/* Main content */}
      <div className="flex-grow pt-12">
        <Banner />
      </div>
      
      <PromotionSection />

      {/* Display user welcome message */}
      {user && <p className="text-center text-lg font-semibold">Welcome, {user.username}!</p>}
      
      <CartPage />
      <BottomNavbar />
    </div>
  );
};

export default Home;

