import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import FreelancerRegistrationForm from '../components/RegistrationForm';

export default function Register() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [numEmployees, setNumEmployees] = useState('');
  const navigate = useNavigate();

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !companyName || !numEmployees) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const payload = { name, email, role: 'client', companyName, numEmployees };
      const response = await post('/api/register', payload);

      if (response.status === 201 || response.status === 200) {
        toast.success(response.data.message || 'Registration successful!');
        navigate('/login');
      } else {
        toast.error('Registration failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Server error. Please try again later.';
      toast.error(message);
    }
  };

  return (
    <>
      <Navbar showFullNav={false} />
      <div className="bg-black min-h-screen pt-4 pb-4 px-4">
        <div className='max-w-6xl w-full m-auto'>
          <h1 className="text-4xl font-bold text-white mb-2">Register Your Account</h1>
          {!role && <p className="text-gray-500 mb-8">Choose your registration type below.</p>}
        </div>

        {!role && (
          <div className="flex gap-4 max-w-6xl w-full m-auto mb-8">
            <div className="bg-white text-black p-8 rounded-xl shadow-md cursor-pointer flex-1 text-center" onClick={() => setRole('freelancer')}>
              <h2 className="text-2xl font-bold">Register as Freelancer</h2>
            </div>
            <div className="bg-white  text-black p-8 rounded-xl shadow-md cursor-pointer flex-1 text-center" onClick={() => setRole('client')}>
              <h2 className="text-2xl font-bold">Register as Client</h2>
            </div>
          </div>
        )}

        {role === 'freelancer' && (
          <div className="max-w-6xl w-full m-auto">
            <FreelancerRegistrationForm />
          </div>
        )}

        {role === 'client' && (
          <form className="bg-white max-w-6xl w-full m-auto rounded-xl shadow-md p-8" onSubmit={handleClientSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-md px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Company Name</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full border rounded-md px-4 py-2" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Number of Employees</label>
              <select value={numEmployees} onChange={(e) => setNumEmployees(e.target.value)} className="w-full border rounded-md px-4 py-2">
                <option value="">Select</option>
                <option value="1-20">1-20</option>
                <option value="50-100">50-100</option>
                <option value=">100">Above 100</option>
              </select>
            </div>

            <button type="submit" className="bg-[#6300B3] hover:bg-purple-700 text-white font-bold w-full py-2 rounded-md">Register</button>
          </form>
        )}
      </div>
    </>
  );
}
