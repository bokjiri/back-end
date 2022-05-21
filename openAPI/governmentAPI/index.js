require("dotenv").config()
const fs = require("fs")
const axios = require("axios")
const DataList = require("../schemas/data")
const connect = require("../schemas")
const { supportCode } = require("./jungbu.category")

connect()
fs.truncate("./openAPI/jungbu.category3.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./openAPI/jungbu.category3.txt"))
// serviceList()
async function serviceList() {
    try {
        let totalCount
        let page = 1
        let perPage = 1
        let serviceKey =
            "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
        let url = `https://api.odcloud.kr/api/gov24/v1/serviceList?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`
        await axios.get(url).then((response) => {
            const data = response.data
            totalCount = data.totalCount
            console.log(totalCount)
        })

        for (let i = 1; i < totalCount + 1; i++) {
            let page = i
            let perPage = 1
            let serviceKey =
                "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
            let url2 = `https://api.odcloud.kr/api/gov24/v1/serviceList?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`
            let serviceId
            let name
            let institution
            let region
            let age = []
            let gender
            await axios.get(url2).then((response) => {
                const [data] = response.data.data
                // cleansingData(data)
                name = data.서비스명
                serviceId = data.서비스ID
                if (supportCode.indexOf(serviceId) !== -1) {
                    const rawCompany = data.소관기관명
                    const company = rawCompany.split(" ")
                    if (company.length !== 2) {
                        institution = company
                    } else {
                        region = company
                    }
                }
            })
            let supportUrl = `https://api.odcloud.kr/api/gov24/v1/supportConditions?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${serviceId}&serviceKey=${serviceKey}`
            await axios.get(supportUrl).then((response) => {
                const [data] = response.data.data
                console.log(data)
                age[0] = data.JA0110
                age[1] = data.JA0111
                if (data.JA0101 === "Y" && data.JA0102 === "Y") {
                    gender = undefined
                } else if (data.JA0101 === "Y") {
                    gender = "남성"
                } else if (data.JA0102 === "Y") {
                    gender = "여성"
                }
                // console.log(data)
            })
            myConsole.log({ name, institution, region, gender, age })
        }
    } catch (err) {
        console.log(err)
    }
}
serviceDetail()
async function serviceDetail() {
    try {
        for (let i = 0; i < supportCode.length; i++) {
            const serviceKey =
                "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
            let url2 = `https://api.odcloud.kr/api/gov24/v1/serviceDetail?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${supportCode[i]}&serviceKey=${serviceKey}`
            let name
            let institution
            let region
            let age = []
            let gender
            let job
            let target = []
            let scholarship = []
            let salary
            let disability
            let marriage = []
            let deleteIdx = []
            const regex1 = /\d/g
            const regex2 = /\d세/g
            const promise2 = await axios.get(url2).then((response) => {
                const [data] = response.data.data
                name = data.서비스명
                period = data.신청기한
                serviceId = data.서비스ID
                const rawCompany = data.소관기관명
                // console.log(rawCompany)
                const company = rawCompany.split(" ")
                // console.log(company)
                if (company.length !== 2) {
                    institution = company
                } else {
                    region = company
                }

                if (!regex1.test(period) || regex2.test(period)) {
                    period = undefined
                } else if (
                    period.includes("중단") === true ||
                    period.includes("2월 중") === true ||
                    period.includes("2월 말") === true ||
                    period.includes("3월 중") === true ||
                    period.includes("전년도") === true
                ) {
                    deleteIdx.push(i)
                }
            })
            let supportUrl = `https://api.odcloud.kr/api/gov24/v1/supportConditions?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${supportCode[i]}&serviceKey=${serviceKey}`
            const promise1 = await axios.get(supportUrl).then((response) => {
                const [data] = response.data.data
                //---------------------------------01
                age[0] = data.JA0110
                age[1] = data.JA0111
                if (data.JA0101 === "Y" && data.JA0102 === "Y") {
                    gender = undefined
                } else if (data.JA0101 === "Y") {
                    gender = "남성"
                } else if (data.JA0102 === "Y") {
                    gender = "여성"
                }
                //---------------------------------02
                if (
                    data.JA0201 === "Y" &&
                    data.JA0202 === "Y" &&
                    data.JA0203 === "Y" &&
                    data.JA0204 === "Y" &&
                    data.JA0205 === "Y"
                ) {
                    salary = undefined
                } else if (data.JA0201 === "Y" && data.JA0202 === "Y" && data.JA0203 === "Y" && data.JA0204 === "Y") {
                    salary = 200
                } else if (data.JA0201 === "Y" && data.JA0202 === "Y" && data.JA0203 === "Y") {
                    salary = 100
                } else if (data.JA0201 === "Y" && data.JA0202 === "Y") {
                    salary = 75
                } else if (data.JA0201 === "Y") {
                    salary = 50
                }
                //---------------------------------03
                if (
                    name.includes("미혼") === true ||
                    (name.includes("산모") === true && name.includes("청소년") === true)
                ) {
                    marriage.push("미혼")
                } else if (
                    name.includes("결혼") === true ||
                    name.includes("부부") === true ||
                    (name.includes("산모") === true && name.includes("청소년") === false) ||
                    (name.includes("부모") === true && name.includes("한부모") === false)
                ) {
                    marriage.push("기혼")
                }
                if (data.JA0301 === "Y" && data.JA0302 === "Y" && data.JA0303 === "Y") {
                } else if (
                    data.JA0301 === "Y" ||
                    data.JA0302 === "Y" ||
                    data.JA0303 === "Y" ||
                    name.includes("미혼모") === true ||
                    (name.includes("출산") === true && name.includes("장려") === true) ||
                    name.includes("맘") === true
                ) {
                    target.push("임신·출산")
                }
                if (data.JA0304 === "Y" && data.JA0305 === "Y" && name.includes("장애") === false) {
                } else if (data.JA0304 === "Y" || data.JA0305 === "Y" || name.includes("장애") === true) {
                    disability = "있음"
                }
                if (
                    data.JA0306 === "Y" &&
                    data.JA0307 === "Y" &&
                    data.JA0308 === "Y" &&
                    data.JA0309 === "Y" &&
                    data.JA0310 === "Y" &&
                    data.JA0311 === "Y" &&
                    data.JA0312 === "Y"
                ) {
                } else if (
                    data.JA0306 === "Y" ||
                    data.JA0307 === "Y" ||
                    data.JA0308 === "Y" ||
                    data.JA0309 === "Y" ||
                    data.JA0310 === "Y" ||
                    data.JA0311 === "Y" ||
                    data.JA0312 === "Y"
                ) {
                    target.push("보훈대상자")
                }
                if (data.JA0313 === "Y" && data.JA0314 === "Y" && data.JA0315 === "Y" && data.JA0316 === "Y") {
                } else {
                    if (data.JA0313 === "Y" || name.includes("농업") === true || name.includes("꿀벌") === true) {
                        target.push("농업인")
                    }
                    if (data.JA0314 === "Y" || name.includes("어업") === true) {
                        target.push("어업인")
                    } else {
                        if (
                            data.JA0314 === "Y" ||
                            name.includes("축산") === true ||
                            name.includes("양축농") === true ||
                            name.includes("송아지") === true ||
                            name.includes("배합사료") === true
                        ) {
                            target.push("축산업인")
                        }
                        if (data.JA0314 === "Y" || name.includes("임업") === true) {
                            target.push("임업인")
                        }
                    }
                }
                if (data.JA0317 === "Y" && data.JA0318 === "Y" && data.JA0319 === "Y" && data.JA0320 === "Y") {
                } else {
                    if (
                        data.JA0317 === "Y" ||
                        data.JA0318 === "Y" ||
                        data.JA0319 === "Y" ||
                        name.includes("인재육성") === true ||
                        name.includes("청소년") === true
                    ) {
                        scholarship.push("고등학교 졸업 미만")
                    }
                    if (data.JA0320 === "Y" || name.includes("대학생") === true || name.includes("인재육성") === true) {
                        scholarship.push("대학(원) 재학")
                        scholarship.push("대학(원) 휴학")
                    }
                    if (
                        name.includes("대학진학") === true ||
                        name.includes("대학입학") === true ||
                        name.includes("비진학") === true
                    ) {
                        scholarship.push("고등학교 졸업")
                    }
                }
                if (data.JA0326 === "Y" && data.JA0327 === "Y") {
                    job = undefined
                } else if (data.JA0326 === "Y" && data.JA0327 !== "Y") {
                    job = "취업"
                } else if (data.JA0327 === "Y") {
                    job = "미취업"
                }
                //---------------------------------04
                if (data.JA0401 === "Y" && data.JA0402 === "Y" && data.JA0403 === "Y" && data.JA0404 === "Y") {
                } else {
                    if (data.JA0401 === "Y" || data.JA0402 === "Y") {
                        target.push("다문화·탈북민")
                    }
                    if (data.JA0403 === "Y") {
                        target.push("한부모·조손")
                    }
                    if (data.JA0404 === "Y") {
                        target.push("1인가구")
                    }
                }
            })
            Promise.all([promise1, promise2])
            if (deleteIdx.includes(i) === false)
                myConsole.log({
                    name,
                    period,
                    institution,
                    region,
                    gender,
                    age,
                    job,
                    target,
                    salary,
                    disability,
                    scholarship,
                    marriage,
                })
        }
    } catch (err) {
        console.log(err)
    }
}
// supportConditions()
async function supportConditions() {
    try {
        let totalCount
        let page = 1
        let perPage = 1
        let serviceKey =
            "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
        let url = `https://api.odcloud.kr/api/gov24/v1/supportConditions?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`
        await axios.get(url).then((response) => {
            const data = response.data
            console.log(data)
            totalCount = data.totalCount
            console.log(totalCount)
        })

        for (let i = 1; i < totalCount + 1; i++) {
            let page = i
            let perPage = 1
            let serviceKey =
                "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
            let url2 = `https://api.odcloud.kr/api/gov24/v1/supportConditions?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`

            await axios.get(url2).then((response) => {
                const data = response.data.data[0].SVC_ID
                // cleansingData(data)
                // myConsole.log(`'${data}',`)
            })
        }
    } catch (err) {
        console.log(err)
    }
}
// let arr = []

