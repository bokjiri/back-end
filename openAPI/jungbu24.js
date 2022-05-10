var request = require("request")
const fs = require("fs")

fs.truncate("./jungbu24.txt", () => {
    console.log("File Content Deleted")
})
const myConsole = new console.Console(fs.createWriteStream("./jungbu24.txt"))
let serviceId
async function newData() {
    for (let i = 1; i < 250; i++) {
        var url = "https://api.odcloud.kr/api/gov24/v1/serviceList"
        var queryParams = "?" + encodeURIComponent("serviceKey") + "=uTElnm5kbsfwT43AGYmytTB7jrlRXGnOiA4TcDiUTquuJSgGcuKAEpYhQ9LdJKVUwqXfC3aOxxHmOdu/Ip238w==" /* Service Key*/
        queryParams += "&" + encodeURIComponent("page") + "=" + encodeURIComponent(`${i}`) /* */
        queryParams += "&" + encodeURIComponent("perPage") + "=" + encodeURIComponent(`30`) /* */

        let serviceId

        request(
            {
                url: url + queryParams,
                method: "GET",
            },
            async function (error, response, body) {
                const result = await JSON.parse(body)
                for (let i of result.data) {
                    // console.log(i)
                    myConsole.log(i)
                    // detailData(serviceId)
                }
            }
        )
    }
}

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
newData()
