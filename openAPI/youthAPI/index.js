const axios = require("axios")
const convert = require("xml-js")
const schedule = require("node-schedule")
const moment = require("moment")
const newYouthApiDataDate = moment().format("YYYY-MM-DD")
const Data = require("../../schemas/data")
const { classifyPeriod, classifyWorkType, classifyAge, classifyDesire, classifyGender } = require("./controllers/youth.controller")
const { regionCode, regionName } = require("../category/region")
const dirrr = process.env.UPDATE_DATA_LOG || "./openAPI/youthAPI/youth.txt"
const fs = require("fs")
const dir = `${dirrr}${newYouthApiDataDate}.log`
const { Logger } = require("../../logging")

module.exports = () => {
    const rule = new schedule.RecurrenceRule()
    rule.dayOfWeek = [0, new schedule.Range(0, 6)]
    rule.hour = 10
    rule.minute = 10
    rule.second = 10
    rule.tz = "Asia/Seoul"

    schedule.scheduleJob(rule, async () => {
        fs.truncate(dir, () => {
            console.log("File Content Deleted")
        })
        const myConsole = new console.Console(fs.createWriteStream(dir))
        myConsole.log("load start")
        await load(myConsole)
        myConsole.log("load done")
        await findPastData(myConsole)
        myConsole.log("findPastData done")
    })
}

async function findPastData(myConsole) {
    const data = await Data.find()
    for (checkPastData of data) {
        if (checkPastData.period !== undefined) {
            const checkPeriod = await classifyPeriod(checkPastData.period)
            if (!checkPeriod) {
                const checkRemove = await Data.deleteOne({ dataId: checkPastData.dataId })
                myConsole.log("checkRemove", checkRemove)
                myConsole.log("removeData", checkPastData)
            }
        }
    }
}

async function load(myConsole) {
    try {
        for (let i = 1; i < 3; i++) {
            for (let j = 0; j < regionCode.length; j++) {
                let url = "https://www.youthcenter.go.kr/opi/empList.do"
                let queryParams = "?" + encodeURIComponent("openApiVlak") + "=" + process.env.CHUNG_KEY /* Service Key*/
                queryParams += "&" + encodeURIComponent("pageIndex") + "=" + encodeURIComponent(i) /* */
                queryParams += "&" + encodeURIComponent("display") + "=" + encodeURIComponent("100") /* */
                queryParams += "&" + encodeURIComponent("srchPolyBizSecd") + "=" + encodeURIComponent(regionCode[j]) /* */

                const response = await axios.get(url + queryParams)
                const data = response.data
                const xmlToJson = convert.xml2json(data, {
                    compact: true,
                    space: 4,
                })
                const jsonParse = JSON.parse(xmlToJson)
                const empsInfo = jsonParse.empsInfo.emp
                if (Array.isArray(empsInfo)) {
                    for (let k of empsInfo) {
                        const name = k.polyBizSjnm._cdata //?????????
                        const check = await Data.findOne({ name })
                        const re = /2021|2020|2019|2018/
                        if (
                            !check &&
                            k.accrRqisCn._cdata.search(/????????????/) !== -1 && //??????
                            k.majrRqisCn._cdata === "????????????" && //??????
                            /^http/.test(k.rqutUrla._cdata) && // ??????
                            name.search(re) === -1 && //?????????
                            k.rqutPrdCn._cdata.search(re) === -1 && //????????????
                            k.sporCn._cdata.search(re) === -1 && //??????
                            k.rqutProcCn._cdata.search(re) === -1 && //????????????
                            k.jdgnPresCn._cdata.search(re) === -1 && //????????????
                            (/^????????????$/.test(k.empmSttsCn._cdata) || /^????????????$/.test(k.empmSttsCn._cdata)) //???????????? - ????????????
                        ) {
                            // myConsole.log("?????? ??? ????????? ??????", k.polyBizTy._cdata)
                            // myConsole.log("???????????? - ??????", k.majrRqisCn._cdata)
                            // myConsole.log("???????????? - ????????????", k.cnsgNmor._cdata)
                            // myConsole.log("????????????", k.rqutProcCn._cdata)
                            // myConsole.log("????????????", k.jdgnPresCn._cdata)
                            // myConsole.log("????????????", k.sporScvl._cdata)
                            const resultPeriod = await classifyPeriod(k.rqutPrdCn._cdata)

                            if (resultPeriod === false || resultPeriod === undefined) continue

                            let job // ???????????? - ????????????
                            if (k.empmSttsCn._cdata !== "????????????") job = k.empmSttsCn._cdata // ???????????? - ????????????
                            let scholarship // ???????????? - ??????
                            if (k.accrRqisCn._cdata !== "????????????") scholarship = k.accrRqisCn._cdata // ???????????? - ??????
                            const institution = k.cnsgNmor._cdata // ???????????????
                            const link = k.rqutUrla._cdata // ????????? ?????? ??????
                            const support = k.sporCn._cdata // ????????????
                            const region = regionName[j] // ??????
                            const process = k.rqutProcCn._cdata
                            const period = k.rqutPrdCn._cdata
                            const ageInfo = k.ageInfo._cdata
                            const age = classifyAge(ageInfo)

                            const gender = classifyGender(name)

                            const desireInfo = k.plcyTpNm._cdata //k.plcyTpNm._cdata = ????????????
                            const desire = classifyDesire(desireInfo)

                            const summary = k.polyItcnCn._cdata //????????????
                            const workType = classifyWorkType(name, summary)
                            Promise.all([age, gender, desire, workType]).then(async ([age, gender, desire, workType]) => {
                                myConsole.log("?????? ??? ????????? ??????", k.polyBizTy._cdata)
                                myConsole.log("???????????? - ??????", k.majrRqisCn._cdata)
                                myConsole.log("???????????? - ????????????", k.cnsgNmor._cdata)
                                myConsole.log("????????????", k.rqutProcCn._cdata)
                                myConsole.log("????????????", k.jdgnPresCn._cdata)
                                myConsole.log("????????????", k.sporScvl._cdata)
                                myConsole.log("?????? ID", k.bizId._text)
                                myConsole.log("?????? ID", k.polyBizSecd._text)
                                myConsole.log("regioncode", regionCode[j])
                                myConsole.log({ page: i })
                                myConsole.log({ name })
                                myConsole.log({ age })
                                myConsole.log({ summary })
                                myConsole.log({ desire })
                                myConsole.log({ job })
                                myConsole.log({ workType })
                                myConsole.log({ scholarship })
                                myConsole.log({ institution })
                                myConsole.log({ region })
                                myConsole.log({ link })
                                myConsole.log({ support })
                                myConsole.log({ gender })
                                myConsole.log({ period })
                                myConsole.log({ ????????????: k.jdgnPresCn._cdata })
                                myConsole.log({ process })
                                myConsole.log("-------------------")

                                await Data.create({
                                    age,
                                    name,
                                    summary,
                                    desire,
                                    job,
                                    scholarship,
                                    institution,
                                    region,
                                    link,
                                    support,
                                    gender,
                                    period,
                                    process,
                                    workType,
                                })
                            })
                        } else {
                            continue
                        }
                    }
                }
            }
        }
    } catch (error) {
        Logger.error(error)
    }
}
