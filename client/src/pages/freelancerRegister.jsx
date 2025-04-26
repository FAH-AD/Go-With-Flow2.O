"use client"

import React from "react"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import LanguageForm from "../components/forms/LanguageForm"
import PortfolioForm from "../components/forms/PortfolioForm"
import ExperienceForm from "../components/forms/ExperienceForm"
import EducationForm from "../components/forms/EducationForm"
import { uploadFile } from '../services/fileUpload';
import { toast } from 'react-hot-toast';


function FreelancerRegister() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "freelancer",
    location: "",
    profilePic: null,
    skills: [],
    bio: "",
    hourlyRate: "",
    title: "",
    availability: "full-time",
    languages: [{ name: "English", level: "fluent" }],
    portfolio: [],
    experience: [],
    education: [],
    socialLinks: {
      linkedin: "",
      github: "",
      twitter: "",
      website: "",
    },
  })
  const [previewUrl, setPreviewUrl] = useState(null)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSocialLinksChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      socialLinks: {
        ...prevState.socialLinks,
        [name]: value,
      },
    }))
  }


  
  // ... (other imports and code)
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setUploading(true);
        const uploadedUrl = await uploadFile(file);
        setFormData((prevState) => ({
          ...prevState,
          profilePic: uploadedUrl,
        }));
  
        // Create a preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
  
        // Clear profile pic error if it exists
        if (fieldErrors.profilePic) {
          setFieldErrors((prev) => ({
            ...prev,
            profilePic: "",
          }));
        }
      } catch (error) {
        setError("Failed to upload profile picture. Please try again.");
      } finally {
        setUploading(false);
      }
    }
  };
  

  const triggerFileInput = () => {
    fileInputRef.current.click()
  }

  const handleSkillInputChange = (e) => {
    setSkillInput(e.target.value)
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prevState) => ({
        ...prevState,
        skills: [...prevState.skills, skillInput.trim()],
      }))
      setSkillInput("")

      // Clear skills error if it exists
      if (fieldErrors.skills) {
        setFieldErrors((prev) => ({
          ...prev,
          skills: "",
        }))
      }
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddSkill()
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prevState) => ({
      ...prevState,
      skills: prevState.skills.filter((skill) => skill !== skillToRemove),
    }))
  }

  // Language handlers
  const handleAddLanguage = () => {
    setFormData((prevState) => ({
      ...prevState,
      languages: [...prevState.languages, { name: "", level: "beginner" }],
    }))
  }

  const handleRemoveLanguage = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      languages: prevState.languages.filter((_, i) => i !== index),
    }))
  }

  const handleLanguageChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      languages: prevState.languages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang)),
    }))

    // Clear language errors
    if (fieldErrors[`language-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`language-${index}`]
        return newErrors
      })
    }
  }

  // Portfolio handlers
  const handleAddPortfolio = () => {
    setFormData((prevState) => ({
      ...prevState,
      portfolio: [
        ...prevState.portfolio,
        {
          title: "",
          description: "",
          images: [],
          startDate: "",
          endDate: "",
        },
      ],
    }))
  }

  const handleRemovePortfolio = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      portfolio: prevState.portfolio.filter((_, i) => i !== index),
    }))

    // Clear portfolio errors
    if (fieldErrors[`portfolio-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`portfolio-${index}`]
        return newErrors
      })
    }
  }

  const handlePortfolioChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      portfolio: prevState.portfolio.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))

    // Clear portfolio errors
    if (fieldErrors[`portfolio-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`portfolio-${index}`]
        return newErrors
      })
    }
  }

  const handlePortfolioImageChange = async (portfolioIndex, files) => {
    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(Array.from(files).map(file => uploadFile(file)));
      
      setFormData((prevState) => ({
        ...prevState,
        portfolio: prevState.portfolio.map((item, i) =>
          i === portfolioIndex
            ? {
                ...item,
                images: [...item.images, ...uploadedUrls],
              }
            : item
        ),
      }));
    } catch (error) {
      setError("Failed to upload portfolio images. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  

  const handleRemovePortfolioImage = (portfolioIndex, imageIndex) => {
    setFormData((prevState) => ({
      ...prevState,
      portfolio: prevState.portfolio.map((item, i) =>
        i === portfolioIndex
          ? {
              ...item,
              images: item.images.filter((_, imgIdx) => imgIdx !== imageIndex),
            }
          : item,
      ),
    }))
  }

  // Experience handlers
  const handleAddExperience = () => {
    setFormData((prevState) => ({
      ...prevState,
      experience: [
        ...prevState.experience,
        {
          companyName: "",
          position: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  const handleRemoveExperience = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      experience: prevState.experience.filter((_, i) => i !== index),
    }))

    // Clear experience errors
    if (fieldErrors[`experience-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`experience-${index}`]
        return newErrors
      })
    }
  }

  const handleExperienceChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      experience: prevState.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))

    // Clear experience errors
    if (fieldErrors[`experience-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`experience-${index}`]
        return newErrors
      })
    }
  }

  // Education handlers
  const handleAddEducation = () => {
    setFormData((prevState) => ({
      ...prevState,
      education: [
        ...prevState.education,
        {
          institution: "",
          degree: "",
          fieldOfStudy: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }))
  }

  const handleRemoveEducation = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      education: prevState.education.filter((_, i) => i !== index),
    }))

    // Clear education errors
    if (fieldErrors[`education-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`education-${index}`]
        return newErrors
      })
    }
  }

  const handleEducationChange = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      education: prevState.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))

    // Clear education errors
    if (fieldErrors[`education-${index}`]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`education-${index}`]
        return newErrors
      })
    }
  }

  // Validation functions
  const validateStep1 = () => {
    const errors = {}

    if (!formData.name.trim()) errors.name = "Name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

    if (!formData.password.trim()) errors.password = "Password is required"
    else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters"

    if (!formData.location.trim()) errors.location = "Location is required"

    return errors
  }

  const validateStep2 = () => {
    const errors = {}

    if (!formData.title.trim()) errors.title = "Professional title is required"
    if (!formData.bio.trim()) errors.bio = "Bio is required"
    if (!formData.hourlyRate) errors.hourlyRate = "Hourly rate is required"

    return errors
  }

  const validateStep3 = () => {
    const errors = {}

    if (formData.skills.length === 0) errors.skills = "At least one skill is required"

    // Validate languages
    formData.languages.forEach((lang, index) => {
      if (!lang.name.trim()) {
        errors[`language-${index}`] = "Language name is required"
      }
    })

    return errors
  }

  const validateStep4 = () => {
    const errors = {}

    // Portfolio is optional, but if added, validate required fields
    formData.portfolio.forEach((project, index) => {
      if (project.title.trim() || project.description.trim() || project.startDate) {
        if (!project.title.trim()) errors[`portfolio-${index}-title`] = "Project title is required"
        if (!project.description.trim()) errors[`portfolio-${index}-description`] = "Project description is required"
        if (!project.startDate) errors[`portfolio-${index}-startDate`] = "Start date is required"

        if (Object.keys(errors).some((key) => key.startsWith(`portfolio-${index}`))) {
          errors[`portfolio-${index}`] = "Please complete or remove this portfolio item"
        }
      }
    })

    // Experience is optional, but if added, validate required fields
    formData.experience.forEach((exp, index) => {
      if (exp.companyName.trim() || exp.position.trim() || exp.startDate) {
        if (!exp.companyName.trim()) errors[`experience-${index}-companyName`] = "Company name is required"
        if (!exp.position.trim()) errors[`experience-${index}-position`] = "Position is required"
        if (!exp.startDate) errors[`experience-${index}-startDate`] = "Start date is required"

        if (Object.keys(errors).some((key) => key.startsWith(`experience-${index}`))) {
          errors[`experience-${index}`] = "Please complete or remove this experience item"
        }
      }
    })

    return errors
  }

  const validateStep5 = () => {
    const errors = {}

    // Education is optional, but if added, validate required fields
    formData.education.forEach((edu, index) => {
      if (edu.institution.trim() || edu.degree.trim() || edu.fieldOfStudy.trim() || edu.startDate) {
        if (!edu.institution.trim()) errors[`education-${index}-institution`] = "Institution is required"
        if (!edu.degree.trim()) errors[`education-${index}-degree`] = "Degree is required"
        if (!edu.fieldOfStudy.trim()) errors[`education-${index}-fieldOfStudy`] = "Field of study is required"
        if (!edu.startDate) errors[`education-${index}-startDate`] = "Start date is required"

        if (Object.keys(errors).some((key) => key.startsWith(`education-${index}`))) {
          errors[`education-${index}`] = "Please complete or remove this education item"
        }
      }
    })

    return errors
  }

  // Function to clean up incomplete optional sections
  const cleanupIncompleteData = () => {
    const updatedFormData = { ...formData }

    // Clean up portfolio items
    updatedFormData.portfolio = updatedFormData.portfolio.filter(
      (project) => project.title.trim() && project.description.trim() && project.startDate,
    )

    // Clean up experience items
    updatedFormData.experience = updatedFormData.experience.filter(
      (exp) => exp.companyName.trim() && exp.position.trim() && exp.startDate,
    )

    // Clean up education items
    updatedFormData.education = updatedFormData.education.filter(
      (edu) => edu.institution.trim() && edu.degree.trim() && edu.fieldOfStudy.trim() && edu.startDate,
    )

    return updatedFormData
  }

  const handleNextStep = () => {
    let errors = {}

    // Validate current step
    switch (currentStep) {
      case 1:
        errors = validateStep1()
        break
      case 2:
        errors = validateStep2()
        break
      case 3:
        errors = validateStep3()
        break
      case 4:
        errors = validateStep4()
        break
      default:
        break
    }

    // If there are errors, show them and don't proceed
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorKey) || document.querySelector(`[name="${firstErrorKey}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    // Clear errors and proceed to next step
    setFieldErrors({})
    setCurrentStep((prevStep) => prevStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Validate final step
    const errors = validateStep5()
  
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0]
      const element = document.getElementById(firstErrorKey) || document.querySelector(`[name="${firstErrorKey}"]`)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }
  
    setLoading(true)
    setError("")
    setFieldErrors({})
  
    try {
      // Clean up incomplete optional sections
      const cleanedFormData = cleanupIncompleteData()
  
      // Create data object for sending
      const dataToSend = {
        ...cleanedFormData,
        profilePic: previewUrl, // Assuming you have a previewUrl state for the profile picture
      }
  
      console.log("Data to send:", dataToSend)
  
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })
  
      const data = await response.json()
  
      if (!response.ok) {
        throw new Error(data.message || "Registration failed")
      }
  
      // Registration successful

        toast.success("Registration successful! Please check your email to verify your account.");
      
      // In the handleSubmit function, after successful registration:
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
}
    

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
<div className="flex items-center gap-2">
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
          <span className="text-xl font-bold text-[#9333EA]">GoWithFlow</span>
        </div>  
            <motion.div
        className="w-full max-w-2xl bg-gray-900 rounded-xl p-8 shadow-2xl mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl font-bold text-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Register as a Freelancer
        </motion.h1>
        <motion.p
          className="text-gray-400 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Create your freelancer account to find work and offer your services
        </motion.p>

        {error && (
          <motion.div
            className="bg-red-900/30 text-red-400 p-4 rounded-lg mb-6 border border-red-500"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-md">
            {[1, 2, 3, 4, 5].map((step, index, array) => (
              <React.Fragment key={step}>
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step ? "bg-purple-700" : "bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step}
                </motion.div>
                {index < array.length - 1 && (
                  <motion.div
                    className={`h-1 flex-1 ${currentStep > step ? "bg-purple-700" : "bg-gray-700"}`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: currentStep > step ? 1 : 0.3 }}
                    transition={{ duration: 0.5 }}
                  ></motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center mb-6">
                  <motion.div
                    className={`relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-800 border-2 ${
                      fieldErrors.profilePic ? "border-red-500" : "border-purple-600"
                    } flex items-center justify-center cursor-pointer`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={triggerFileInput}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                                src='https://res.cloudinary.com/dxmeatsae/image/upload/v1745522051/client_verification_docs/vtby102ctjupyjon629f.png'
                                alt="Profile preview"
                                className="w-full h-full object-cover"
                            />
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </motion.div>
                  <motion.button
                    type="button"
                    className={`text-sm font-medium ${
                      fieldErrors.profilePic ? "text-red-400" : "text-purple-500 hover:text-purple-400"
                    }`}
                    onClick={triggerFileInput}
                    whileHover={{ scale: 1.05 }}
                  >
                    {previewUrl ? "Change Profile Picture" : "Upload Profile Picture"}
                  </motion.button>
                  {fieldErrors.profilePic && <p className="text-red-400 text-sm mt-1">{fieldErrors.profilePic}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="name" className="block font-medium">
                    Name <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.name ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.name && <p className="text-red-400 text-sm mt-1">{fieldErrors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block font-medium">
                    Email <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.email ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.email && <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="block font-medium">
                    Password <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.password ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.password && <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="block font-medium">
                    Location <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.location ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.location && <p className="text-red-400 text-sm mt-1">{fieldErrors.location}</p>}
                </div>

                <motion.button
                  type="button"
                  className="w-full py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
                  onClick={handleNextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next
                </motion.button>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Professional Information</h2>

                <div className="space-y-2">
                  <label htmlFor="title" className="block font-medium">
                    Professional Title <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Full Stack Developer"
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.title ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.title && <p className="text-red-400 text-sm mt-1">{fieldErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="block font-medium">
                    Bio <span className="text-red-400">*</span>
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell clients about yourself and your expertise"
                    rows="4"
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.bio ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  ></motion.textarea>
                  {fieldErrors.bio && <p className="text-red-400 text-sm mt-1">{fieldErrors.bio}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="hourlyRate" className="block font-medium">
                    Hourly Rate (PKR) <span className="text-red-400">*</span>
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={formData.hourlyRate}
                    onChange={handleChange}
                    min="1"
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.hourlyRate ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  />
                  {fieldErrors.hourlyRate && <p className="text-red-400 text-sm mt-1">{fieldErrors.hourlyRate}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="availability" className="block font-medium">
                    Availability <span className="text-red-400">*</span>
                  </label>
                  <motion.select
                    whileFocus={{ scale: 1.01 }}
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      fieldErrors.availability ? "border-red-500" : "border-gray-700"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </motion.select>
                  {fieldErrors.availability && <p className="text-red-400 text-sm mt-1">{fieldErrors.availability}</p>}
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Skills & Languages</h2>

                <div className="space-y-2">
                  <label htmlFor="skills" className="block font-medium">
                    Skills <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="text"
                      id="skills"
                      value={skillInput}
                      onChange={handleSkillInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. JavaScript"
                      className={`flex-1 px-4 py-3 bg-gray-800 border ${
                        fieldErrors.skills ? "border-red-500" : "border-gray-700"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                    />
                    <motion.button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-4 py-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add
                    </motion.button>
                  </div>
                  {fieldErrors.skills && <p className="text-red-400 text-sm mt-1">{fieldErrors.skills}</p>}

                  <div className="flex flex-wrap gap-2 mt-3">
                    <AnimatePresence>
                      {formData.skills.map((skill, index) => (
                        <motion.div
                          key={index}
                          className="bg-purple-900/50 border border-purple-700 text-white px-3 py-1 rounded-full flex items-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                          whileHover={{ scale: 1.05 }}
                          layout
                        >
                          {skill}
                          <button
                            type="button"
                            className="ml-2 text-white hover:text-red-300 focus:outline-none"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            ×
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-medium">
                      Languages <span className="text-red-400">*</span>
                    </label>
                    <motion.button
                      type="button"
                      onClick={handleAddLanguage}
                      className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Language
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {formData.languages.map((language, index) => (
                      <LanguageForm
                        key={index}
                        language={language}
                        index={index}
                        onChange={handleLanguageChange}
                        onRemove={handleRemoveLanguage}
                        isRemovable={index !== 0} // Don't allow removing the first language
                        error={fieldErrors[`language-${index}`]}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step4"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Portfolio & Experience</h2>

                {/* Portfolio Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-medium">Portfolio Projects (Optional)</label>
                    <motion.button
                      type="button"
                      onClick={handleAddPortfolio}
                      className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Project
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {formData.portfolio.map((project, index) => (
                      <PortfolioForm
                        key={index}
                        project={project}
                        index={index}
                        onChange={handlePortfolioChange}
                        onRemove={handleRemovePortfolio}
                        onAddImage={handlePortfolioImageChange}
                        onRemoveImage={handleRemovePortfolioImage}
                        error={fieldErrors[`portfolio-${index}`]}
                        fieldErrors={{
                          title: fieldErrors[`portfolio-${index}-title`],
                          description: fieldErrors[`portfolio-${index}-description`],
                          startDate: fieldErrors[`portfolio-${index}-startDate`],
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Experience Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-medium">Work Experience (Optional)</label>
                    <motion.button
                      type="button"
                      onClick={handleAddExperience}
                      className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Experience
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {formData.experience.map((exp, index) => (
                      <ExperienceForm
                        key={index}
                        experience={exp}
                        index={index}
                        onChange={handleExperienceChange}
                        onRemove={handleRemoveExperience}
                        error={fieldErrors[`experience-${index}`]}
                        fieldErrors={{
                          companyName: fieldErrors[`experience-${index}-companyName`],
                          position: fieldErrors[`experience-${index}-position`],
                          startDate: fieldErrors[`experience-${index}-startDate`],
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handleNextStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Next
                  </motion.button>
                </div>
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="step5"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold mb-4">Education & Social Links</h2>

                {/* Education Section */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-medium">Education (Optional)</label>
                    <motion.button
                      type="button"
                      onClick={handleAddEducation}
                      className="text-sm px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white font-medium rounded-lg transition-all duration-200"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add Education
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {formData.education.map((edu, index) => (
                      <EducationForm
                        key={index}
                        education={edu}
                        index={index}
                        onChange={handleEducationChange}
                        onRemove={handleRemoveEducation}
                        error={fieldErrors[`education-${index}`]}
                        fieldErrors={{
                          institution: fieldErrors[`education-${index}-institution`],
                          degree: fieldErrors[`education-${index}-degree`],
                          fieldOfStudy: fieldErrors[`education-${index}-fieldOfStudy`],
                          startDate: fieldErrors[`education-${index}-startDate`],
                        }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <label className="block font-medium">Social Links (Optional)</label>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="block text-sm text-gray-400">
                        LinkedIn
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="url"
                        id="linkedin"
                        name="linkedin"
                        value={formData.socialLinks.linkedin}
                        onChange={handleSocialLinksChange}
                        placeholder="https://www.linkedin.com/in/username"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="github" className="block text-sm text-gray-400">
                        GitHub
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="url"
                        id="github"
                        name="github"
                        value={formData.socialLinks.github}
                        onChange={handleSocialLinksChange}
                        placeholder="https://github.com/username"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="twitter" className="block text-sm text-gray-400">
                        Twitter
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="url"
                        id="twitter"
                        name="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleSocialLinksChange}
                        placeholder="https://twitter.com/username"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="block text-sm text-gray-400">
                        Personal Website
                      </label>
                      <motion.input
                        whileFocus={{ scale: 1.01 }}
                        type="url"
                        id="website"
                        name="website"
                        value={formData.socialLinks.website}
                        onChange={handleSocialLinksChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    type="button"
                    className="flex-1 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
                    onClick={handlePrevStep}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Registering...
                      </>
                    ) : (
                      "Register"
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <motion.p
          className="text-center mt-6 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Already have an account?{" "}
          <Link to="/login" className="text-purple-500 hover:text-purple-400 font-medium">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default FreelancerRegister
