import type React from "react";
import "./Image.module.css";

type ImageProps = {
	src: string;
	alt: string;
	className?: string;
};

const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
	<img
		src={src}
		alt={alt}
		className={`w-full h-full object-cover ${className || ""}`}
	/>
);

export default Image;
