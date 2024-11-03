// components/ModalWindow.tsx
import React, { FC, ReactNode, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';

interface ModalWindowProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const ModalWindow: FC<ModalWindowProps> = ({ children, isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (modalRef.current) {
        const firstInput = modalRef.current.querySelector('input');
        if (firstInput) {
          (firstInput as HTMLElement).focus();
        }
      }
    }
  }, [isOpen]);

  const handleInnerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  if (isOpen) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      >
        <div
          ref={modalRef}
          onClick={handleInnerClick}
          className="relative max-w-4xl max-h-full p-4"
        >
          
          {children}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 m-4 text-white text-3xl font-bold"
          >
            <IoMdClose size={24} />
          </button>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default ModalWindow;
