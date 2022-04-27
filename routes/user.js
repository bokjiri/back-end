const router = require("express").Router()
const userController = require("../controllers/user.controller")

router.use("/", userController.getUsers)
router.use("/", userController.postUsers)
router.use("/", userController.putUsers)
router.use("/", userController.deleteUsers)

module.exports = router
