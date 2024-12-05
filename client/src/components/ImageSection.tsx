import React, { FC } from "react";

interface ImageSectionProps {
  imageSrc?: string;
}

const ImageSection: FC<ImageSectionProps> = ({ imageSrc }) => {
  return (
    <div className="mb-2 md:mb-0 relative md:w-1/2 w-full h-full md:order-2 overflow-hidden">
      <img
        src={imageSrc}
        alt="Vertical Photo"
        className="rounded-3xl object-cover w-full h-full"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
    </div>
  );
};

export default ImageSection;
