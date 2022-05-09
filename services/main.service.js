const User = require("../schemas/user")
const BokjiApi = require("../schemas/data")
const today = new Date()

exports.checkUserId = async (userId) => {
    const [userData] = await User.find({ userId }, { _id: false, lifeCycle: true, target: true, obstacle: true })
    return userData
}

exports.checkBokjiApi = () => {
    return BokjiApi.find({})
}

// exports.checkUserData = async (isUser, isData) => {

//     return result
// }
