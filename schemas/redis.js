require("dotenv").config()
const redis = require("redis")
const host = process.env.REDISURL || "localhost"
const redisOption = { host, port: 6379 }
const redisClient = redis.createClient(redisOption)
redisClient.connect()
module.exports = redisClient
