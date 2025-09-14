import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

interface TimeSelectorProps {
  times: string[];
  value?: string;
  onTimeChange: (time: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({
  times,
  value,
  onTimeChange,
  disabled = false,
  className = "",
  placeholder = "انتخاب زمان",
}) => {
  const handleTimeSelect = (option: { value: string; label: string }) => {
    onTimeChange(option.value);
  };

  // Convert times array to dropdown options format
  const options = times.map((time) => ({
    value: time,
    label: time,
  }));

  return (
    <div dir="ltr" className={`relative ${className}`}>
      <button className="bg-white/20 placeholder:text-white text-white rounded-lg py-2 text-center w-full">
        تغییر زمان پخت
      </button>
      <div className="absolute left-0 top-0 right-0 bottom-0 z-50">
        <Dropdown
          options={options}
          onChange={handleTimeSelect}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          className="time-selector-dropdown "
          controlClassName={`
          w-full text-right bg-white/20 text-white rounded-lg
          border border-white/30 focus:outline-none focus:ring-2 focus:ring-orange-500
          transition-all duration-200 flex items-center justify-between opacity-0 
          ${
            disabled
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-white/30 cursor-pointer"
          }
        `}
          menuClassName="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/30 z-50 max-h-48 overflow-y-auto"
          arrowClassName="w-4 h-4 transition-transform duration-200"
          optionsClassName="text-right"
        />
      </div>
    </div>
  );
};

export default TimeSelector;
