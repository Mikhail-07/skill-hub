const sequelize = require("../db")
const {DataTypes} = require ('sequelize')

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING, unique: true},
  password: {type: DataTypes.STRING},
  name: {type: DataTypes.STRING},
  surname: {type: DataTypes.STRING},
  role: {type: DataTypes.STRING, defaultValue: 'USER'}
})

const Order = sequelize.define('order', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const OrderCourse = sequelize.define('order-course', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  free: {type: DataTypes.BOOLEAN, defaultValue: false}
})

const Course = sequelize.define('course', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, unique: true, allowNull: false},
  subTitle: {type: DataTypes.STRING, unique: true, allowNull: false},
  description: {type: DataTypes.TEXT, unique: true, allowNull: false},
  img: {type: DataTypes.STRING, unique: true, allowNull: false},
  price: {type: DataTypes.INTEGER, allowNull: false}
})

const Lesson = sequelize.define('lesson', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  number: {type: DataTypes.INTEGER, allowNull: false},
  title: {type: DataTypes.STRING, allowNull: false},
  description: {type: DataTypes.TEXT, allowNull: false},
  content: {type: DataTypes.TEXT, allowNull: false},
  audio: {type: DataTypes.STRING, unique: true},
})

const AvailableLesson = sequelize.define('available_lesson', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
})

const UserGroup = sequelize.define('user_group', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Group = sequelize.define('group', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  name: {type: DataTypes.STRING, allowNull: false}
})

const Achieve = sequelize.define('achieve', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  category: {type: DataTypes.STRING, allowNull: false},
  brand: {type: DataTypes.STRING, allowNull: false},
  work: {type: DataTypes.STRING, allowNull: false},
  industry: {type: DataTypes.STRING, allowNull: false},
}) 

const Role = sequelize.define('role', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  role: {type: DataTypes.STRING, allowNull: false},
}) 

const Media = sequelize.define('media', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  file: {type: DataTypes.STRING, unique: true},
}) 

User.hasOne(Order)
Order.belongsTo(User)

Order.hasMany(OrderCourse)
OrderCourse.belongsTo(Order)

Course.hasOne(OrderCourse)
OrderCourse.belongsTo(Course)

Course.hasMany(Lesson)
Lesson.belongsTo(Course)

Course.hasMany(UserGroup)
UserGroup.belongsTo(Course)

Group.hasMany(AvailableLesson)
AvailableLesson.belongsTo(Group)

UserGroup.hasOne(OrderCourse)
OrderCourse.belongsTo(UserGroup)

Group.hasMany(UserGroup)
UserGroup.belongsTo(Group)

Lesson.hasMany(AvailableLesson)
AvailableLesson.belongsTo(Lesson)

User.hasMany(UserGroup)
UserGroup.belongsTo(User)

Achieve.hasMany(Role)
Role.belongsTo(Achieve)

Achieve.hasMany(Media)
Media.belongsTo(Achieve)


module.exports = {
  User, Order, OrderCourse, Course, UserGroup, Group, AvailableLesson, Lesson, Achieve, Role, Media
}