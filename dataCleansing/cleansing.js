const Data = require("../schemas/data")
const connect = require("../schemas")
connect()

exports.genderData = async (lifeCycle, institution, support, link, obstacle, target, desire, name, summary) => {
    if (/여성/.test(name)) {
        name = name
        let gender = "여성"
        await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, gender })
    } else if (/남성/.test(summary) && !/여성/.test(summary)) {
        name = name
        let gender = "남성"
        await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, gender })
    } else {
        name = name
        let gender
        await Data.create({ lifeCycle, institution, support, link, obstacle, target, desire, name, summary, gender })
    }
}

exports.marriageData = async (name, summary) => {
    if (/결혼/.test(summary) && !/근로자|독거노인|중도입국/.test(summary)) {
        name = name
        let marriage = "기혼"
        await Data.updateOne({ name }, { $set: { marriage } })
    } else if (/ 미혼\/이혼 /.test(summary)) {
        name = name
        let marriage = ["이혼", "미혼"]
        await Data.updateOne({ name }, { $set: { marriage } })
    } else if (/미혼/.test(name) || (/미혼/.test(summary) && !/근로자|국가유공자/.test(summary) && !/국가유공자/.test(name))) {
        name = name
        let marriage = "미혼"
        await Data.updateOne({ name }, { $set: { marriage } })
    } else if (/이혼/.test(name) || (/이혼/.test(summary) && !/노숙/.test(summary))) {
        name = name
        let marriage = "이혼"
        await Data.updateOne({ name }, { $set: { marriage } })
    } else {
        name = name
        let marriage
        await Data.updateOne({ name }, { $set: { marriage } })
        console.log("결혼 업데이트")
    }
}

exports.scholarshipData = async (name, summary, lifeCycle) => {
    if ((/중등|고등/.test(name) && /대학/.test(name)) || (/중등|고등/.test(summary) && /대학/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
        name = name
        let scholarship = ["고등학교 졸업 미만", "대학(원) 재학"]
        await Data.updateOne({ name }, { $set: { scholarship } })
    } else if (/대학/.test(name) || (/대학/.test(summary) && !/자녀|일용|근로자/.test(summary))) {
        name = name
        let scholarship = "대학(원) 재학"
        await Data.updateOne({ name }, { $set: { scholarship } })
    } else if (/중등|고등/.test(name) || (/중등|고등/.test(summary) && !/자녀|학부모|국가유공자|근로자/.test(summary) && !/중장년|노년/.test(lifeCycle))) {
        name = name
        let scholarship = "고등학교 졸업 미만"
        await Data.updateOne({ name }, { $set: { scholarship } })
    } else {
        name = name
        let scholarship
        await Data.updateOne({ name }, { $set: { scholarship } })
    }
}
