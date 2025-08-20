import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { SearchBarProps } from '../../../types/beatmap';

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch, 
  loading = false 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    onSearchChange('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`join w-full ${isFocused ? 'ring-2 ring-primary' : ''}`}>
          <div className="join-item flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher des beatmaps..."
              className="input input-bordered join-item w-full pl-12 pr-12"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              disabled={loading}
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
                disabled={loading}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className={`btn join-item ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && 'Rechercher'}
          </button>
        </div>
      </form>
      
      {searchTerm && (
        <div className="mt-2 text-sm text-base-content/60">
          Recherche pour: <span className="font-medium">{searchTerm}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
