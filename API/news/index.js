const router = require("express").Router()
const newsController = require("./controllers/news.controller")
const redisMiddleware = require("../../middlewares/redis.middleware")
const authMiddleware = require("../../middlewares/auth/auth.middleware")

router.get("/", authMiddleware, redisMiddleware.newsData, newsController.getNews)

module.exports = router
