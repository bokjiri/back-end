const router = require("express").Router()
const mainController = require("../controllers/main.controller")

router.use("/", mainController.getMain)

module.exports = router
