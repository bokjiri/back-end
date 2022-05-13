const router = require("express").Router()
const newsController = require("../controllers/news.controller")
const redisController = require("../middlewares/redis.middleware")
const authMiddleware = require("../middlewares/auth/auth.middleware")

router.get("/", authMiddleware, redisController.newsData, newsController.getNews)

module.exports = router
