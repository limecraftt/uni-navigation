// src/hooks/useLocationSearch.jsx
import { useState, useEffect } from 'react';
import { 
  ALL_LOCATIONS, 
  POPULAR_LOCATIONS, 
  CAMPUS_LOCATIONS 
} from '../utils/constants';

export const useLocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('POPULAR');

  // Handle search input changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = ALL_LOCATIONS.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        location.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
      setActiveCategory('SEARCH');
    } else {
      setFilteredLocations([]);
      setActiveCategory('POPULAR');
    }
  }, [searchQuery]);

  const getLocationsToShow = () => {
    if (activeCategory === 'SEARCH' && searchQuery) {
      return filteredLocations;
    } else if (activeCategory === 'POPULAR') {
      return POPULAR_LOCATIONS;
    } else {
      return CAMPUS_LOCATIONS[activeCategory] || [];
    }
  };

  const handleCategorySelect = (categoryKey) => {
    setActiveCategory(categoryKey);
    setSearchQuery('');
  };

  return {
    searchQuery,
    setSearchQuery,
    activeCategory,
    handleCategorySelect,
    getLocationsToShow
  };
};