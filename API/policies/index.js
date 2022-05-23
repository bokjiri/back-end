const router = require("express").Router()
const detailController = require("./controllers/detail.controller")
const mainController = require("./controllers/main.controller")
const tokenMiddleware = require("../../middlewares/token.middleware")
const authMiddleware = require("../../middlewares/auth/auth.middleware")

router.get("/", authMiddleware, mainController.getMain)
router.get("/:dataId", tokenMiddleware, detailController.getDetail)

module.exports = router
