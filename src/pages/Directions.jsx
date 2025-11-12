import React, { useState } from 'react';
import { 
  Navigation, 
  Map, 
  Search,
  Phone,
  Mail,
  Clock,
  Building,
  GraduationCap,
  Users,
  FileText
} from 'lucide-react';

const Directions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample data - replace with your actual data
  const officesAndDepartments = [
    // Academic Departments
    {
      id: 1,
      name: "School of Education & Social Sciences",
      category: "academic",
      building: "Education Block",
      floor: "Ground Floor",
      room: "ED-101",
      phone: "+254-068-30301",
      email: "education@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Education, social sciences, and humanities programs"
    },
    {
      id: 2,
      name: "School of Pure & Applied Sciences",
      category: "academic",
      building: "Science Block",
      floor: "1st Floor",
      room: "SC-201",
      phone: "+254-068-30302",
      email: "sciences@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Mathematics, physics, chemistry, computer science, and applied sciences"
    },
    {
      id: 3,
      name: "School of Business & Economics",
      category: "academic",
      building: "Business Block",
      floor: "1st Floor",
      room: "BB-201",
      phone: "+254-068-30303",
      email: "business@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Business studies, economics, commerce, and management programs"
    },
    {
      id: 4,
      name: "School of Law",
      category: "academic",
      building: "Law Faculty Block",
      floor: "Ground Floor",
      room: "LF-105",
      phone: "+254-068-30304",
      email: "law@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Legal studies and jurisprudence programs"
    },
    {
      id: 5,
      name: "School of Nursing",
      category: "academic",
      building: "Medical Sciences Block",
      floor: "2nd Floor",
      room: "MS-205",
      phone: "+254-068-30305",
      email: "nursing@embuni.ac.ke",
      hours: "Mon-Fri: 7:30 AM - 5:30 PM",
      description: "Nursing, healthcare, and medical sciences programs"
    },
    {
      id: 6,
      name: "School of Agriculture",
      category: "academic",
      building: "Agriculture Complex",
      floor: "Ground Floor",
      room: "AC-110",
      phone: "+254-068-30306",
      email: "agriculture@embuni.ac.ke",
      hours: "Mon-Fri: 7:30 AM - 5:30 PM",
      description: "Agricultural sciences, agribusiness, and research programs"
    },
    // Administrative Offices
    {
      id: 7,
      name: "Registrar's Office",
      category: "administrative",
      building: "Administration Block",
      floor: "1st Floor",
      room: "AB-150",
      phone: "+254-068-30310",
      email: "registrar@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 4:30 PM",
      description: "Student records, transcripts, and academic registration"
    },
    {
      id: 8,
      name: "Finance Office",
      category: "administrative",
      building: "Administration Block",
      floor: "Ground Floor",
      room: "AB-120",
      phone: "+254-068-30315",
      email: "finance@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 4:30 PM",
      description: "Fee payments, financial aid, and accounting services"
    },
    {
      id: 9,
      name: "Dean of Students Office",
      category: "administrative",
      building: "Student Affairs Block",
      floor: "1st Floor",
      room: "SA-201",
      phone: "+254-068-30320",
      email: "deanofstudents@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Student welfare, discipline, and campus life coordination"
    },
    // Student Services
    {
      id: 10,
      name: "Library Services",
      category: "services",
      building: "Main Library",
      floor: "Ground Floor",
      room: "ML-001",
      phone: "+254-068-30330",
      email: "library@embuni.ac.ke",
      hours: "Mon-Fri: 7:00 AM - 10:00 PM, Sat-Sun: 9:00 AM - 6:00 PM",
      description: "Books, research materials, and study spaces"
    },
    {
      id: 11,
      name: "ICT Services",
      category: "services",
      building: "ICT Block",
      floor: "Ground Floor",
      room: "ICT-110",
      phone: "+254-068-30340",
      email: "ict@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM",
      description: "Computer labs, network support, and technical assistance"
    },
    {
      id: 12,
      name: "Health Services",
      category: "services",
      building: "Medical Center",
      floor: "Ground Floor",
      room: "MC-001",
      phone: "+254-068-30350",
      email: "health@embuni.ac.ke",
      hours: "Mon-Fri: 8:00 AM - 5:00 PM, Emergency: 24/7",
      description: "Medical care, counseling, and health programs"
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Building, color: 'bg-gray-100 text-gray-700' },
    { id: 'academic', name: 'Academic', icon: GraduationCap, color: 'bg-blue-100 text-blue-700' },
    { id: 'administrative', name: 'Administrative', icon: FileText, color: 'bg-green-100 text-green-700' },
    { id: 'services', name: 'Student Services', icon: Users, color: 'bg-purple-100 text-purple-700' }
  ];

  const filteredOffices = officesAndDepartments.filter(office => {
    const matchesSearch = office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         office.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         office.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || office.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'academic': return GraduationCap;
      case 'administrative': return FileText;
      case 'services': return Users;
      default: return Building;
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'academic': return 'bg-blue-50 border-blue-200';
      case 'administrative': return 'bg-green-50 border-green-200';
      case 'services': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Offices and Departments</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find contact information and locations for all university offices and academic departments
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search offices, departments, or buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : category.color
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredOffices.map((office) => {
            const IconComponent = getCategoryIcon(office.category);
            return (
              <div
                key={office.id}
                className={`bg-white rounded-lg shadow-md border-2 p-6 hover:shadow-lg transition-shadow ${getCategoryColor(office.category)}`}
              >
                {/* Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="flex-shrink-0">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {office.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {office.description}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span>{office.building}, {office.floor}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Map className="w-4 h-4 text-gray-500" />
                    <span>Room {office.room}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <a href={`tel:${office.phone}`} className="hover:text-blue-600">
                      {office.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <a href={`mailto:${office.email}`} className="hover:text-blue-600">
                      {office.email}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{office.hours}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Navigation className="w-4 h-4 inline mr-1" />
                    Get Directions
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {filteredOffices.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <SearchIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or selecting a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directions;