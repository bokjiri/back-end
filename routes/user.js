const router = require("express").Router()
const userController = require("../controllers/userController")

router.use("/", userController.getUsers)

module.exports = router
