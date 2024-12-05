'use client'

import React, { useState, ChangeEvent, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from "@/store/MobXProvider";
import { Course } from '@/types'
import { createCourse, fetchCourses } from '@/api/coursesAPI';
import ModalWindow from '@/components/ModalWindow';
import AccordionLessons from './AccordionLessons';
import { FaUpload } from 'react-icons/fa';
import MyInput from '@/components/MyInput';
import MySelect from '@/components/MySelect';
import MyFileUpload from '@/components/MyFileUpload';
import { useCourseForm } from '@/hooks/useCourseForm';
import { prepareFormData } from '@/utils/formDataUtils';
import Card from '@/components/Card';
import Header from '@/components/Header';
import { SlTrash } from 'react-icons/sl';

let uniqId = 0

const CourseForm: React.FC<{ onClose: () => void, isOpen: boolean }> = observer(({ onClose, isOpen }) => {
  
  const { course } = useStores();
  const { courseData, setCourseData, lessons, setLessons, isFormValid } = useCourseForm();

  const create = async () => {
    try {
      const formData = prepareFormData(courseData, lessons);
  
      await createCourse(formData);
      const updatedCourses = await fetchCourses();
      course.setCourses(updatedCourses);
  
      onClose();
    } catch (error) {
      console.error('Ошибка при создании курса:', error);
      alert('Произошла ошибка при создании курса.');
    }
  };

  const addLesson = () => {
    uniqId = uniqId + 1
    setLessons([
      ...lessons,
      {
        id: uniqId,
        number: null,
        title: '',
        description: '',
        content: '',
        media: null,
      },
    ])
  }

  const addBlock = () => {
    uniqId = uniqId + 1
    const newBlock = {
      id: uniqId,
      title: '',
      content: '',
    };
    setCourseData({
      ...courseData,
      additionalBlocks: [...courseData.additionalBlocks, newBlock],
    });
  }

  return (
    <ModalWindow isOpen={isOpen} onClose={onClose} header="Создание курса">
        <Card
          header='Основное'
          mode='transparent'
        >
          <MySelect
            label="Выберите категорию"
            value={courseData.category}
            onChange={(value) =>
              setCourseData({ ...courseData, category: value })
            }
            options={['Курс', 'Мини-курс', 'Марафон']}
            placeholder="Выберите категорию"
            required={true}
          />
          <MyInput
            label="Название курса"
            value={courseData.title}
            onChange={(value) =>
              setCourseData({ ...courseData, title: value })
            }
            placeholder="Введите название курса"
            required={true}
          />

          <MyInput
            label="Краткое описание"
            hint='Одно-два предложения до 100 символов'
            value={courseData.subTitle}
            onChange={(value) => setCourseData({ ...courseData, subTitle: value })}
            placeholder="Введите краткое описание"
          />

          <MyInput
            label="Цена"
            type="number"
            value={courseData.price}
            onChange={(value) => setCourseData({ ...courseData, price: parseInt(value) })}
            placeholder="Введите цену"
          />

          <MyInput
            label="Бонус купившим в первый день продаж"
            value={courseData.firstDayBonus}
            onChange={(value) => setCourseData({ ...courseData, firstDayBonus: value })}
            placeholder="например: эфир «вопрос-ответ», дополнительный материал или скидка на следующий курс"
          />

          <MyFileUpload
            id='cover_upload'
            label="Обложка курса"
            value={courseData.img}
            onChange={(file: File | null) => {
              setCourseData({ ...courseData, img: file });
            }}
            acceptedFormats="image/*"
          />
        </Card>
          
        <Card header="Дополнительное наполнение" mode="transparent">
        {courseData.additionalBlocks.map((block, index) => (
          <div key={block.id} className="mb-4 border rounded p-4 relative">
            <div className="flex justify-between items-center mb-2">
              <Header>Блок {index + 1}</Header>
              <button
                onClick={() => {
                  setCourseData({
                    ...courseData,
                    additionalBlocks: courseData.additionalBlocks.filter(
                      (b) => b.id !== block.id
                    ),
                  });
                }}
                className="text-red-500 hover:text-red-700"
                aria-label={`Удалить блок ${index + 1}`}
              >
                <SlTrash size={20} />
              </button>
            </div>
            <MyInput
              label="Заголовок"
              value={block.title}
              onChange={(value) => {
                const updatedBlocks = [...courseData.additionalBlocks];
                updatedBlocks[index].title = value;
                setCourseData({ ...courseData, additionalBlocks: updatedBlocks });
              }}
              placeholder="Введите заголовок блока"
              required={true}
            />
            <MyInput
              label="Содержание"
              value={block.content}
              onChange={(value) => {
                const updatedBlocks = [...courseData.additionalBlocks];
                updatedBlocks[index].content = value;
                setCourseData({ ...courseData, additionalBlocks: updatedBlocks });
              }}
              placeholder="Введите содержание блока"
              required={true}
              type="textarea"
            />
          </div>
        ))}

        <button
          onClick={() => addBlock()}
          className="text-blue-500 mt-4"
        >
          Добавить блок
        </button>
      </Card>

        <AccordionLessons
          lessons={lessons}
          setLessons={setLessons}
          addLesson={() => addLesson()}
          removeLesson={(id) =>
            setLessons(lessons.filter((lesson) => lesson.id !== id))
          }
        />

        <div className="flex justify-end mt-4">
          <button
            onClick={create}
            disabled={!isFormValid()}
            className={`p-2 rounded ${
              isFormValid()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Создать курс
          </button>
        </div>
      </ModalWindow>
  );
});

export default CourseForm;
