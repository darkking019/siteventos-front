// components/ui/textarea/Textarea.tsx
import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils"; // ou concatene classes manualmente

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      containerClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-1", containerClassName)}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          {...props}
          className={cn(
            "w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 text-gray-900 dark:text-white resize-y min-h-[100px]",
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

Textarea.displayName = "Textarea";

export default Textarea;