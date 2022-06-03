const nodemailer = require("nodemailer")

exports.mailSender = async (param) => {
    if (process.env.NODE_ENV === "test") {
        return new Promise((resolve, reject) => {
            const mailConfig = {
                host: "smtp.ethereal.email",
                port: 587,
                auth: {
                    user: process.env.TEST_MAIL_ID,
                    pass: process.env.TEST_MAIL_PW,
                },
            }
            const mailOptions = {
                from: process.env.MAIL_ID, // 보내는 메일의 주소
                to: param.toEmail, // 수신할 이메일
                subject: param.subject, // 메일 제목
                html: param.text, // 메일 내용
            }
            const transporter = nodemailer.createTransport(mailConfig)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error)
                    reject()
                } else {
                    resolve()
                }
            })
        })
    } else {
        return new Promise((resolve, reject) => {
            const mailConfig = {
                service: "naver", // 메일 보내는 곳
                prot: 587,
                host: "smtp.naver.com",
                secure: false,
                requireTLS: true,
                auth: {
                    user: process.env.MAIL_ID, // 보내는 메일의 주소
                    pass: process.env.MAIL_PW, // 보내는 메일의 비밀번호
                },
            }
            const mailOptions = {
                from: process.env.MAIL_ID, // 보내는 메일의 주소
                to: param.toEmail, // 수신할 이메일
                subject: param.subject, // 메일 제목
                html: param.text, // 메일 내용
            }
            const transporter = nodemailer.createTransport(mailConfig)
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error)
                    reject()
                } else {
                    console.log("Email sent: " + info.response)
                    resolve()
                }
            })
        })
    }
}
