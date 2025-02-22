import React, { useState } from 'react';
import Image from 'next/image';

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    "/img1.jpeg",
    "/img8.jpeg",
    "/img6.jpeg",
    "/img7.jpeg",
  ];

  return (
    <div className="max-w-screen-2xl pt-48 mx-auto relative">
      {/* Promotional Section */}
      <div className="bg-purple-700 text-white p-4 text-center rounded-lg shadow-xl">
        <p className="text-lg font-bold">Great Summer Festival</p>
        
        {/* Slide Images */}
        <div className="flex justify-center mt-4 space-x-4">
          {slides.map((slide, index) => (
            <Image
              key={index}
              src={slide}
              alt={`Slide ${index + 1}`}
              width={100}
              height={100}
              className={`shadow-lg rounded-lg transition-all duration-300 ${currentSlide === index ? 'opacity-100 scale-110' : 'opacity-50'}`}
            />
          ))}
        </div>
        
        {/* Dots for Navigation */}
        <div className="flex justify-center mt-4 space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;

