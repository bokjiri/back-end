const User = require("../schemas/user")
const BokjiAPI = require("../schemas/user")

exports.postipService = async (userId, dataId) => {
    try {
        const data = await BokjiAPI.findOne({ dataId }, { _id: false, dataId: true })
        if (!data) throw new Error()

        const { dismatchData } = await User.findOne({ userId }, { _id: false, dismatchData: true })
        if (dismatchData.includes(dataId)) throw new Error()

        return await User.updateOne(
            { userId },
            {
                $push: {
                    dismatchData: [dataId],
                },
            }
        )
    } catch (err) {
        // console.log(err)
    }
}
