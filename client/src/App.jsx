import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

// Layouts
import AdminLaouts from './Layouts/AdminLaouts';
import UserLayout from './Layouts/UserLayout';
import PublicLayouts from './Layouts/PublicLayouts';
import HowItWorks from './pages/how-it-works';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/AdminDashboard';
import Client from './pages/ClientDashboard';
import Freelancer from './pages/Freelancer';
import Chat from './pages/Chat';
import JobSearchPage from './pages/searchJob';
import AboutUs from './pages/AboutUs';
import ApplyOnJobPage from './pages/applyJob';
import PostJob from './pages/postJob';
import AdminUsers from './pages/Users';

// Forgot Password Flow
import ForgotPassword from './pages/ForgotPassword';
import VerifyCode from './pages/VerifyCode';
import ResetPassword from './pages/ResetPassword';

import Messaging from './pages/Messaging';

export default function App() {
  const user = useSelector((state) => state.Auth.user);

  const isFreelancer = user?.role === 'freelancer';
  useEffect(() => {
    console.log(user, "user in app")
  }, [user]);
  const isClient = user?.role === 'client';

  return (
    <>
      <BrowserRouter>
        <Toaster />
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={
              isFreelancer ? <Freelancer /> : 
              isClient ? <Client /> : 
              <Home />
            } />
          </Route>

          <Route path="/" element={<PublicLayouts />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-code" element={<VerifyCode />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="how-it-works" element={<HowItWorks />} />
           
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLaouts />}>
            <Route index element={<Admin />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          

          {/* Protected Freelancer Route */}
          <Route
            path="/freelancer"
            element={isFreelancer ? <Freelancer /> : <Navigate to="/login" />}
          />
           <Route
            path="/messages"
            element={isFreelancer ? <Messaging /> : <Navigate to="/login" />}
          />
           <Route path="/search-job" element={ isFreelancer? <JobSearchPage /> : <Navigate to="/login"/>} />
           <Route path="/freelancer/apply-job" element={<ApplyOnJobPage />} />

          {/* Protected Client Route */}
          <Route
            path="/client"
            element={isClient ? <Client /> : <Navigate to="/login" />}
          />

<Route
            path="/post-job"
            element={isClient ? <PostJob /> : <Navigate to="/login" />}
          />

          {/* Chat Route - Available to Freelancer or Client */}
          <Route
            path="/chat"
            element={user && (isFreelancer || isClient) ? <Chat /> : <Navigate to="/login" />}
          />
           <Route
            path="/messages"
            element={isClient ? <Messaging /> : <Navigate to="/login" />}
          />

          {/* Optional: Catch-all route for 404 */}
          {/* <Route path="*" element={<NotFound />} /> */}

        </Routes>
      </BrowserRouter>
    </>
  );
}
