import React, { FC, ReactNode } from 'react'

interface SocialButtonProps {
  url: string,
  icon: ReactNode
}

const SocialButton: FC <SocialButtonProps> = ({ url, icon }) => {
  return (
    <a
      href={ url }
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-10 h-10 bg-gray-900 text-white rounded-full hover:bg-gray-500 transition-colors duration-200"
    >
      { icon }
    </a>
  )
}

export default SocialButton