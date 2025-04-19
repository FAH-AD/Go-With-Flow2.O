import React from 'react';
import JobCard from './JobCard';
import jobsData from './jobsData';

const FeaturedJobs = () => {
  return (
    <div className="bg-none text-white py-10 px-4">
      <h2 className="text-3xl text-white font-bold text-center mb-4">Featured Jobs</h2>
      <p className="text-center mb-8">Choose jobs from the top employers and apply for the same.</p>
      <div className="flex flex-wrap justify-center gap-6">
        {jobsData.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      <div className="text-center  mt-8">
        <button className="text-purple-500 bg-none shadow-none underline">View all</button>
      </div>
    </div>
  );
};

export default FeaturedJobs;
