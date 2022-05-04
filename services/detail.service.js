const Data = require("../schemas/data")

exports.findData = async (dataId) => {
    try {
        const data = await Data.findOne({ dataId }, { _id: false, __v: false })
        if (!data) throw new Error()
        return data
    } catch (error) {
        console.log(error)
    }
}
