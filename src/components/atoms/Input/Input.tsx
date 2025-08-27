import type React from "react";

export interface InputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  type?: "text" | "number";
  className?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  id,
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  className = "",
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none ${className}`}
      />
    </div>
  );
};

export default Input;