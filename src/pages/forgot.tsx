import { useState } from "react";
import axios from "axios";

export default function ResetPassword() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/api/auth/send-otp", { phoneNumber });
      setMessage(response.data.message);
      setStep(2);
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3001/api/auth/verify-otp", {
        phoneNumber,
        otp,
        newPassword,
      });
      setMessage(response.data.message);
      setStep(3);
    } catch (error) {
      setMessage("Invalid OTP or password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="+91XXXXXXXXXX"
              className="w-full border rounded p-2 mb-2"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block text-gray-700 text-sm mb-2">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border rounded p-2 mb-2"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <label className="block text-gray-700 text-sm mb-2">Enter New Password</label>
            <input
              type="password"
              placeholder="New Password"
              className="w-full border rounded p-2 mb-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              onClick={verifyOtp}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP & Reset Password"}
            </button>
          </>
        )}

        {step === 3 && (
          <p className="text-center text-green-600 font-semibold">
            Password reset successful! You can now log in with your new password.
          </p>
        )}

        {message && <p className="mt-2 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

