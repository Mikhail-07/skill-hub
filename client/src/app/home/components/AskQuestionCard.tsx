import React from 'react'
import Card from '../../../components/Card'
import Link from 'next/link'
import Header from '../../../components/Header'

const AskQuestionCard = () => {
  return (
    <Card>
      <div className="flex items-center gap-5">
        <Header>Остались вопросы?</Header>
        <Link 
          href="https://t.me/AnnaTsareva1" 
          passHref 
          className="inline-block bg-transparent border border-gray-400  text-white px-6 py-3 rounded-lg hover:bg-gray-500 transition"
        >
          Спросить
        </Link>
      </div>
    </Card>
  )
}

export default AskQuestionCard