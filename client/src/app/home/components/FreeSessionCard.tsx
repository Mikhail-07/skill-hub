import React from 'react'
import Card from '../../../components/Card'

const FreeSessionCard = ({ setIsFormModalOpen }) => {
  return (
    <Card header="Бесплатная установочная сессия">
      <div>
        <p className="pb-2">
          Для новых клиентов я провожу бесплатную установочную сессию, на которой мы с Вами знакомимся, я рассказываю о принципах коучинга, о формате работы, отвечаю на все Ваши вопросы и помогаю Вам определить ваш запрос. И только после знакомства и установочной сессии мы записываемся на рабочую сессию.
        </p>
        <p className="pb-2">
          Длительность установочной сессии 30 минут.
        </p>
      </div>
      <button 
        onClick={() => setIsFormModalOpen(true)} 
        className="inline-block text-center bg-transparent border border-gray-400 text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
        >
        Записаться на установочную сессию
      </button>
    </Card>
  )
}

export default FreeSessionCard