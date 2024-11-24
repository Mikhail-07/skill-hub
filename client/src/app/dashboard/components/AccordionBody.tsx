import React, { FC } from 'react';

interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  audio: File | null;
}

interface AccordionBodyProps {
  lesson: Lesson;
  onChange: (id: number, field: keyof Lesson, value: any) => void;
}

const AccordionBody: FC<AccordionBodyProps> = ({ lesson, onChange }) => (
  <div className="p-4">
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Название урока</label>
      <input
        type="text"
        value={lesson.title}
        onChange={(e) => onChange(lesson.id, 'title', e.target.value)}
        className="w-full p-2 mt-2 border border-gray-300 rounded"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Описание урока</label>
      <textarea
        value={lesson.description}
        onChange={(e) => onChange(lesson.id, 'description', e.target.value)}
        className="w-full p-2 mt-2 border border-gray-300 rounded"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Содержание урока</label>
      <textarea
        value={lesson.content}
        onChange={(e) => onChange(lesson.id, 'content', e.target.value)}
        className="w-full p-2 mt-2 border border-gray-300 rounded"
      />
    </div>

    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">Аудио для урока</label>
      <input
        type="file"
        onChange={(e) => onChange(lesson.id, 'audio', e.target.files?.[0] || null)}
        className="w-full p-2 mt-2 border border-gray-300 rounded"
      />
    </div>
  </div>
);

export default AccordionBody;
