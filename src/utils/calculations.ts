/**
 * Calcule le NPS (Notes Per Second) d'une beatmap
 * @param countCircles - Nombre de cercles
 * @param countSliders - Nombre de sliders
 * @param totalTime - Temps total en secondes
 * @returns NPS arrondi à 2 décimales
 */
export const calculateNPS = (
	countCircles: number,
	countSliders: number,
	totalTime: number,
): number => {
	const totalNotes = countCircles + countSliders;
	const timeInMinutes = totalTime / 60;
	return timeInMinutes > 0
		? Math.round((totalNotes / timeInMinutes) * 100) / 100
		: 0;
};

/**
 * Calcule la densité des patterns (notes par seconde)
 * @param totalNotes - Nombre total de notes
 * @param totalTime - Temps total en secondes
 * @returns Densité en notes/seconde
 */
export const calculateDensity = (
	totalNotes: number,
	totalTime: number,
): number => {
	return totalTime > 0 ? Math.round((totalNotes / totalTime) * 100) / 100 : 0;
};

/**
 * Formate une durée en secondes vers MM:SS
 * @param seconds - Durée en secondes
 * @returns Format MM:SS
 */
export const formatDuration = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};
