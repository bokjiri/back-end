const { checkUserData, checkUserId, checkBokjiApi } = require("../services/main.service")
exports.searchService = async (userId, searchKey, type) => {
    try {
        const isUser = await checkUserId(userId)
        const allData = await checkBokjiApi()

        let isData = []
        allData.forEach((data) => {
            if (data.lifeCycle[0] !== undefined || data.target[0] !== undefined || data.obstacle[0] !== undefined) {
                isData.push(data)
            }
        })
        let checkedData = await checkUserData(isUser, isData)

        let work = []
        let houseLife = []
        let health = []
        let eduCare = []
        let safetyRight = []
        let etc = []
        checkedData.forEach((data) => {
            if (data.desire === "일자리") {
                work.push(data)
            }
            if (data.desire === "주거 및 일상생활") {
                houseLife.push(data)
            }
            if (data.desire === "건강") {
                health.push(data)
            }
            if (data.desire === "교육 및 돌봄") {
                eduCare.push(data)
            }
            if (data.desire === "안전 및 권익보장") {
                safetyRight.push(data)
            }
            if (data.desire === "기타") {
                etc.push(data)
            }
        })
        let dataList = []
        dataList.push(...checkedData)

        const search = new RegExp(searchKey)
        let searchList = []
        for (let i of dataList) {
            if (type === "전체") {
                if (search.test(i.name) || search.test(i.summary) || search.test(i.support)) {
                    searchList.push(i)
                }
            } else if (type === "이름" && search.test(i.name)) {
                searchList.push(i)
            } else if (type === "내용" && search.test(i.summary)) {
                searchList.push(i)
            } else if (type === "대상" && search.test(i.support)) {
                searchList.push(i)
            }
        }
        return { searchList }
    } catch (err) {
        console.log(err)
    }
}
