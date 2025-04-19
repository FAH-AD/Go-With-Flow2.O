import React from 'react';
import '../styles/home.css';
import heroImg from '../assets/hero.png'
import Navbar from '../components/Navbar';
function Home() {
  return (
    <div className="app">
      {/* Header */}
      <Navbar/>

      <main>
        {/* Hero Section */}
        <section className="hero">
          <div className="container hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Find the right freelancer for your{' '}
                <span className="text-accent">project needs</span> and{' '}
                <span className="text-accent">requirements</span>
              </h1>
              <p className="hero-description">
                Discover talented freelancers to bring your ideas to life.
              </p>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Freelancer skills, Keyword..."
                  className="search-input"
                />
                <button className="btn btn-primary search-btn">Find Freelancer</button>
              </div>
              <div className="suggestions">
                <span className="suggestion-label">Suggestion:</span>
                <a href="#" className="suggestion-link">UI/UX Designer</a>,
                <a href="#" className="suggestion-link">Programming</a>,
                <a href="#" className="suggestion-link accent">Digital Marketing</a>,
                <a href="#" className="suggestion-link">Video</a>,
                <a href="#" className="suggestion-link">Animation</a>.
              </div>
            </div>
            <div className="hero-image">
              <img src={heroImg} alt="Freelancer platform illustration" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Features</span>
              <h2 className="section-title">Why Choose GoWithFlow</h2>
              <p className="section-description">
                Our platform provides everything you need to succeed in the freelance marketplace.
              </p>
            </div>
            <div className="features-grid">
              <div className="freelancer-card shadow-sm">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#9333EA" strokeWidth="2" />
                    <path d="M15 9L9 15" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 9L15 15" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="feature-title">Secure Payments</h3>
                <p className="feature-description">
                  Our escrow system ensures you only pay for work you're satisfied with.
                </p>
              </div>
              <div className="freelancer-card shadow-sm">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="#9333EA" strokeWidth="2" />
                    <path d="M12 15V23" stroke="#9333EA" strokeWidth="2" />
                    <path d="M7 20H17" stroke="#9333EA" strokeWidth="2" />
                  </svg>
                </div>
                <h3 className="feature-title">Verified Talent</h3>
                <p className="feature-description">
                  All freelancers are vetted and reviewed to ensure quality work.
                </p>
              </div>
              <div className="freelancer-card shadow-sm">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="#9333EA" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="feature-title">Time-Saving Tools</h3>
                <p className="feature-description">
                  Project management tools to keep your projects on track and on time.
                </p>
              </div>
              <div className="freelancer-card shadow-sm">
                <div className="feature-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="feature-title">Fast Matching</h3>
                <p className="feature-description">
                  Our AI-powered matching system connects you with the perfect talent quickly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Freelancers Section */}
        <section className="freelancers">
          <div className="container">
            <div className="section-header">
              <span className="section-badge">Top Talent</span>
              <h2 className="section-title">Meet Our Top Freelancers</h2>
              <p className="section-description">
                Discover skilled professionals ready to bring your projects to life.
              </p>
            </div>
            <div className="freelancers-grid">
              <div className="freelancer-card">
                <div className="freelancer-header">
                  <img src="/avatar1.jpg" alt="Freelancer" className="freelancer-avatar" />
                  <div className="freelancer-info">
                    <h3 className="freelancer-name">Alex Morgan</h3>
                    <p className="freelancer-title">Web Developer</p>
                    <div className="freelancer-rating">
                      <div className="stars">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                      </div>
                      <span className="rating-count">5.0 (124 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="freelancer-description">
                  Full-stack developer with 8+ years of experience specializing in React, Node.js, and AWS.
                </p>
                <div className="freelancer-skills">
                  <span className="skill-tag">React</span>
                  <span className="skill-tag">Node.js</span>
                  <span className="skill-tag">AWS</span>
                </div>
                <button className="btn btn-outline full-width">View Profile</button>
              </div>
              <div className="freelancer-card">
                <div className="freelancer-header">
                  <img src="/avatar2.jpg" alt="Freelancer" className="freelancer-avatar" />
                  <div className="freelancer-info">
                    <h3 className="freelancer-name">Sophia Chen</h3>
                    <p className="freelancer-title">UI/UX Designer</p>
                    <div className="freelancer-rating">
                      <div className="stars">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                      </div>
                      <span className="rating-count">4.9 (87 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="freelancer-description">
                  Award-winning designer creating beautiful, functional interfaces for web and mobile applications.
                </p>
                <div className="freelancer-skills">
                  <span className="skill-tag">Figma</span>
                  <span className="skill-tag">UI Design</span>
                  <span className="skill-tag">Prototyping</span>
                </div>
                <button className="btn btn-outline full-width">View Profile</button>
              </div>
              <div className="freelancer-card">
                <div className="freelancer-header">
                  <img src="/avatar3.jpg" alt="Freelancer" className="freelancer-avatar" />
                  <div className="freelancer-info">
                    <h3 className="freelancer-name">Marcus Johnson</h3>
                    <p className="freelancer-title">Content Strategist</p>
                    <div className="freelancer-rating">
                      <div className="stars">
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star half">★</span>
                      </div>
                      <span className="rating-count">4.8 (56 reviews)</span>
                    </div>
                  </div>
                </div>
                <p className="freelancer-description">
                  SEO-focused content writer with experience in SaaS, tech, and finance industries.
                </p>
                <div className="freelancer-skills">
                  <span className="skill-tag">SEO</span>
                  <span className="skill-tag">Copywriting</span>
                  <span className="skill-tag">Content Strategy</span>
                </div>
                <button className="btn btn-outline full-width">View Profile</button>
              </div>
            </div>
            <div className="section-footer">
              <button className="btn btn-primary">
                Browse All Freelancers
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="btn-icon">
                  <path d="M3.33337 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 3.33337L12.6667 8.00004L8 12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Ready to Get Started?</h2>
              <p className="cta-description">
                Join thousands of freelancers and businesses already using GoWithFlow.
              </p>
              <div className="cta-buttons">
                <button className="btn btn-primary">Sign Up as Freelancer</button>
                <button className="btn btn-outline">Post a Project</button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="logo">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-icon">
                  <circle cx="12" cy="12" r="10" stroke="#9333EA" strokeWidth="2" />
                  <path d="M8 12L11 15L16 9" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="logo-text">GoWithFlow</span>
              </div>
              <p className="footer-tagline">Connecting talent with opportunity worldwide.</p>
            </div>
            <div className="footer-links">
              <h3 className="footer-heading">For Freelancers</h3>
              <ul className="footer-menu">
                <li><a href="#" className="footer-link">Find Work</a></li>
                <li><a href="#" className="footer-link">Create Profile</a></li>
                <li><a href="#" className="footer-link">Community</a></li>
                <li><a href="#" className="footer-link">Success Stories</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h3 className="footer-heading">For Clients</h3>
              <ul className="footer-menu">
                <li><a href="#" className="footer-link">Post a Job</a></li>
                <li><a href="#" className="footer-link">Find Freelancers</a></li>
                <li><a href="#" className="footer-link">Enterprise Solutions</a></li>
                <li><a href="#" className="footer-link">Success Stories</a></li>
              </ul>
            </div>
            <div className="footer-links">
              <h3 className="footer-heading">Resources</h3>
              <ul className="footer-menu">
                <li><a href="#" className="footer-link">Help Center</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
                <li><a href="#" className="footer-link">Community</a></li>
                <li><a href="#" className="footer-link">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© {new Date().getFullYear()} GoWithFlow. All rights reserved.</p>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23 3.01006C23 3.01006 20.9821 4.20217 19.86 4.54006C19.2577 3.84757 18.4573 3.35675 17.567 3.13398C16.6767 2.91122 15.7395 2.96725 14.8821 3.29451C14.0247 3.62177 13.2884 4.20446 12.773 4.96377C12.2575 5.72309 11.9877 6.62239 12 7.54006V8.54006C10.2426 8.58562 8.50127 8.19587 6.93101 7.4055C5.36074 6.61513 4.01032 5.44869 3 4.01006C3 4.01006 -1 13.0101 8 17.0101C5.94053 18.408 3.48716 19.109 1 19.0101C10 24.0101 21 19.0101 21 7.51006C20.9991 7.23151 20.9723 6.95365 20.92 6.68006C21.9406 5.67355 23 3.01006 23 3.01006Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 2H15C13.6739 2 12.4021 2.52678 11.4645 3.46447C10.5268 4.40215 10 5.67392 10 7V10H7V14H10V22H14V14H17L18 10H14V7C14 6.73478 14.1054 6.48043 14.2929 6.29289C14.4804 6.10536 14.7348 6 15 6H18V2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 2H7C4.23858 2 2 4.23858 2 7V17C2 19.7614 4.23858 22 7 22H17C19.7614 22 22 19.7614 22 17V7C22 4.23858 19.7614 2 17 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 11.3701C16.1234 12.2023 15.9812 13.0523 15.5937 13.7991C15.2062 14.5459 14.5931 15.1515 13.8416 15.5297C13.0901 15.908 12.2384 16.0397 11.4077 15.906C10.5771 15.7723 9.80971 15.3801 9.21479 14.7852C8.61987 14.1903 8.22768 13.4229 8.09402 12.5923C7.96035 11.7616 8.09202 10.91 8.47028 10.1584C8.84854 9.40691 9.45414 8.7938 10.2009 8.4063C10.9477 8.0188 11.7977 7.87665 12.63 8.00006C13.4789 8.12594 14.2648 8.52152 14.8717 9.12836C15.4785 9.73521 15.8741 10.5211 16 11.3701Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17.5 6.5H17.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C17.5913 8 19.1174 8.63214 20.2426 9.75736C21.3679 10.8826 22 12.4087 22 14V21H18V14C18 13.4696 17.7893 12.9609 17.4142 12.5858C17.0391 12.2107 16.5304 12 16 12C15.4696 12 14.9609 12.2107 14.5858 12.5858C14.2107 12.9609 14 13.4696 14 14V21H10V14C10 12.4087 10.6321 10.8826 11.7574 9.75736C12.8826 8.63214 14.4087 8 16 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M6 9H2V21H6V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 6C5.10457 6 6 5.10457 6 4C6 2.89543 5.10457 2 4 2C2.89543 2 2 2.89543 2 4C2 5.10457 2.89543 6 4 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;