"use client"
import { motion } from "framer-motion"

function EducationForm({ education, index, onChange, onRemove, error, fieldErrors = {} }) {
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
        <h3 className="font-medium">Education #{index + 1}</h3>
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
          <label htmlFor={`edu-institution-${index}`} className="block text-sm">
            Institution <span className="text-red-400">*</span>
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id={`edu-institution-${index}`}
            name="institution"
            value={education.institution}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-700 border ${
              fieldErrors.institution ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
          />
          {fieldErrors.institution && <p className="text-red-400 text-xs mt-1">{fieldErrors.institution}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`edu-degree-${index}`} className="block text-sm">
              Degree <span className="text-red-400">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id={`edu-degree-${index}`}
              name="degree"
              value={education.degree}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 border ${
                fieldErrors.degree ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
            />
            {fieldErrors.degree && <p className="text-red-400 text-xs mt-1">{fieldErrors.degree}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor={`edu-field-${index}`} className="block text-sm">
              Field of Study <span className="text-red-400">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="text"
              id={`edu-field-${index}`}
              name="fieldOfStudy"
              value={education.fieldOfStudy}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 border ${
                fieldErrors.fieldOfStudy ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
            />
            {fieldErrors.fieldOfStudy && <p className="text-red-400 text-xs mt-1">{fieldErrors.fieldOfStudy}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`edu-start-${index}`} className="block text-sm">
              Start Date <span className="text-red-400">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`edu-start-${index}`}
              name="startDate"
              value={education.startDate}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 border ${
                fieldErrors.startDate ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
            />
            {fieldErrors.startDate && <p className="text-red-400 text-xs mt-1">{fieldErrors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor={`edu-end-${index}`} className="block text-sm">
              End Date
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`edu-end-${index}`}
              name="endDate"
              value={education.endDate}
              onChange={handleChange}
              disabled={education.current}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`edu-current-${index}`}
            name="current"
            checked={education.current}
            onChange={handleCheckboxChange}
            className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
          />
          <label htmlFor={`edu-current-${index}`} className="text-sm">
            I am currently studying here
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor={`edu-description-${index}`} className="block text-sm">
            Description
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            id={`edu-description-${index}`}
            name="description"
            value={education.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
          ></motion.textarea>
        </div>
      </div>
    </motion.div>
  )
}

export default EducationForm
