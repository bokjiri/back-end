const { mailSender } = require("../services/mail.service")

exports.sendMail = async (req, res, next) => {
    try {
        const { email } = req.body

        const emailParam = {
            toEmail: email,
            subject: "New Email From 복세편살",
            text: "hi",
        }
        mailSender.sendGmail(emailParam)
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
