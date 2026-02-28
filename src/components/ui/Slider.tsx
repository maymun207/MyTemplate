"use client";

import { InputHTMLAttributes } from "react";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  displayValue?: string;
}

export default function Slider({ label, displayValue, className = "", ...props }: SliderProps) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm text-gray-300">{label}</label>
          {displayValue && <span className="text-sm font-medium text-accent">{displayValue}</span>}
        </div>
      )}
      <input
        type="range"
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-secondary"
        {...props}
      />
    </div>
  );
}
