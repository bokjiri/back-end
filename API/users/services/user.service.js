const User = require("../../../schemas/user")
const Geustbook = require("../../../schemas/guestbook")
const Client = require("../../../schemas/redis")
const mainController = require("../../policies/controllers/main.controller")
const mainService = require("../../policies/services/main.service")

exports.redisSetUser = async (userId, data) => {
    if (data) {
        const redisInsertUser = JSON.stringify(data)
        return Client.set(`user${userId}`, redisInsertUser, { EX: 3600 })
    } else {
        const userData = await this.checkById(userId)
        if (!userData) throw new ValidationError("회원정보가 없음")
        if (userData.region.length === 1) userData.region[1] = "시·군을 선택해 주세요"
        if (userData.region.length === 0) {
            userData.region[0] = "시·도를 선택해 주세요"
            userData.region[1] = "시·군을 선택해 주세요"
        }
        if (userData.job[0] === "미취업자") userData.job[0] = "미취업"
        const redisInsertUser = JSON.stringify(userData)
        return Client.set(`user${userId}`, redisInsertUser, { EX: 3600 })
    }
}
exports.redisSetMain = async (userId) => {
    const isUser = await mainService.checkUser(userId)
    const isData = await mainService.checkData(isUser)
    const checkedData = await mainController.logic(isUser, isData)
    const { work, health, houseLife, eduCare, etc, safetyRight } = await mainController.categorize(checkedData)
    const redisInsertMain = JSON.stringify({ checkedData, work, houseLife, health, eduCare, safetyRight, etc })
    return Client.set(`main${userId}`, redisInsertMain, { EX: 3600 })
}
exports.updateUserInfo = async (userId, age, gender, region, disability, obstacle, job, marriage, target, salary, scholarship, family, workType) => {
    try {
        const check = await this.checkById(userId)
        if (!check) throw new Error()
        return await User.updateOne(
            { userId },
            {
                $set: {
                    age,
                    gender,
                    region,
                    disability,
                    obstacle,
                    job,
                    marriage,
                    target,
                    salary,
                    scholarship,
                    family,
                    workType,
                },
            }
        )
    } catch (error) {
        return error
    }
}
exports.deleteUserInfo = async (userId) => {
    try {
        const check = await this.checkById(userId)
        if (!check) throw new Error()
        await Geustbook.deleteMany({ userId })
        return await User.deleteOne({ userId })
    } catch (error) {
        return error
    }
}
exports.checkByEmail = async (email) => {
    try {
        return await User.findOne({ email }, { _id: false, __v: false })
    } catch (error) {
        return error
    }
}
exports.checkById = async (userId) => {
    try {
        return await User.findOne({ userId }, { _id: false, __v: false })
    } catch (error) {
        return error
    }
}
exports.createUser = async (email, nickname, profileUrl) => {
    try {
        return await User.create({ email, nickname, profileUrl })
    } catch (error) {
        return error
    }
}
exports.createItselfUser = async (email, nickname, password) => {
    try {
        return await User.create({ email, nickname, password })
    } catch (error) {
        return error
    }
}
