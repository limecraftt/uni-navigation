import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="mr-3">
            <img 
              src="/uoem-logo.png" 
              alt="University of Embu Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold">UoEm Navigator</h3>
            <p className="text-sm text-gray-400">University of Embu</p>
          </div>
        </div>
        <p className="text-gray-400">
          © 2025 University of Embu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;