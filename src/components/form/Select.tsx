import React from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.HTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: Option[];
  placeholder?: string;
  onValueChange?: (value: string) => void;
  value?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onValueChange,
  className = "",
  // Capturamos 'value' y 'defaultValue' del '...rest'
  value: controlledValue,
  defaultValue,
  // Capturamos el resto de props (id, name, required, disabled, etc.)
  ...rest
}) => {
  // Manage the selected value
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onValueChange) {
      onValueChange(e.target.value); // Pasamos solo el string, como espera tu ProductModal
    }
  };

  // 5. Determinamos el valor. Si nos pasan 'value', es un componente controlado.
  //    Si no, usamos 'defaultValue' (para que funcione como 'uncontrolled' si es necesario).
  const currentValue = controlledValue !== undefined ? controlledValue : defaultValue;

  return (
    <select
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${
        currentValue
          ? "text-gray-800 dark:text-white/90"
          : "text-gray-400 dark:text-gray-400"
      } ${className}`}
      value={currentValue}
      onChange={handleChange}
      {...rest} // <-- ¡Esto añade id, name, required, disabled, etc.!
    >
      {/* Placeholder option */}
      {!currentValue && (
        <option
          value=""
          disabled
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {placeholder}
        </option>
      )}
      {/* Map over options */}
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="text-gray-700 dark:bg-gray-900 dark:text-gray-400"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
