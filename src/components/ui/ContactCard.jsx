import React from 'react';

const ContactCard = ({ icon, title, details }) => {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 text-center border border-gray-100">
      <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      {details.map((detail, index) => (
        <p key={index} className={`text-gray-600 ${index === 0 ? 'mb-1' : ''}`}>
          {detail}
        </p>
      ))}
    </div>
  );
};

export default ContactCard;