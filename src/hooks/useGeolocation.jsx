// src/hooks/useGeolocation.jsx
import { useState, useEffect } from 'react';
import { CAMPUS_CENTER } from '../utils/constants';

export const useGeolocation = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState('prompt');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.log('Location access denied:', error);
          setLocationPermission('denied');
          // Use campus center as fallback
          setCurrentLocation(CAMPUS_CENTER);
        }
      );
    } else {
      setLocationPermission('unavailable');
      setCurrentLocation(CAMPUS_CENTER);
    }
  }, []);

  return { currentLocation, locationPermission };
};