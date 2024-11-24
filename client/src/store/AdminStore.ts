import { makeAutoObservable } from "mobx";

export default class AdminStore{
  constructor(){
    this._users = []
    this._sales = []
    this._groups = [] 
    this._group = {}
    this._filteredUsers = []
    makeAutoObservable(this)
  }

  setUsers(data){
    this._users = data
  }

  setGroups(data){
    this._groups = data
  }

  setGroup(id){
    this._group = this._groups.find(group => group.id === id)
  }

  setFilteredUsers(id){
    this._filteredUsers = this._users.filter(user => user.courseId === id && !user.groupId)
  }

  setShow(bool){
    this._show = bool
  }

  get users(){
    return this._users
  }

  get groups(){
    return this._groups
  }

  get group(){
    return this._group
  }

  get sales(){
    return this._sales
  }

  get filteredUsers(){
    return this._filteredUsers
  }

  get show(){
    return this._show
  }
}