import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapIcon, HomeIcon, CameraIcon, NavigationIcon } from '../../assets/icons/svgIcons';
import uoemLogo from '../../assets/images/uoem-logo.png';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path) => {
    const baseClasses = "px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors";
    if (isActive(path)) {
      return `${baseClasses} bg-blue-600 text-white`;
    }
    return `${baseClasses} text-gray-700 hover:bg-gray-100`;
  };

  return (
    <header className="bg-white shadow-sm border-b relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover:opacity-90 transition-opacity">
            {/* University Logo */}
            <div className="flex-shrink-0 mr-4">
              <img 
                src={uoemLogo} 
                alt="University of Embu Logo" 
                className="h-12 w-12 object-contain"
              />
            </div>
            
            {/* Text */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">UoEm Navigator</h1>
              <p className="text-sm text-gray-500">University of Embu</p>
            </div>
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-1">
            <Link to="/" className={getLinkClasses('/')}>
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link to="/campus-map" className={getLinkClasses('/campus-map')}>
              <MapIcon className="w-4 h-4" />
              <span>Campus Map</span>
            </Link>
            
            <Link to="/virtual-tour" className={getLinkClasses('/virtual-tour')}>
              <CameraIcon className="w-4 h-4" />
              <span>Virtual Tour</span>
            </Link>
            
            <Link to="/directions" className={getLinkClasses('/directions')}>
              <NavigationIcon className="w-4 h-4" />
              <span>Offices and Departments</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;