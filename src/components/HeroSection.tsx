import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bed, MapPin, Car } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col justify-center hero-gradient">
        <div className="container mx-auto px-4 pt-24 pb-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="h-12 bg-gray-200 rounded animate-pulse w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              <div className="flex flex-wrap gap-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
                <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-[500px] bg-gray-200 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center hero-gradient">
      <div className="container mx-auto px-4 pt-24 pb-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-brand-dark mt-10">
              Your Complete <span className="text-brand-blue">Travel Companion</span> in One App
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl">
              Book stays, order food, and get transportation - all from a single platform. 
              Simplifying travel and accommodation everywhere.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue/90">
                <Link href="/stays">Find a Stay</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/explore">Explore Services</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-6 pt-6">
              <div className="flex items-center gap-2">
                <div className="bg-brand-blue/10 p-2 rounded-full">
                  <Bed size={20} className="text-brand-blue" />
                </div>
                <span className="font-medium">1000+ Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-brand-orange/10 p-2 rounded-full">
                  <MapPin size={20} className="text-brand-orange" />
                </div>
                <span className="font-medium">50+ Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-brand-green/10 p-2 rounded-full">
                  <Car size={20} className="text-brand-green" />
                </div>
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
          
          <div className="relative animate-fade-in">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80"
                alt="Luxury hotel room"
                className="rounded-2xl shadow-xl object-cover"
                width={800}
                height={500}
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.jpg';
                }}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-36 h-36 bg-brand-orange rounded-2xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-blue rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
