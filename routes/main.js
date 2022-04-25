const router = require("express").Router()
const mainController = require("../controllers/mainController")

router.use("/", mainController.getMain)

module.exports = router
