// src/components/common/Header.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapIcon, HomeIcon, CameraIcon, NavigationIcon } from '../../assets/icons/svgIcons';
import uoemLogo from '../../assets/images/uoem-logo.png';

const Header = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => {
    const base = "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors";
    return isActive(path)
      ? `${base} bg-blue-600 text-white`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  const getMobileLinkClasses = (path) => {
    const base = "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-base font-medium";
    return isActive(path)
      ? `${base} bg-blue-600 text-white`
      : `${base} text-gray-700 hover:bg-gray-100`;
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: <HomeIcon className="w-4 h-4" /> },
    { to: '/campus-map', label: 'Campus Map', icon: <MapIcon className="w-4 h-4" /> },
    { to: '/virtual-tour', label: 'Virtual Tour', icon: <CameraIcon className="w-4 h-4" /> },
    { to: '/directions', label: 'Offices and Departments', icon: <NavigationIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white shadow-sm border-b relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            <div className="flex-shrink-0 mr-3">
              <img src={uoemLogo} alt="University of Embu Logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">UoEm Navigator</h1>
              <p className="text-xs text-gray-500">University of Embu</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={getLinkClasses(link.to)}>
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Hamburger Button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              // X icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={getMobileLinkClasses(link.to)}
              onClick={() => setMenuOpen(false)}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;