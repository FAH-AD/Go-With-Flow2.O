import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showc, setCShow] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post('/api/forgot-password/reset', { email, newPassword: password });
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4 flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <form onSubmit={handleReset}>
            
            {/* New Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-black border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setShow(!show)}>
                  {show ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showc ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-black border rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                />
                <div className="absolute right-3 top-2.5 cursor-pointer" onClick={() => setCShow(!showc)}>
                  {showc ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-[#6300B3] text-white font-bold py-2 rounded-md">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
