const { showMark } = require("../services/mark.service")

exports.getMarks = async (req, res) => {
    const { userId } = req.params
    await showMark(userId)
    return res.status(200)
}
exports.postMarks = async (req, res) => {
    return res.status(200)
}
exports.deleteMarks = async (req, res) => {
    return res.status(200)
}
