import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import type { BeatmapWithDetails, BeatmapFilters } from '../types/beatmap';
import { beatmapService } from '../api/services';
import SearchBar from '../components/organisms/search/SearchBar/SearchBar';
import AdvancedFilters from '../components/organisms/search/AdvancedFilter/AdvancedFilter';
import BeatmapView from '../components/templates/BeatmapList/BeatmapView';

const BeatmapBrowser: React.FC = () => {
  const [beatmaps, setBeatmaps] = useState<BeatmapWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BeatmapFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Refs pour éviter les problèmes de re-render et appels multiples
  const loadingRef = useRef(false);
  const inViewRef = useRef(false);
  const lastPageRef = useRef(0);

  // Intersection Observer pour le scroll infini
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '300px',
    triggerOnce: false
  });

  // Charger les beatmaps initiales
  useEffect(() => {
    loadBeatmaps(true);
  }, []);

  const loadBeatmaps = useCallback(async (reset: boolean = false) => {
    // Éviter les appels multiples
    if (loadingRef.current) {
      return;
    }

    if (reset) {
      setBeatmaps([]);
      setCurrentPage(1);
      setHasMore(true);
      lastPageRef.current = 0;
    }
    
    if (!hasMore && !reset) return;
    
    loadingRef.current = true;
    setLoading(true);
    setError(null);
    
    try {
      const page = reset ? 1 : currentPage;
      const response = await beatmapService.getBeatmaps(filters, page, 30);
      
      // Éviter les doublons
      if (page <= lastPageRef.current && !reset) {
        return;
      }
      
      if (reset) {
        setBeatmaps(response.beatmaps);
      } else {
        setBeatmaps(prev => [...prev, ...response.beatmaps]);
      }
      
      setTotal(response.total);
      setHasMore(response.page < response.total_pages);
      setCurrentPage(response.page + 1);
      lastPageRef.current = response.page;
    } catch (err) {
      setError('Erreur lors du chargement des beatmaps');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentPage, hasMore, filters]);

  // Gérer le scroll infini de manière plus stable
  useEffect(() => {
    // Éviter les déclenchements multiples
    if (inView === inViewRef.current) return;
    
    inViewRef.current = inView;
    
    if (inView && !loadingRef.current && hasMore && beatmaps.length > 0) {
      // Délai pour éviter les appels multiples rapides
      const timer = setTimeout(() => {
        if (inViewRef.current && !loadingRef.current && hasMore) {
          loadBeatmaps(false);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [inView, hasMore, beatmaps.length, loadBeatmaps]);

  const handleSearch = () => {
    const newFilters = {
      ...filters,
      search_term: searchTerm
    };
    setFilters(newFilters);
    loadBeatmaps(true);
  };

  const handleFiltersChange = (newFilters: BeatmapFilters) => {
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    loadBeatmaps(true);
  };

  const handleBeatmapClick = (beatmap: BeatmapWithDetails) => {
    // Navigation vers la page de détail
    window.location.href = `/beatmap/${beatmap.beatmap.id}`;
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchTerm('');
    loadBeatmaps(true);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-2">
              🎵 Beatmap Browser
            </h1>
            <p className="text-base-content/70">
              Découvrez et explorez des milliers de beatmaps
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="mb-6">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>

          {/* Filtres avancés */}
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onApplyFilters={handleApplyFilters}
            loading={loading}
          />
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="alert alert-error mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Liste des beatmaps */}
        <BeatmapView
          beatmaps={beatmaps}
          loading={false} // Pas de loading sur la liste principale
          onBeatmapClick={handleBeatmapClick}
        />

        {/* Scroll infini trigger - plus discret */}
        {hasMore && (
          <div 
            ref={loadMoreRef}
            className="flex justify-center mt-8 py-4"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="loading loading-spinner loading-sm"></div>
                <span className="text-sm">Chargement...</span>
              </div>
            ) : (
              <div className="text-base-content/40 text-xs">
                Chargement automatique...
              </div>
            )}
          </div>
        )}

        {/* Message de fin */}
        {!hasMore && beatmaps.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="text-base-content/60 text-sm">
              Toutes les beatmaps ont été chargées ({total} au total)
            </div>
          </div>
        )}

        {/* Bouton de réinitialisation */}
        {!loading && (searchTerm || Object.keys(filters).length > 0) && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleResetFilters}
              className="btn btn-outline btn-sm"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeatmapBrowser;
