require("dotenv").config()
const request = require("request-promise-native")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
connect()

const fs = require("fs")
fs.truncate("./openAPI/index.age.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/index.age.txt"))
let arr = [100, 110, 120, 130, 140, 150, 160, 170, 180]
let arr1 = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
load1()
function load1() {
    for (let i = 0; i < arr.length; i++) {
        load2(arr[i], arr1[i])
    }
}
async function load2(asd, zxc) {
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

async function load3(servList, zxc) {
    for (i of servList) {
        const servId = i.servId._text
        const desire = zxc
        const name = i.servNm._text
        let target
        if (i.trgterIndvdlArray !== undefined) {
            let a = i.trgterIndvdlArray._text.split(", ")
            console.log(a)
            target = a
        } else {
        }
        let obstacle
        if (i.obstKiArray !== undefined) {
            let b = i.obstKiArray._text.split(", ")
            console.log(b)
            obstacle = b
        } else {
        }
        let lifeCycle
        if (i.lifeArray !== undefined) {
            let c = i.lifeArray._text.split(", ")
            console.log(c)
            lifeCycle = c
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
                let summary
                let support

                if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
                    summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                }
                if (jsonParse.wantedDtl.alwServCn !== undefined) {
                    support = jsonParse.wantedDtl.alwServCn._text.trim()
                }

                const institution = jsonParse.wantedDtl.jurMnofNm._text
                myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })

                // await Data.create({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
            }
        )
    }
}

// async function findData() {
//     const data = await Data.find({}, { _id: false })
//     const up = /\d세 이상|\d세 초과/g
//     const down = /\d세 이하|\d세 미만/g
//     for (i of data) {
//         if (i.lifeCycle.length === 0 && i.target.length === 0 && i.obstacle.length === 0) {
//             if (i.summary.search(up) !== -1) {
//                 const a = i.summary.substring(i.summary.search(up) - 2, i.summary.search(up) + 20)
//                 myConsole.log(a)
//                 myConsole.log(i)
//                 myConsole.log("-------------------")
//             } else if (i.summary.search(down) !== -1) {
//                 const a = i.summary.substring(i.summary.search(down) - 17, i.summary.search(down) + 5)
//                 myConsole.log(a)
//                 myConsole.log(i)
//                 myConsole.log("-------------------")
//             } else if (i.support.search(up) !== -1) {
//                 const a = i.support.substring(i.support.search(up) - 2, i.support.search(up) + 20)
//                 myConsole.log(a)
//                 myConsole.log(i)
//                 myConsole.log("-------------------")
//             } else if (i.support.search(down) !== -1) {
//                 const a = i.support.substring(i.support.search(down) - 17, i.support.search(down) + 5)
//                 myConsole.log(a)
//                 myConsole.log(i)
//                 myConsole.log("-------------------")
//             }
//         }
//     }
// }

// findData()
