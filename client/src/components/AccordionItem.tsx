"use client"
import React, { FC, ReactNode, useState } from 'react'
import { MdExpandMore } from 'react-icons/md';

interface AccordionItemProps {
  title?: string;
  children: ReactNode;
}

const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-gray-200">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={toggleAccordion}
      >
        <h3 className="font-semibold">{title}</h3>
        <MdExpandMore
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </div>
      <div className={`transition-max-height duration-200 overflow-hidden ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default AccordionItem;