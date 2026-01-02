// components/ui/input/Input.tsx
import { InputHTMLAttributes, forwardRef, useId } from "react";
import { cn } from "@/lib/utils"; // se você tiver cn, use. Senão, substitua por concatenação

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;          // Label opcional
  error?: string;          // Mensagem de erro opcional
  containerClassName?: string; // Classe extra pro container
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      label,
      error,
      id: providedId,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = providedId || generatedId;

    return (
      <div className={cn("space-y-1", containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          {...props}
          className={cn(
            "appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 placeholder-gray-500 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm dark:bg-gray-800 transition",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            className
          )}
        />

        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;