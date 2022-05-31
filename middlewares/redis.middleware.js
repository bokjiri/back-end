const Client = require("../schemas/redis")

exports.markRedis = async (req, res, next) => {
    const { userId } = req.params

    const redis = await Client.get(userId)
    if (!redis) {
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        res.status(200).json({
            result: "SUCCESS",
            message: "마크 조회 완료",
            userMark: stringToJsonData,
        })
    }
}
exports.topMarkRedis = async (req, res, next) => {
    const redis = await Client.get("topMarkList")
    if (!redis) {
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        res.status(200).json({
            result: "SUCCESS",
            message: "탑마크 조회 완료",
            userMark: stringToJsonData,
        })
    }
}
exports.newsData = async (req, res, next) => {
    const { userId } = res.locals
    const redis = await Client.get(`newsData${userId}`)
    if (!redis) {
        next()
    } else {
        const stringToJsonData = JSON.parse(redis)
        res.status(200).json({
            result: "SUCCESS",
            message: "뉴스 조회 완료",
            newsList: stringToJsonData,
        })
    }
}
exports.mainData = async (req, res, next) => {
    const { userId } = res.locals
    const redis = await Client.get(`main${userId}`)
    if (!redis) {
        next()
    } else {
        const dataList = JSON.parse(redis)
        res.status(200).json({
            result: "SUCCESS",
            message: "메인 조회 완료",
            dataList,
        })
    }
}
exports.userData = async (req, res, next) => {
    const { userId } = res.locals
    const redis = await Client.get(`user${userId}`)
    if (!redis) {
        next()
    } else {
        const data = JSON.parse(redis)
        res.status(201).json({
            result: "SUCCESS",
            message: "회원정보 조회 완료",
            data,
        })
    }
}
