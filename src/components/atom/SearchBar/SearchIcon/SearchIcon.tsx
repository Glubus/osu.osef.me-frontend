// src/components/atoms/SearchIcon.tsx
import type React from "react";
import { Search } from "lucide-react";

const SearchIcon: React.FC = () => (
	<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
);

export default SearchIcon;
