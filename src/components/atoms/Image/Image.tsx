import React from "react";
import type { ImageProps } from "@/types/atoms/Image";

export const Image: React.FC<ImageProps> = ({ src, alt, className }) => (
	<img
		src={src}
		alt={alt}
		className={`w-full h-full object-cover ${className || ""}`}
	/>
);
