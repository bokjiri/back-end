const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")
const Client = require("../schemas/redis")

redisSet = async (userId) => {
    const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
    const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    const redisInsertMark = JSON.stringify(checkMark)
    await Client.set(userId, redisInsertMark)
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
exports.topLikesMarkRedis = async (userId) => {
    const markInfo = await User.findOne({ userId }, { _id: false, topLikeMarkList: true })
    const topLikesMarkList = JSON.stringify(markInfo)
    await Client.set("topMarkList", topLikesMarkList)
}

exports.showMark = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        return await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    } catch (err) {}
}

exports.pushMark = async (userId, dataId) => {
    try {
        return User.updateOne(
            { userId },
            {
                $push: { mark: dataId },
            }
        )
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

exports.topMark = async (userId) => {
    const userMarkList = await User.find({}, { _id: false, likeMark: true })
    let arr1 = []
    let result = {}
    userMarkList.map((value) => {
        arr1.push(...value.likeMark)
    })
    arr1.forEach((x) => {
        result[x] = (result[x] || 0) + 1
    })
    // console.log({ result })

    let sortable = []
    for (let i in result) {
        sortable.push([i, result[i]])
    }
    sortable.sort(function (a, b) {
        return b[1] - a[1]
    })
    // console.log({ sortable })

    a = sortable.slice(0, 5)
    let arr2 = []
    a.map((value) => {
        arr2.push(...value)
    })
    let topMarkArr = []
    for (let i = 0; i < arr2.length; i++) {
        if (i % 2 === 0) {
            topMarkArr.push(arr2[i])
        }
    }
    // console.log("topMarkArr: " + topMarkArr)

    let topMarkList = []
    for (let i = 0; i < topMarkArr.length; i++) {
        const markData = await BokjiApi.find({ dataId: topMarkArr[i] }, { _id: false, dataId: true, name: true, desire: true })
        topMarkList.push(markData)
    }
    // console.log("topMarkList: " + topMarkList)

    const markListCleansing = []
    topMarkList.map((value) => {
        markListCleansing.push(...value)
    })
    // console.log("markListCleansing: " + markListCleansing)
    await User.updateOne(
        { userId },
        {
            $set: { topLikeMarkList: markListCleansing },
        },
        {
            $unset: { topLikeMarkList: markListCleansing },
        }
    )
    return markListCleansing
}

exports.likemark = async (userId, dataId) => {
    const findLikeMark = await User.findOne({ userId }, { _id: false, likeMark: true })

    if (findLikeMark.likeMark.includes(dataId)) {
        return await User.updateOne(
            { userId },
            {
                $pullAll: { likeMark: dataId },
            }
        )
    } else {
        return await User.updateOne(
            { userId },
            {
                $push: { likeMark: dataId },
            }
        )
    }
}
