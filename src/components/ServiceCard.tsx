import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  className?: string;
  onClick?: () => void;
}

export const ServiceCard = ({
  icon,
  title,
  className,
  onClick,
}: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "p-6 bg-gradient-to-r from-blue-600 to-green-500 hover:shadow-lg transition-transform duration-300 cursor-pointer border-transparent backdrop-blur-sm",
        "hover:scale-105 active:scale-95",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-green-400 text-white shadow-md">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-900 text-center">
          {title}
        </span>
      </div>
    </Card>
  );
};
