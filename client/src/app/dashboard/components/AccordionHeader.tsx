import React, { FC } from 'react';
import { SlTrash } from 'react-icons/sl';

interface AccordionHeaderProps {
  id: number;
  lessonNumber: number;
  onRemove: (id: number) => void;
  isRemovable: boolean;
}

const AccordionHeader: FC<AccordionHeaderProps> = ({ id, lessonNumber, onRemove, isRemovable }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(id);
  };

  return (
    <div className="flex justify-between items-center w-full p-2">
      <span>Урок {lessonNumber}</span>
      {isRemovable && (
        <button onClick={handleDelete} className="text-red-500">
          <SlTrash/>
        </button>
      )}
    </div>
  );
};

export default AccordionHeader;
