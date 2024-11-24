import { $host, $authHost} from './index'
import { jwtDecode } from "jwt-decode"

export const registration = async ({email, password, name, surname}) => {
  const {data} = await $host.post('api/user/registration', {email, password, name, surname})
  localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
} 

export const login = async ({email, password}) => {
  const {data} = await $host.post('api/user/login', {email, password})
  localStorage.setItem('token', data.token)
  return jwtDecode(data.token)
} 

export const fetchUserCourses = async (email) => {
  const {data} = await $authHost.get('api/user/profile/courses', {params: {email}})
  return data
} 

export const fetchUserLessons = async (email, courseId) => {
  const {data} = await $authHost.get('api/user/profile/lessons', {params: {email, courseId}})
  return data
} 


export const check = async () => {
  const {data} = await $authHost.get('api/user/auth')
  console.log(data)
  localStorage.setItem('token', data.token)
  return jwtDecode(data.token)
} 