const userService = require("../services/user.service")
const jwt = require("jsonwebtoken")
// const moment = require("moment")
// const ageValidate = moment().format("YYYYMMDD")

exports.getUsers = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new Error()

        const data = await userService.checkById(userId)
        data.region = data.region.join(" ")
        if (!data) throw new Error()
        res.status(201).json({
            result: true,
            message: "회원정보 조회 완료",
            data,
        })
    } catch (error) {
        console.error(error)
        return next({
            result: false,
            message: "회원정보 조회 중 오류가 발생했습니다.",
        })
    }
}

exports.patchUsers = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new Error()

        const { age, gender, region, disability, obstacle, marriage, target, salary, scholarship, family } = req.body
        // if (age > ageValidate) throw new Error()

        let job = req.body.job
        if (job === "미취업") job = "미취업자"

        let arrRegion = region.split(" ")
        if (arrRegion.length === 4) arrRegion = arrRegion[0]

        const result = await userService.updateUserInfo(userId, age, gender, arrRegion, disability, obstacle, job, marriage, target, salary, scholarship, family)
        if (!result) throw new Error()
        res.status(201).json({
            result: true,
            message: "회원정보 수정 완료",
        })
    } catch (error) {
        console.error(error)
        return next({
            result: false,
            message: "회원정보 수정 중 오류가 발생했습니다.",
        })
    }
}
exports.deleteUsers = async (req, res, next) => {
    try {
        const userId = parseInt(req.params.userId)
        const tokenUserId = res.locals.userId
        if (tokenUserId !== userId) throw new Error()

        const result = await userService.deleteUserInfo(userId)
        if (!result) throw new Error()
        res.status(201).json({
            result: true,
            message: "회원정보 삭제 완료",
        })
    } catch (error) {
        console.error(error)
        return next({
            result: false,
            message: "회원정보 삭제 중 오류가 발생했습니다.",
        })
    }
}
exports.kakaoCallback = async (req, res) => {
    const { user } = req.session.passport
    const { userId, nickname, profileUrl, email } = user
    const payload = { userId, nickname, profileUrl, email }
    const accessToken = jwt.sign(payload, process.env.ACCESSKEY, {
        expiresIn: process.env.ATOKENEXPIRE,
    })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESHKEY, {
        expiresIn: process.env.RTOKENEXPIRE,
    })
    res.status(200).json({ result: true, accessToken, refreshToken })
}
