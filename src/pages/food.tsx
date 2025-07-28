import React from 'react'; 
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Search, Utensils, Clock, ChefHat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image'; 

const Food: React.FC = () => {
  const cuisineTypes = [
    "Italian", "Mexican", "Chinese", "Indian", "American", "Japanese", "Korean", "Thai", "Vietnamese", "Mediterranean"
  ];

  const popularRestaurants = [
    "The Italian Place", "Mexican Grill", "Panda Express", "Curry House", "Burger Joint", "Sushi Bar", "Korean BBQ", "Thai Spice", "Pho House", "Greek Taverna"
  ];

  const foodDeliveryOptions = [
    {
      id: 1,
      name: "Pizza",
      restaurant: "The Italian Place",
      price: 15,
      time: "20-25 min",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1593560708920-6195cbfa5765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2935&q=80"
    },
    {
      id: 2,
      name: "Tacos",
      restaurant: "Mexican Grill",
      price: 12,
      time: "15-20 min",
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2935&q=80"
    },
    {
      id: 3,
      name: "Kung Pao Chicken",
      restaurant: "Panda Express",
      price: 18,
      time: "25-30 min",
      rating: 4.0,
      image: "https://images.unsplash.com/photo-1624517863558-4959c711cae8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    },
    {
      id: 4,
      name: "Butter Chicken",
      restaurant: "Curry House",
      price: 20,
      time: "30-35 min",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1614353394941-3434f2ea99d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    },
    {
      id: 5,
      name: "Burger",
      restaurant: "Burger Joint",
      price: 10,
      time: "15-20 min",
      rating: 4.3,
      image: "https://images.unsplash.com/photo-1568901342037-24c7e8a4c085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80"
    },
    {
      id: 6,
      name: "Sushi",
      restaurant: "Sushi Bar",
      price: 25,
      time: "25-30 min",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1613769049987-b31b641f2590?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
    }
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-brand-orange py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">Order Food Online</h1>
              <p className="text-lg text-white/90 mb-8">
                Get your favorite meals delivered to your doorstep
              </p>

              {/* Food Delivery Tabs */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <Tabs defaultValue="delivery" className="w-full">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="delivery">Food Delivery</TabsTrigger>
                    <TabsTrigger value="dinein">Dine-In</TabsTrigger>
                  </TabsList>
                  <div className="p-4">
                    <TabsContent value="delivery" className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input placeholder="Enter your delivery address" className="pl-9" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select defaultValue="italian">
                            <SelectTrigger>
                              <SelectValue placeholder="Cuisine Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {cuisineTypes.map((cuisine, idx) => (
                                <SelectItem key={idx} value={cuisine.toLowerCase()}>{cuisine}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select defaultValue="any">
                            <SelectTrigger>
                              <SelectValue placeholder="Dietary Preference" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="vegetarian">Vegetarian</SelectItem>
                              <SelectItem value="vegan">Vegan</SelectItem>
                              <SelectItem value="gluten-free">Gluten-Free</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                          <Search size={18} className="mr-2" />
                          Find Food
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="dinein" className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <Input placeholder="Enter your location" className="pl-9" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select defaultValue="italian">
                            <SelectTrigger>
                              <SelectValue placeholder="Cuisine Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {cuisineTypes.map((cuisine, idx) => (
                                <SelectItem key={idx} value={cuisine.toLowerCase()}>{cuisine}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select defaultValue="any">
                            <SelectTrigger>
                              <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="any">Any</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-brand-orange hover:bg-brand-orange/90">
                          <Search size={18} className="mr-2" />
                          Find Restaurants
                        </Button>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Restaurants */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Popular Restaurants</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {popularRestaurants.map((restaurant, idx) => (
                <Card key={idx} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                    <div className="bg-brand-orange/10 p-4 rounded-full mb-4">
                      <Utensils className="text-brand-orange" size={24} />
                    </div>
                    <span className="font-medium">{restaurant}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cuisine Types */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Explore Cuisines</h2>
            <div className="flex flex-wrap gap-3">
              {cuisineTypes.map((cuisine, idx) => (
                <Button key={idx} variant="outline" className="rounded-full">
                  {cuisine}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Food Delivery Options */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Food Delivery Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodDeliveryOptions.map((food) => (
                <div key={food.id} className="service-card group">
                  <div className="relative">
                    <Image
                      src={food.image}
                      alt={food.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-xl"
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-md text-sm font-bold">
                      ₹{food.price}
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-b-xl border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-lg">{food.name}</h3>
                        <p className="text-gray-600 text-sm">{food.restaurant}</p>
                      </div>
                      <div className="flex items-center bg-brand-orange/10 px-2 py-1 rounded-md">
                        <Clock size={14} className="text-brand-orange mr-1" />
                        <span className="font-medium text-sm">{food.time}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <span>Rating: {food.rating}</span>
                    </div>
                    <Button className="w-full mt-4 bg-brand-orange hover:bg-brand-orange/90">
                      Order Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Food Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-10 text-center">Why Choose Our Food Delivery Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mb-4">
                  <Clock className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-gray-600">Get your food delivered quickly and efficiently.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mb-4">
                  <Utensils className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Wide Variety</h3>
                <p className="text-gray-600">Choose from a wide variety of cuisines and restaurants.</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mb-4">
                  <ChefHat className="text-white" size={20} />
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Food</h3>
                <p className="text-gray-600">Enjoy high-quality food from trusted restaurants.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Download App Section */}
        <section className="py-16 bg-brand-dark text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl font-bold mb-4">Download the Shelteric App</h2>
                <p className="mb-6 text-lg">
                  Get the full experience with our mobile app. Order food, track deliveries, and manage payments all in one place.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">
                    App Store
                  </Button>
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">
                    Google Play
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-64 h-96">
                  <div className="absolute -top-4 -left-4 w-full h-full bg-brand-orange rounded-xl"></div>
                  <div className="absolute top-0 left-0 w-full h-full bg-white rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1512621776951-a57141f2e3bb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
                      alt="Shelteric mobile app"
                      width={400}
                      height={600}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Food;
