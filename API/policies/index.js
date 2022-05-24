const router = require("express").Router()
const detailController = require("./controllers/detail.controller")
const mainController = require("./controllers/main.controller")
const tokenMiddleware = require("../../middlewares/token.middleware")
const authMiddleware = require("../../middlewares/auth/auth.middleware")
const redisMiddlewares = require("../../middlewares/redis.middleware")

router.get("/", authMiddleware, redisMiddlewares.mainData, mainController.getMain)
router.get("/:dataId", tokenMiddleware, detailController.getDetail)

module.exports = router
