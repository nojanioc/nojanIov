import React from "react";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-8 h-4",
    md: "w-12 h-6",
    lg: "w-16 h-8",
  };

  const thumbSizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
  };

  const thumbPositionClasses = {
    sm: checked ? "translate-x-4" : "translate-x-0.5",
    md: checked ? "translate-x-6" : "translate-x-0.5",
    lg: checked ? "translate-x-8" : "translate-x-0.5",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={`
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
        ${sizeClasses[size]}
        ${checked ? "bg-orange-500" : "bg-gray-300 dark:bg-gray-600"}
        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:shadow-md"
        }
        ${className}
      `}
    >
      <span
        className={`
          inline-block rounded-full bg-white shadow-lg transform transition-transform duration-200 ease-in-out
          ${thumbSizeClasses[size]}
          ${thumbPositionClasses[size]}
        `}
      />
    </button>
  );
};

export default Switch;
