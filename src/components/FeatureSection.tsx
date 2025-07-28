import { Card } from "@/components/ui/card";
import { Truck, Package } from "lucide-react";

export const FeatureSection = () => {
  const locations = ["Hyderabad", "Gachibowli", "Koti", "Secunderabad", "Miyapur"];
  

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Main Feature Card */}
        <Card className="p-6 bg-gradient-to-br from-blue-100 to-green-100 shadow-lg rounded-xl">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">Take</h3>
              <p className="text-sm text-gray-600">
                Pick‑up right at your doorstep
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-200 to-green-200 rounded-lg">
              <Truck className="h-8 w-8 text-white" />
            </div>
          </div>
        </Card>

        {/* Get Rent Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Get Rent</h2>

          {/* Horizontal, scrollable row */}
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {locations.map((location) => (
              <Card
                key={location}
                className="flex-shrink-0 w-48 p-4 bg-gradient-to-br from-blue-100 to-green-100 shadow-md rounded-lg hover:shadow-lg transition"
              >
                <div className="text-center space-y-2">
                  <div className="p-3 bg-gradient-to-br from-blue-200 to-green-200 rounded-full inline-flex">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <span className="block text-sm font-medium text-gray-800">
                    {location}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};




