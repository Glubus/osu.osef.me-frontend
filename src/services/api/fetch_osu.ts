import { CATBOY_API_BASE_URL } from "@/types/global";
import axios from "axios";

	// Récupérer le fichier .osu d'une beatmap
	export async function fetchOsuFile(beatmapId: number): Promise<string> {
		try {
			const response = await axios.get(`${CATBOY_API_BASE_URL}/osu/${beatmapId}`, {
				headers: {
					Accept: "text/plain",
				},
			});
			return response.data;
		} catch (error) {
			console.error("Erreur lors de la récupération du fichier .osu:", error);
			throw error;
		}
	}  