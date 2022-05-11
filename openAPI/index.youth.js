const Data = require("../schemas/data")
const moment = require("moment")

exports.findPastData = async () => {
    const data = await Data.find()
    for (checkPastData of data) {
        if (checkPastData.period !== undefined) {
            const checkPeriod = await this.classifyPeriod(checkPastData.period)
            if (!checkPeriod) {
                const checkRemove = await Data.deleteOne({ dataId: checkPastData.dataId })
                myConsole.log("checkRemove", checkRemove)
                myConsole.log("removeData", checkPastData)
            }
        }
    }
}
exports.classifyPeriod = async (period3) => {
    let period1
    let period2 = []
    let resultPeriod
    if (/~/.test(period3)) {
        period1 = period3.split("~")
        resultPeriod = await this.deletePastPeriod(period1, period2)
    } else if (/-/.test(period3) && period3 !== 1) {
        period1 = period3.split("-")
        resultPeriod = await this.deletePastPeriod(period1, period2)
    } else if (/\//.test(period3)) {
        period1 = period3.split("/")
        resultPeriod = await this.deletePastPeriod(period1, period2)
    } else if (/수시/.test(period3)) {
        resultPeriod = period3
    } else if (/상시/.test(period3)) {
        resultPeriod = period3
    } else if (/연중/.test(period3)) {
        resultPeriod = period3
    } else if (/\./.test(period3)) {
        period1 = period3.split(/\D/).filter(Boolean)
        if (period1.length === 1) {
            return undefined
        }
        if (period1.length === 2) {
            period1[2] = "30"
        }
        if (period1.length > 3) {
            return undefined
        }
        if (String(period1[0]).length === 4) {
            period1[0] = String(period1[0][2]) + String(period1[0][3])
        }
        if (String(period1[1]).length === 1) {
            period1[1] = "0" + String(period1[1])
        }
        if (String(period1[2]).length === 1) {
            period1[2] = "0" + String(period1[2])
        }

        period1 = Number(period1.join(""))
        const date = moment().format("YYMMDD")
        const dateNum = Number(date)
        if (dateNum < period1) resultPeriod = period1
    }
    return resultPeriod
}

exports.deletePastPeriod = async (period1, period2) => {
    const date = moment().format("YYMMDD")
    const dateNum = Number(date)
    period2[0] = period1[0].split(/\D/).filter(Boolean)
    period2[1] = period1[1].split(/\D/).filter(Boolean)
    if (period2[0][0] === "2022") period2[0][0] = period2[0][0].replace("2022", "22")
    if (period2[1][0] === "2022") period2[1][0] = period2[1][0].replace("2022", "22")
    if (period2[0].length !== period2[1].length) {
        period2[1].unshift(period2[0][0])
    } else if (period2[0][0] > period2[1][0]) {
        period2[1].unshift(period2[0][0])
        period2[1].pop()
    }
    if (String(period2[0][1]).length === 1) {
        period2[0][1] = "0" + period2[0][1]
    }
    if (String(period2[0][2]).length === 1) {
        period2[0][2] = "0" + period2[0][2]
    }
    if (String(period2[1][1]).length === 1) {
        period2[1][1] = "0" + period2[1][1]
    }
    if (String(period2[1][2]).length === 1) {
        period2[1][2] = "0" + period2[1][2]
    }
    if (period2[1].length === 2 && period2[0].length === 2) {
        period2[1].push("30")
        period2[0].push("30")
        period2[1] = period2[1].join("")
        if (Number(period2[1]) > dateNum) {
            return period2
        } else {
            return false
        }
    } else if (period2[1] === 3 && period2[0] === 3) {
        period2[1] = period2[1].join("")
        if (Number(period2[1]) > dateNum) {
            return period2
        } else {
            return false
        }
    } else {
        return false
    }
}
