const Router = require('express')
const router = new Router()
const coursesController = require('../controllers/coursesController')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

router.post('/', checkRoleMiddleware('ADMIN'), coursesController.create)// создание курса
router.post('/edit', checkRoleMiddleware('ADMIN'), coursesController.edit)// редактирование курса
router.get('/', coursesController.getAll) // получение курсов для витрины
router.get('/lessons/:id', coursesController.getCourseLessons)// уроки курса
router.post('/registration', coursesController.registrationOnCourse) // регистрация на курс
router.post('/waitlist', coursesController.addToWaitlist) // предзапись на курс
router.get('/:id', coursesController.getOne) // получение курса для ознакомительной карточки

module.exports = router