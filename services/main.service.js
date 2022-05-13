const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")
const today = new Date()

exports.checkUser = async (userId) => {
    const [userData] = await User.find({ userId }, { _id: false, __v: false, likeMark: false, email: false, nickname: false, profileUrl: false, topLikeMarkList: false })
    // 만 나이 계산
    let birthDate = new Date(+String(userData.age).slice(0, 4), +String(userData.age).slice(4, 6) - 1, +String(userData.age).slice(6, 8) + 1)
    userData.age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        userData.age--
    }

    // 계산된 만 나이에 맞는 lifeCycle 추가
    if (userData.age >= 0 && userData.age < 5) {
        userData.lifeCycle.push("영유아")
    }
    if (userData.age >= 6 && userData.age < 12) {
        userData.lifeCycle.push("아동")
    }
    if (userData.age >= 13 && userData.age < 18) {
        userData.lifeCycle.push("청소년")
    }
    if (userData.age >= 19 && userData.age < 39) {
        userData.lifeCycle.push("청년")
    }
    if (userData.age >= 40 && userData.age < 64) {
        userData.lifeCycle.push("중장년")
    }
    if (userData.age >= 65) {
        userData.lifeCycle.push("노년")
    }

    return userData
}

exports.checkData = async (isUser) => {
    const data = await BokjiApi.find({})

    for (let j = 0; j < data.length; j++) {
        if (isUser.mark.includes(data[j].dataId) === true) {
            data[j].bookmarkState = true
        }
    }

    return data
}
