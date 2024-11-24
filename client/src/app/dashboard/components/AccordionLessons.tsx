import React, { FC } from 'react';
import Accordion from '@/components/Accordion';
import AccordionItem from '@/components/AccordionItem';
import AccordionHeader from '@/components/AccordionHeader';
import AccordionBody from '@/components/AccordionBody';

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  audio: File | null;
}

interface AccordionLessonsProps {
  lessons: Lesson[];
  setLessons: (lessons: Lesson[]) => void;
  addLesson: () => void;
  removeLesson: (id: number) => void;
}

const AccordionLessons: FC<AccordionLessonsProps> = ({ lessons, setLessons, addLesson, removeLesson }) => {
  const onChangeLesson = (id: number, field: keyof Lesson, value: any) => {
    setLessons(lessons.map(lesson => lesson.id === id ? { ...lesson, [field]: value } : lesson));
  };

  return (
    <Accordion>
      {lessons.map((lesson, index) => (
        <AccordionItem key={lesson.id}>
          <AccordionHeader
            id={lesson.id}
            lessonNumber={index + 1}
            onRemove={removeLesson}
            isRemovable={lessons.length > 1}
          />
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
