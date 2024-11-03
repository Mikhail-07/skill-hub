import React, { FC, ReactNode } from 'react'

interface AccordionProps {
  children: ReactNode;
}

const Accordion: FC<AccordionProps> = ({ children }) => {
  return <div className="w-full mb-8">{children}</div>;
};

export default Accordion