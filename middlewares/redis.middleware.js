const Client = require("../schemas/redis")

exports.markRedis = async (req, res, next) => {
    const { userId } = req.params

    const redis = await Client.get(userId)
    if (!redis) {
        console.log("redis No such data found ㅠㅠ")
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        console.log("redis have bookmark data!!!")
        res.status(200).json({
            userMark: stringToJsonData,
        })
    }
}
exports.topMarkRedis = async (req, res, next) => {
    const redis = await Client.get("topMarkList")
    if (!redis) {
        console.log("redis No such data found ㅠㅠ")
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        console.log("redis have data!!!")
        res.status(200).json({
            userMark: stringToJsonData,
        })
    }
}
exports.newsData = async (req, res, next) => {
    const { userId } = res.locals
    const redis = await Client.get(`newsData${userId}`)
    if (!redis) {
        console.log("redis No such news data found ㅠㅠ")
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        console.log("redis have news data!!!")
        res.status(200).json({
            newsList: stringToJsonData,
        })
    }
}
exports.mainData = async (req, res, next) => {
    const { userId } = res.locals
    const redis = await Client.get(`main${userId}`)
    if (!redis) {
        console.log("redis No such main data found ㅠㅠ")
        next()
    } else {
        const dataList = JSON.parse(redis)
        console.log("redis have main data!!!")
        res.status(200).json({
            dataList,
        })
    }
}
