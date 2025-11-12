import React from 'react';
import ContactCard from '../ui/ContactCard';
import { MapIcon, PhoneIcon, ClockIcon } from '../../assets/icons/svgIcons';
import { CONTACT_INFO } from '../../utils/constants';

const VisitUsSection = () => {
  const contactInfo = [
    {
      icon: <MapIcon className="w-7 h-7 text-blue-600" />,
      title: "Location",
      details: [
        CONTACT_INFO.ADDRESS.line1,
        CONTACT_INFO.ADDRESS.line2
      ]
    },
    {
      icon: <PhoneIcon className="w-7 h-7 text-blue-600" />,
      title: "Contact",
      details: [
        CONTACT_INFO.PHONE,
        CONTACT_INFO.EMAIL
      ]
    },
    {
      icon: <ClockIcon className="w-7 h-7 text-blue-600" />,
      title: "Campus Hours",
      details: [
        CONTACT_INFO.HOURS.weekdays,
        CONTACT_INFO.HOURS.saturday
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Us</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your visit to Embu University. Our campus is open to prospective students, visitors, and the community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactInfo.map((info, index) => (
            <ContactCard
              key={index}
              icon={info.icon}
              title={info.title}
              details={info.details}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisitUsSection;