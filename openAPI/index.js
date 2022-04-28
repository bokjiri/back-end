require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")

connect()

let arr = [100, 110, 120, 130, 140, 150, 160, 170, 180]
let arr1 = ["일자리", "주거", "일상생활", "신체건강 및 보건의료", "정신건강 및 심리정서", "보호 및 돌봄·요양", "보육 및 교육", "문화 및 여가", "안전 및 권익보장"]
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
        const desire = zxc
        const name = i.servNm._text
        let target
        if (i.trgterIndvdlArray !== undefined) {
            target = i.trgterIndvdlArray._text
        } else {
        }
        let obstacle
        if (i.obstKiArray !== undefined) {
            obstacle = i.obstKiArray._text
        } else {
        }
        let lifeCycle
        if (i.lifeArray !== undefined) {
            lifeCycle = i.lifeArray._text
        } else {
        }
        const link = i.servDtlLink._text

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
                let a
                let c
                let d
                if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
                    a = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                }
                if (jsonParse.wantedDtl.alwServCn !== undefined) {
                    c = jsonParse.wantedDtl.alwServCn._text.trim()
                }
                d = jsonParse.wantedDtl.jurMnofNm._text

                const institution = d
                const summary = a
                const support = c
                await Data.create({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
            }
        )
    }
}
