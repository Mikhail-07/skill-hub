import { accordionItems } from '@/app/home/db'
import React from 'react'
import Accordion from '../../../components/Accordion'
import AccordionItem from '../../../components/AccordionItem'

const FaqSection = () => {
  return (
    <Accordion>
      {accordionItems.map(({title, content}) =>
        <AccordionItem key={title} title={title}>
          <p>{content}</p>
        </AccordionItem>
      )}
    </Accordion>
  )
}

export default FaqSection