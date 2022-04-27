const User = require("../schemas/user")

exports.updateUserInfo = (target, obstacle, lifeCycle, userId) => {
    try {
        User.updateOne({ userId }, { $set: { target, obstacle, lifeCycle } })
    } catch (error) {
        console.log(error)
    }
}
