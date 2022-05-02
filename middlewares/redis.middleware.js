const Client = require("../schemas/redis")

exports.markRedis = async (req, res, next) => {
    const { userId } = req.params

    const redis = await Client.get(userId)
    if (!redis) {
        console.log("redis No such data found ㅠㅠ")
        next()
    } else {
        const jsonToStringData = JSON.parse(redis)
        console.log("redis have data!!!")
        res.status(200).json({
            userMark: jsonToStringData,
        })
    }
}
exports.topMarkRedis = async (req, res, next) => {
    const redis = await Client.get("topMarkList")
    if (!redis) {
        console.log("redis No such data found ㅠㅠ")
        next()
    } else {
        const jsonToStringData = JSON.parse(redis)
        console.log("redis have data!!!")
        res.status(200).json({
            userMark: jsonToStringData,
        })
    }
}
