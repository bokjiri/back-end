const Data = require("../schemas/data")
const User = require("../schemas/user")

exports.findData = async (dataId) => {
    try {
        return await Data.findOne({ dataId }, { _id: false, __v: false })
    } catch (error) {
        console.error(error)
        return error
    }
}

exports.checkBookmark = async (userId) => {
    try {
        return await User.findOne({ userId }, { _id: false, mark: true })
    } catch (error) {
        console.error(error)
        return error
    }
}
