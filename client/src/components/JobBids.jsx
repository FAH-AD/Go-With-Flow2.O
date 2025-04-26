import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JobBids = () => {
  const [bids, setBids] = useState(null);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { jobId } = useParams();

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/bids/job/${jobId}`);
        setBids(response.data.data.bids);
        setJob(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bids');
        setLoading(false);
      }
    };

    fetchBids();
  }, [jobId]);

  const handleHire = (bidId, roleTitle = null) => {
    // Implement hire functionality
    console.log(`Hiring for bid ${bidId}${roleTitle ? ` and role ${roleTitle}` : ''}`);
  };

  const handleMessage = (freelancerId) => {
    // Implement message functionality
    console.log(`Messaging freelancer ${freelancerId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!bids) return <div>No bids for this job</div>;

  return (
    <div className="job-bids">
      <h2>Bids for {job.jobTitle}</h2>
      {job.isCrowdsourced ? (
        Object.entries(bids).map(([role, roleBids]) => (
          <div key={role} className="role-bids">
            <h3>{role}</h3>
            {roleBids.length > 0 ? (
              roleBids.map((bid) => (
                <div key={bid._id} className="bid">
                  <p>Freelancer: {bid.freelancer.name}</p>
                  <p>Proposal: {bid.proposal}</p>
                  <p>Budget: ${bid.budget}</p>
                  <button onClick={() => handleHire(bid._id, role)}>Hire</button>
                  <button onClick={() => handleMessage(bid.freelancer._id)}>Message</button>
                </div>
              ))
            ) : (
              <p>No bids for this role</p>
            )}
          </div>
        ))
      ) : (
        bids.length > 0 ? (
          bids.map((bid) => (
            <div key={bid._id} className="bid">
              <p>Freelancer: {bid.freelancer.name}</p>
              <p>Proposal: {bid.proposal}</p>
              <p>Budget: ${bid.budget}</p>
              <button onClick={() => handleHire(bid._id)}>Hire</button>
              <button onClick={() => handleMessage(bid.freelancer._id)}>Message</button>
            </div>
          ))
        ) : (
          <p>No bids for this job</p>
        )
      )}
    </div>
  );
};

export default JobBids;