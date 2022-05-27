const User = require("../../../schemas/user")
const BokjiApi = require("../../../schemas/data")
const Client = require("../../../schemas/redis")
const { classifyPeriod } = require("../../../openAPI/youthAPI/controllers/youth.controller")
const nodemailer = require("nodemailer")

redisSet = async (userId) => {
    const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
    const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    const redisInsertMark = JSON.stringify(checkMark)
    await Client.set(userId, redisInsertMark)
    await Client.expire(userId, 7200)
}

exports.showMarkRedis = async (userId) => {
    await redisSet(userId)
}
exports.pushMarkRedis = async (userId) => {
    await redisSet(userId)
}
exports.deleteMarkRedis = async (userId) => {
    await redisSet(userId)
}
// exports.topLikesMarkRedis = async (userId) => {
//     const markInfo = await User.findOne({ userId }, { _id: false, topLikeMarkList: true })
//     const topLikesMarkList = JSON.stringify(markInfo)
//     await Client.set("topMarkList", topLikesMarkList)
// }

exports.showMark = async (userId) => {
    try {
        const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
        return await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    } catch (err) {}
}

exports.pushMark = async (userId, dataId) => {
    try {
        const { mark } = await User.findOne({ userId }, { _id: false, mark: true })
        if (!mark.includes(dataId)) {
            return User.updateOne(
                { userId },
                {
                    $push: { mark: [dataId] },
                }
            )
        } else if (mark.includes(dataId)) {
            return User.updateOne(
                { userId },
                {
                    $pullAll: { mark: [dataId] },
                }
            )
        }
    } catch (err) {
        // console.log(err)
        return err
    }
}

exports.deleteMark = async (userId, dataId) => {
    try {
        const checkId = await User.findOne({ userId }, { _id: false, mark: true })
        if (checkId.mark.includes(dataId))
            return await User.updateOne(
                { userId },
                {
                    $pullAll: { mark: [dataId] },
                }
            )
    } catch (err) {
        // console.log(err)
    }
}

exports.dataCheck = async (dataId) => {
    try {
        return await BokjiApi.findOne({ dataId }, { _id: false, dataId: true, bookmarkState: true })
    } catch (error) {
        // console.log(error)
        return error
    }
}

exports.markPush = async () => {
    try {
        let period
        let datePeriod
        let endDate
        const dataList = await BokjiApi.find({})
        const today = new Date()
        let dataName = []
        let targetUserList = []
        for (let i of dataList) {
            const dataPeriod = await classifyPeriod(i.period)
            if (Array.isArray(dataPeriod)) {
                period = dataPeriod[1]
                datePeriod = `20${period[0]}${period[1]}-${period[2]}${period[3]}-${period[4]}${period[5]}`
                endDate = new Date(datePeriod)
                const result = endDate - today
                const dDay = Math.floor(result / (1000 * 60 * 60 * 24))
                if (dDay <= 7) {
                    dataName.push(i.name)
                    const targetUser = await User.find({ mark: i.dataId }, { _id: false, nickname: true, email: true })
                    targetUserList.push(...targetUser)
                }
            }
        }
        for (let v of targetUserList) {
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
                    to: v.email, // 수신할 이메일
                    subject: "(복세편살)북마크 한 정책에 신청기간이 D-7 남았습니다!", // 메일 제목
                    text: `신청기간 D-7 정책리스트: ${dataName} \n복세편살 사이트 바로가기:https://boksei.com/`, // 메일 내용
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
    } catch (err) {}
}
