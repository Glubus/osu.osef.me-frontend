import type { HitObject } from "./map_parser";

// Constantes pour améliorer la lisibilité
const MS_TO_SEC = 1000.0;

export interface Beatmap {
	hitObjects: HitObject[];
}

export function calcNPS(map: Beatmap): number | null {
	if (map.hitObjects.length === 0) return null;

	const drainTimeMs =
		map.hitObjects[map.hitObjects.length - 1].startTime -
		map.hitObjects[0].startTime;
	if (drainTimeMs <= 0) {
		return map.hitObjects.length;
	}
	return map.hitObjects.length / (drainTimeMs / MS_TO_SEC);
}

export function calcNPSRangeByTime(
	map: Beatmap,
	startTime: number,
	endTime: number,
): number | null {
	const drainTimeMs = endTime - startTime;
	if (drainTimeMs <= 0) {
		return 0;
	}

	const startIdx = map.hitObjects.findIndex((h) => h.startTime >= startTime);
	const endIdx = map.hitObjects.findIndex((h) => h.startTime > endTime);

	const count =
		endIdx === -1 ? map.hitObjects.length - startIdx : endIdx - startIdx;
	return Math.max(0, count) / (drainTimeMs / MS_TO_SEC);
}

export function calcNPSRangeByHitObjects(
	map: Beatmap,
	startObj: HitObject,
	endObj: HitObject,
): number | null {
	const drainTimeMs = endObj.startTime - startObj.startTime;
	if (drainTimeMs <= 0) {
		return 0;
	}

	const startIdx = map.hitObjects.indexOf(startObj);
	const endIdx = map.hitObjects.indexOf(endObj);

	if (startIdx === -1 || endIdx === -1) {
		return null;
	}

	const [minIdx, maxIdx] =
		startIdx <= endIdx ? [startIdx, endIdx + 1] : [endIdx, startIdx + 1];
	const count = maxIdx - minIdx;

	return count / (drainTimeMs / MS_TO_SEC);
}

export function calcDistribution(
	map: Beatmap,
	tParts: number,
): number[] | null {
	if (tParts <= 0 || map.hitObjects.length === 0) {
		return null;
	}

	const firstTime = map.hitObjects[0].startTime;
	const lastTime = map.hitObjects[map.hitObjects.length - 1].startTime;
	const totalDurationMs = lastTime - firstTime;

	if (totalDurationMs <= 0) {
		return new Array(tParts).fill(0);
	}

	const partDurationMs = totalDurationMs / tParts;
	const partDurationSec = partDurationMs / MS_TO_SEC;
	const distribution = new Array(tParts).fill(0);

	for (let part = 0; part < tParts; part++) {
		const partStartTime = firstTime + part * partDurationMs;
		const partEndTime = firstTime + (part + 1) * partDurationMs;

		// Utiliser < pour start_time et <= pour end_time
		const startIdx = map.hitObjects.findIndex(
			(h) => h.startTime >= partStartTime,
		);

		// Pour la dernière partie, inclure la dernière note avec <=
		const endIdx =
			part === tParts - 1
				? map.hitObjects.findIndex((h) => h.startTime > partEndTime)
				: map.hitObjects.findIndex((h) => h.startTime >= partEndTime);

		const count =
			endIdx === -1
				? map.hitObjects.length - Math.max(0, startIdx)
				: Math.max(0, endIdx - Math.max(0, startIdx));

		distribution[part] = count / partDurationSec;
	}

	return distribution;
}

export function toSec(ms: number): number {
	return ms / MS_TO_SEC;
}

export function calcDistribution2(
	map: Beatmap,
	tParts: number,
): number[] | null {
	if (tParts <= 0 || map.hitObjects.length === 0) {
		return null;
	}

	const firstTime = map.hitObjects[0].startTime;
	const lastTime = map.hitObjects[map.hitObjects.length - 1].startTime;
	const totalDurationMs = lastTime - firstTime;
	const partDurationMs = totalDurationMs / tParts;
	const partSize = tParts;
	const counts = new Array(partSize).fill(0);
	const invPartDuration = 1.0 / partDurationMs;

	for (const hitObject of map.hitObjects) {
		const relativeTime = hitObject.startTime - firstTime;
		const index = Math.min(
			Math.floor(relativeTime * invPartDuration),
			partSize - 1,
		);
		counts[index]++;
	}

	const partDurationSec = toSec(partDurationMs);

	return counts.map((count) => count / partDurationSec);
}

export function calcDistributionSmart(
	map: Beatmap,
	tParts: number,
): number[] | null {
	if (tParts <= 0 || map.hitObjects.length === 0) {
		return null;
	}

	const nObjects = map.hitObjects.length;

	// Heuristique : si t_parts * log2(n_objects) > n_objects, utiliser l'algorithme old
	// En pratique, on peut simplifier avec un seuil empirique
	const threshold = Math.floor(Math.sqrt(nObjects));

	if (tParts > threshold) {
		// Pour beaucoup de parties, l'algorithme old est plus efficace
		return calcDistribution2(map, tParts);
	} else {
		// Pour peu de parties, l'algorithme new avec binary search est plus efficace
		return calcDistribution(map, tParts);
	}
}

// Fonction utilitaire pour convertir les données de MapParserService vers Beatmap
export function createBeatmapFromHitObjects(hitObjects: HitObject[]): Beatmap {
	return {
		hitObjects: hitObjects.sort((a, b) => a.startTime - b.startTime),
	};
}
