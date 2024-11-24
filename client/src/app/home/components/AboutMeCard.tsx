"use client"

import React, { useState } from 'react'
import { FaArrowTrendUp } from 'react-icons/fa6'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import { IoEarth } from 'react-icons/io5'
import { LiaHandsHelpingSolid } from 'react-icons/lia'
import { TbFileCertificate } from 'react-icons/tb'
import Card from '../../../components/Card'
import Header from '../../../components/Header'
import ModalWindow from '../../../components/ModalWindow'
import SimpleCell from '../../../components/SimpleCell'

const AboutMeCard = () => {

  const [isCertifyModalOpen, setIsCertifyModalOpen] = useState(false);

  return (
    <Card header="Обо мне">
      <SimpleCell
        before={<IoEarth size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
        header={<Header>Сертификат ICF</Header>}
      >
        <div>
          <p className="mb-4">Сертифицированный коуч ICF (Международная федерация коучей)</p>
          <div
            className="relative cursor-pointer w-24 h-full"
            onClick={() => setIsCertifyModalOpen(true)}
          >
            <img
              src='/certify.webp'
              alt="Thumbnail"
              className="w-full h-auto object-cover rounded"
            />
          </div>
        </div>
        <ModalWindow 
          onClose={() => setIsCertifyModalOpen(false)}
          isOpen={isCertifyModalOpen}
        >
          <div className="max-w-screen max-h-screen overflow-auto">
            <img
              src='/certify.webp'
              alt="Full-size image"
              className="w-auto h-auto object-contain rounded"
            />
          </div>
        </ModalWindow>
      </SimpleCell>
      <SimpleCell
        before={<TbFileCertificate size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
        header={<Header>Дипломированный коуч РФ</Header>}
      >
        Квалифицированный профессиональный коуч
      </SimpleCell>
      <SimpleCell
        before={<HiOutlineAcademicCap size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
        header={<Header>Окончила международную академию трансперсонального коучинга</Header>}
      >
        Владею классическим коучингом, коучингом ICF и трансперсональным коучингом
      </SimpleCell>
      <SimpleCell
        before={<FaArrowTrendUp  size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
        header={<Header>Повышаю квалификацию</Header>}
      >
        Курсы, семинары, проф. переподготовки
      </SimpleCell>
      <SimpleCell
        before={<LiaHandsHelpingSolid size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
        header={<Header>Регулярные супервизии и личная терапия</Header>}
      >
        Работаю на регулярной основе с супервизором и личным коучем
      </SimpleCell>
    </Card>
  )
}

export default AboutMeCard