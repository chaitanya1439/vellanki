import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Promotion = {
  id: number;
  title: string;
  image: string;
  link: string;
};

const promotions: Promotion[] = [
  { id: 1, title: 'Summer Sale', image: '/promo1.jpg', link: '/promotions/summer-sale' },
  { id: 2, title: 'Weekend Discount', image: '/promo2.jpg', link: '/promotions/weekend-discount' },
];

const PromotionSection = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="py-12 bg-white">
        <h2 className="text-3xl font-bold text-center mb-6">Current Promotions</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {promotions.map((promo) => (
            <div key={promo.id} className="bg-gray-200 rounded-lg shadow-lg p-4 w-80">
              <div className="w-full h-48 bg-gray-300 rounded-md mb-4 animate-pulse" />
              <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
              <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Current Promotions</h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-gray-200 rounded-lg shadow-lg p-4 w-80">
            <Image 
              src={promo.image} 
              alt={promo.title} 
              width={400} 
              height={300} 
              className="rounded-md mb-4 w-full h-48 object-cover" 
              priority={promo.id === 1}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.jpg';
              }}
            />
            <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
            <Link href={promo.link} className="text-blue-600 hover:underline">
              Learn more
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionSection;
