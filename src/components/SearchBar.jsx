import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { searchLocation } from './utils/api';

export function SearchBar({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 3) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const searchResults = await searchLocation(value);
      setResults(searchResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search location..."
          className="w-full px-4 py-2 pl-10 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      
      {results.length > 0 && (
        <div className="absolute w-full mt-2 bg-white rounded-lg shadow-lg z-10">
          {results.map((result, index) => (
            <button
              key={index}
              onClick={() => {
                onLocationSelect(result);
                setQuery('');
                setResults([]);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
            >
              {result.name}, {result.country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}