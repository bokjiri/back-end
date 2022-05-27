const User = require("../../../schemas/user")
const BokjiApi = require("../../../schemas/data")
const Client = require("../../../schemas/redis")

redisSet = async (userId) => {
    const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
    const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    const redisInsertMark = JSON.stringify(checkMark)
    await Client.set(userId, redisInsertMark)
    await Client.expire(userId, 7200)
}

exports.showMarkRedis = async (userId) => {
    await redisSet(userId)
}
exports.pushMarkRedis = async (userId) => {
    await redisSet(userId)
}
exports.deleteMarkRedis = async (userId) => {
    await redisSet(userId)
}
// exports.topLikesMarkRedis = async (userId) => {
//     const markInfo = await User.findOne({ userId }, { _id: false, topLikeMarkList: true })
//     const topLikesMarkList = JSON.stringify(markInfo)
//     await Client.set("topMarkList", topLikesMarkList)
// }

exports.showMark = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        return await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    } catch (err) {}
}

exports.pushMark = async (userId, dataId) => {
    try {
        const { mark } = await User.findOne({ userId }, { _id: false, mark: true })
        if (!mark.includes(dataId)) {
            return User.updateOne(
                { userId },
                {
                    $push: { mark: [dataId] },
                }
            )
        } else if (mark.includes(dataId)) {
            return User.updateOne(
                { userId },
                {
                    $pullAll: { mark: [dataId] },
                }
            )
        }
    } catch (err) {
        // console.log(err)
        return err
    }
}

exports.deleteMark = async (userId, dataId) => {
    try {
        const checkId = await User.findOne({ userId }, { _id: false, mark: true })
        if (checkId.mark.includes(dataId))
            return await User.updateOne(
                { userId },
                {
                    $pullAll: { mark: [dataId] },
                }
            )
    } catch (err) {
        // console.log(err)
    }
}

exports.dataCheck = async (dataId) => {
    try {
        return await BokjiApi.findOne({ dataId }, { _id: false, dataId: true, bookmarkState: true })
    } catch (error) {
        // console.log(error)
        return error
    }
}

// exports.markPush = async () => {
//     try {
//         const allMark = await User.find({}, { _id: false, mark: true, email: true, nickname: true })
//         markList = []
//         markList.push(allMark)
//         for (let i of markList) {
//         }
//         const dataList = await BokjiApi.find({})
//         console.log(allMark)
//     } catch (err) {}
// }

// exports.likemark = async (userId, dataId) => {
//     const findLikeMark = await User.findOne({ userId }, { _id: false, likeMark: true })

//     if (findLikeMark.likeMark.includes(dataId)) {
//         return await User.updateOne(
//             { userId },
//             {
//                 $pullAll: { likeMark: dataId },
//             }
//         )
//     } else {
//         return await User.updateOne(
//             { userId },
//             {
//                 $push: { likeMark: dataId },
//             }
//         )
//     }
// }
