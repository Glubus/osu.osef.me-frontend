import type React from "react";
import "./Badge.module.css";

type BadgeProps = {
	children: React.ReactNode;
	color: string;
};

const Badge: React.FC<BadgeProps> = ({ children, color }) => (
	<div className={`badge badge-outline ${color}`}>{children}</div>
);

export default Badge;
