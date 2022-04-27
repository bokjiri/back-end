require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")

const fs = require("fs")
fs.writeFile("./openAPI/output.txt", "", function () {
    console.log("already reset")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/output.txt"))

async function load() {
    let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
    let queryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
    queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
    queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
    queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
    queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */

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
            for (i of servList) {
                myConsole.log("servId =", i.servId._text)
                myConsole.log("servNm =", i.servNm._text)
                if (i.trgterIndvdlArray !== undefined) {
                    myConsole.log("trgterIndvdlArray =", i.trgterIndvdlArray._text)
                } else {
                    myConsole.log("trgterIndvdlArray =", i.trgterIndvdlArray)
                }
                if (i.obstKiArray !== undefined) {
                    myConsole.log("obstKiArray =", i.obstKiArray._text)
                } else {
                    myConsole.log("obstKiArray =", i.obstKiArray)
                }
                myConsole.log("servDtlLink =", i.servDtlLink._text)

                let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
                let qqueryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY
                /* Service Key*/
                qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
                qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(`${i.servId._text}`) /* */

                await request(
                    {
                        url: detailUrl + qqueryParams,
                        method: "GET",
                    },
                    function (error, response, body) {
                        const result = body
                        const xmlToJson = convert.xml2json(result, {
                            compact: true,
                            space: 4,
                        })
                        const jsonParse = JSON.parse(xmlToJson)
                        const a = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                        myConsole.log("tgtrDtlCn =", a)
                        myConsole.log("\n")
                    }
                )
            }
        }
    )
}
load()
