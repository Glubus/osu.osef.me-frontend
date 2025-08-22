// src/components/atoms/SearchHelperText.tsx
import React from 'react';

type Props = {
  term: string;
};

const SearchHelperText: React.FC<Props> = ({ term }) =>
  term ? (
    <div className="mt-2 text-sm text-base-content/60">
      Recherche pour: <span className="font-medium">{term}</span>
    </div>
  ) : null;

export default SearchHelperText;
