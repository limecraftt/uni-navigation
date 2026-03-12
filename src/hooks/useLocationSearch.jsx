// src/hooks/useLocationSearch.jsx
import { useState, useEffect } from 'react';
import { getAllLocations } from '../api/locationsApi';

export const useLocationSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('POPULAR');
  const [allLocations, setAllLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLocations().then(({ data }) => {
      setAllLocations(data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setActiveCategory('SEARCH');
    } else if (activeCategory === 'SEARCH') {
      setActiveCategory('POPULAR');
    }
  }, [searchQuery]);

  const getLocationsToShow = () => {
    if (activeCategory === 'SEARCH' && searchQuery.trim()) {
      return allLocations.filter(loc =>
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (loc.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        loc.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeCategory === 'POPULAR') {
      return allLocations.slice(0, 6);
    }
    return allLocations.filter(
      loc => loc.category.toLowerCase() === activeCategory.toLowerCase()
    );
  };

  // Build unique categories dynamically from real data
  const getCategories = () => {
    const unique = [...new Set(allLocations.map(loc => loc.category))];
    return unique.map(cat => ({ key: cat, label: cat }));
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
    getLocationsToShow,
    getCategories,
    allLocations,
    loading
  };
};