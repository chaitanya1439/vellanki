import { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import React from 'react';

type CartItem = {
  id: number;
  name: string;
  imageSrc: string;
  rating: number;
  price: number;
  quantity: number; // Ensure quantity is included
};

const cartItem: CartItem[] = [
  {
    id: 1,
    name: 'Burger',
    imageSrc: '/img3.jpeg',
    rating: 4.5,
    price: 95.99,
    quantity: 0, // Default value
  },
  {
    id: 2,
    name: 'Pizza',
    imageSrc: '/img9.jpeg',
    rating: 4.7,
    price: 125.99,
    quantity: 0, // Default value
  },
  {
    id: 3,
    name: 'Pasta',
    imageSrc: '/img10.jpeg',
    rating: 4.3,
    price: 101.99,
    quantity: 0, // Default value
  },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>(cartItem);
  const BACKEND_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/cart`);
        console.log('Cart data:', response.data); // Log response data
        setCart(response.data.items || []); // Safeguard against undefined
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handleAddToCart = async (itemId: number) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/v1/cart/add`, {
        menuItemId: itemId,
        quantity: 1,
      });
      setCart(response.data.items || []); // Update the cart with the response from the backend
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/v1/cart/remove`, {
        menuItemId: itemId,
        quantity: 1,
      });
      setCart(response.data.items || []); // Update the cart with the response from the backend
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = async () => {
    try {
      const orderData = cart.map((item) => ({
        menuItemId: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(`${BACKEND_URL}/v1/cart/checkout`, {
        items: orderData,
      });
      console.log('Order created:', response.data);
      alert('Order created successfully!');
      setCart([]); // Clear the cart
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order.');
    }
  };

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cart.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-lg">
              <Image
                src={item.imageSrc}
                alt={item.name}
                width={400}
                height={250}
                className="rounded-lg"
                fetchPriority="high"
              />
              <h2 className="text-xl font-semibold mt-4">{item.name}</h2>
              <p className="mt-2 text-gray-600">Rating: {item.rating} ⭐️</p>
              <p className="mt-2 text-gray-800 font-bold">₹{item.price.toFixed(2)}</p>
              <div className="flex items-center justify-between mt-4">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
                  onClick={() => handleAddToCart(item.id)}
                >
                  +
                </button>
                <span className="mx-4 text-gray-800">
                  {item.quantity}
                </span>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-300"
                  onClick={() => handleRemoveFromCart(item.id)}
                  disabled={item.quantity === 0}
                >
                  -
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {cart.length > 0 && (
        <>
          <div className="mt-6 text-xl font-semibold">
            Total: ₹{totalAmount.toFixed(2)}
          </div>
          <button
            className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
