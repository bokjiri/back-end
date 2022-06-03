const User = require("../../../schemas/user")
const Data = require("../../../schemas/data")
const Guestbook = require("../../../schemas/guestbook")
const moment = require("moment-timezone")
moment.tz.setDefault("Asia/Seoul")
const badWord = require("../../../badWord")

async function findFeed(feedId) {
    return await Guestbook.findOne({ feedId })
}

exports.userInfo = async (userId) => {
    const checkUser = await User.findOne({ userId }, { profileUrl: true, nickname: true, userId: true })
    if (!checkUser) throw new Error("누구니???")
    return checkUser
}
exports.getGuestbook = async () => {
    const guestbook = []
    const checkGuestbook = await Guestbook.find({}).sort({ feedId: -1 })
    for (let i of checkGuestbook) {
        guestbook.push({ nickname: i.nickname, profileUrl: i.profileUrl, date: i.date, content: i.content, feedId: i.feedId })
    }
    return guestbook
}
exports.createFeed = async (content, user) => {
    const date = moment().format("YYYY-MM-DD")
    const userId = user.userId
    const nickname = user.nickname
    const profileUrl = user.profileUrl
    const badWordList = badWord
    let result = content
    for (let i of badWordList) {
        const regexp = new RegExp(i, "g")
        if (regexp.test(result)) {
            result = result.replace(regexp, "❤❤")
        }
    }
    const createFeed = await Guestbook.create({ userId, nickname, profileUrl, date, content: result })
    return { nickname: createFeed.nickname, profileUrl: createFeed.profileUrl, date: createFeed.date, content: createFeed.content, feedId: createFeed.feedId }
}
exports.updateFeed = async (feedId, content) => {
    const date = moment().format("YYYY-MM-DD")
    const badWordList = badWord
    let result = content
    for (let i of badWordList) {
        const regexp = new RegExp(i, "g")
        if (regexp.test(result)) {
            result = result.replace(regexp, "❤❤")
        }
    }
    await Guestbook.updateOne({ feedId }, { $set: { date, content: result } })
    const updateFeed = await Guestbook.findOne({ feedId })
    return { nickname: updateFeed.nickname, profileUrl: updateFeed.profileUrl, date: updateFeed.date, content: updateFeed.content, feedId: updateFeed.feedId }
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
