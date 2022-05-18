require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const Data = require("../schemas/data")
const connect = require("../schemas")
connect()

const fs = require("fs")
fs.truncate("./openAPI/index.age.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/index.age.txt"))
const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
const serviceKey = process.env.SERVICE_KEY
// loadOpenApi(desireCode, desireName)

async function loadOpenApi(desireCode, desireName) {
    try {
        for (let i = 0; i < desireCode.length; i++) {
            console.log(i)
            let url = `http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist?serviceKey${serviceKey}&callTp=L&pageNo=1&numOfRows=500&srchKeyCode=003&desireArray=${desireCode[i]}`
            // let queryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
            // queryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("L") /* */
            // queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1") /* */
            // queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("500") /* */
            // queryParams += "&" + encodeURIComponent("srchKeyCode") + "=" + encodeURIComponent("003") /* */
            // queryParams += "&" + encodeURIComponent("desireArray") + "=" + encodeURIComponent(desireCode[i]) /* */

            const response = await axios.get(url)
            const data = response.data
            const xmlToJson = convert.xml2json(data, {
                compact: true,
                space: 4,
            })
            const jsonParse = JSON.parse(xmlToJson)
            const servList = jsonParse.wantedList.servList
            // console.log(servList)
            for (j of servList) {
                console.log("a")
                const servId = j.servId._text
                const desire = desireName[i]
                const name = j.servNm._text
                let target
                if (j.trgterIndvdlArray !== undefined) {
                    let a = j.trgterIndvdlArray._text.split(", ")
                    target = a
                } else {
                }
                let obstacle
                if (j.obstKiArray !== undefined) {
                    let b = j.obstKiArray._text.split(", ")
                    obstacle = b
                } else {
                }
                let lifeCycle
                if (j.lifeArray !== undefined) {
                    let c = j.lifeArray._text.split(", ")
                    lifeCycle = c
                } else {
                }
                const link = j.servDtlLink._text

                let detailUrl = `http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed?serviceKey${serviceKey}&callTp=D&servId=${servId}`
                // let qqueryParams = "?" + encodeURIComponent("serviceKey") + process.env.SERVICE_KEY /* Service Key*/
                // qqueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
                // qqueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(servId) /* */

                const response = await axios.get(detailUrl)
                const data = response.data
                const xmlToJson = convert.xml2json(data, {
                    compact: true,
                    space: 4,
                })
                const jsonParse = JSON.parse(xmlToJson)
                let checkCriteria, checkSummary, checkSupport
                let age = []
                const institution = jsonParse.wantedDtl.jurMnofNm._text
                const criteria = jsonParse.wantedDtl.slctCritCn._text.trim()
                const summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                const support = jsonParse.wantedDtl.alwServCn._text.trim()
                if (criteria !== undefined) {
                    checkCriteria = criteria.replace(/ /g, "")
                }
                if (summary !== undefined) {
                    checkSummary = summary.replace(/ /g, "")
                }
                if (support !== undefined) {
                    checkSupport = support.replace(/ /g, "")
                }

                const indexCheckUpCriteria = checkCriteria.search(/\d세이상|\d세초과/)
                const indexCheckDownCriteria = checkCriteria.search(/\d세이하|\d세미만/)
                const indexCheckUpSummary = checkSummary.search(/\d세이상|\d세초과/)
                const indexCheckDownSummary = checkSummary.search(/\d세이하|\d세미만/)
                const indexCheckUpSupport = checkSupport.search(/\d세이상|\d세초과/)
                const indexCheckDownSupport = checkSupport.search(/\d세이하|\d세미만/)
                if (indexCheckUpCriteria !== -1) {
                    if (!isNaN(checkCriteria[indexCheckUpCriteria - 1])) {
                        age[0] = checkCriteria[indexCheckUpCriteria - 1] + checkCriteria[indexCheckUpCriteria]
                    } else {
                        age[0] = checkCriteria[indexCheckUpCriteria]
                    }
                } else if (indexCheckUpSummary !== -1) {
                    if (!isNaN(checkSummary[indexCheckUpSummary - 1])) {
                        age[0] = checkSummary[indexCheckUpSummary - 1] + checkSummary[indexCheckUpSummary]
                    } else {
                        age[0] = checkSummary[indexCheckUpSummary]
                    }
                } else if (indexCheckUpSupport !== -1) {
                    if (!isNaN(checkSupport[indexCheckUpSupport - 1])) {
                        age[0] = checkSupport[indexCheckUpSupport - 1] + checkSupport[indexCheckUpSupport]
                    } else {
                        age[0] = checkSupport[indexCheckUpSupport]
                    }
                }
                if (indexCheckDownCriteria !== -1) {
                    if (age.length === 0) age[0] = "0"
                    if (!isNaN(checkCriteria[indexCheckDownCriteria - 1])) {
                        age[1] = checkCriteria[indexCheckDownCriteria - 1] + checkCriteria[indexCheckDownCriteria]
                    } else {
                        age[1] = checkCriteria[indexCheckDownCriteria]
                    }
                } else if (indexCheckDownSummary !== -1) {
                    if (age.length === 0) age[0] = "0"
                    if (!isNaN(checkSummary[indexCheckDownSummary - 1])) {
                        age[1] = checkSummary[indexCheckDownSummary - 1] + checkSummary[indexCheckDownSummary]
                    } else {
                        age[1] = checkSummary[indexCheckDownSummary]
                    }
                } else if (indexCheckDownSupport !== -1) {
                    if (age.length === 0) age[0] = "0"
                    if (!isNaN(checkSupport[indexCheckDownSupport - 1])) {
                        age[1] = checkSupport[indexCheckDownSupport - 1] + checkSupport[indexCheckDownSupport]
                    } else {
                        age[1] = checkSupport[indexCheckDownSupport]
                    }
                }
                const checkCriteriaSymbol = checkCriteria.search(/세~\d|\d~\d/)
                const checkSummarySymbol = checkSummary.search(/세~\d|\d~\d/)
                const checkSupportSymbol = checkSupport.search(/세~\d|\d~\d/)
                if (checkCriteriaSymbol !== -1) {
                    console.log(checkCriteria)
                    console.log(checkCriteriaSymbol)
                    console.log(checkCriteria[checkCriteriaSymbol])
                } else if (checkSummarySymbol !== -1) {
                    console.log(checkSummary)
                    console.log(checkSummarySymbol)
                    console.log(checkSummary[checkSummarySymbol])
                } else if (checkSupportSymbol !== 1) {
                    console.log(checkSupport)
                    console.log(checkSupportSymbol)
                    console.log(checkSupport[checkSupportSymbol])
                }
                // if (age.length === 2 && Number(age[0]) > Number(age[1])) {
                //     continue
                // } else if (age.length !== 0) {
                //     // myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support, criteria, age })
                //     // await Data.updateOne({ name }, { $set: { age } })
                // }
            }
        }
        console.log("done")
    } catch (error) {
        console.log(error)
    }
}
// afterData()
async function afterData() {
    console.log("start")
    const data = await Data.find({}, { _id: false })
    for (let i of data) {
        if (i.age === undefined || i.age.length === 0) {
            const support = i.support.replace(/\n/g, "").replace(/ /g, "")
            const summary = i.summary.replace(/\n/g, "").replace(/ /g, "")
            const name = i.name
            const checkSummarySymbol = summary.search(/\d세~\d|\d~\d\d세|\d~\d세|\d~만\d|\d세~만/)
            const checkSupportSymbol = support.search(/\d세~\d|\d~\d\d세|\d~\d세|\d~만\d|\d세~만/)
            let age = []
            if (checkSummarySymbol !== -1) {
                console.log(summary)
                console.log(checkSummarySymbol)
                console.log(summary[checkSummarySymbol])
                if (!isNaN(summary[checkSummarySymbol - 1])) {
                    age[0] = summary[checkSummarySymbol - 1] + summary[checkSummarySymbol]
                } else {
                    age[0] = summary[checkSummarySymbol]
                }
                if (summary[checkSummarySymbol + 1] === "세" && summary[checkSummarySymbol + 3] !== "만") {
                    if (!isNaN(summary[checkSummarySymbol + 4])) {
                        age[1] = summary[checkSummarySymbol + 3] + summary[checkSummarySymbol + 4]
                    } else {
                        age[1] = summary[checkSummarySymbol + 3]
                    }
                } else if (summary[checkSummarySymbol + 1] === "세" && summary[checkSummarySymbol + 3] === "만") {
                    if (!isNaN(summary[checkSummarySymbol + 5])) {
                        age[1] = summary[checkSummarySymbol + 4] + summary[checkSummarySymbol + 5]
                    } else {
                        age[1] = summary[checkSummarySymbol + 4]
                    }
                } else {
                    if (!isNaN(summary[checkSummarySymbol + 3])) {
                        age[1] = summary[checkSummarySymbol + 2] + summary[checkSummarySymbol + 3]
                    } else {
                        age[1] = summary[checkSummarySymbol + 2]
                    }
                }
                myConsole.log({ name, support, summary, age })
                // await Data.updateOne({ name }, { $set: { age } })
            } else if (checkSupportSymbol !== -1) {
                console.log(support)
                console.log(checkSupportSymbol)
                console.log(support[checkSupportSymbol])
                if (!isNaN(support[checkSupportSymbol - 1])) {
                    age[0] = support[checkSupportSymbol - 1] + support[checkSupportSymbol]
                } else {
                    age[0] = support[checkSupportSymbol]
                }
                if (support[checkSupportSymbol + 1] === "세") {
                    if (!isNaN(support[checkSupportSymbol + 4])) {
                        age[1] = support[checkSupportSymbol + 3] + support[checkSupportSymbol + 4]
                    } else {
                        age[1] = support[checkSupportSymbol + 3]
                    }
                } else if (summary[checkSummarySymbol + 1] === "세" && summary[checkSummarySymbol + 3] === "만") {
                    if (!isNaN(summary[checkSummarySymbol + 5])) {
                        age[1] = summary[checkSummarySymbol + 4] + summary[checkSummarySymbol + 5]
                    } else {
                        age[1] = summary[checkSummarySymbol + 4]
                    }
                } else {
                    if (!isNaN(support[checkSupportSymbol + 3])) {
                        age[1] = support[checkSupportSymbol + 2] + support[checkSupportSymbol + 3]
                    } else {
                        age[1] = support[checkSupportSymbol + 2]
                    }
                }
                myConsole.log({ name, support, summary, age })
                // await Data.updateOne({ name }, { $set: { age } })
            }
        }
    }
    console.log("done")
}
checkAgeData()
async function checkAgeData() {
    console.log("start")
    const ageData = await Data.find({}, { _id: false })
    for (i of ageData) {
        if ((i.age === undefined || i.age.length === 0) && (i.region !== undefined || i.region.length !== 0)) {
            myConsole.log(i)
        }
    }
    console.log("end")
}
