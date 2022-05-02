// const { showMark, pushMark, deleteMark, topMark } = require("../services/mark.service")
const { showMark, pushMark, deleteMark, topMark, likemark, showMarkRedis, pushMarkRedis, deleteMarkRedis, topLikesMarkRedis } = require("../services/mark.service")

exports.getMarks = async (req, res) => {
    try {
        const { userId } = req.params
        const userMark = await showMark(userId)
        await showMarkRedis(userId)
        if (!userMark) throw new Error()
        res.status(200).json({ userMark })
    } catch (err) {
        res.status(400).json({ message: "북마크 데이터를 받아 오지 못했습니다." })
    }
}

exports.postMarks = async (req, res) => {
    try {
        const { userId } = req.params
        const { dataId } = req.body
        const checkMark = await pushMark(userId, dataId)
        await pushMarkRedis(userId)
        if (!checkMark) throw new Error()
        res.status(200).json({ message: "SUCCESS" })
    } catch (err) {
        res.status(400).json({ message: "북마크 수정에 실패하였습니다." })
    }
}

exports.deleteMarks = async (req, res) => {
    const { dataId } = req.body
    const { userId } = req.params
    try {
        const checkDelete = await deleteMark(userId, dataId)
        await deleteMarkRedis(userId)
        if (!checkDelete) throw new Error()
        res.status(200).json({ result: "SUCCESS" })
    } catch (err) {
        res.status(400).json({ message: "북마크 삭제를 실패하였습니다." })
    }
}

exports.likeMarks = async (req, res) => {
    try {
        const { userId } = req.params
        const { dataId } = req.body
        await likemark(userId, dataId)
        res.status(200).json({ message: "SUCCESS" })
    } catch (err) {
        res.status(400).json({ message: "FAIL" })
    }
}

exports.topMarks = async (req, res) => {
    try {
        const { userId } = req.body
        const topMarkList = await topMark(userId)
        await topLikesMarkRedis(userId)
        res.status(200).json({ MarkList: topMarkList })
    } catch (err) {
        res.status(400).json({ message: "topMarkList 조회를 실패하였습니다." })
    }
}
