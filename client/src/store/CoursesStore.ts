import { Course, Lesson } from '@/types';
import { makeAutoObservable } from 'mobx';

export default class CourseStore {
  private _courses: Course[] = [];
  private _course: Course | null = null;
  private _lessons: Lesson[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setCourses(courses: Course[]) {
    this._courses = courses;
    console.log("COURSES STORED: ", courses);
  }

  setCourse(id: number) {
    const filteredCourse = this._courses.find(course => course.id === id);
    this._course = filteredCourse || null;
  }

  setLessons(lessons: Lesson[]) {
    this._lessons = lessons;
  }

  get courses(): Course[] {
    return this._courses;
  }

  get course(): Course | null {
    return this._course;
  }

  get lessons(): Lesson[] {
    return this._lessons;
  }
}
