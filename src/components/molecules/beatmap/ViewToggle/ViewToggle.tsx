import React from 'react';
import TextLabel from '../../../atom/TextLabel/TextLabel';
import Button from '../../../atom/Button/Button';
import Icon from '../../../atom/Icon/Icon';

export type ViewMode = 'cards' | 'table';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewModeChange }) => (
  <div className="flex items-center gap-2">
    <TextLabel>Affichage:</TextLabel>
    <div className="join">
      <Button
        active={viewMode === 'cards'}
        joinItem
        onClick={() => onViewModeChange('cards')}
      >
        <Icon>
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </Icon>
        Cartes
      </Button>

      <Button
        active={viewMode === 'table'}
        joinItem
        onClick={() => onViewModeChange('table')}
      >
        <Icon>
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </Icon>
        Tableau
      </Button>
    </div>
  </div>
);

export default ViewToggle;
