const ApiError = require("../error/ApiError")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {
  User,
  Order,
  Course,
  OrderCourse,
  Lesson,
  Group,
  AvailableLesson,
  UserGroup,
} = require("../models/models")

const generateJwt = (id, email, role, name, surname) => {
  return jwt.sign({ id, email, name, surname, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  })
}

class UserController {
  async findUserByEmail(email) {
    return await User.findOne({ where: { email } })
  }

  async findUserByChatId(chatId) {
    return await User.findOne({ where: { chatId } })
  }

  async registration(req, res, next) {
    try {
      const { email, password, name, surname, role, chatId } = req.body

      if (!email && !chatId) {
        return next(ApiError.badRequest("Не задан ни email, ни chatId"))
      }

      let candidate
      if (email) {
        candidate = await this.findUserByEmail(email)
      } else {
        candidate = await this.findUserByChatId(chatId)
      }

      if (candidate) {
        return next(ApiError.badRequest("Такой пользователь уже существует"))
      }

      let hashPassword = null
      if (password) {
        hashPassword = await bcrypt.hash(password, 5)
      }

      const user = await User.create({
        email,
        password: hashPassword,
        name,
        surname,
        role,
        chatId,
      })

      if (!chatId) {
        // регистрация с сайта
        await Order.create({ userId: user.id })

        const token = generateJwt(user.id, email, user.role, name, surname)
        return res.json({ token })
      } else {
        // регистрация с бота
        return res.json({ user })
      }
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return next(ApiError.badRequest("Пользователь не найден"))
    const comparePassword = bcrypt.compareSync(password, user.password)
    if (!comparePassword) return next(ApiError.badRequest("Неверный пароль"))
    const token = generateJwt(
      user.id,
      user.email,
      user.role,
      user.name,
      user.surname
    )
    return res.json({ token })
  }

  async userCollectionCourses(req, res, next) {
    const { email } = req.query
    const user = await User.findOne({ where: { email } })
    const collection = await Course.findAll({
      include: [
        {
          model: OrderCourse,
          include: [
            {
              model: Order,
              where: { userId: user.id },
              attributes: [],
            },
          ],
          attributes: [],
        },
      ],
      attributes: ["id", "title", "description"],
    })
    return res.json(collection)
  }

  async userCollectionLessons(req, res, next) {
    const { email, courseId } = req.query
    const user = await User.findOne({ where: { email } })
    const orderCourse = await OrderCourse.findOne({
      include: [
        {
          model: Order,
          where: { userId: user.id },
          attributes: [],
        },
      ],
      where: { courseId },
    })
    if (orderCourse?.free) {
      const collection = await Lesson.findAll({
        where: { courseId },
        attributes: ["id", "title", "description", "content", "audio"],
      })
      return res.json(collection)
    }
    const userGroup = await UserGroup.findOne({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    })

    if (!userGroup) return res.json({})
    const collection = await Lesson.findAll({
      include: [
        {
          model: AvailableLesson,
          where: { groupId: userGroup.groupId },
          attributes: [],
        },
      ],
      attributes: ["id", "title", "description", "content", "audio"],
    })
    return res.json(collection)
  }

  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role)
    return res.json({ token })
  }

  async getAllUsers(req, res, next) {
    try {
      const users = await fetchAllUsers()
      console.log("ОТПРАВИЛ ЮЗЕРОВ НА КЛИЕНТА")
      return res.json(users)
    } catch (error) {
      return next(
        ApiError.internal("Ошибка при получении пользователей", error)
      )
    }
  }

  async fetchAllUsers() {
    const users = await User.findAll({
      attributes: ["id", "name", "surname", "email", "phone", "chatId"],
      include: [
        {
          model: Order,
          attributes: ["id"],
          include: [
            {
              model: OrderCourse,
              attributes: ["id"],
              include: [
                {
                  model: Course,
                  attributes: ["id", "title"],
                },
              ],
            },
          ],
        },
      ],
    })

    const formattedUsers = users.map((user) => {
      const allCourses = user.Orders.flatMap((order) =>
        order.OrderCourses.map((oc) => oc.Course)
      )
      return {
        id: user.id,
        fullName: `${user.name} ${user.surname}`,
        phone: user.phone,
        email: user.email,
        chatId: user.chatId,
        lastCourse:
          allCourses.length > 0
            ? allCourses[allCourses.length - 1].title
            : null,
        totalCourses: allCourses.length,
      }
    })

    return formattedUsers
  }
}

module.exports = new UserController()
