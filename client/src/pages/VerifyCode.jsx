import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/forgot-password/verify-code', { email, code });
      toast.success(res.data.message);
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Verify Code</h2>
          <p className="text-gray-600 mb-6">Enter the code sent to your email.</p>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
            />
            <button type="submit" className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md">
              Verify Code
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
