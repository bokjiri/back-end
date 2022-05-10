require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
const moment = require("moment")
const schedule = require("node-schedule")
const { regionCode, regionName } = require("./area")
const newYouthApiDataDate = moment().format("YYYY-MM-DD")
connect()
const fs = require("fs")
fs.truncate(`./openAPI/${newYouthApiDataDate}.txt`, () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream(`./openAPI/${newYouthApiDataDate}.txt`))
module.exports = () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.hour = 10
    // rule.minute = 30
    // rule.second = 15
    rule.tz = "Asia/Seoul"
    schedule.scheduleJob(rule, () => {
        updateData()
    })
}

async function updateData() {
    myConsole.log("load start")
    await load()
    myConsole.log("load done")
    await findPastData()
    myConsole.log("findPastData done")
}
async function load() {
    for (let i = 1; i < 3; i++) {
        for (let j = 0; j < regionCode.length; j++) {
            await load2(i, regionCode[j], regionName[j])
        }
    }
}
async function load2(page, regionCode, regionName) {
    let url = "https://www.youthcenter.go.kr/opi/empList.do"
    let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(page) /* */
    queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */
    queryParams += "&" + encodeURIComponent("srchPolyBizSecd") + "=" + encodeURIComponent(regionCode) /* */

    await request(
        {
            url: url + queryParams,
            method: "get",
        },
        async function (error, response, body) {
            const result = body
            const xmlToJson = convert.xml2json(result, {
                compact: true,
                space: 4,
            })
            const jsonParse = JSON.parse(xmlToJson)

            // let total = jsonParse.empsInfo.totalCnt._text
            // let pageIndex = jsonParse.empsInfo.pageIndex._text
            const empsInfo = jsonParse.empsInfo.emp
            if (Array.isArray(empsInfo)) {
                for (i of empsInfo) {
                    let name = i.polyBizSjnm._cdata //정책명
                    const check = await Data.findOne({ name })
                    if (check) continue
                    if (
                        i.accrRqisCn._cdata.search(/제한없음/) !== -1 && //학력
                        i.majrRqisCn._cdata === "제한없음" && //전공
                        /^http/.test(i.rqutUrla._cdata) && // 링크
                        i.polyBizSjnm._cdata.search(/2021|2020/) === -1 && //정책명
                        i.rqutPrdCn._cdata.search(/2021|2020/) === -1 && //신청날짜
                        i.sporCn._cdata.search(/2021|2020/) === -1 && //내용
                        i.rqutProcCn._cdata.search(/2021|2020/) === -1 && //신청절차
                        i.jdgnPresCn._cdata.search(/2021|2020/) === -1 && //심사발표
                        (/^미취업자$/.test(i.empmSttsCn._cdata) || /^제한없음$/.test(i.empmSttsCn._cdata)) //참여요건 - 취업상태
                    ) {
                        // myConsole.log("기관 및 지자체 구분", i.polyBizTy._cdata)
                        // myConsole.log("참여요건 - 전공", i.majrRqisCn._cdata)
                        // myConsole.log("참여요건 - 특화분야", i.cnsgNmor._cdata)
                        // myConsole.log("신청절차", i.rqutProcCn._cdata)
                        // myConsole.log("심사발표", i.jdgnPresCn._cdata)
                        // myConsole.log("지원규모", i.sporScvl._cdata)
                        const resultPeriod = await classifyPeriod(i.rqutPrdCn._cdata)

                        if (resultPeriod === false || resultPeriod === undefined) continue

                        let age = []
                        if (/~/.test(i.ageInfo._cdata)) {
                            age = i.ageInfo._cdata.split("~")
                            age[0] = age[0].replace(/[^0-9]/g, "")
                            if (!age[0]) age[0] = "0"
                            age[1] = age[1].replace(/[^0-9]/g, "")
                            if (!age[1]) age[1] = "999"
                            // console.log("~.test", age, i.ageInfo._cdata)
                        } else if (/제한없음/.test(i.ageInfo._cdata)) {
                            // console.log("제한없음", i.ageInfo._cdata)
                        } else if (/이상/.test(i.ageInfo._cdata) && /[^이하]/.test(i.ageInfo._cdata)) {
                            age[0] = i.ageInfo._cdata.replace(/[^0-9]/g, "")
                            age[1] = "999"
                            // console.log("이상", i.ageInfo._cdata, age)
                        } else if (/[^이상]/.test(i.ageInfo._cdata) && /이하/.test(i.ageInfo._cdata)) {
                            age[0] = "0"
                            age[1] = i.ageInfo._cdata.replace(/[^0-9]/g, "")
                            // console.log("이하", i.ageInfo._cdata, age)
                        } else {
                            age = i.ageInfo._cdata
                            console.log("else", i.ageInfo._cdata)
                        }

                        let gender
                        if (i.polyBizSjnm._cdata.search(/여성|출산/) !== -1) {
                            gender = "여성"
                        }

                        let desire //i.plcyTpNm._cdata = 정책유형
                        if (i.plcyTpNm._cdata === "취업지원" || i.plcyTpNm._cdata === "창업지원") {
                            desire = "일자리"
                        } else if (i.plcyTpNm._cdata === "주거·금융") {
                            desire = "주거 및 일상생활"
                        } else if (i.plcyTpNm._cdata === "생활·복지") {
                            desire = "건강"
                        } else if (i.plcyTpNm._cdata === "정책참여") {
                            desire = "안전 및 권익보장"
                        } else if (i.plcyTpNm._cdata === "코로나19") {
                            desire = "기타"
                        }

                        // let total = i.totalCnt._cdata //총건수

                        let summary = i.polyItcnCn._cdata //정책소개
                        let job // 참여요건 - 취업상태
                        if (i.empmSttsCn._cdata !== "제한없음") job = i.empmSttsCn._cdata // 참여요건 - 취업상태
                        let scholarship // 참여요건 - 학력
                        if (i.accrRqisCn._cdata !== "제한없음") scholarship = i.accrRqisCn._cdata // 참여요건 - 학력
                        let institution = i.cnsgNmor._cdata // 신청기관명
                        let link = i.rqutUrla._cdata // 사이트 링크 주소
                        let support = i.sporCn._cdata // 지원내용
                        let region = regionName // 지역
                        let process = i.rqutProcCn._cdata
                        let period = i.rqutPrdCn._cdata
                        // myConsole.log({ total })
                        // myConsole.log({ pageIndex })
                        myConsole.log({ page })
                        myConsole.log({ name })
                        myConsole.log({ age })
                        myConsole.log({ summary })
                        myConsole.log({ desire })
                        myConsole.log({ job })
                        myConsole.log({ scholarship })
                        myConsole.log({ institution })
                        myConsole.log({ region })
                        myConsole.log({ link })
                        myConsole.log({ support })
                        myConsole.log({ gender })
                        myConsole.log({ period })
                        myConsole.log({ 심사발표: i.jdgnPresCn._cdata })
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
                        })
                    } else {
                        continue
                    }
                }
            }
        }
    )
}
async function findPastData() {
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
async function classifyPeriod(period3) {
    let period1
    let period2 = []
    let resultPeriod
    if (/~/.test(period3)) {
        period1 = period3.split("~")
        resultPeriod = await deletePastPeriod(period1, period2)
    } else if (/-/.test(period3) && period3 !== 1) {
        period1 = period3.split("-")
        resultPeriod = await deletePastPeriod(period1, period2)
    } else if (/\//.test(period3)) {
        period1 = period3.split("/")
        resultPeriod = await deletePastPeriod(period1, period2)
    } else if (/수시/.test(period3)) {
        resultPeriod = period3
    } else if (/상시/.test(period3)) {
        resultPeriod = period3
    } else if (/연중/.test(period3)) {
        resultPeriod = period3
    } else if (/\./.test(period3)) {
        period1 = period3.split(/\D/).filter(Boolean)
        if (period1.length === 1) {
            return undefined
        }
        if (period1.length === 2) {
            period1[2] = "30"
        }
        if (period1.length > 3) {
            return undefined
        }
        if (String(period1[0]).length === 4) {
            period1[0] = String(period1[0][2]) + String(period1[0][3])
        }
        if (String(period1[1]).length === 1) {
            period1[1] = "0" + String(period1[1])
        }
        if (String(period1[2]).length === 1) {
            period1[2] = "0" + String(period1[2])
        }

        period1 = Number(period1.join(""))
        const date = moment().format("YYMMDD")
        const dateNum = Number(date)
        if (dateNum < period1) resultPeriod = period1
    }
    return resultPeriod
}

async function deletePastPeriod(period1, period2) {
    const date = moment().format("YYMMDD")
    const dateNum = Number(date)
    period2[0] = period1[0].split(/\D/).filter(Boolean)
    period2[1] = period1[1].split(/\D/).filter(Boolean)
    if (period2[0][0] === "2022") period2[0][0] = period2[0][0].replace("2022", "22")
    if (period2[1][0] === "2022") period2[1][0] = period2[1][0].replace("2022", "22")
    if (period2[0].length !== period2[1].length) {
        period2[1].unshift(period2[0][0])
    } else if (period2[0][0] > period2[1][0]) {
        period2[1].unshift(period2[0][0])
        period2[1].pop()
    }
    if (String(period2[0][1]).length === 1) {
        period2[0][1] = "0" + period2[0][1]
    }
    if (String(period2[0][2]).length === 1) {
        period2[0][2] = "0" + period2[0][2]
    }
    if (String(period2[1][1]).length === 1) {
        period2[1][1] = "0" + period2[1][1]
    }
    if (String(period2[1][2]).length === 1) {
        period2[1][2] = "0" + period2[1][2]
    }
    if (period2[1].length === 2 && period2[0].length === 2) {
        period2[1].push("30")
        period2[0].push("30")
        period2[1] = period2[1].join("")
        if (Number(period2[1]) > dateNum) {
            return period2
        } else {
            return false
        }
    } else if (period2[1] === 3 && period2[0] === 3) {
        period2[1] = period2[1].join("")
        if (Number(period2[1]) > dateNum) {
            return period2
        } else {
            return false
        }
    } else {
        return false
    }
}
