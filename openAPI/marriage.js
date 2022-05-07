require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
connect()
const fs = require("fs")
fs.truncate("./openAPI/marriage.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/marriage.txt"))
let arr = [100, 110, 120, 130, 140, 150, 160, 170, 180]
let arr1 = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
function load2() {
    for (let i = 0; i < arr.length; i++) {
        load(arr[i], arr1[i])
    }
}
async function load(asd, zxc) {
    let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
    let queryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
    queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
    queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
    queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */
    queryParams += "&" + encodeURIComponent("desireArray") + "=" + encodeURIComponent(`${asd}`) /* */

    await request(
        {
            url: url + queryParams,
            method: "GET",
        },
        async function (error, response, body) {
            const result = body
            const xmlToJson = convert.xml2json(result, {
                compact: true,
                space: 4,
            })
            const jsonParse = JSON.parse(xmlToJson)

            const servList = jsonParse.wantedList.servList

            await load3(servList, zxc)
        }
    )
}
load2()

async function load3(servList, zxc) {
    for (i of servList) {
        const servId = i.servId._text
        let desire = zxc
        let name = i.servNm._text
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
        let link = i.servDtlLink._text

        let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
        let qqueryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY
        /* Service Key*/
        qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
        qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(`${servId}`) /* */

        await request(
            {
                url: detailUrl + qqueryParams,
                method: "GET",
            },
            async function (error, response, body) {
                const result = body
                const xmlToJson = convert.xml2json(result, {
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

                let institution = jsonParse.wantedDtl.jurMnofNm._text

                if (1) {
                    desire = desire
                    target = target
                    obstacle = obstacle
                    lifeCycle = lifeCycle
                    name = name
                    link = link
                    institution = institution
                    summary = summary
                    support = support
                    myConsole.log({ marriage })
                    myConsole.log({ desire })
                    myConsole.log({ target })
                    myConsole.log({ obstacle })
                    myConsole.log({ lifeCycle })
                    myConsole.log({ name })
                    myConsole.log({ link })
                    myConsole.log({ institution })
                    myConsole.log({ summary })
                    myConsole.log({ support })

                    // let scholarship = ["고등학교 졸업 미만", "대학(원) 재학"]
                    // await Data.updateOne({ name }, { $set: { scholarship } })
                    // } else if () {
                    //     desire = desire
                    //     target = target
                    //     obstacle = obstacle
                    //     lifeCycle = lifeCycle
                    //     name = name
                    //     link = link
                    //     institution = institution
                    //     summary = summary
                    //     support = support
                    //     // let scholarship = "대학(원) 재학"
                    //     // await Data.updateOne({ name }, { $set: { scholarship } })
                    // } else if () {
                    //     desire = desire
                    //     target = target
                    //     obstacle = obstacle
                    //     lifeCycle = lifeCycle
                    //     name = name
                    //     link = link
                    //     institution = institution
                    //     summary = summary
                    //     support = support
                    //     // let scholarship = "고등학교 졸업 미만"
                    //     // await Data.updateOne({ name }, { $set: { scholarship } })
                    // } else {
                    //     desire = desire
                    //     target = target
                    //     obstacle = obstacle
                    //     lifeCycle = lifeCycle
                    //     name = name
                    //     link = link
                    //     institution = institution
                    //     summary = summary
                    //     support = support
                    //     // let scholarship = ""
                    //     // await Data.updateOne({ name }, { $set: { scholarship } })
                }
            }
        )
    }
}
