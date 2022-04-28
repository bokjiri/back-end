const User = require("../schemas/user")

exports.updateUserInfo = async (target, obstacle, lifeCycle, userId) => {
    try {
        return await User.updateOne({ userId }, { $set: { target, obstacle, lifeCycle } })
    } catch (error) {
        console.log(error)
    }
}
exports.findUser = async (email) => {
    try {
        return await User.findOne({ email })
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
