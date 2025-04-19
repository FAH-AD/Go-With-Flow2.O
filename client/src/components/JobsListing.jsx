import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const JobsListing = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/jobs/fetch');
        const jobsWithClient = await Promise.all(
          data.jobs.map(async (job) => {
            const client = await axios.get(`http://localhost:5000/api/user/${job.createdBy}`);
            return { ...job, client: client.data.user };
          })
        );
        setJobs(jobsWithClient);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
      {jobs.map((job) => (
        <div key={job._id} className="bg-[#F8F2FC] p-5 rounded shadow-lg">
          <h5 className="text-black font-medium mb-1">{job.title}</h5>
          <p className="text-gray-800 text-sm mb-2">{job.client?.name} - {job.client?.location || 'Remote'}</p>
          <div className="flex items-center space-x-2 mb-3">
            {job.client?.profilePic && (
              <img src={job.client.profilePic} alt="Client" className="h-7 w-7 rounded-full" />
            )}
            <span className="text-sm">{job.role}</span>
          </div>
          <div className="flex justify-between">
            <Link
              to={`/job/${job._id}`}
              className="text-sm border-purple-600 border-2 rounded p-2 text-purple-500 hover:bg-purple-600 hover:text-white transition duration-200"
            >
              View details
            </Link>
            <button className="bg-purple-600 px-4 py-1 rounded text-sm text-white hover:bg-purple-800 hover:scale-105 transition-transform duration-200">
              Apply now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsListing;
