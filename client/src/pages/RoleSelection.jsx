"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"

function RoleSelection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
      <div className="flex items-center my-4 p-4 gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#9333EA]"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M8 12L11 15L16 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-3xl font-bold text-[#9333EA]">GoWithFlow</span>
        </div>

      <motion.div
        className="w-full max-w-4xl bg-gray-900 rounded-xl p-8 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Choose Your Account Type
        </motion.h1>
        <motion.p
          className="text-gray-400 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Select how you want to use GoWithFlow
        </motion.p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup/client"
              className="block h-full bg-gray-800 rounded-lg p-8 text-center border border-transparent hover:border-purple-600 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                👔
              </div>
              <h3 className="text-xl font-semibold mb-3">I'm a Client</h3>
              <p className="text-gray-400">I want to hire freelancers and post jobs</p>
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup/freelancer"
              className="block h-full bg-gray-800 rounded-lg p-8 text-center border border-transparent hover:border-purple-600 transition-all duration-300"
            >
              <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                💼
              </div>
              <h3 className="text-xl font-semibold mb-3">I'm a Freelancer</h3>
              <p className="text-gray-400">I want to find work and offer my services</p>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default RoleSelection
