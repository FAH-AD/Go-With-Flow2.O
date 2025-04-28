"use client"

import { useState, useRef } from "react"
import { Upload, X, Eye, EyeOff, Sparkles, FileText, File } from "lucide-react"

const AttachmentsVisibility = ({ jobData, handleChange }) => {
  const fileInputRef = useRef(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileChange = (e) => {
    const files = e.target.files
    if (files.length > 0) {
      const newFiles = Array.from(files)
      handleChange("attachments", [...jobData.attachments, ...newFiles])
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      handleChange("attachments", [...jobData.attachments, ...newFiles])
    }
  }

  const removeFile = (index) => {
    const updatedFiles = [...jobData.attachments]
    updatedFiles.splice(index, 1)
    handleChange("attachments", updatedFiles)
  }

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase()

    switch (extension) {
      case "pdf":
        return <FileText size={20} className="text-red-400" />
      case "doc":
      case "docx":
        return <FileText size={20} className="text-blue-400" />
      case "xls":
      case "xlsx":
        return <FileText size={20} className="text-green-400" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <FileText size={20} className="text-purple-400" />
      default:
        return <File size={20} className="text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">Attachments</label>
        <div
          className={`border-2 border-dashed rounded-md p-6 text-center ${
            dragActive ? "border-[#9333EA] bg-[#9333EA]/5" : "border-[#2d2d3a]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" />
          <div className="flex flex-col items-center justify-center">
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-gray-300 mb-1">Drag and drop files here, or</p>
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="text-[#9333EA] hover:text-[#a855f7] font-medium"
            >
              Browse files
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Upload project briefs, design files, or any relevant documents (Max 10MB per file)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {jobData.attachments.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-300 mb-2">Uploaded Files</div>
          <div className="space-y-2">
            {jobData.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#1e1e2d] border border-[#2d2d3a] rounded-md p-3"
              >
                <div className="flex items-center">
                  {getFileIcon(file.name)}
                  <div className="ml-3">
                    <div className="text-sm font-medium truncate max-w-xs">{file.name}</div>
                    <div className="text-xs text-gray-400">{(file.size / 1024).toFixed(2)} KB</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visibility Options */}
      <div className="space-y-4 mt-8">
        <h3 className="font-medium">Job Visibility</h3>
        <div className="space-y-3">
          <div
            className={`flex items-center justify-between p-4 border ${
              jobData.isPublic ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
            } rounded-md cursor-pointer transition-colors`}
            onClick={() => handleChange("isPublic", true)}
          >
            <div className="flex items-center">
              <Eye size={20} className="text-[#9333EA] mr-3" />
              <div>
                <div className="font-medium">Public Job</div>
                <div className="text-sm text-gray-400">Visible to all freelancers on the platform</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border ${
                jobData.isPublic ? "bg-[#9333EA] border-[#9333EA]" : "border-gray-500"
              } flex items-center justify-center`}
            >
              {jobData.isPublic && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>

          <div
            className={`flex items-center justify-between p-4 border ${
              !jobData.isPublic ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
            } rounded-md cursor-pointer transition-colors`}
            onClick={() => handleChange("isPublic", false)}
          >
            <div className="flex items-center">
              <EyeOff size={20} className="text-[#9333EA] mr-3" />
              <div>
                <div className="font-medium">Private Job</div>
                <div className="text-sm text-gray-400">Only visible to freelancers you invite</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border ${
                !jobData.isPublic ? "bg-[#9333EA] border-[#9333EA]" : "border-gray-500"
              } flex items-center justify-center`}
            >
              {!jobData.isPublic && <div className="w-2 h-2 bg-white rounded-full"></div>}
            </div>
          </div>
        </div>
      </div>

      {/* Promotion Option */}
      {/* <div className="mt-8">
        <div
          className={`flex items-center justify-between p-4 border ${
            jobData.isPromoted ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a] bg-[#1e1e2d]"
          } rounded-md cursor-pointer transition-colors`}
          onClick={() => handleChange("isPromoted", !jobData.isPromoted)}
        >
          <div className="flex items-center">
            <Sparkles size={20} className="text-[#9333EA] mr-3" />
            <div>
              <div className="font-medium">Promote this Job</div>
              <div className="text-sm text-gray-400">
                Get more visibility and attract top talent (additional $29.99)
              </div>
            </div>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={jobData.isPromoted} onChange={() => {}} className="sr-only peer" />
            <div className="w-11 h-6 bg-[#2d2d3a] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#9333EA] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9333EA]"></div>
          </div>
        </div>
      </div> */}

    </div>
  )
}

export default AttachmentsVisibility
