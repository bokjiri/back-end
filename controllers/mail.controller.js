const bcrypt = require("bcrypt")
const { mailSender } = require("../services/mail.service")
const { checkByEmail } = require("../services/user.service")
exports.sendMail = async (req, res, next) => {
    try {
        const { email } = req.body
        const exEmail = await checkByEmail(email)
        if (exEmail) throw new Error()
        const authCode = Math.random().toString().substring(2, 6)
        const hashAuthCode = await bcrypt.hash(authCode, 12)

        const emailParam = {
            toEmail: email,
            subject: "인증번호 관련 메일입니다. From 복세편살",
            text: authCode,
        }
        await mailSender(emailParam)
        res.cookie("hashAuthCode", hashAuthCode, { maxAge: 180000 })
        res.status(200).json({
            result: true,
            message: "메일전송성공",
        })
    } catch (error) {
        console.error(error)
        return next({
            message: "메일전송실패",
            stack: error,
        })
    }
}
exports.certAuth = async (req, res, next) => {
    try {
        const { certCode } = req.body
        const { hashAuthCode } = req.cookies
        if (bcrypt.compareSync(certCode, hashAuthCode)) {
            res.status(201).json({
                result: true,
                message: "인증성공",
            })
        } else {
            throw new Error()
        }
    } catch (error) {
        return next({
            message: "메일인증실패",
            stack: error,
        })
    }
}
