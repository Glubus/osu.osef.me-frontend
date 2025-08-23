import React, { forwardRef } from "react";

interface CanvasContainerProps {
  children?: React.ReactNode;
  className?: string;
}

const CanvasContainer = forwardRef<HTMLDivElement, CanvasContainerProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={className || "flex-grow bg-black rounded-b-lg"}
        style={{ width: "100%", height: "700px" }} // assure une taille
      >
        {children}
      </div>
    );
  }
);

export default CanvasContainer;
