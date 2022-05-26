require("dotenv").config()
const redis = require("redis")
const url = process.env.REDISURL || "redis://@127.0.0.1:6379"
const redisClient = redis.createClient({ url })
redisClient.connect()
module.exports = redisClient
