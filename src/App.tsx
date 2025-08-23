import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BeatmapBrowser from "./pages/BeatmapBrowser";
import BeatmapDetail from "./pages/BeatmapDetail";
import "./App.css";

const App = () => {
	useEffect(() => {
		document.title = "osef.me";
	}, []);

	return (
		<Router>
			<div className="App">
				<Routes>
					<Route path="/" element={<BeatmapBrowser />} />
					<Route
						path="/beatmapsets/:beatmapsetOsuId/:beatmapOsuId"
						element={<BeatmapDetail />}
					/>
					<Route
						path="/beatmapsets/:beatmapsetOsuId"
						element={<BeatmapDetail />}
					/>
				</Routes>
			</div>
		</Router>
	);
};

export default App;
