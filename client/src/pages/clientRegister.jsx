"use client"

import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { toast } from 'react-hot-toast';

function ClientRegister() {
    const navigate = useNavigate()
    const fileInputRef = useRef(null)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "client",
        companyName: "",
        companyWebsite: "",
        industry: "",
        profilePic: null,
    })
    const [previewUrl, setPreviewUrl] = useState(null)
    const [error, setError] = useState("")
    const [fieldErrors, setFieldErrors] = useState({})
    const [loading, setLoading] = useState(false)

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

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch("http://localhost:5000/api/upload/test-upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }

                const data = await response.json();
                setPreviewUrl(data.file.url);

                // Clear profile pic error if it exists
                if (fieldErrors.profilePic) {
                    setFieldErrors((prev) => ({
                        ...prev,
                        profilePic: "",
                    }));
                }
            } catch (error) {
                console.error("Error uploading file:", error);
                setError("Failed to upload profile picture. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    const validateForm = () => {
        const errors = {}

        if (!formData.name.trim()) errors.name = "Name is required"
        if (!formData.email.trim()) errors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid"

        if (!formData.password.trim()) errors.password = "Password is required"
        else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters"

        if (!formData.companyName.trim()) errors.companyName = "Company name is required"
        if (!formData.industry) errors.industry = "Industry is required"

        return errors
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();

        if (Object.keys(errors).length > 0) {
            setFieldErrors(errors);
            // Scroll to the first error
            const firstErrorKey = Object.keys(errors)[0];
            const element = document.getElementById(firstErrorKey) || document.querySelector(`[name="${firstErrorKey}"]`);
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        setLoading(true);
        setError("");
        setFieldErrors({});

        try {
            // Create data object for sending
            const dataToSend = {
                ...formData,
                profilePic: previewUrl, // Use the uploaded image URL
            };


            console.log("Data to send:", dataToSend);

            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Registration failed");
            }

            // Registration successful
           toast.success("Registration successful! Please check your email to verify your account.");
                 
// In the handleSubmit function, after successful registration:
          navigate("/verify-email", { state: { email: formData.email } });
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
            <div className="flex items-center p-4 my-4 gap-2">
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
                <span className="text-2xl font-bold text-[#9333EA]">GoWithFlow</span>
            </div>
            <motion.div
                className="w-full max-w-xl bg-gray-900 rounded-xl p-8 shadow-2xl"
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
                    Register as a Client
                </motion.h1>
                <motion.p
                    className="text-gray-400 text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Create your client account to post jobs and hire freelancers
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

                <motion.form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {/* Profile Picture Upload */}
                    <div className="flex flex-col items-center mb-6">
                        <motion.div
                            className={`relative w-32 h-32 mb-4 rounded-full overflow-hidden bg-gray-800 border-2 ${fieldErrors.profilePic ? "border-red-500" : "border-purple-600"
                                } flex items-center justify-center cursor-pointer`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={triggerFileInput}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
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
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </motion.div>
                        <motion.button
                            type="button"
                            className={`text-sm font-medium ${fieldErrors.profilePic ? "text-red-400" : "text-purple-500 hover:text-purple-400"
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
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.name ? "border-red-500" : "border-gray-700"
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
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.email ? "border-red-500" : "border-gray-700"
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
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.password ? "border-red-500" : "border-gray-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                        />
                        {fieldErrors.password && <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="companyName" className="block font-medium">
                            Company Name <span className="text-red-400">*</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.companyName ? "border-red-500" : "border-gray-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                        />
                        {fieldErrors.companyName && <p className="text-red-400 text-sm mt-1">{fieldErrors.companyName}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="companyWebsite" className="block font-medium">
                            Company Website
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="url"
                            id="companyWebsite"
                            name="companyWebsite"
                            value={formData.companyWebsite}
                            onChange={handleChange}
                            placeholder="https://example.com"
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.companyWebsite ? "border-red-500" : "border-gray-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                        />
                        {fieldErrors.companyWebsite && <p className="text-red-400 text-sm mt-1">{fieldErrors.companyWebsite}</p>}
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="industry" className="block font-medium">
                            Industry <span className="text-red-400">*</span>
                        </label>
                        <motion.select
                            whileFocus={{ scale: 1.01 }}
                            id="industry"
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            required
                            className={`w-full px-4 py-3 bg-gray-800 border ${fieldErrors.industry ? "border-red-500" : "border-gray-700"
                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200`}
                        >
                            <option value="">Select Industry</option>
                            <option value="Technology">Technology</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Other">Other</option>
                        </motion.select>
                        {fieldErrors.industry && <p className="text-red-400 text-sm mt-1">{fieldErrors.industry}</p>}
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-4 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
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
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
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
                </motion.form>

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

export default ClientRegister
