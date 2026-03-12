// src/components/hero/CategoryTabs.jsx
import React from 'react';

const CATEGORY_ICONS = {
  Academic: '🎓',
  Administrative: '🏢',
  Accommodation: '🏠',
  Dining: '🍽️',
  Entrance: '🚪',
  Events: '🎭',
  'Health Services': '🏥',
  Parking: '🅿️',
  Recreation: '⚽',
  Religious: '⛪',
  Research: '🔬',
  'Student Services': '👥',
  Other: '📍',
};

const CategoryTabs = ({ activeCategory, onCategorySelect, categories = [] }) => {
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
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => onCategorySelect(cat.key)}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              activeCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {CATEGORY_ICONS[cat.label] || '📍'} {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;