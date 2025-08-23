// src/components/atoms/Select.tsx
import type React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
	label?: string;
	options: { value: string; label: string }[];
	defaultOptionLabel?: string;
};

const Select: React.FC<SelectProps> = ({
	label,
	options,
	defaultOptionLabel = "Sélectionner",
	...props
}) => (
	<div className="form-control w-full">
		{label && (
			<label className="label">
				<span className="label-text font-medium">{label}</span>
			</label>
		)}
		<select className="select select-bordered select-sm w-full" {...props}>
			<option value="">{defaultOptionLabel}</option>
			{options.map((opt) => (
				<option key={opt.value} value={opt.value}>
					{opt.label}
				</option>
			))}
		</select>
	</div>
);

export default Select;
