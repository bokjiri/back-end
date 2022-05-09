const { postTip } = require("../services/tip.service")
exports.postTips = async (req, res) => {
    try {
        const { dataId } = req.body
        const { userId } = res.locals
        postTip(userId, dataId)
        res.status(200).json({ message: "버그제보를 완료했습니다." })
    } catch (err) {
        res.status(400).json({ message: "버그제보를 실패했습니다." })
    }
}
