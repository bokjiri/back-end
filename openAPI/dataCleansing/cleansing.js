// const connect = require("../schemas")
// connect()
// const fs = require("fs")
// fs.truncate("./openAPI/dataCleansing/job.txt", () => {
//     console.log("File Content Deleted")
// })
// const myConsole = new console.Console(fs.createWriteStream("./openAPI/dataCleansing/job.txt"))

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
