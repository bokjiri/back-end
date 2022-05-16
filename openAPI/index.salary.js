require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")

connect()

const fs = require("fs")
fs.truncate("./openAPI/index.salary.keywordddd22d.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/index.salary.keywordddd22d.txt"))

const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
const keyword = [
    "중위소득 30",
    "중위소득 50",
    "중위소득 60",
    "중위소득 70",
    "중위소득 80",
    "중위소득 90",
    "중위소득 100",
    "중위소득 110",
    "중위소득 120",
    "중위소득 130",
    "중위소득 140",
    "중위소득 150",
    "중위소득 160",
    "중위소득 170",
    "중위소득 180",
    "중위소득 190",
    "중위소득 200",
    "중위소득 200 초과",
]

// loadOpenApi()
async function loadOpenApi() {
    try {
        for (let x = 0; x < keyword.length; x++) {
            for (let i = 0; i < desireCode.length; i++) {
                console.log(desireName[i])
                let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
                let queryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
                queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
                queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
                queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
                queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */
                queryParams += "&" + encodeURIComponent("desireArray") + "=" + encodeURIComponent(desireCode[i]) /* */
                queryParams += "&" + encodeURIComponent("searchWrd") + "=" + encodeURIComponent(keyword[x]) /* */

                const response = await axios.get(url + queryParams)
                const data = response.data
                const xmlToJson = convert.xml2json(data, {
                    compact: true,
                    space: 4,
                })
                const jsonParse = JSON.parse(xmlToJson)
                const servList = jsonParse.wantedList.servList
                const splitWord = keyword[x].split(" ")
                const salary = splitWord[1]
                if (Array.isArray(servList)) {
                    for (j of servList) {
                        console.log("aa")
                        const servId = j.servId._text
                        const desire = desireName[i]
                        const name = j.servNm._text
                        let target = []
                        if (j.trgterIndvdlArray !== undefined) {
                            let a = j.trgterIndvdlArray._text.split(", ")
                            target = a
                        }
                        let obstacle = []
                        if (j.obstKiArray !== undefined) {
                            let b = j.obstKiArray._text.split(", ")
                            obstacle = b
                        }
                        let lifeCycle = []
                        if (j.lifeArray !== undefined) {
                            let c = j.lifeArray._text.split(", ")
                            lifeCycle = c
                        }
                        const link = j.servDtlLink._text

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
                        let summary
                        let support

                        if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
                            summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                        }
                        if (jsonParse.wantedDtl.alwServCn !== undefined) {
                            support = jsonParse.wantedDtl.alwServCn._text.trim()
                        }

                        const institution = jsonParse.wantedDtl.jurMnofNm._text
                        // console.log(target)
                        myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support, salary })

                        // myConsole.log({ target })
                        // if (target.indexOf("저소득") === -1) {
                        //     target.push("저소득")
                        //     myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
                        // }
                        await Data.updateOne({ name }, { $set: { salary } })
                    }
                } else if (servList !== undefined) {
                    console.log("a")
                    const servId = servList.servId._text
                    const desire = desireName[i]
                    const name = servList.servNm._text
                    let target = []
                    if (servList.trgterIndvdlArray !== undefined) {
                        let a = servList.trgterIndvdlArray._text.split(", ")
                        target = a
                    }
                    let obstacle = []
                    if (servList.obstKiArray !== undefined) {
                        let b = servList.obstKiArray._text.split(", ")
                        obstacle = b
                    }
                    let lifeCycle = []
                    if (servList.lifeArray !== undefined) {
                        let c = servList.lifeArray._text.split(", ")
                        lifeCycle = c
                    }
                    const link = servList.servDtlLink._text

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
                    let summary
                    let support

                    if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
                        summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                    }
                    if (jsonParse.wantedDtl.alwServCn !== undefined) {
                        support = jsonParse.wantedDtl.alwServCn._text.trim()
                    }

                    const institution = jsonParse.wantedDtl.jurMnofNm._text
                    // console.log(target)
                    myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support, salary })
                    await Data.updateOne({ name }, { $set: { salary } })
                } else {
                    console.log(servList)
                }
            }
        }
        console.log("done")
    } catch (error) {
        console.error(error)
    }
}
async function checkData() {
    const checkSalary = await Data.find({ target: "저소득" })
    for (i of checkSalary) {
        if (!i.salary) {
            console.log("!sal", i.name, i.target, i.salary)
            // await Data.updateOne({ name: i.name }, { $set: { salary: 50 } })
        } else {
            console.log("exSal", i.name, i.target, i.salary)
        }
    }
}
// checkData()
