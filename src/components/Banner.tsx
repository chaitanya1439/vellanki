import React, { useState } from 'react';
import Image from 'next/image';

const Banner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = ["/img1.jpeg", "/img8.jpeg", "/img6.jpeg", "/img7.jpeg"];

  return (
    <div className="max-w-screen-lg mx-auto p-4 sm:p-6 mt-6 sm:mt-16">
      {/* Promotional Section */}
      <div className="bg-purple-700 text-white p-12 rounded-lg shadow-xl flex flex-col items-center space-y-6 w-full sm:w-3/4 lg:w-3/4 max-w-3xl mx-auto">
        <p className="text-2xl sm:text-3xl font-bold text-center">Great Summer Festival</p>

        {/* Slide Images */}
        <div className="w-full flex justify-center overflow-hidden">
          <Image
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            width={800}
            height={350}
            className="rounded-lg shadow-lg object-cover w-full max-h-72"
          />
        </div>

        {/* Dots for Navigation */}
        <div className="flex justify-center mt-3 space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-gray-400'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
