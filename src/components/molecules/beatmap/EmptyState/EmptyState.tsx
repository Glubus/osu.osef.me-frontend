import React from 'react';
import EmptyStateIcon from '../../../atom/EmptyStateIcon/EmptyStateIcon';
import Button from '../../../atom/Button/Button';

const EmptyState: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="text-center">
      <EmptyStateIcon />
      <h3 className="text-xl font-semibold mb-2">Aucune beatmap trouvée</h3>
      <p className="text-base-content/60 mb-4">
        Essayez de modifier vos critères de recherche ou vos filtres
      </p>
      <Button variant="primary">Réinitialiser les filtres</Button>
    </div>
  </div>
);

export default EmptyState;
