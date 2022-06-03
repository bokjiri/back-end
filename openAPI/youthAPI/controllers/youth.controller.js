const moment = require("moment")

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
    if (/^20/.test(period2[0][0])) period2[0][0] = period2[0][0].substring(2)
    if (/^20/.test(period2[1][0])) period2[1][0] = period2[1][0].substring(2)
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
exports.classifyWorkType = async (name, summary) => {
    let workType = []
    if (/농업/.test(name) || /농어민|농업인/.test(summary)) {
        workType.push("농업")
    }
    if (/광업/.test(name) || /광업/.test(summary)) {
        workType.push("광업")
    }
    if (/임업/.test(name) || /임업/.test(summary)) {
        workType.push("임업")
    }
    if (/축산업/.test(name) || /축산업/.test(summary)) {
        workType.push("축산업")
    }
    if (/어업/.test(name) || /어업|어선원/.test(summary)) {
        workType.push("어업")
    }
    return workType
}

exports.classifyAge = async (ageInfo) => {
    let age = []
    if (/~/.test(ageInfo)) {
        age = ageInfo.split("~")
        age[0] = age[0].replace(/[^0-9]/g, "")
        if (!age[0]) age[0] = "20"
        age[1] = age[1].replace(/[^0-9]/g, "")
        if (!age[1]) age[1] = "39"
    } else if (/제한없음/.test(ageInfo)) {
        age[0] = "20"
        age[1] = "39"
    } else if (/이상/.test(ageInfo) && /[^이하]/.test(ageInfo)) {
        age[0] = ageInfo.replace(/[^0-9]/g, "")
        age[1] = "39"
    } else if (/[^이상]/.test(ageInfo) && /이하/.test(ageInfo)) {
        age[0] = "20"
        age[1] = ageInfo.replace(/[^0-9]/g, "")
    } else {
        age = ageInfo
    }
    return age
}

exports.classifyDesire = async (desireInfo) => {
    let desire
    if (desireInfo === "취업지원" || desireInfo === "창업지원") {
        desire = "일자리"
    } else if (desireInfo === "주거·금융") {
        desire = "주거 및 일상생활"
    } else if (desireInfo === "생활·복지") {
        desire = "건강"
    } else if (desireInfo === "정책참여") {
        desire = "안전 및 권익보장"
    } else if (desireInfo === "코로나19") {
        desire = "기타"
    }
    return desire
}

exports.classifyGender = async (name) => {
    let gender
    if (name.search(/여성|출산/) !== -1) {
        gender = "여성"
    }
    return gender
}
