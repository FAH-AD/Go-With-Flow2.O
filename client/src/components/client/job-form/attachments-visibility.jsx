"use client"

import { useState } from "react"
import { Upload, X, File, Eye, EyeOff } from "lucide-react"

const AttachmentsVisibility = ({ jobData, handleChange }) => {
  const [dragActive, setDragActive] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // Handle file upload
  const handleFileUpload = (files) => {
    setUploadError("")

    // In a real app, you would upload these files to your server/cloud storage
    // For this demo, we'll just store the file names and simulate URLs

    if (!files || files.length === 0) return

    // Check file size (limit to 10MB per file)
    const maxSize = 10 * 1024 * 1024 // 10MB
    const oversizedFiles = Array.from(files).filter((file) => file.size > maxSize)

    if (oversizedFiles.length > 0) {
      setUploadError(`Some files exceed the 10MB limit: ${oversizedFiles.map((f) => f.name).join(", ")}`)
      return
    }

    // Limit to 5 files total
    if (jobData.attachments.length + files.length > 5) {
      setUploadError("You can upload a maximum of 5 files")
      return
    }

    // Create mock URLs for the files
    const newAttachments = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      url: `https://example.com/uploads/${file.name.replace(/\s+/g, "-")}`,
    }))

    handleChange("attachments", [...jobData.attachments, ...newAttachments])
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  // Remove attachment
  const removeAttachment = (url) => {
    handleChange(
      "attachments",
      jobData.attachments.filter((attachment) => attachment.url !== url),
    )
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(1) + " MB"
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Attachments</label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? "border-[#9333EA] bg-[#9333EA]/10" : "border-[#2d2d3a]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload size={36} className="text-gray-400 mb-2" />
            <p className="mb-2 text-sm">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">PDF, DOCX, JPG, PNG (Max 10MB per file)</p>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleFileUpload(e.target.files)}
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 px-4 py-2 bg-[#1e1e2d] hover:bg-[#2d2d3a] rounded-md cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>
        </div>
        {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
        <p className="mt-1 text-xs text-gray-400">
          Upload up to 5 files. Include project briefs, mockups, or any relevant documents.
        </p>
      </div>

      {/* Attached Files */}
      {jobData.attachments.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Attached Files</h4>
          <div className="space-y-2">
            {jobData.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#1e1e2d] p-3 rounded-md border border-[#2d2d3a]"
              >
                <div className="flex items-center">
                  <div className="bg-[#9333EA]/20 p-2 rounded-md mr-3">
                    <File size={16} className="text-[#9333EA]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeAttachment(file.url)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Job Visibility */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">Job Visibility</label>
        <div className="space-y-3">
          <div
            onClick={() => handleChange("isPublic", true)}
            className={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${
              jobData.isPublic
                ? "bg-[#9333EA]/20 border border-[#9333EA]"
                : "bg-[#1e1e2d] border border-[#2d2d3a] hover:border-[#9333EA]/50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                jobData.isPublic ? "bg-[#9333EA]" : "border border-[#2d2d3a]"
              }`}
            >
              {jobData.isPublic && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <Eye size={18} className="mr-2" />
                <span className="font-medium">Public Job</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Visible to all freelancers. Get more proposals and find talent quickly.
              </p>
            </div>
          </div>

          <div
            onClick={() => handleChange("isPublic", false)}
            className={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${
              !jobData.isPublic
                ? "bg-[#9333EA]/20 border border-[#9333EA]"
                : "bg-[#1e1e2d] border border-[#2d2d3a] hover:border-[#9333EA]/50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                !jobData.isPublic ? "bg-[#9333EA]" : "border border-[#2d2d3a]"
              }`}
            >
              {!jobData.isPublic && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <EyeOff size={18} className="mr-2" />
                <span className="font-medium">Private Job</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Only visible to freelancers you invite. Best for confidential projects.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Promote Job */}
      <div className="mt-6">
        <div
          onClick={() => handleChange("isPromoted", !jobData.isPromoted)}
          className={`flex items-center p-4 rounded-md cursor-pointer transition-colors ${
            jobData.isPromoted
              ? "bg-[#9333EA]/20 border border-[#9333EA]"
              : "bg-[#1e1e2d] border border-[#2d2d3a] hover:border-[#9333EA]/50"
          }`}
        >
          <div className="mr-3">
            <div
              className={`w-5 h-5 rounded border ${
                jobData.isPromoted
                  ? "bg-[#9333EA] border-[#9333EA] flex items-center justify-center"
                  : "border-[#2d2d3a]"
              }`}
            >
              {jobData.isPromoted && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center">
              <span className="font-medium">Promote this job (Featured)</span>
              <span className="ml-2 px-2 py-0.5 bg-[#9333EA] text-white text-xs rounded-full">+$29.99</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Get 5x more visibility, featured placement, and priority support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttachmentsVisibility
