import React, { FC, ReactNode, useEffect } from 'react'

interface CardProps {
  header?: string,
  mode?: string,
  badge?: boolean,
  className?: string,
  children: ReactNode
}

const Card: FC<CardProps> = ({header, children, mode, badge, className}) => {
  return (
    <div className={`rounded-3xl p-6 mb-10 relative overflow-hidden min-w-72 shadow-lg ${mode === 'light' ? 'bg-gray-300 text-bg-gray-800' : 'bg-gray-800'} ${className ? className : null}`}>
      {header ?
        <div className='pb-2'>
          <h1 className='border-b-2 border-gray-400 font-bold pb-2'>{header}</h1>
        </div>
        : null
      }
      <div className={`${mode === 'ligth' ? null : 'text-gray-400'} h-full`}>
        {children}
      </div>
      {badge ? 
        <div className="w-32 h-8 absolute top-4 -right-8 text-xs">
            <div className="h-full w-full bg-red-500 text-white text-center leading-8 font-semibold transform rotate-45">
              Популярно
            </div>
        </div> 
        : null
      }
    </div>
  )
}

export default Card