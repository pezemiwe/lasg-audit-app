import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "rectangular" | "circular" | "text";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  ...props
}) => {
  const baseClasses = "animate-pulse bg-slate-200 rounded";

  const variantClasses = {
    rectangular: "w-full h-full",
    circular: "rounded-full w-full h-full",
    text: "w-full h-4 rounded-md",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
