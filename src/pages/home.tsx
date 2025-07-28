import React, { useEffect, useState, startTransition } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CartPage from '../components/Cart1';
import BottomNavbar from '../components/BottonNavbar';
import PromotionSection from '../components/PromotionSection';
import HeroSection from '../components/HeroSection';
import ServicesOverview from '../components/ServicesOverview';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true after component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

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
  }, [router.isReady, router.query.token, router.pathname, router]);

  // Effect to check for token and fetch user info
  useEffect(() => {
    if (!isClient) return; // Don't run on server-side

    const token = localStorage.getItem('token');
    if (!token) {
      startTransition(() => {
        router.push('/');
      });
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/auth/me', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          throw new Error('Auth failed');
        }

        const data = await res.json();
        
        // Validate user data structure
        if (!data?.user || typeof data.user !== 'object') {
          throw new Error('Invalid user data structure');
        }

        const userData = data.user;
        
        // Ensure required fields exist and are of correct type
        if (typeof userData.id !== 'string' || !userData.id.trim()) {
          throw new Error('Invalid user ID');
        }
        
        if (typeof userData.name !== 'string' || !userData.name.trim()) {
          throw new Error('Invalid user name');
        }

        // Create a validated user object
        const validatedUser: User = {
          id: userData.id.trim(),
          name: userData.name.trim(),
          email: typeof userData.email === 'string' ? userData.email : undefined,
          phone: typeof userData.phone === 'string' ? userData.phone : undefined,
        };

        // If profile incomplete, redirect to registration
        if (!validatedUser.email || !validatedUser.phone) {
          startTransition(() => {
            router.push('/registration');
          });
        } else {
          startTransition(() => {
            setUser(validatedUser);
            setLoading(false);
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        localStorage.removeItem('token');
        startTransition(() => {
          router.push('/');
        });
      }
    };

    fetchUser();
  }, [router, isClient]);

  // Show loading state while data is being fetched
  if (loading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Fixed navigation bar */}
      <div className="bg-gray-100 w-full fixed top-0 left-0 z-50">
        <Navbar />
      </div>
      {/* Main content */}
      <div className="flex-grow pt-12">
        <HeroSection />
        <Banner />
        <ServicesOverview />
      </div>
      
      <PromotionSection />

      {/* Display user welcome message */}
      {user?.name && (
        <div className="text-center py-4">
          <p className="text-lg font-semibold">Welcome, {user.name}!</p>
        </div>
      )}
      
      <CartPage />
      <BottomNavbar />
    </div>
  );
};

export default Home;