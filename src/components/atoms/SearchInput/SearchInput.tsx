import React from "react";
import FilterInput from "../FilterInput/FilterInput";

export interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  id = "search-term",
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <FilterInput
      id={id}
      label="Search"
      tooltip="Search in beatmap title, artist, or creator name"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type="text"
      className={className}
    />
  );
};

export default SearchInput;
