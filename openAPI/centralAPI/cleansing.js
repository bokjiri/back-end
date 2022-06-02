exports.genderData = async (name, summary) => {
    if (/여성/.test(name)) {
        name = name
        let gender = "여성"
        return gender
        // await Data.updateOne({ name }, { $set: { gender } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary })
        // myConsole.log({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary })
    } else if (/남성/.test(summary) && !/여성/.test(summary)) {
        name = name
        let gender = "남성"
        return gender
        // await Data.updateOne({ name }, { $set: { gender } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary })
        // myConsole.log({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary })
    } else {
        name = name
        let gender
        return gender
        // await Data.updateOne({ name }, { $set: { gender } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender, name, summary })
    }
}

exports.marriageData = async (name, summary) => {
    if (/결혼/.test(summary) && !/근로자|독거노인|중도입국/.test(summary)) {
        name = name
        let marriage = "기혼"
        return marriage
        // await Data.updateOne({ name }, { $set: { marriage } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
    } else if (/ 미혼\/이혼 /.test(summary)) {
        name = name
        let marriage = ["이혼", "미혼"]
        return marriage
        // await Data.updateOne({ name }, { $set: { marriage } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
    } else if (/미혼/.test(name) || (/미혼/.test(summary) && !/근로자|국가유공자/.test(summary) && !/국가유공자/.test(name))) {
        name = name
        let marriage = "미혼"
        return marriage
        // await Data.updateOne({ name }, { $set: { marriage } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
    } else if (/이혼/.test(name) || (/이혼/.test(summary) && !/노숙/.test(summary))) {
        name = name
        let marriage = "이혼"
        return marriage
        // await Data.updateOne({ name }, { $set: { marriage } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
    } else {
        name = name
        let marriage
        return marriage
        // await Data.updateOne({ name }, { $set: { marriage } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage, name, summary })
    }
}

