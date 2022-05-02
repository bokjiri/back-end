const { postTip } = require("../services/tip.service")
exports.postTips = async (req, res) => {
    const { userId, dataId } = req.body
    postTip(userId, dataId)
    res.status(200).json({ message: "버그제보를 완료했습니다." })
}
