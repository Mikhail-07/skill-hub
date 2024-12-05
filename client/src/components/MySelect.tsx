import React, { FC } from 'react';
import { SlTrash } from 'react-icons/sl';

interface MySelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const MySelect: FC<MySelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = '',
  className = '',
  required = false
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-2 text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400"> *</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MySelect;
