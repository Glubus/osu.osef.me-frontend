import type React from "react";
import clsx from "clsx";

type ButtonVariant = "primary" | "outline";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	children: React.ReactNode;
	variant?: ButtonVariant;
	size?: "sm" | "md" | "lg";
	active?: boolean;
	joinItem?: boolean;
};

const Button: React.FC<ButtonProps> = ({
	children,
	variant = "outline",
	size = "sm",
	active = false,
	joinItem = false,
	className = "",
	...rest
}) => {
	const base = "btn";
	const variantClass = active ? "btn-primary" : `btn-${variant}`;
	const sizeClass = `btn-${size}`;
	const join = joinItem ? "join-item" : "";

	return (
		<button
			className={clsx(base, variantClass, sizeClass, join, className)}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
