import Link from 'next/link'
import React from 'react'
import { FaTelegramPlane } from 'react-icons/fa'
import { FaInstagram, FaTiktok } from 'react-icons/fa6'
import Header from '../../../components/Header'
import SocialButton from '../../../components/SocialButton'
import Card from '../../../components/Card'

const TelegramCard = () => {
  return (
    <Card>
      <div className="flex flex-wrap md:flex-nowrap justify-center lg:justify-start gap-5">
        <div className="h-full flex items-center justify-center w-full md:w-1/3">
          <div className="w-full max-w-52 max-h-full aspect-square rounded-full overflow-hidden">
            <img
              src='/avatar.jpg'
              alt="Avatar"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col justify-between w-full gap-5 ">
          <div className="">
            <Header>Мой блог в Telegram</Header>
            <div>
              <p>В нем я делюсь тем, что не публикуется в других медиа</p>
              <p>Много интересного про коучинг, психологию и отношения</p>
            </div>
          </div>
          <div className="flex gap-5 justify-center md:justify-between flex-wrap md:flex-nowrap  ">
            <div className="flex gap-4 justify-between self-center">
              <SocialButton 
                url="https://t.me/AnnaTsareva1" 
                icon={ <FaTelegramPlane size={24}/> }
              />
              <SocialButton 
                url="https://www.instagram.com/annatsareva1"
                icon={ <FaInstagram size={24}/> }
              />
              <SocialButton 
                url="#"
                icon={ <FaTiktok size={24}/> }
              />
            </div>
            <Link href="https://t.me/annatsareva" className="inline-block w-full md:w-30 text-center bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition">
              + Подписаться
            </Link>
          </div>
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <Link href="https://t.me/annatsareva" passHref>
            <img
              className="w-full max-w-52 object-contain"
              src='/qrCode.svg'
              alt="QR Code"
            />
          </Link>
        </div>
      </div>
    </Card>
  )
}

export default TelegramCard