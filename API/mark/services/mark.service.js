const User = require("../../../schemas/user")
const BokjiApi = require("../../../schemas/data")
const Client = require("../../../schemas/redis")
const { classifyPeriod } = require("../../../openAPI/youthAPI/controllers/youth.controller")
const nodemailer = require("nodemailer")
const schedule = require("node-schedule")

redisSet = async (userId) => {
    const markInfo = await User.findOne({ userId }, { _id: false, mark: true })
    const checkMark = await BokjiApi.find({ dataId: markInfo.mark }, { _id: false, dataId: true, name: true, desire: true })
    const redisInsertMark = JSON.stringify(checkMark)
    await Client.set(userId, redisInsertMark)
    await Client.expire(userId, 720)
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
    } catch (err) {
        throw err
    }
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
        throw err
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
        throw err
        // console.log(err)
    }
}

exports.dataCheck = async (dataId) => {
    try {
        return await BokjiApi.findOne({ dataId }, { _id: false, dataId: true, bookmarkState: true })
    } catch (error) {
        // console.log(error)
        throw err
    }
}
exports.dDayMail = async () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.hour = 8
    rule.minute = 8
    rule.second = 8
    rule.tz = "Asia/Seoul"
    schedule.scheduleJob(rule, async () => {
        console.log("Send Mail!")
        await markPushMail()
        console.log("Done")
    })
}

markPushMail = async () => {
    try {
        let period
        let datePeriod
        let endDate
        const dataList = await BokjiApi.find({})
        const today = new Date()
        // console.log(today)
        let info = []
        let checkDataId = []
        for (let i of dataList) {
            const dataPeriod = await classifyPeriod(i.period)
            if (Array.isArray(dataPeriod)) {
                // console.log(datePeriod)
                period = dataPeriod[1]
                datePeriod = `20${period[0]}${period[1]}-${period[2]}${period[3]}-${period[4]}${period[5]}`
                endDate = new Date(datePeriod)
                const result = endDate - today
                const dDay = Math.floor(result / (1000 * 60 * 60 * 24))
                // console.log(dDay)
                if (dDay === 7) {
                    // console.log(i.name)
                    info.push({ dataName: i.name, dataId: i.dataId })
                    checkDataId.push(i.dataId)
                }
            }
        }
        const targetUsers = await User.find({ mark: { $in: checkDataId } })

        for (let v of targetUsers) {
            let text = []
            for (let markDataId of info) {
                if (v.mark.indexOf(markDataId.dataId) !== -1) {
                    text.push(markDataId.dataName)
                }
            }
            text = text.join(", ")
            setTimeout(function () {
                new Promise((resolve, reject) => {
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
                        text: `${v.nickname}님이 추가하신 북마크의 신청기간이 7일 남았습니다. \n신청기간 D-7 정책리스트: ${text}\n복세편살 사이트 바로가기:https://boksei.com/`, // 메일 내용
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
            }, 1500)
        }
    } catch (err) {
        throw err
    }
}
