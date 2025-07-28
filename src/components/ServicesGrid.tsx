import { QrCode, Home, UtensilsCrossed, MoreHorizontal } from "lucide-react";
import { ServiceCard } from "./ServiceCard";

export const ServicesGrid = () => {
  const services = [
    { icon: <QrCode className="h-6 w-6 text-white" />,        title: "Scan any QR Code" },
    { icon: <Home className="h-6 w-6 text-white" />,           title: "Stay" },
    { icon: <UtensilsCrossed className="h-6 w-6 text-white" />, title: "Food" },
    { icon: <MoreHorizontal className="h-6 w-6 text-white" />,  title: "More" },
  ];

  // light blue→green gradient
  const pastelBg = "bg-gradient-to-br from-blue-100 to-green-100";

  return (
    <section className="py-8 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.map((svc, i) => (
            <ServiceCard
              key={i}
              icon={svc.icon}
              title={svc.title}
              className={`${pastelBg} hover:shadow-md`}
              onClick={() => console.log(`Clicked ${svc.title}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
