import React from 'react';
import company from '../assets/companyLogo.png'

const JobCard = ({ job }) => {
  return (
    <div className="bg-purple-50 p-6 rounded-lg shadow-md w-full sm:w-80">
      <h3 className="text-lg text-[#18191C]  mb-2">{job.title}</h3>
      <p className="text-sm text-[#18191C] font-medium">
        <span className={`text-[#0BA02C] `}>
          {job.type}
        </span>{' '}
        | Salary: {job.salary}
      </p>
      <div className="flex text-[#18191C] items-center gap-3 mt-3">
        <img src={company} alt={job.company} className="w-10 h-10 object-fill rounded-full" />
        <div>
          <p className="text-sm font-medium">{job.company}</p>
          <p className="text-xs text-gray-600">{job.location}</p>
        </div>
      </div>
    
      <div className="flex justify-between gap-2 items-center mt-4">
      <button className="bg-purple-50 text-purple-700 px-4 py-2 rounded hover:bg-purple-50">
          View Details
        </button>        
        <button className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
          Apply now
        </button>
      </div>
    </div>
  );
};

export default JobCard;
