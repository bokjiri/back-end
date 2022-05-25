const User = require("../../../schemas/user")
const Client = require("../../../schemas/redis")

exports.redisSetUser = async (userId, data) => {
    if (data) {
        const redisInsertUser = JSON.stringify(data)
        await Client.set(`user${userId}`, redisInsertUser)
        await Client.expire(`user${userId}`, 3600)
    } else {
        const userData = await this.checkById(userId)
        const redisInsertUser = JSON.stringify(userData)
        await Client.set(`user${userId}`, redisInsertUser)
        await Client.expire(`user${userId}`, 3600)
    }
}
exports.redisRemoveMain = async (userId) => {
    await Client.del(`main${userId}`)
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
