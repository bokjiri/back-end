const { updateUserInfo } = require("../services/user.service")
const jwt = require("jsonwebtoken")
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
exports.kakaoCallback = async (req, res) => {
    const { user } = req.session.passport
    const { userId, nickname, profileUrl } = user
    const payload = { userId, nickname, profileUrl }
    const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
        expiresIn: process.env.ATOKENEXPIRE,
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESHKEY, {
        expiresIn: process.env.RTOKENEXPIRE,
    })
    res.header("Access-Control-Allow-Origin", "http://localhost:3000")
    res.header("Access-Control-Allow-Credentials", true)
    res.cookie("ACCESS_TOKEN", accessToken, {
        sameSite: "None",
        httpOnly: true,
        secure: true,
    })
    res.cookie("REFRESH_TOKEN", refreshToken, {
        sameSite: "None",
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ result: true, accessToken, refreshToken })
}
