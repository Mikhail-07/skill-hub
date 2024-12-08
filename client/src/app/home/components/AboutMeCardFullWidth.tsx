import Link from 'next/link'
import React from 'react'
import Image from 'next/image';
import { RiLink } from 'react-icons/ri'

const AboutMeCardFullWidth = () => {
  return (
    <div className="flex  md:gap-10 md:flex-nowrap items-center flex-wrap">
      <div className="relative w-screen md:w-1/2 md:mx-0 h-96 -mx-4  mb-8 md:order-2">
      <Image
        src="/hero2.jpeg"
        alt="Vertical Photo 2"
        layout="fill" // Позволяет изображению заполнять весь контейнер
        className="absolute inset-0 object-cover rounded" // Сохранение стилей
      />
      </div>
      <div className="mb-8 md:w-1/2">
        <p className="mb-6">
          На протяжении 18 лет тренировала танцоров, выращивала из них лидеров, педагогов, чьи работы как сольных артистов, так и постановщиков вы видите на экранах федеральных каналов, кино, а также на различных шоу самых разных форматов.
        </p>
        <Link href="#achievements" className="flex items-center mb-6">
          <RiLink size={24} style={{ color: 'rgb(6, 182, 212)' }} className="mr-2 w-16"/>
          <span className=" text-cyan-500">
          Мои личные достижения, победы и подробную мою работу вы можете прочесть тут.
          </span>
        </Link>
        
        <p className="mb-6">
          Я знаю все о вопросах реализации потенциала, достижениях своих целей и улучшении качества своей жизни и через коучинг помогаю другим людям в работе над собой.
        </p>
      </div>
    </div>
  )
}

export default AboutMeCardFullWidth