import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/verify-email', { email, code });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post('/api/auth/resend-verification', { email });
      if (res.ok) {
        toast.success('Verification code resent. Please check your email.');
        setCanResend(false);
        setCountdown(20);
      } else {
        setError(res.data.message || 'Failed to resend verification code. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4 flex justify-center items-center">
        <motion.div
          className="bg-gray-900 rounded-xl shadow-md p-8 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center mb-4">Verify Your Email</h2>
          {error && (
            <div className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 border border-red-500">
              {error}
            </div>
          )}
          <p className="text-gray-200 text-center mb-6">Enter the code sent to your email.</p>
          <form onSubmit={handleVerify}>
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border rounded-md px-4 py-2 mb-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>
          <div className="mt-4 text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                className="text-[#6300B3] hover:text-[#5600A1]"
                disabled={isLoading}
              >
                Resend Verification Code
              </button>
            ) : (
              <p className="text-gray-200">
                Resend code in {countdown} seconds
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
