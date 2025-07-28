import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { GoogleLogin, GoogleOAuthProvider, CredentialResponse } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
  UserCredential,
} from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY! || 'AIzaSyBNGOI5fAbdxHZfKbWXAwbUOuL39dNCYho',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN! || 'new-shelteric.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID! || 'new-shelteric',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET! || 'new-shelteric.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID! || '985098045043',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID! || '1:985098045043:web:822bc32a866cc2483ccc06',
};

const PHONE_REGEX = /^\+[1-9]\d{10,14}$/;
const OTP_TIMEOUT = 60;

interface SheltericUser {
  username?: string;
  phoneNumber?: string;
  [key: string]: unknown;
}

export default function LoginPage() {
  const router = useRouter();
  const AUTH_API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [auth, setAuth] = useState<Auth | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const fbAuth = getAuth(app);
    setAuth(fbAuth);

    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(fbAuth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {},
      });
      window.recaptchaVerifier.render().catch(console.error);
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleAuthSuccess = (token: string, user: SheltericUser) => {
    localStorage.setItem('token', token);
    if (!user.username || !user.phoneNumber) {
      router.push({ pathname: '/registration', query: { token, user: JSON.stringify(user) } });
    } else {
      router.push('/home');
    }
  };

  const sendOTP = async () => {
    setMessage('');
    if (!PHONE_REGEX.test(phone)) {
      setMessage('Invalid phone number. Use E.164 format (e.g., +911234567890).');
      return;
    }
    if (!auth || !window.recaptchaVerifier) {
      setMessage('Authentication is not ready. Try again shortly.');
      return;
    }
    if (timer > 0) return;

    setLoading(true);
    try {
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmation(result);
      setTimer(OTP_TIMEOUT);
      setMessage('OTP sent to ' + phone);
    } catch (err) {
      const error = err as Error;
      setMessage(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!confirmation) {
      setMessage('Please request an OTP first.');
      return;
    }
    if (otp.length !== 6) {
      setMessage('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const cred: UserCredential = await confirmation.confirm(otp);
      const phoneNumber = cred.user.phoneNumber!;
      const uid = cred.user.uid;

      const res = await fetch(`${AUTH_API}/api/auth/phone-jwt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber, uid }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleAuthSuccess(data.token, data.user);
    } catch (err) {
      const error = err as Error;
      setMessage(error.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (resCred: CredentialResponse) => {
    if (!resCred.credential) {
      setMessage('Google login failed');
      return;
    }

    setLoading(true);
    try {
      const decoded = jwtDecode<{ email: string; name?: string }>(resCred.credential);

      const res = await fetch(`${AUTH_API}/api/auth/google-jwt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      handleAuthSuccess(data.token, data.user);
    } catch (err) {
      const error = err as Error;
      setMessage(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-purple-800">Sign in to Shelteric</h1>

        {message && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded">
            {message}
          </div>
        )}

        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID! || '361777829788-v8mspju3na1k4ua3a4p1dutdk5c55c3n.apps.googleusercontent.com'}>
          <GoogleLogin onSuccess={signInWithGoogle} onError={() => setMessage('Google login failed')} />
        </GoogleOAuthProvider>

        <div className="flex items-center justify-center gap-2">
          <span className="h-px bg-gray-300 flex-1" />
          <span className="text-gray-500">OR</span>
          <span className="h-px bg-gray-300 flex-1" />
        </div>

        <div className="space-y-2">
          <input
            type="tel"
            placeholder="+911234567890"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-purple-500"
            disabled={loading}
          />
          <button
            onClick={sendOTP}
            className="w-full py-3 bg-pink-500 text-white rounded-lg disabled:opacity-50"
            disabled={loading || timer > 0}
          >
            {timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
          </button>
        </div>

        {confirmation && (
          <div className="space-y-2">
            <input
              type="text"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="w-full p-3 border rounded-lg focus:ring-purple-500"
              disabled={loading}
            />
            <button
              onClick={verifyOTP}
              className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              disabled={loading || otp.length !== 6}
            >
              Verify OTP
            </button>
          </div>
        )}

        <div id="recaptcha-container" className="invisible" />
      </div>
    </div>
  );
}

