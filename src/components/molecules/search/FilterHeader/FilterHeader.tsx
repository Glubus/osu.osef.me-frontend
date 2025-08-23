// src/components/molecules/FilterHeader.tsx
import type React from "react";
import { Filter, RotateCcw } from "lucide-react";
import Button from "../../../atom/Button/Button";
import Badge from "../../../atom/Badge/Badge";

type Props = {
	isExpanded: boolean;
	toggleExpanded: () => void;
	hasFilters: boolean;
	onReset: () => void;
	loading: boolean;
	filterCount: number;
};

const FilterHeader: React.FC<Props> = ({
	toggleExpanded,
	hasFilters,
	onReset,
	loading,
	filterCount,
}) => (
	<div className="flex items-center justify-between mb-4">
		<Button
			onClick={toggleExpanded}
			variant="outline"
			size="sm"
			className="gap-2"
		>
			<Filter className="w-4 h-4" />
			Filtres avancés
			{hasFilters && <Badge color="badge-primary">{filterCount}</Badge>}
		</Button>

		{hasFilters && (
			<Button
				onClick={onReset}
				variant="outline"
				size="sm"
				className="gap-2"
				disabled={loading}
			>
				<RotateCcw className="w-4 h-4" />
				Réinitialiser
			</Button>
		)}
	</div>
);

export default FilterHeader;
