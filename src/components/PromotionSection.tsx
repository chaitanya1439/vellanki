import React from 'react';
import Image from 'next/image'; // Import the Image component

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
  return (
    <div className="py-12 bg-white">
      <h2 className="text-3xl font-bold text-center mb-6">Current Promotions</h2>
      <div className="flex justify-center gap-6 flex-wrap">
        {promotions.map((promo) => (
          <div key={promo.id} className="bg-gray-200 rounded-lg shadow-lg p-4 w-80">
            {/* Use the Image component from Next.js for better optimization */}
            <Image 
              src={promo.image} 
              alt={promo.title} 
              width={400} 
              height={300} 
              className="rounded-md mb-4 w-full h-48 object-cover" 
              priority={promo.id === 1} // Prioritize first promo for faster LCP
            />
            <h3 className="text-xl font-semibold mb-2">{promo.title}</h3>
            <a href={promo.link} className="text-blue-600 hover:underline">
              Learn more
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionSection;
