import React from "react";

const Footer = () => {
  return (
    <footer className=" border-t-purple-700 border-t-2 mt-[3rem] py-[2rem] text-center">
      <div className="max-w-7xl py-8 mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 text-purple-900">
        {/* Logo and Contact */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-3xl text-center font-bold">Go With Flow</span>
          </div>
          <p className="text-white">Call now: <a href="tel:+919591776078" className="font-medium text-white">+92 313 0471004</a></p>
          <p className="text-white">1.5 KM Defence Rd, off Raiwand Road,<br />Lda Avenue Phase 1, Lda Avenue, Lahore</p>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Quick Link</h3>
          <ul className="space-y-1 text-white">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Admin</a></li>
          </ul>
        </div>

        {/* Candidate Links */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Candidate</h3>
          <ul className="space-y-1 text-white">
            <li><a href="#" className="hover:underline">Browse Jobs</a></li>
            <li><a href="#" className="hover:underline">Browse Employers</a></li>
            <li><a href="#" className="hover:underline">Candidate Dashboard</a></li>
            <li><a href="#" className="hover:underline">Saved Jobs</a></li>
          </ul>
        </div>

        {/* Employer Links */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg ">Employers</h3>
          <ul className="space-y-1 text-white">
            <li><a href="#" className="hover:underline">Post a Job</a></li>
            <li><a href="#" className="hover:underline">Browse Candidates</a></li>
            <li><a href="#" className="hover:underline">Employers Dashboard</a></li>
            <li><a href="#" className="hover:underline">Applications</a></li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-purple-300 pt-4">
        <p className="text-sm text-purple-700">
          © 2022 GoWithFlow - Job Portal. All Rights Reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
