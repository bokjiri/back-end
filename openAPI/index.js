require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
connect()
const serviceKey = process.env.SERVICE_KEY
const fs = require("fs")
fs.truncate("./openAPI/index.cri.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/index.cri.txt"))

const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]

loadOpenApi()

async function loadOpenApi() {
    try {
        // for (let i = 0; i < desireCode.length; i++) {
        let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
        let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + serviceKey /* Service Key*/
        queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
        queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
        queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
        queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */
        // queryParams += "&" + encodeURIComponent("desireArray") + "=" + encodeURIComponent(desireCode[i]) /* */

        const response = await axios.get(url + queryParams)
        const data = response.data
        const xmlToJson = convert.xml2json(data, {
            compact: true,
            space: 4,
        })
        const jsonParse = JSON.parse(xmlToJson)
        // console.log(jsonParse)
        const servList = jsonParse.wantedList.servList
        // console.log(servList)

        // console.log(i)
        // await getDetail(servList, desireName[i])
        for (let j of servList) {
            console.log("doing")
            const servId = j.servId._text
            const name = j.servNm._text
            let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
            let qqueryParams = "?" + encodeURIComponent("serviceKey") + "=" + serviceKey /* Service Key*/
            qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
            qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(servId) /* */
            console.log("beforedetail")
            const response = await axios.get(detailUrl)
            console.log("afterdetail")
            const data = response.data
            const xmlToJson = convert.xml2json(data, {
                compact: true,
                space: 4,
            })
            const jsonParse = JSON.parse(xmlToJson)
            console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader)
            console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.errMsg)
            // if (jsonParse.wantedDtl.slctCritCn !== undefined) {
            //     const criteria = jsonParse.wantedDtl.slctCritCn._text.trim()
            //     myConsole.log({ name, criteria })
            //     console.log("beforeDB")
            //     await Data.updateOne({ name }, { $set: { criteria } })
            //     console.log("afterDB")
            // }
        }
        // }
        console.log("done")
    } catch (error) {
        console.log(error)
    }
}

async function getDetail(servList, desireName) {
    for (i of servList) {
        console.log("doing")
        const servId = i.servId._text
        const name = i.servNm._text
        // const desire = desireName
        // let target
        // if (i.trgterIndvdlArray !== undefined) {
        //     let a = i.trgterIndvdlArray._text.split(", ")
        //     console.log(a)
        //     target = a
        // } else {
        // }
        // let obstacle
        // if (i.obstKiArray !== undefined) {
        //     let b = i.obstKiArray._text.split(", ")
        //     console.log(b)
        //     obstacle = b
        // } else {
        // }
        // let lifeCycle
        // if (i.lifeArray !== undefined) {
        //     let c = i.lifeArray._text.split(", ")
        //     console.log(c)
        //     lifeCycle = c
        // } else {
        // }
        // const link = i.servDtlLink._text

        let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
        let qqueryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
        qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
        qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(servId) /* */

        const response = await axios.get(detailUrl + qqueryParams)
        const data = response.data
        const xmlToJson = convert.xml2json(data, {
            compact: true,
            space: 4,
        })
        const jsonParse = JSON.parse(xmlToJson)
        const criteria = jsonParse.wantedDtl.slctCritCn._text.trim()
        // let summary
        // let support

        // if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
        //     summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
        // }
        // if (jsonParse.wantedDtl.alwServCn !== undefined) {
        //     support = jsonParse.wantedDtl.alwServCn._text.trim()
        // }

        // const institution = jsonParse.wantedDtl.jurMnofNm._text
        myConsole.log({ name, criteria })
        await Data.updateOne({ name }, { $set: { criteria } })
        // myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
        // await Data.create({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
    }
}
