import React, { useState, startTransition } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Handler for traditional signup
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://calling.shelteric.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, phoneNumber, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        startTransition(() => {
          router.push('/home');
        });
      } else {
        alert(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred');
    }
  };

  // Handler for Google sign-in
  const handleGoogleSignIn = () => {
    window.location.href = 'https://collab.shelteric.com/api/auth/google';
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-950">
          Create your account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              className="w-full px-3 py-2 border rounded-lg text-gray-950"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              className="w-full px-3 py-2 border rounded-lg text-gray-950"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              name="+91XXXXXXXXXX"
              placeholder="+91XXXXXXXXXX"
              className="w-full px-3 py-2 border rounded-lg text-gray-950"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full px-3 py-2 border rounded-lg text-gray-950"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Continue
          </button>
        </form>
        <div className="text-center mt-4 text-gray-950">
          <div className="flex items-center justify-center mb-6">
            <span className="border-t border-gray-300 flex-grow"></span>
            <span className="mx-4 text-gray-500">or</span>
            <span className="border-t border-gray-300 flex-grow"></span>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 mt-2 flex items-center justify-center"
          >
            Sign up with Google
          </button>
        </div>
        <div className="text-center mt-4 text-gray-950">
          <p>
            Already have an account?{' '}
            <Link href="/login">
              <span className="text-blue-500">Log in</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
