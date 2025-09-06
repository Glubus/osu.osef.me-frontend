import { useDownload } from "@/hooks";

export const useBeatmapHeader = () => {
	const { downloadBeatmap } = useDownload();

	const handleDownload = (beatmapsetOsuId?: number) => {
		if (beatmapsetOsuId) {
			downloadBeatmap(beatmapsetOsuId);
		}
	};

	return {
		handleDownload
	};
};
