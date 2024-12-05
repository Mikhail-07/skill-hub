"use client";

import React, { FC, ReactNode, useEffect, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

interface FadingCoverWrapperProps {
  children: ReactNode; // Дочерние компоненты
}

const FadingCoverWrapper: FC<FadingCoverWrapperProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const shrinkFactor = Math.max(0, 1 - scrollY / 5000);
  const opacityFactor = Math.max(0, 1 - scrollY / 2000);

  return (
    <div className="h-screen-lvh py-4 mb-14 relative">
      <div
        className="fixed z-10 max-w-7xl mx-auto h-full inset-x-0 px-4"
        style={{ transform: `scale(${shrinkFactor})`, opacity: opacityFactor }}
      >
        <div className="flex flex-col h-full md:flex-row md:items-center justify-between rounded-3xl mb-6 relative">
          {children}
        </div>
        <div className="absolute bottom-4 z-10 inset-x-0 flex justify-center">
          <div className="animate-bounce text-white">
            <FiChevronDown className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FadingCoverWrapper;
