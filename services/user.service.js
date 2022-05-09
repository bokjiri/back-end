const User = require("../schemas/user")

exports.updateUserInfo = async (userId, age, gender, region, disability, obstacle, job, marriage, target, salary, scholarship) => {
    try {
        const check = await this.checkById(userId)
        if (!check) throw new Error()
        return await User.updateOne({ userId }, { $set: { age, gender, region, disability, obstacle, job, marriage, target, salary, scholarship } })
    } catch (error) {
        console.error(error)
    }
}
exports.deleteUserInfo = async (userId) => {
    try {
        const check = await this.checkById(userId)
        if (!check) throw new Error()
        return await User.deleteOne({ userId })
    } catch (error) {
        console.error(error)
    }
}
exports.checkByEmail = async (email) => {
    try {
        return await User.findOne({ email }, { _id: false, __v: false })
    } catch (error) {
        console.error(error)
    }
}
exports.checkById = async (userId) => {
    try {
        return await User.findOne({ userId }, { _id: false, __v: false })
    } catch (error) {
        console.error(error)
    }
}
exports.createUser = async (email, nickname, profileUrl) => {
    try {
        return await User.create({ email, nickname, profileUrl })
    } catch (error) {
        console.error(error)
    }
}
