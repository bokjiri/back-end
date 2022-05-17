require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const moment = require("moment")
const newYouthApiDataDate = moment().format("YYYY-MM-DD")
// const Data = require("../schemas/data")
const { classifyPeriod } = require("../openAPI/index.youth")
const { regionCode, regionName } = require("../openAPI/area")
const apiKey = process.env.CHUNG_KEY
const fs = require("fs")
fs.truncate("./dataUpdating/youth.age.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./dataUpdating/youth.age.txt"))
start()
async function start() {
    console.log("start")

    for (let i = 1; i < 3; i++) {
        for (let j = 0; j < regionCode.length; j++) {
            await load(i, regionCode[j], regionName[j])
        }
    }
    console.log("done")
}
async function load(i, regionCode, regionName) {
    // let url = `https://www.youthcenter.go.kr/opi/empList.do?openApiVlak=${apiKey}&pageIndex=${i}&display=100&srchPolyBizSecd=${regionCode[j]}`
    let url = "https://www.youthcenter.go.kr/opi/empList.do"
    let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(i) /* */
    queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */
    queryParams += "&" + encodeURIComponent("srchPolyBizSecd") + "=" + encodeURIComponent(regionCode) /* */

    const response = await axios.get(url + queryParams)
    // console.log(response)
    const data = response.data
    const xmlToJson = convert.xml2json(data, {
        compact: true,
        space: 4,
    })
    const jsonParse = JSON.parse(xmlToJson)
    // console.log(jsonParse)
    const empsInfo = jsonParse.empsInfo.emp
    if (Array.isArray(empsInfo)) {
        for (let k of empsInfo) {
            const name = k.polyBizSjnm._cdata //정책명
            // const check = await Data.findOne({ name })
            // console.log(!check)
            const re = /2021|2020|2019|2018/
            if (
                // !check &&
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
                console.log("지역 ID", k.polyBizSecd._text)
                console.log("regioncode", regionCode)
                const resultPeriod = await classifyPeriod(k.rqutPrdCn._cdata)

                if (resultPeriod === false || resultPeriod === undefined) continue

                let age = []
                if (/~/.test(k.ageInfo._cdata)) {
                    age = k.ageInfo._cdata.split("~")
                    age[0] = age[0].replace(/[^0-9]/g, "")
                    if (!age[0]) age[0] = "0"
                    age[1] = age[1].replace(/[^0-9]/g, "")
                    if (!age[1]) age[1] = "999"
                    // console.log("~.test", age, k.ageInfo._cdata)
                } else if (/제한없음/.test(k.ageInfo._cdata)) {
                    console.log("제한없음", k.ageInfo._cdata)
                } else if (/이상/.test(k.ageInfo._cdata) && /[^이하]/.test(k.ageInfo._cdata)) {
                    age[0] = k.ageInfo._cdata.replace(/[^0-9]/g, "")
                    age[1] = "999"
                    // console.log("이상", k.ageInfo._cdata, age)
                } else if (/[^이상]/.test(k.ageInfo._cdata) && /이하/.test(k.ageInfo._cdata)) {
                    age[0] = "0"
                    age[1] = k.ageInfo._cdata.replace(/[^0-9]/g, "")
                    // console.log("이하", k.ageInfo._cdata, age)
                } else {
                    age = k.ageInfo._cdata
                    console.log("else", k.ageInfo._cdata)
                }

                let gender
                if (k.polyBizSjnm._cdata.search(/여성|출산/) !== -1) {
                    gender = "여성"
                }

                let desire //k.plcyTpNm._cdata = 정책유형
                if (k.plcyTpNm._cdata === "취업지원" || k.plcyTpNm._cdata === "창업지원") {
                    desire = "일자리"
                } else if (k.plcyTpNm._cdata === "주거·금융") {
                    desire = "주거 및 일상생활"
                } else if (k.plcyTpNm._cdata === "생활·복지") {
                    desire = "건강"
                } else if (k.plcyTpNm._cdata === "정책참여") {
                    desire = "안전 및 권익보장"
                } else if (k.plcyTpNm._cdata === "코로나19") {
                    desire = "기타"
                }

                // let total = k.totalCnt._cdata //총건수

                let summary = k.polyItcnCn._cdata //정책소개
                let job // 참여요건 - 취업상태
                if (k.empmSttsCn._cdata !== "제한없음") job = k.empmSttsCn._cdata // 참여요건 - 취업상태
                let scholarship // 참여요건 - 학력
                if (k.accrRqisCn._cdata !== "제한없음") scholarship = k.accrRqisCn._cdata // 참여요건 - 학력
                let institution = k.cnsgNmor._cdata // 신청기관명
                let link = k.rqutUrla._cdata // 사이트 링크 주소
                let support = k.sporCn._cdata // 지원내용
                let region = regionName // 지역
                let process = k.rqutProcCn._cdata
                let period = k.rqutPrdCn._cdata
                myConsole.log("기관 및 지자체 구분", k.polyBizTy._cdata)
                myConsole.log("참여요건 - 전공", k.majrRqisCn._cdata)
                myConsole.log("참여요건 - 특화분야", k.cnsgNmor._cdata)
                myConsole.log("신청절차", k.rqutProcCn._cdata)
                myConsole.log("심사발표", k.jdgnPresCn._cdata)
                myConsole.log("지원규모", k.sporScvl._cdata)
                myConsole.log("정책 ID", k.bizId._text)
                myConsole.log("지역 ID", k.polyBizSecd._text)
                myConsole.log("regioncode", regionCode)
                // myConsole.log({ total })
                // myConsole.log({ pageIndex })
                myConsole.log({ page: i })
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
                myConsole.log({ 심사발표: k.jdgnPresCn._cdata })
                myConsole.log({ process })
                myConsole.log("-------------------")

                // await Data.create({
                //     age,
                //     name,
                //     summary,
                //     desire,
                //     job,
                //     scholarship,
                //     institution,
                //     region,
                //     link,
                //     support,
                //     gender,
                //     period,
                //     process,
                // })
            } else {
                continue
            }
        }
    }
}
