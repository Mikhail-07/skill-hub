const Router = require("express");
const router = new Router();
const UserController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", UserController.registration);
router.post("/login", UserController.login);
router.get("/auth", authMiddleware, UserController.check);
router.get("/profile/courses", UserController.userCollectionCourses);
router.get("/profile/lessons", UserController.userCollectionLessons);
router.get("/all", UserController.getAllUsers);

module.exports = router;
