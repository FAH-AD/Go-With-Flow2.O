import React from "react";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Briefcase, DollarSign, Star } from "lucide-react";

export default function JobDetailsSlider({ show, onClose, job }) {
    useEffect(() => {
        if (show) {
          document.body.classList.add("overflow-hidden");
        } else {
          document.body.classList.remove("overflow-hidden");
        }
    
        // Cleanup on unmount
        return () => {
          document.body.classList.remove("overflow-hidden");
        };
      }, [show]);
    
      
  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Slider */}
          <motion.div
            className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-50 shadow-xl p-6 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-purple-700">Job Details</h2>
              <button onClick={onClose} className="text-gray-600 hover:text-red-500">
                <X size={24} />
              </button>
            </div>

            {job ? (
              <>
                <h3 className="text-lg font-bold mb-2 text-black">{job.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{job.description}</p>

                {/* Salary, Type, Experience */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Salary:</span>
                    <span className="text-sm text-purple-600">{job.salary} PKR</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Job Type:</span>
                    <span className="text-sm text-gray-800">Full Time</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Experience:</span>
                    <span className="text-sm text-gray-800">Expert</span>
                  </div>
                </div>

                {/* Client Details Section */}
                <div className="border-t pt-5">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">About the Client</h4>
                  <div className="flex items-center gap-3 mb-4">
                    {job.clientProfilePicture && (
                      <img
                        src={job.clientProfilePicture}
                        alt="Client"
                        className="h-10 w-10 rounded-full border"
                      />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-black">{job.clientName}</p>
                      <p className="text-xs text-gray-500">Verified Client</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} className="text-purple-600" />
                      <span>{job.clientLocation || "Lahore,Pakistan"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase size={18} className="text-purple-600" />
                      <span>{job.clientTotalHired || 20} Hires</span>
                    </div>
                    <div className="flex items-center gap-2">
                        
                      <DollarSign size={18} className="text-purple-500" />
                      <span>{job.clientTotalSpent || "900k"} PKR</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={18} className="text-purple-600" />
                      <span>{job.clientReview || "4.9/5"}</span>
                    </div>
                  </div>
                </div>

                <button className="mt-6 w-full bg-gradient-to-r from-purple-600 to-purple-800 text-white py-3 rounded-lg font-medium text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  Apply on Job
                </button>
              </>
            ) : (
              <p className="text-center text-gray-400">No job selected</p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
