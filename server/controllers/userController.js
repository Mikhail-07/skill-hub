const ApiError = require('../error/ApiError')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {User, Order, Course, OrderCourse, Lesson, Group, AvailableLesson, UserGroup} = require('../models/models')

generateJwt = (id, email, role, name, surname) => {
  return jwt.sign({id, email, name, surname, role},
    process.env.SECRET_KEY,
    {expiresIn: "24h"}
  );
}

class UserController {
  
  async registration (req, res, next){
    const {email, password, name, surname, role} = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Не задан пароль или логин'))
    };
    const candidate = await User.findOne({where: {email}});
    console.log(candidate)
    if (candidate){
      return next(ApiError.badRequest('Такой пользователь уже существует'))
    };
    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({email, password: hashPassword, name, surname, role});
    const order = await Order.create({userId: user.id});
    const token = generateJwt(user.id, email, user.role, name, surname)
    return res.json({token})
  }
  
  async login (req, res, next){
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});
    if (!user) return next(ApiError.badRequest('Пользователь не найден'));
    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) return next(ApiError.badRequest('Неверный пароль'));
    const token = generateJwt(user.id, user.email, user.role, user.name, user.surname, );
    return res.json({token});
  }

  async userCollectionCourses (req, res, next){
    const {email} = req.query;
    const user = await User.findOne({where: {email}});
    const collection = await Course.findAll({
      include: [
        {
          model: OrderCourse, 
          where: {orderId: user.id},
          attributes: []
        }
      ],
      attributes: ['id', 'title', 'description']
    })
    return res.json(collection);
  }

  async userCollectionLessons (req, res, next){
    const {email, courseId} = req.query;
    const user = await User.findOne({where: {email}});
    const orderCourse = await OrderCourse.findOne({
      where: {courseId, orderId: user.id}
    })
    if (orderCourse?.free){
      const collection = await Lesson.findAll({
        where: {courseId},
        attributes:['id', 'title', 'description', 'content', 'audio']
      })
      return res.json(collection)
    }
    const userGroup = await UserGroup.findOne({
      where: {
        userId: user.id,
        courseId: courseId
      }
    });

    if (!userGroup) return res.json({})
    const collection = await Lesson.findAll({
      include: [
        {
          model: AvailableLesson, 
          where: {groupId: userGroup.groupId},
          attributes: [],
        }
      ],
      attributes:['id', 'title', 'description', 'content', 'audio']  
    })
    return res.json(collection);
  }

  async check (req, res, next){
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    return res.json({token})
  }
}

module.exports = new UserController()