// async function cleansingData(list) {
//     try {
//         const { data } = list

//         for (let i of data) {
//             let name = i.서비스명.replace(/ /gi, "")
//             search = new RegExp(name)
//             // let buseo = i.부서명
//             // let mokjeok = i.서비스목적
//             // let gijun = i.부서명
//             // let Company = i.소관기관명
//             // let date = i.신청기한
//             // let Way = i.신청방법
//             // let naeDragon = i.지원내용
//             // let daesang = i.지원대상
//             // let youhyeong = i.지원유형
//             // arr.push({ buseo, name, mokjeok, gijun, Company, date, Way, naeDragon, daesang, youhyeong })
//             await findData(search)
//         }

//         return arr
//     } catch (err) {
//         console.log(err)
//     }
// }

// async function findData(search) {
//     try {
//         const dataList = await DataList.find({}, { _id: false, name: true })
//         for (let i of dataList) {
//             if (!search.test(i.name.replace(/ /gi, ""))) {
//                 myConsole.log(i)
//             }
//         }
//     } catch (err) {
//         console.log(err)
//     }
// }

// async function newData() {
//     let data = await getData()
//     console.log(data)
// }

// async function detailData(serviceId) {
//     var url = "https://api.odcloud.kr/api/gov24/v1/serviceDetail"
//     var queryParams = "?" + encodeURIComponent("serviceKey") + "=uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu/Ip238w==" /* Service Key*/
//     queryParams += "&" + encodeURIComponent("page") + "=" + encodeURIComponent(`1`) /* */
//     queryParams += "&" + encodeURIComponent("perPage") + "=" + encodeURIComponent(`1`) /* */
//     queryParams += "&" + encodeURIComponent("cond[SVC_ID::EQ]") + "=" + encodeURIComponent(`${serviceId}`) /* */

//     request(
//         {
//             url: url + queryParams,
//             method: "GET",
//         },
//         async function (error, response, body) {
//             const result = await JSON.parse(body)
//             // for (let i of result.data) {
//             //     myConsole.log("서비스명: " + i.서비스명)
//             //     myConsole.log("온라인신청사이트URL: " + i.온라인신청사이트URL)
//             // }
//         }
//     )
// }
