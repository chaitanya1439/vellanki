'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type CartItem = {
  id: number;
  name: string;
  imageSrc: string;
  rating: number;
  price: number;
  quantity: number;
};

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Burger',
    imageSrc: '/img3.jpeg',
    rating: 4.5,
    price: 95.99,
    quantity: 0,
  },
  {
    id: 2,
    name: 'Pizza',
    imageSrc: '/img9.jpeg',
    rating: 4.7,
    price: 125.99,
    quantity: 0,
  },
  {
    id: 3,
    name: 'Pasta',
    imageSrc: '/img10.jpeg',
    rating: 4.3,
    price: 101.99,
    quantity: 0,
  },
];

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCartItems);

  const handleAddToCart = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCheckout = () => {
    alert('Proceeding to checkout...');
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const cartHasItems = cart.some((item) => item.quantity > 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Your Cart
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 shadow-md bg-white"
          >
            <Image
              src={item.imageSrc}
              alt={item.name}
              width={400}
              height={250}
              className="rounded-lg w-full h-48 object-cover"
            />
            <h2 className="text-xl font-semibold mt-4">{item.name}</h2>
            <p className="text-gray-500 mt-1">Rating: {item.rating} ⭐️</p>
            <p className="text-lg font-bold mt-2 text-gray-700">
              ₹{item.price.toFixed(2)}
            </p>

            <div className="mt-4">
              {item.quantity === 0 ? (
                <button
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="text-lg font-medium text-gray-800">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {cartHasItems && (
        <div className="mt-10 text-center">
          <div className="text-2xl font-semibold mb-4 text-gray-800">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
          <button
            onClick={handleCheckout}
            className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 text-lg"
          >
            Checkout
          </button>
        </div>
      )}

      {!cartHasItems && (
        <p className="text-center text-gray-500 mt-10 text-lg">
          Your cart is empty. Start adding some delicious items!
        </p>
      )}
    </div>
  );
};

export default Cart;
