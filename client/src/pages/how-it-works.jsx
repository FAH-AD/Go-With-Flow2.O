"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Search, Shield, Clock, Zap } from "lucide-react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
export default function HowItWorks() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const navigate = useNavigate()
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up in minutes and complete your profile to get started on GoWithFlow.",
      icon: <CheckCircle className="w-6 h-6 text-purple-500" />,
      image: "/images/create-account.svg",
    },
    {
      title: "Post Your Project",
      description: "Describe your project needs, set your budget, and specify required skills.",
      icon: <Search className="w-6 h-6 text-purple-500" />,
      image: "/images/post-project.svg",
    },
    {
      title: "Connect With Talent",
      description: "Our AI matching system connects you with the perfect freelancers for your project.",
      icon: <Zap className="w-6 h-6 text-purple-500" />,
      image: "/images/connect-talent.svg",
    },
    {
      title: "Collaborate Securely",
      description: "Use our platform tools to communicate, share files, and track progress.",
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      image: "/images/collaborate.svg",
    },
    {
      title: "Pay Only For Quality Work",
      description: "Release payment only when you're completely satisfied with the delivered work.",
      icon: <Clock className="w-6 h-6 text-purple-500" />,
      image: "/images/payment.svg",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar/>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="relative py-20 px-4 md:px-8 lg:px-16 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={fadeIn}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              How <span className="text-purple-500">GoWithFlow</span> Works
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined process makes it easy to find talent, collaborate on projects, and get quality work done
              efficiently.
            </p>
          </motion.div>

          {/* Animated graphic */}
          
        </div>
      </motion.section>

      {/* Steps Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-4 md:px-8 lg:px-16 bg-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className={`grid md:grid-cols-2 gap-8 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
              >
                <div className={`order-2 ${index % 2 === 1 ? "md:order-1" : "md:order-2"}`}>
                  <motion.div
                    className="bg-gray-800 rounded-xl overflow-hidden p-8"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      
                      className="w-[400px] h-auto object-contain"
                    />
                  </motion.div>
                </div>
                <div className={`order-1 ${index % 2 === 1 ? "md:order-2" : "md:order-1"}`}>
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mr-4">
                      {step.icon}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold">{step.title}</h3>
                  </div>
                  <p className="text-gray-300 text-lg mb-6">{step.description}</p>
                  <motion.div
                    className="inline-block"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <span className="text-purple-400 font-medium flex items-center">
                      Learn more <ArrowRight className="ml-2 w-4 h-4" />
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* For Freelancers Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-16 px-4 md:px-8 lg:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              For <span className="text-purple-500">Freelancers</span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Join thousands of skilled professionals already using GoWithFlow to find clients and grow their business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Create Your Profile",
                description: "Showcase your skills, portfolio, and experience to stand out to potential clients.",
                icon: <CheckCircle className="w-6 h-6" />,
                image: "/images/profile.svg",
              },
              {
                title: "Get Matched to Projects",
                description: "Our AI system matches you with projects that fit your skills and experience.",
                icon: <Zap className="w-6 h-6" />,
                image: "/images/matching.svg",
              },
              {
                title: "Get Paid Securely",
                description: "Receive payments safely and on time through our secure payment system.",
                icon: <Shield className="w-6 h-6" />,
                image: "/images/secure-payment.svg",
              },
            ].map((item, index) => (
              <motion.div key={index} variants={fadeIn} whileHover={{ y: -10 }} className="bg-gray-900 p-8 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-300 mb-6">{item.description}</p>
                <div className="h-40 flex items-center justify-center">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                   
                    className="w-[150px] h-auto"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="py-16 px-4 md:px-8 lg:px-16 bg-gray-900"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeIn} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
          </motion.div>

          <div className="grid gap-6">
            {[
              {
                question: "How do I get started on GoWithFlow?",
                answer:
                  "Simply sign up for an account, complete your profile, and you can start posting projects or applying for work immediately.",
              },
              {
                question: "How does payment work?",
                answer:
                  "Our secure escrow system holds payment until you're satisfied with the work. You only release payment when the project meets your requirements.",
              },
              {
                question: "What if I'm not satisfied with the work?",
                answer:
                  "You can request revisions from the freelancer. If issues persist, our support team can help mediate and resolve any disputes.",
              },
              {
                question: "How does GoWithFlow verify freelancers?",
                answer:
                  "All freelancers undergo a verification process that includes skill assessment, portfolio review, and identity verification to ensure quality.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-gray-800 rounded-xl p-6"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-300">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeIn}
        className="py-20 px-4 md:px-8 lg:px-16"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Join thousands of freelancers and businesses already using GoWithFlow to collaborate on amazing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                onClick={() => navigate("/signup")}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-8 rounded-md"
              >
                Sign Up as Freelancer
              </button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
             
                onClick={() => navigate("/signup")}
                className="inline-block bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-md"
              >
                Post a Project
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <footer className="border-t border-[#2d2d3a] bg-[#0a0a0f] py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9333EA]">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-xl font-bold text-[#9333EA]">GoWithFlow</span>
              </div>
              <p className="text-sm text-gray-400">Connecting talent with opportunity worldwide.</p>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">For Freelancers</h3>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Find Work</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Create Profile</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Community</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Success Stories</a>
              </nav>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">For Clients</h3>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Post a Job</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Find Freelancers</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Enterprise Solutions</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Success Stories</a>
              </nav>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Resources</h3>
              <nav className="flex flex-col gap-2">
                <a href="#" className="text-sm text-gray-400 hover:text-white">Help Center</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Blog</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Community</a>
                <a href="#" className="text-sm text-gray-400 hover:text-white">Contact Us</a>
              </nav>
            </div>
          </div>
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-[#2d2d3a] pt-8 md:flex-row">
            <p className="text-sm text-gray-400">© {new Date().getFullYear()} GoWithFlow. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3.01006C23 3.01006 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 23 3.01006 23 3.01006Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" />
                  <path d="M6 9H2V21H6V9Z" />
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
