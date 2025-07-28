'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

type FormData = {
  name: string;
  email: string;
  phone: string;
};

type FormErrors = Partial<FormData>;

export default function RegisterPage() {
  const router = useRouter();
  const AUTH_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [token, setToken] = useState('');
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // On load: Get token and prefill form with /me and router.query.user
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      router.replace('/login');
      return;
    }
    setToken(savedToken);

    if (router.query.user) {
      try {
        const parsedUser = JSON.parse(router.query.user as string);
        setForm((prev) => ({
          ...prev,
          email: parsedUser.email || prev.email,
          phone: parsedUser.phone || prev.phone,
        }));
      } catch (e) {
        console.warn('Invalid user query param:', e);
      }
    }

    fetchUser(savedToken);
    // Add router to dependency array, but NOT fetchUser (fetchUser is defined inline and doesn't change)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.user, router]);

  // Fetch authenticated user details
  const fetchUser = async (jwt: string) => {
    try {
      const res = await axios.get(`${AUTH_API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });

      const user = res.data;
      // Already completed profile? Redirect to /home
      if (user.name && user.email && user.phone) {
        router.replace('/home');
        return;
      }

      setForm((prev) => ({
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    } catch (err) {
      console.error('Auth fetch failed', err);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'A valid email is required.';
    if (!form.phone.trim() || !/^\+\d{10,15}$/.test(form.phone))
      errs.phone = 'A valid phone number with country code is required.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Field change handler
  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Submit registration update
  const handleSubmit = async () => {
    if (!validate()) return;

    setUpdating(true);
    try {
      const res = await axios.put(
        `${AUTH_API}/api/auth/update`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
      }

      router.replace('/home');
    } catch (err) {
      // Specify error type
      const error = err as { response?: { data?: { message?: string } } };
      console.error('Update failed', err);
      const message = error.response?.data?.message || 'Profile update failed.';
      setErrors((prev) => ({ ...prev, username: message }));
    } finally {
      setUpdating(false);
    }
  };

  // While loading user info
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-lg">Loading...</span>
      </div>
    );
  }

  // Final render
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-md">
          <CardHeader className="text-center text-xl font-semibold">
            Complete Your Profile
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={handleChange('name')}
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="username">Email</Label>
                <Input
                  id="username"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="+911234567890"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={updating}
                className="w-full mt-2"
              >
                {updating ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
