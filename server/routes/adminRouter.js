const Router = require('express')
const adminController = require('../controllers/adminController')
const router = new Router()
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')


router.get('/', checkRoleMiddleware('ADMIN'), adminController.getAllUsers)
router.post('/group', checkRoleMiddleware('ADMIN'), adminController.createGroup)
router.post('/group/edit', checkRoleMiddleware('ADMIN'), adminController.editGroup)
router.get('/group', checkRoleMiddleware('ADMIN'), adminController.getGroups)
router.post('/achieve', checkRoleMiddleware('ADMIN'), adminController.createAchieve)
router.get('/achieve/list', adminController.fecthAchieve)
// router.get('/achieve/:id', adminController.fecthAchieveMedia)

module.exports = router