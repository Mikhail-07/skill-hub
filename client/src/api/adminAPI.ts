import { $host, $authHost } from './index'

export const fetchUsers = async () => {
  const {data} = await $authHost.get('api/admin')
  return data
}

export const createGroup = async (group) => {
  const {data} = await $authHost.post('api/admin/group', group)
  return data
}

export const editGroup = async (group) => {
  const {data} = await $authHost.post('api/admin/group/edit', group)
  return data
}

export const fetchGroups = async () => {
  const {data} = await $authHost.get('api/admin/group')
  return data
}

export const createAchive = async (achieve) =>{
  const {data} = await $authHost.post('api/admin/achieve', achieve)
  return data
}

export const fetchAchive = async () => {
  const {data} = await $host.get('api/admin/achieve/list')
  return data
}

// export const fecthAchiveMedia = async (id) => {
//   const {data} = await $host.get('api/admin/achieve/' + id)
//   return data
// }
