import { $host, $authHost} from './index'
import { jwtDecode } from "jwt-decode"

export const createCourse = async (course) => {
  const {data} = await $authHost.post('api/course', course)
  return data
} 

export const editCourse = async (course) => {
  const {data} = await $authHost.post('api/course/edit', course)
  return data
} 

export const fetchCourses = async () => {
  const {data} = await $host.get('api/course')
  return data
} 

export const fetchCourse = async (id) => {
  const {data} = await $host.get('api/course/' + id)
  return data
} 

export const fetchLessons = async (id) => {
  const {data} = await $host.get('api/course/lessons/' + id)
  return data
}

export const registrationOnCourse = async (registration) => {
  const {data} = await $authHost.post('api/course/registration', registration)
  return data
}

export const check = async () => {
  const {data} = await $authHost.get('api/user/auth')
  localStorage.setItem('token', data.token)
  return jwtDecode(data.token)
} 