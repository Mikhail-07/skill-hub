import React, { FC, ReactNode } from 'react';

interface CardProps {
  header?: string;
  mode?: 'light' | 'dark' | 'transparent'; // Добавлен 'transparent'
  badge?: boolean;
  className?: string;
  children: ReactNode;
}

const Card: FC<CardProps> = ({ header, children, mode = 'dark', badge, className }) => {
  const modeClasses = {
    light: 'bg-gray-300 text-gray-800',
    dark: 'bg-gray-800 text-gray-200',
    transparent: 'bg-transparent border-2 border-gray-300 text-gray-800', // Прозрачный режим
  };

  const headerTextClasses = {
    light: 'text-gray-800 border-gray-400',
    dark: 'text-gray-400 border-gray-600',
    transparent: 'text-gray-400 border-gray-600', // Прозрачный режим
  };

  return (
    <div
      className={`rounded-3xl p-6 mb-10 relative overflow-hidden min-w-72 shadow-lg ${
        modeClasses[mode]
      } ${className ? className : ''}`}
    >
      {header ? (
        <div className={`${headerTextClasses[mode]} pb-6`}>
          <h1 className="border-b-2 font-bold pb-4">{header}</h1>
        </div>
      ) : null}
      <div className="h-full">{children}</div>
      {badge ? (
        <div className="w-32 h-8 absolute top-4 -right-8 text-xs">
          <div className="h-full w-full bg-red-500 text-white text-center leading-8 font-semibold transform rotate-45">
            Популярно
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Card;
