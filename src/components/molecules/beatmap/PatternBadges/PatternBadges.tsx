import type React from "react";
import Badge from "../../../atom/Badge/Badge";

type Props = {
	mainPattern: string;
};

const getPatternColor = (pattern: string): string => {
	switch (pattern.toLowerCase()) {
		case "stream":
			return "badge-info";
		case "jumpstream":
			return "badge-primary";
		case "handstream":
			return "badge-secondary";
		case "stamina":
			return "badge-warning";
		case "jackspeed":
			return "badge-error";
		case "chordjack":
			return "badge-accent";
		case "technical":
			return "badge-success";
		default:
			return "badge-outline";
	}
};

const PatternBadges: React.FC<Props> = ({ mainPattern }) => {
	// Parse the main_pattern JSON string
	let patterns: string[] = [];
	
	try {
		// Handle both string and parsed array formats
		if (typeof mainPattern === 'string') {
			patterns = JSON.parse(mainPattern);
		} else if (Array.isArray(mainPattern)) {
			patterns = mainPattern;
		}
	} catch (error) {
		console.warn('Failed to parse main_pattern:', mainPattern);
		return null;
	}

	if (!patterns || patterns.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-1">
			{patterns.map((pattern, index) => (
				<Badge 
					key={`${pattern}-${index}`} 
					color={getPatternColor(pattern)}
				>
					{pattern.charAt(0).toUpperCase() + pattern.slice(1)}
				</Badge>
			))}
		</div>
	);
};

export default PatternBadges;
