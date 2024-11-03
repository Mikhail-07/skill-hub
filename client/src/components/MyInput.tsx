import React, { FC } from 'react';

interface MyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  required?: boolean;
}

const MyInput: FC<MyInputProps> = ({ label, value, onChange, placeholder = '', type = 'text', className = '', required = false }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      <label className="mb-2 text-sm font-medium text-white">
        {label}
        {required && <span className='text-red-400'> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
};

export default MyInput;
