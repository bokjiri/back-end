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
        let serviceKey = "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
        let url = `https://api.odcloud.kr/api/gov24/v1/serviceList?page=${page}&perPage=${perPage}&serviceKey=${serviceKey}`
        await axios.get(url).then((response) => {
            const data = response.data
            totalCount = data.totalCount
            console.log(totalCount)
        })

        for (let i = 1; i < totalCount + 1; i++) {
            let page = i
            let perPage = 1
            let serviceKey = "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
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
            const serviceKey = "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
            let url2 = `https://api.odcloud.kr/api/gov24/v1/serviceDetail?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${supportCode[i]}&serviceKey=${serviceKey}`
            let name
            let institution
            let region
            let age = []
            let gender
            const promise2 = await axios.get(url2).then((response) => {
                const [data] = response.data.data
                name = data.서비스명
                serviceId = data.서비스ID
                const rawCompany = data.소관기관명
                console.log(rawCompany)
                const company = rawCompany.split(" ")
                console.log(company)
                if (company.length !== 2) {
                    institution = company
                } else {
                    region = company
                }
            })
            let supportUrl = `https://api.odcloud.kr/api/gov24/v1/supportConditions?page=1&perPage=1&cond%5BSVC_ID%3A%3AEQ%5D=${supportCode[i]}&serviceKey=${serviceKey}`
            const promise1 = await axios.get(supportUrl).then((response) => {
                const [data] = response.data.data
                age[0] = data.JA0110
                age[1] = data.JA0111
                if (data.JA0101 === "Y" && data.JA0102 === "Y") {
                    gender = undefined
                } else if (data.JA0101 === "Y") {
                    gender = "남성"
                } else if (data.JA0102 === "Y") {
                    gender = "여성"
                }
            })
            Promise.all([promise1, promise2])
            myConsole.log({ name, institution, region, gender, age })
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
        let serviceKey = "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
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
            let serviceKey = "uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu%2FIp238w%3D%3D"
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
