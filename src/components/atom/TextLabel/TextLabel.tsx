import type React from "react";

type Props = {
	children: React.ReactNode;
};

const TextLabel: React.FC<Props> = ({ children }) => (
	<span className="text-sm font-medium text-base-content/70">{children}</span>
);

export default TextLabel;
