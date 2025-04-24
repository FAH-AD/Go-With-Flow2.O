"use client"
import { motion } from "framer-motion"

function LanguageForm({ language, index, onChange, onRemove, isRemovable, error }) {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange(index, name, value)
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
        <h3 className="font-medium">Language #{index + 1}</h3>
        {isRemovable && (
          <motion.button
            type="button"
            onClick={() => onRemove(index)}
            className="text-red-400 hover:text-red-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Remove
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor={`language-name-${index}`} className="block text-sm">
            Language <span className="text-red-400">*</span>
          </label>
          <motion.input
            whileFocus={{ scale: 1.01 }}
            type="text"
            id={`language-name-${index}`}
            name="name"
            value={language.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor={`language-level-${index}`} className="block text-sm">
            Proficiency Level <span className="text-red-400">*</span>
          </label>
          <motion.select
            whileFocus={{ scale: 1.01 }}
            id={`language-level-${index}`}
            name="level"
            value={language.level}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="fluent">Fluent</option>
            <option value="bilingual">Bilingual/Native</option>
          </motion.select>
        </div>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </motion.div>
  )
}

export default LanguageForm
