"use client";

import React, { FC } from "react";

// Типы кнопок
type MyButtonVariant = "primary" | "secondary";

interface MyButtonProps {
  variant?: MyButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
}

const MyButton: FC<MyButtonProps> = ({ variant = "primary", children, onClick }) => {
  const buttonClasses = variant === "primary"
    ? "text-center inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
    : "text-center inline-block bg-transparent border-2 border-gray-500 text-gray-500 px-6 py-3 rounded-lg hover:bg-gray-100 hover:text-gray-700 transition";

  return (
    <button className={buttonClasses} onClick={onClick}>
      {children}
    </button>
  );
};

export default MyButton;
