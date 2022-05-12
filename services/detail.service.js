const Data = require("../schemas/data")

exports.findData = async (dataId) => {
    try {
        return await Data.findOne({ dataId }, { _id: false, __v: false })
    } catch (error) {
        console.error(error)
        return error
    }
}
