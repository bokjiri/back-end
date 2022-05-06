const User = require("../schemas/user")

exports.updateUserInfo = async (userId, lifeCycle, gender, region, disability, obstacle) => {
    try {
        const check = await this.checkById(userId)
        if (check === undefined) throw new Error()
        return await User.updateOne({ userId }, { $set: { lifeCycle, gender, region, disability, obstacle } })
    } catch (error) {
        console.log(error)
    }
}
exports.deleteUserInfo = async (userId) => {
    try {
        const check = await this.checkById(userId)
        if (check === undefined) throw new Error()
        return await User.deleteOne({ userId })
    } catch (error) {
        console.log(error)
    }
}
exports.checkByEmail = async (email) => {
    try {
        const user = await User.find({ email }, { _id: false, __v: false })
        if (!user) throw new Error()
        return user
    } catch (error) {
        console.log(error)
    }
}
exports.checkById = async (userId) => {
    try {
        const user = await User.findOne({ userId }, { _id: false, __v: false })
        if (!user) throw new Error()
        return user
    } catch (error) {
        console.log(error)
    }
}
exports.createUser = async (email, nickname, profileUrl) => {
    try {
        return await User.create({ email, nickname, profileUrl })
    } catch (error) {
        console.log(error)
    }
}
