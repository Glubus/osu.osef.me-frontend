import type React from "react";

type IconProps = {
	children: React.ReactNode;
	className?: string;
};

const Icon: React.FC<IconProps> = ({ children, className }) => (
	<svg
		className={`w-4 h-4 ${className || ""}`}
		fill="currentColor"
		viewBox="0 0 20 20"
	>
		{children}
	</svg>
);

export default Icon;
