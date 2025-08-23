import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { BeatmapFilters, BeatmapWithDetails } from "../types/beatmap";
import { beatmapService } from "../api/services";

export const useBeatmapBrowser = () => {
	const [beatmaps, setBeatmaps] = useState<BeatmapWithDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [filters, setFilters] = useState<BeatmapFilters>({});
	const [currentPage, setCurrentPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [total, setTotal] = useState(0);

	const loadingRef = useRef(false);
	const inViewRef = useRef(false);
	const lastPageRef = useRef(0);

	const { ref: loadMoreRef, inView } = useInView({
		threshold: 0,
		rootMargin: "300px",
		triggerOnce: false,
	});

	const loadBeatmaps = useCallback(
		async (reset = false) => {
			if (loadingRef.current) return;

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

				if (page <= lastPageRef.current && !reset) return;

				setBeatmaps((prev) =>
					reset ? response.beatmaps : [...prev, ...response.beatmaps],
				);
				setTotal(response.total);
				setHasMore(response.page < response.total_pages);
				setCurrentPage(response.page + 1);
				lastPageRef.current = response.page;
			} catch (err) {
				console.error(err);
				setError("Erreur lors du chargement des beatmaps");
			} finally {
				setLoading(false);
				loadingRef.current = false;
			}
		},
		[currentPage, hasMore, filters],
	);

	useEffect(() => {
		loadBeatmaps(true);
	}, []);

	useEffect(() => {
		if (inView === inViewRef.current) return;
		inViewRef.current = inView;

		if (inView && !loadingRef.current && hasMore && beatmaps.length > 0) {
			const timer = setTimeout(() => {
				if (inViewRef.current && !loadingRef.current && hasMore) {
					loadBeatmaps(false);
				}
			}, 100);

			return () => clearTimeout(timer);
		}
	}, [inView, hasMore, beatmaps.length, loadBeatmaps]);

	const handleSearch = () => {
		setFilters((prev) => ({ ...prev, search_term: searchTerm }));
		loadBeatmaps(true);
	};

	const handleApplyFilters = () => {
		loadBeatmaps(true);
	};

	const handleResetFilters = () => {
		setSearchTerm("");
		setFilters({});
		loadBeatmaps(true);
	};

	return {
		beatmaps,
		loading,
		error,
		searchTerm,
		filters,
		total,
		hasMore,
		setSearchTerm,
		setFilters,
		handleSearch,
		handleApplyFilters,
		handleResetFilters,
		loadMoreRef,
	};
};
