import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      toast.success(res.data.message);
      navigate('/verify-code', { state: { email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: 'spring', stiffness: 300 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <motion.div 
        className="bg-black min-h-screen pt-4 px-4 flex justify-center items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-gray-900 rounded-xl shadow-md p-8 w-full max-w-lg"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <h2 className="text-2xl text-center font-bold mb-4 text-white">Forgot Password</h2>
          <p className="text-gray-400 mb-6">Enter your email address and we'll send you a verification code.</p>
          <form onSubmit={handleSendCode}>
            <motion.input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border bg-gray-800 text-white rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
              variants={inputVariants}
              whileFocus="focus"
            />
            <motion.button 
              type="submit" 
              className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
