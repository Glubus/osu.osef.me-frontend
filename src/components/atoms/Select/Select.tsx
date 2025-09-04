import React from "react";

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  id?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  id,
  value,
  onChange,
  options,
  label,
  className = "",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-base-content">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`select select-bordered w-full bg-base-100 text-base-content border-base-300 focus:border-primary focus:outline-none ${className}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
