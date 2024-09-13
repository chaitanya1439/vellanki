import React from 'react';

// Define TypeScript type for Hero content
type HeroContent = {
  image: string;
  title: string;
  description: string;
};

// Function to get content based on location
const getHeroContent = (location: string): HeroContent => {
  if (location === 'city1') {
    return { image: 'city1.jpg', title: 'Explore City1', description: 'Best stays in City1' };
  }
  return { image: 'default.jpg', title: 'Welcome to STAY', description: 'Book your stay with us' };
};

// Define props type for the component
interface HeroSectionProps {
  location: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ location }) => {
  const { image, title, description } = getHeroContent(location);

  return (
    <section className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h1 className="text-4xl font-bold md:text-6xl">{title}</h1>
        <p className="mt-4 text-lg md:text-2xl">{description}</p>
        <button className="px-8 py-3 mt-6 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
          Book Now
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
