require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const schedule = require("node-schedule")
const Data = require("../../schemas/data")
const { genderData, marriageData, scholarshipData, workTypeData, classifyAge, classifyEmployment, classifyProtect, classifySalary, classifyVictim } = require("./cleansing")
// const connect = require("../schemas")
// connect()

module.exports = async () => {
    // const rule = new schedule.RecurrenceRule()
    // rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    // rule.hour = 11
    // rule.minute = 11
    // rule.second = 11
    // rule.tz = "Asia/Seoul"
    // schedule.scheduleJob(rule, async () => {
    // })
    console.log("Updating...")
    console.time("await")
    await loadAwaitOpenApi()
    console.timeEnd("await")
    console.time("promise")
    await loadPromiseOpenApi()
    console.timeEnd("promaise")
    console.log("Done")
}

async function loadPromiseOpenApi() {
    try {
        const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
        const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
        for (let i = 0; i < desireCode.length; i++) {
            let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
            let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY /* Service Key*/
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
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.errMsg)
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg)
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.returnReasonCode)
            const servList = jsonParse.wantedList.servList
            for (j of servList) {
                console.log("a")
                const servId = j.servId._text
                const desire = desireName[i]
                const name = j.servNm._text
                // const checkData = await Data.findOne({ name })
                // if (checkData) {
                //     continue
                // }
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

                let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
                let qqueryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY /* Service Key*/
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

                // await genderData(name, summary)
                // await marriageData(name, summary)
                // await scholarshipData(lifeCycle, name, summary)
                // await workTypeData(support, name, summary)
                // await classifyVictim(summary, support)
                // await classifyAge(summary, support)
                // await classifyEmployment(name)
                // await classifyProtect(summary, support)
                // await classifySalary(summary, support)

                const gender = genderData(name, summary)
                const marriage = marriageData(name, summary)
                const scholarship = scholarshipData(lifeCycle, name, summary)
                const workType = workTypeData(support, name, summary)
                const victim = classifyVictim(summary, support)
                const age = classifyAge(summary, support)
                const job = classifyEmployment(name)
                const protect = classifyProtect(summary, support)
                const salary = classifySalary(summary, support)
                await Promise.all([gender, marriage, scholarship, workType, age, victim, job, protect, salary])

                if (victim) target.push(victim)
                if (protect) target.push(protect)
                // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary, marriage, scholarship, workType, salary, job, age })
            }
        }
    } catch (error) {
        console.log(error)
    }
}
async function loadAwaitOpenApi() {
    try {
        const desireCode = [100, 110, 120, 130, 140, 150, 160, 170, 180]
        const desireName = ["일자리", "주거 및 일상생활", "주거 및 일상생활", "건강", "건강", "교육 및 돌봄", "교육 및 돌봄", "기타", "안전 및 권익보장"]
        for (let i = 0; i < desireCode.length; i++) {
            let url = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfarelist"
            let queryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY /* Service Key*/
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
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.errMsg)
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.returnAuthMsg)
            // console.log(jsonParse.OpenAPI_ServiceResponse.cmmMsgHeader.returnReasonCode)
            const servList = jsonParse.wantedList.servList
            for (j of servList) {
                console.log("a")
                const servId = j.servId._text
                const desire = desireName[i]
                const name = j.servNm._text
                // const checkData = await Data.findOne({ name })
                // if (checkData) {
                //     continue
                // }
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

                let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
                let qqueryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY /* Service Key*/
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

                const gender = await genderData(name, summary)
                const marriage = await marriageData(name, summary)
                const scholarship = await scholarshipData(lifeCycle, name, summary)
                const workType = await workTypeData(support, name, summary)
                const victim = await classifyVictim(summary, support)
                const age = await classifyAge(summary, support)
                const job = await classifyEmployment(name)
                const protect = await classifyProtect(summary, support)
                const salary = await classifySalary(summary, support)

                // const gender = genderData(name, summary)
                // const marriage = marriageData(name, summary)
                // const scholarship = scholarshipData(lifeCycle, name, summary)
                // const workType = workTypeData(support, name, summary)
                // const victim = classifyVictim(summary, support)
                // const age = classifyAge(summary, support)
                // const job = classifyEmployment(name)
                // const protect = classifyProtect(summary, support)
                // const salary = classifySalary(summary, support)
                // await Promise.all([gender, marriage, scholarship, workType, age, victim, job, protect, salary])

                if (victim) target.push(victim)
                if (protect) target.push(protect)
                // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary, marriage, scholarship, workType, salary, job, age })
            }
        }
    } catch (error) {
        console.log(error)
    }
}
