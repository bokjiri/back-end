const { findData, checkBookmark } = require("../services/detail.service")
const { checkData } = require("../services/main.service")
exports.getDetail = async (req, res, next) => {
    /*========================================================================================================
    #swagger.tags = ['Detail']
    #swagger.summary = '정책 상세 조회'
    #swagger.description = '정책 하나의 상세 내용을 조회합니다.'
    ========================================================================================================*/
    try {
        const dataId = parseInt(req.params.dataId)
        const { userId } = res.locals

        let data = await findData(dataId)
        if (!data) throw new Error()

        const { mark } = await checkBookmark(userId)
        for (i of mark) {
            if (i === dataId) data.bookmarkState = true
        }
        /*=====================================================================================
        #swagger.responses[200] = {
            description: '정상적으로 값을 받았을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { 
            result: "SUCCESS",
            message: "상세페이지 조회 성공",
            
            }
        }
        =====================================================================================*/
        res.status(200).json({
            result: "SUCCESS",
            message: "상세페이지 조회 성공",
            data,
        })
    } catch (error) {
        console.error(error)
        /*=====================================================================================
        #swagger.responses[400] = {
            description: '정상적으로 값을 받지 못했을 때, 아래 예제와 같은 형태로 응답받습니다.',
            schema: { result: "FAIL", message: "상세페이지 조회 실패" }
        }
        =====================================================================================*/
        return next({
            message: "상세페이지 조회 실패",
            stack: error,
        })
    }
}
