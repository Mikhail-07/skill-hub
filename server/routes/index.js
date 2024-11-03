const Router = require('express')
const router = new Router()
const adminRouter = require('./adminRouter')
const userRouter = require('./userRouter')
const coursesRouter = require('./coursesRouter')

router.use('/user', userRouter)
router.use('/admin', adminRouter)
router.use('/course', coursesRouter)

module.exports = router