// src/components/hero/CategoryTabs.jsx
import React from 'react';
import { LOCATION_CATEGORIES } from '../../utils/constants';

const CategoryTabs = ({ activeCategory, onCategorySelect }) => {
  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategorySelect('POPULAR')}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
            activeCategory === 'POPULAR'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ⭐ Popular
        </button>
        {LOCATION_CATEGORIES.map(category => (
          <button
            key={category.key}
            onClick={() => onCategorySelect(category.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === category.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;