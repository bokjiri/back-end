const User = require("../schemas/user")

exports.postipService = async (userId, dataId) => {
    return await User.updateOne(
        { userId },
        {
            $push: {
                dismatchData: [dataId],
            },
        }
    )
}
