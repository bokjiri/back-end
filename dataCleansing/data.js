require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const connect = require("../schemas")
const { genderData, marriageData, scholarshipData, workTypeData } = require("./cleansing")
connect()
// const fs = require("fs")
// fs.truncate("./openAPI/gender.txt", () => {
//     console.log("File Content Deleted")
// })
// const myConsole = new console.Console(fs.createWriteStream("./openAPI/gender.txt"))

const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]

loadOpenApi()

async function loadOpenApi() {
    for (let i = 0; i < desireCode.length; i++) {
        let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
        let queryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
        queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
        queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
        queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
        queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */
        queryParams += "&" + encodeURIComponent("desireArray") + "=" + encodeURIComponent(desireCode[i]) /* */

        const response = await axios.get(url + queryParams)
        const data = response.data
        const xmlToJson = convert.xml2json(data, {
            compact: true,
            space: 4,
        })
        const jsonParse = JSON.parse(xmlToJson)
        const servList = jsonParse.wantedList.servList

        await getDetail(servList, desireName[i])
    }
}

async function getDetail(servList, desireName) {
    for (i of servList) {
        const servId = i.servId._text
        const desire = desireName
        const name = i.servNm._text
        let target
        if (i.trgterIndvdlArray !== undefined) {
            let a = i.trgterIndvdlArray._text.split(", ")
            target = a
        } else {
        }
        let obstacle
        if (i.obstKiArray !== undefined) {
            let b = i.obstKiArray._text.split(", ")
            obstacle = b
        } else {
        }
        let lifeCycle
        if (i.lifeArray !== undefined) {
            let c = i.lifeArray._text.split(", ")
            lifeCycle = c
        } else {
        }
        const link = i.servDtlLink._text

        let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
        let qqueryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
        qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
        qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(`${servId}`) /* */

        const response = await axios.get(detailUrl + qqueryParams)
        const data = response.data
        const xmlToJson = convert.xml2json(data, {
            compact: true,
            space: 4,
        })
        const jsonParse = JSON.parse(xmlToJson)
        let summary
        let support

        if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
            summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
        }
        if (jsonParse.wantedDtl.alwServCn !== undefined) {
            support = jsonParse.wantedDtl.alwServCn._text.trim()
        }

        const institution = jsonParse.wantedDtl.jurMnofNm._text

        // await genderData(lifeCycle, institution, support, link, obstacle, target, desire, name, summary)
        // await marriageData(lifeCycle, institution, support, link, obstacle, target, desire, name, summary)
        // await scholarshipData(lifeCycle, institution, support, link, obstacle, target, desire, name, summary)
        // await workTypeData(lifeCycle, institution, support, link, obstacle, target, desire, name, summary)
    }
}
