import { $host, $authHost} from './index'
import { jwtDecode } from "jwt-decode"
import { LoginParams, RegistrationParams, User } from '@/types'

export const registration = async ({email, password, name, surname}: RegistrationParams) => {
  const { data } = await $host.post('api/user/registration', { email, password, name, surname });
  localStorage.setItem('token', data.token);

  const decoded = jwtDecode(data.token) as User;
  
  return {
    id: decoded.id,
    name: decoded.name,
    surname: decoded.surname,
    role: decoded.role,
  };
} 

export const login = async ({email, password}: LoginParams) => {
  const {data} = await $host.post('api/user/login', {email, password})
  localStorage.setItem('token', data.token)
  const decoded = jwtDecode(data.token) as User;
  
  return {
    id: decoded.id,
    name: decoded.name,
    surname: decoded.surname,
    role: decoded.role,
  };
} 

export const fetchUserCourses = async (email: string) => {
  const {data} = await $authHost.get('api/user/profile/courses', {params: {email}})
  return data
} 

export const fetchUserLessons = async (email:string, courseId:string) => {
  const {data} = await $authHost.get('api/user/profile/lessons', {params: {email, courseId}})
  return data
} 


export const check = async () => {
  const {data} = await $authHost.get('api/user/auth')
  console.log(data)
  localStorage.setItem('token', data.token)
  return jwtDecode(data.token)
} 