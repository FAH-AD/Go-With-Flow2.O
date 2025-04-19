import React from "react";
import heroImage from '../assets/hero.png'

const JobSearchHero = ({role}) => {
  return (
    <div className="w-full min-h-screen text-white flex items-center justify-center px-4 md:px-8">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      {/* Left Section */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          {role === "freelancer"
            ? "Find a job that aligns with your"
            : "Find the right freelancer for your"}
          <br />
          <span className="text-purple-500">
            {role === "freelancer" ? "interests" : "project needs"}
          </span>{" "}
          and{" "}
          <span className="text-purple-500">
            {role === "freelancer" ? "skills" : "requirements"}
          </span>
        </h1>
        <p className="text-gray-300 mb-6">
          {role === "freelancer"
            ? "Thousands of jobs in all the leading sectors are waiting for you."
            : "Discover talented freelancers to bring your ideas to life."}
        </p>

        {/* Search Form */}
        <div className="flex flex-col md:flex-row bg-white justify-between rounded-lg overflow-hidden shadow-lg">
          <input
            type="text"
            placeholder={
              role === "freelancer"
                ? "Job title, Keyword..."
                : "Freelancer skills, Keyword..."
            }
            className="!w-[50%] px-4 py-3 text-gray-700 rounded-sm focus:outline-none"
          />
          <button className="bg-purple-600 text-white px-6 py-3 hover:bg-purple-700 transition">
            {role === "freelancer" ? "Find Job" : "Find Freelancer"}
          </button>
        </div>
     
          {/* Suggestions */}
          <p className="mt-4 text-gray-400 text-sm">
            Suggestion: <span className="text-white">UI/UX Designer</span>,{" "}
            <span className="text-white">Programming</span>,{" "}
            <span className="text-purple-500">Digital Marketing</span>,{" "}
            <span className="text-white">Video</span>, Animation.
          </p>
        </div>

        {/* Right Section - Illustration */}
        <div className="hidden md:flex justify-center">
          <div className="relative">
            {/* Illustration */}
            <img
              src={heroImage}
              alt="Job Search"
              className="w-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearchHero;
