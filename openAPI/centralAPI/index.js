require("dotenv").config()
const axios = require("axios")
const convert = require("xml-js")
const schedule = require("node-schedule")
const moment = require("moment")
const newYouthApiDataDate = moment().format("YYYY-MM-DD")
const Data = require("../../schemas/data")
const fs = require("fs")
const { genderData, marriageData, scholarshipData, workTypeData, classifyAge, classifyEmployment, classifyProtect, classifySalary, classifyVictim } = require("./cleansing")
const dirrr = process.env.UPDATE_DATA_CENTRAL_LOG || "./openAPI/centralAPI/index.txt"
const dir = `${dirrr}${newYouthApiDataDate}.log`
const { Logger } = require("../../logging")

module.exports = async () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.hour = 11
    rule.minute = 11
    rule.second = 11
    rule.tz = "Asia/Seoul"
    schedule.scheduleJob(rule, async () => {
        fs.truncate(dir, () => {
            console.log("File Content Deleted")
        })
        const myConsole = new console.Console(fs.createWriteStream(dir))
        myConsole.log("Updating...")
        await loadOpenApi(myConsole)
        myConsole.log("Done")
    })
}

async function loadOpenApi(myConsole) {
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
            const servList = jsonParse.wantedList.servList
            for (let j of servList) {
                const servId = j.servId._text
                const desire = desireName[i]
                const name = j.servNm._text
                const checkData = await Data.findOne({ name })
                if (checkData) continue

                let target
                if (j.trgterIndvdlArray !== undefined) {
                    target = j.trgterIndvdlArray._text.split(", ")
                } else {
                    target = []
                }
                let obstacle
                if (j.obstKiArray !== undefined) {
                    obstacle = j.obstKiArray._text.split(", ")
                } else {
                    obstacle = []
                }
                let lifeCycle
                if (j.lifeArray !== undefined) {
                    lifeCycle = j.lifeArray._text.split(", ")
                } else {
                    lifeCycle = []
                }
                const link = j.servDtlLink._text

                let detailUrl = "http://apis.data.go.kr/B554287/NationalWelfareInformations/NationalWelfaredetailed"
                let detailQueryParams = "?" + encodeURIComponent("serviceKey") + "=" + process.env.SERVICE_KEY /* Service Key*/
                detailQueryParams += "&" + encodeURIComponent("callTp") + "=" + encodeURIComponent("D") /* */
                detailQueryParams += "&" + encodeURIComponent("servId") + "=" + encodeURIComponent(servId) /* */

                const response = await axios.get(detailUrl + detailQueryParams)
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

                const gender = genderData(name, summary)
                const marriage = marriageData(name, summary)
                const scholarship = scholarshipData(lifeCycle, name, summary)
                const workType = workTypeData(support, name, summary)
                const victim = classifyVictim(summary, support)
                const age = classifyAge(summary, support)
                const job = classifyEmployment(name)
                const protect = classifyProtect(summary, support)
                const salary = classifySalary(summary, support)

                Promise.all([gender, marriage, scholarship, workType, age, victim, job, protect, salary]).then(async ([gender, marriage, scholarship, workType, age, victim, job, protect, salary]) => {
                    myConsole.log({ name, gender, marriage, scholarship, workType, age, victim, job, protect, salary })
                    if (victim) target.push(victim)
                    if (protect) target.push(protect)
                    await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary, marriage, scholarship, workType, salary, job, age })
                })
            }
        }
    } catch (error) {
        Logger.error(error)
    }
}
