import React from 'react';

const FreelancerCard = ({ image, name, skills, completedJobs }) => {
  return (
    <div className="bg-white shadow-md rounded-md overflow-hidden w-64 text-center">
      {/* Image Section */}
      <img
        src={image}
        alt={`${name}'s avatar`}
        className="w-full h-40 object-cover"
      />
      
      {/* Details Section */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600 mt-2">Skills: {skills.join(', ')}</p>
        <p className="text-gray-700 mt-2">
          Completed Jobs: <span className="font-bold">{completedJobs}</span>
        </p>
      </div>
    </div>
  );
};

export default FreelancerCard;
