// src/components/molecules/SearchInputGroup.tsx
import type React from "react";
import SearchIcon from "../../../atom/SearchBar/SearchIcon/SearchIcon";
import ClearButton from "../../../atom/SearchBar/ClearButton/ClearButton";

type Props = {
	value: string;
	onChange: (value: string) => void;
	onClear: () => void;
	onFocus: () => void;
	onBlur: () => void;
	disabled?: boolean;
	isFocused: boolean;
};

const SearchInputGroup: React.FC<Props> = ({
	value,
	onChange,
	onClear,
	onFocus,
	onBlur,
	disabled,
	isFocused,
}) => (
	<div
		className={`join-item flex-1 relative ${isFocused ? "ring-2 ring-primary" : ""}`}
	>
		<input
			type="text"
			placeholder="Rechercher des beatmaps..."
			className="input input-bordered join-item w-full pl-12 pr-12"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			onFocus={onFocus}
			onBlur={onBlur}
			disabled={disabled}
		/>
		<SearchIcon />
		{value && <ClearButton onClick={onClear} disabled={disabled} />}
	</div>
);

export default SearchInputGroup;
