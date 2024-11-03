import React, { FC, ReactNode } from 'react'

interface HeaderProps{
  children: ReactNode,
  className?: string
}

const Header: FC<HeaderProps> = ({ children, className }) => {
  return (
    <h1 className={`text-white font-bold ${className ? className : null}`} >{children}</h1>
  )
}

export default Header