const User = require("../../../schemas/user")
const Geustbook = require("../../../schemas/guestbook")
const Client = require("../../../schemas/redis")
const mainController = require("../../policies/controllers/main.controller")
const mainService = require("../../policies/services/main.service")
const AWSXray = require("aws-xray-sdk")

exports.redisSetUser = async (userId, data) => {
    return await AWSXray.captureAsyncFunc("redisSetUser", async (seg) => {
        try {
            if (data) {
                const redisInsertUser = JSON.stringify(data)
                return Client.set(`user${userId}`, redisInsertUser, { EX: 720 })
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
                return Client.set(`user${userId}`, redisInsertUser, { EX: 720 })
            }
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.redisSetMain = async (userId) => {
    return await AWSXray.captureAsyncFunc("redisSetMain", async (seg) => {
        try {
            const isUser = await mainService.checkUser(userId)
            const isData = await mainService.checkData(isUser)
            const checkedData = await mainController.logic(isUser, isData)
            const { work, health, houseLife, eduCare, etc, safetyRight } = await mainController.categorize(checkedData)
            const redisInsertMain = JSON.stringify({ checkedData, work, houseLife, health, eduCare, safetyRight, etc })
            return Client.set(`main${userId}`, redisInsertMain, { EX: 720 })
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.updateUserInfo = async (userId, age, gender, region, disability, obstacle, job, marriage, target, salary, scholarship, family, workType) => {
    return await AWSXray.captureAsyncFunc("updateUserInfo", async (seg) => {
        try {
            const check = await this.checkById(userId)
            if (!check) throw new Error()
            return User.updateOne(
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
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.deleteUserInfo = async (userId) => {
    return await AWSXray.captureAsyncFunc("deleteUserInfo", async (seg) => {
        try {
            const check = await this.checkById(userId)
            if (!check) throw new Error()
            await Geustbook.deleteMany({ userId })
            return User.deleteOne({ userId })
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.checkByEmail = async (email) => {
    return await AWSXray.captureAsyncFunc("checkByEmail", async (seg) => {
        try {
            return User.findOne({ email }, { _id: false, __v: false })
        } catch (error) {
            return error
        } finally {
            seg.close()
        }
    })
}
exports.checkById = async (userId) => {
    return await AWSXray.captureAsyncFunc("checkById", async (seg) => {
        try {
            return User.findOne({ userId }, { _id: false, __v: false })
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.createUser = async (email, nickname, profileUrl) => {
    return await AWSXray.captureAsyncFunc("createUser", async (seg) => {
        try {
            return User.create({ email, nickname, profileUrl })
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
exports.createItselfUser = async (email, nickname, password) => {
    return await AWSXray.captureAsyncFunc("createItselfUser", async (seg) => {
        try {
            return User.create({ email, nickname, password })
        } catch (error) {
            throw error
        } finally {
            seg.close()
        }
    })
}
