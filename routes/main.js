const router = require("express").Router()
const mainController = require("../controllers/main.controller")

router.get("/:userId", mainController.getMain)

module.exports = router
