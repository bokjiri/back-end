const router = require("express").Router()
const markController = require("./controllers/mark.controller")
const redisMiddlewares = require("../../middlewares/redis.middleware")
const authMiddleware = require("../../middlewares/auth/auth.middleware")

router.get("/:userId", authMiddleware, redisMiddlewares.markRedis, markController.getMarks)
router.put("/", authMiddleware, markController.postMarks)
router.delete("/:dataId", authMiddleware, markController.deleteMarks)

module.exports = router
