import React from 'react';

interface GradientButtonProps {
  buttonText: string;
  buttonLink: string;
  className?: string;
  target?: '_blank' | '_self'; 
  rel?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  buttonText,
  buttonLink,
  className = '',
  target = '_blank',
  rel = 'noopener noreferrer',
}) => {
  return (
    <a
      href={buttonLink}
      className={`text-center inline-block bg-gradient-to-r from-[#9e0615] to-[#E55242] text-white font-semibold text-lg px-8 py-4 mb-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105 ${className}`}
      target={target}
      rel={rel}
    >
      {buttonText}
    </a>
  );
};

export default GradientButton;
