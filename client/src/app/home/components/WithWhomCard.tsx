import { withWhom } from '@/app/home/db'
import React, { FC } from 'react'
import { MdDone } from 'react-icons/md'
import Card from '../../../components/Card'
import Header from '../../../components/Header'
import SimpleCell from '../../../components/SimpleCell'
import { SetModal } from '@/types'

const WithWhomCard: FC <SetModal> = ({ setIsFormModalOpen }) => {
  return (
    <Card header="С чем я работаю">
      {withWhom.map(({header, description}) => 
        <SimpleCell
          key={header}
          before={<MdDone size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
          header={<Header>{header}</Header>}
        >
          {description}
        </SimpleCell>
      )}
      <button 
        // href={waSession}
        onClick={() => setIsFormModalOpen(true)} 
        className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
      >
        Записаться на сессию
      </button>
    </Card>
  )
}

export default WithWhomCard