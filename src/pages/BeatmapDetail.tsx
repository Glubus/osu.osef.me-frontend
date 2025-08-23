import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Download, Heart, Share2 } from "lucide-react";
import { beatmapService } from "../api/services";
import MSDRadarChart from "../components/molecules/beatmap/MSDCharts/MSDRadarChart";
import OsuManiaPreviewWebGL from "../components/organisms/beatmap/BeatmapPreview/BeatmapPreview";
import { calculateNPS, formatDuration } from "../utils/calculations";
import {
	calcDistributionSmart,
	createBeatmapFromHitObjects,
} from "../services/distribution";
import { MapParserService } from "../services/map_parser";
import type {
	BeatmapsetCompleteExtended,
	MSDDataPoint,
	NPSDataPoint,
} from "../types/beatmap";
import { getRatingColorClass } from "../types/beatmap";

const BeatmapDetail: React.FC = () => {
	const { beatmapsetOsuId, beatmapOsuId } = useParams<{
		beatmapsetOsuId: string;
		beatmapOsuId: string;
	}>();
	const navigate = useNavigate();
	const [beatmapsetData, setBeatmapsetData] =
		useState<BeatmapsetCompleteExtended | null>(null);
	const [currentBeatmapIndex, setCurrentBeatmapIndex] = useState<number>(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (beatmapsetOsuId) {
			loadBeatmapsetDetail(
				parseInt(beatmapsetOsuId),
				beatmapOsuId ? parseInt(beatmapOsuId) : undefined,
			);
		}
	}, [beatmapsetOsuId, beatmapOsuId]);

	const loadBeatmapsetDetail = async (
		beatmapsetOsuId: number,
		beatmapOsuId?: number,
	) => {
		setLoading(true);
		setError(null);

		try {
			const data = await beatmapService.getBeatmapsetById(beatmapsetOsuId);
			setBeatmapsetData(data);

			// Si aucun beatmapOsuId n'est fourni, rediriger vers la première beatmap
			if (!beatmapOsuId && data.beatmap.length > 0) {
				const firstBeatmapOsuId = data.beatmap[0].beatmap.osu_id;
				navigate(`/beatmapsets/${beatmapsetOsuId}/${firstBeatmapOsuId}`, {
					replace: true,
				});
				return;
			}

			// Si un beatmapOsuId spécifique est fourni, trouver son index
			if (beatmapOsuId) {
				const index = data.beatmap.findIndex(
					(b) => b.beatmap.osu_id === beatmapOsuId,
				);
				if (index !== -1) {
					setCurrentBeatmapIndex(index);
				}
			}
		} catch (err) {
			setError("Erreur lors du chargement de la beatmap");
			console.error("Erreur:", err);
		} finally {
			setLoading(false);
		}
	};

	const currentBeatmap = beatmapsetData?.beatmap[currentBeatmapIndex];
	const beatmapset = beatmapsetData?.beatmapset;

	const handleBeatmapChange = (index: number) => {
		setCurrentBeatmapIndex(index);
		const newBeatmap = beatmapsetData?.beatmap[index];
		if (newBeatmap) {
			// Mettre à jour l'URL sans recharger la page
			navigate(`/beatmapsets/${beatmapsetOsuId}/${newBeatmap.beatmap.osu_id}`, {
				replace: true,
			});
		}
	};

	const getMSDDataForRadar = (): MSDDataPoint[] => {
		if (!currentBeatmap?.msd) return [];

		const { msd } = currentBeatmap;
		return [
			{ name: "Stream", value: msd.stream },
			{ name: "Jumpstream", value: msd.jumpstream },
			{ name: "Handstream", value: msd.handstream },
			{ name: "Stamina", value: msd.stamina },
			{ name: "Jackspeed", value: msd.jackspeed },
			{ name: "Chordjack", value: msd.chordjack },
			{ name: "Technical", value: msd.technical },
		];
	};

	const [npsData, setNpsData] = useState<NPSDataPoint[]>([]);

	const loadNPSData = useCallback(async () => {
		if (!currentBeatmap?.beatmap.id) {
			return;
		}

		try {
			console.log("Loading NPS data for beatmap:", currentBeatmap.beatmap.id);
			// Récupérer les hit objects depuis le fichier .osu
			const hitObjects = await MapParserService.parseOsuFile(
				currentBeatmap.beatmap.id,
			);
			const beatmap = createBeatmapFromHitObjects(hitObjects);

			// Calculer la distribution avec 200 barres
			const distribution = calcDistributionSmart(beatmap, 200);

			if (!distribution) {
				return;
			}

			const totalTime = currentBeatmap.beatmap.total_time;
			const timePerBar = totalTime / 200;

			const newNpsData = distribution.map((density, index) => ({
				time: index * timePerBar,
				density: density,
			}));

			setNpsData(newNpsData);
			console.log("NPS data loaded successfully");
		} catch (error) {
			console.error("Erreur lors du calcul de la distribution NPS:", error);
		}
	}, [currentBeatmap?.beatmap.id, currentBeatmap?.beatmap.total_time]);

	const [previewTime, setPreviewTime] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	const handleBarClick = (time: number) => {
		setPreviewTime(time);
	};

	const handlePlayPause = () => {
		setIsPlaying(!isPlaying);
	};

	const handleReset = () => {
		setPreviewTime(0);
		setIsPlaying(false);
	};

	// Timer pour la prévisualisation
	useEffect(() => {
		let interval: number;

		if (isPlaying && previewTime < (currentBeatmap?.beatmap.total_time || 0)) {
			interval = setInterval(() => {
				setPreviewTime((prev) => {
					const totalTime = currentBeatmap?.beatmap.total_time || 0;
					const newTime = prev + 1 / 30; // Incrément de 1/30 seconde pour vitesse normale
					if (newTime >= totalTime) {
						setIsPlaying(false);
						return totalTime;
					}
					return newTime;
				});
			}, 8); // 120fps = ~8ms par frame (rendu fluide)
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isPlaying, previewTime, currentBeatmap?.beatmap.total_time]);

	// Charger les données NPS quand la beatmap change
	useEffect(() => {
		if (currentBeatmap?.beatmap.id) {
			console.log(
				"BeatmapDetail: Loading NPS data, currentBeatmap.id:",
				currentBeatmap.beatmap.id,
			);
			loadNPSData();
		}
	}, [currentBeatmap?.beatmap.id, loadNPSData]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "ranked":
				return "badge-success";
			case "loved":
				return "badge-error";
			case "graveyard":
				return "badge-warning";
			case "pending":
				return "badge-info";
			default:
				return "badge-neutral";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-base-100 flex items-center justify-center">
				<div className="loading loading-spinner loading-lg"></div>
			</div>
		);
	}

	if (error || !beatmapsetData || !currentBeatmap) {
		return (
			<div className="min-h-screen bg-base-100 flex items-center justify-center">
				<div className="text-center">
					<div className="text-6xl mb-4">😵</div>
					<h3 className="text-xl font-semibold mb-2">Erreur</h3>
					<p className="text-base-content/60 mb-4">
						{error || "Beatmap introuvable"}
					</p>
					<button onClick={() => navigate("/")} className="btn btn-primary">
						Retour à l'accueil
					</button>
				</div>
			</div>
		);
	}

	const { beatmap, msd } = currentBeatmap;
	const nps = calculateNPS(
		beatmap.count_circles,
		beatmap.count_sliders,
		beatmap.total_time,
	);
	const msdData = getMSDDataForRadar();

	return (
		<div className="min-h-screen bg-base-100">
			{/* Header avec navigation */}
			<div className="bg-base-200 border-b border-base-300">
				<div className="container mx-auto px-4 py-4">
					<button
						onClick={() => navigate("/")}
						className="btn btn-ghost btn-sm gap-2"
					>
						<ArrowLeft className="w-4 h-4" />
						Retour
					</button>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				{/* En-tête de la beatmap */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
					{/* Cover et infos principales */}
					<div className="lg:col-span-2">
						<div className="card bg-base-100 shadow-xl">
							<figure className="relative h-80">
								<img
									src={
										beatmapset?.osu_id
											? `https://assets.ppy.sh/beatmaps/${beatmapset.osu_id}/covers/cover.jpg`
											: "/default-cover.jpg"
									}
									alt={`${beatmapset?.artist || "Unknown Artist"} - ${beatmapset?.title || "Unknown Title"}`}
									className="w-full h-full object-cover"
									onError={(e) => {
										const target = e.target as HTMLImageElement;
										target.src = "/default-cover.jpg";
									}}
								/>
								<div className="absolute inset-0 bg-black/50" />
								<div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
									{/* Header avec badges */}
									<div className="flex justify-between items-start">
										<div className="flex items-center gap-4">
											<div
												className={`badge ${getStatusColor(beatmap.status)}`}
											>
												{beatmap.status.toUpperCase()}
											</div>
											<div className="badge badge-outline">
												{beatmap.difficulty}
											</div>
										</div>
									</div>

									{/* Badge rating overall */}
									<div className="absolute top-6 right-6">
										<div className="badge badge-primary badge-lg text-lg font-bold">
											{msd.overall}★
										</div>
									</div>

									{/* Informations principales */}
									<div>
										<h1 className="text-3xl font-bold mb-2">
											{beatmapset?.title}
										</h1>
										<p className="text-xl mb-4">{beatmapset?.artist}</p>

										{/* Stats compactes */}
										<div className="flex items-center gap-6 text-sm">
											<div className="flex items-center gap-2">
												<span className="text-base-content/80">BPM:</span>
												<span className="font-bold">{beatmap.bpm}</span>
											</div>
											<div className="flex items-center gap-2">
												<span className="text-base-content/80">Durée:</span>
												<span className="font-bold">
													{formatDuration(beatmap.total_time)}
												</span>
											</div>
										</div>
									</div>
								</div>
							</figure>
						</div>
					</div>

					{/* Actions */}
					<div className="card bg-base-100 shadow-xl h-fit">
						<div className="card-body">
							<h3 className="card-title">Actions</h3>

							{/* Sélecteur de beatmap avec badges */}
							{beatmapsetData.beatmap.length > 1 && (
								<div className="form-control w-full mb-4">
									<label className="label">
										<span className="label-text">Difficultés</span>
									</label>
									<div className="flex flex-wrap gap-2">
										{beatmapsetData.beatmap.map((beatmapWithMsd, index) => {
											const isActive = index === currentBeatmapIndex;
											const rating = beatmapWithMsd.msd.overall;
											const colorClass = getRatingColorClass(rating);

											return (
												<div
													key={beatmapWithMsd.beatmap.id}
													className="tooltip tooltip-top"
													data-tip={beatmapWithMsd.beatmap.difficulty}
												>
													<button
														onClick={() => handleBeatmapChange(index)}
														className={`badge badge-sm cursor-pointer transition-all duration-200 hover:scale-110 ${
															isActive
																? `${colorClass} text-white font-bold shadow-lg`
																: `${colorClass} opacity-70 hover:opacity-100`
														}`}
													>
														{rating}★
													</button>
												</div>
											);
										})}
									</div>
								</div>
							)}

							<div className="flex flex-col gap-2">
								<button className="btn btn-outline gap-2">
									<Download className="w-4 h-4" />
									Télécharger
								</button>
								<button className="btn btn-ghost gap-2">
									<Heart className="w-4 h-4" />
									Favoris
								</button>
								<button className="btn btn-ghost gap-2">
									<Share2 className="w-4 h-4" />
									Partager
								</button>
							</div>
						</div>
					</div>
				</div>

				{/* Graphiques et prévisualisation */}
				<div className="grid grid-cols-1 lg:grid-cols-8 gap-8 mb-8">
					{/* Graphique radar MSD */}
					<div className="lg:col-span-5 card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title">Analyse MSD</h3>
							<MSDRadarChart data={msdData} />
						</div>
					</div>

					{/* Preview de la beatmap */}
					<div className="lg:col-span-3 card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title">Prévisualisation</h3>

							{/* Preview de la beatmap avec NPS intégré */}
							<OsuManiaPreviewWebGL
								currentTime={previewTime}
								totalTime={beatmap.total_time}
								beatmap={beatmap}
								isPlaying={isPlaying}
								onPlayPause={handlePlayPause}
								onReset={handleReset}
								npsData={npsData}
								onBarClick={handleBarClick}
							/>
						</div>
					</div>
				</div>

				{/* Détails techniques */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title">Détails de la beatmap</h3>
							<div className="overflow-x-auto">
								<table className="table table-zebra">
									<tbody>
										<tr>
											<td className="font-semibold">Mapper</td>
											<td>{beatmapset?.creator}</td>
										</tr>
										<tr>
											<td className="font-semibold">Circles</td>
											<td>{beatmap.count_circles}</td>
										</tr>
										<tr>
											<td className="font-semibold">Sliders</td>
											<td>{beatmap.count_sliders}</td>
										</tr>
										<tr>
											<td className="font-semibold">Spinners</td>
											<td>{beatmap.count_spinners}</td>
										</tr>
										<tr>
											<td className="font-semibold">Max Combo</td>
											<td>{beatmap.max_combo}</td>
										</tr>
										<tr>
											<td className="font-semibold">CS</td>
											<td>{beatmap.cs}</td>
										</tr>
										<tr>
											<td className="font-semibold">AR</td>
											<td>{beatmap.ar}</td>
										</tr>
										<tr>
											<td className="font-semibold">OD</td>
											<td>{beatmap.od}</td>
										</tr>
										<tr>
											<td className="font-semibold">HP</td>
											<td>{beatmap.hp}</td>
										</tr>
									</tbody>
								</table>
							</div>
						</div>
					</div>

					<div className="card bg-base-100 shadow-xl">
						<div className="card-body">
							<h3 className="card-title">TODO - Fonctionnalités à venir</h3>
							<div className="space-y-4">
								<div className="alert alert-success">
									<div>
										<h4 className="font-bold">✅ Graphique Radar MSD</h4>
										<p>
											Visualisation interactive des données MSD (sauf overall)
										</p>
									</div>
								</div>
								<div className="alert alert-success">
									<div>
										<h4 className="font-bold">✅ NPS (Notes Per Second)</h4>
										<p>Calcul et affichage du NPS en temps réel</p>
									</div>
								</div>
								<div className="alert alert-success">
									<div>
										<h4 className="font-bold">✅ Sélecteur de difficulté</h4>
										<p>
											Navigation entre les différentes difficultés d'un
											beatmapset
										</p>
									</div>
								</div>
								<div className="alert alert-info">
									<div>
										<h4 className="font-bold">🎯 Densité</h4>
										<p>Analyse de la densité des patterns</p>
									</div>
								</div>
								<div className="alert alert-info">
									<div>
										<h4 className="font-bold">👁️ Visualisation</h4>
										<p>Graphiques et visualisations avancées</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BeatmapDetail;
