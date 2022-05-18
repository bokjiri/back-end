const router = require("express").Router()
const mainController = require("../controllers/main.controller")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.get("/:userId", authMiddleware, mainController.getMain)

module.exports = router
