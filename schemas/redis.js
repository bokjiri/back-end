const redis = require("redis")

const redisClient = redis.createClient({
    url: process.env.REDISURL,
})

redisClient.connect()

module.exports = redisClient
