require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const fs = require("fs")
fs.truncate("./openAPI/chung.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/chung.txt"))

load()

async function load() {
    for (let i = 0; i < 120; i++) {
        await load2(i)
    }
}
async function load2(i) {
    let url = "https://www.youthcenter.go.kr/opi/empList.do"
    let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(`${i}`) /* */
    queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */

    await request(
        {
            url: url + queryParams,
            method: "get",
        },
        function (error, response, body) {
            const result = body
            const xmlToJson = convert.xml2json(result, {
                compact: true,
                space: 4,
            })
            const jsonParse = JSON.parse(xmlToJson)
            const empsInfo = jsonParse.empsInfo.emp
            for (i of empsInfo) {
                myConsole.log("index", i.rownum._text)
                myConsole.log("기관 및 지자체 구분", i.polyBizTy._cdata)
                myConsole.log("정책명", i.polyBizSjnm._cdata)
                myConsole.log("정책소개", i.polyItcnCn._cdata)
                myConsole.log("정책유형", i.plcyTpNm._cdata)
                myConsole.log("지원규모", i.sporScvl._cdata)
                myConsole.log("지원내용", i.sporCn._cdata)
                myConsole.log("참여요건 - 연령", i.ageInfo._cdata)
                myConsole.log("참여요건 - 취업상태", i.empmSttsCn._cdata)
                myConsole.log("참여요건 - 학력", i.accrRqisCn._cdata)
                myConsole.log("참여요건 - 전공", i.majrRqisCn._cdata)
                myConsole.log("참여요건 - 특화분야", i.cnsgNmor._cdata)
                myConsole.log("신청기관명", i.cnsgNmor._cdata)
                myConsole.log("신청기간", i.rqutPrdCn._cdata)
                myConsole.log("신청절차", i.rqutProcCn._cdata)
                myConsole.log("심사발표", i.jdgnPresCn._cdata)
                myConsole.log("사이트 링크 주소", i.rqutUrla._cdata)
                myConsole.log("-------------------")
            }
        }
    )
}
