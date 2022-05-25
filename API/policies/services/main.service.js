const User = require("../../../schemas/user")
const BokjiApi = require("../../../schemas/data")
const Client = require("../../../schemas/redis")
const today = new Date()

exports.redisSet = async (userId, checkedData, work, houseLife, health, eduCare, safetyRight, etc) => {
    const redisInsertMain = JSON.stringify({ checkedData, work, houseLife, health, eduCare, safetyRight, etc })
    await Client.set(`main${userId}`, redisInsertMain)
    await Client.expire(`main${userId}`, 3600)
}
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

    if (userData.family === 1 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 194)
        // console.log(userData.salary)
    } else if (userData.family === 2 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 326)
        // console.log(userData.salary)
    } else if (userData.family === 3 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 419)
        // console.log(userData.salary)
    } else if (userData.family === 4 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 512)
        // console.log(userData.salary)
    } else if (userData.family === 5 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 602)
        // console.log(userData.salary)
    } else if (userData.family === 6 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 690)
        // console.log(userData.salary)
    } else if (userData.family === 7 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 778)
        // console.log(userData.salary)
    } else if (userData.family === 8 && userData.salary >= 0) {
        userData.salary = Math.floor((userData.salary * 100) / 865)
        // console.log(userData.salary)
    } else {
        userData.salary = undefined
    }
    if (userData.salary > 200) {
        userData.salary = 201
    }

    return userData
}

exports.checkData = async (isUser) => {
    const newData = await BokjiApi.find({})

    for (let j = 0; j < newData.length; j++) {
        if (isUser.mark.includes(newData[j].dataId) === true) {
            newData[j].bookmarkState = true
        }
    }
    const data = newData.filter((item) => isUser.dismatchData.includes(item.dataId) === false)
    return data
}
