const { logic } = require("../../main/controllers/main.controller")
const { checkUser, checkData } = require("../../main/services/main.service")
exports.postSearch = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Search']
    #swagger.summary = '데이터 검색'
    #swagger.description = '데이터를 searchKey로 검색한다.'
    ========================================================================================================*/
    try {
        const { searchKey, type } = req.body
        const { userId } = res.locals

        if (!userId | !searchKey | !type) throw new Error()
        const isUser = await checkUser(userId)
        const isData = await checkData(isUser)
        const UserData = await logic(isUser, isData)
        let dataList = []
        dataList.push(...UserData)
        let searchList = []

        if (/[`~!@#$%^&*|()_\\\'\";:+\/=?]/.test(searchKey)) {
            return res.status(200).json({ message: "특문-공백" })
        }

        const search = new RegExp(searchKey)

        for (let i of dataList) {
            if (type === "통합검색") {
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

        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "정책 키워드를 확인해 주세요" }
        }
        =====================================================================================*/
        if (!searchList.length) return res.status(200).json({ message: "정책 키워드를 확인해 주세요" })
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { searchList }
        }
        =====================================================================================*/
        res.status(200).json({ searchList })
    } catch (err) {
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "정책 검색 실패" }
        }
        =====================================================================================*/
        return next({
            message: "정책 검색 실패",
            stack: err,
        })
    }
}
