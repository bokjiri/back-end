const User = require("../../../schemas/user")
const Data = require("../../../schemas/data")
const Guestbook = require("../../../schemas/guestbook")
const moment = require("moment-timezone")
moment.tz.setDefault("Asia/Seoul")

async function findFeed(feedId) {
    return await Guestbook.findOne({ feedId })
}

exports.userInfo = async (userId) => {
    const checkUser = await User.findOne({ userId }, { _id: false, profileUrl: true, nickname: true, userId: true })
    if (!checkUser) await Guestbook.deleteMany({ userId })
    return checkUser
}
exports.getGuestbook = async () => {
    return await Guestbook.find({})
}
exports.createFeed = async (content, user) => {
    const date = moment().format("YYYY-MM-DD")
    const userId = user.userId
    const nickname = user.nickname
    const profileUrl = user.profileUrl
    return await Guestbook.create({ userId, nickname, profileUrl, date, content })
}
exports.updateFeed = async (feedId, content, user) => {
    const date = moment().format("YYYY-MM-DD")
    return await Guestbook.updateOne({ feedId }, { $set: { date, content } }), date
}
exports.destroyFeed = async (feedId) => {
    return await Guestbook.deleteOne({ feedId })
}
exports.reportFeed = async (feedId, user) => {
    const { userId } = user
    const checkFeed = await findFeed(feedId)
    if (checkFeed.report.includes(userId)) throw new Error("이미 신고한 유저입니다.")

    await Guestbook.updateOne({ feedId }, { $push: { report: [userId] } })

    const reportFeed = await findFeed(feedId)
    if (reportFeed.report.length === 3) {
        return await Guestbook.deleteOne({ feedId })
    }
}
exports.topMark = async () => {
    const userMarkList = await User.find({}, { _id: false, mark: true })
    let arr1 = []
    let result = {}
    userMarkList.map((value) => {
        arr1.push(...value.mark)
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
    // console.log(arr2)
    let topMarkArr = []
    for (let i = 0; i < arr2.length; i++) {
        if (i % 2 === 0) {
            topMarkArr.push(arr2[i])
        }
    }
    // console.log("topMarkArr: " + topMarkArr)
    let topMarkList = []
    for (let i = 0; i < topMarkArr.length; i++) {
        const markData = await Data.find({ dataId: topMarkArr[i] }, { _id: false, dataId: true, name: true, desire: true })
        topMarkList.push(markData)
    }
    // console.log("topMarkList: " + topMarkList)
    const markListCleansing = []
    topMarkList.map((value) => {
        markListCleansing.push(...value)
    })
    // console.log(markListCleansing)

    return markListCleansing
}
