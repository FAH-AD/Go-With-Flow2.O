import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import Navbar from '../components/Navbar';
import login from '../assets/login-img.png';
import { Eye, EyeOff } from "lucide-react";
import webSocketSingleton from '../socket';

export default function Login() {
  const user = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", { email, password });

      if (response.status === 200) {
        const { token, user, message } = response.data.data;
        webSocketSingleton.init(token)
        console.log(response.data, "response data");

        localStorage.setItem("authToken", token);
        dispatch(SetUser(user));
        console.log(user, "user on login")
        toast.success(message);

        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "client") {
          navigate("/client");
        } else if (user.role === "freelancer") {
          navigate("/freelancer");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Invalid Credentials.");
    }
  };
  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 px-4">
        <div className='max-w-6xl w-full m-auto'>
          <h1 className="text-4xl font-bold text-white mb-2">Login to your Account</h1>
          <p className="text-gray-500 mb-8">
            Welcome back! Select the below login methods.
          </p>
        </div>

        <div className="bg-gray-900  max-w-6xl w-full m-auto rounded-xl shadow-md flex flex-col md:flex-row">
          <div className="flex-1 p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-white mb-2">Email ID / Username</label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email id / username"
                  className="w-full border rounded-md px-4 text-black py-2 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2">Password</label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border rounded-md text-black px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#6300B3]"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(prev => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between mb-6">
               
                <Link to="/forgot-password" className="text-[#9333EA]  hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="bg-[#6300B3] hover:bg-purple-700 text-white font-bold w-full py-2 rounded-md"
              >
                Login
              </button>
            </form>

            <p className="mt-8 text-center  text-white">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-[#9333EA] font-semibold hover:underline">
                Register
              </Link>
            </p>
          </div>

          <div className="hidden md:flex flex-1 justify-center items-center rounded-r-lg">
            <img src={login} alt="Illustration" className="w-80 h-120" />
          </div>
        </div>
      </div>
    </>
  );
}