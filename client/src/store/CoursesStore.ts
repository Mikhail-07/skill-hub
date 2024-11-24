import {makeAutoObservable} from 'mobx'

export default class CourseStore{
  constructor(){
    this._courses = []; 
    this._course = {};
    this._lessons = []

    makeAutoObservable(this);
  }

  setCourses(courses){
    this._courses = courses
  }

  setCourse(id){
    const filteredCourse = this._courses.find(course => course.id === id)
    filteredCourse ? this._course = filteredCourse : this._course = []
  }

  setLessons(lessons){
    this._lessons = lessons
  }

  get courses(){
    return this._courses
  }

  get course(){
    return this._course
  }

  get lessons(){
    return this._lessons
  }
}