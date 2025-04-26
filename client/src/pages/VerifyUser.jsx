import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import Navbar from '../components/Navbar';

const VerifyUsers = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.Auth.user);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterRole, setFilterRole] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);
  const [actionError, setActionError] = useState(null);
const token=localStorage.getItem('authToken');
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login', { state: { from: '/admin/verify-users', message: 'Please login as admin to access this page' } });
    } else {
      fetchVerificationRequests();
    }
  }, [user, navigate, currentPage, filterRole, sortBy, searchQuery]);

  const fetchVerificationRequests = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/api/admin/verification-requests', {
        params: {
          page: currentPage,
          limit: 10,
          role: filterRole !== 'all' ? filterRole : undefined,
          sort: JSON.stringify({ createdAt: sortBy === 'newest' ? -1 : 1 }),
          search: searchQuery,
        },
        headers: {
            'Authorization': `Bearer ${token}`
          }
      });
      setRequests(response.data.data.requests);
      setTotalPages(response.data.data.totalPages);
    } catch (error) {
      console.error('Failed to fetch verification requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleRoleFilter = (role) => {
    setFilterRole(role);
    setCurrentPage(1);
  };

  const handleSort = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleVerificationAction = async (action) => {
    try {
      await axios.put(`/api/admin/verify-client/${selectedRequest._id}`, {
        action,
        
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
      setActionSuccess(`Verification request ${action === 'approve' ? 'verified' : 'rejected'} successfully`);
      setShowDetailsModal(false);
      fetchVerificationRequests();
    } catch (error) {
      setActionError('Failed to process verification request. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0f]">
        <div className="w-16 h-16 border-4 border-[#9333EA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-12">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Verification Requests</h1>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] text-white px-4 py-2 rounded-md transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 bg-[#1e1e2d] border border-[#2d2d3a] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
              />
            </div>
          </div>
          <div className="relative">
            <select
              value={filterRole}
              onChange={(e) => handleRoleFilter(e.target.value)}
              className="appearance-none bg-[#1e1e2d] border border-[#2d2d3a] text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
            >
              <option value="all">All Roles</option>
              <option value="client">Client</option>
              <option value="freelancer">Freelancer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="appearance-none bg-[#1e1e2d] border border-[#2d2d3a] text-white py-2 px-4 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9333EA]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>

        {/* Verification Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-[#121218] rounded-lg overflow-hidden">
            <thead className="bg-[#1e1e2d]">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Submitted</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id} className="border-b border-[#2d2d3a]">
                  <td className="px-6 py-4">{`${request.name}`}</td>
                  <td className="px-6 py-4">{request.email}</td>
                  <td className="px-6 py-4 capitalize">{request.role}</td>
                  <td className="px-6 py-4">{new Date(request.dateSubmitted).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-[#9333EA] hover:text-[#a855f7] transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {requests.length} of {totalPages * 10} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1 ? 'bg-[#2d2d3a] text-gray-500' : 'bg-[#1e1e2d] text-white hover:bg-[#2d2d3a]'
              }`}
            >
              <ArrowLeft size={18} />
            </button>
            <span className="px-3 py-1 bg-[#1e1e2d] rounded-md">
              {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages ? 'bg-[#2d2d3a] text-gray-500' : 'bg-[#1e1e2d] text-white hover:bg-[#2d2d3a]'
              }`}
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#121218] p-6 rounded-lg max-w-lg w-full">
              <h2 className="text-2xl font-bold mb-4">Verification Details</h2>
              <p><strong>Name:</strong> {`${selectedRequest?.name} `}</p>
              <p><strong>Email:</strong> {selectedRequest?.email}</p>
              <p><strong>Role:</strong> {selectedRequest?.role}</p>
              <p><strong>Submitted:</strong> {new Date(selectedRequest?.dateSubmitted).toLocaleString()}</p>
              <p><strong>Document:</strong> <a href={selectedRequest?.document} target="_blank" rel="noopener noreferrer" className="text-[#9333EA] hover:text-[#a855f7]">View Document</a></p>
              <div className="mt-6 flex justify-end gap-4">
              <button
                  onClick={() => handleVerificationAction('reject')}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerificationAction('approve')}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {actionSuccess && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-md shadow-lg">
            {actionSuccess}
          </div>
        )}

        {/* Error Message */}
        {actionError && (
          <div className="fixed bottom-4 right-4 bg-red-600 text-white px-6 py-3 rounded-md shadow-lg">
            {actionError}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyUsers;