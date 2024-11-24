import Link from 'next/link'
import React, { FC } from 'react'
import { MdDone } from 'react-icons/md'
import Card from '../../../components/Card'
import Header from '../../../components/Header'
import SimpleCell from '../../../components/SimpleCell'

interface PriceCardProps{
  header: string,
  price: string,
  oldPrice: string,
  description: string,
  badge: boolean, 
  includes: string[]

}

const PriceCard: FC<PriceCardProps> = ({header, price, oldPrice, description, badge, includes}) => {
  return (
    <Card 
      key={header}
      badge={badge}
      className="max-w-72"
    >
      <div className="flex flex-col justify-between h-full">
        <div>
          <SimpleCell
            header={<Header>{header}</Header>}
          >
            <div className="flex gap-4">
              <Header className="text-2xl">{price}</Header>
              <span className="align-text-bottom">{oldPrice}</span>
            </div>
            
            {description}
          </SimpleCell>
          {includes.map(des => 
            <SimpleCell
              key={des}
              mode="white"
              before={<MdDone size={24} style={{ color: 'rgb(156, 163, 175)' }} />}
            >
              {des}
            </SimpleCell>
          )}
        </div>
        <Link href="/signup" className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
          Выбрать
        </Link>
      </div>
    </Card>
  )
}

export default PriceCard