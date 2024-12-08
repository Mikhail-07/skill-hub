"use client"

import { SetModal } from '@/types'
import Link from 'next/link'
import Image from 'next/image';
import React, { FC, useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const FadingCover: FC<SetModal> = ({ setIsFormModalOpen }) => {

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const shrinkFactor = Math.max(0, 1 - scrollY / 5000);
  const opacityFactor = Math.max(0, 1 - scrollY / 2000);

  return (
    <div className="h-screen-lvh py-4 mb-14 relative">
      <div className="fixed z-10 max-w-7xl mx-auto h-full inset-x-0 px-4 " style={{ transform: `scale(${shrinkFactor})`, opacity: opacityFactor }}>
        <div className="flex flex-col h-full md:flex-row md:items-center justify-between rounded-3xl mb-6 relative">
          <div className="mb-2 md:mb-0 relative md:w-1/2 w-full h-full md:order-2 overflow-hidden">
            <div className="relative w-full h-full">
              <Image
                src="/hero.webp"
                alt="Vertical Photo"
                layout="fill"
                className="rounded-3xl object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
          <div className="w-full flex flex-col justify-center md:w-1/2 space-y-4 md:mb-0 md:order-1 md:static absolute h-full  p-4">
            <div className="text-4xl md:text-6xl font-bold space-y-2">
              <p>Анна</p>
              <p>Царева</p>
            </div>
            <p className="text-lg">Сертифицированный коуч ICF</p>
            <button
              className="text-center inline-block bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
              onClick={() => setIsFormModalOpen(true)}
            >
              Записаться на сессию
            </button>
            <Link href="/courses/2" passHref>
              <button className="text-center inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                Перейти на курс
              </button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-4 z-10 inset-x-0 flex justify-center">
          <div className="animate-bounce text-white">
            <FiChevronDown className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FadingCover