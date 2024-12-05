import React, { FC } from 'react';

interface MyInputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'textarea';
  className?: string;
  required?: boolean;
  hint?: string;
}

const MyInput: FC<MyInputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  required = false,
  hint = ''
}) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-2 text-sm font-medium text-white">
        {label}
        {required && <span className="text-red-400"> *</span>}
        <p className="text-xs text-gray-500 mb-1">
        {hint && <span>{hint}</span>}
        </p>
      </label>

      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
    </div>
  );
};

export default MyInput;
