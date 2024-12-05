import React from "react";
import { FiChevronDown } from "react-icons/fi";

const ArrowIndicator: React.FC = () => {
  return (
    <div className="absolute bottom-4 z-10 inset-x-0 flex justify-center">
      <div className="animate-bounce text-white">
        <FiChevronDown className="h-8 w-8" />
      </div>
    </div>
  );
};

export default ArrowIndicator;
