import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BeatmapsetRedirect from './pages/BeatmapsetRedirect';
import BeatmapView from './pages/BeatmapView';
import { Roadmap } from './pages/Roadmap';
import RandomBeatmaps from './pages/RandomBeatmaps';
import Navbar from './components/organisms/Navbar/Navbar';
import BeatmapList from './components/organisms/BeatmapList/BeatmapList';

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<BeatmapList />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/random" element={<RandomBeatmaps />} />
            <Route path="beatmapsets/:beatmapsetId" element={<BeatmapsetRedirect />} />
            <Route path="beatmapsets/:beatmapsetId/:beatmapId" element={<BeatmapView />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
