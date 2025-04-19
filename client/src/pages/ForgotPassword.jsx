import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/forgot-password/send-code', { email });
      toast.success(res.data.message);
      navigate('/verify-code', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
          <p className="text-gray-600 mb-6">Enter your email address and we’ll send you a verification code.</p>
          <form onSubmit={handleSendCode}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
            />
            <button type="submit" className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md">
              Send Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
