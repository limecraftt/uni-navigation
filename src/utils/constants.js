export const FEATURES = {
  INTERACTIVE_MAPS: {
    title: "Interactive Maps",
    description: "Find any location on campus with our detailed interactive mapping system"
  },
  VIRTUAL_TOURS: {
    title: "Virtual Tours",
    description: "Take immersive 360° tours of campus facilities and student spaces"
  },
  SMART_DIRECTIONS: {
    title: "Smart Directions",
    description: "Get step-by-step directions between any two locations on campus"
  }
};

export const STATS = {
  LOCATIONS: {
    number: "15+",
    label: "Campus Locations"
  },
  STUDENTS: {
    number: "5K+",
    label: "Students"
  },
  PROGRAMS: {
    number: "50+",
    label: "Academic Programs"
  }
};

export const CONTACT_INFO = {
  ADDRESS: {
    line1: "P.O. Box 6 – 60100",
    line2: "Embu, Kenya"
  },
  PHONE: "+254 727 933950",
  EMAIL: "info@embuni.ac.ke",
  HOURS: {
    weekdays: "Mon - Fri: 8:00 AM - 6:00 PM",
    saturday: "Sat: 9:00 AM - 1:00 PM"
  }
};

export const UNIVERSITY_INFO = {
  name: "University of Embu",
  shortName: "UoEm",
  tagline: "Navigator"
};

