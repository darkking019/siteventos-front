// components/ui/alert/Alert.tsx
import Link from "next/link";
import React from "react";

interface AlertProps {
  variant?: "success" | "destructive" | "warning" | "info"; // removido "error", adicionado "destructive"
  title?: string;
  children: React.ReactNode;
  showLink?: boolean;
  linkHref?: string;
  linkText?: string;
  className?: string;
  onClose?: () => void;
}

// Alert principal
const Alert: React.FC<AlertProps> = ({
  variant = "info",
  title,
  children,
  showLink = false,
  linkHref = "#",
  linkText = "Saiba mais",
  className = "",
  onClose,
}) => {
  const variantClasses = {
    success: {
      container: "border-green-500/30 bg-green-50/80 dark:bg-green-950/30 dark:border-green-500/20",
      icon: "text-green-600 dark:text-green-400",
      text: "text-green-900 dark:text-green-100",
      title: "text-green-800 dark:text-green-200",
    },
    destructive: {  // Agora "destructive" (padrão shadcn/ui para erros)
      container: "border-red-500/30 bg-red-50/80 dark:bg-red-950/30 dark:border-red-500/20",
      icon: "text-red-600 dark:text-red-400",
      text: "text-red-900 dark:text-red-100",
      title: "text-red-800 dark:text-red-200",
    },
    warning: {
      container: "border-yellow-500/30 bg-yellow-50/80 dark:bg-yellow-950/30 dark:border-yellow-500/20",
      icon: "text-yellow-600 dark:text-yellow-400",
      text: "text-yellow-900 dark:text-yellow-100",
      title: "text-yellow-800 dark:text-yellow-200",
    },
    info: {
      container: "border-blue-500/30 bg-blue-50/80 dark:bg-blue-950/30 dark:border-blue-500/20",
      icon: "text-blue-600 dark:text-blue-400",
      text: "text-blue-900 dark:text-blue-100",
      title: "text-blue-800 dark:text-blue-200",
    },
  };

  const icons = {
    success: (
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
    destructive: (
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    warning: (
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2L1 21h22L12 2zm0 3.5L20.5 19H3.5L12 5.5zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
      </svg>
    ),
    info: (
      <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        relative rounded-xl border p-4 
        ${variantClasses[variant].container} 
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${variantClasses[variant].icon}`}>
          {icons[variant]}
        </div>

        <div className="flex-1">
          {title && (
            <h4
              className={`mb-1 text-base font-semibold ${variantClasses[variant].title}`}
            >
              {title}
            </h4>
          )}

          <div className={`text-sm ${variantClasses[variant].text}`}>
            {children}
          </div>

          {showLink && (
            <Link
              href={linkHref}
              className={`mt-3 inline-block text-sm font-medium underline ${variantClasses[variant].text} hover:opacity-80`}
            >
              {linkText}
            </Link>
          )}
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Fechar alerta"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

// Subcomponentes
const AlertTitle = ({ className = "", ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h5 className={`mb-1 font-semibold text-base ${className}`} {...props} />
);

const AlertDescription = ({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`text-sm ${className}`} {...props} />
);

export { Alert, AlertTitle, AlertDescription };