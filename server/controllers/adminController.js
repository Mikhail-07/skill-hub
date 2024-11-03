
const uuid = require('uuid')
const path = require('path')
const sequelize = require("../db")
const ApiError = require("../error/ApiError")
const { User, Order, OrderCourse, Course, Group, AvailableLesson, UserGroup, Lesson, Role, Achieve, Media } = require("../models/models")

const groupFilling = async (groupId, courseId, students, lessons) => {

  for (const id of students){
    const userGroup = await UserGroup.create({userId: id, courseId, groupId})
    const orderCourse = await OrderCourse.findOne({where: {orderId: id, courseId: courseId}})
    orderCourse.userGroupId = userGroup.id
    await orderCourse.save()
  }

  for (const id of lessons){
    await AvailableLesson.create({groupId: groupId, lessonId: id})
  }
}

class AdminController{
  async getAllUsers(req, res, next){
    const users = await OrderCourse.findAll({
      include: [
        {
          model: Course,
          attributes: []
        },
        {
          model: UserGroup,
          attributes:[],
          include:[
            {
              model: Group,
              attributes: []
            }
          ]
        },
        {
          model: Order,
          attributes: [],
          include: [
            {
              model: User,
              attributes: []
            }
          ]
        }
      ],
      attributes:[
        'id',
        [sequelize.col('order.userId'), 'userId'],
        [sequelize.fn('concat', sequelize.col('order.user.name'), ' ', sequelize.col('order.user.surname')), 'name'],
        'courseId',
        ['createdAt', 'date'],
        [sequelize.col('course.title'), 'title'],
        [sequelize.col('user_group.groupId'), 'groupId'],
        [sequelize.col('user_group.group.name'), 'groupName']
      ]
    })

    return res.json(users)
  }

  async createGroup(req, res, next){
    const name = `${new Date().getTime()}`.split('').splice(8).join('')
    // console.log('********')
    // console.log(req.body)
    // console.log('********')
    const {courseId} = req.body;
    
    const students = JSON.parse(req.body.students);
    const lessons = JSON.parse(req.body.lessons)
    
    const group = await Group.create({name})

    groupFilling(group.id, courseId, students, lessons)

    const groups = await UserGroup.findAll()
    return res.json(groups)
  }

  async editGroup(req, res, next){
    const {groupId, courseId} = req.body;
    const students = JSON.parse(req.body.students);
    const lessons = JSON.parse(req.body.lessons);

    await UserGroup.destroy({where: {groupId}}) 
    await AvailableLesson.destroy({where: {groupId: groupId}})
    await OrderCourse.update({userGroupId: null}, {
      where: {
        userGroupId: groupId
      }
    })   
    console.log('userGroupId заменен на null')
    
    groupFilling(groupId, courseId, students, lessons)

    const groups = await UserGroup.findAll()
    
    console.log('=======')
    console.log(groups)
    console.log('Группа изменена!')
    return res.json(groups)
  }

  async getGroups(req, res, next){
    const arr = []
    const groups = await UserGroup.findAll({
      include: [
        {
          model: Course, 
          attributes: []
        },
        {
          model: Group,
          attributes: []
        }
      ],
      attributes: 
      [
        'courseId',
        ['groupId', 'id'],
        [sequelize.col('group.name'), 'name'],
        [sequelize.col('course.title'), 'title'],
        [sequelize.fn('COUNT', 'courseId'), 'people']
      ],
      group: ['groupId', 'course.title', 'courseId', 'group.name']
    })

    for (const group of groups){
      const {id} = group.dataValues
  
      const students = await User.findAll({
        include:[
          {
            model: UserGroup,
            where: {groupId: id},
            attributes: []
          }
        ],
        attributes: [
          'id',
          [sequelize.fn('concat', sequelize.col('user.name'), ' ', sequelize.col('user.surname')), 'name'],
        ]
      })

      const lessons = await AvailableLesson.findAll({
        include: [
          {
            model: Lesson,
            attributes: [],
          }
        ],
        where: {groupId: id},
        attributes: 
        [
          ['lessonId', 'id'], 
          [sequelize.col('lesson.title'), 'title']
        ]
      })

      const obj = {
        ...group.dataValues,
        students: [...students],
        lessons: [...lessons]
      }

      arr.push(obj)
    }

    console.log('++++++++++++')
    console.log(arr)
    console.log('Отправил группы на клиент')
    return res.json(arr)
  }

  async createAchieve(req){
    const {brand, work, industry, roles, category, numberOfFiles} = req.body
   

    const achieve = await Achieve.create({brand, work, industry, category}) 
    
    const middle = Math.ceil(roles.length/2)
    roles.splice(0, middle)
    for (const role of JSON.parse(roles)){
      
      await Role.create({achieveId: achieve.id, role})
    }

    const files = req.files
    
    if (files){
      for (let i=0; i<numberOfFiles; i++){
        const file = files[`file_${i}`]
        const fileExtension = file.name.split('.')[1]
        const fileName = uuid.v4() + '.' + fileExtension;
        file.mv(path.resolve(__dirname, '..', 'static', fileName));
        await Media.create({file: fileName, achieveId: achieve.id})
      }
    }
    
  }

  async fecthAchieve(req, res, next){
    const arr = []
    let rolesResult = []
    
    const achieves = await Achieve.findAll({
      attributes: [
        'id',
        'brand',
        'work',
        'industry',
        'category'
      ],
      order: [
        ['category', 'ASC'],
        ['brand', 'ASC']
      ],
    })

    for (const achieve of achieves){
      const roles = await Role.findAll({
        where: {achieveId: achieve.id},
        attributes: ['role']
      })
      
      for (const role of roles){
        rolesResult.push(role.dataValues.role)
      }

      const files = await Media.findAll({
        where: {achieveId: achieve.id},
        attributes: ['file']
      })
      
      arr.push({
        ...achieve.dataValues,
        role: rolesResult,
        files
      })

      rolesResult = []
    }
    
    return res.json(arr)
  }

  // async fecthAchieveMedia(req, res, next){
  //   const {id} = req.params;
  //   const media = await Media.findAll({where:{achieveId: id}})
  //   return res.json(media)
  // }
}

  module.exports = new AdminController

  // async getGroups(req, res, next){
  //   const groups = await Group.findAll({
  //     group: ['name', 'courseId', 'course.title'],
  //     include: [{model: Course, attributes: []}],
  //     attributes: [
  //       'name', ['courseId', 'id'], [sequelize.col('course.title'), 'title'], [sequelize.fn('COUNT', 'courseId'), 'people']
  //     ],
  //     raw: true
  //   })

  