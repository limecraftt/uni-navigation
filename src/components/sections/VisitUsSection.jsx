// src/components/sections/VisitUsSection.jsx
import React from 'react';
import ContactCard from '../ui/ContactCard';
import { MapIcon, PhoneIcon, ClockIcon } from '../../assets/icons/svgIcons';
import { CONTACT_INFO } from '../../utils/constants';

const VisitUsSection = () => {
  const contactInfo = [
    {
      icon: <MapIcon className="w-6 h-6 text-blue-600" />,
      title: "Location",
      details: [
        CONTACT_INFO.ADDRESS.line1,
        CONTACT_INFO.ADDRESS.line2
      ]
    },
    {
      icon: <PhoneIcon className="w-6 h-6 text-blue-600" />,
      title: "Contact",
      details: [
        CONTACT_INFO.PHONE,
        CONTACT_INFO.EMAIL
      ]
    },
    {
      icon: <ClockIcon className="w-6 h-6 text-blue-600" />,
      title: "Campus Hours",
      details: [
        CONTACT_INFO.HOURS.weekdays,
        CONTACT_INFO.HOURS.saturday
      ]
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Visit Us</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Plan your visit to Embu University. Our campus is open to prospective students, visitors, and the community.
          </p>
        </div>

        {/* Mobile: stacked clean cards, Desktop: 3 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start space-x-4 bg-gray-50 rounded-xl p-4 md:block md:text-center md:p-6">
              {/* Icon */}
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg md:mx-auto md:mb-3 md:w-12 md:h-12 md:flex md:items-center md:justify-center">
                {info.icon}
              </div>
              {/* Text */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{info.title}</h3>
                {info.details.map((detail, i) => (
                  <p key={i} className="text-sm text-gray-500">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;