exports.scholarshipData = async (lifeCycle, name, summary) => {
    if ((/중등|고등/.test(name) && /대학/.test(name)) || (/중등|고등/.test(summary) && /대학/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
        name = name
        let scholarship = ["고등학교 졸업 미만", "대학(원) 재학"]
        return scholarship
        // await Data.updateOne({ name }, { $set: { scholarship } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
    } else if (/대학/.test(name) || (/대학/.test(summary) && !/자녀|일용|근로자/.test(summary))) {
        name = name
        let scholarship = "대학(원) 재학"
        return scholarship
        // await Data.updateOne({ name }, { $set: { scholarship } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
    } else if (/중등|고등/.test(name) || (/중등|고등/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
        name = name
        let scholarship = "고등학교 졸업 미만"
        return scholarship
        // await Data.updateOne({ name }, { $set: { scholarship } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship, name, summary })
        // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
    } else {
        name = name
        let scholarship
        return scholarship
        // await Data.updateOne({ name }, { $set: { scholarship } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship, name, summary })
    }
}

exports.workTypeData = async (support, name, summary) => {
    if (/농업/.test(name) || /농어민|농업인/.test(summary)) {
        let workType = ["농업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
    if (/광업/.test(name) || /광업/.test(summary)) {
        let workType = ["광업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
    if (/임업/.test(name) || /임업/.test(summary)) {
        let workType = ["임업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
    if (/축산업/.test(name) || /축산업/.test(summary)) {
        let workType = ["축산업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
    if (/어업/.test(name) || /어업|어선원/.test(summary)) {
        let workType = ["어업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
    if (/창업|스타트업/.test(name) || (/창업|스타트업/.test(summary) && !/기관|중소기업/.test(summary) && !/기업/.test(support))) {
        let workType = ["창업"]
        return workType
        // await Data.updateOne({ name }, { $push: { workType } })
        // await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
        // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
    }
}
exports.classifyAge = async (summary, support) => {
    let age = []
    const checkSupport = support.replace(/\n/g, "").replace(/ /g, "")
    const checkSummary = summary.replace(/\n/g, "").replace(/ /g, "")

    const indexCheckUpSummary = checkSummary.search(/\d세이상|\d세초과/)
    const indexCheckDownSummary = checkSummary.search(/\d세이하|\d세미만/)
    const indexCheckUpSupport = checkSupport.search(/\d세이상|\d세초과/)
    const indexCheckDownSupport = checkSupport.search(/\d세이하|\d세미만/)
    const checkSummarySymbol = summary.search(/\d세~\d|\d~\d\d세|\d~\d세|\d~만\d|\d세~만/)
    const checkSupportSymbol = support.search(/\d세~\d|\d~\d\d세|\d~\d세|\d~만\d|\d세~만/)
    if (indexCheckUpSummary !== -1) {
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
    if (indexCheckDownSummary !== -1) {
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
    if (age.length === 2 && Number(age[0]) > Number(age[1])) {
        return null
    } else if (age.length !== 0) {
        return age
    }
    if (checkSummarySymbol !== -1) {
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
        return age
    } else if (checkSupportSymbol !== -1) {
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
        return age
    }
}
// afterPushAge()
exports.afterPushAge = async () => {
    console.log("start")
    // const data = await Data.find({}, { _id: false })
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

exports.classifyProtect = async (summary, support) => {
    let target
    const checkSupport = support.replace(/\n/g, "").replace(/ /g, "")
    const checkSummary = summary.replace(/\n/g, "").replace(/ /g, "")
    const checkSummarySymbol = checkSummary.search(/보호종료/)
    const checkSupportSymbol = checkSupport.search(/보호종료/)
    if (checkSummarySymbol !== -1) {
        target = "보호종료"
    } else if (checkSupportSymbol !== -1) {
        target = "보호종료"
    }
    return target
}
exports.classifyVictim = async (summary, support) => {
    let target
    const checkSupport = support.replace(/\n/g, "").replace(/ /g, "")
    const checkSummary = summary.replace(/\n/g, "").replace(/ /g, "")
    const checkSummarySymbol = checkSummary.search(/가정폭력/)
    const checkSupportSymbol = checkSupport.search(/가정폭력/)
    if (checkSummarySymbol !== -1) {
        target = "가정폭력"
    } else if (checkSupportSymbol !== -1) {
        target = "가정폭력"
    }
    return target
}

exports.classifyEmployment = async (name) => {
    const checkName = name.replace(/\n/g, "").replace(/ /g, "")
    const checkNameSymbol = checkName.search(/면접|옷장/)
    if (checkNameSymbol !== -1) {
        const job = "미취업자"
        return job
    }
}

// checkSalaryData()
exports.checkSalaryData = () => {
    // const checkSalary = await Data.find({ target: "저소득" })
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
exports.classifySalary = (summary, support) => {
    let salary
    const checkSupport = support.replace(/\n/g, "").replace(/ /g, "")
    const checkSummary = summary.replace(/\n/g, "").replace(/ /g, "")
    // const criteria = i.criteria.replace(/\n/g, "").replace(/ /g, "")
    const checkSummaryThree = checkSummary.search(/중위소득\d\d\d%/)
    const checkSummaryThreeDot = checkSummary.search(/중위소득.\d\d\d%/)
    const checkSummaryTwo = checkSummary.search(/중위소득\d\d%/)
    const checkSummaryTwoDot = checkSummary.search(/중위소득.\d\d%/)
    const checkSupportThree = checkSupport.search(/중위소득\d\d\d%/)
    const checkSupportThreeDot = checkSupport.search(/중위소득.\d\d\d%/)
    const checkSupportTwo = checkSupport.search(/중위소득\d\d%/)
    const checkSupportTwoDot = checkSupport.search(/중위소득.\d\d%/)
    // const checkCriteriaThree = criteria.search(/중위소득\d\d\d%/)
    // const checkCriteriaThreeDot = criteria.search(/중위소득.\d\d\d%/)
    // const checkCriteriaTwo = criteria.search(/중위소득\d\d%/)
    // const checkCriteriaTwoDot = criteria.search(/중위소득.\d\d%/)
    if (checkSummaryThreeDot !== -1) {
        salary = checkSummary[checkSummaryThreeDot + 5] + checkSummary[checkSummaryThreeDot + 6] + checkSummary[checkSummaryThreeDot + 7]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSummaryThree !== -1) {
        salary = checkSummary[checkSummaryThree + 4] + checkSummary[checkSummaryThree + 5] + checkSummary[checkSummaryThree + 6]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSummaryTwoDot !== -1) {
        salary = checkSummary[checkSummaryTwoDot + 5] + checkSummary[checkSummaryTwoDot + 6]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSummaryTwo !== -1) {
        salary = checkSummary[checkSummaryTwo + 4] + checkSummary[checkSummaryTwo + 5]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSupportThreeDot !== -1) {
        salary = checkSupport[checkSupportThreeDot + 5] + checkSupport[checkSupportThreeDot + 6] + checkSupport[checkSupportThreeDot + 7]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSupportThree !== -1) {
        salary = checkSupport[checkSupportThree + 4] + checkSupport[checkSupportThree + 5] + checkSupport[checkSupportThree + 6]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSupportTwoDot !== -1) {
        salary = checkSupport[checkSupportTwoDot + 5] + checkSupport[checkSupportTwoDot + 6]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    } else if (checkSupportTwo !== -1) {
        salary = checkSupport[checkSupportTwo + 4] + checkSupport[checkSupportTwo + 5]
        // myConsole.log({ name, checkSupport, checkSummary, criteria, salary })
    }
    // else if (checkCriteriaThreeDot !== -1) {
    //     salary =
    //         criteria[checkCriteriaThreeDot + 5] +
    //         criteria[checkCriteriaThreeDot + 6] +
    //         criteria[checkCriteriaThreeDot + 7]
    //     // myConsole.log({ name, support, checkSummary, criteria, salary })
    // } else if (checkCriteriaThree !== -1) {
    //     salary =
    //         criteria[checkCriteriaThree + 4] +
    //         criteria[checkCriteriaThree + 5] +
    //         criteria[checkCriteriaThree + 6]
    //     // myConsole.log({ name, support, checkSummary, criteria, salary })
    // } else if (checkCriteriaTwoDot !== -1) {
    //     salary = criteria[checkCriteriaTwoDot + 5] + criteria[checkCriteriaTwoDot + 6]
    //     // myConsole.log({ name, support, checkSummary, criteria, salary })
    // } else if (checkCriteriaTwo !== -1) {
    //     salary = criteria[checkCriteriaTwo + 4] + criteria[checkCriteriaTwo + 5]
    //     // myConsole.log({ name, support, checkSummary, criteria, salary })
    // }
    if (salary) {
        return salary
    }
    // const checkSummary = checkSummary.search(/\d%/)
    // let salary
    // if (checkSummary !== -1) {
    //     if (!isNaN(checkSummary[checkSummary - 2]) && !isNaN(checkSummary[checkSummary - 1])) {
    //         salary = checkSummary[checkSummary - 2] + checkSummary[checkSummary - 1] + checkSummary[checkSummary]
    //         console.log(checkSummary, salary)
    //     } else if (!isNaN(checkSummary[checkSummary - 1])) {
    //         salary = checkSummary[checkSummary - 1] + checkSummary[checkSummary]
    //         console.log(checkSummary, salary)
    //     }
    // }
    // if (salary) {
    //     myConsole.log({ name, support, checkSummary, criteria, salary })
    // }
}
