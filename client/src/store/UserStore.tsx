import {makeAutoObservable} from 'mobx'

export default class UserStore{
  constructor(){
    this._isAuth = false;
    this._user = {};
    this._course = [];
    this._courses = [];
    this._lessons = []
    makeAutoObservable(this);
  }

  setAuth(bool){
    this._isAuth = bool
  }

  setUser(user){
    this._user = user
  }

  setCourses(courses){
    this._courses = courses
  }

  setCourse(title){
    this._course = this._courses.find(course => course.title === title)
  }

  setLessons(lessons){
    this._lessons = lessons
  }

  get isAuth(){
    return this._isAuth
  }

  get user(){
    return this._user
  }

  get courses(){
    return this._courses
  }

  get course(){
    if (!this._course){
      this.setCourse(this.courses[0].title)
    } 
    return this._course
  }

  get lessons(){
    return this._lessons
  }
}