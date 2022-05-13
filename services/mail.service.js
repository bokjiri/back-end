const nodemailer = require("nodemailer")
// 메일발송 객체
const mailSender = {
    // 메일발송 함수
    sendGmail: function (param) {
        const transporter = nodemailer.createTransport({
            service: "naver", // 메일 보내는 곳
            prot: 587,
            host: "smtp.naver.com",
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.MAIL_ID, // 보내는 메일의 주소
                pass: process.env.MAIL_PW, // 보내는 메일의 비밀번호
            },
        })
        // 메일 옵션
        const mailOptions = {
            from: process.env.MAIL_ID, // 보내는 메일의 주소
            to: param.toEmail, // 수신할 이메일
            subject: param.subject, // 메일 제목
            html: param.text, // 메일 내용
        }

        // 메일 발송
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log("Email sent: " + info.response)
            }
        })
    },
}

module.exports = { mailSender }
