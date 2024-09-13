import React, { useState } from 'react';

interface SearchProps {
  onSearch: (address: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter address"
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white p-2 rounded">
        Search
      </button>
    </form>
  );
};

export default Search;
