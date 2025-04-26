import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Navbar from '../components/Navbar';

export default function VerifyCode() {
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post('/api/auth/verify-reset-code', { 
        email, 
        code, 
        newPassword 
      });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
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
          <h2 className="text-2xl font-bold mb-4 text-white">Verify Code and Reset Password</h2>
          <p className="text-gray-400 mb-6">Enter the code sent to your email and your new password.</p>
          <form onSubmit={handleVerify}>
            <motion.input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border bg-gray-800 text-white rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
              variants={inputVariants}
              whileFocus="focus"
            />
            <div className="relative">
              <motion.input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border bg-gray-800 text-white rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                variants={inputVariants}
                whileFocus="focus"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/3 mt-[4px] transform -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <motion.input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border bg-gray-800 text-white rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                variants={inputVariants}
                whileFocus="focus"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/3 mt-[4px] transform -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <motion.button 
              type="submit" 
              className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify and Reset Password'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
}
