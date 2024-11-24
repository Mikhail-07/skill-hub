'use client'

import React, { useState, ChangeEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from "@/store/MobXProvider";
import { Course } from '@/types'
import { createCourse, fetchCourses } from '@/api/coursesAPI';
import ModalWindow from '@/components/ModalWindow';
import Accordion from '@/components/Accordion';
import AccordionItem from '@/components/AccordionItem';
import AccordionLessons from './AccordionLessons';

const CourseForm: React.FC<{ handleClose: () => void }> = observer(({ handleClose }) => {
  const { course } = useStores();
  
  const [courseData, setCourseData] = useState<Course>({
    title: '',
    subTitle: '',
    description: '',
    img: null,
    price: ''
  });

  const [lessons, setLessons] = useState([
    { id: 0, title: '', description: '', content: '', audio: null }
  ]);

  const create = async () => {
    const formData = new FormData();
    Object.entries(courseData).forEach(([key, value]) => formData.append(key, value as string));
    
    lessons.forEach((lesson, idx) => {
      formData.append(`lesson_${idx + 1}`, lesson.audio as File);
      delete lesson.audio;
    });

    formData.append('lessons', JSON.stringify(lessons));
    createCourse(formData)
      .then(() => fetchCourses()
      .then(data => course.setCourses(data)))
    handleClose();
  };

  const addLesson = () => {
    setLessons(prev => [...prev, { id: prev.length + 1, title: '', description: '', content: '', audio: null }]);
  };

  const removeLesson = (id: number) => {
    setLessons(prev => prev.filter(lesson => lesson.id !== id));
  };

  return (
    <ModalWindow isOpen={true} onClose={handleClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Создание курса</h2>
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Название курса
          </label>
          <input
            id="title"
            type="text"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
            placeholder="Введите название курса"
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700">
            Краткое описание
          </label>
          <input
            id="subTitle"
            type="text"
            value={courseData.subTitle}
            onChange={(e) => setCourseData({ ...courseData, subTitle: e.target.value })}
            placeholder="Введите краткое описание"
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Описание
          </label>
          <textarea
            id="description"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
            placeholder="Введите подробное описание"
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Цена
          </label>
          <input
            id="price"
            type="text"
            value={courseData.price}
            onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
            placeholder="Введите цену"
            className="w-full p-2 mt-2 border border-gray-300 rounded"
          />
        </div>

        <AccordionLessons lessons={lessons} addLesson={addLesson} removeLesson={removeLesson} setLessons={setLessons}/>

        <div className="flex justify-end mt-4">
          <button
            onClick={create}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Создать курс
          </button>
        </div>
      </div>
    </ModalWindow>
  );
});

export default CourseForm;
