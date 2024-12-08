import React, { FC } from 'react';
import { FaUpload } from 'react-icons/fa';

interface MyFileUploadProps {
  id: string;
  label: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  acceptedFormats: string;
  recommendedFormat?: string;
}

const MyFileUpload: FC<MyFileUploadProps> = ({
  id,
  label,
  value,
  onChange,
  acceptedFormats,
  recommendedFormat = 'вертикальный формат',
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    onChange(file);
  };

  return (
    <div className="flex flex-col mb-4">
      <label className="mb-2 text-sm font-medium text-white">
        {label}
      </label>

      {/* File upload button */}
      <div className="flex items-center">
        <label
          htmlFor={id}
          className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
        >
          <FaUpload className="mr-2" />
          Загрузить файл
        </label>
        <input
          id={id}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Recommendation */}
      <p className="text-xs text-gray-500 mt-1">
        {recommendedFormat && <span>{`Рекомендуемый формат: ${recommendedFormat}`}</span>}
      </p>

      {/* File preview (if any) */}
      {value && (
        <div className="mt-2">
          {value.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(value)}
              alt="Preview"
              className="w-24 h-24 object-cover border border-gray-300 rounded-md"
            />
          ) : (
            <span className="text-sm text-gray-700">{value.name}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MyFileUpload;
