import React, { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "destructive" | "secondary" | "outline" | "ghost" | "link"; // Adicionei mais opções comuns
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  className = "",
  disabled = false,
  asChild = false,
  ...props
}) => {
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-md",
    md: "px-5 py-3 text-base rounded-md",
    lg: "px-8 py-4 text-lg rounded-lg",
    icon: "p-2 rounded-full",
  };

  // Variantes atualizadas (incluindo destructive)
  const variantClasses: Record<ButtonVariant, string> = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white",
    destructive:
      "bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white", // ← Novo variant "destructive"
    secondary:
      "bg-gray-200 hover:bg-gray-300 focus:ring-gray-400 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white",
    outline:
      "bg-transparent border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-300",
    ghost: "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100",
    link: "text-indigo-600 underline-offset-4 hover:underline",
  };

  // Suporte a asChild (ex: como <a> ou <div>)
  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      className={`
        inline-flex items-center justify-center font-medium gap-2 
        transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        ${sizeClasses[size]} 
        ${variantClasses[variant]} 
        ${className}
      `}
      disabled={disabled && !asChild}
      {...props}
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </Comp>
  );
};

export default Button;