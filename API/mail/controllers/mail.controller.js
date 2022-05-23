const bcrypt = require("bcrypt")
const { mailSender } = require("../services/mail.service")
const { checkByEmail } = require("../../users/services/user.service")
class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.name = "ValidationError"
    }
}

exports.sendMail = async (req, res, next) => {
    try {
        const { email } = req.body
        const exEmail = await checkByEmail(email)
        if (exEmail) throw new ValidationError("중복된 이메일입니다.")
        const authCode = Math.random().toString().substring(2, 6)
        const hashAuthCode = await bcrypt.hash(authCode, 12)

        const emailParam = {
            toEmail: email,
            subject: "인증번호 관련 메일입니다. From 복세편살",
            text: authCode,
        }
        await mailSender(emailParam)
        if (process.env.NODE_ENV === "test") {
            res.cookie("hashAuthCode", hashAuthCode, {
                maxAge: 180000,
                sameSite: "None",
                secure: true,
                httpOnly: true,
            })
            res.status(200).json({
                result: true,
                message: "메일전송성공",
                authCode,
            })
        } else {
            res.cookie("hashAuthCode", hashAuthCode, {
                maxAge: 180000,
                sameSite: "None",
                secure: true,
                httpOnly: true,
            })
            res.status(200).json({
                result: true,
                message: "메일전송성공",
            })
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "메일전송중 오류가 발생했습니다.",
                stack: error,
            })
        }
    }
}
exports.certAuth = async (req, res, next) => {
    try {
        const { authCode } = req.body
        const { hashAuthCode } = req.cookies
        if (bcrypt.compareSync(authCode, hashAuthCode)) {
            res.status(201).json({
                result: true,
                message: "인증성공",
            })
        } else {
            throw new ValidationError("인증실패. 잘못된 authCode")
        }
    } catch (error) {
        if (error instanceof ValidationError) {
            return next({
                message: error.message,
                stack: error.stack,
            })
        } else {
            return next({
                message: "메일인증중 오류가 발생했습니다.",
                stack: error,
            })
        }
    }
}
