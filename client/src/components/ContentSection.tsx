import React, { FC, ReactNode } from "react";

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  bonusText?: string;
  buttons: ReactNode;
}

const ContentSection: FC<ContentSectionProps> = ({
  title,
  subtitle,
  description,
  bonusText,
  buttons,
}) => {
  return (
    <div className="w-full flex flex-col md:justify-center justify-end md:w-1/2 space-y-10 pb-20 md:mb-0 md:order-1 md:static absolute h-full p-4">
      <div>
        {subtitle && <p className="text-lg mb-2">{subtitle}</p>}
        <div className="text-4xl md:text-6xl font-bold">
          <p>{title}</p>
        </div>
      </div>
      {description && <p className="mb-6 text-lg">{description}</p>}
      {bonusText && <p className="mt-8 text-lg font-bold">{bonusText}</p>}
      {buttons}
    </div>
  );
};

export default ContentSection;
