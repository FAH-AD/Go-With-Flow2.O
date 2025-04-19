import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/jobs/${id}`);
      
        setJob({ ...data.job});
      } catch (err) {
        console.error('Error fetching job details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!job) return <p className="text-center">Job not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-[#F8F2FC] rounded-lg p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-4">
          {job.client?.profilePic && (
            <img src={job.client.profilePic} className="h-12 w-12 rounded-full" alt="Client" />
          )}
          <div>
            <h2 className="text-xl font-bold text-purple-700">{job.title}</h2>
            <p className="text-sm text-gray-600">{job.client?.name} - {job.role}</p>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-800">Job Description</h4>
          <p className="text-sm text-gray-700">{job.description}</p>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-800">Salary</h4>
          <p className="text-sm text-gray-700">
            {job.salary ? `₹${job.salary}` : `₹${job.salary_min} - ₹${job.salary_max}`}
          </p>
        </div>

        <div className="mb-4">
          <h4 className="text-md font-semibold text-gray-800">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {job.tags?.map((tag, idx) => (
              <span key={idx} className="bg-purple-100 text-purple-600 px-2 py-1 text-xs rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded shadow">
          Apply Now
        </button>
      </div>
    </div>
  );
};

export default JobDetails;
