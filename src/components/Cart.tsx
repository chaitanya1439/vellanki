import Image from 'next/image';

type Item = {
  id: number;
  name: string;
  imageSrc: string;
  rating: number;
  price: number;
};

const foodItems: Item[] = [
  { id: 1, name: 'Burger', imageSrc: '/img3.jpeg', rating: 4.5, price: 95.99 },
  { id: 2, name: 'Pizza', imageSrc: '/img9.jpeg', rating: 4.7, price: 125.99 },
  { id: 3, name: 'Pasta', imageSrc: '/img10.jpeg', rating: 4.3, price: 101.99 },
];

const stayItems: Item[] = [
  { id: 4, name: 'House', imageSrc: '/imgs2.jpeg', rating: 4.8, price: 899.99 },
  { id: 5, name: 'House', imageSrc: '/imgs1.jpeg', rating: 4.6, price: 1299.99 },
];

const travelItems: Item[] = [
  { id: 6, name: 'Flight', imageSrc: '/flight1.jpeg', rating: 4.9, price: 4999.99 },
  { id: 7, name: 'Train', imageSrc: '/train1.jpeg', rating: 4.2, price: 299.99 },
];

const CartSection = ({ title, items }: { title: string; items: Item[] }) => (
  <div>
    <h2 className="text-2xl font-semibold mb-4 text-gray-900">{title}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.id} className="bg-white p-3 rounded-lg shadow-md">
          <div className="relative w-full h-40">
            <Image src={item.imageSrc} alt={item.name} layout="fill" objectFit="cover" className="rounded-md" />
          </div>
          <h3 className="text-lg font-medium mt-2 text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">Rating: {item.rating} ⭐️</p>
          <p className="text-md font-bold text-gray-900">₹{item.price.toFixed(2)}</p>
        </div>
      ))}
    </div>
  </div>
);

export default function CartPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-10">
        <CartSection title="Food" items={foodItems} />
        <CartSection title="Stay" items={stayItems} />
        <CartSection title="Travel" items={travelItems} />
      </div>
    </div>
  );
}