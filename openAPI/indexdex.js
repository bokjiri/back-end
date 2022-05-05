require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
const moment = require("moment")

connect()
const fs = require("fs")
const area = require("./area")
fs.truncate("./openAPI/sample.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/sample.txt"))

load()
async function load() {
    for (let i = 0; i < 120; i++) {
        await load2(i)
    }
}
async function load2(page) {
    let url = "https://www.youthcenter.go.kr/opi/empList.do"
    let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(`${page}`) /* */
    queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */

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
            const empsInfo = jsonParse.empsInfo.emp

            for (i of empsInfo) {
                let a = i.cnsgNmor._cdata.substring(0, 2)
                if (a === "남양") a = "남양주"
                if (a === "서귀") a = "서귀포"
                if (a === "동두") a = "동두천"
                if (a === "의정") a = "의정부"

                if (
                    i.majrRqisCn._cdata === "제한없음" && //전공
                    area.indexOf(a) !== -1 && // 지역이 아닌 값
                    /^http/.test(i.rqutUrla._cdata) && // 링크
                    i.polyBizSjnm._cdata.search(/2021|2020/) === -1 && //정책명
                    i.rqutPrdCn._cdata.search(/2021|2020/) === -1 && //신청날짜
                    i.sporCn._cdata.search(/2021|2020/) === -1 && //내용
                    i.rqutProcCn._cdata.search(/2021|2020/) === -1 && //신청절차
                    i.jdgnPresCn._cdata.search(/2021|2020/) === -1 && //심사발표
                    (/^미취업자$/.test(i.empmSttsCn._cdata) || /^제한없음$/.test(i.empmSttsCn._cdata)) //참여요건 - 취업상태
                ) {
                    let name
                    let summary
                    let desire
                    let lifeCycle = []
                    let job
                    let edu
                    let institution
                    let region = a
                    let link
                    let support
                    let target
                    // myConsole.log("기관 및 지자체 구분", i.polyBizTy._cdata)
                    name = i.polyBizSjnm._cdata
                    // myConsole.log("정책명", { name })
                    if (/여성/.test(name)) {
                        target = "여성"
                        // myConsole.log({ target })
                    }

                    summary = i.polyItcnCn._cdata
                    // myConsole.log("정책소개", { summary })
                    if (i.plcyTpNm._cdata === "취업지원" || i.plcyTpNm._cdata === "창업지원") {
                        desire = "일자리"
                        // myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "주거·금융") {
                        desire = "주거 및 일상생활"
                        // myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "생활·복지") {
                        desire = "건강"
                        // myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "정책참여") {
                        desire = "안전 및 권익보장"
                        // myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "코로나19") {
                        desire = "기타"
                        // myConsole.log("정책유형", { desire })
                    }

                    job = i.empmSttsCn._cdata
                    // myConsole.log("참여요건 - 취업상태", { job })
                    edu = i.accrRqisCn._cdata
                    // myConsole.log("참여요건 - 학력", { edu })
                    // myConsole.log("참여요건 - 전공", i.majrRqisCn._cdata)
                    // myConsole.log("참여요건 - 특화분야", i.cnsgNmor._cdata)
                    institution = i.cnsgNmor._cdata
                    // myConsole.log("신청기관명", { institution })

                    // myConsole.log("지역", { region })

                    let period4 = i.rqutPrdCn._cdata
                    // myConsole.log("신청기간", { period4 })

                    let period1
                    let period2 = []
                    let resultPeriod
                    if (/~/.test(i.rqutPrdCn._cdata)) {
                        period1 = i.rqutPrdCn._cdata.split("~")
                        resultPeriod = await period(period1, period2)
                        // if (resultPeriod !== false) myConsole.log("신청기간", { period: resultPeriod })
                    } else if (/-/.test(i.rqutPrdCn._cdata) && i.rqutPrdCn._cdata.length !== 1) {
                        period1 = i.rqutPrdCn._cdata.split("-")
                        resultPeriod = await period(period1, period2)
                        // if (resultPeriod !== false) myConsole.log("신청기간", { period: resultPeriod })
                    } else if (/\//.test(i.rqutPrdCn._cdata)) {
                        period1 = i.rqutPrdCn._cdata.split("/")
                        resultPeriod = await period(period1, period2)
                        // if (resultPeriod !== false) myConsole.log("신청기간", { period: resultPeriod })
                    } else if (/수시/.test(i.rqutPrdCn._cdata)) {
                        resultPeriod = period4
                    } else if (/상시/.test(i.rqutPrdCn._cdata)) {
                        resultPeriod = period4
                    } else if (/연중/.test(i.rqutPrdCn._cdata)) {
                        resultPeriod = period4
                    } else if (/\./.test(i.rqutPrdCn._cdata)) {
                        period1 = i.rqutPrdCn._cdata.split(/\D/).filter(Boolean)
                        if (period1.length === 1) {
                            continue
                        }
                        if (period1.length === 2) {
                            period1[2] = "30"
                        }
                        if (period1.length > 3) {
                            continue
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
                    if (resultPeriod === false) continue
                    if (resultPeriod === undefined) continue

                    // console.log(resultPeriod)
                    // myConsole.log("신청기간1", { period: resultPeriod })
                    // myConsole.log("신청절차", i.rqutProcCn._cdata)
                    // myConsole.log("심사발표", i.jdgnPresCn._cdata)

                    link = i.rqutUrla._cdata
                    // myConsole.log("지원규모", i.sporScvl._cdata)
                    support = i.sporCn._cdata
                    // myConsole.log("지원내용", { support })
                    if (i.ageInfo._cdata.replace(/[^0-9]/g, "").length === 4) {
                        lifeCycle[0] = String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[0]) + String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[1])
                        lifeCycle[1] = String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[2]) + String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[3])
                        // return lifeCycle
                        // myConsole.log("참여요건 - 연령", { lifeCycle })
                    } else if (i.ageInfo._cdata.replace(/[^0-9]/g, "").length === 0) {
                        lifeCycle.push("제한없음")
                        // return lifeCycle
                        // myConsole.log("참여요건 - 연령", { lifeCycle: i.ageInfo._cdata.replace(/[^0-9]/g, "") })
                    }

                    // myConsole.log("사이트 링크 주소", { link })

                    myConsole.log({ page })
                    myConsole.log({ name })
                    myConsole.log({ lifeCycle })
                    myConsole.log({ summary })
                    myConsole.log({ desire })
                    myConsole.log({ job })
                    myConsole.log({ edu })
                    myConsole.log({ institution })
                    myConsole.log({ region })
                    myConsole.log({ link })
                    myConsole.log({ support })
                    myConsole.log({ target })
                    // myConsole.log({ period4 })
                    myConsole.log({ period: period4 })
                    myConsole.log({ 심사발표: i.jdgnPresCn._cdata })
                    myConsole.log("-------------------")
                    // await Data.create({
                    //     lifeCycle,
                    //     name,
                    //     summary,
                    //     desire,
                    //     job,
                    //     edu,
                    //     institution,
                    //     region,
                    //     link,
                    //     support,
                    //     target,
                    //     period,
                    // })
                } else {
                    continue
                }
            }
        }
    )
}

async function period(period1, period2) {
    const date = moment().format("YYMMDD")
    const dateNum = Number(date)
    period2[0] = period1[0].split(/\D/).filter(Boolean)
    period2[1] = period1[1].split(/\D/).filter(Boolean)
    if (period2[0][0] === "2022") period2[0][0] = period2[0][0].replace("2022", "22")
    if (period2[1][0] === "2022") period2[1][0] = period2[1][0].replace("2022", "22")
    if (period2[0][0] === "2021") return false
    if (period2[1][0] === "2021") return false
    if (period2[0][0] === "2020") return false
    if (period2[1][0] === "2020") return false
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