// Campus Locations Database - ONLY ONE DECLARATION
export const CAMPUS_LOCATIONS = {
  // Academic Buildings
  ACADEMIC: [
    {
      id: "main-library",
      name: "Main Library",
      category: "Academic",
      description: "Central library with study spaces and research materials",
      walkingTime: "2 min",
      popular: true,
      coordinates: { lat: -0.5143, lng: 37.4556 },
      images: [
        {
          id: 1,
          src: "/src/assets/images/locations/library/exterior.jpg",
          alt: "Library exterior view",
          description: "Main entrance of the university library"
        },
        {
          id: 2,
          src: "/src/assets/images/locations/library/reading-hall.jpg",
          alt: "Library reading hall",
          description: "Spacious reading hall with natural lighting"
        },
        {
          id: 3,
          src: "/src/assets/images/locations/library/study-area.jpg",
          alt: "Library study area",
          description: "Quiet study spaces for focused learning"
        }
      ]
    },
    {
      id: "lecture-hall-1",
      name: "Lecture Hall Complex A",
      category: "Academic",
      description: "Main lecture halls for undergraduate courses",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5145, lng: 37.4558 },
      images: [
        {
          id: 1,
          src: "/src/assets/images/locations/lecture-hall-a/exterior.jpg",
          alt: "Lecture Hall A exterior",
          description: "Modern lecture hall complex entrance"
        },
        {
          id: 2,
          src: "/src/assets/images/locations/lecture-hall-a/hall-interior.jpg",
          alt: "Lecture hall interior",
          description: "Large lecture hall with modern A/V equipment"
        }
      ]
    },
    {
      id: "lecture-hall-2",
      name: "Lecture Hall Complex B",
      category: "Academic",
      description: "Modern lecture facilities with A/V equipment",
      walkingTime: "4 min",
      popular: false,
      coordinates: { lat: -0.5147, lng: 37.4560 }
    },
    {
      id: "computer-lab",
      name: "Computer Laboratory",
      category: "Academic",
      description: "State-of-the-art computing facilities",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5144, lng: 37.4559 }
    },
    {
      id: "science-lab",
      name: "Science Laboratories",
      category: "Academic",
      description: "Chemistry, Biology and Physics labs",
      walkingTime: "5 min",
      popular: false,
      coordinates: { lat: -0.5149, lng: 37.4562 }
    },
    {
      id: "engineering-block",
      name: "Engineering Block",
      category: "Academic",
      description: "Engineering departments and workshops",
      walkingTime: "6 min",
      popular: false,
      coordinates: { lat: -0.5151, lng: 37.4564 }
    }
  ],

  // Administrative Buildings
  ADMINISTRATIVE: [
    {
      id: "main-admin",
      name: "Main Administration Block",
      category: "Administrative",
      description: "Vice Chancellor's office and main administration",
      walkingTime: "2 min",
      popular: true,
      coordinates: { lat: -0.5142, lng: 37.4555 }
    },
    {
      id: "registrar",
      name: "Registrar's Office",
      category: "Administrative",
      description: "Student records and academic registration",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5143, lng: 37.4557 }
    },
    {
      id: "admissions",
      name: "Admissions Office",
      category: "Administrative",
      description: "Student admissions and enrollment services",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5144, lng: 37.4556 }
    },
    {
      id: "finance-office",
      name: "Finance Office",
      category: "Administrative",
      description: "Fee payments and financial services",
      walkingTime: "4 min",
      popular: true,
      coordinates: { lat: -0.5146, lng: 37.4558 }
    },
    {
      id: "hr-office",
      name: "Human Resources",
      category: "Administrative",
      description: "Staff services and employment matters",
      walkingTime: "4 min",
      popular: false,
      coordinates: { lat: -0.5145, lng: 37.4557 }
    }
  ],

  // Student Services
  STUDENT_SERVICES: [
    {
      id: "student-center",
      name: "Student Center",
      category: "Student Services",
      description: "Student activities and support services",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5144, lng: 37.4558 }
    },
    {
      id: "health-center",
      name: "Health Center",
      category: "Student Services",
      description: "Medical services and health support",
      walkingTime: "5 min",
      popular: true,
      coordinates: { lat: -0.5148, lng: 37.4561 }
    },
    {
      id: "bookstore",
      name: "University Bookstore",
      category: "Student Services",
      description: "Books, supplies and university merchandise",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5143, lng: 37.4559 }
    },
    {
      id: "counseling",
      name: "Counseling Center",
      category: "Student Services",
      description: "Student counseling and mental health support",
      walkingTime: "4 min",
      popular: false,
      coordinates: { lat: -0.5146, lng: 37.4560 }
    },
    {
      id: "career-center",
      name: "Career Services",
      category: "Student Services",
      description: "Career guidance and job placement services",
      walkingTime: "4 min",
      popular: false,
      coordinates: { lat: -0.5147, lng: 37.4559 }
    }
  ],

  // Recreation & Sports
  RECREATION: [
    {
      id: "sports-complex",
      name: "Sports Complex",
      category: "Recreation",
      description: "Main sports facilities and gymnasium",
      walkingTime: "7 min",
      popular: true,
      coordinates: { lat: -0.5152, lng: 37.4565 },
      images: [
        {
          id: 1,
          src: "/src/assets/images/locations/sports-complex/exterior.jpg",
          alt: "Sports Complex exterior",
          description: "Modern sports and recreation facility"
        },
        {
          id: 2,
          src: "/src/assets/images/locations/sports-complex/gym.jpg",
          alt: "Gymnasium interior",
          description: "Well-equipped gymnasium with modern facilities"
        }
      ]
    },
    {
      id: "football-field",
      name: "Football Field",
      category: "Recreation",
      description: "Main football pitch and athletic track",
      walkingTime: "8 min",
      popular: true,
      coordinates: { lat: -0.5154, lng: 37.4567 }
    },
    {
      id: "basketball-court",
      name: "Basketball Courts",
      category: "Recreation",
      description: "Outdoor and indoor basketball facilities",
      walkingTime: "6 min",
      popular: false,
      coordinates: { lat: -0.5150, lng: 37.4563 }
    },
    {
      id: "swimming-pool",
      name: "Swimming Pool",
      category: "Recreation",
      description: "Olympic-size swimming pool and facilities",
      walkingTime: "9 min",
      popular: false,
      coordinates: { lat: -0.5155, lng: 37.4568 }
    }
  ],

  // Residential
  RESIDENTIAL: [
    {
      id: "hostel-a",
      name: "Hostel Block A",
      category: "Residential",
      description: "Student accommodation - Male hostel",
      walkingTime: "5 min",
      popular: true,
      coordinates: { lat: -0.5148, lng: 37.4562 }
    },
    {
      id: "hostel-b",
      name: "Hostel Block B",
      category: "Residential",
      description: "Student accommodation - Female hostel",
      walkingTime: "6 min",
      popular: true,
      coordinates: { lat: -0.5149, lng: 37.4563 }
    },
    {
      id: "hostel-c",
      name: "Hostel Block C",
      category: "Residential",
      description: "Mixed student accommodation",
      walkingTime: "7 min",
      popular: false,
      coordinates: { lat: -0.5151, lng: 37.4565 }
    }
  ],

  // Dining
  DINING: [
    {
      id: "main-cafeteria",
      name: "Main Cafeteria",
      category: "Dining",
      description: "Primary dining hall with various meal options",
      walkingTime: "3 min",
      popular: true,
      coordinates: { lat: -0.5145, lng: 37.4559 },
      images: [
        {
          id: 1,
          src: "/src/assets/images/locations/main-cafeteria/dining-hall.jpg",
          alt: "Main cafeteria dining hall",
          description: "Spacious dining area with variety of food options"
        },
        {
          id: 2,
          src: "/src/assets/images/locations/main-cafeteria/food-service.jpg",
          alt: "Food service area",
          description: "Modern food service counter with diverse meal choices"
        }
      ]
    },
    {
      id: "coffee-shop",
      name: "Campus Coffee Shop",
      category: "Dining",
      description: "Coffee, snacks and light meals",
      walkingTime: "2 min",
      popular: true,
      coordinates: { lat: -0.5143, lng: 37.4557 }
    },
    {
      id: "food-court",
      name: "Student Food Court",
      category: "Dining",
      description: "Multiple food vendors and dining options",
      walkingTime: "4 min",
      popular: false,
      coordinates: { lat: -0.5146, lng: 37.4560 }
    }
  ],

  // Other Facilities
  OTHER: [
    {
      id: "main-gate",
      name: "Main Gate",
      category: "Entrance",
      description: "Primary campus entrance and security",
      walkingTime: "1 min",
      popular: true,
      coordinates: { lat: -0.5141, lng: 37.4554 }
    },
    {
      id: "auditorium",
      name: "Main Auditorium",
      category: "Events",
      description: "Large auditorium for ceremonies and events",
      walkingTime: "5 min",
      popular: false,
      coordinates: { lat: -0.5147, lng: 37.4561 }
    },
    {
      id: "chapel",
      name: "University Chapel",
      category: "Religious",
      description: "Inter-denominational worship center",
      walkingTime: "6 min",
      popular: false,
      coordinates: { lat: -0.5150, lng: 37.4564 }
    },
    {
      id: "parking-main",
      name: "Main Parking Lot",
      category: "Parking",
      description: "Primary vehicle parking area",
      walkingTime: "2 min",
      popular: true,
      coordinates: { lat: -0.5142, lng: 37.4556 }
    },
    {
      id: "botanical-garden",
      name: "Botanical Gardens",
      category: "Nature",
      description: "Campus gardens and outdoor study spaces",
      walkingTime: "8 min",
      popular: false,
      coordinates: { lat: -0.5153, lng: 37.4566 }
    }
  ]
};

