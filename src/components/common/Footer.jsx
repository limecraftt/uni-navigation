// src/components/common/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex items-center justify-center mb-3">
          <img
            src="/uoem-logo.png"
            alt="University of Embu Logo"
            className="w-7 h-7 object-contain mr-2"
          />
          <div className="text-left">
            <h3 className="text-base font-semibold leading-tight">UoEm Navigator</h3>
            <p className="text-xs text-gray-400">University of Embu</p>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          © 2025 University of Embu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;