import { Course, Lesson, RegistrationParams, User } from '@/types';
import { makeAutoObservable } from 'mobx';



export default class UserStore {
  private _isAuth: boolean = false;
  private _user: User | null = null;
  private _courses: Course[] = [];
  private _course: Course | null = null;
  private _lessons: Lesson[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this._isAuth = bool;
  }

  setUser(user: User | null) {
    this._user = user;
  }

  setCourses(courses: Course[]) {
    this._courses = courses;
  }

  setCourse(title: string) {
    const course = this._courses.find(course => course.title === title);
    this._course = course || null;
  }

  setLessons(lessons: Lesson[]) {
    this._lessons = lessons;
  }

  get isAuth(): boolean {
    return this._isAuth;
  }

  get user(): User | null {
    return this._user;
  }

  get courses(): Course[] {
    return this._courses;
  }

  get course(): Course | null {
    if (!this._course && this._courses.length > 0) {
      this.setCourse(this._courses[0].title);
    }
    return this._course;
  }

  get lessons(): Lesson[] {
    return this._lessons;
  }
}
