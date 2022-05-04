const router = require("express").Router()
const mainController = require("../controllers/main.controller")

router.use("/:userId", mainController.getMain)

module.exports = router
