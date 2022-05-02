const router = require("express").Router()
const markController = require("../controllers/mark.controller")
const redisMiddlewares = require("../middlewares/redis.middleware")

router.get("/:userId", redisMiddlewares.markRedis, markController.getMarks)
router.get("/", markController.topMarks)
router.put("/:userId", markController.postMarks)
router.delete("/:userId", markController.deleteMarks)
// router.post("/like:dataId")
// router.delete("/like:dataId")

module.exports = router
