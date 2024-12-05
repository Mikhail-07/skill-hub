import MyFileUpload from '@/components/MyFileUpload';
import MyInput from '@/components/MyInput';
import { Lesson } from '@/types';
import React, { FC } from 'react';

interface AccordionBodyProps {
  lesson: Lesson;
  onChange: (id: number, field: keyof Lesson, value: any) => void;
}

const AccordionBody: FC<AccordionBodyProps> = ({ lesson, onChange }) => {
  const handleFileUpload = (file: File | null) => {
    onChange(lesson.id, 'media', file);
  };

  return (
    <>
      <MyInput
        label="Название урока"
        value={lesson.title}
        onChange={(value) => onChange(lesson.id, 'title', value)}
        placeholder="Введите название урока"
        required
      />

      <MyInput
        label="Описание урока"
        value={lesson.description}
        onChange={(value) => onChange(lesson.id, 'description', value)}
        placeholder="Введите краткое описание урока"
        required
        type="textarea"
      />

      <MyInput
        label="Содержание урока"
        value={lesson.content}
        onChange={(value) => onChange(lesson.id, 'content', value)}
        placeholder="Введите основное содержание урока"
        type="textarea"
      />

      <MyFileUpload
        id={`lesson_${lesson.id}`}
        label="Медиафайл для урока (аудио или видео)"
        value={lesson.media}
        onChange={handleFileUpload}
        acceptedFormats="audio/*,video/*"
        recommendedFormat="MP3, WAV, MP4, AVI"
      />
    </>
  );
};

export default AccordionBody;
