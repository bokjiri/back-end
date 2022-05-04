const router = require("express").Router()
const newsController = require("../controllers/news.controller")
const redisController = require("../middlewares/redis.middleware")

router.get("/", newsController.getNews)

module.exports = router
