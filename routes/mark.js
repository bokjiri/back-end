const router = require("express").Router()
const markController = require("../controllers/mark.controller")
const redisMiddlewares = require("../middlewares/redis.middleware")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.get("/:userId", authMiddleware, redisMiddlewares.markRedis, markController.getMarks)
router.post("/", authMiddleware, markController.postMarks)
// router.delete("/:dataId", authMiddleware, markController.deleteMarks)
// router.get("/", markController.topMarks)
// router.put("/like/:userId", markController.likeMarks)

module.exports = router
