"use client"
import React, { FC, ReactNode, useState } from 'react'
import { MdExpandMore } from 'react-icons/md';

interface AccordionItemProps {
  title?: ReactNode;
  children: ReactNode;
}

const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b mb-4 border-gray-200">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleAccordion}
      >
        {title}
        <MdExpandMore
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>
      <div className={`transition-max-height duration-200 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        {children}
      </div>
    </div>
  );
};

export default AccordionItem;