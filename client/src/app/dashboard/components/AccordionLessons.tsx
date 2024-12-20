import React, { FC } from 'react';
import Accordion from '@/components/Accordion';
import AccordionItem from '@/components/AccordionItem';
import AccordionHeader from '@/app/dashboard/components/AccordionHeader';
import AccordionBody from '@/app/dashboard/components/AccordionBody';
import { Lesson, LessonData } from '@/types';

interface AccordionLessonsProps {
  lessons: LessonData[];
  setLessons: (lessons: LessonData[]) => void;
  addLesson: () => void;
  removeLesson: (id: number) => void;
}

const AccordionLessons: FC<AccordionLessonsProps> = ({ lessons, setLessons, addLesson, removeLesson }) => {
  const onChangeLesson = (id: number, field: keyof LessonData, value: any) => {
    setLessons(lessons.map(lesson => lesson.id === id ? { ...lesson, [field]: value } : lesson));
  };

  return (
    <Accordion>
      {lessons.map((lesson, index) => (
        <AccordionItem 
          key={lesson.id}
          title={
            <AccordionHeader
              id={lesson.id}
              lessonNumber={index + 1}
              onRemove={removeLesson}
              isRemovable={lessons.length > 1}
            />
          }
        >
          <AccordionBody lesson={lesson} onChange={onChangeLesson} />
        </AccordionItem>
      ))}
      <button onClick={addLesson} className="text-blue-500 mt-4">
        Добавить урок
      </button>
    </Accordion>
  );
};

export default AccordionLessons;
