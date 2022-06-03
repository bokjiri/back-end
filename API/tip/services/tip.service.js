const User = require("../../../schemas/user")
const BokjiAPI = require("../../../schemas/data")
const { pushMarkRedis } = require("../../mark/services/mark.service")

exports.postipService = async (userId, dataId) => {
    try {
        const data = await BokjiAPI.findOne({ dataId }, { _id: false, dataId: true })
        if (!data) throw new Error()

        const markList = await User.find({ userId }, { _id: false, mark: true })
        for (let i of markList) {
            if (i.mark.includes(dataId)) {
                await User.updateOne(
                    { userId },
                    {
                        $pullAll: {
                            mark: [dataId],
                        },
                    }
                )
            }
        }

        await pushMarkRedis(userId)

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
