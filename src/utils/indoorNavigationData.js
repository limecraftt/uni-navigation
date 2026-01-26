// src/utils/indoorNavigationData.js - WITH VIDEO SUPPORT

export const OFFICE_INDOOR_ROUTES = {
  "registrar": {
    officeId: "registrar",
    buildingId: "main-admin",
    floor: 1,
    indoorRoute: [
      {
        step: 1,
        instruction: "Enter the main door of the Administration Block",
        landmark: "Security desk on your left",
        duration: 10,
        direction: 'forward',
        distance: '5m',
        // ADD VIDEO URL HERE
        videoUrl: '/videos/indoor-navigation/registrar/step-1.mp4',
        // OR use external URL:
        // videoUrl: 'https://youtu.be/YOUR_VIDEO_ID',
        // OR placeholder if video not ready yet:
        // videoUrl: null,
      },
      {
        step: 2,
        instruction: "Walk straight through the lobby",
        landmark: "Notice boards on both sides",
        duration: 15,
        direction: 'forward',
        distance: '10m',
        videoUrl: '/videos/indoor-navigation/registrar/step-2.mp4',
      },
      {
        step: 3,
        instruction: "Take the staircase on your right to the First Floor",
        landmark: "Blue signage pointing to stairs",
        duration: 30,
        direction: 'stairs-up',
        distance: '15m',
        videoUrl: '/videos/indoor-navigation/registrar/step-3.mp4',
      },
      {
        step: 4,
        instruction: "Turn left immediately after reaching the First Floor",
        landmark: "Water fountain at the corner",
        duration: 10,
        direction: 'left',
        distance: '3m',
        videoUrl: '/videos/indoor-navigation/registrar/step-4.mp4',
      },
      {
        step: 5,
        instruction: "Walk down the corridor",
        landmark: "Registrar's office is the third door on your right",
        duration: 20,
        direction: 'forward',
        distance: '12m',
        videoUrl: '/videos/indoor-navigation/registrar/step-5.mp4',
      },
      {
        step: 6,
        instruction: "You've arrived at the Registrar's Office",
        landmark: "Reception desk visible through glass door",
        duration: 0,
        direction: 'arrived',
        distance: '0m',
        videoUrl: '/videos/indoor-navigation/registrar/step-6.mp4',
      }
    ]
  },

  "finance-office": {
    officeId: "finance-office",
    buildingId: "main-admin",
    floor: 0,
    indoorRoute: [
      {
        step: 1,
        instruction: "Enter the main door of the Administration Block",
        landmark: "Security desk on your left",
        duration: 10,
        direction: 'forward',
        distance: '5m',
        videoUrl: '/videos/indoor-navigation/finance-office/step-1.mp4',
      },
      {
        step: 2,
        instruction: "Turn right immediately after entering",
        landmark: "Waiting benches along the wall",
        duration: 8,
        direction: 'right',
        distance: '2m',
        videoUrl: '/videos/indoor-navigation/finance-office/step-2.mp4',
      },
      {
        step: 3,
        instruction: "Walk down the corridor",
        landmark: "Student services posters on the walls",
        duration: 15,
        direction: 'forward',
        distance: '10m',
        videoUrl: '/videos/indoor-navigation/finance-office/step-3.mp4',
      },
      {
        step: 4,
        instruction: "Finance Office is the second door on your left",
        landmark: "Blue door with 'Finance Office AB-120' sign",
        duration: 10,
        direction: 'left',
        distance: '5m',
        videoUrl: '/videos/indoor-navigation/finance-office/step-4.mp4',
      },
      {
        step: 5,
        instruction: "You've arrived at the Finance Office",
        landmark: "Payment counter visible inside",
        duration: 0,
        direction: 'arrived',
        distance: '0m',
        videoUrl: '/videos/indoor-navigation/finance-office/step-5.mp4',
      }
    ]
  },

  // Add video URLs to all other offices...
  "library": {
    officeId: "library",
    buildingId: "main-library",
    floor: 0,
    indoorRoute: [
      {
        step: 1,
        instruction: "Enter through the main library entrance",
        landmark: "Security check and bag check desk",
        duration: 15,
        direction: 'forward',
        distance: '5m',
        videoUrl: '/videos/indoor-navigation/library/step-1.mp4',
      },
      {
        step: 2,
        instruction: "Walk past the circulation desk on your right",
        landmark: "Book return drop box",
        duration: 10,
        direction: 'forward',
        distance: '8m',
        videoUrl: '/videos/indoor-navigation/library/step-2.mp4',
      },
      {
        step: 3,
        instruction: "Library Services office is behind the circulation desk",
        landmark: "Door marked 'Library Administration ML-001'",
        duration: 8,
        direction: 'right',
        distance: '3m',
        videoUrl: '/videos/indoor-navigation/library/step-3.mp4',
      },
      {
        step: 4,
        instruction: "You've arrived at Library Services",
        landmark: "Librarian's office",
        duration: 0,
        direction: 'arrived',
        distance: '0m',
        videoUrl: '/videos/indoor-navigation/library/step-4.mp4',
      }
    ]
  }
};

export const getIndoorRoute = (officeId) => {
  return OFFICE_INDOOR_ROUTES[officeId] || null;
};

export const hasIndoorNavigation = (officeId) => {
  return officeId in OFFICE_INDOOR_ROUTES;
};