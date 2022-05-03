require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")

connect()
const fs = require("fs")
const area = require("./area")
fs.truncate("./openAPI/chung5.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/chung5.txt"))

let index = 0
load(index)
async function load(index) {
    for (let i = 0; i < 120; i++) {
        await load2(i, index)
    }
}
async function load2(i, index) {
    let url = "https://www.youthcenter.go.kr/opi/empList.do"
    let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(`${i}`) /* */
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

                if (
                    i.majrRqisCn._cdata === "제한없음" &&
                    /[^주관기관과 동일]/.test(i.cnsgNmor._cdata) &&
                    /[^null]/.test(i.cnsgNmor._cdata) &&
                    /[^\-]/.test(i.cnsgNmor._cdata) &&
                    /^[^읍면동]/.test(i.cnsgNmor._cdata) &&
                    /^[가-힣]/.test(i.cnsgNmor._cdata) &&
                    /^[^대한]/.test(i.cnsgNmor._cdata) &&
                    /^[^2018]/.test(i.rqutPrdCn._cdata) &&
                    /^[^2019]/.test(i.rqutPrdCn._cdata) &&
                    /^[^2020]/.test(i.rqutPrdCn._cdata) &&
                    /^[^2021]/.test(i.rqutPrdCn._cdata) &&
                    area.indexOf(a) !== -1 &&
                    /^http/.test(i.rqutUrla._cdata) &&
                    (/^미취업자$/.test(i.empmSttsCn._cdata) || /^제한없음$/.test(i.empmSttsCn._cdata))
                ) {
                    let name
                    let summary
                    let desire
                    let lifeCycle = []
                    let job
                    let edu
                    let institution
                    let region
                    let link
                    let support
                    let target
                    let period
                    myConsole.log("index", index)
                    index++
                    // myConsole.log("기관 및 지자체 구분", i.polyBizTy._cdata)
                    name = i.polyBizSjnm._cdata
                    myConsole.log("정책명", { name })
                    if (/여성/.test(name)) {
                        target = "여성"
                        myConsole.log({ target })
                    }

                    summary = i.polyItcnCn._cdata
                    myConsole.log("정책소개", { summary })
                    if (i.plcyTpNm._cdata === "취업지원" || i.plcyTpNm._cdata === "창업지원") {
                        desire = "일자리"
                        myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "주거·금융") {
                        desire = "주거 및 일상생활"
                        myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "생활·복지") {
                        desire = "건강"
                        myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "정책참여") {
                        desire = "안전 및 권익보장"
                        myConsole.log("정책유형", { desire })
                    } else if (i.plcyTpNm._cdata === "코로나19") {
                        desire = "기타"
                        myConsole.log("정책유형", { desire })
                    }

                    job = i.empmSttsCn._cdata
                    myConsole.log("참여요건 - 취업상태", { job })
                    edu = i.accrRqisCn._cdata
                    myConsole.log("참여요건 - 학력", { edu })
                    myConsole.log("참여요건 - 전공", i.majrRqisCn._cdata)
                    myConsole.log("참여요건 - 특화분야", i.cnsgNmor._cdata)
                    institution = i.cnsgNmor._cdata
                    myConsole.log("신청기관명", { institution })
                    region = i.cnsgNmor._cdata.substring(0, 2)
                    myConsole.log("지역", { region })
                    const period1 = i.rqutPrdCn._cdata.replace(/[^0-9]/g, "")
                    myConsole.log("신청기간", period1)
                    period = i.rqutPrdCn._cdata
                    myConsole.log("신청기간", i.rqutPrdCn._cdata)
                    myConsole.log("신청절차", i.rqutProcCn._cdata)
                    myConsole.log("심사발표", i.jdgnPresCn._cdata)

                    link = i.rqutUrla._cdata
                    myConsole.log("지원규모", i.sporScvl._cdata)
                    support = i.sporCn._cdata
                    myConsole.log("지원내용", { support })
                    if (i.ageInfo._cdata.replace(/[^0-9]/g, "").length === 4) {
                        lifeCycle[0] = String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[0]) + String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[1])
                        lifeCycle[1] = String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[2]) + String(i.ageInfo._cdata.replace(/[^0-9]/g, "")[3])
                        // return lifeCycle
                        myConsole.log("참여요건 - 연령", { lifeCycle })
                    } else if (i.ageInfo._cdata.replace(/[^0-9]/g, "").length !== 4) {
                        lifeCycle.push("제한없음")
                        // return lifeCycle
                        myConsole.log("참여요건 - 연령", { lifeCycle: i.ageInfo._cdata.replace(/[^0-9]/g, "") })
                    }
                    myConsole.log("사이트 링크 주소", { link })
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
