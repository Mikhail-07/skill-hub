import { Course, CourseData, Lesson, LessonData } from "@/types";

export const prepareFormData = (courseData: CourseData, lessons: LessonData[]): FormData => {
  const formData = new FormData();

  // Добавление основных данных курса
  Object.entries(courseData).forEach(([key, value]) => {
    if (value !== null && value !== '') {
      if (Array.isArray(value) && key === 'additionalBlocks') {
        // Сериализация additionalBlocks
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value as string);
      }
    }
  });

  // Добавление данных уроков
  const formattedLessons = lessons.map((lesson, idx) => {
    const { media, ...lessonData } = lesson;
    const number = idx + 1;

    if (media) {
      formData.append(
        'mediaFiles',
        JSON.stringify({
          number,
          type: media.type.startsWith('audio/') ? 'audio' : 'video',
        })
      );
      formData.append('files', media); // Универсальный ключ для всех файлов
    }

    return { ...lessonData, number }; // Уроки с добавленным номером
  });

  formData.append('lessons', JSON.stringify(formattedLessons));

  return formData;
};
