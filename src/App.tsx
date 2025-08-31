import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeatmapsetRedirect from './pages/BeatmapsetRedirect';
import BeatmapView from './pages/BeatmapView';
import { Roadmap } from './pages/Roadmap';
import RandomBeatmaps from './pages/RandomBeatmaps';
import BeatmapListPage from './pages/BeatmapList';
import BeatmapStats from './pages/BeatmapStats';
import Navbar from './components/organisms/Navbar/Navbar';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<BeatmapListPage />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/random" element={<RandomBeatmaps />} />
            <Route path="/stats" element={<BeatmapStats />} />
            <Route path="beatmapsets/:beatmapsetId" element={<BeatmapsetRedirect />} />
            <Route path="beatmapsets/:beatmapsetId/:beatmapId" element={<BeatmapView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
