const axios = require("axios")
const convert = require("xml-js")
const schedule = require("node-schedule")
const moment = require("moment")
const newYouthApiDataDate = moment().format("YYYY-MM-DD")
const Data = require("../../schemas/data")
const { classifyPeriod, classifyWorkType, classifyAge, classifyDesire, classifyGender } = require("./controllers/youth.controller")
const { regionCode, regionName } = require("../category/region")
const dirrr = process.env.UPDATE_DATA_LOG || "./openAPI/youthAPI/youth.txt"
const fs = require("fs")
const dir = `${dirrr}${newYouthApiDataDate}.log`
const { Logger } = require("../../logging")

module.exports = () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.hour = 10
    rule.minute = 10
    rule.second = 10
    rule.tz = "Asia/Seoul"

    schedule.scheduleJob(rule, async () => {
        fs.truncate(dir, () => {
            console.log("File Content Deleted")
        })
        const myConsole = new console.Console(fs.createWriteStream(dir))
        myConsole.log("load start")
        await load(myConsole)
        myConsole.log("load done")
        await findPastData(myConsole)
        myConsole.log("findPastData done")
    })
}

async function findPastData(myConsole) {
    const data = await Data.find()
    for (checkPastData of data) {
        if (checkPastData.period !== undefined) {
            const checkPeriod = await classifyPeriod(checkPastData.period)
            if (!checkPeriod) {
                const checkRemove = await Data.deleteOne({ dataId: checkPastData.dataId })
                myConsole.log("checkRemove", checkRemove)
                myConsole.log("removeData", checkPastData)
            }
        }
    }
}

async function load(myConsole) {
    try {
        for (let i = 1; i < 3; i++) {
            for (let j = 0; j < regionCode.length; j++) {
                let url = "https://www.youthcenter.go.kr/opi/empList.do"
                let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
                queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(i) /* */
                queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */
                queryParams += "&" + encodeURIComponent("srchPolyBizSecd") + "=" + encodeURIComponent(regionCode[j]) /* */

                const response = await axios.get(url + queryParams)
                const data = response.data
                const xmlToJson = convert.xml2json(data, {
                    compact: true,
                    space: 4,
                })
                const jsonParse = JSON.parse(xmlToJson)
                const empsInfo = jsonParse.empsInfo.emp
                if (Array.isArray(empsInfo)) {
                    for (let k of empsInfo) {
                        const name = k.polyBizSjnm._cdata //정책명
                        const check = await Data.findOne({ name })
                        const re = /2021|2020|2019|2018/
                        if (
                            !check &&
                            k.accrRqisCn._cdata.search(/제한없음/) !== -1 && //학력
                            k.majrRqisCn._cdata === "제한없음" && //전공
                            /^http/.test(k.rqutUrla._cdata) && // 링크
                            name.search(re) === -1 && //정책명
                            k.rqutPrdCn._cdata.search(re) === -1 && //신청날짜
                            k.sporCn._cdata.search(re) === -1 && //내용
                            k.rqutProcCn._cdata.search(re) === -1 && //신청절차
                            k.jdgnPresCn._cdata.search(re) === -1 && //심사발표
                            (/^미취업자$/.test(k.empmSttsCn._cdata) || /^제한없음$/.test(k.empmSttsCn._cdata)) //참여요건 - 취업상태
                        ) {
                            // myConsole.log("기관 및 지자체 구분", k.polyBizTy._cdata)
                            // myConsole.log("참여요건 - 전공", k.majrRqisCn._cdata)
                            // myConsole.log("참여요건 - 특화분야", k.cnsgNmor._cdata)
                            // myConsole.log("신청절차", k.rqutProcCn._cdata)
                            // myConsole.log("심사발표", k.jdgnPresCn._cdata)
                            // myConsole.log("지원규모", k.sporScvl._cdata)
                            const resultPeriod = await classifyPeriod(k.rqutPrdCn._cdata)

                            if (resultPeriod === false || resultPeriod === undefined) continue

                            let job // 참여요건 - 취업상태
                            if (k.empmSttsCn._cdata !== "제한없음") job = k.empmSttsCn._cdata // 참여요건 - 취업상태
                            let scholarship // 참여요건 - 학력
                            if (k.accrRqisCn._cdata !== "제한없음") scholarship = k.accrRqisCn._cdata // 참여요건 - 학력
                            const institution = k.cnsgNmor._cdata // 신청기관명
                            const link = k.rqutUrla._cdata // 사이트 링크 주소
                            const support = k.sporCn._cdata // 지원내용
                            const region = regionName[j] // 지역
                            const process = k.rqutProcCn._cdata
                            const period = k.rqutPrdCn._cdata
                            const ageInfo = k.ageInfo._cdata
                            const age = classifyAge(ageInfo)

                            const gender = classifyGender(name)

                            const desireInfo = k.plcyTpNm._cdata //k.plcyTpNm._cdata = 정책유형
                            const desire = classifyDesire(desireInfo)

                            const summary = k.polyItcnCn._cdata //정책소개
                            const workType = classifyWorkType(name, summary)
                            Promise.all([age, gender, desire, workType]).then(async ([age, gender, desire, workType]) => {
                                myConsole.log("기관 및 지자체 구분", k.polyBizTy._cdata)
                                myConsole.log("참여요건 - 전공", k.majrRqisCn._cdata)
                                myConsole.log("참여요건 - 특화분야", k.cnsgNmor._cdata)
                                myConsole.log("신청절차", k.rqutProcCn._cdata)
                                myConsole.log("심사발표", k.jdgnPresCn._cdata)
                                myConsole.log("지원규모", k.sporScvl._cdata)
                                myConsole.log("정책 ID", k.bizId._text)
                                myConsole.log("지역 ID", k.polyBizSecd._text)
                                myConsole.log("regioncode", regionCode[j])
                                myConsole.log({ page: i })
                                myConsole.log({ name })
                                myConsole.log({ age })
                                myConsole.log({ summary })
                                myConsole.log({ desire })
                                myConsole.log({ job })
                                myConsole.log({ workType })
                                myConsole.log({ scholarship })
                                myConsole.log({ institution })
                                myConsole.log({ region })
                                myConsole.log({ link })
                                myConsole.log({ support })
                                myConsole.log({ gender })
                                myConsole.log({ period })
                                myConsole.log({ 심사발표: k.jdgnPresCn._cdata })
                                myConsole.log({ process })
                                myConsole.log("-------------------")

                                await Data.create({
                                    age,
                                    name,
                                    summary,
                                    desire,
                                    job,
                                    scholarship,
                                    institution,
                                    region,
                                    link,
                                    support,
                                    gender,
                                    period,
                                    process,
                                    workType,
                                })
                            })
                        } else {
                            continue
                        }
                    }
                }
            }
        }
    } catch (error) {
        Logger.error(error)
    }
}
