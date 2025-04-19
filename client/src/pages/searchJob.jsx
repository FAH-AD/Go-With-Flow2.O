import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import JobDetailsSlider from "../components/jobDetailSlider";

export default function JobSearchPage() {
  const [filters, setFilters] = useState({
    salary: false,
    jobType: false,
    workMode: false,
    jobLocation: false,
    experience: false,
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [showSlider, setShowSlider] = useState(false);

  const handleOpenSlider = (job) => {
    setSelectedJob(job);
    setShowSlider(true);
  };
  let navigate= useNavigate()

  const handleCloseSlider = () => {
    setShowSlider(false);
  };
  const [filterValues, setFilterValues] = useState({
    title: "",
    salaryMin: "",
    salaryMax: "",
    jobType: [],
    workMode: [],
    location: [],
    experience: [],
  });

  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleFilter = (key) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCheckboxChange = (type, value) => {
    setFilterValues((prev) => {
      const newArray = prev[type].includes(value)
        ? prev[type].filter((item) => item !== value)
        : [...prev[type], value];
      return { ...prev, [type]: newArray };
    });
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/jobs/fetch");
      setJobsData(res.data.jobs);
      console.log(jobsData)
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="bg-black min-h-screen text-white font-sans">
      <Navbar showFullNav={true} isLogged={true} role='freelancer' />

      <JobDetailsSlider
        show={showSlider}
        onClose={handleCloseSlider}
        job={selectedJob}
      />
      <div className="px-10 py-8">
        <h2 className="text-2xl font-semibold">Job Search</h2>
        <p className="text-gray-400 mb-6">Search for your desired job</p>
        <div className="flex w-full max-w-2xl">
          <input
            type="text"
            placeholder="Enter Job title"
            value={filterValues.title}
            onChange={(e) =>
              setFilterValues({ ...filterValues, title: e.target.value })
            }
            className="flex-grow p-3 rounded-l bg-white border border-gray-700 text-black"
          />
          <button onClick={fetchJobs} className="bg-purple-600 px-6 py-3 rounded-r">
            Search
          </button>
        </div>
      </div>

      <div className="flex px-10 gap-6">
        <aside className="w-72 bg-white text-black p-5 rounded">
          <h3 className="font-semibold text-lg mb-4">Filter</h3>

          {/* Salary */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleFilter("salary")}
            >
              <h4 className="font-medium text-sm mb-2">Salary Range</h4>
              {filters.salary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
            <div
              className={`transition-all duration-500 overflow-hidden ${filters.salary ? "max-h-40 mt-2" : "max-h-0"
                }`}
            >
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filterValues.salaryMin}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, salaryMin: e.target.value })
                  }
                  className="w-1/2 p-2 bg-white border border-gray-700 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filterValues.salaryMax}
                  onChange={(e) =>
                    setFilterValues({ ...filterValues, salaryMax: e.target.value })
                  }
                  className="w-1/2 p-2 bg-white border border-gray-700 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Reusable Filter Group */}
          {[
            {
              key: "jobType",
              label: "Job Type",
              options: ["Full Time", "Part Time", "Freelance", "Internship"],
            },
            {
              key: "workMode",
              label: "Work Mode",
              options: ["Onsite", "Remote", "Hybrid"],
            },
            {
              key: "jobLocation",
              label: "Job Location",
              options: ["New York", "India", "Germany", "Canada"],
            },
            {
              key: "experience",
              label: "Experience Level",
              options: ["0-1 Years", "1-3 Years", "3-5 Years", "5+ Years"],
            },
          ].map(({ key, label, options }) => (
            <div className="mb-6" key={key}>
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleFilter(key)}
              >
                <h4 className="font-medium text-sm mb-2">{label}</h4>
                {filters[key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              <div
                className={`transition-all duration-500 overflow-hidden ${filters[key] ? "max-h-40 mt-2" : "max-h-0"
                  }`}
              >
                {options.map((option) => (
                  <div key={option} className="text-sm text-gray-800">
                    <input
                      type="checkbox"
                      checked={filterValues[key]?.includes(option)}
                      onChange={() => handleCheckboxChange(key, option)}
                      className="mr-2"
                    />
                    {option}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </aside>

        <main className="flex-1">


          {loading ? (
            <div className="text-center text-purple-400">Loading jobs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-8">
              {jobsData.map((job) => (
                <div key={job._id} className="bg-[#F8F2FC] p-5 rounded shadow-lg">
                  <h5 className="text-black font-medium mb-1">{job.title}</h5>
                  <p className="text-gray-800 text-sm mb-2">
                    {job.description}
                  </p>
                  <div className="flex gap-2">
                    <p className="text-purple-600 bg-[#F1E0FF] text-sm mb-2">
                      Full-Time
                    </p>
                    <p className="text-gray-800 text-sm mb-2">
                      Salary: {job.salary} pkr
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    {job.clientProfilePicture && (
                      <img
                        src={job.clientProfilePicture}
                        alt="Client"
                        className="h-7 w-7 rounded-full"
                      />
                    )}
                    <span className="text-sm text-black">{job.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <button
                      onClick={() => handleOpenSlider(job)}
                      className="border-purple-600 border-2 px-4 py-1 rounded text-sm text-purple-400 hover:bg-purple-800 hover:text-white hover:scale-105 transition-all duration-200"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => navigate(`/apply/${job._id}`, { state: { job } })}
                      className="bg-purple-600 px-4 py-1 rounded text-sm text-white hover:bg-purple-800 hover:scale-105 transition-transform duration-200"
                    >
                      Apply now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-6">
            <button onClick={fetchJobs} className="text-purple-500">
              View more
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
