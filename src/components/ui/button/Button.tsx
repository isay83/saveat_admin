import React, { ReactNode } from "react";

// --- MODIFICACIÓN AQUÍ ---
// Hacemos que ButtonProps herede todas las propiedades estándar de un <button>
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  // onClick?: () => void; // Click handler
  // disabled?: boolean; // Disabled state
  // className?: string; // Disabled state
  // Ya no necesitamos 'onClick', 'disabled', 'className' porque vienen heredadas
  // ¡Importante! Si queremos mantener un default para 'type', lo hacemos abajo.
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  // onClick,
  className = "",
  // disabled = false,
  // Capturamos las props heredadas, incluyendo 'type' y 'disabled'
  ...rest
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-4 py-3 text-sm",
    md: "px-5 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  // Verificamos si 'disabled' viene de las props heredadas
  const isDisabled = rest.disabled || false;

  return (
    <button
      className={`inline-flex items-center justify-center font-medium gap-2 rounded-lg transition ${className} ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${
        // Usamos isDisabled para aplicar los estilos de deshabilitado
        isDisabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      {...rest} // Esto pasará type, onClick, disabled, etc.
    >
      {startIcon && <span className="flex items-center">{startIcon}</span>}
      {children}
      {endIcon && <span className="flex items-center">{endIcon}</span>}
    </button>
  );
};

export default Button;
