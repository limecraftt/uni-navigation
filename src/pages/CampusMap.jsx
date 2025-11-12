import React, { useState } from 'react';
import { MapIcon, SearchIcon, LocationIcon, BuildingIcon } from '../assets/icons/svgIcons';

const CampusMap = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample campus locations
  const campusLocations = [
    { id: 1, name: 'Main Administration Block', category: 'Administrative', x: 30, y: 25 },
    { id: 2, name: 'Library', category: 'Academic', x: 50, y: 35 },
    { id: 3, name: 'Student Center', category: 'Student Services', x: 70, y: 45 },
    { id: 4, name: 'Science Laboratory Block', category: 'Academic', x: 25, y: 55 },
    { id: 5, name: 'Engineering Workshop', category: 'Academic', x: 75, y: 30 },
    { id: 6, name: 'Cafeteria', category: 'Dining', x: 60, y: 60 },
    { id: 7, name: 'Sports Complex', category: 'Recreation', x: 80, y: 70 },
    { id: 8, name: 'Hostel Block A', category: 'Accommodation', x: 15, y: 75 },
    { id: 9, name: 'Lecture Hall Complex', category: 'Academic', x: 45, y: 20 },
    { id: 10, name: 'Medical Center', category: 'Health', x: 85, y: 50 }
  ];

  const categories = [
    { name: 'All', color: 'bg-gray-500' },
    { name: 'Academic', color: 'bg-blue-500' },
    { name: 'Administrative', color: 'bg-green-500' },
    { name: 'Student Services', color: 'bg-purple-500' },
    { name: 'Dining', color: 'bg-orange-500' },
    { name: 'Recreation', color: 'bg-red-500' },
    { name: 'Accommodation', color: 'bg-indigo-500' },
    { name: 'Health', color: 'bg-pink-500' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredLocations = campusLocations.filter(location => {
    const matchesCategory = selectedCategory === 'All' || location.category === selectedCategory;
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category) => {
    const categoryObj = categories.find(cat => cat.name === category);
    return categoryObj ? categoryObj.color : 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Campus Map</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the University of Embu campus with our interactive map
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search campus locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? `${category.color} text-white`
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Interactive Map */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Interactive Campus Map</h3>
              
              {/* Map Container */}
              <div className="relative bg-green-50 rounded-xl overflow-hidden" style={{ height: '500px' }}>
                {/* Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-200">
                  {/* Campus paths */}
                  <svg className="absolute inset-0 w-full h-full">
                    <path
                      d="M 50 50 Q 200 100 400 150 T 600 200"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                    <path
                      d="M 100 300 L 500 300 L 500 400"
                      stroke="#94a3b8"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5,5"
                    />
                  </svg>
                </div>

                {/* Location Markers */}
                {filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
                    style={{ left: `${location.x}%`, top: `${location.y}%` }}
                    onClick={() => setSelectedLocation(location)}
                  >
                    <div className={`w-6 h-6 rounded-full ${getCategoryColor(location.category)} border-2 border-white shadow-lg flex items-center justify-center`}>
                      <LocationIcon className="w-3 h-3 text-white" />
                    </div>
                    {selectedLocation?.id === location.id && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap z-10">
                        {location.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3">
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">Legend</h4>
                  <div className="space-y-1">
                    {categories.slice(1).map((category) => (
                      <div key={category.name} className="flex items-center text-xs">
                        <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                        <span className="text-gray-700">{category.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Locations</h3>
              
              {selectedLocation ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg text-gray-900">{selectedLocation.name}</h4>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getCategoryColor(selectedLocation.category)}`}>
                      {selectedLocation.category}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <LocationIcon className="w-4 h-4" />
                      <span>Get Directions</span>
                    </button>
                    <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <BuildingIcon className="w-4 h-4" />
                      <span>More Info</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <MapIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm">Click on a location marker to see details</p>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Locations:</span>
                    <span className="font-medium">{campusLocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Showing:</span>
                    <span className="font-medium">{filteredLocations.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campus Area:</span>
                    <span className="font-medium">50 Acres</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusMap;