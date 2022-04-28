const { updateUserInfo } = require("../services/user.service")

exports.getUsers = async (req, res) => {
    return res.status(200)
}
exports.postUsers = async (req, res) => {
    return res.status(200)
}
exports.putUsers = async (req, res) => {
    try {
        const { userId } = res.locals
        const { target, obstacle, lifeCycle } = req.body
        updateUserInfo({ target, obstacle, lifeCycle, userId })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            result: false,
            message: "회원가입 중 오류가 발생했습니다.",
        })
    }
}
exports.deleteUsers = async (req, res) => {
    return res.status(200)
}
