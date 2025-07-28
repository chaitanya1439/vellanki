import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Bed, Hotel, House, MapPin, Utensils, Bike, Car, CarTaxiFront, Ambulance } from 'lucide-react';

const ServicesOverview: React.FC = () => {
  const serviceCategories = [
    { 
      title: "Stay Services",
      description: "Find and book the perfect accommodation for your needs",
      services: [
        { name: "Hotels", icon: <Hotel className="text-brand-blue" size={24} /> },
        { name: "Rooms", icon: <Bed className="text-brand-blue" size={24} /> },
        { name: "Houses", icon: <House className="text-brand-blue" size={24} /> }
      ]
    },
    { 
      title: "Food Services",
      description: "Discover restaurants and get food delivered to your doorstep",
      services: [
        { name: "Restaurants", icon: <Utensils className="text-brand-orange" size={24} /> },
        { name: "Food Delivery", icon: <MapPin className="text-brand-orange" size={24} /> }
      ]
    },
    { 
      title: "Travel Services",
      description: "Book rides for all your transportation needs",
      services: [
        { name: "Bikes", icon: <Bike className="text-brand-green" size={24} /> },
        { name: "Cabs", icon: <Car className="text-brand-green" size={24} /> },
        { name: "Taxi", icon: <CarTaxiFront className="text-brand-green" size={24} /> },
        { name: "Ambulance", icon: <Ambulance className="text-brand-green" size={24} /> }
      ]
    }
  ];

  return (
    <section className="py-16 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">All Services in One Place</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Shelteric brings together everything you need for a comfortable stay, delicious meals, and convenient travel.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {serviceCategories.map((category, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                <p className="text-gray-600 mb-8">{category.description}</p>
                <div className="grid grid-cols-2 gap-6">
                  {category.services.map((service, serviceIndex) => (
                    <div 
                      key={serviceIndex} 
                      className="flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="mb-2">
                        {service.icon}
                      </div>
                      <span className="font-medium">{service.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
