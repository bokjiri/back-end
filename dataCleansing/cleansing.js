const Data = require("../schemas/data")
// const connect = require("../schemas")
// connect()
// const fs = require("fs")
// fs.truncate("./dataCleansing/agriculture.txt", () => {
//     console.log("File Content Deleted")
// })
// const myConsole = new console.Console(fs.createWriteStream("./dataCleansing/agriculture.txt"))

exports.genderData = async (lifeCycle, institution, support, link, obstacle, target, desire, name, summary) => {
    const findData = await Data.find({ name })
    if (!findData) {
        if (/여성/.test(name)) {
            name = name
            let gender = "여성"
            // await Data.updateOne({ name }, { $set: { gender } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, gender })
        } else if (/남성/.test(summary) && !/여성/.test(summary)) {
            name = name
            let gender = "남성"
            // await Data.updateOne({ name }, { $set: { gender } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender })
            // myConsole.log({ lifeCycle, institution, support, link, obstacle, target, desire, gender })
        } else {
            name = name
            let gender
            // await Data.updateOne({ name }, { $set: { gender } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, gender })
        }
        console.log("성별 업데이트중...")
    } else {
        console.log("성별 최신버전!")
    }
}

exports.marriageData = async (lifeCycle, institution, support, link, obstacle, target, desire, name, summary) => {
    const findData = await Data.find({ name })
    if (!findData) {
        if (/결혼/.test(summary) && !/근로자|독거노인|중도입국/.test(summary)) {
            name = name
            let marriage = "기혼"
            // await Data.updateOne({ name }, { $set: { marriage } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
        } else if (/ 미혼\/이혼 /.test(summary)) {
            name = name
            let marriage = ["이혼", "미혼"]
            // await Data.updateOne({ name }, { $set: { marriage } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
        } else if (/미혼/.test(name) || (/미혼/.test(summary) && !/근로자|국가유공자/.test(summary) && !/국가유공자/.test(name))) {
            name = name
            let marriage = "미혼"
            // await Data.updateOne({ name }, { $set: { marriage } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
        } else if (/이혼/.test(name) || (/이혼/.test(summary) && !/노숙/.test(summary))) {
            name = name
            let marriage = "이혼"
            // await Data.updateOne({ name }, { $set: { marriage } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, marriage })
        } else {
            name = name
            let marriage
            // await Data.updateOne({ name }, { $set: { marriage } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, marriage })
        }
        console.log("결혼여부 업데이트중...")
    } else {
        console.log("결혼여부 최신버전!")
    }
}

exports.scholarshipData = async (lifeCycle, institution, support, link, obstacle, target, desire, name, summary) => {
    const findData = await Data.find({ name })
    if (!findData) {
        if ((/중등|고등/.test(name) && /대학/.test(name)) || (/중등|고등/.test(summary) && /대학/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
            name = name
            let scholarship = ["고등학교 졸업 미만", "대학(원) 재학"]
            // await Data.updateOne({ name }, { $set: { scholarship } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
        } else if (/대학/.test(name) || (/대학/.test(summary) && !/자녀|일용|근로자/.test(summary))) {
            name = name
            let scholarship = "대학(원) 재학"
            // await Data.updateOne({ name }, { $set: { scholarship } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
        } else if (/중등|고등/.test(name) || (/중등|고등/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
            name = name
            let scholarship = "고등학교 졸업 미만"
            // await Data.updateOne({ name }, { $set: { scholarship } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
            // myConsole.log({ name, lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
        } else {
            name = name
            let scholarship
            // await Data.updateOne({ name }, { $set: { scholarship } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, scholarship })
        }
        console.log("학력 업데이트중...")
    } else {
        console.log("학력 최신버전!")
    }
}

exports.workTypeData = async (lifeCycle, institution, support, link, obstacle, target, desire, name, summary) => {
    const findData = await Data.find({ name })
    if (!findData) {
        if (/농업/.test(name) || /농어민/.test(summary)) {
            let workType = ["농업"]
            // await Data.updateOne({ name }, { $push: { workType } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
            // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
        }
        if (/광업/.test(name) || /광업/.test(summary)) {
            let workType = ["광업"]
            // await Data.updateOne({ name }, { $push: { workType } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
            // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
        }
        if (/임업/.test(name) || /임업/.test(summary)) {
            let workType = ["임업"]
            // await Data.updateOne({ name }, { $push: { workType } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
            // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
        }
        if (/축산업/.test(name) || /축산업/.test(summary)) {
            let workType = ["축산업"]
            // await Data.updateOne({ name }, { $push: { workType } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
            // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
        }
        if (/어업/.test(name) || /어업/.test(summary)) {
            let workType = ["어업"]
            // await Data.updateOne({ name }, { $push: { workType } })
            await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, workType })
            // myConsole.log({ summary, lifeCycle, institution, support, link, obstacle, target, desire, name, workType })
        }
        console.log("업종 업데이트중...")
    } else {
        console.log("업종 최신버전!")
    }
}
