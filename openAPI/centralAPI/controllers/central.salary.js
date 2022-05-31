require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const Data = require("../../../schemas/data")
const connect = require("../../../schemas")

connect()

const fs = require("fs")
fs.truncate("./openAPI/index.salary.after.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/index.salary.after.txt"))

const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]

// loadOpenApi()
async function loadOpenApi() {
    try {
        for (let i = 0; i < desireCode.length; i++) {
            console.log(desireName[i])
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
            let salary
            if (keyword[x] === "차상위") {
                salary = 50
            } else {
                const splitWord = keyword[x].split(" ")
                salary = splitWord[1]
            }
            if (Array.isArray(servList)) {
                for (j of servList) {
                    console.log("aa")
                    const name = j.servNm._text
                    // const exData = await Data.findOne({ name })
                    // if (exData) continue
                    const servId = j.servId._text
                    const desire = desireName[i]
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
                    console.log(jsonParse.wantedDtl)
                    const institution = jsonParse.wantedDtl.jurMnofNm._text
                    // console.log(target)
                    myConsole.log({
                        desire,
                        name,
                        target,
                        obstacle,
                        lifeCycle,
                        link,
                        institution,
                        summary,
                        support,
                        salary,
                    })

                    // myConsole.log({ target })
                    // if (target.indexOf("저소득") === -1) {
                    //     target.push("저소득")
                    //     myConsole.log({ desire, name, target, obstacle, lifeCycle, link, institution, summary, support })
                    // }
                    // await Data.updateOne({ name }, { $set: { salary } })
                }
            } else if (servList !== undefined) {
                console.log("a")
                const name = servList.servNm._text
                // const exData = await Data.findOne({ name })
                // if (exData) continue
                const servId = servList.servId._text
                const desire = desireName[i]
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
                let summary, support, criteria

                if (jsonParse.wantedDtl.tgtrDtlCn !== undefined) {
                    summary = jsonParse.wantedDtl.tgtrDtlCn._text.trim()
                }
                if (jsonParse.wantedDtl.alwServCn !== undefined) {
                    support = jsonParse.wantedDtl.alwServCn._text.trim()
                }
                console.log(jsonParse.wantedDtl)

                const institution = jsonParse.wantedDtl.jurMnofNm._text
                // console.log(target)
                myConsole.log({
                    desire,
                    name,
                    target,
                    obstacle,
                    lifeCycle,
                    link,
                    institution,
                    summary,
                    support,
                    salary,
                })
                // await Data.updateOne({ name }, { $set: { salary } })
            } else {
                console.log(servList)
            }
        }

        console.log("done")
    } catch (error) {
        console.error(error)
    }
}
// checkData()
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
    console.log("done")
}
// salaryData()
async function salaryData() {
    console.log("start")
    const checkSalary = await Data.find({}, { _id: false })
    for (i of checkSalary) {
        if (!i.salary) {
            const name = i.name
            let salary
            const support = i.support.replace(/\n/g, "").replace(/ /g, "")
            const summary = i.summary.replace(/\n/g, "").replace(/ /g, "")
            // const criteria = i.criteria.replace(/\n/g, "").replace(/ /g, "")
            const checkSummaryThree = summary.search(/중위소득\d\d\d%/)
            const checkSummaryThreeDot = summary.search(/중위소득.\d\d\d%/)
            const checkSummaryTwo = summary.search(/중위소득\d\d%/)
            const checkSummaryTwoDot = summary.search(/중위소득.\d\d%/)
            const checkSupportThree = support.search(/중위소득\d\d\d%/)
            const checkSupportThreeDot = support.search(/중위소득.\d\d\d%/)
            const checkSupportTwo = support.search(/중위소득\d\d%/)
            const checkSupportTwoDot = support.search(/중위소득.\d\d%/)
            // const checkCriteriaThree = criteria.search(/중위소득\d\d\d%/)
            // const checkCriteriaThreeDot = criteria.search(/중위소득.\d\d\d%/)
            // const checkCriteriaTwo = criteria.search(/중위소득\d\d%/)
            // const checkCriteriaTwoDot = criteria.search(/중위소득.\d\d%/)
            if (checkSummaryThreeDot !== -1) {
                salary = summary[checkSummaryThreeDot + 5] + summary[checkSummaryThreeDot + 6] + summary[checkSummaryThreeDot + 7]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSummaryThree !== -1) {
                salary = summary[checkSummaryThree + 4] + summary[checkSummaryThree + 5] + summary[checkSummaryThree + 6]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSummaryTwoDot !== -1) {
                salary = summary[checkSummaryTwoDot + 5] + summary[checkSummaryTwoDot + 6]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSummaryTwo !== -1) {
                salary = summary[checkSummaryTwo + 4] + summary[checkSummaryTwo + 5]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSupportThreeDot !== -1) {
                salary = support[checkSupportThreeDot + 5] + support[checkSupportThreeDot + 6] + support[checkSupportThreeDot + 7]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSupportThree !== -1) {
                salary = support[checkSupportThree + 4] + support[checkSupportThree + 5] + support[checkSupportThree + 6]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSupportTwoDot !== -1) {
                salary = support[checkSupportTwoDot + 5] + support[checkSupportTwoDot + 6]
                // myConsole.log({ name, support, summary, criteria, salary })
            } else if (checkSupportTwo !== -1) {
                salary = support[checkSupportTwo + 4] + support[checkSupportTwo + 5]
                // myConsole.log({ name, support, summary, criteria, salary })
            }
            // else if (checkCriteriaThreeDot !== -1) {
            //     salary =
            //         criteria[checkCriteriaThreeDot + 5] +
            //         criteria[checkCriteriaThreeDot + 6] +
            //         criteria[checkCriteriaThreeDot + 7]
            //     // myConsole.log({ name, support, summary, criteria, salary })
            // } else if (checkCriteriaThree !== -1) {
            //     salary =
            //         criteria[checkCriteriaThree + 4] +
            //         criteria[checkCriteriaThree + 5] +
            //         criteria[checkCriteriaThree + 6]
            //     // myConsole.log({ name, support, summary, criteria, salary })
            // } else if (checkCriteriaTwoDot !== -1) {
            //     salary = criteria[checkCriteriaTwoDot + 5] + criteria[checkCriteriaTwoDot + 6]
            //     // myConsole.log({ name, support, summary, criteria, salary })
            // } else if (checkCriteriaTwo !== -1) {
            //     salary = criteria[checkCriteriaTwo + 4] + criteria[checkCriteriaTwo + 5]
            //     // myConsole.log({ name, support, summary, criteria, salary })
            // }
            if (salary) {
                myConsole.log({ name, support, summary, salary })
                await Data.updateOne({ name }, { $set: { salary } })
            }
            // const checkSummary = summary.search(/\d%/)
            // let salary
            // if (checkSummary !== -1) {
            //     if (!isNaN(summary[checkSummary - 2]) && !isNaN(summary[checkSummary - 1])) {
            //         salary = summary[checkSummary - 2] + summary[checkSummary - 1] + summary[checkSummary]
            //         console.log(summary, salary)
            //     } else if (!isNaN(summary[checkSummary - 1])) {
            //         salary = summary[checkSummary - 1] + summary[checkSummary]
            //         console.log(summary, salary)
            //     }
            // }
            // if (salary) {
            //     myConsole.log({ name, support, summary, criteria, salary })
            // }
        }
    }
    console.log("done")
}
