import './App.css';
import BeatmapListWithFilters from './components/organisms/BeatmapListWithFilters/BeatmapListWithFilters';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeatmapsetRedirect from './pages/BeatmapsetRedirect';
import BeatmapView from './pages/BeatmapView';
import Navbar from './components/organisms/Navbar/Navbar';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<BeatmapListWithFilters />} />
            <Route path="beatmapsets/:beatmapsetId" element={<BeatmapsetRedirect />} />
            <Route path="beatmapsets/:beatmapsetId/:beatmapId" element={<BeatmapView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
