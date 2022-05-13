const { logic } = require("../controllers/main.controller")
const { checkUser, checkData } = require("../services/main.service")
exports.postSearch = async (req, res, next) => {
    try {
        const { searchKey, type } = req.body
        const { userId } = res.locals

        if (!userId | !searchKey | !type) throw new Error()
        const isUser = await checkUser(userId)
        const isData = await checkData(isUser)
        const UserData = await logic(isUser, isData)
        let dataList = []
        dataList.push(...UserData)

        const search = new RegExp(searchKey)
        let searchList = []

        for (let i of dataList) {
            if (type === "전체") {
                if (search.test(i.name) || search.test(i.summary) || search.test(i.desire)) {
                    searchList.push(i)
                }
            }
            if (type === "정책명" && search.test(i.name)) {
                searchList.push(i)
            }
            if (type === "내용" && search.test(i.summary)) {
                searchList.push(i)
            }
            if (type === "정책분야" && search.test(i.desire)) {
                searchList.push(i)
            }
        }

        if (!searchList.length) return res.status(400).json({ message: "정책 키워드를 확인해 주세요" })

        res.status(200).json({ searchList })
    } catch (err) {
        return next({
            message: "정책 검색이 실패하였습니다.",
            stack: err,
        })
    }
}
