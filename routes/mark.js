const router = require("express").Router()
const markController = require("../controllers/mark.controller")
const redisMiddlewares = require("../middlewares/redis.middleware")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.get("/:userId", redisMiddlewares.markRedis, markController.getMarks)
router.get("/", markController.topMarks)
router.put("/:userId", markController.postMarks)
router.delete("/:dataId", authMiddleware, markController.deleteMarks)
router.put("/like/:userId", markController.likeMarks)

module.exports = router
