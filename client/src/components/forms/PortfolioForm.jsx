"use client"

import { useState ,useRef} from "react"
import { motion, AnimatePresence } from "framer-motion"
import {Button} from "../Button"

function PortfolioForm({ project, index, onChange, onRemove, onAddImage, onRemoveImage, error, fieldErrors = {} }) {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)
  
    const handleChange = (e) => {
      const { name, value } = e.target
      onChange(index, name, value)
    }
  
    const handleFileUpload = async (e) => {
      const files = e.target.files
      if (files.length > 0) {
        try {
          setUploading(true)
          await onAddImage(index, files)
        } catch (error) {
          console.error("Error uploading file:", error)
          // You might want to show an error message to the user here
        } finally {
          setUploading(false)
        }
      }
    }
  
    const triggerFileInput = () => {
      fileInputRef.current.click()
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
        <h3 className="font-medium">Project #{index + 1}</h3>
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
          <label htmlFor={`project-title-${index}`} className="block text-sm">
            Project Title <span className="text-red-400">*</span>
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id={`project-title-${index}`}
            name="title"
            value={project.title}
            onChange={handleChange}
            required
            className={`w-full px-4 py-2 bg-gray-700 border ${
              fieldErrors.title ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
          />
          {fieldErrors.title && <p className="text-red-400 text-xs mt-1">{fieldErrors.title}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor={`project-description-${index}`} className="block text-sm">
            Description <span className="text-red-400">*</span>
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            id={`project-description-${index}`}
            name="description"
            value={project.description}
            onChange={handleChange}
            rows="3"
            required
            className={`w-full px-4 py-2 bg-gray-700 border ${
              fieldErrors.description ? "border-red-500" : "border-gray-600"
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
          ></motion.textarea>
          {fieldErrors.description && <p className="text-red-400 text-xs mt-1">{fieldErrors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor={`project-start-${index}`} className="block text-sm">
              Start Date <span className="text-red-400">*</span>
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`project-start-${index}`}
              name="startDate"
              value={project.startDate}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-gray-700 border ${
                fieldErrors.startDate ? "border-red-500" : "border-gray-600"
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
            />
            {fieldErrors.startDate && <p className="text-red-400 text-xs mt-1">{fieldErrors.startDate}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor={`project-end-${index}`} className="block text-sm">
              End Date
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              type="date"
              id={`project-end-${index}`}
              name="endDate"
              value={project.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        <div className="mt-4">
        <label className="block font-medium mb-2">Project Images</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {project.images && project.images.map((image, imgIndex) => (
            <div key={imgIndex} className="relative">
              <img src={image} alt={`Project ${index + 1} - Image ${imgIndex + 1}`} className="w-24 h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => onRemoveImage(index, imgIndex)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        <Button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="mt-2"
        >
          {uploading ? "Uploading..." : "Add Images"}
        </Button>
     


          <div className="flex flex-wrap gap-2 mt-2">
            <AnimatePresence>
              {project.images.map((image, imgIndex) => (
                <motion.div
                  key={imgIndex}
                  className="relative group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Project ${index + 1} image ${imgIndex + 1}`}
                    className="w-16 h-16 object-cover rounded-md border border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/150?text=Error"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index, imgIndex)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default PortfolioForm
