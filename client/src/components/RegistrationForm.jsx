import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import { post } from '../services/ApiEndpoint';
import { toast } from 'react-hot-toast';
import { Input } from '../components/Input';
import { Textarea } from '../components/Textarea';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { Eye, EyeOff } from "lucide-react";


export default function FreelancerRegistrationForm() {
    const [step, setStep] = useState(0);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    let navigate=useNavigate()
    const handleProfileClick = () => {
        fileInputRef.current.click();
    };


    const steps = [
        "Basic Info",
        "Profile & Title",
        "Skills",
        "Experience",
        "Education",
        "Languages",
        "Certificates",
        "Portfolio",
        "Review & Submit"
    ];



    const [formData, setFormData] = useState({
        name: '',

        email: '',
        password: '',
        profilePicture: '',
        role: 'freelancer',
        title: '',
        description: '',
        skills: [],
        experience: [],
        portfolio: [],
        education: [],
        languages: [],
        companyName: '',
        rate: 0,
        certificates: []
    });


    const validateStep = () => {
        switch (step) {
            case 0: {
                const { name, email, password, profilePicture } = formData;

                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
                const isValidPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);


                if (!name?.trim()) return { isValid: false, error: 'Name is required.' };
                if (!isValidEmail) return { isValid: false, error: 'Invalid email format.' };
                if (!isValidPassword) return { isValid: false, error: 'Password must be at least 8 characters, include letters and numbers.' };
                if (!profilePicture) return { isValid: false, error: 'Profile picture is required.' };

                return { isValid: true };
            }
            case 1: {
                const { title, description, rate } = formData;
                console.log('title:', title, 'description:', description, 'rate:', rate);
                if (title?.trim() && description?.trim() && rate > 0) {
                    return { isValid: true };
                }
                return { isValid: false, error: 'Title, description and rate are required.' };
            }

            case 2: {
                if (formData.skills.length > 0) {
                    return { isValid: true };
                }
                return { isValid: false, error: 'up to 5 skills are required.' };
            }

            case 3: { // Experience
                const { experience } = formData;
                if (experience.length === 0) return true;

                for (let exp of experience) {
                    if (
                        !exp.companyName?.trim() ||
                        !exp.role?.trim() ||
                        !exp.startDate?.trim() ||
                        !exp.endDate?.trim() ||
                        !exp.description?.trim()
                    ) {
                        return { isValid: false, error: 'all details are required.' };
                    }
                }
                return { isValid: true };
            }

            case 4: { // Portfolio
                return formData.portfolio.length > 0 && formData.portfolio.every(proj =>
                    proj.projectName?.trim() &&
                    proj.description?.trim()
                );
            }

            case 5: { // Education
                return formData.education.length > 0 && formData.education.every(edu =>
                    edu.institution?.trim() &&
                    edu.degree?.trim() &&
                    edu.startYear?.toString().trim() &&
                    edu.endYear?.toString().trim()
                );
            }

            case 6: { // Languages
                return formData.languages.length > 0 && formData.languages.every(lang =>
                    lang.language?.trim() &&
                    lang.level?.trim()
                );
            }

            case 7: { // Certificates (optional)
                const { certificates } = formData;
                if (certificates.length === 0) return true;

                for (let cert of certificates) {
                    if (
                        !cert.title?.trim() ||
                        !cert.institute?.trim() ||
                        !cert.startDate?.trim() ||
                        !cert.endDate?.trim()
                    ) {
                        return false;
                    }
                }
                return true;
            }

            default:
                return true;
        }
    };




    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]:
                name === 'rate'
                    ? value === '' ? '' : Number(value)
                    : value
        }));
    };


    const addToArray = (field, item) => {
        const allFieldsFilled = Object.values(item).every(value => value !== '' && value !== undefined);

        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], item]
        }));
    };

    const handleArrayChange = (field, index, key, value) => {
        setFormData((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray[index] = { ...updatedArray[index], [key]: value };
            return { ...prev, [field]: updatedArray };
        });
    };

    const removeFromArray = (field, index) => {
        setFormData((prev) => {
            const updatedArray = [...prev[field]];
            updatedArray.splice(index, 1);
            return { ...prev, [field]: updatedArray };
        });
    };

    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const data = new FormData();
            data.append('document', file);

            setUploading(true); // start loader

            try {
                const res = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: data,
                });

                const result = await res.json();

                if (res.ok && result.fileUrl) {
                    handleChange('profilePicture', result.fileUrl);
                } else {
                    console.error(result.message || 'Upload failed');
                }
            } catch (err) {
                console.error("Upload error:", err);
            } finally {
                setUploading(false); // stop loader
            }
        }
    };
    const handleFileChange = async (section, index, files) => {
        if (!files.length) return;

        const uploadedImages = [];
        setUploading(true);

        for (let file of files) {
            const data = new FormData();
            data.append('document', file);

            try {
                const res = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: data,
                });

                const result = await res.json();

                if (res.ok && result.fileUrl) {
                    const imageObj = {
                        url: result.fileUrl,
                        name: file.name
                    };

                    // Avoid adding duplicate images by URL
                    if (!uploadedImages.find(img => img.url === imageObj.url)) {
                        uploadedImages.push(imageObj);
                    }
                }
            } catch (err) {
                console.error("Upload error:", err);
            }
        }

        // Prevent duplication in state
        setFormData(prev => {
            const updatedSection = [...prev[section]];
            const existingImages = updatedSection[index].images || [];

            // Combine and filter unique URLs
            const combinedImages = [...existingImages, ...uploadedImages].filter(
                (img, i, arr) => arr.findIndex(x => x.url === img.url) === i
            );

            updatedSection[index].images = combinedImages;
            return { ...prev, [section]: updatedSection };
        });

        setUploading(false);
    };





    const next = () => {
        const { isValid, error } = validateStep();

        if (!isValid) {
            toast.error(error || 'Please fill all fields before proceeding.');
            //   return;
        }

        if (step < steps.length - 1) {
            setStep(prev => prev + 1);
        }
    };

    const prev = () => {
        if (step > 0) {
            setStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await post('/api/register', { ...formData, role: 'freelancer' });
            if (response.status === 200 || response.status === 201) {
                toast.success('Registration successful!');
                navigate('/login');
            } else {
                toast.error('Registration failed!');
            }
        } catch (err) {
            toast.error('An error occurred.');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim()) {
            e.preventDefault();
            // Check limit
            if (formData.skills.length >= 5) return;

            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, inputValue.trim()]
            }));
            setInputValue('');
        }
    };
    return (
        <div className="bg-white max-w-6xl w-full m-auto rounded-xl shadow-md p-8">
            <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold">Register Your Account</h2>
                <p className="text-purple-700 font-semibold">Step {step + 1} of {steps.length}: {steps[step]}</p>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.4 }}
                >
                    {step === 0 && (
                        <div className="space-y-4">
                            <div className="flex flex-col items-center space-y-2">
                                <div
                                    className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition flex items-center justify-center"
                                    onClick={handleProfileClick}
                                >
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                    ) : (
                                        <img
                                            src={formData.profilePicture || 'https://res.cloudinary.com/dxmeatsae/image/upload/v1744198536/uploads/tep04pn8luh3bt2n24g6.png'}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleProfileUpload}
                                    className="hidden"
                                />
                            </div>

                            <Input placeholder="Full Name" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                            <Input placeholder="Email" type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                            <div className="relative">
                                <Input
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={e => handleChange('password', e.target.value)}
                                    className="pr-10" // space for icon
                                />
                                <div
                                    className="absolute inset-y-0 right-2 flex items-center cursor-pointer"
                                    onClick={() => setShowPassword(prev => !prev)}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-4">
                            <Input
                                placeholder="Title (i.e. Front End Developer)"
                                value={formData.title}
                                onChange={e => handleChange('title', e.target.value)}
                            />

                            <Textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={e => handleChange('description', e.target.value)}
                            />
                            <label htmlFor="">Starting Rate in pkr/hour:</label>
                            <Input
                                type="number"
                                placeholder="starting rate pkr/hour"
                                value={formData.rate}
                                onChange={e => handleChange('rate', e.target.value)}
                            />
                        </div>

                    )}

                    {step === 2 && (
                        <div className="space-y-2">
                            <Input
                                placeholder="Add a skill and press Enter"
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={formData.skills.length >= 5} // Optional: disable input when limit is reached
                            />
                            <div className="flex flex-wrap gap-2">
                                {formData.skills.map((skill, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4">
                            {formData.experience.map((exp, idx) => (
                                <div key={idx} className="space-y-2 border p-4 rounded relative">
                                    <button className="absolute top-2 right-2" onClick={() => removeFromArray('experience', idx)}><Trash2 size={18} /></button>
                                    <Input placeholder="Company Name" value={exp.companyName} onChange={e => handleArrayChange('experience', idx, 'companyName', e.target.value)} />
                                    <Input placeholder="Role" value={exp.role} onChange={e => handleArrayChange('experience', idx, 'role', e.target.value)} />
                                    <Input placeholder="Start Date" type="date" value={exp.startDate} onChange={e => handleArrayChange('experience', idx, 'startDate', e.target.value)} />
                                    <Input placeholder="End Date" type="date" value={exp.endDate || ''} onChange={e => handleArrayChange('experience', idx, 'endDate', e.target.value)} />
                                    <Textarea placeholder="Description" value={exp.description} onChange={e => handleArrayChange('experience', idx, 'description', e.target.value)} />
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => addToArray('experience', { companyName: '', role: '', startDate: '', endDate: '', description: '', images: [] })}>+ Add Experience</Button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-4">
                            {formData.education.map((edu, idx) => (
                                <div key={idx} className="space-y-2 border p-4 rounded relative">
                                    <button className="absolute top-2 right-2" onClick={() => removeFromArray('education', idx)}><Trash2 size={18} /></button>
                                    <Input placeholder="Institution" value={edu.institution} onChange={e => handleArrayChange('education', idx, 'institution', e.target.value)} />
                                    <Input placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange('education', idx, 'degree', e.target.value)} />
                                    <Input placeholder="Start Year" type="number" value={edu.startYear} onChange={e => handleArrayChange('education', idx, 'startYear', e.target.value)} />
                                    <Input placeholder="End Year" type="number" value={edu.endYear} onChange={e => handleArrayChange('education', idx, 'endYear', e.target.value)} />
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => addToArray('education', { institution: '', degree: '', startYear: '', endYear: '' })}>+ Add Education</Button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-4">
                            {formData.languages.map((lang, idx) => (
                                <div key={idx} className="space-y-2 border p-4 rounded relative">
                                    <button className="absolute top-2 right-2" onClick={() => removeFromArray('languages', idx)}><Trash2 size={18} /></button>
                                    <Input placeholder="Language" value={lang.language} onChange={e => handleArrayChange('languages', idx, 'language', e.target.value)} />
                                    <select
                                        className="w-full border rounded px-3 py-2"
                                        value={lang.level}
                                        onChange={e => handleArrayChange('languages', idx, 'level', e.target.value)}
                                    >
                                        <option value="">Select Proficiency</option>
                                        <option value="native">Native</option>
                                        <option value="fluent">Fluent</option>
                                        <option value="beginner">Beginner</option>
                                    </select>
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => addToArray('languages', { language: '', level: '' })}>+ Add Language</Button>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="space-y-4">
                            {formData.certificates.map((cert, idx) => (
                                <div key={idx} className="space-y-2 border p-4 rounded relative">
                                    <button className="absolute top-2 right-2" onClick={() => removeFromArray('certificates', idx)}><Trash2 size={18} /></button>
                                    <Input placeholder="Title" value={cert.title} onChange={e => handleArrayChange('certificates', idx, 'title', e.target.value)} />
                                    <Input placeholder="Institute" value={cert.institute} onChange={e => handleArrayChange('certificates', idx, 'institute', e.target.value)} />
                                    <Input placeholder="Start Date" type="date" value={cert.startDate} onChange={e => handleArrayChange('certificates', idx, 'startDate', e.target.value)} />
                                    <Input placeholder="End Date" type="date" value={cert.endDate} onChange={e => handleArrayChange('certificates', idx, 'endDate', e.target.value)} />
                                    <Input type="file" multiple onChange={e => handleFileChange('certificates', idx, e.target.files)} />
                                    {cert.images && cert.images.length > 0 && (
                                        <div className="space-y-1 mt-2">
                                            {cert.images.map((img, i) => (
                                                <div key={i} className="text-sm flex gap-2 items-center">
                                                    <img src={img.url} alt={img.name} className="w-12 h-12 object-cover rounded" />
                                                    <span>{img.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}                             </div>
                            ))}
                            <Button variant="outline" onClick={() => addToArray('certificates', { title: '', institute: '', startDate: '', endDate: '', images: [] })}>+ Add Certificate</Button>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="space-y-4">
                            {formData.portfolio.map((proj, idx) => (
                                <div key={idx} className="space-y-2 border p-4 rounded relative">
                                    <button className="absolute top-2 right-2" onClick={() => removeFromArray('portfolio', idx)}><Trash2 size={18} /></button>
                                    <Input placeholder="Project Name" value={proj.projectName} onChange={e => handleArrayChange('portfolio', idx, 'projectName', e.target.value)} />
                                    <Textarea placeholder="Description" value={proj.description} onChange={e => handleArrayChange('portfolio', idx, 'description', e.target.value)} />
                                    <Input type="file" multiple onChange={e => handleFileChange('portfolio', idx, e.target.files)} />
                                    {proj.images && proj.images.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            {proj.images.map((img, i) => (
                                                <div key={i} className="text-sm">
                                                    <img src={img.url} alt={img.name} className="w-full  object-cover rounded" />
                                                    <span>{img.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <Button variant="outline" onClick={() => addToArray('portfolio', { projectName: '', description: '', images: [] })}>+ Add Project</Button>
                        </div>
                    )}

                    {step === 8 && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-800">Review Your Details</h3>
                            <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                            <p className="text-gray-600 text-sm">Please review your information above. Click Register to submit.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex justify-between">
                {step > 0 ? (
                    <Button variant="outline" onClick={prev}>Back</Button>
                ) : <div />}
                {step < steps.length - 1 ? (
                    <Button onClick={next}>Next</Button>
                ) : (
                    <Button className="bg-purple-700 text-white" onClick={handleSubmit}>Register</Button>
                )}
            </div>
        </div>
    );
}
