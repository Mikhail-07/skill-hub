import { useEffect, useState } from 'react';
import { Course, Lesson } from '@/types';

export const useCourseForm = () => {
  const [courseData, setCourseData] = useState<Course>({
    title: '',
    subTitle: '',
    description: '',
    img: null,
    price: 0,
    category: '',
    benefit: '',
    forWhom: '',
    firstDayBonus: '',
    lessons: [],
    additionalBlocks: [],
  });
  

  const [lessons, setLessons] = useState<Lesson[]>([
    { id: 0, number: null, title: '', description: '', content: '', media: null },
  ]);

  const isFormValid = () => {
    const requiredCourseFields = ['title', 'category'];
    const isCourseValid = requiredCourseFields.every(
      (field) => (courseData as any)[field]
    );
    const areLessonsValid = lessons.every(
      (lesson) => lesson.title && lesson.description
    );
    return isCourseValid && areLessonsValid;
  };

  useEffect(() => console.log('courseData EDITED: ', courseData), [courseData])
  useEffect(() => console.log('lessons EDITED: ', lessons), [lessons])


  return {
    courseData,
    setCourseData,
    lessons,
    setLessons,
    isFormValid,
  };
};
