import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Mail, Check, AlertTriangle, ArrowLeft } from 'lucide-react';
import { uploadFile } from '../services/fileUpload';
import { motion } from 'framer-motion';

const VerifyCompany = () => {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();
  const [method, setMethod] = useState('document');
  const [file, setFile] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Set up axios interceptor to add bearer token to all requests
    const interceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Clean up interceptor on component unmount
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (method === 'document') {
        if (!file) {
          throw new Error('Please select a document to upload');
        }

        const fileUrl = await uploadFile(file);
        console.log('File uploaded successfully:', fileUrl);
        console.log(method)
        const response = await axios.post('/api/client-verification/verify', 
          { 
            method: 'document',
            fileUrl
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        setSuccess(response.data.message);
        setTimeout(() => navigate('/client'), 1000);
      } else if (method === 'companyEmail') {
        console.log(method)
        const response = await axios.post('/api/client-verification/verify', { method: 'companyEmail' });
        setSuccess(response.data.message);
      }
    } catch (err) {
      console.error('Verification error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'An error occurred during verification.');
    }

    setLoading(false);
  };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/client-verification/verify', { method: 'companyEmail' });
      setSuccess(response.data.message);

    } catch (err) {
      console.error('Verification error:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'An error occurred during verification.');
    }

    setLoading(false);
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault(); // Prevent form submission
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/client-verification/verify/code', { code: verificationCode });
      setSuccess(response.data.message);
      setTimeout(() => navigate('/client'), 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred during code verification.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-12">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-[#121218] rounded-lg border border-[#2d2d3a] shadow-xl"
        >
          <div className="p-6 border-b border-[#2d2d3a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Company Verification</h2>
              <button
                onClick={() => navigate('/client')}
                className="flex items-center text-[#9333EA] hover:text-[#a855f7] transition-colors"
              >
                <ArrowLeft size={18} className="mr-1" />
                Back
              </button>
            </div>
            <p className="text-gray-400">Verify your company to unlock all features</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Verification Method
              </label>
              <div className="flex space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setMethod('document')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    method === 'document'
                      ? 'bg-[#9333EA] text-white'
                      : 'bg-[#1e1e2d] text-gray-300 hover:bg-[#2d2d3a]'
                  }`}
                >
                  Document Upload
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setMethod('companyEmail')}
                  className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                    method === 'companyEmail'
                      ? 'bg-[#9333EA] text-white'
                      : 'bg-[#1e1e2d] text-gray-300 hover:bg-[#2d2d3a]'
                  }`}
                >
                  Company Email
                </motion.button>
              </div>
            </div>

            {method === 'document' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <label className="block text-gray-300 text-sm font-bold mb-2">
                  Upload Document
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-[#1e1e2d] text-gray-300 rounded-lg border border-[#2d2d3a] cursor-pointer hover:bg-[#2d2d3a] transition-colors">
                    <Upload className="w-8 h-8" />
                    <span className="mt-2 text-base">{file ? file.name : 'Select a file'}</span>
                    <input type="file" className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
              </motion.div>
            )}

            {method === 'companyEmail' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <p className="text-gray-300 mb-2">
                  We'll send a verification email to your company email address.
                </p>
              </motion.div>
            )}

            {method === 'companyEmail' && !success && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button" // Change to type="button"
                onClick={handleSendVerificationCode} // Use the new function
                disabled={loading}
                className={`w-full bg-[#9333EA] text-white py-2 px-4 rounded-lg hover:bg-[#a855f7] transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </motion.button>
            )}

            {method === 'companyEmail' && success && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVerifyCode} // Use the updated function
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full bg-[#9333EA] text-white py-2 px-4 rounded-lg hover:bg-[#a855f7] transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </motion.button>
              </div>
            )}

            {method === 'document' && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full bg-[#9333EA] text-white py-2 px-4 rounded-lg hover:bg-[#a855f7] transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Processing...' : 'Submit for Verification'}
              </motion.button>
            )}
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-6 mb-6 p-3 bg-red-900/20 border border-red-800 rounded-md flex items-center"
            >
              <AlertTriangle className="text-red-400 mr-2" size={18} />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-6 mb-6 p-3 bg-green-900/20 border border-green-800 rounded-md flex items-center"
            >
              <Check className="text-green-400 mr-2" size={18} />
              <p className="text-green-400">{success}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyCompany;