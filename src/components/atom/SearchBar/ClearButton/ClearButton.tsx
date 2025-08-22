// src/components/atoms/ClearButton.tsx
import React from 'react';
import { X } from 'lucide-react';

type Props = {
  onClick: () => void;
  disabled?: boolean;
};

const ClearButton: React.FC<Props> = ({ onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/50 hover:text-base-content transition-colors"
    disabled={disabled}
  >
    <X className="w-5 h-5" />
  </button>
);

export default ClearButton;
