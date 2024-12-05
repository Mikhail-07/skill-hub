const usersHeaderConfig = [
  {
    id: 'name',
    title: 'Имя и фамилия',
    sortable: true,
    sortType: 'string',
  },
  {
    id: 'title',
    title: 'Курс',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'groupName',
    title: 'Поток',
    sortable: true,
    sortType: 'string',
    template: (group) => group ? group : 'Нет'
  },
  {
    id: 'date',
    title: 'Куплен',
    sortable: true,
    sortType: 'number',
    template: (timestamp) => {
      const date = new Date(timestamp)
      return ("0" + date.getDate()).slice(-2) + "." + ("0" + (date.getMonth() + 1)).slice(-2) + "." + date.getFullYear()
    }
  }
]

export default usersHeaderConfig