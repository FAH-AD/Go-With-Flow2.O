"use client"
import { motion } from "framer-motion"

function ExperienceForm({ experience, index, onChange, onRemove, error, fieldErrors = {} }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(index, name, value)
  }

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target
    onChange(index, name, checked)
  }

  return (
    <motion.div
      className={`p-4 bg-gray-800 rounded-lg border ${error ? "border-red-500" : "border-gray-700"}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium">Experience #{index + 1}</h3>
        <motion.button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Remove
        </motion.button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-900/30 border border-red-500 rounded-lg text-red-400 text-sm">{error}</div>
      )}

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor={`exp-company-${index}`} className="block text-sm">
            Company Name <span className="text-red-400">*</span>
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id={`exp-company-${index}`}
            name="companyName"
            value={experience.companyName}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-700 border ${
              fieldErrors.companyName ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
          />
          {fieldErrors.companyName && <p className="text-red-400 text-xs mt-1">{fieldErrors.companyName}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor={`exp-position-${index}`} className="block text-sm">
            Position <span className="text-red-400">*</span>
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id={`exp-position-${index}`}
            name="position"
            value={experience.position}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-700 border ${
              fieldErrors.position ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
          />
          {fieldErrors.position && <p className="text-red-400 text-xs mt-1">{fieldErrors.position}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`exp-start-${index}`} className="block text-sm">
              Start Date <span className="text-red-400">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`exp-start-${index}`}
              name="startDate"
              value={experience.startDate}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 border ${
                fieldErrors.startDate ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
            />
            {fieldErrors.startDate && <p className="text-red-400 text-xs mt-1">{fieldErrors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor={`exp-end-${index}`} className="block text-sm">
              End Date
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`exp-end-${index}`}
              name="endDate"
              value={experience.endDate}
              onChange={handleChange}
              disabled={experience.current}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`exp-current-${index}`}
            name="current"
            checked={experience.current}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor={`exp-current-${index}`} className="text-sm">
            I currently work here
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor={`exp-description-${index}`} className="block text-sm">
            Description
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            id={`exp-description-${index}`}
            name="description"
            value={experience.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
          ></motion.textarea>
        </div>
      </div>
    </motion.div>
  )
}

export default ExperienceForm
