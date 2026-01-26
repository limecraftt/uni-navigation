// src/hooks/useQRGeneration.jsx
import { useState, useEffect } from 'react';
import { saveQRCode, uploadQRCode, getQRCode } from '../api/officesApi';

/**
 * Custom hook for QR code generation and management
 * Generates QR codes and stores them in Supabase
 */
const useQRGeneration = (office) => {
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (office?.id) {
      generateOrFetchQRCode();
    }
  }, [office?.id]);

  /**
   * Generate QR data object
   */
  const generateQRData = () => {
    const data = {
      type: 'UOEM_NAVIGATION',
      officeId: office.officeId || office.office_id,
      officeName: office.name,
      building: office.building,
      room: office.room,
      floor: office.floor,
      url: `${window.location.origin}/navigate/${office.officeId || office.office_id}`,
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(data);
  };

  /**
   * Generate QR code from canvas and upload to Supabase
   */
  const generateAndUploadQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // Wait a bit for QRCode component to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get the canvas element
      const canvas = document.querySelector('#qr-code-canvas canvas');
      
      if (!canvas) {
        throw new Error('QR code canvas not found');
      }

      // Convert canvas to data URL
      const qrDataUrl = canvas.toDataURL('image/png');

      // Upload QR code image to Supabase Storage
      const { data: uploadData, error: uploadError } = await uploadQRCode(
        qrDataUrl,
        office.officeId || office.office_id
      );

      if (uploadError) {
        throw new Error(uploadError);
      }

      // Generate QR data
      const qrDataString = generateQRData();

      // Save QR code record to database
      const { data: savedQR, error: saveError } = await saveQRCode({
        office_id: office.id,
        qr_code_url: uploadData.publicUrl,
        qr_data: qrDataString
      });

      if (saveError) {
        throw new Error(saveError);
      }

      setQrCodeUrl(uploadData.publicUrl);
      setQrData(qrDataString);
      setLoading(false);

      return { qrCodeUrl: uploadData.publicUrl, qrData: qrDataString };
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError(err.message);
      setLoading(false);
      return null;
    }
  };

  /**
   * Fetch existing QR code or generate new one
   */
  const generateOrFetchQRCode = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, try to fetch existing QR code from database
      const { data: existingQR, error: fetchError } = await getQRCode(office.id);

      if (!fetchError && existingQR) {
        // QR code already exists
        setQrCodeUrl(existingQR.qr_code_url);
        setQrData(existingQR.qr_data);
        setLoading(false);
        return;
      }

      // No existing QR code, generate new one
      const qrDataString = generateQRData();
      setQrData(qrDataString);
      setLoading(false);

      // Note: Actual upload happens when user views/downloads the QR code
    } catch (err) {
      console.error('Error fetching QR code:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  /**
   * Download QR code as PNG
   */
  const downloadQRCode = () => {
    const canvas = document.querySelector('#qr-code-canvas canvas');
    if (!canvas) return;
    
    const pngUrl = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `${office.name.replace(/\s+/g, '-')}-directions.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  /**
   * Share QR code using Web Share API
   */
  const shareQRCode = async () => {
    const shareData = {
      title: `Directions to ${office.name}`,
      text: `Get directions to ${office.name} at ${office.building}`,
      url: `${window.location.origin}/navigate/${office.officeId || office.office_id}`
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
        return true;
      }
    } catch (err) {
      console.error('Error sharing:', err);
      return false;
    }
  };

  return {
    qrCodeUrl,
    qrData,
    loading,
    error,
    generateAndUploadQRCode,
    downloadQRCode,
    shareQRCode,
    regenerateQRCode: generateOrFetchQRCode
  };
};

export default useQRGeneration;