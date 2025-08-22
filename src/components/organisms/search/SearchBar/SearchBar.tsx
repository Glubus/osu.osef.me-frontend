// src/components/organisms/SearchBar/index.tsx
import React, { useState } from 'react';
import type { SearchBarProps } from '../../../../types/beatmap';
import SearchInputGroup from '../../../molecules/search/SearchInputGroup/SearchInputGroup';
import SearchHelperText from '../../../atom/SearchBar/SearchHelperText/SearchHelperText';
import Button from '../../../atom/Button/Button';

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  loading = false,
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
        <div className="join w-full">
          <SearchInputGroup
            value={searchTerm}
            onChange={onSearchChange}
            onClear={handleClear}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={loading}
            isFocused={isFocused}
          />
          <Button
            type="submit"
            className={`join-item ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && 'Rechercher'}
          </Button>
        </div>
      </form>

      <SearchHelperText term={searchTerm} />
    </div>
  );
};

export default SearchBar;
