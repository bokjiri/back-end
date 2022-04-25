const router = require("express").Router()
const mainController = require("../controllers/mainController")

router.use("/", mainController.getMains)

module.exports = router