// Flatten all locations into a single searchable array
export const ALL_LOCATIONS = [
  ...CAMPUS_LOCATIONS.ACADEMIC,
  ...CAMPUS_LOCATIONS.ADMINISTRATIVE,
  ...CAMPUS_LOCATIONS.STUDENT_SERVICES,
  ...CAMPUS_LOCATIONS.RECREATION,
  ...CAMPUS_LOCATIONS.RESIDENTIAL,
  ...CAMPUS_LOCATIONS.DINING,
  ...CAMPUS_LOCATIONS.OTHER
];

// Popular destinations for quick access
export const POPULAR_LOCATIONS = ALL_LOCATIONS.filter(location => location.popular);

// Categories for dropdown organization
export const LOCATION_CATEGORIES = [
  { key: 'ACADEMIC', label: 'Academic Buildings', icon: '🎓' },
  { key: 'ADMINISTRATIVE', label: 'Administrative', icon: '🏢' },
  { key: 'STUDENT_SERVICES', label: 'Student Services', icon: '👥' },
  { key: 'RECREATION', label: 'Recreation & Sports', icon: '⚽' },
  { key: 'RESIDENTIAL', label: 'Residential', icon: '🏠' },
  { key: 'DINING', label: 'Dining', icon: '🍽️' },
  { key: 'OTHER', label: 'Other Facilities', icon: '📍' }
];

// Campus center coordinates (fallback location)
export const CAMPUS_CENTER = {
  lat: -0.5144,
  lng: 37.4558,
  name: "University of Embu Campus Center"
};

// Navigation utilities
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 1000); // Convert to meters
};

export const generateNavigationLinks = (startLat, startLng, endLat, endLng, destinationName) => {
  const encodedDestination = encodeURIComponent(destinationName);
  
  return {
    googleMaps: `https://www.google.com/maps/dir/${startLat},${startLng}/${endLat},${endLng}/@${endLat},${endLng},17z/data=!3m1!4b1!4m2!4m1!3e2`,
    appleMaps: `http://maps.apple.com/?daddr=${endLat},${endLng}&dirflg=w&t=m`,
    waze: `https://www.waze.com/ul?ll=${endLat}%2C${endLng}&navigate=yes&zoom=17`,
    universalLink: `https://www.google.com/maps/search/?api=1&query=${endLat},${endLng}&query_place_id=${encodedDestination}`
  };
};