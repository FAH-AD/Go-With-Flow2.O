import React, { useState, useEffect } from 'react';
import FreelancerCard from './FreelancerCard';

const FreelancerList = () => {
  // Placeholder data
  const [freelancers, setFreelancers] = useState([]);

  useEffect(() => {
    // Simulate fetching freelancer data
    const fetchedFreelancers = [
      {
        id: 1,
        name: 'Jane Doe',
        skills: ['React', 'Node.js', 'CSS'],
        completedJobs: 15,
        image: 'https://via.placeholder.com/150', // Placeholder image URL
      },
      {
        id: 2,
        name: 'John Smith',
        skills: ['Python', 'Django', 'Machine Learning'],
        completedJobs: 22,
        image: 'https://via.placeholder.com/150',
      },
      {
        id: 3,
        name: 'Alice Johnson',
        skills: ['UI/UX Design', 'Figma', 'Adobe XD'],
        completedJobs: 30,
        image: 'https://via.placeholder.com/150',
      },
    ];

    setFreelancers(fetchedFreelancers);
  }, []);

  return (
    <div>

<h2 className="text-3xl text-white font-bold text-center mb-4">Top Freelancers</h2>
<p className="text-center text-white mb-8">Choose Our Best Freelancer to gt your work done.</p>
    <div className="  p-6 flex flex-wrap gap-6 justify-center">

      {freelancers.map((freelancer) => (
        <FreelancerCard
          key={freelancer.id}
          image={freelancer.image}
          name={freelancer.name}
          skills={freelancer.skills}
          completedJobs={freelancer.completedJobs}
        />
      ))}
    </div>
    </div>
  );
};

export default FreelancerList;
