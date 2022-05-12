const { checkUser, checkData } = require("../services/main.service")
const { logic } = require("../controllers/main.controller")
exports.searchService = async (userId, searchKey, type) => {
    try {
        if (!userId | !searchKey | !type) throw new Error()
        const isUser = await checkUser(userId)
        const isData = await checkData()
        const UserData = await logic(isUser, isData)
        let dataList = []

        dataList.push(...UserData)
        const search = new RegExp(searchKey, "g")

        let searchList = []

        for (let i of dataList) {
            if (type === "전체") {
                if (search.test(i.name) || search.test(i.summary) || search.test(i.desire)) {
                    console.log("전체")
                    searchList.push(i)
                }
            } else if (type === "정책명" && search.test(i.name)) {
                searchList.push(i)
            } else if (type === "내용" && search.test(i.summary)) {
                searchList.push(i)
            } else if (type === "정책분야" && search.test(i.desire)) {
                searchList.push(i)
            }
        }
        return { searchList }
    } catch (err) {
        console.log(err)
    }
}
