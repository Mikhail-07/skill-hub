import { makeAutoObservable } from "mobx";

export default class AdminStore{
  private _users: any[] = [];
  private _sales: any[] = [];
  private _groups: any[] = [];
  private _group: any = {};
  private _filteredUsers: any[] = [];
  private _show: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setUsers(data: any[]){
    this._users = data
  }

  setGroups(data: any[]){
    this._groups = data
  }

  setGroup(id: number){
    this._group = this._groups.find(group => group.id === id)
  }

  setFilteredUsers(id: number){
    this._filteredUsers = this._users.filter(user => user.courseId === id && !user.groupId)
  }

  setShow(bool: boolean){
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