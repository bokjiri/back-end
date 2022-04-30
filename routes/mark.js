const router = require("express").Router()
const markController = require("../controllers/mark.controller")
const redisMiddlewares = require("../middlewares/redis.middleware")

router.get("/:userId", redisMiddlewares.markRedis, markController.getMarks)
router.put("/:userId", markController.postMarks)
router.delete("/:userId", markController.deleteMarks)

module.exports = router
