// src/components/navigation/QRCodeGenerator.jsx
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeGenerator = ({ value, size = 256 }) => {
  return (
    <div className="flex items-center justify-center">
      <QRCodeSVG
        value={value}
        size={size}
        level="H" // High error correction
        includeMargin={true}
        imageSettings={{
          src: "/logo.png", // Optional: Add your university logo in the center
          height: size * 0.15,
          width: size * 0.15,
          excavate: true,
        }}
      />
    </div>
  );
};

export default QRCodeGenerator;