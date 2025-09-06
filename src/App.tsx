import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import Navbar from './components/templates/Navbar';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load route components for better bundle splitting
const BeatmapListPage = lazy(() => import('./pages/BeatmapList'));
const BeatmapView = lazy(() => import('./pages/BeatmapView'));
const BeatmapStats = lazy(() => import('./pages/BeatmapStats'));
const BeatmapsetRedirect = lazy(() => import('./pages/BeatmapsetRedirect'));
const Roadmap = lazy(() => import('./pages/Roadmap').then(module => ({ default: module.Roadmap })));
const RandomBeatmaps = lazy(() => import('./pages/RandomBeatmaps'));
const Help = lazy(() => import('./pages/Help'));

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (remplace cacheTime)
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="loading loading-spinner loading-lg"></div>
  </div>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <div className="min-h-screen bg-base-100">
            <Navbar />
            <main className="content">
              <Suspense fallback={<LoadingFallback />}>
                              <Routes>
                <Route path="/" element={<BeatmapListPage />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/random" element={<RandomBeatmaps />} />
                <Route path="/stats" element={<BeatmapStats />} />
                <Route path="/help" element={<Help />} />
                <Route path="beatmapsets/:beatmapsetId" element={<BeatmapsetRedirect />} />
                <Route path="beatmapsets/:beatmapsetId/:beatmapId" element={<BeatmapView />} />
              </Routes>
              </Suspense>
            </main>
          </div>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
