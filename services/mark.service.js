const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")
const Client = require("../schemas/redis")

exports.showMark = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        return await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    } catch (err) {}
}

exports.showMarkRedis = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
        const redisInsertMark = JSON.stringify(checkMark)
        await Client.set(userId, redisInsertMark)
    } catch (err) {}
}

exports.pushMark = async (userId, dataId) => {
    try {
        const checkuser = await User.findOne({ userId })
        return User.updateOne(
            { userId },
            {
                $set: { mark: dataId },
            },
            {
                $unset: { mark: checkuser.mark },
            }
        )
    } catch (err) {}
}

exports.pushMarkRedis = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
        const redisInsertMark = JSON.stringify(checkMark)
        await Client.set(userId, redisInsertMark)
    } catch (err) {}
}

exports.deleteMark = async (userId, dataId) => {
    try {
        const CheckMark = await User.findOne({ userId }, { _id: false, mark: true })
        if (CheckMark) {
            return User.updateOne({ userId }, { $pullAll: { mark: dataId } })
        } else {
            return undefined
        }
    } catch (err) {}
}

exports.deleteMarkRedis = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
        const redisInsertMark = JSON.stringify(checkMark)
        await Client.set(userId, redisInsertMark)
    } catch (err) {}
}

exports.topMark = async (req, res) => {
    return User.find({}, { _id: false, mark: true })
}
