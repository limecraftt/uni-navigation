// src/hooks/useQRGeneration.jsx
import { useState } from 'react';
import { generateNavigationLinks } from '../utils/constants';

export const useQRGeneration = () => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  const [navigationLinks, setNavigationLinks] = useState(null);

  // Simple QR Code generation using API service
  const generateQRCode = (data) => {
    const qrAPIUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(data)}`;
    setQrCodeDataURL(qrAPIUrl);
  };

  const generateDirections = (currentLocation, selectedLocation) => {
    if (!selectedLocation || !currentLocation) return;

    const links = generateNavigationLinks(
      currentLocation.lat,
      currentLocation.lng,
      selectedLocation.coordinates.lat,
      selectedLocation.coordinates.lng,
      selectedLocation.name
    );

    setNavigationLinks(links);
    generateQRCode(links.universalLink);
    return links;
  };

  const downloadQRCode = (selectedLocationName) => {
    const link = document.createElement('a');
    link.href = qrCodeDataURL;
    link.download = `directions-to-${selectedLocationName || 'location'}.png`;
    link.click();
  };

  const shareDirections = async (selectedLocationName) => {
    if (navigator.share && navigationLinks) {
      try {
        await navigator.share({
          title: `Directions to ${selectedLocationName}`,
          text: `Get directions to ${selectedLocationName} at University of Embu`,
          url: navigationLinks.universalLink
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(navigationLinks.universalLink);
        alert('Link copied to clipboard!');
      }
    }
  };

  return {
    qrCodeDataURL,
    navigationLinks,
    generateDirections,
    downloadQRCode,
    shareDirections
  };
};