import { priceLight } from '@/app/home/db'
import React from 'react'
import Card from '../../../components/Card'
import Header from '../../../components/Header'
import SimpleCell from '../../../components/SimpleCell'

const PriceSection = ({setIsFormModalOpen}) => {
  return (
    <div>
      <h1 className="text-4xl mb-3">Цены</h1>
      <Card>
        <SimpleCell
          before={<Header>Разовая сессия</Header>}
        >
          <Header className="text-2xl">5000 ₽</Header>
        </SimpleCell>
        <Header className="mb-4">Действует акция на покупку пакетов сессий</Header>
        <div className="flex flex-col md:flex-row md:gap-10 flex-wrap">
          {priceLight.map(({header, price, oldPrice}) => 
          <div
            key={header}
            className="flex gap-8 mb-6"
          >
            <Header>{header}</Header>
            <div className="flex flex-col gap-4">
              <div>
                <Header className="text-2xl">{price}</Header>
              </div>
              <div className="relative inline-block">
                <span className="text-lg font-semibold">
                  {oldPrice}
                </span>
                <span className="absolute inset-0 transform rotate-12 bg-gray-500 h-0.5 top-3"></span>
              </div>
            </div>
            
          </div> 
          )}
        </div>
        <p className="mb-2">‌Цены на пакеты действуют единоразовым платежом.</p>
        <p className="mb-2"> ‌Длительность сессии — 60 минут</p>
        <button 
          onClick={() => setIsFormModalOpen(true)} 
          className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
        >
          Записаться на сессию
        </button>
      </Card>
    </div>
  )
}

export default PriceSection