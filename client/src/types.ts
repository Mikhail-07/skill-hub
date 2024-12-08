export interface CourseBase {
  title: string,
  subTitle: string,
  description: string,
  price: number,
  category: string,
  benefit: string,
  forWhom: string,
  firstDayBonus: string,
  additionalBlocks: AdditionalBlocks[]
}

export interface Course extends CourseBase {
  id: number,
  img: string,
  lessons: Lesson[],
}

export interface CourseData extends CourseBase {
  img: File | null,
  lessons: LessonData[],
}

export interface LessonBase {
  id: number,
  number: number | null,
  title: string,
  content: string,
  media: File | null,
}

export interface LessonData extends LessonBase {
  description: string,
}

export interface Lesson extends LessonBase {
  description: [],
}

export interface AdditionalBlocks {
  id: number
  title: string,
  content: string
}

export interface User {
  id: number,
  name: string,
  surname: string
  role: "ADMIN" | "USER"
}

export interface RegistrationParams {
  email: string;
  password: string;
  name: string;
  surname: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export interface SetModal {
  setIsFormModalOpen: (arg0: boolean) => void
}