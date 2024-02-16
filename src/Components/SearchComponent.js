import React, { useState, useEffect } from 'react';
import debounce from 'lodash.debounce';

const SearchComponent = ({ onSearch, foodPreference, mealType }) => {
    const [searchTerm, setSearchTerm] = useState('');

  // Debounce search term to minimize the number of search queries triggered while typing
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(searchTerm);
    }, 300); // 300ms delay for debouncing

    if (searchTerm) {
      debouncedSearch();
    }

    // Cleanup debounce
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, onSearch]);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};

export default SearchComponent;
