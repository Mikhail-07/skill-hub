"use client";

import { useEffect, useState } from "react";

const OffcanvasMenu = ({ isOpen, onClose, children }) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    setVisible(isOpen);
  }, [isOpen]);

  return (
    <div
      className={`fixed top-0 right-0 w-64 h-full bg-gray-900 text-white shadow-lg transform ${
        visible ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default OffcanvasMenu;
