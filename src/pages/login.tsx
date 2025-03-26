import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://calling.shelteric.com";

  // Handler for traditional login
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        router.push("/home");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred");
    }
  };

  // Redirect for collaboration login
  const handleRedirect = () => {
    window.location.href = "http://localhost:3002/login";
  };

  // Google Sign-In
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
          Sign in to Shelteric
        </h2>
        <p className="text-center mb-6 text-gray-600">
          Welcome back! Please sign in to continue
        </p>

        {/* Google Sign-In */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={handleGoogleLogin}
          >
            Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-6">
          <span className="border-t border-gray-300 flex-grow"></span>
          <span className="mx-4 text-gray-500">or</span>
          <span className="border-t border-gray-300 flex-grow"></span>
        </div>

        {/* Username/Password Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-right mb-4">
            <Link href="/forgot" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Continue
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>

        <button
          type="button"
          onClick={handleRedirect}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
        >
          Collaboration
        </button>
      </div>
    </div>
  );
};

export default Login;
