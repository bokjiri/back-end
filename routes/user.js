const router = require("express").Router()
const userController = require("../controllers/userController")

router.use("/", userController.getUsers)
router.use("/", userController.postUsers)
router.use("/", userController.putUsers)
router.use("/", userController.deleteUsers)

module.exports = router
