import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "outline"
    | "ghost"
    | "hero-gold"
    | "hero-outline"
    | "cta";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className = "",
  children,
  ...props
}) => {
  let initialClass = "btn-nav";

  switch (variant) {
    case "primary":
      initialClass = "btn-nav btn-primary";
      break;
    case "hero-gold":
      initialClass = "btn-hero btn-hero-gold";
      break;
    case "hero-outline":
      initialClass = "btn-hero btn-hero-outline";
      break;
    case "cta":
      initialClass = "btn-cta";
      break;
    case "ghost":
      initialClass = "btn-cta-ghost";
      break;
    default:
      break;
  }

  return (
    <button className={`${initialClass} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
