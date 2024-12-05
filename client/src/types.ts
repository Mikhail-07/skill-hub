export interface Course {
  title: string,
  subTitle: string,
  description: string,
  img: File | null | string,
  price: number,
  category: string,
  benefit: string,
  forWhom: string,
  firstDayBonus: string,
  lessons: Lesson[],
  additionalBlocks: AdditionalBlocks[]
}

export interface Lesson {
  id: number,
  number: number | null,
  title: string,
  description: string,
  content: string,
  media: File | null,
}

export interface AdditionalBlocks {
  id: number
  title: string,
  content: string
}